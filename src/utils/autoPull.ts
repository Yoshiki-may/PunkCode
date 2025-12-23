// autoPull.ts
// Phase 9.3: Supabase → LocalStorage 自動取り込み（SSOT化）
// Phase 8: パフォーマンス計測追加
// Phase 8.5: Incremental Pull対応（Full/Incremental分岐 + マージ処理）
// 既存の同期ReadロジックはそのままにLocalStorageをキャッシュとして自動更新

import { storage, STORAGE_KEYS } from './storage';
import { getRepositoryFactory } from '../repositories';
import { getCurrentDataMode } from './supabase';
import { getCurrentAuthUser } from './auth';
import type { Task, Approval, Comment, Contract, Client, Notification } from '../types';
import { recordAutoPullMetric } from './performance';
import {
  getAutoPullState,
  setLastPulledAt,
  setLastFullPulledAt,
  setTableError,
  shouldFullPull
} from './autoPullState';

// autoPull設定
export interface AutoPullConfig {
  enabled: boolean;
  intervalSec: number;
  lastPullAt?: string;
  lastError?: string;
  lastPullCounts?: {
    clients: number;
    tasks: number;
    approvals: number;
    comments: number;
    contracts: number;
    notifications: number;
  };
}

const CONFIG_KEY = 'palss_autopull_config';
const DEFAULT_INTERVAL = 60; // 60秒
const INCREMENTAL_LIMIT = 500; // 1ページあたりの取得件数
const MAX_PAGES = 10; // 最大ページ数

// 設定取得
export function getAutoPullConfig(): AutoPullConfig {
  const config = storage.get<AutoPullConfig>(CONFIG_KEY);
  return config || {
    enabled: true,
    intervalSec: DEFAULT_INTERVAL
  };
}

// 設定保存
export function setAutoPullConfig(config: Partial<AutoPullConfig>): boolean {
  const current = getAutoPullConfig();
  const updated = { ...current, ...config };
  return storage.set(CONFIG_KEY, updated);
}

// グローバルタイマー参照
let autoPullTimerId: number | null = null;

// ==============================
// Phase 8.5: マージ処理ヘルパー
// ==============================

// id主キーでマージ（updated_at競合解決）
function mergeByIdWithUpdatedAt<T extends { id: string; updatedAt?: string }>(
  existing: T[],
  incoming: T[]
): T[] {
  const merged = new Map<string, T>();
  
  // 既存データを格納
  existing.forEach(item => merged.set(item.id, item));
  
  // 新規データで上書き（updated_atが新しい方を優先）
  incoming.forEach(item => {
    const existingItem = merged.get(item.id);
    if (!existingItem) {
      merged.set(item.id, item);
    } else if (item.updatedAt && existingItem.updatedAt) {
      // updated_atを比較
      if (item.updatedAt >= existingItem.updatedAt) {
        merged.set(item.id, item);
      }
    } else {
      // updated_atがない場合はSupabaseを優先（SSOT）
      merged.set(item.id, item);
    }
  });
  
  return Array.from(merged.values());
}

// id主キーでマージ（created_atのみ、Supabase優先）
function mergeByIdWithCreatedAt<T extends { id: string }>(
  existing: T[],
  incoming: T[]
): T[] {
  const merged = new Map<string, T>();
  
  // 既存データを格納
  existing.forEach(item => merged.set(item.id, item));
  
  // 新規データで上書き（Supabaseを優先）
  incoming.forEach(item => merged.set(item.id, item));
  
  return Array.from(merged.values());
}

// 配列の最大タイムスタンプ取得
function getLatestTimestamp<T extends { updatedAt?: string; createdAt?: string }>(
  items: T[]
): string | undefined {
  if (items.length === 0) return undefined;
  
  const timestamps = items.map(item => item.updatedAt || item.createdAt || '').filter(Boolean);
  if (timestamps.length === 0) return undefined;
  
  return timestamps.reduce((max, ts) => (ts > max ? ts : max));
}

// ==============================
// Phase 8.5: テーブル別Pull処理
// ==============================

