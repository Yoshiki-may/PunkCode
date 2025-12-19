import { Clock, RotateCcw, Flame, MessageSquareOff } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface Alert {
  id: string;
  type: 'pending-approval' | 'rejected' | 'urgent' | 'no-reply';
  title: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
  icon: typeof Clock;
}

export function DirectionAlerts() {
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'pending-approval',
      title: '承認待ち',
      count: 5,
      severity: 'warning',
      icon: Clock,
    },
    {
      id: '2',
      type: 'rejected',
      title: '差し戻し',
      count: 3,
      severity: 'critical',
      icon: RotateCcw,
    },
    {
      id: '3',
      type: 'urgent',
      title: '炎上',
      count: 2,
      severity: 'critical',
      icon: Flame,
    },
    {
      id: '4',
      type: 'no-reply',
      title: '未返信',
      count: 4,
      severity: 'warning',
      icon: MessageSquareOff,
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
        return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'warning':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'info':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827]">Alerts</h3>
          <span className="text-xs text-[#7B8794]">重大順</span>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F5F7] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-sm text-[#111827]">{alert.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.count}件
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedAlert && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedAlert.id,
            title: `${selectedAlert.title}の案件一覧`,
            clientName: '複数のクライアント',
            status: selectedAlert.severity === 'critical' ? '緊急' : '警告',
            deadline: '2024/12/14',
            assignee: 'ディレクションチーム',
            type: selectedAlert.title,
            priority: selectedAlert.severity === 'critical' ? 'high' : 'medium',
            description: `${selectedAlert.title}の案件が${selectedAlert.count}件あります。`,
            kpi: [
              { label: '対象件数', value: `${selectedAlert.count}件` },
              { label: '最古の案件', value: '5日前' },
            ],
          }}
        />
      )}
    </>
  );
}
