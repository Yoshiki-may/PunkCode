// KPI計算ロジック（Direction KPI & Sales KPI）
// QAパネルの設定（定義A/B、期限基準、集計期間）に従って動的計算

import { getAllTasks, getAllApprovals, ClientTask, Approval } from './clientData';
import { getAllContracts, Contract } from './contractData';
import { getQAConfig } from './qaConfig';
import { normalizeTasks, normalizeApprovals } from './dataMigration';

// ========================
// Direction KPI
// ========================

export interface DirectionKPIResult {
  onTimeRate: number;          // 納期遵守率（%）
  rejectionRate: number;       // 差し戻し率（%）
  averageLeadTime: number;     // 平均リードタイム（日）
  onTimeRateChange: number;    // 前期間比（%）
  rejectionRateChange: number; // 前期間比（%）
  leadTimeChange: number;      // 前期間比（%）
}

// 期間フィルタ用のヘルパー
const getPeriodRange = (
  period: 'currentMonth' | 'last30Days' | 'last7Days',
  offset: number = 0 // 0=今期間、1=前期間
): { start: Date; end: Date } => {
  const now = new Date();
  
  if (period === 'currentMonth') {
    const year = now.getFullYear();
    const month = now.getMonth() - offset;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { start, end };
  } else if (period === 'last30Days') {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    end.setDate(end.getDate() - (30 * offset));
    const start = new Date(end);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  } else { // last7Days
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    end.setDate(end.getDate() - (7 * offset));
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
};

// タスクを期間でフィルタ
const filterTasksByPeriod = (
  tasks: ClientTask[],
  periodBase: 'createdAt' | 'dueDate',
  period: 'currentMonth' | 'last30Days' | 'last7Days',
  offset: number = 0
): ClientTask[] => {
  const { start, end } = getPeriodRange(period, offset);
  
  return tasks.filter(task => {
    const dateStr = periodBase === 'createdAt' ? task.createdAt : task.dueDate;
    if (!dateStr) return false;
    
    const date = new Date(dateStr);
    return date >= start && date <= end;
  });
};

// 承認を期間でフィルタ（createdAt基準）
const filterApprovalsByPeriod = (
  approvals: Approval[],
  period: 'currentMonth' | 'last30Days' | 'last7Days',
  offset: number = 0
): Approval[] => {
  const { start, end } = getPeriodRange(period, offset);
  
  return approvals.filter(approval => {
    if (!approval.createdAt) return false;
    const date = new Date(approval.createdAt);
    return date >= start && date <= end;
  });
};

// 納期遵守率を計算
const calculateOnTimeRate = (
  tasks: ClientTask[],
  definition: 'A' | 'B',
  deadlineBase: 'dueDate' | 'postDate'
): number => {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  // 期限内完了タスクを判定
  const onTimeTasks = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    
    const completedDate = new Date(task.completedAt);
    
    // 期限基準に応じて判定
    if (deadlineBase === 'dueDate') {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return completedDate <= dueDate;
    } else { // postDate
      if (!task.postDate) return false;
      const postDate = new Date(task.postDate);
      return completedDate <= postDate;
    }
  });
  
  const onTimeCount = onTimeTasks.length;
  
  // 定義A: onTimeCompleted / completed
  if (definition === 'A') {
    if (completedTasks.length === 0) return 0;
    return (onTimeCount / completedTasks.length) * 100;
  }
  
  // 定義B: onTimeCompleted / totalTasks
  if (tasks.length === 0) return 0;
  return (onTimeCount / tasks.length) * 100;
};

// 差し戻し率を計算
const calculateRejectionRate = (
  approvals: Approval[],
  definition: 'A' | 'B'
): number => {
  const rejectedApprovals = approvals.filter(a => a.status === 'rejected');
  const approvedApprovals = approvals.filter(a => a.status === 'approved');
  const rejectedCount = rejectedApprovals.length;
  
  // 定義A: rejected / (approved + rejected)
  if (definition === 'A') {
    const total = approvedApprovals.length + rejectedCount;
    if (total === 0) return 0;
    return (rejectedCount / total) * 100;
  }
  
  // 定義B: rejected / totalApprovals
  if (approvals.length === 0) return 0;
  return (rejectedCount / approvals.length) * 100;
};

