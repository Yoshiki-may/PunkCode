// User Profile Resolution
// Phase 9.2: usersテーブルからrole/org_id/client_idを解決

import { getSupabaseClient } from './supabase';
import { getCurrentUser, setCurrentUser } from './mockDatabase';
import type { User } from '../types';

// ==============================
// Types
// ==============================

export interface UserProfile {
  id: string;
  authUid?: string;
  email: string;
  name: string;
  role: 'sales' | 'direction' | 'editor' | 'creator' | 'control' | 'client';
  orgId: string;
  clientId?: string; // clientロールの場合のみ
  createdAt?: string;
  updatedAt?: string;
}

// ==============================
// Get User Profile from Supabase
// ==============================

export async function getUserProfileByAuthUid(authUid: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }
  
  try {
    // usersテーブルからauth_uidで検索
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_uid', authUid)
      .single();
    
    if (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
    
    if (!data) {
      console.warn('User profile not found for auth_uid:', authUid);
      return null;
    }
    
    // UserProfile型に変換
    return {
      id: data.id,
      authUid: data.auth_uid,
      email: data.email,
      name: data.name || data.email,
      role: data.role,
      orgId: data.org_id,
      clientId: data.client_id || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// ==============================
// Get User Profile by ID
// ==============================

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      authUid: data.auth_uid,
      email: data.email,
      name: data.name || data.email,
      role: data.role,
      orgId: data.org_id,
      clientId: data.client_id || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    return null;
  }
}

// ==============================
// Sync Profile to App State
// ==============================

export function syncProfileToAppState(profile: UserProfile): void {
  // UserProfile → User 型に変換
  const user: User = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    orgId: profile.orgId,
    clientId: profile.clientId,
  };
  
  // 既存のmockDatabase形式で保存（UI変更なし）
  setCurrentUser(user);
  
  console.log('[UserProfile] Synced to app state:', user);
}

// ==============================
// Clear Profile from App State
// ==============================

export function clearProfileFromAppState(): void {
  // LocalStorageから削除
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('current_user');
  }
  
  console.log('[UserProfile] Cleared from app state');
}

// ==============================
// Get Current Profile
// ==============================

export function getCurrentProfile(): User | null {
  return getCurrentUser();
}

// ==============================
// Validate Profile for RLS
// ==============================

export interface ProfileValidation {
  valid: boolean;
  issues: string[];
}

export function validateProfile(profile: UserProfile | null): ProfileValidation {
  const issues: string[] = [];
  
  if (!profile) {
    issues.push('プロファイルが見つかりません');
    return { valid: false, issues };
  }
  
  if (!profile.id) {
    issues.push('ユーザーIDが設定されていません');
  }
  
  if (!profile.role) {
    issues.push('ロールが設定されていません');
  }
  
  if (!profile.orgId) {
    issues.push('組織IDが設定されていません');
  }
  
  if (profile.role === 'client' && !profile.clientId) {
    issues.push('クライアントロールですが、client_idが設定されていません');
  }
  
  if (!profile.authUid) {
    issues.push('auth_uidが設定されていません（usersテーブルに登録が必要）');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// ==============================
// Get All Users (Admin)
// ==============================

export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Failed to get all user profiles:', error);
      return [];
    }
    
    return (data || []).map(user => ({
      id: user.id,
      authUid: user.auth_uid,
      email: user.email,
      name: user.name || user.email,
      role: user.role,
      orgId: user.org_id,
      clientId: user.client_id || undefined,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching all user profiles:', error);
    return [];
  }
}

// ==============================
// Check if User Exists
// ==============================

export async function checkUserExists(authUid: string): Promise<boolean> {
  const profile = await getUserProfileByAuthUid(authUid);
  return !!profile;
}

// ==============================
// Create User Profile (for onboarding)
// ==============================

export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
  success: boolean;
  error?: string;
  profile?: UserProfile;
}> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return {
      success: false,
      error: 'Supabaseが設定されていません',
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_uid: profile.authUid,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        org_id: profile.orgId,
        client_id: profile.clientId || null,
      })
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
      profile: {
        id: data.id,
        authUid: data.auth_uid,
        email: data.email,
        name: data.name,
        role: data.role,
        orgId: data.org_id,
        clientId: data.client_id || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'ユーザープロファイルの作成に失敗しました',
    };
  }
}
