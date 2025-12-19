import { AlertTriangle, Clock, MessageSquareOff, FileX, FileCheck, Bell, Check, X, Search, Archive, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'overdue' | 'no-reply' | 'stagnant' | 'pending-approval' | 'contract-renewal';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  clientName: string;
  projectName: string;
  assignee: string;
  deadline: string;
  daysOverdue?: number;
  isRead: boolean;
  isArchived: boolean;
}

export function InboxAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'overdue',
      title: '提案資料の最終確認が期限を過ぎています',
      description: 'AXAS社への提案資料レビューが2日遅れています。早急な対応が必要です。',
      severity: 'critical',
      clientName: 'AXAS株式会社',
      projectName: 'SNS運用代行プロジェクト',
      assignee: '田中太郎',
      deadline: '2024/12/12 14:00',
      daysOverdue: 2,
      isRead: false,
      isArchived: false,
    },
    {
      id: '2',
      type: 'no-reply',
      title: '最後のメールから5日経過しています',
      description: 'クライアントからの返信がありません。フォローアップを推奨します。',
      severity: 'warning',
      clientName: 'BAYMAX株式会社',
      projectName: 'インフルエンサーマーケティング',
      assignee: '佐藤花子',
      deadline: '2024/12/09 16:00',
      daysOverdue: 5,
      isRead: false,
      isArchived: false,
    },
    {
      id: '3',
      type: 'stagnant',
      title: 'Proposalステージに10日以上滞留',
      description: 'プロジェクトが停滞しています。ステータス更新または次のアクションが必要です。',
      severity: 'warning',
      clientName: 'デジタルフロンティア株式会社',
      projectName: 'コンテンツ制作サポート',
      assignee: '鈴木一郎',
      deadline: '2024/12/04 10:00',
      daysOverdue: 10,
      isRead: true,
      isArchived: false,
    },
    {
      id: '4',
      type: 'pending-approval',
      title: '見積書の承認が保留中です',
      description: 'マネージャーによる見積書の承認を待っています。',
      severity: 'info',
      clientName: 'クリエイティブワークス',
      projectName: 'ブランディング支援',
      assignee: '山田次郎',
      deadline: '2024/12/15 18:00',
      isRead: false,
      isArchived: false,
    },
    {
      id: '5',
      type: 'contract-renewal',
      title: '契約更新日が近づいています',
      description: '契約終了まで残り30日です。更新手続きを開始してください。',
      severity: 'warning',
      clientName: 'マーケティングラボ',
      projectName: '月次運用サポート',
      assignee: '高橋美咲',
      deadline: '2024/12/25 23:59',
      isRead: false,
      isArchived: false,
    },
  ]);

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | Alert['severity']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const handleArchive = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isArchived: true, isRead: true } : alert
    ));
    if (selectedAlertId === id) {
      setSelectedAlertId(null);
    }
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    if (selectedAlertId === id) {
      setSelectedAlertId(null);
    }
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          icon: 'text-red-600',
          border: 'border-l-red-500',
        };
      case 'warning':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: 'text-amber-600',
          border: 'border-l-amber-500',
        };
      case 'info':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: 'text-blue-600',
          border: 'border-l-blue-500',
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground border-border',
          icon: 'text-muted-foreground',
          border: 'border-l-gray-300',
        };
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'overdue':
        return AlertTriangle;
      case 'no-reply':
        return MessageSquareOff;
      case 'stagnant':
        return Clock;
      case 'pending-approval':
        return FileCheck;
      case 'contract-renewal':
        return FileX;
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'overdue':
        return '期限切れ';
      case 'no-reply':
        return '未返信';
      case 'stagnant':
        return 'ステージ停滞';
      case 'pending-approval':
        return '承認待ち';
      case 'contract-renewal':
        return '契約更新';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showArchived && alert.isArchived) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (searchQuery && !alert.clientName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.projectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !a.isArchived).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.isRead && !a.isArchived).length;
  const selectedAlert = selectedAlertId ? alerts.find(a => a.id === selectedAlertId) : null;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Panel - Alert List */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-card-foreground mb-2">Inbox / Alerts</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {unreadCount}件の未読通知
                </span>
                {criticalCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    緊急 {criticalCount}件
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                すべて既読にする
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="アラートを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべて</option>
              <option value="critical">緊急</option>
              <option value="warning">警告</option>
              <option value="info">情報</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-card-foreground">アーカイブ済み</span>
            </label>
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-12">
                <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" strokeWidth={1.5} />
                <p className="text-muted-foreground">アラートはありません</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredAlerts.map((alert) => {
                  const Icon = getTypeIcon(alert.type);
                  const styles = getSeverityStyles(alert.severity);
                  const isSelected = selectedAlertId === alert.id;
                  
                  return (
                    <button
                      key={alert.id}
                      onClick={() => {
                        setSelectedAlertId(alert.id);
                        handleMarkAsRead(alert.id);
                      }}
                      className={`w-full text-left p-4 transition-all border-l-4 ${styles.border} ${
                        isSelected 
                          ? 'bg-primary/5' 
                          : alert.isRead 
                            ? 'bg-card hover:bg-accent/50' 
                            : 'bg-blue-50/30 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${styles.badge} border flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${styles.icon}`} strokeWidth={2} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              {!alert.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {getTypeLabel(alert.type)}
                              </span>
                            </div>
                            {alert.daysOverdue && (
                              <span className="text-xs text-red-600 font-medium">
                                {alert.daysOverdue}日超過
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-sm font-medium text-card-foreground mb-1 line-clamp-1">
                            {alert.title}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {alert.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-card-foreground">{alert.clientName}</span>
                            <span>•</span>
                            <span>{alert.assignee}</span>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                          isSelected ? 'rotate-90' : ''
                        }`} strokeWidth={2} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Alert Detail */}
      {selectedAlert && (
        <div className="w-96 flex-shrink-0 bg-card border border-border rounded-xl p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                {(() => {
                  const Icon = getTypeIcon(selectedAlert.type);
                  const styles = getSeverityStyles(selectedAlert.severity);
                  return (
                    <div className={`w-12 h-12 rounded-xl ${styles.badge} border flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${styles.icon}`} strokeWidth={2} />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground block mb-1">
                    {getTypeLabel(selectedAlert.type)}
                  </span>
                  <h2 className="text-base font-semibold text-card-foreground">
                    {selectedAlert.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedAlert.description}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">クライアント</span>
                  <span className="text-sm text-card-foreground font-medium text-right">
                    {selectedAlert.clientName}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">プロジェクト</span>
                  <span className="text-sm text-card-foreground text-right">
                    {selectedAlert.projectName}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">担当者</span>
                  <span className="text-sm text-card-foreground">
                    {selectedAlert.assignee}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    期限
                  </span>
                  <span className={`text-sm font-medium text-right ${
                    selectedAlert.daysOverdue ? 'text-red-600' : 'text-card-foreground'
                  }`}>
                    {selectedAlert.deadline}
                    {selectedAlert.daysOverdue && (
                      <span className="block text-xs mt-0.5">
                        {selectedAlert.daysOverdue}日超過
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-border">
              <button
                onClick={() => handleArchive(selectedAlert.id)}
                className="w-full px-4 py-2.5 bg-background hover:bg-accent border border-border rounded-lg text-sm text-card-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Archive className="w-4 h-4" strokeWidth={2} />
                アーカイブ
              </button>
              <button
                onClick={() => handleDelete(selectedAlert.id)}
                className="w-full px-4 py-2.5 bg-background hover:bg-red-50 border border-border hover:border-red-200 rounded-lg text-sm text-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                削除
              </button>
            </div>

            {/* Quick Info */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="text-xs font-medium text-blue-900 mb-2">推奨アクション</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                {selectedAlert.type === 'overdue' && '期限を過ぎたタスクを完了するか、新しい期限を設定してください。'}
                {selectedAlert.type === 'no-reply' && 'クライアントにフォローアップメールを送信することを推奨します。'}
                {selectedAlert.type === 'stagnant' && 'プロジェクトのステータスを更新し、次のステップを明確にしてください。'}
                {selectedAlert.type === 'pending-approval' && '承認者に確認を促すか、承認プロセスを確認してください。'}
                {selectedAlert.type === 'contract-renewal' && '契約更新の手続きを開始し、必要な書類を準備してください。'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
