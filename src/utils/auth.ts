// Supabase Auth Utility
// Phase 9.2: Supabase Auth統合

import { getSupabaseClient, getCurrentDataMode } from './supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ==============================
// Types
// ==============================

export interface AuthState {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
}

export type AuthStateChangeCallback = (state: AuthState) => void;

// ==============================
// Auth State Management
// ==============================

let currentAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  session: null,
  loading: true,
};

const authStateChangeCallbacks: AuthStateChangeCallback[] = [];

// ==============================
// Initialize Auth Listener
// ==============================

export function initializeAuthListener(): void {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    // Supabase未設定の場合はスキップ
    currentAuthState.loading = false;
    notifyAuthStateChange();
    return;
  }
  
  // 初期セッション取得
  supabase.auth.getSession().then(({ data: { session } }) => {
    currentAuthState = {
      isAuthenticated: !!session,
      user: session?.user || null,
      session: session,
      loading: false,
    };
    notifyAuthStateChange();
  });
  
  // Auth状態の変化を監視
  supabase.auth.onAuthStateChange((_event, session) => {
    currentAuthState = {
      isAuthenticated: !!session,
      user: session?.user || null,
      session: session,
      loading: false,
    };
    notifyAuthStateChange();
  });
}

// ==============================
// Auth State Subscription
// ==============================

export function onAuthStateChange(callback: AuthStateChangeCallback): () => void {
  authStateChangeCallbacks.push(callback);
  
  // 初回実行
  callback(currentAuthState);
  
  // Unsubscribe function
  return () => {
    const index = authStateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      authStateChangeCallbacks.splice(index, 1);
    }
  };
}

function notifyAuthStateChange(): void {
  authStateChangeCallbacks.forEach(callback => {
    callback(currentAuthState);
  });
}

// ==============================
// Get Current Auth State
// ==============================

export function getAuthState(): AuthState {
  return currentAuthState;
}

export function getCurrentSession(): Session | null {
  return currentAuthState.session;
}

export function getCurrentAuthUser(): SupabaseUser | null {
  return currentAuthState.user;
}

// ==============================
// Sign In with Email/Password
// ==============================

export async function signInWithPassword(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  user?: SupabaseUser;
}> {
  const dataMode = getCurrentDataMode();
  
  if (dataMode !== 'supabase') {
    return {
      success: false,
      error: 'Supabaseモードではありません。QAパネルでデータモードを切り替えてください。',
    };
  }
  
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabaseが設定されていません。',
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'ログインに失敗しました',
    };
  }
}

// ==============================
// Sign In with Magic Link
// ==============================

export async function signInWithMagicLink(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const dataMode = getCurrentDataMode();
  
  if (dataMode !== 'supabase') {
    return {
      success: false,
      error: 'Supabaseモードではありません。',
    };
  }
  
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabaseが設定されていません。',
    };
  }
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Magic Link送信に失敗しました',
    };
  }
}

// ==============================
// Sign Out
// ==============================

export async function signOut(): Promise<{
  success: boolean;
  error?: string;
}> {
  const dataMode = getCurrentDataMode();
  
  if (dataMode !== 'supabase') {
    // Mockモードの場合は何もしない
    return { success: true };
  }
  
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return { success: true };
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'ログアウトに失敗しました',
    };
  }
}

// ==============================
// Get Session
// ==============================

export async function getSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return null;
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

// ==============================
// Check if Authenticated
// ==============================

export function isAuthenticated(): boolean {
  return currentAuthState.isAuthenticated;
}

// ==============================
// Sign Up (for reference, not used in MVP)
// ==============================

export async function signUp(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  user?: SupabaseUser;
}> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabaseが設定されていません。',
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
      user: data.user || undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'サインアップに失敗しました',
    };
  }
}
