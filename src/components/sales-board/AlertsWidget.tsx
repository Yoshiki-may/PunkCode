import { AlertTriangle, Clock, MessageSquareOff, FileX, FileCheck, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

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
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'overdue',
      title: '期限切れ',
      subtitle: 'タスク期限超過',
      count: 3,
      severity: 'critical',
      icon: AlertTriangle,
    },
    {
      id: '2',
      type: 'no-reply',
      title: '未返信',
      subtitle: '5日以上未返信',
      count: 7,
      severity: 'warning',
      icon: MessageSquareOff,
    },
    {
      id: '3',
      type: 'stagnant',
      title: '停滞',
      subtitle: 'ステージ滞留10日超',
      count: 5,
      severity: 'warning',
      icon: Clock,
    },
    {
      id: '4',
      type: 'pending-approval',
      title: '要承認',
      subtitle: '承認待ち案件',
      count: 2,
      severity: 'info',
      icon: FileCheck,
    },
    {
      id: '5',
      type: 'contract-renewal',
      title: '契約更新期限',
      subtitle: '30日以内に更新',
      count: 4,
      severity: 'warning',
      icon: FileX,
    },
  ]);

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