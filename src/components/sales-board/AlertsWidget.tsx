import { AlertTriangle, Clock, MessageSquareOff, FileX, FileCheck, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DetailDrawer } from '../DetailDrawer';
import { getAllTasks, getAllApprovals } from '../../utils/clientData';
import { normalizeTasks } from '../../utils/dataMigration';
import { getStagnantThreshold, getNoReplyThreshold, getRenewalThreshold } from '../../utils/qaConfig';
import { getNoReplyClients } from '../../utils/commentData';
import { getUpcomingRenewalContracts } from '../../utils/contractData';

interface Alert {
  id: string;
  type: 'overdue' | 'no-reply' | 'stagnant' | 'pending-approval' | 'contract-renewal';
  title: string;
  subtitle: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
  icon: typeof AlertTriangle;
}

interface AlertsWidgetProps {
  onViewAllClick?: () => void;
}

export function AlertsWidget({ onViewAllClick }: AlertsWidgetProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // アラートを動的に計算
  useEffect(() => {
    calculateAlerts();
    
    // 5秒ごとに再計算（タスク追加/更新の反映）
    const interval = setInterval(calculateAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateAlerts = () => {
    const rawTasks = getAllTasks();
    const approvals = getAllApprovals();
    const now = new Date();
    
    // タスクを正規化（updatedAt/lastActivityAtがない場合に補完）
    const tasks = normalizeTasks(rawTasks);
    
    // 閾値を取得（QAパネルで設定可能）
    const stagnantThreshold = getStagnantThreshold();
    const noReplyThreshold = getNoReplyThreshold();
    const renewalThreshold = getRenewalThreshold();
    
    // 期限切れタスクをカウント
    const overdueTasks = tasks.filter(task => {
      if (task.dueDate || task.postDate) {
        const dueDate = new Date(task.dueDate || task.postDate);
        return dueDate < now && task.status !== 'completed';
      }
      return false;
    });
    
    // 停滞タスクをカウント（QAパネルで設定した日数以上更新なし）
    const stagnantTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      
      const lastActivity = task.lastActivityAt || task.updatedAt;
      if (!lastActivity) return false;
      
      const lastActivityDate = new Date(lastActivity);
      const daysSinceActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysSinceActivity >= stagnantThreshold;
    });
    
    // 未返信をカウント
    // 判定ルール:
    // 1) クライアントごとにコメントを時系列で取得
    // 2) 最後のコメントが isFromClient=true
    // 3) そこから noReplyThreshold 日以上経過
    // 4) 以後にチーム側返信（isFromClient=false）が無い
    const noReplyClientIds = getNoReplyClients(noReplyThreshold);
    const noReplyCount = noReplyClientIds.length;
    
    // 承認待ちをカウント
    const pendingApprovals = approvals.filter(a => a.status === 'pending');
    
    // 契約更新期限（renewalThreshold日以内）
    // 判定ルール:
    // 1) status='active' の契約
    // 2) renewalDate（なければendDate）が存在
    // 3) renewalDate が now 以降、now + renewalThreshold 日以内
    const upcomingRenewals = getUpcomingRenewalContracts(renewalThreshold);
    const contractRenewalCount = upcomingRenewals.length;
    
    const calculatedAlerts: Alert[] = [
      {
        id: '1',
        type: 'overdue',
        title: '期限切れ',
        subtitle: 'タスク期限超過',
        count: overdueTasks.length,
        severity: overdueTasks.length > 0 ? 'critical' : 'info',
        icon: AlertTriangle,
      },
      {
        id: '2',
        type: 'no-reply',
        title: '未返信',
        subtitle: `${noReplyThreshold}日以上未返信`,
        count: noReplyCount,
        severity: noReplyCount > 0 ? 'warning' : 'info',
        icon: MessageSquareOff,
      },
      {
        id: '3',
        type: 'stagnant',
        title: '停滞',
        subtitle: `${stagnantThreshold}日以上更新なし`,
        count: stagnantTasks.length,
        severity: stagnantTasks.length > 0 ? 'warning' : 'info',
        icon: Clock,
      },
      {
        id: '4',
        type: 'pending-approval',
        title: '要承認',
        subtitle: '承認待ち案件',
        count: pendingApprovals.length,
        severity: pendingApprovals.length > 0 ? 'info' : 'info',
        icon: FileCheck,
      },
      {
        id: '5',
        type: 'contract-renewal',
        title: '契約更新期限',
        subtitle: `${renewalThreshold}日以内に更新`,
        count: contractRenewalCount,
        severity: contractRenewalCount > 0 ? 'warning' : 'info',
        icon: FileX,
      },
    ];
    
    setAlerts(calculatedAlerts);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600';
      case 'info':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-card-foreground">Alerts</h3>
          <span className="text-xs text-muted-foreground">重大順</span>
        </div>

        <div className="space-y-2 flex-1">
          {alerts.slice(0, 3).map((alert) => {
            const Icon = alert.icon;
            return (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-card-foreground">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">{alert.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.count}件
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA Button to Inbox/Alerts */}
        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all group"
          >
            <span className="text-sm font-medium">該当一覧へ</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        )}
      </div>

      {selectedAlert && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedAlert.id,
            title: `${selectedAlert.title}の案件一覧`,
            clientName: '複数のクライアント',
            status: selectedAlert.severity === 'critical' ? '期限切れ' : selectedAlert.severity === 'warning' ? '警告' : '情報',
            deadline: '2024/12/14',
            assignee: '営業チーム',
            type: selectedAlert.title,
            priority: selectedAlert.severity === 'critical' ? 'high' : selectedAlert.severity === 'warning' ? 'medium' : 'low',
            description: `${selectedAlert.title}の案件が${selectedAlert.count}件あります。早急な対応が必要です。`,
            kpi: [
              { label: '対象件数', value: `${selectedAlert.count}件` },
              { label: '最古の案件', value: '7日前' },
            ],
          }}
        />
      )}
    </>
  );
}