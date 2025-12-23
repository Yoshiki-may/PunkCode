// autoPullState.ts
// Phase 8.5: Incremental Pull状態管理
// テーブル別にlastPulledAtを保存・管理

import { storage } from './storage';

const STATE_KEY = 'palss_autopull_state_v1';

// テーブル別Pull状態
export interface TablePullState {
  lastPulledAt: string | null; // 最後に差分取得した時刻（ISO 8601）
  lastFullPulledAt: string | null; // 最後に全件取得した時刻（ISO 8601）
  lastError?: string; // 最後のエラー
}

// autoPull全体の状態
export interface AutoPullState {
  tables: {
    clients: TablePullState;
    tasks: TablePullState;
    approvals: TablePullState;
    comments: TablePullState;
    contracts: TablePullState;
    notifications: TablePullState;
  };
}

// デフォルト状態
function getDefaultState(): AutoPullState {
  return {
    tables: {
      clients: { lastPulledAt: null, lastFullPulledAt: null },
      tasks: { lastPulledAt: null, lastFullPulledAt: null },
      approvals: { lastPulledAt: null, lastFullPulledAt: null },
      comments: { lastPulledAt: null, lastFullPulledAt: null },
      contracts: { lastPulledAt: null, lastFullPulledAt: null },
      notifications: { lastPulledAt: null, lastFullPulledAt: null }
    }
  };
}

// 状態取得
export function getAutoPullState(): AutoPullState {
  const state = storage.get<AutoPullState>(STATE_KEY);
  return state || getDefaultState();
}

// 状態保存
export function setAutoPullState(state: AutoPullState): void {
  storage.set(STATE_KEY, state);
}

// テーブル別lastPulledAt取得
export function getLastPulledAt(table: keyof AutoPullState['tables']): string | null {
  const state = getAutoPullState();
  return state.tables[table].lastPulledAt;
}

// テーブル別lastPulledAt更新（成功時のみ）
export function setLastPulledAt(table: keyof AutoPullState['tables'], timestamp: string): void {
  const state = getAutoPullState();
  state.tables[table].lastPulledAt = timestamp;
  state.tables[table].lastError = undefined;
  setAutoPullState(state);
}

// テーブル別lastFullPulledAt更新（全件取得時のみ）
export function setLastFullPulledAt(table: keyof AutoPullState['tables'], timestamp: string): void {
  const state = getAutoPullState();
  state.tables[table].lastFullPulledAt = timestamp;
  state.tables[table].lastPulledAt = timestamp;
  state.tables[table].lastError = undefined;
  setAutoPullState(state);
}

// エラー記録
export function setTableError(table: keyof AutoPullState['tables'], error: string): void {
  const state = getAutoPullState();
  state.tables[table].lastError = error;
  setAutoPullState(state);
}

// 状態リセット（Full Pullを強制）
export function resetTableState(table: keyof AutoPullState['tables']): void {
  const state = getAutoPullState();
  state.tables[table] = { lastPulledAt: null, lastFullPulledAt: null };
  setAutoPullState(state);
}

// 全テーブル状態リセット
export function resetAllTableStates(): void {
  setAutoPullState(getDefaultState());
}

// Full Pull判定
export function shouldFullPull(table: keyof AutoPullState['tables']): boolean {
  const lastPulledAt = getLastPulledAt(table);
  return lastPulledAt === null;
}
