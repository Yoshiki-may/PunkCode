import { Bell, Mail, Smartphone, MessageSquare, CheckSquare, Users, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';

interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  email: boolean;
  desktop: boolean;
  mobile: boolean;
}

interface NotificationSettings {
  frequency: string;
  notifications: NotificationToggle[];
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export function NotificationSettings() {
  const [frequency, setFrequency] = useState('realtime');
  const [isSaving, setIsSaving] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
  });
  
  const [notifications, setNotifications] = useState<NotificationToggle[]>([
    {
      id: 'tasks',
      label: 'タスク',
      description: '新しいタスクの割り当てや期限の通知',
      email: true,
      desktop: true,
      mobile: true,
    },
    {
      id: 'messages',
      label: 'メッセージ',
      description: '新しいメッセージやメンション',
      email: true,
      desktop: true,
      mobile: true,
    },
    {
      id: 'approvals',
      label: '承認依頼',
      description: 'コンテンツの承認依頼と承認結果',
      email: true,
      desktop: true,
      mobile: false,
    },
    {
      id: 'projects',
      label: 'プロジェクト',
      description: 'プロジェクトのステータス変更',
      email: true,
      desktop: false,
      mobile: false,
    },
    {
      id: 'team',
      label: 'チーム',
      description: 'チームメンバーの追加や削除',
      email: true,
      desktop: false,
      mobile: false,
    },
    {
      id: 'system',
      label: 'システム',
      description: 'システムのアップデートやメンテナンス',
      email: true,
      desktop: true,
      mobile: false,
    },
  ]);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = storage.get<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    if (savedSettings) {
      setFrequency(savedSettings.frequency || 'realtime');
      setNotifications(savedSettings.notifications || notifications);
      setDoNotDisturb(savedSettings.doNotDisturb || doNotDisturb);
    }
  }, []);

  const toggleNotification = (id: string, type: 'email' | 'desktop' | 'mobile') => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, [type]: !notif[type] } : notif
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
        frequency,
        notifications,
        doNotDisturb,
      });
      
      toast.success('通知設定を保存しました');
    } catch (error) {
      toast.error('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const savedSettings = storage.get<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    if (savedSettings) {
      setFrequency(savedSettings.frequency || 'realtime');
      setNotifications(savedSettings.notifications || notifications);
      setDoNotDisturb(savedSettings.doNotDisturb || doNotDisturb);
    }
    toast.info('変更を破棄しました');
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl mb-2">通知設定</h1>
          <p className="text-muted-foreground text-sm">通知の受信方法を管理</p>
        </div>

        {/* Notification Frequency */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">通知の頻度</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
              <input
                type="radio"
                name="frequency"
                value="realtime"
                checked={frequency === 'realtime'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="text-sm text-card-foreground">リアルタイム</div>
                <div className="text-xs text-muted-foreground">イベント発生時に即座に通知</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
              <input
                type="radio"
                name="frequency"
                value="hourly"
                checked={frequency === 'hourly'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="text-sm text-card-foreground">1時間ごとにまとめて</div>
                <div className="text-xs text-muted-foreground">1時間分の通知をまとめて受信</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequency === 'daily'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="text-sm text-card-foreground">日次サマリー</div>
                <div className="text-xs text-muted-foreground">1日1回、午前9時に通知をまとめて受信</div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-card-foreground mb-4">通知カテゴリー</h2>
          <div className="space-y-6">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 pb-3 border-b border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                カテゴリー
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider text-center w-24">
                <Mail className="w-4 h-4 mx-auto mb-1" />
                メール
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider text-center w-24">
                <Bell className="w-4 h-4 mx-auto mb-1" />
                デスクトップ
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider text-center w-24">
                <Smartphone className="w-4 h-4 mx-auto mb-1" />
                モバイル
              </div>
            </div>

            {/* Notification Rows */}
            {notifications.map((notif) => (
              <div key={notif.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div>
                  <div className="text-sm text-card-foreground mb-1">{notif.label}</div>
                  <div className="text-xs text-muted-foreground">{notif.description}</div>
                </div>
                <div className="flex justify-center w-24">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notif.email}
                      onChange={() => toggleNotification(notif.id, 'email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex justify-center w-24">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notif.desktop}
                      onChange={() => toggleNotification(notif.id, 'desktop')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex justify-center w-24">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notif.mobile}
                      onChange={() => toggleNotification(notif.id, 'mobile')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
            <button className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm" onClick={handleCancel}>
              キャンセル
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="bg-card border border-border rounded-xl p-6 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">おやすみモード</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            指定した時間帯は通知を受け取りません（緊急の通知を除く）
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="time"
                defaultValue="22:00"
                value={doNotDisturb.startTime}
                onChange={(e) => setDoNotDisturb({ ...doNotDisturb, startTime: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">から</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                defaultValue="08:00"
                value={doNotDisturb.endTime}
                onChange={(e) => setDoNotDisturb({ ...doNotDisturb, endTime: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">まで</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                defaultChecked={doNotDisturb.enabled}
                onChange={(e) => setDoNotDisturb({ ...doNotDisturb, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}