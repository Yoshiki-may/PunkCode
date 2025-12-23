// DEV専用QAパネル
// 既存UIに一切影響を与えず、開発・検証を加速するためのパネル

import { X, RefreshCw, Trash2, Settings, Database, Users, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getQAConfig, setQAConfig } from '../../utils/qaConfig';
import { getAllTasks, getAllApprovals, getAllNotifications, getAllClients } from '../../utils/clientData';
import { getAppState, setSelectedClientId, setSelectedClientIdForBoard, resetAppState } from '../../utils/appState';
import { getAllUsers, getCurrentUser, setCurrentUser } from '../../utils/mockDatabase';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { generateStagnantTask, generateOverdueTask, generateNormalTask, generateNoReplyComment, generateTeamReply, generateUpcomingRenewalContract, generateDistantRenewalContract, generateOnTimeCompletedTask, generateOverdueCompletedTask, generateIncompleteTask, generateCurrentMonthActiveContract, generatePreviousMonthActiveContract, generateCurrentMonthNegotiatingContract } from '../../utils/testDataGenerator';
import { getAllComments, seedCommentsIfEmpty, clearAllComments } from '../../utils/commentData';
import { getAllContracts, seedContractsIfEmpty, clearAllContracts } from '../../utils/contractData';

interface QAPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QAPanel({ isOpen, onClose }: QAPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'data' | 'test'>('settings');
  const [qaConfig, setQAConfigState] = useState(getQAConfig());
  const [currentUserState, setCurrentUserState] = useState(getCurrentUser());
  const [appState, setAppStateState] = useState(getAppState());
  
  // データ件数
  const [taskCount, setTaskCount] = useState(0);
  const [approvalCount, setApprovalCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  
  // リフレッシュ
  const refreshData = () => {
    setQAConfigState(getQAConfig());
    setCurrentUserState(getCurrentUser());
    setAppStateState(getAppState());
    setTaskCount(getAllTasks().length);
    setApprovalCount(getAllApprovals().length);
    setNotificationCount(getAllNotifications().length);
    setClientCount(getAllClients().length);
    setCommentCount(getAllComments().length);
    setContractCount(getAllContracts().length);
  };
  
  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);
  
  // 閾値変更
  const handleThresholdChange = (key: 'stagnantDays' | 'noReplyDays' | 'renewalDays', value: number) => {
    const updated = { ...qaConfig, [key]: value };
    setQAConfig(updated);
    setQAConfigState(updated);
  };
  
  // ログインユーザー切替
  const handleUserSwitch = (userId: string) => {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user.id);
      setCurrentUserState(user);
      alert(`ログインユーザーを「${user.name} (${user.role})」に切り替えました`);
      // ページをリロードして反映
      window.location.reload();
    }
  };
  
  // 選択中クライアント切替
  const handleClientSwitch = (clientId: string) => {
    setSelectedClientId(clientId);
    refreshData();
    alert(`選択中クライアントを切り替えました: ${clientId}`);
  };
  
  // Seed再投入
  const handleSeedReinject = () => {
    if (confirm('LocalStorageを初期化してSeedデータを再投入しますか？\n※現在のデータは全て削除されます')) {
      // 主要データをクリア
      storage.remove(STORAGE_KEYS.CLIENT_TASKS);
      storage.remove(STORAGE_KEYS.CLIENT_APPROVALS);
      storage.remove(STORAGE_KEYS.NOTIFICATIONS);
      storage.remove(STORAGE_KEYS.APP_STATE);
      
      // 初期化フラグをリセット
      setQAConfig({ initialized: false });
      
      alert('データを初期化しました。ページをリロードします。');
      window.location.reload();
    }
  };
  
  // 全データクリア
  const handleClearAll = () => {
    if (confirm('LocalStorageの全データをクリアしますか？\n※復元できません')) {
      storage.clear();
      alert('全データをクリアしました。ページをリロードします。');
      window.location.reload();
    }
  };
  
  // テストデータ生成
  const handleGenerateStagnant = () => {
    if (generateStagnantTask()) {
      alert(`停滞タスクを生成しました（${qaConfig.stagnantDays + 1}日間更新なし）`);
      refreshData();
    } else {
      alert('停滞タスクの生成に失敗しました');
    }
  };
  
  const handleGenerateOverdue = () => {
    if (generateOverdueTask()) {
      alert('期限切れタスクを生成しました（3日超過）');
      refreshData();
    } else {
      alert('期限切れタスクの生成に失敗しました');
    }
  };
  
  const handleGenerateNormal = () => {
    if (generateNormalTask()) {
      alert('通常タスクを生成しました');
      refreshData();
    } else {
      alert('通常タスクの生成に失敗しました');
    }
  };
  
  const handleGenerateNoReplyComment = () => {
    if (generateNoReplyComment()) {
      alert('未返信コメントを生成しました');
      refreshData();
    } else {
      alert('未返信コメントの生成に失敗しました');
    }
  };
  
  const handleGenerateTeamReply = () => {
    if (generateTeamReply()) {
      alert('チームからの返信コメントを生成しました');
      refreshData();
    } else {
      alert('チームからの返信コメントの生成に失敗しました');
    }
  };
  
  const handleGenerateUpcomingRenewalContract = () => {
    if (generateUpcomingRenewalContract()) {
      alert('近い更新期限の契約を生成しました');
      refreshData();
    } else {
      alert('近い更新期限の契約の生成に失敗しました');
    }
  };
  
  const handleGenerateDistantRenewalContract = () => {
    if (generateDistantRenewalContract()) {
      alert('遠い更新期限の契約を生成しました');
      refreshData();
    } else {
      alert('遠い更新期限の契約の生成に失敗しました');
    }
  };
  
  const handleGenerateOnTimeCompletedTask = () => {
    if (generateOnTimeCompletedTask()) {
      alert('期限内完了タスクを生成しました');
      refreshData();
    } else {
      alert('期限内完了タスクの生成に失敗しました');
    }
  };
  
  const handleGenerateOverdueCompletedTask = () => {
    if (generateOverdueCompletedTask()) {
      alert('期限切れ完了タスクを生成しました');
      refreshData();
    } else {
      alert('期限切れ完了タスクの生成に失敗しました');
    }
  };
  
  const handleGenerateIncompleteTask = () => {
    if (generateIncompleteTask()) {
      alert('未完了タスクを生成しました');
      refreshData();
    } else {
      alert('未完了タスクの生成に失敗しました');
    }
  };
  
  const handleGenerateCurrentMonthActiveContract = () => {
    if (generateCurrentMonthActiveContract()) {
      alert('今月有効な契約を生成しました');
      refreshData();
    } else {
      alert('今月有効な契約の生成に失敗しました');
    }
  };
  
  const handleGeneratePreviousMonthActiveContract = () => {
    if (generatePreviousMonthActiveContract()) {
      alert('先月有効な契約を生成しました');
      refreshData();
    } else {
      alert('先月有効な契約の生成に失敗しました');
    }
  };
  
  const handleGenerateCurrentMonthNegotiatingContract = () => {
    if (generateCurrentMonthNegotiatingContract()) {
      alert('今月交渉中の契約を生成しました');
      refreshData();
    } else {
      alert('今月交渉中の契約の生成に失敗しました');
    }
  };
  
  if (!isOpen) return null;
  
  const users = getAllUsers();
  const clients = getAllClients();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-card-foreground">DEV: QA/検証パネル</h2>
              <p className="text-xs text-muted-foreground">開発・テスト専用（本番には表示されません）</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 p-4 bg-muted/50 border-b border-border">
          {[
            { id: 'settings', label: '設定', icon: Settings },
            { id: 'data', label: 'データ状況', icon: Database },
            { id: 'test', label: 'テストデータ', icon: AlertCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-card-foreground hover:bg-accent/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* ログインユーザー切替 */}
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  ログインユーザー切替
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSwitch(user.id)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                        currentUserState?.id === user.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-card-foreground border-border hover:bg-accent'
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs opacity-70">{user.role}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 選択中クライアント切替 */}
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3">選択中クライアント切替</h3>
                <select
                  value={appState.selectedClientId || ''}
                  onChange={(e) => handleClientSwitch(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">クライアント未選択</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 閾値設定 */}
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3">閾値設定（アラート判定用）</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      停滞判定（stagnantDays）
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={qaConfig.stagnantDays}
                        onChange={(e) => handleThresholdChange('stagnantDays', parseInt(e.target.value))}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-card-foreground"
                        min="1"
                        max="30"
                      />
                      <span className="text-sm text-muted-foreground">日</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      この日数以上更新がないタスクを「停滞」と判定
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      未返信判定（noReplyDays）
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={qaConfig.noReplyDays}
                        onChange={(e) => handleThresholdChange('noReplyDays', parseInt(e.target.value))}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-card-foreground"
                        min="1"
                        max="30"
                      />
                      <span className="text-sm text-muted-foreground">日</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      この日数以上、クライアントからのコメントに未返信
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      契約更新期限（renewalDays）
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={qaConfig.renewalDays}
                        onChange={(e) => handleThresholdChange('renewalDays', parseInt(e.target.value))}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-card-foreground"
                        min="1"
                        max="90"
                      />
                      <span className="text-sm text-muted-foreground">日</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      この日数以内に契約更新期限がある契約を警告
                    </p>
                  </div>
                </div>
              </div>
              
              {/* データモード */}
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3">データモード</h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    Mock（ローカル）
                  </button>
                  <button className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg" disabled>
                    Supabase（未接続）
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  現在はMockモードのみ対応。Supabase接続は今後実装予定。
                </p>
              </div>
            </div>
          )}
          
          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* データ状況 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">タスク</div>
                  <div className="text-2xl text-card-foreground">{taskCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">承認待ち</div>
                  <div className="text-2xl text-card-foreground">{approvalCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">通知</div>
                  <div className="text-2xl text-card-foreground">{notificationCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">クライアント</div>
                  <div className="text-2xl text-card-foreground">{clientCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">コメント</div>
                  <div className="text-2xl text-card-foreground">{commentCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">契約</div>
                  <div className="text-2xl text-card-foreground">{contractCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">件</div>
                </div>
              </div>
              
              {/* データ操作 */}
              <div className="space-y-3">
                <button
                  onClick={refreshData}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  データを再読み込み
                </button>
                
                <button
                  onClick={handleSeedReinject}
                  className="w-full px-4 py-3 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 border border-border"
                >
                  <Database className="w-4 h-4" />
                  Seed再投入（初期化して再生成）
                </button>
                
                <button
                  onClick={handleClearAll}
                  className="w-full px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 border border-destructive/30"
                >
                  <Trash2 className="w-4 h-4" />
                  全データクリア（危険）
                </button>
              </div>
            </div>
          )}
          
          {/* Test Tab */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3">テストタスク生成</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  アラート検証用のテストタスクを生成します。最初のクライアントに追加されます。
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleGenerateStagnant}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">停滞タスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {qaConfig.stagnantDays + 1}日間更新なしのタスク
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateOverdue}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">期限切れタスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      3日前が期限のタスク
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateNormal}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">通常タスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      問題なし、7日後投稿予定のタスク
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateOnTimeCompletedTask}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">期限内完了タスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      期限内に完了したタスク
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateOverdueCompletedTask}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">期限切れ完了タスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      期限切れに完了したタスク
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateIncompleteTask}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">未完了タスクを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      未完了のタスク
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="text-sm text-card-foreground mb-3">テストコメント/契約生成</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  noReply/contractRenewal検証用のテストデータを生成します。
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleGenerateNoReplyComment}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">未返信コメントを生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {qaConfig.noReplyDays + 1}日前のクライアントコメント（未返信状態）
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateTeamReply}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">チームからの返信を追加</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      noReplyCountが減ることを確認できます
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateUpcomingRenewalContract}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">更新期限が近い契約を生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {qaConfig.renewalDays - 1}日後に更新期限（対象内）
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateDistantRenewalContract}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">更新期限が遠い契約を生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {qaConfig.renewalDays + 30}日後に更新期限（対象外）
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateCurrentMonthActiveContract}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">今月有効な契約を生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      今月有効な契約
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGeneratePreviousMonthActiveContract}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">先月有効な契約を生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      先月有効な契約
                    </div>
                  </button>
                  
                  <button
                    onClick={handleGenerateCurrentMonthNegotiatingContract}
                    className="w-full px-4 py-3 bg-card text-card-foreground rounded-lg hover:bg-accent transition-colors border border-border text-left"
                  >
                    <div className="font-medium text-sm">今月交渉中の契約を生成</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      今月交渉中の契約
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="text-xs text-muted-foreground">
            <strong>ショートカット:</strong> Ctrl+Shift+D でパネルを開閉
          </div>
        </div>
      </div>
    </div>
  );
}