// 平均リードタイムを計算
const calculateAverageLeadTime = (
  tasks: ClientTask[],
  definition: 'A' | 'B'
): number => {
  // 定義A: 平均(completedAt - createdAt)（completedのみ）
  if (definition === 'A') {
    const completedTasks = tasks.filter(t => 
      t.status === 'completed' && t.completedAt && t.createdAt
    );
    
    if (completedTasks.length === 0) return 0;
    
    const totalDays = completedTasks.reduce((sum, task) => {
      const completed = new Date(task.completedAt!);
      const created = new Date(task.createdAt!);
      const days = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    
    return totalDays / completedTasks.length;
  }
  
  // 定義B: 平均(postDate - createdAt)（postDateがあるもののみ）
  const tasksWithPostDate = tasks.filter(t => t.postDate && t.createdAt);
  
  if (tasksWithPostDate.length === 0) return 0;
  
  const totalDays = tasksWithPostDate.reduce((sum, task) => {
    const post = new Date(task.postDate!);
    const created = new Date(task.createdAt!);
    const days = (post.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);
  
  return totalDays / tasksWithPostDate.length;
};

// Direction KPI全体を計算（クライアントIDでフィルタ可能）
export const calculateDirectionKPI = (clientId?: string): DirectionKPIResult => {
  try {
    const config = getQAConfig();
    const rawTasks = getAllTasks();
    const rawApprovals = getAllApprovals();
    
    // 正規化（createdAt/updatedAt/completedAtの補完）
    let tasks = normalizeTasks(rawTasks);
    let approvals = normalizeApprovals(rawApprovals);
    
    // クライアントでフィルタ
    if (clientId) {
      tasks = tasks.filter(t => t.clientId === clientId);
      approvals = approvals.filter(a => a.clientId === clientId);
    }
    
    // 今期間のタスク/承認
    const currentTasks = filterTasksByPeriod(
      tasks,
      config.kpiPeriodBase,
      config.aggregationPeriod,
      0
    );
    const currentApprovals = filterApprovalsByPeriod(
      approvals,
      config.aggregationPeriod,
      0
    );
    
    // 前期間のタスク/承認
    const previousTasks = filterTasksByPeriod(
      tasks,
      config.kpiPeriodBase,
      config.aggregationPeriod,
      1
    );
    const previousApprovals = filterApprovalsByPeriod(
      approvals,
      config.aggregationPeriod,
      1
    );
    
    // 今期間のKPI
    const onTimeRate = calculateOnTimeRate(currentTasks, config.kpiDefinition, config.deadlineBase);
    const rejectionRate = calculateRejectionRate(currentApprovals, config.kpiDefinition);
    const averageLeadTime = calculateAverageLeadTime(currentTasks, config.kpiDefinition);
    
    // 前期間のKPI
    const prevOnTimeRate = calculateOnTimeRate(previousTasks, config.kpiDefinition, config.deadlineBase);
    const prevRejectionRate = calculateRejectionRate(previousApprovals, config.kpiDefinition);
    const prevLeadTime = calculateAverageLeadTime(previousTasks, config.kpiDefinition);
    
    // 前期間比を計算（%）
    const onTimeRateChange = prevOnTimeRate > 0 
      ? ((onTimeRate - prevOnTimeRate) / prevOnTimeRate) * 100 
      : 0;
    const rejectionRateChange = prevRejectionRate > 0 
      ? ((rejectionRate - prevRejectionRate) / prevRejectionRate) * 100 
      : 0;
    const leadTimeChange = prevLeadTime > 0 
      ? ((averageLeadTime - prevLeadTime) / prevLeadTime) * 100 
      : 0;
    
    return {
      onTimeRate,
      rejectionRate,
      averageLeadTime,
      onTimeRateChange,
      rejectionRateChange,
      leadTimeChange
    };
  } catch (error) {
    console.error('[KPI Calculator] Direction KPI calculation error:', error);
    // エラー時はデフォルト値を返す
    return {
      onTimeRate: 0,
      rejectionRate: 0,
      averageLeadTime: 0,
      onTimeRateChange: 0,
      rejectionRateChange: 0,
      leadTimeChange: 0
    };
  }
};

// ========================
// Sales KPI
// ========================

export interface SalesKPIResult {
  monthlyRevenue: number;         // 今月の受注金額（¥）
  monthlyDeals: number;           // 今月の受注件数
  monthlyProposals: number;       // 今月の提案件数
  conversionRate: number;         // 受注率（%）
  revenueChange: number;          // 前月比（%）
  dealsChange: number;            // 前月比（%）
  proposalsChange: number;        // 前月比（%）
  conversionRateChange: number;   // 前月比（%）
}

// 契約を月でフィルタ（startDate基準 for active、createdAt基準 for negotiating）
const filterContractsByMonth = (
  contracts: Contract[],
  status: 'active' | 'negotiating',
  offset: number = 0 // 0=今月、1=前月
): Contract[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() - offset;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  return contracts.filter(contract => {
    if (contract.status !== status) return false;
    
    // active: startDate基準
    if (status === 'active') {
      if (!contract.startDate) return false;
      const date = new Date(contract.startDate);
      return date >= start && date <= end;
    }
    
    // negotiating: createdAt基準
    if (!contract.createdAt) return false;
    const date = new Date(contract.createdAt);
    return date >= start && date <= end;
  });
};

// Sales KPI全体を計算（クライアントIDでフィルタ可能）
export const calculateSalesKPI = (clientId?: string): SalesKPIResult => {
  try {
    let contracts = getAllContracts();
    
    // クライアントでフィルタ
    if (clientId) {
      contracts = contracts.filter(c => c.clientId === clientId);
    }
    
    // 今月の契約
    const currentActiveContracts = filterContractsByMonth(contracts, 'active', 0);
    const currentNegotiatingContracts = filterContractsByMonth(contracts, 'negotiating', 0);
    
    // 前月の契約
    const previousActiveContracts = filterContractsByMonth(contracts, 'active', 1);
    const previousNegotiatingContracts = filterContractsByMonth(contracts, 'negotiating', 1);
    
    // 今月のKPI
    const monthlyRevenue = currentActiveContracts.reduce((sum, c) => sum + c.monthlyFee, 0);
    const monthlyDeals = currentActiveContracts.length;
    const monthlyProposals = currentNegotiatingContracts.length;
    const totalCurrentContracts = monthlyDeals + monthlyProposals;
    const conversionRate = totalCurrentContracts > 0 
      ? (monthlyDeals / totalCurrentContracts) * 100 
      : 0;
    
    // 前月のKPI
    const prevRevenue = previousActiveContracts.reduce((sum, c) => sum + c.monthlyFee, 0);
    const prevDeals = previousActiveContracts.length;
    const prevProposals = previousNegotiatingContracts.length;
    const totalPrevContracts = prevDeals + prevProposals;
    const prevConversionRate = totalPrevContracts > 0 
      ? (prevDeals / totalPrevContracts) * 100 
      : 0;
    
    // 前月比を計算（%）
    const revenueChange = prevRevenue > 0 
      ? ((monthlyRevenue - prevRevenue) / prevRevenue) * 100 
      : 0;
    const dealsChange = prevDeals > 0 
      ? ((monthlyDeals - prevDeals) / prevDeals) * 100 
      : 0;
    const proposalsChange = prevProposals > 0 
      ? ((monthlyProposals - prevProposals) / prevProposals) * 100 
      : 0;
    const conversionRateChange = prevConversionRate > 0 
      ? ((conversionRate - prevConversionRate) / prevConversionRate) * 100 
      : 0;
    
    return {
      monthlyRevenue,
      monthlyDeals,
      monthlyProposals,
      conversionRate,
      revenueChange,
      dealsChange,
      proposalsChange,
      conversionRateChange
    };
  } catch (error) {
    console.error('[KPI Calculator] Sales KPI calculation error:', error);
    // エラー時はデフォルト値を返す
    return {
      monthlyRevenue: 0,
      monthlyDeals: 0,
      monthlyProposals: 0,
      conversionRate: 0,
      revenueChange: 0,
      dealsChange: 0,
      proposalsChange: 0,
      conversionRateChange: 0
    };
  }
};