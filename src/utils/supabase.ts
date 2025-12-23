// Supabase Client Configuration
// Phase 9: Supabase統合

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 環境変数から接続情報を取得
// Vite環境では import.meta.env が使えないため、空文字列をデフォルトにする
const supabaseUrl = '';
const supabaseAnonKey = '';

// Supabaseクライアント（接続情報が無い場合はnull）
let supabaseClient: SupabaseClient | null = null;

// 接続情報が設定されているかチェック
export function hasSupabaseConfig(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your-project-url.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here');
}

// Supabaseクライアントを取得（初期化）
export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseConfig()) {
    // Supabase未設定 - Mockモードで動作
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  
  return supabaseClient;
}

// データモードの型定義
export type DataMode = 'mock' | 'supabase';

// 現在のデータモードを取得
export function getCurrentDataMode(): DataMode {
  // QAパネルで設定されたモードを優先
  if (typeof localStorage !== 'undefined') {
    const qaMode = localStorage.getItem('palss_data_mode');
    if (qaMode === 'supabase' || qaMode === 'mock') {
      return qaMode;
    }
  }
  
  // デフォルトはMock（Supabase接続情報が無い場合は必ずMock）
  return 'mock';
}

// データモードを設定
export function setDataMode(mode: DataMode): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('palss_data_mode', mode);
    console.log(`Data mode switched to: ${mode}`);
  }
}

// Supabaseが利用可能かチェック
export function isSupabaseAvailable(): boolean {
  return hasSupabaseConfig() && getCurrentDataMode() === 'supabase';
}

// Export client for direct access
export const supabase = getSupabaseClient();