// Clients Pull（updated_atベース）
async function pullClients(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'clients';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const clients = await repos.clients.getAllClients();
      storage.set(STORAGE_KEYS.CLIENTS, clients);
      
      const latestTimestamp = getLatestTimestamp(clients);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.clients = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${clients.length} (Full, ${breakdown.clients}ms)`);
      return clients.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.clients.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Client[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.clients.getClientsIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ
      if (allItems.length > 0) {
        const existing = storage.get<Client[]>(STORAGE_KEYS.CLIENTS) || [];
        const merged = mergeByIdWithUpdatedAt(existing, allItems);
        storage.set(STORAGE_KEYS.CLIENTS, merged);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.clients = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.clients}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.clients = Math.round(performance.now() - t0);
    throw err;
  }
}

// Tasks Pull（updated_atベース）
async function pullTasks(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'tasks';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const tasks = await repos.tasks.getAllTasks();
      
      // clientId別にグルーピング
      const tasksByClient: Record<string, Task[]> = {};
      tasks.forEach(task => {
        const cid = task.clientId || '';
        if (!tasksByClient[cid]) tasksByClient[cid] = [];
        tasksByClient[cid].push(task);
      });
      
      storage.set(STORAGE_KEYS.CLIENT_TASKS, tasksByClient);
      
      const latestTimestamp = getLatestTimestamp(tasks);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.tasks = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${tasks.length} (Full, ${breakdown.tasks}ms)`);
      return tasks.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.tasks.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Task[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.tasks.getTasksIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ
      if (allItems.length > 0) {
        // 既存のRecord<clientId, Task[]>を配列に変換
        const existingRecord = storage.get<Record<string, Task[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
        const existingArray = Object.values(existingRecord).flat();
        
        // マージ
        const merged = mergeByIdWithUpdatedAt(existingArray, allItems);
        
        // 再グルーピング
        const tasksByClient: Record<string, Task[]> = {};
        merged.forEach(task => {
          const cid = task.clientId || '';
          if (!tasksByClient[cid]) tasksByClient[cid] = [];
          tasksByClient[cid].push(task);
        });
        
        storage.set(STORAGE_KEYS.CLIENT_TASKS, tasksByClient);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.tasks = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.tasks}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.tasks = Math.round(performance.now() - t0);
    throw err;
  }
}

// Approvals Pull（updated_atベース）
async function pullApprovals(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'approvals';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const approvals = await repos.approvals.getAllApprovals();
      
      // clientId別にグルーピング
      const approvalsByClient: Record<string, Approval[]> = {};
      approvals.forEach(approval => {
        const cid = approval.clientId || '';
        if (!approvalsByClient[cid]) approvalsByClient[cid] = [];
        approvalsByClient[cid].push(approval);
      });
      
      storage.set(STORAGE_KEYS.CLIENT_APPROVALS, approvalsByClient);
      
      const latestTimestamp = getLatestTimestamp(approvals);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.approvals = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${approvals.length} (Full, ${breakdown.approvals}ms)`);
      return approvals.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.approvals.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Approval[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.approvals.getApprovalsIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ
      if (allItems.length > 0) {
        // 既存のRecord<clientId, Approval[]>を配列に変換
        const existingRecord = storage.get<Record<string, Approval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
        const existingArray = Object.values(existingRecord).flat();
        
        // マージ
        const merged = mergeByIdWithUpdatedAt(existingArray, allItems);
        
        // 再グルーピング
        const approvalsByClient: Record<string, Approval[]> = {};
        merged.forEach(approval => {
          const cid = approval.clientId || '';
          if (!approvalsByClient[cid]) approvalsByClient[cid] = [];
          approvalsByClient[cid].push(approval);
        });
        
        storage.set(STORAGE_KEYS.CLIENT_APPROVALS, approvalsByClient);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.approvals = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.approvals}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.approvals = Math.round(performance.now() - t0);
    throw err;
  }
}

// Comments Pull（created_atベース）
async function pullComments(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'comments';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const comments = await repos.comments.getAllComments();
      storage.set(STORAGE_KEYS.COMMENTS, comments);
      
      const latestTimestamp = getLatestTimestamp(comments);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.comments = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${comments.length} (Full, ${breakdown.comments}ms)`);
      return comments.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.comments.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Comment[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.comments.getCommentsIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ（created_atのみ、Supabase優先）
      if (allItems.length > 0) {
        const existing = storage.get<Comment[]>(STORAGE_KEYS.COMMENTS) || [];
        const merged = mergeByIdWithCreatedAt(existing, allItems);
        storage.set(STORAGE_KEYS.COMMENTS, merged);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.comments = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.comments}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.comments = Math.round(performance.now() - t0);
    throw err;
  }
}

