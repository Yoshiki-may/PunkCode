// Contract データモデル
// contractRenewal判定とSales KPIの基盤
// Phase 9.3: Write系のみRepository経由（Read系は同期互換のため現状維持） + outbox統合

import { storage, STORAGE_KEYS } from './storage';
import { getContractRepository } from '../repositories';
import { getCurrentAuthUser } from './auth';
import { getCurrentDataMode } from './supabase';
import { addOutboxItem, updateOutboxItem } from './outbox';

export interface Contract {
  id: string;
  clientId: string;
  status: 'negotiating' | 'active' | 'paused' | 'expired';
  monthlyFee: number;        // 月額料金（円）
  startDate: string;         // 契約開始日（ISO 8601）
  endDate?: string;          // 契約終了日（ISO 8601、オプション）
  renewalDate?: string;      // 更新期限日（ISO 8601、オプション）
  createdAt: string;         // 作成日時
  updatedAt: string;         // 更新日時
  // Phase 9.3: Supabase用メタデータ
  org_id?: string;
  client_id?: string;
}

// 全契約取得
export const getAllContracts = (): Contract[] => {
  return storage.get<Contract[]>(STORAGE_KEYS.CONTRACTS) || [];
};

// アクティブ契約のみ取得
export const getActiveContracts = (): Contract[] => {
  return getAllContracts().filter(c => c.status === 'active');
};

// クライアント別契約取得
export const getClientContract = (clientId: string): Contract | undefined => {
  const allContracts = getAllContracts();
  return allContracts.find(c => c.clientId === clientId);
};

// ステータス別契約取得
export const getContractsByStatus = (status: Contract['status']): Contract[] => {
  return getAllContracts().filter(c => c.status === status);
};

