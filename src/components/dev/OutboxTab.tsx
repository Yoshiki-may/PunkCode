// OutboxTab.tsx
// Phase 9.3: Outbox/Sync Health可視化（DEV専用）

import { RefreshCw, Trash2, Download, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  getAllOutboxItems, 
  getOutboxStats, 
  retryAllOutbox, 
  cleanupSentItems, 
  clearAllOutbox,
  type OutboxItem 
} from '../../utils/outbox';
import { 
  getAutoPullConfig, 
  setAutoPullConfig, 
  executeAutoPull, 
  restartAutoPull 
} from '../../utils/autoPull';
import { getCurrentDataMode } from '../../utils/supabase';

export function OutboxTab() {
  const [outboxItems, setOutboxItems] = useState<OutboxItem[]>([]);
  const [stats, setStats] = useState(getOutboxStats());
  const [autoPullConfig, setAutoPullConfigState] = useState(getAutoPullConfig());
  const [isRetrying, setIsRetrying] = useState(false);
  const [mode, setMode] = useState(getCurrentDataMode());
  
  const refreshData = () => {
    setOutboxItems(getAllOutboxItems());
    setStats(getOutboxStats());
    setAutoPullConfigState(getAutoPullConfig());
    setMode(getCurrentDataMode());
  };
  
  useEffect(() => {
    refreshData();
    
    // 5秒ごとに自動リフレッシュ
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleRetryAll = async () => {
    setIsRetrying(true);
    try {
      const result = await retryAllOutbox();
      alert(`リトライ完了:\n成功 ${result.success}件\n失敗 ${result.failed}件`);
      refreshData();
    } catch (error) {
      console.error('Retry failed:', error);
      alert('リトライ中にエラーが発生しました');
    } finally {
      setIsRetrying(false);
    }
  };
  
  const handleCleanupSent = () => {
    if (confirm('送信済み(sent)の履歴をクリーンアップしますか？')) {
      cleanupSentItems();
      refreshData();
    }
  };
  
  const handleClearAll = () => {
    if (confirm('全てのOutboxアイテムを削除しますか？\n※この操作は元に戻せません')) {
      clearAllOutbox();
      refreshData();
    }
  };
  
  const handleExportOutbox = () => {
    const json = JSON.stringify(outboxItems, null, 2);
    navigator.clipboard.writeText(json);
    alert('Outboxデータをクリップボードにコピーしました');
  };
  
  const handleAutoPullToggle = () => {
    const newEnabled = !autoPullConfig.enabled;
    setAutoPullConfig({ enabled: newEnabled });
    setAutoPullConfigState({ ...autoPullConfig, enabled: newEnabled });
    
    if (newEnabled) {
      restartAutoPull();
      alert('autoPullを有効化しました');
    } else {
      alert('autoPullを無効化しました');
    }
    
    setTimeout(refreshData, 500);
  };
  
  const handleAutoPullIntervalChange = (intervalSec: number) => {
    setAutoPullConfig({ intervalSec });
    setAutoPullConfigState({ ...autoPullConfig, intervalSec });
    restartAutoPull();
    alert(`autoPull間隔を ${intervalSec}秒 に変更しました`);
    setTimeout(refreshData, 500);
  };
  
  const handleManualPull = async () => {
    try {
      const success = await executeAutoPull();
      if (success) {
        alert('手動autoPull完了');
      } else {
        alert('autoPullをスキップしました（mockモードまたは無効）');
      }
      refreshData();
    } catch (error) {
      console.error('Manual pull failed:', error);
      alert('手動autoPull中にエラーが発生しました');
    }
  };
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return `${seconds}秒前`;
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return date.toLocaleString('ja-JP');
  };
  
  const getStatusIcon = (status: OutboxItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="size-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="size-4 text-red-500" />;
      case 'sent':
        return <CheckCircle className="size-4 text-green-500" />;
    }
  };
  
  const getStatusLabel = (status: OutboxItem['status']) => {
    switch (status) {
      case 'pending':
        return '送信待ち';
      case 'failed':
        return '失敗';
      case 'sent':
        return '送信済み';
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Mode警告 */}
      {mode === 'mock' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-800">
              現在mockモードです。Outbox/autoPullはsupabaseモードでのみ動作します。
            </p>
          </div>
        </div>
      )}
      
      {/* Outbox統計 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <Database className="size-5" />
          Outbox統計
        </h3>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">総件数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">送信待ち</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-red-600 mb-1">{stats.failed}</div>
            <div className="text-sm text-gray-600">失敗</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-600 mb-1">{stats.sent}</div>
            <div className="text-sm text-gray-600">送信済み</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRetryAll}
            disabled={isRetrying || stats.pending + stats.failed === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`size-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'リトライ中...' : 'Retry All'}
          </button>
          
          <button
            onClick={handleCleanupSent}
            disabled={stats.sent === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            Clear Sent
          </button>
          
          <button
            onClick={handleExportOutbox}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="size-4" />
            Export JSON
          </button>
          
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 ml-auto"
          >
            <Trash2 className="size-4" />
            Clear All
          </button>
        </div>
      </div>
      
      {/* autoPull設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <RefreshCw className="size-5" />
          autoPull設定
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>有効/無効:</span>
            <button
              onClick={handleAutoPullToggle}
              className={`px-4 py-2 rounded ${
                autoPullConfig.enabled 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {autoPullConfig.enabled ? '有効' : '無効'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span>間隔（秒）:</span>
            <select
              value={autoPullConfig.intervalSec}
              onChange={(e) => handleAutoPullIntervalChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded"
              disabled={!autoPullConfig.enabled}
            >
              <option value={10}>10秒</option>
              <option value={30}>30秒</option>
              <option value={60}>60秒</option>
              <option value={120}>120秒</option>
              <option value={300}>300秒</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span>最終実行:</span>
            <span className="text-sm text-gray-600">
              {formatDate(autoPullConfig.lastPullAt)}
            </span>
          </div>
          
          {autoPullConfig.lastPullCounts && (
            <div className="flex items-center justify-between">
              <span>最終取得件数:</span>
              <span className="text-sm text-gray-600">
                C:{autoPullConfig.lastPullCounts.clients} 
                T:{autoPullConfig.lastPullCounts.tasks} 
                A:{autoPullConfig.lastPullCounts.approvals} 
                Co:{autoPullConfig.lastPullCounts.comments} 
                Cn:{autoPullConfig.lastPullCounts.contracts}
              </span>
            </div>
          )}
          
          {autoPullConfig.lastError && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="text-sm text-red-800">
                <strong>最終エラー:</strong> {autoPullConfig.lastError}
              </div>
            </div>
          )}
          
          <button
            onClick={handleManualPull}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-4" />
            手動実行
          </button>
        </div>
      </div>
      
      {/* 最新の失敗 */}
      {stats.latestFailed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg mb-3 text-red-800 flex items-center gap-2">
            <AlertCircle className="size-5" />
            最新の失敗
          </h3>
          <div className="space-y-2 text-sm">
            <div><strong>操作:</strong> {stats.latestFailed.op}</div>
            <div><strong>時刻:</strong> {formatDate(stats.latestFailed.lastAttemptAt)}</div>
            <div><strong>リトライ回数:</strong> {stats.latestFailed.retryCount}</div>
            {stats.latestFailed.lastError && (
              <div><strong>エラー:</strong> <code className="bg-red-100 px-1 py-0.5 rounded">{stats.latestFailed.lastError}</code></div>
            )}
          </div>
        </div>
      )}
      
      {/* Outboxアイテム一覧 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg mb-4">Outboxアイテム一覧</h3>
        
        {outboxItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Outboxアイテムはありません
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {outboxItems.slice().reverse().map(item => (
              <div
                key={item.id}
                className={`border rounded p-3 ${
                  item.status === 'failed' ? 'bg-red-50 border-red-200' :
                  item.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{getStatusLabel(item.status)}</span>
                    <code className="bg-white px-2 py-0.5 rounded text-xs">{item.op}</code>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                </div>
                
                {item.lastAttemptAt && (
                  <div className="text-xs text-gray-600 mb-1">
                    最終試行: {formatDate(item.lastAttemptAt)} (リトライ {item.retryCount}回)
                  </div>
                )}
                
                {item.lastError && (
                  <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded mt-2">
                    {item.lastError}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