// Contracts Pull（updated_atベース）
async function pullContracts(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'contracts';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const contracts = await repos.contracts.getAllContracts();
      storage.set(STORAGE_KEYS.CONTRACTS, contracts);
      
      const latestTimestamp = getLatestTimestamp(contracts);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.contracts = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${contracts.length} (Full, ${breakdown.contracts}ms)`);
      return contracts.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.contracts.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Contract[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.contracts.getContractsIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ
      if (allItems.length > 0) {
        const existing = storage.get<Contract[]>(STORAGE_KEYS.CONTRACTS) || [];
        const merged = mergeByIdWithUpdatedAt(existing, allItems);
        storage.set(STORAGE_KEYS.CONTRACTS, merged);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.contracts = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.contracts}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.contracts = Math.round(performance.now() - t0);
    throw err;
  }
}

// Notifications Pull（created_atベース）
async function pullNotifications(repos: any, breakdown: any): Promise<number> {
  const t0 = performance.now();
  const tableName = 'notifications';
  
  try {
    if (shouldFullPull(tableName)) {
      // Full Pull
      console.log(`[autoPull] ${tableName}: Full Pull`);
      const notifications = await repos.notifications.getAllNotifications();
      storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
      
      const latestTimestamp = getLatestTimestamp(notifications);
      if (latestTimestamp) {
        setLastFullPulledAt(tableName, latestTimestamp);
      }
      
      breakdown.notifications = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${notifications.length} (Full, ${breakdown.notifications}ms)`);
      return notifications.length;
    } else {
      // Incremental Pull
      const state = getAutoPullState();
      const since = state.tables.notifications.lastPulledAt;
      console.log(`[autoPull] ${tableName}: Incremental Pull (since=${since})`);
      
      let allItems: Notification[] = [];
      let currentSince = since;
      let hasMore = true;
      let pageCount = 0;
      
      while (hasMore && pageCount < MAX_PAGES) {
        const result = await repos.notifications.getNotificationsIncremental({
          since: currentSince!,
          limit: INCREMENTAL_LIMIT
        });
        
        allItems.push(...result.items);
        
        if (!result.hasMore || !result.latestTimestamp) {
          hasMore = false;
        } else {
          currentSince = result.latestTimestamp;
        }
        
        pageCount++;
      }
      
      // マージ（created_atのみ、Supabase優先）
      if (allItems.length > 0) {
        const existing = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
        const merged = mergeByIdWithCreatedAt(existing, allItems);
        storage.set(STORAGE_KEYS.NOTIFICATIONS, merged);
        
        const latestTimestamp = getLatestTimestamp(allItems);
        if (latestTimestamp) {
          setLastPulledAt(tableName, latestTimestamp);
        }
      }
      
      breakdown.notifications = Math.round(performance.now() - t0);
      console.log(`[autoPull] ${tableName}: ${allItems.length} (Incremental, ${breakdown.notifications}ms)`);
      return allItems.length;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[autoPull] ${tableName} failed:`, errorMsg);
    setTableError(tableName, errorMsg);
    breakdown.notifications = Math.round(performance.now() - t0);
    throw err;
  }
}

// ==============================
// autoPull実行（メイン処理）
// ==============================
export async function executeAutoPull(): Promise<boolean> {
  const mode = getCurrentDataMode();
  const config = getAutoPullConfig();
  
  // mockモードまたは無効時はスキップ
  if (mode === 'mock' || !config.enabled) {
    console.log('[autoPull] Skipped (mode=mock or disabled)');
    return false;
  }
  
  const authUser = getCurrentAuthUser();
  if (!authUser) {
    console.log('[autoPull] Skipped (no auth user)');
    return false;
  }
  
  console.log('[autoPull] Starting autoPull...');
  const startTime = performance.now();
  
  try {
    const repos = getRepositoryFactory();
    const counts = {
      clients: 0,
      tasks: 0,
      approvals: 0,
      comments: 0,
      contracts: 0,
      notifications: 0
    };
    const breakdown = {
      clients: 0,
      tasks: 0,
      approvals: 0,
      comments: 0,
      contracts: 0,
      notifications: 0
    };
    
    // テーブル別にPull（エラーが起きても他のテーブルは続行）
    try {
      counts.clients = await pullClients(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    try {
      counts.tasks = await pullTasks(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    try {
      counts.approvals = await pullApprovals(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    try {
      counts.comments = await pullComments(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    try {
      counts.contracts = await pullContracts(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    try {
      counts.notifications = await pullNotifications(repos, breakdown);
    } catch (err) {
      // エラーは既に記録済み
    }
    
    // パフォーマンス計測記録
    const totalDurationMs = Math.round(performance.now() - startTime);
    recordAutoPullMetric(totalDurationMs, counts, breakdown);
    
    // 成功記録
    setAutoPullConfig({
      lastPullAt: new Date().toISOString(),
      lastError: undefined,
      lastPullCounts: counts
    });
    
    console.log(`[autoPull] Completed: ${totalDurationMs}ms`, counts);
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[autoPull] Failed:', errorMsg);
    
    // エラー記録
    setAutoPullConfig({
      lastPullAt: new Date().toISOString(),
      lastError: errorMsg
    });
    
    return false;
  }
}

// autoPull開始（タイマー起動）
export function startAutoPull(): void {
  const mode = getCurrentDataMode();
  const config = getAutoPullConfig();
  
  // mockモードまたは無効時はスキップ
  if (mode === 'mock' || !config.enabled) {
    console.log('[autoPull] Start skipped (mode=mock or disabled)');
    return;
  }
  
  // 既存タイマーがあれば停止
  stopAutoPull();
  
  console.log(`[autoPull] Starting with interval ${config.intervalSec}s`);
  
  // 初回は即座に実行
  executeAutoPull();
  
  // 定期実行タイマー設定
  autoPullTimerId = window.setInterval(() => {
    executeAutoPull();
  }, config.intervalSec * 1000);
}

// autoPull停止
export function stopAutoPull(): void {
  if (autoPullTimerId !== null) {
    console.log('[autoPull] Stopping');
    clearInterval(autoPullTimerId);
    autoPullTimerId = null;
  }
}

// 設定変更時に再起動
export function restartAutoPull(): void {
  stopAutoPull();
  startAutoPull();
}
