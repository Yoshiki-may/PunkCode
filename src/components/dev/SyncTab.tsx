// Sync Tab Component
// Phase 9.1: Mock ↔ Supabase データ同期UI

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Trash2, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  getSyncStats,
  getLastSyncTime,
  syncMockToSupabase,
  syncSupabaseToMock,
  checkDataIntegrity,
  createMockSnapshot,
  restoreMockSnapshot,
  hasSnapshot,
  getSnapshotTimestamp,
  clearSupabaseData,
  clearMockData,
  type SyncStats,
  type SyncProgress,
  type SyncResult,
  type IntegrityIssue,
  type TableName
} from '../../utils/syncManager';
import { hasSupabaseConfig } from '../../utils/supabase';

export function SyncTab() {
  const [stats, setStats] = useState<SyncStats[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  
  // Table selection
  const [selectedTables, setSelectedTables] = useState<Set<TableName>>(
    new Set(['clients', 'tasks', 'approvals', 'comments', 'contracts', 'notifications'])
  );
  
  // Sync progress
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress[]>([]);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  
  // Integrity check
  const [integrityIssues, setIntegrityIssues] = useState<IntegrityIssue[]>([]);
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  
  // Snapshot
  const [snapshotExists, setSnapshotExists] = useState(false);
  const [snapshotTime, setSnapshotTime] = useState<string | null>(null);
  
  // Danger operations
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<'mock' | 'supabase' | null>(null);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await getSyncStats();
      setStats(statsData);
      setLastSyncTime(getLastSyncTime());
      setSupabaseConfigured(hasSupabaseConfig());
      setSnapshotExists(hasSnapshot());
      setSnapshotTime(getSnapshotTimestamp());
    } catch (error) {
      console.error('Failed to load sync stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTableToggle = (table: TableName) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(table)) {
      newSelected.delete(table);
    } else {
      newSelected.add(table);
    }
    setSelectedTables(newSelected);
  };
  
  const handleSelectAll = () => {
    setSelectedTables(new Set(['clients', 'tasks', 'approvals', 'comments', 'contracts', 'notifications']));
  };
  
  const handleDeselectAll = () => {
    setSelectedTables(new Set());
  };
  
  // Mock → Supabase
  const handleSyncToSupabase = async () => {
    if (!supabaseConfigured) {
      alert('Supabaseが設定されていません。.envファイルを確認してください。');
      return;
    }
    
    if (selectedTables.size === 0) {
      alert('同期するテーブルを選択してください。');
      return;
    }
    
    if (!confirm(`${selectedTables.size}個のテーブルをMock → Supabaseへ同期しますか？\n\n同期対象: ${Array.from(selectedTables).join(', ')}`)) {
      return;
    }
    
    // Create snapshot before sync
    createMockSnapshot();
    setSnapshotExists(true);
    setSnapshotTime(getSnapshotTimestamp());
    
    setSyncing(true);
    setSyncProgress([]);
    setSyncResults([]);
    
    try {
      const results = await syncMockToSupabase(
        Array.from(selectedTables),
        (progress) => {
          setSyncProgress(prev => {
            const filtered = prev.filter(p => p.tableName !== progress.tableName);
            return [...filtered, progress];
          });
        }
      );
      
      setSyncResults(results);
      alert('同期が完了しました。');
      await loadData();
    } catch (error: any) {
      alert(`同期エラー: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };
  
  // Supabase → Mock
  const handleSyncToMock = async () => {
    if (!supabaseConfigured) {
      alert('Supabaseが設定されていません。.envファイルを確認してください。');
      return;
    }
    
    if (selectedTables.size === 0) {
      alert('同期するテーブルを選択してください。');
      return;
    }
    
    if (!confirm(`${selectedTables.size}個のテーブルをSupabase → Mockへ同期しますか？\n\n⚠️ 警告: Mock側の既存データは上書きされます。\n同期対象: ${Array.from(selectedTables).join(', ')}`)) {
      return;
    }
    
    // Create snapshot before sync
    createMockSnapshot();
    setSnapshotExists(true);
    setSnapshotTime(getSnapshotTimestamp());
    
    setSyncing(true);
    setSyncProgress([]);
    setSyncResults([]);
    
    try {
      const results = await syncSupabaseToMock(
        Array.from(selectedTables),
        (progress) => {
          setSyncProgress(prev => {
            const filtered = prev.filter(p => p.tableName !== progress.tableName);
            return [...filtered, progress];
          });
        }
      );
      
      setSyncResults(results);
      alert('同期が完了しました。ページをリロードして反映してください。');
      await loadData();
    } catch (error: any) {
      alert(`同期エラー: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };
  
  // Integrity check
  const handleIntegrityCheck = async () => {
    setCheckingIntegrity(true);
    try {
      const issues = await checkDataIntegrity();
      setIntegrityIssues(issues);
      if (issues.length === 0) {
        alert('✅ データ整合性チェック: 問題なし');
      } else {
        alert(`⚠️ ${issues.length}件の整合性問題が見つかりました。`);
      }
    } catch (error: any) {
      alert(`整合性チェックエラー: ${error.message}`);
    } finally {
      setCheckingIntegrity(false);
    }
  };
  
  // Snapshot restore
  const handleRestoreSnapshot = () => {
    if (!confirm('Mockデータをスナップショットから復元しますか？\n\n現在のMockデータは失われます。')) {
      return;
    }
    
    const restored = restoreMockSnapshot();
    if (restored) {
      alert('スナップショットから復元しました。ページをリロードしてください。');
      window.location.reload();
    } else {
      alert('復元に失敗しました。スナップショットが見つかりません。');
    }
  };
  
  // Create snapshot manually
  const handleCreateSnapshot = () => {
    createMockSnapshot();
    setSnapshotExists(true);
    setSnapshotTime(getSnapshotTimestamp());
    alert('Mockデータのスナップショットを作成しました。');
  };
  
  // Clear operations
  const handleClearSupabase = async () => {
    if (deleteTarget !== 'supabase' || deleteConfirm !== 'DELETE') {
      alert('削除を実行するには、下の入力欄に "DELETE" と入力してください。');
      return;
    }
    
    if (!confirm('⚠️ 最終確認: Supabase の全データを削除しますか？\n\nこの操作は取り消せません。')) {
      return;
    }
    
    setLoading(true);
    try {
      await clearSupabaseData(Array.from(selectedTables));
      alert('Supabaseデータを削除しました。');
      setDeleteConfirm('');
      setDeleteTarget(null);
      await loadData();
    } catch (error: any) {
      alert(`削除エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearMock = () => {
    if (deleteTarget !== 'mock' || deleteConfirm !== 'DELETE') {
      alert('削除を実行するには、下の入力欄に "DELETE" と入力してください。');
      return;
    }
    
    if (!confirm('⚠️ 最終確認: Mock の全データを削除しますか？\n\nこの操作は取り消せません。')) {
      return;
    }
    
    clearMockData(Array.from(selectedTables));
    alert('Mockデータを削除しました。ページをリロードしてください。');
    setDeleteConfirm('');
    setDeleteTarget(null);
    window.location.reload();
  };
  
  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-accent/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-card-foreground">同期ステータス</h3>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Supabase接続</span>
            <span className={supabaseConfigured ? 'text-green-500' : 'text-yellow-500'}>
              {supabaseConfigured ? '✓ 設定済み' : '✗ 未設定'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">最終同期</span>
            <span className="text-card-foreground">
              {lastSyncTime ? new Date(lastSyncTime).toLocaleString('ja-JP') : '未実行'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">スナップショット</span>
            <span className="text-card-foreground">
              {snapshotExists ? `✓ ${snapshotTime ? new Date(snapshotTime).toLocaleString('ja-JP') : '有り'}` : '未作成'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats Table */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3">データ件数比較</h3>
        <div className="space-y-2">
          {stats.map((stat) => (
            <div key={stat.tableName} className="flex items-center gap-3 text-xs">
              <input
                type="checkbox"
                checked={selectedTables.has(stat.tableName)}
                onChange={() => handleTableToggle(stat.tableName)}
                className="rounded border-border"
              />
              <div className="flex-1">
                <span className="text-card-foreground capitalize">{stat.tableName}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Mock: {stat.mockCount}</span>
                <span>Supabase: {stat.supabaseCount}</span>
                <span className={stat.diff > 0 ? 'text-green-500' : stat.diff < 0 ? 'text-yellow-500' : ''}>
                  差分: {stat.diff > 0 ? '+' : ''}{stat.diff}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded transition-colors"
          >
            全選択
          </button>
          <button
            onClick={handleDeselectAll}
            className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded transition-colors"
          >
            全解除
          </button>
        </div>
      </div>
      
      {/* Sync Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSyncToSupabase}
          disabled={syncing || !supabaseConfigured || selectedTables.size === 0}
          className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Mock</span>
          <ArrowRight className="w-4 h-4" />
          <span>Supabase</span>
        </button>
        
        <button
          onClick={handleSyncToMock}
          disabled={syncing || !supabaseConfigured || selectedTables.size === 0}
          className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Supabase</span>
          <ArrowRight className="w-4 h-4" />
          <span>Mock</span>
        </button>
      </div>
      
      {/* Sync Progress */}
      {syncing && syncProgress.length > 0 && (
        <div className="bg-accent/30 rounded-xl p-4">
          <h3 className="text-sm text-card-foreground mb-3">同期進捗</h3>
          <div className="space-y-2">
            {syncProgress.map((progress) => (
              <div key={progress.tableName} className="flex items-center gap-3 text-xs">
                <div className="flex-1">
                  <span className="text-card-foreground capitalize">{progress.tableName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress.status === 'processing' && (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-muted-foreground">{progress.current}/{progress.total}</span>
                    </>
                  )}
                  {progress.status === 'success' && (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">完了</span>
                    </>
                  )}
                  {progress.status === 'error' && (
                    <>
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">エラー</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sync Results */}
      {syncResults.length > 0 && (
        <div className="bg-accent/30 rounded-xl p-4">
          <h3 className="text-sm text-card-foreground mb-3">同期結果</h3>
          <div className="space-y-2 text-xs">
            {syncResults.map((result) => (
              <div key={result.tableName} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-card-foreground capitalize">{result.tableName}</span>
                  <span className={result.success ? 'text-green-500' : 'text-red-500'}>
                    {result.success ? '✓ 成功' : '✗ 失敗'}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  作成: {result.created} / 更新: {result.updated} / 失敗: {result.failed}
                </div>
                {result.errors.length > 0 && (
                  <div className="text-red-500 text-xs">
                    {result.errors.slice(0, 3).map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                    {result.errors.length > 3 && <div>... 他{result.errors.length - 3}件</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Integrity Check */}
      <div className="bg-accent/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-card-foreground">データ整合性チェック</h3>
          <button
            onClick={handleIntegrityCheck}
            disabled={checkingIntegrity}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs disabled:opacity-50"
          >
            {checkingIntegrity ? '実行中...' : 'チェック実行'}
          </button>
        </div>
        
        {integrityIssues.length > 0 && (
          <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
            {integrityIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-yellow-500">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="capitalize">{issue.tableName}</span>: {issue.issue}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Snapshot */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3">スナップショット（バックアップ）</h3>
        <div className="space-y-2">
          <button
            onClick={handleCreateSnapshot}
            className="w-full px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm border border-border"
          >
            現在のMockデータをスナップショット
          </button>
          <button
            onClick={handleRestoreSnapshot}
            disabled={!snapshotExists}
            className="w-full px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm border border-border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            スナップショットから復元
          </button>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/30">
        <h3 className="text-sm text-destructive mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          危険操作（DEV専用）
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">削除対象を選択</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget('mock')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors border ${
                  deleteTarget === 'mock'
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                Mock削除
              </button>
              <button
                onClick={() => setDeleteTarget('supabase')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors border ${
                  deleteTarget === 'supabase'
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                Supabase削除
              </button>
            </div>
          </div>
          
          {deleteTarget && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                実行するには "DELETE" と入力してください
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-destructive/50 rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
              />
              
              {deleteTarget === 'mock' && (
                <button
                  onClick={handleClearMock}
                  disabled={deleteConfirm !== 'DELETE'}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mock全削除を実行
                </button>
              )}
              
              {deleteTarget === 'supabase' && (
                <button
                  onClick={handleClearSupabase}
                  disabled={deleteConfirm !== 'DELETE' || !supabaseConfigured}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Supabase全削除を実行
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