// 契約追加（Repository経由 + outbox統合）
export const addContract = (
  contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  }
): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getContractRepository();
    const authUser = getCurrentAuthUser();
    
    const contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: contract.clientId,
      status: contract.status,
      monthlyFee: contract.monthlyFee,
      startDate: contract.startDate,
      endDate: contract.endDate,
      renewalDate: contract.renewalDate,
      // Phase 9.3: Supabase用メタデータ自動補完
      org_id: authUser?.org_id,
      client_id: contract.clientId
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('contract.create', {
        clientId: contractData.clientId,
        status: contractData.status,
        monthlyFee: contractData.monthlyFee,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        renewalDate: contractData.renewalDate
      });
    }
    
    // Repository経由で作成（非同期だが、fire-and-forgetで互換性維持）
    repo.createContract(contractData)
      .then(created => {
        console.log('[contractData] Contract created via repository:', created.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allContracts = getAllContracts();
        const newContract: Contract = {
          ...created,
          id: contract.id || created.id, // 既存IDがあれば優先（seed用）
          createdAt: contract.createdAt || created.createdAt,
          updatedAt: contract.updatedAt || created.updatedAt
        };
        
        // 重複チェック
        const exists = allContracts.some(c => c.id === newContract.id);
        if (!exists) {
          allContracts.push(newContract);
          storage.set(STORAGE_KEYS.CONTRACTS, allContracts);
        }
      })
      .catch(error => {
        console.error('[contractData] Failed to create contract via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[contractData] PERMANENT FAILURE: Contract creation blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const allContracts = getAllContracts();
        const now = new Date().toISOString();
        const newContract: Contract = {
          id: contract.id || `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clientId: contract.clientId,
          status: contract.status,
          monthlyFee: contract.monthlyFee,
          startDate: contract.startDate,
          endDate: contract.endDate,
          renewalDate: contract.renewalDate,
          createdAt: contract.createdAt || now,
          updatedAt: contract.updatedAt || now,
          org_id: authUser?.org_id,
          client_id: contract.clientId
        };
        allContracts.push(newContract);
        storage.set(STORAGE_KEYS.CONTRACTS, allContracts);
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to add contract:', error);
    return false;
  }
};

// 契約更新（Repository経由 + outbox統合）
export const updateContract = (
  contractId: string,
  updates: Partial<Omit<Contract, 'id' | 'createdAt'>>
): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getContractRepository();
    
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('contract.update', {
        id: contractId,
        updates: updatesWithTimestamp
      });
    }
    
    // Repository経由で更新（非同期だが、fire-and-forgetで互換性維持）
    repo.updateContract(contractId, updatesWithTimestamp)
      .then(updated => {
        console.log('[contractData] Contract updated via repository:', updated.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allContracts = getAllContracts();
        const index = allContracts.findIndex(c => c.id === contractId);
        
        if (index !== -1) {
          allContracts[index] = {
            ...allContracts[index],
            ...updated
          };
          storage.set(STORAGE_KEYS.CONTRACTS, allContracts);
        }
      })
      .catch(error => {
        console.error('[contractData] Failed to update contract via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[contractData] PERMANENT FAILURE: Contract update blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const allContracts = getAllContracts();
        const index = allContracts.findIndex(c => c.id === contractId);
        
        if (index !== -1) {
          allContracts[index] = {
            ...allContracts[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          storage.set(STORAGE_KEYS.CONTRACTS, allContracts);
        }
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to update contract:', error);
    return false;
  }
};

// 全契約削除
export const clearAllContracts = (): boolean => {
  return storage.set(STORAGE_KEYS.CONTRACTS, []);
};

// Seed投入（初回のみ）
export const seedContractsIfEmpty = (): void => {
  const existingContracts = getAllContracts();
  if (existingContracts.length > 0) {
    return; // 既にデータがある場合はスキップ
  }
  
  const now = new Date();
  
  // 6クライアント分のシードデータ
  // client-1: アクティブ、更新期限7日後（テスト用）
  addContract({
    clientId: 'client-1',
    status: 'active',
    monthlyFee: 500000,
    startDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180日前開始
    renewalDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),  // 7日後更新
    createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  // client-2: アクティブ、更新期限14日後（デフォルト閾値30日以内）
  addContract({
    clientId: 'client-2',
    status: 'active',
    monthlyFee: 400000,
    startDate: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString(), // 150日前開始
    renewalDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14日後更新
    createdAt: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  // client-3: アクティブ、更新期限45日後（デフォルト閾値30日を超過、対象外）
  addContract({
    clientId: 'client-3',
    status: 'active',
    monthlyFee: 350000,
    startDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120日前開始
    renewalDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45日後更新（対象外）
    createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  // client-4: 交渉中（更新期限なし）
  addContract({
    clientId: 'client-4',
    status: 'negotiating',
    monthlyFee: 300000,
    startDate: new Date(now.getTime()).toISOString(), // 今日開始予定
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30日前に作成
  });
  
  // client-5: 交渉中（更新期限なし）
  addContract({
    clientId: 'client-5',
    status: 'negotiating',
    monthlyFee: 250000,
    startDate: new Date(now.getTime()).toISOString(), // 今日開始予定
    createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString() // 20日前に作成
  });
  
  // client-6: アクティブ、更新期限2日後（緊急）
  addContract({
    clientId: 'client-6',
    status: 'active',
    monthlyFee: 450000,
    startDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 365日前開始
    renewalDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),  // 2日後更新（緊急）
    createdAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  console.log('✅ Contracts seeded successfully');
};

// 更新期限が近い契約を取得（contractRenewal判定用）
export const getUpcomingRenewalContracts = (renewalDays: number): Contract[] => {
  const now = new Date();
  const threshold = new Date(now.getTime() + renewalDays * 24 * 60 * 60 * 1000);
  
  return getActiveContracts().filter(contract => {
    // renewalDate または endDate を使用
    const renewalDateStr = contract.renewalDate || contract.endDate;
    if (!renewalDateStr) return false;
    
    const renewalDate = new Date(renewalDateStr);
    
    // 更新期限が now 以降で、threshold 以内
    return renewalDate >= now && renewalDate <= threshold;
  });
};

// 月別の契約取得（KPI計算用）
export const getContractsByMonth = (year: number, month: number): Contract[] => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  
  return getAllContracts().filter(contract => {
    const startDate = new Date(contract.startDate);
    return startDate >= startOfMonth && startDate <= endOfMonth;
  });
};

// 月別の受注金額計算（KPI用）
export const calculateMonthlyRevenue = (year: number, month: number): number => {
  const monthlyContracts = getContractsByMonth(year, month).filter(
    c => c.status === 'active'
  );
  return monthlyContracts.reduce((sum, c) => sum + c.monthlyFee, 0);
};

// 月別の受注件数計算（KPI用）
export const calculateMonthlyDeals = (year: number, month: number): number => {
  return getContractsByMonth(year, month).filter(c => c.status === 'active').length;
};