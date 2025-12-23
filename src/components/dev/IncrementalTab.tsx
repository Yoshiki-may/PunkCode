// IncrementalTab.tsx
// Phase 8.5: Incremental Pull状態可視化・操作（DEV専用）

import { RefreshCw, Trash2, Database, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  getAutoPullState,
  resetTableState,
  resetAllTableStates
} from '../../utils/autoPullState';
import { executeAutoPull, getAutoPullConfig } from '../../utils/autoPull';

export function IncrementalTab() {
  const [pullState, setPullState] = useState(getAutoPullState());
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString());
  
  // リフレッシュ
  const refreshState = () => {
    setPullState(getAutoPullState());
    setLastRefresh(new Date().toISOString());
  };
  
  useEffect(() => {
    refreshState();
  }, []);
  
  // Full Pull Now（全テーブル）
  const handleFullPullAll = async () => {
    if (!confirm('全テーブルのFull Pullを強制実行しますか？')) return;
    
    resetAllTableStates();
    setIsExecuting(true);
    
    try {
      await executeAutoPull();
      alert('Full Pullが完了しました');
    } catch (err) {
      alert(`エラーが発生しました: ${err}`);
    } finally {
      setIsExecuting(false);
      refreshState();
    }
  };
  
  // Full Pull Now（個別テーブル）
  const handleFullPullTable = async (tableName: keyof typeof pullState.tables) => {
    if (!confirm(`${tableName}のFull Pullを強制実行しますか？`)) return;
    
    resetTableState(tableName);
    setIsExecuting(true);
    
    try {
      await executeAutoPull();
      alert(`${tableName}のFull Pullが完了しました`);
    } catch (err) {
      alert(`エラーが発生しました: ${err}`);
    } finally {
      setIsExecuting(false);
      refreshState();
    }
  };
  
  // Reset State（全テーブル）
  const handleResetAll = () => {
    if (!confirm('全テーブルのIncremental Pull状態をリセットしますか？\n※次回は全てFull Pullになります')) return;
    
    resetAllTableStates();
    refreshState();
    alert('全テーブルの状態をリセットしました');
  };
  
  // Reset State（個別テーブル）
  const handleResetTable = (tableName: keyof typeof pullState.tables) => {
    if (!confirm(`${tableName}のIncremental Pull状態をリセットしますか？\n※次回はFull Pullになります`)) return;
    
    resetTableState(tableName);
    refreshState();
    alert(`${tableName}の状態をリセットしました`);
  };
  
  // 時刻フォーマット
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Pull種別判定
  const getPullType = (tableName: keyof typeof pullState.tables) => {
    const state = pullState.tables[tableName];
    if (!state.lastPulledAt) return 'Full Pull（初回）';
    return 'Incremental Pull';
  };
  
  // 経過時間計算
  const getElapsedTime = (timestamp: string | null) => {
    if (!timestamp) return '-';
    const elapsed = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}分${seconds}秒前`;
    }
    return `${seconds}秒前`;
  };
  
  const tables: Array<keyof typeof pullState.tables> = [
    'clients',
    'tasks',
    'approvals',
    'comments',
    'contracts',
    'notifications'
  ];
  
  const config = getAutoPullConfig();
  
  return (
    <div className="space-y-6">
      {/* 概要 */}
      <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/20">
        <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          Incremental Pull概要
        </h3>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            <strong>Full Pull:</strong> 全件取得（初回またはリセット後）
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Incremental Pull:</strong> lastPulledAt以降の差分のみ取得（2回目以降）
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>改善効果:</strong> 取得件数99.9%削減、実行時間97-98%短縮（想定）
          </div>
        </div>
      </div>
      
      {/* 全体操作 */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          全体操作
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleFullPullAll}
            disabled={isExecuting}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                実行中...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Full Pull Now（全テーブル）
              </>
            )}
          </button>
          
          <button
            onClick={handleResetAll}
            disabled={isExecuting}
            className="flex-1 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
            Reset State（全テーブル）
          </button>
        </div>
        
        <button
          onClick={refreshState}
          className="w-full mt-2 px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 border border-border"
        >
          <RefreshCw className="w-4 h-4" />
          状態を再読み込み
        </button>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <strong>最終更新:</strong> {formatTimestamp(lastRefresh)} ({getElapsedTime(lastRefresh)})
        </div>
      </div>
      
      {/* autoPull設定情報 */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          autoPull設定
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background rounded-lg p-2">
            <div className="text-xs text-muted-foreground">有効/無効</div>
            <div className="text-sm text-card-foreground">{config.enabled ? '有効' : '無効'}</div>
          </div>
          <div className="bg-background rounded-lg p-2">
            <div className="text-xs text-muted-foreground">実行間隔</div>
            <div className="text-sm text-card-foreground">{config.intervalSec}秒</div>
          </div>
          <div className="bg-background rounded-lg p-2">
            <div className="text-xs text-muted-foreground">最終実行</div>
            <div className="text-sm text-card-foreground">{formatTimestamp(config.lastPullAt || null)}</div>
          </div>
          <div className="bg-background rounded-lg p-2">
            <div className="text-xs text-muted-foreground">経過時間</div>
            <div className="text-sm text-card-foreground">{getElapsedTime(config.lastPullAt || null)}</div>
          </div>
        </div>
      </div>
      
      {/* テーブル別状態 */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" />
          テーブル別状態
        </h3>
        
        <div className="space-y-3">
          {tables.map((tableName) => {
            const state = pullState.tables[tableName];
            const pullType = getPullType(tableName);
            const hasError = !!state.lastError;
            
            return (
              <div
                key={tableName}
                className={`bg-background rounded-lg p-3 border ${
                  hasError ? 'border-destructive/50' : 'border-border'
                }`}
              >
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm text-card-foreground">{tableName}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      pullType.includes('Full')
                        ? 'bg-primary/20 text-primary'
                        : 'bg-success/20 text-success'
                    }`}>
                      {pullType}
                    </span>
                    {hasError && (
                      <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        エラー
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleFullPullTable(tableName)}
                      disabled={isExecuting}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      Full Pull
                    </button>
                    <button
                      onClick={() => handleResetTable(tableName)}
                      disabled={isExecuting}
                      className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                {/* 詳細 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">lastPulledAt</div>
                    <div className="text-card-foreground">{formatTimestamp(state.lastPulledAt)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">lastFullPulledAt</div>
                    <div className="text-card-foreground">{formatTimestamp(state.lastFullPulledAt)}</div>
                  </div>
                </div>
                
                {/* エラー表示 */}
                {hasError && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    <strong>エラー:</strong> {state.lastError}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 補足説明 */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3">補足説明</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>
            <strong>Full Pull Now:</strong> 該当テーブルのlastPulledAtをnullにして次回autoPullで全件取得を強制します。
          </div>
          <div>
            <strong>Reset State:</strong> 該当テーブルのIncremental Pull状態をリセットします。次回autoPullでFull Pullになります。
          </div>
          <div>
            <strong>差分キー:</strong> clients/tasks/approvals/contracts=updated_at、comments/notifications=created_at
          </div>
          <div>
            <strong>エラー時:</strong> lastPulledAtは更新されず、次回Pull時に再試行されます（取りこぼし防止）。
          </div>
        </div>
      </div>
    </div>
  );
}
