// outbox.ts
// Phase 9.3: Write失敗時の未送信キュー（リトライ可能にする）

import { storage } from './storage';
import { getCurrentDataMode } from './supabase';
import { getRepositoryFactory } from '../repositories';

const OUTBOX_KEY = 'palss_outbox_v1';
const MAX_SENT_HISTORY = 50; // sent履歴の最大保持件数

// Outbox操作タイプ
export type OutboxOp = 
  | 'task.create'
  | 'task.update'
  | 'approval.update'
  | 'comment.create'
  | 'contract.create'
  | 'contract.update'
  | 'notification.add'
  | 'notification.markRead'
  | 'notification.delete'
  | 'notification.clear'
  | 'notification.markAllRead';

// Outboxアイテム
export interface OutboxItem {
  id: string;
  op: OutboxOp;
  payload: any; // 最小限のpayload（個人情報含めすぎない）
  createdAt: string;
  retryCount: number;
  lastAttemptAt?: string;
  lastError?: string;
  status: 'pending' | 'failed' | 'sent';
}

// 全Outboxアイテム取得
export function getAllOutboxItems(): OutboxItem[] {
  return storage.get<OutboxItem[]>(OUTBOX_KEY) || [];
}

// Outboxアイテム追加
export function addOutboxItem(op: OutboxOp, payload: any): string {
  const items = getAllOutboxItems();
  
  const newItem: OutboxItem = {
    id: `outbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    op,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: 'pending'
  };
  
  items.push(newItem);
  storage.set(OUTBOX_KEY, items);
  
  console.log(`[outbox] Added: ${op} (${newItem.id})`);
  return newItem.id;
}

// Outboxアイテム更新
export function updateOutboxItem(
  id: string,
  updates: Partial<Pick<OutboxItem, 'status' | 'lastAttemptAt' | 'lastError' | 'retryCount'>>
): boolean {
  const items = getAllOutboxItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  items[index] = {
    ...items[index],
    ...updates
  };
  
  storage.set(OUTBOX_KEY, items);
  return true;
}

// Outboxアイテム削除
export function deleteOutboxItem(id: string): boolean {
  const items = getAllOutboxItems();
  const filtered = items.filter(item => item.id !== id);
  storage.set(OUTBOX_KEY, filtered);
  return true;
}

// sent履歴のクリーンアップ
export function cleanupSentItems(): void {
  const items = getAllOutboxItems();
  const sent = items.filter(item => item.status === 'sent');
  const other = items.filter(item => item.status !== 'sent');
  
  // sentは最新N件のみ保持
  const recentSent = sent.slice(-MAX_SENT_HISTORY);
  
  storage.set(OUTBOX_KEY, [...other, ...recentSent]);
  console.log(`[outbox] Cleaned up sent items: ${sent.length} → ${recentSent.length}`);
}

// 全Outboxクリア（DEV用）
export function clearAllOutbox(): boolean {
  return storage.set(OUTBOX_KEY, []);
}

// Outbox統計
export interface OutboxStats {
  total: number;
  pending: number;
  failed: number;
  sent: number;
  oldestPending?: OutboxItem;
  latestFailed?: OutboxItem;
}

export function getOutboxStats(): OutboxStats {
  const items = getAllOutboxItems();
  
  const pending = items.filter(item => item.status === 'pending');
  const failed = items.filter(item => item.status === 'failed');
  const sent = items.filter(item => item.status === 'sent');
  
  const oldestPending = pending.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[0];
  
  const latestFailed = failed.sort((a, b) => 
    new Date(b.lastAttemptAt || b.createdAt).getTime() - 
    new Date(a.lastAttemptAt || a.createdAt).getTime()
  )[0];
  
  return {
    total: items.length,
    pending: pending.length,
    failed: failed.length,
    sent: sent.length,
    oldestPending,
    latestFailed
  };
}

// 単一アイテムのリトライ実行
export async function retryOutboxItem(item: OutboxItem): Promise<boolean> {
  const mode = getCurrentDataMode();
  
  // mockモードではスキップ
  if (mode === 'mock') {
    console.log('[outbox] Retry skipped (mock mode)');
    return false;
  }
  
  console.log(`[outbox] Retrying: ${item.op} (${item.id})`);
  
  try {
    const repos = getRepositoryFactory();
    
    // 操作に応じてRepository呼び出し
    switch (item.op) {
      case 'task.create':
        await repos.tasks.createTask(item.payload);
        break;
      
      case 'task.update':
        await repos.tasks.updateTask(item.payload.id, item.payload.updates);
        break;
      
      case 'approval.update':
        await repos.approvals.updateApproval(item.payload.id, item.payload.updates);
        break;
      
      case 'comment.create':
        await repos.comments.createComment(item.payload);
        break;
      
      case 'contract.create':
        await repos.contracts.createContract(item.payload);
        break;
      
      case 'contract.update':
        await repos.contracts.updateContract(item.payload.id, item.payload.updates);
        break;
      
      case 'notification.add':
        await repos.notifications.createNotification(item.payload);
        break;
      
      case 'notification.markRead':
        await repos.notifications.markAsRead(item.payload.id);
        break;
      
      case 'notification.delete':
        await repos.notifications.deleteNotification(item.payload.id);
        break;
      
      case 'notification.clear':
        await repos.notifications.clearNotifications();
        break;
      
      case 'notification.markAllRead':
        await repos.notifications.markAllAsRead();
        break;
      
      default:
        throw new Error(`Unknown operation: ${item.op}`);
    }
    
    // 成功
    updateOutboxItem(item.id, {
      status: 'sent',
      lastAttemptAt: new Date().toISOString(),
      lastError: undefined
    });
    
    console.log(`[outbox] Success: ${item.op} (${item.id})`);
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[outbox] Failed: ${item.op} (${item.id})`, errorMsg);
    
    // RLS拒否などpermanent failureの検出
    const isPermanent = errorMsg.includes('RLS') || 
                        errorMsg.includes('permission') || 
                        errorMsg.includes('403') ||
                        errorMsg.includes('unauthorized');
    
    updateOutboxItem(item.id, {
      status: isPermanent ? 'failed' : 'pending',
      lastAttemptAt: new Date().toISOString(),
      lastError: errorMsg,
      retryCount: item.retryCount + 1
    });
    
    return false;
  }
}

// 全pending/failedアイテムをリトライ
export async function retryAllOutbox(): Promise<{ success: number; failed: number }> {
  const items = getAllOutboxItems();
  const toRetry = items.filter(item => item.status === 'pending' || item.status === 'failed');
  
  console.log(`[outbox] Retrying ${toRetry.length} items...`);
  
  let success = 0;
  let failed = 0;
  
  for (const item of toRetry) {
    const result = await retryOutboxItem(item);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  console.log(`[outbox] Retry complete: ${success} success, ${failed} failed`);
  
  // sent履歴のクリーンアップ
  cleanupSentItems();
  
  return { success, failed };
}

// 指数バックオフでのリトライ判定（オプション機能）
export function shouldRetryWithBackoff(item: OutboxItem): boolean {
  const now = Date.now();
  const lastAttempt = item.lastAttemptAt ? new Date(item.lastAttemptAt).getTime() : 0;
  const elapsed = now - lastAttempt;
  
  // リトライ回数に応じた待機時間（指数バックオフ）
  const delays = [1000, 5000, 30000, 120000, 600000]; // 1s, 5s, 30s, 2m, 10m
  const delayIndex = Math.min(item.retryCount, delays.length - 1);
  const delay = delays[delayIndex];
  
  return elapsed >= delay;
}