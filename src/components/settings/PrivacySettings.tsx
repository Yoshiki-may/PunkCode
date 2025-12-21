import { Shield, Smartphone, Globe, Download, Eye, Lock, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export function PrivacySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro（現在のデバイス）',
      location: '東京都、日本',
      lastActive: '現在アクティブ',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      location: '東京都、日本',
      lastActive: '2時間前',
      current: false,
    },
    {
      id: '3',
      device: 'iPad Air',
      location: '大阪府、日本',
      lastActive: '3日前',
      current: false,
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    activityStatus: true,
    readReceipts: true,
  });

  const [loginHistory] = useState([
    { date: '2024年12月21日 14:30', device: 'MacBook Pro', location: '東京都、日本', status: '成功' },
    { date: '2024年12月21日 09:15', device: 'iPhone 15 Pro', location: '東京都、日本', status: '成功' },
    { date: '2024年12月20日 18:45', device: 'MacBook Pro', location: '東京都、日本', status: '成功' },
    { date: '2024年12月20日 08:20', device: 'iPhone 15 Pro', location: '東京都、日本', status: '成功' },
    { date: '2024年12月19日 22:10', device: 'iPad Air', location: '大阪府、日本', status: '成功' },
  ]);

  // Load saved settings
  useEffect(() => {
    const savedSettings = storage.get(STORAGE_KEYS.PRIVACY_SETTINGS);
    if (savedSettings) {
      setTwoFactorEnabled(savedSettings.twoFactorEnabled || false);
      setPrivacySettings(savedSettings.privacySettings || privacySettings);
    }
    
    const savedSessions = storage.get<Session[]>(STORAGE_KEYS.SESSIONS);
    if (savedSessions) {
      setSessions(savedSessions);
    }
  }, []);

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      setShowTwoFactorSetup(true);
    } else {
      setTwoFactorEnabled(false);
      saveSettings({ twoFactorEnabled: false, privacySettings });
      toast.success('二段階認証を無効にしました');
    }
  };

  const handleCompleteTwoFactorSetup = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      saveSettings({ twoFactorEnabled: true, privacySettings });
      toast.success('二段階認証を有効にしました');
    } catch (error) {
      toast.error('設定に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessionToLogout(sessionId);
    setShowLogoutDialog(true);
  };

  const confirmLogoutSession = () => {
    if (sessionToLogout) {
      const updatedSessions = sessions.filter(s => s.id !== sessionToLogout);
      setSessions(updatedSessions);
      storage.set(STORAGE_KEYS.SESSIONS, updatedSessions);
      toast.success('セッションを終了しました');
      setShowLogoutDialog(false);
      setSessionToLogout(null);
    }
  };

  const handleLogoutAllSessions = () => {
    const currentSession = sessions.find(s => s.current);
    if (currentSession) {
      setSessions([currentSession]);
      storage.set(STORAGE_KEYS.SESSIONS, [currentSession]);
      toast.success('すべてのセッションを終了しました');
    }
  };

  const handlePrivacyChange = (key: keyof typeof privacySettings, value: boolean) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    saveSettings({ twoFactorEnabled, privacySettings: newSettings });
    toast.success('プライバシー設定を更新しました');
  };

  const saveSettings = (settings: any) => {
    storage.set(STORAGE_KEYS.PRIVACY_SETTINGS, settings);
  };

  const handleDownloadData = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('データのダウンロードを開始しました。完了したらメールでお知らせします。');
    } catch (error) {
      toast.error('ダウンロードに失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl mb-2">プライバシー＆セキュリティ</h1>
          <p className="text-muted-foreground text-sm">アカウントのセキュリティ設定を管理</p>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Shield className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <h2 className="text-card-foreground mb-1">二段階認証</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  ログイン時に追加の確認コードを要求することで、アカウントのセキュリティを強化します。
                </p>
                {twoFactorEnabled ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">有効</span>
                    </div>
                    <p className="text-xs text-green-600 mb-3">
                      認証アプリ（Google Authenticator等）を使用して二段階認証が設定されています。
                    </p>
                    <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                      バックアップコードを表示
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-amber-700">無効</span>
                    </div>
                    <p className="text-xs text-amber-600 mb-3">
                      二段階認証を有効にして、アカウントの保護を強化することをお勧めします。
                    </p>
                  </div>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => handleTwoFactorToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">アクティブなセッション</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            現在ログイン中のデバイスと場所を確認できます。
          </p>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-card-foreground">{session.device}</span>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        現在のセッション
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ログアウト
                  </button>
                )}
              </div>
            ))}
          </div>
          {sessions.filter(s => !s.current).length > 0 && (
            <button
              onClick={handleLogoutAllSessions}
              className="w-full mt-4 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
            >
              すべてのセッションからログアウト（現在のセッション除く）
            </button>
          )}
        </div>

        {/* Login History */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">ログイン履歴</h2>
          </div>
          <div className="space-y-2">
            {loginHistory.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm text-card-foreground mb-1">{log.date}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.device} • {log.location}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  log.status === '成功' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">プライバシー設定</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex-1">
                <div className="text-sm text-card-foreground mb-1">プロフィールの公開</div>
                <div className="text-xs text-muted-foreground">
                  チームメンバーにプロフィール情報を公開
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.profileVisible}
                  onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex-1">
                <div className="text-sm text-card-foreground mb-1">アクティビティ状態の表示</div>
                <div className="text-xs text-muted-foreground">
                  オンライン/オフラインの状態を他のユーザーに表示
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.activityStatus}
                  onChange={(e) => handlePrivacyChange('activityStatus', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex-1">
                <div className="text-sm text-card-foreground mb-1">読み取り確認の送信</div>
                <div className="text-xs text-muted-foreground">
                  メッセージを読んだときに送信者に通知
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.readReceipts}
                  onChange={(e) => handlePrivacyChange('readReceipts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">データ管理</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            アカウントに関連するすべてのデータをダウンロードできます。
          </p>
          <button
            onClick={handleDownloadData}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'リクエスト中...' : 'データをダウンロード'}
          </button>
        </div>

        {/* Two-Factor Setup Modal */}
        {showTwoFactorSetup && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={() => setShowTwoFactorSetup(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-[101] p-6">
              <h3 className="text-lg text-card-foreground mb-4">二段階認証の設定</h3>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <QrCode className="w-32 h-32 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    認証アプリでこのQRコードをスキャンしてください
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">確認コード</label>
                  <input
                    type="text"
                    placeholder="6桁のコードを入力"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowTwoFactorSetup(false)}
                  className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCompleteTwoFactorSetup}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {isSaving ? '設定中...' : '有効にする'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showLogoutDialog}
          title="セッションを終了しますか？"
          message="このデバイスからログアウトします。再度ログインする場合は、認証情報が必要です。"
          confirmLabel="ログアウト"
          cancelLabel="キャンセル"
          variant="warning"
          onConfirm={confirmLogoutSession}
          onCancel={() => {
            setShowLogoutDialog(false);
            setSessionToLogout(null);
          }}
        />
      </div>
    </div>
  );
}
