// Performance Tab - パフォーマンス計測可視化
// Phase 8: パフォーマンス最適化

import { Activity, Zap, Clock, Database, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPerformanceMetrics, getAverageAutoPullDuration, clearPerformanceMetrics } from '../../utils/performance';
import { getAutoPullConfig } from '../../utils/autoPull';

export function PerformanceTab() {
  const [metrics, setMetrics] = useState(getPerformanceMetrics());
  const [autoPullConfig, setAutoPullConfig] = useState(getAutoPullConfig());
  
  const refresh = () => {
    setMetrics(getPerformanceMetrics());
    setAutoPullConfig(getAutoPullConfig());
  };
  
  useEffect(() => {
    refresh();
    // 5秒ごとに自動更新
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const avgAutoPullDuration = getAverageAutoPullDuration();
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP');
  };
  
  const getDurationColor = (ms: number) => {
    if (ms < 500) return 'text-green-600';
    if (ms < 2000) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg mb-1">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">
            パフォーマンス計測データ（DEV専用）
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('パフォーマンスメトリクスをクリアしますか？')) {
              clearPerformanceMetrics();
              refresh();
            }
          }}
          className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
        >
          Clear Metrics
        </button>
      </div>
      
      {/* autoPull統計 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-primary" />
          <h3 className="text-sm">autoPull Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 最終実行 */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Last Pull</div>
            <div className={`text-lg ${getDurationColor(metrics.lastAutoPullDurationMs || 0)}`}>
              {metrics.lastAutoPullDurationMs ? formatDuration(metrics.lastAutoPullDurationMs) : '-'}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTimestamp(metrics.lastAutoPullTimestamp)}
            </div>
          </div>
          
          {/* 平均時間 */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Average ({metrics.autoPullHistory.length} samples)
            </div>
            <div className={`text-lg ${getDurationColor(avgAutoPullDuration)}`}>
              {avgAutoPullDuration > 0 ? formatDuration(avgAutoPullDuration) : '-'}
            </div>
          </div>
          
          {/* 取得件数 */}
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground mb-2">Last Pull Counts</div>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Clients</div>
                <div>{metrics.lastAutoPullCounts?.clients || 0}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Tasks</div>
                <div>{metrics.lastAutoPullCounts?.tasks || 0}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Approvals</div>
                <div>{metrics.lastAutoPullCounts?.approvals || 0}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Comments</div>
                <div>{metrics.lastAutoPullCounts?.comments || 0}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Contracts</div>
                <div>{metrics.lastAutoPullCounts?.contracts || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* autoPull履歴 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-primary" />
          <h3 className="text-sm">autoPull History (Latest {metrics.autoPullHistory.length})</h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {metrics.autoPullHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No data yet
            </div>
          ) : (
            metrics.autoPullHistory.slice().reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-center gap-4">
                  <div className={getDurationColor(h.durationMs)}>
                    {formatDuration(h.durationMs)}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {formatTimestamp(h.timestamp)}
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {h.breakdown && (
                    <>
                      <span>C:{h.breakdown.clients}ms</span>
                      <span>T:{h.breakdown.tasks}ms</span>
                      <span>A:{h.breakdown.approvals}ms</span>
                      <span>Cm:{h.breakdown.comments}ms</span>
                      <span>Ct:{h.breakdown.contracts}ms</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Top遅延操作 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="text-sm">Slowest Operations (Top 10)</h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {metrics.slowestOperations.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No data yet
            </div>
          ) : (
            metrics.slowestOperations.map((op, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground text-xs">#{i + 1}</div>
                  <div>{op.name}</div>
                </div>
                <div className={getDurationColor(op.durationMs)}>
                  {formatDuration(op.durationMs)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 設定情報 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="size-4 text-primary" />
          <h3 className="text-sm">autoPull Configuration</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Enabled</span>
            <span className={autoPullConfig.enabled ? 'text-green-600' : 'text-red-600'}>
              {autoPullConfig.enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Interval</span>
            <span>{autoPullConfig.intervalSec}s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Pull At</span>
            <span>{formatTimestamp(autoPullConfig.lastPullAt)}</span>
          </div>
          {autoPullConfig.lastError && (
            <div className="p-2 bg-destructive/10 text-destructive rounded-lg text-xs">
              Error: {autoPullConfig.lastError}
            </div>
          )}
        </div>
      </div>
      
      {/* パフォーマンスガイド */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="size-4 text-blue-600" />
          <h3 className="text-sm text-blue-600">Performance Guide</h3>
        </div>
        <div className="text-xs text-blue-600/80 space-y-1">
          <div>• 🟢 &lt;500ms: Good</div>
          <div>• 🟡 500-2000ms: Acceptable</div>
          <div>• 🔴 &gt;2000ms: Needs optimization</div>
          <div className="pt-2 border-t border-blue-500/20">
            Optimization Tips:
          </div>
          <div>1. Check DB indexes (see Phase 8 doc)</div>
          <div>2. Enable incremental pull (coming soon)</div>
          <div>3. Reduce polling interval if needed</div>
        </div>
      </div>
    </div>
  );
}
