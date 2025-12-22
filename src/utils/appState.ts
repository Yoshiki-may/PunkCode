// グローバルアプリケーション状態管理
// UIの見た目を変えず、データ配線のための状態管理

import { storage, STORAGE_KEYS } from './storage';

export interface AppState {
  // 選択中のクライアント（グローバル）
  selectedClientId: string | null;
  
  // 各ボード専用の選択クライアント（既存の動作を維持）
  selectedSalesClientId: string | null;
  selectedDirectionClientId: string | null;
  selectedEditorClientId: string | null;
  selectedCreatorClientId: string | null;
  selectedClientBoardClientId: string | null;
  
  // 現在のビュー/画面
  currentView: string;
  currentBoard: string;
  
  // データモード（Mock / Supabase）
  dataMode: 'mock' | 'supabase';
  
  // その他のUI状態
  theme: 'light' | 'dark' | 'feminine' | 'palss';
}

const DEFAULT_APP_STATE: AppState = {
  selectedClientId: null,
  selectedSalesClientId: null,
  selectedDirectionClientId: null,
  selectedEditorClientId: null,
  selectedCreatorClientId: null,
  selectedClientBoardClientId: null,
  currentView: 'home',
  currentBoard: 'sales',
  dataMode: 'mock',
  theme: 'palss'
};

// アプリ状態の取得
export const getAppState = (): AppState => {
  const state = storage.get<AppState>(STORAGE_KEYS.APP_STATE);
  return state || DEFAULT_APP_STATE;
};

// アプリ状態の保存
export const setAppState = (updates: Partial<AppState>): boolean => {
  const currentState = getAppState();
  const newState = { ...currentState, ...updates };
  return storage.set(STORAGE_KEYS.APP_STATE, newState);
};

// 選択中クライアントの取得
export const getSelectedClientId = (): string | null => {
  const state = getAppState();
  return state.selectedClientId;
};

// 選択中クライアントの設定
export const setSelectedClientId = (clientId: string | null): boolean => {
  return setAppState({ selectedClientId: clientId });
};

// ボード別の選択クライアント取得（既存の動作を維持）
export const getSelectedClientIdForBoard = (board: string): string | null => {
  const state = getAppState();
  switch (board) {
    case 'sales':
      return state.selectedSalesClientId;
    case 'direction':
      return state.selectedDirectionClientId;
    case 'editor':
      return state.selectedEditorClientId;
    case 'creator':
      return state.selectedCreatorClientId;
    case 'client':
      return state.selectedClientBoardClientId;
    default:
      return state.selectedClientId;
  }
};

// ボード別の選択クライアント設定
export const setSelectedClientIdForBoard = (board: string, clientId: string | null): boolean => {
  const updates: Partial<AppState> = {};
  
  switch (board) {
    case 'sales':
      updates.selectedSalesClientId = clientId;
      break;
    case 'direction':
      updates.selectedDirectionClientId = clientId;
      break;
    case 'editor':
      updates.selectedEditorClientId = clientId;
      break;
    case 'creator':
      updates.selectedCreatorClientId = clientId;
      break;
    case 'client':
      updates.selectedClientBoardClientId = clientId;
      break;
    default:
      updates.selectedClientId = clientId;
  }
  
  // グローバルにも反映
  updates.selectedClientId = clientId;
  
  return setAppState(updates);
};

// データモードの取得
export const getDataMode = (): 'mock' | 'supabase' => {
  const state = getAppState();
  return state.dataMode;
};

// データモードの設定
export const setDataMode = (mode: 'mock' | 'supabase'): boolean => {
  return setAppState({ dataMode: mode });
};

// 現在のビュー/ボードの取得
export const getCurrentView = (): { view: string; board: string } => {
  const state = getAppState();
  return {
    view: state.currentView,
    board: state.currentBoard
  };
};

// 現在のビュー/ボードの設定
export const setCurrentView = (view: string, board?: string): boolean => {
  const updates: Partial<AppState> = { currentView: view };
  if (board) {
    updates.currentBoard = board;
  }
  return setAppState(updates);
};

// アプリ状態をリセット（ユーザー切り替え時などに使用）
export const resetAppState = (): boolean => {
  return storage.set(STORAGE_KEYS.APP_STATE, DEFAULT_APP_STATE);
};