import { Zap, ExternalLink, Settings, Check, Plus, X, Copy, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'sns' | 'analytics' | 'communication' | 'storage' | 'other';
  status: 'connected' | 'available';
  connectedDate?: string;
  apiKey?: string;
}

export function IntegrationsSettings() {
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [integrationToDisconnect, setIntegrationToDisconnect] = useState<Integration | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Instagram',
      description: 'Instagram投稿の自動化とインサイト分析',
      icon: '📷',
      category: 'sns',
      status: 'connected',
      connectedDate: '2024/01/15',
    },
    {
      id: '2',
      name: 'Twitter (X)',
      description: 'ツイートの予約投稿と分析',
      icon: '𝕏',
      category: 'sns',
      status: 'connected',
      connectedDate: '2024/01/15',
    },
    {
      id: '3',
      name: 'Facebook',
      description: 'Facebookページの管理と分析',
      icon: '📘',
      category: 'sns',
      status: 'connected',
      connectedDate: '2024/01/20',
    },
    {
      id: '4',
      name: 'Google Analytics',
      description: 'Webサイトのトラフィック分析',
      icon: '📊',
      category: 'analytics',
      status: 'connected',
      connectedDate: '2024/02/01',
      apiKey: 'GA-XXXXXXXXXX',
    },
    {
      id: '5',
      name: 'Slack',
      description: 'チーム通知とコミュニケーション',
      icon: '💬',
      category: 'communication',
      status: 'connected',
      connectedDate: '2024/01/10',
    },
    {
      id: '6',
      name: 'Google Drive',
      description: 'ファイルの保存と共有',
      icon: '📁',
      category: 'storage',
      status: 'available',
    },
    {
      id: '7',
      name: 'Dropbox',
      description: 'クラウドストレージとファイル同期',
      icon: '📦',
      category: 'storage',
      status: 'available',
    },
    {
      id: '8',
      name: 'TikTok',
      description: 'TikTok動画の投稿と分析',
      icon: '🎵',
      category: 'sns',
      status: 'available',
    },
    {
      id: '9',
      name: 'YouTube',
      description: 'YouTube動画の管理と分析',
      icon: '🎥',
      category: 'sns',
      status: 'available',
    },
    {
      id: '10',
      name: 'LinkedIn',
      description: 'LinkedIn投稿とネットワーク管理',
      icon: '💼',
      category: 'sns',
      status: 'available',
    },
  ]);

  // Load saved integrations
  useEffect(() => {
    const savedIntegrations = storage.get<Integration[]>(STORAGE_KEYS.INTEGRATIONS);
    if (savedIntegrations && savedIntegrations.length > 0) {
      setIntegrations(savedIntegrations);
    }
  }, []);

  // Save integrations when changed
  useEffect(() => {
    storage.set(STORAGE_KEYS.INTEGRATIONS, integrations);
  }, [integrations]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sns':
        return 'SNS';
      case 'analytics':
        return '分析';
      case 'communication':
        return 'コミュニケーション';
      case 'storage':
        return 'ストレージ';
      default:
        return 'その他';
    }
  };

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(true);
    try {
      // Simulate OAuth flow or API key setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(integrations.map(i => 
        i.id === integration.id 
          ? { 
              ...i, 
              status: 'connected', 
              connectedDate: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/'),
              apiKey: i.category === 'analytics' ? `${integration.name.toUpperCase().replace(/\s/g, '-')}-XXXXXXXXXX` : undefined,
            }
          : i
      ));
      
      toast.success(`${integration.name} を接続しました`);
    } catch (error) {
      toast.error('接続に失敗しました');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = (integration: Integration) => {
    setIntegrationToDisconnect(integration);
    setShowDisconnectDialog(true);
  };

  const confirmDisconnect = () => {
    if (integrationToDisconnect) {
      setIntegrations(integrations.map(i => 
        i.id === integrationToDisconnect.id 
          ? { ...i, status: 'available', connectedDate: undefined, apiKey: undefined }
          : i
      ));
      
      toast.success(`${integrationToDisconnect.name} の接続を解除しました`);
      setShowDisconnectDialog(false);
      setIntegrationToDisconnect(null);
    }
  };

  const handleShowApiKey = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowApiKeyModal(true);
  };

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast.success('APIキーをコピーしました');
  };

  const handleRegenerateApiKey = async (integration: Integration) => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApiKey = `${integration.name.toUpperCase().replace(/\s/g, '-')}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      
      setIntegrations(integrations.map(i => 
        i.id === integration.id 
          ? { ...i, apiKey: newApiKey }
          : i
      ));
      
      if (selectedIntegration?.id === integration.id) {
        setSelectedIntegration({ ...integration, apiKey: newApiKey });
      }
      
      toast.success('APIキーを再生成しました');
    } catch (error) {
      toast.error('APIキーの再生成に失敗しました');
    } finally {
      setIsConnecting(false);
    }
  };

  const filteredIntegrations = categoryFilter === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === categoryFilter);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl mb-2">連携サービス</h1>
          <p className="text-muted-foreground text-sm">外部サービスとの連携を管理</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{integrations.length}</div>
            <div className="text-xs text-muted-foreground">利用可能なサービス</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{connectedCount}</div>
            <div className="text-xs text-muted-foreground">接続済み</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{integrations.length - connectedCount}</div>
            <div className="text-xs text-muted-foreground">未接続</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setCategoryFilter('sns')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === 'sns'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              SNS
            </button>
            <button
              onClick={() => setCategoryFilter('analytics')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === 'analytics'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              分析
            </button>
            <button
              onClick={() => setCategoryFilter('communication')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === 'communication'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              コミュニケーション
            </button>
            <button
              onClick={() => setCategoryFilter('storage')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === 'storage'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              ストレージ
            </button>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-card-foreground mb-1">{integration.name}</h3>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {getCategoryLabel(integration.category)}
                    </span>
                  </div>
                </div>
                {integration.status === 'connected' && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    <Check className="w-3 h-3" />
                    接続済み
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {integration.description}
              </p>
              
              {integration.status === 'connected' && integration.connectedDate && (
                <p className="text-xs text-muted-foreground mb-4">
                  接続日: {integration.connectedDate}
                </p>
              )}

              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <>
                    {integration.apiKey && (
                      <button
                        onClick={() => handleShowApiKey(integration)}
                        className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
                      >
                        APIキーを表示
                      </button>
                    )}
                    <button
                      onClick={() => handleDisconnect(integration)}
                      className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      接続解除
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration)}
                    disabled={isConnecting}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? '接続中...' : '接続する'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* API Key Modal */}
        {showApiKeyModal && selectedIntegration && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={() => setShowApiKeyModal(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-[101] p-6">
              <h3 className="text-lg text-card-foreground mb-4">{selectedIntegration.name} APIキー</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">APIキー</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedIntegration.apiKey}
                      readOnly
                      className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
                    />
                    <button
                      onClick={() => handleCopyApiKey(selectedIntegration.apiKey!)}
                      className="p-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    このAPIキーを外部サービスに設定してください
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700">
                    ⚠️ APIキーは安全に保管してください。第三者と共有しないでください。
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => handleRegenerateApiKey(selectedIntegration)}
                  disabled={isConnecting}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  閉じる
                </button>
              </div>
            </div>
          </>
        )}

        {/* Disconnect Confirmation */}
        <ConfirmDialog
          isOpen={showDisconnectDialog}
          title="接続を解除しますか？"
          message={`${integrationToDisconnect?.name} の接続を解除します。再接続する場合は、再度認証が必要です。`}
          confirmLabel="接続解除"
          cancelLabel="キャンセル"
          variant="warning"
          onConfirm={confirmDisconnect}
          onCancel={() => {
            setShowDisconnectDialog(false);
            setIntegrationToDisconnect(null);
          }}
        />
      </div>
    </div>
  );
}
