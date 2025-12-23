// Auth Tab Component
// Phase 9.2: Supabase Auth状態表示（DEV専用）

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, User, Mail, Shield, Building2, Users as UsersIcon, AlertTriangle, RefreshCw } from 'lucide-react';
import { getAuthState, getCurrentAuthUser, getCurrentSession } from '../../utils/auth';
import { getCurrentProfile, validateProfile, getUserProfileByAuthUid } from '../../utils/userProfile';
import { getCurrentDataMode, hasSupabaseConfig } from '../../utils/supabase';
import type { UserProfile } from '../../utils/userProfile';

export function AuthTab() {
  const [authState, setAuthState] = useState(getAuthState());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState(getCurrentDataMode());
  const [supabaseConfigured, setSupabaseConfigured] = useState(hasSupabaseConfig());
  
  // Load data
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const state = getAuthState();
    setAuthState(state);
    setDataMode(getCurrentDataMode());
    setSupabaseConfigured(hasSupabaseConfig());
    
    // Supabaseモード & ログイン済みの場合、プロファイル取得
    if (dataMode === 'supabase' && state.user) {
      await loadProfile(state.user.id);
    } else if (dataMode === 'mock') {
      // Mockモードの場合は現在のユーザーを表示
      const currentProfile = getCurrentProfile();
      if (currentProfile) {
        setProfile({
          id: currentProfile.id,
          email: currentProfile.email,
          name: currentProfile.name,
          role: currentProfile.role,
          orgId: currentProfile.orgId || '',
          clientId: currentProfile.clientId,
        });
      }
    }
  };
  
  const loadProfile = async (authUid: string) => {
    setProfileLoading(true);
    setProfileError(null);
    
    try {
      const userProfile = await getUserProfileByAuthUid(authUid);
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfileError('usersテーブルにプロファイルが見つかりません');
      }
    } catch (error: any) {
      setProfileError(error.message || 'プロファイル取得エラー');
    } finally {
      setProfileLoading(false);
    }
  };
  
  const validation = validateProfile(profile);
  
  return (
    <div className="space-y-6">
      {/* Data Mode */}
      <div className="bg-accent/30 rounded-xl p-4">
        <h3 className="text-sm text-card-foreground mb-3">データモード</h3>
        <div className="flex items-center gap-3">
          <div className={`flex-1 px-4 py-3 rounded-lg border ${
            dataMode === 'mock'
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted border-border text-muted-foreground'
          }`}>
            <div className="text-sm font-medium">Mock (LocalStorage)</div>
            <div className="text-xs opacity-70">ローカル開発モード</div>
          </div>
          <div className={`flex-1 px-4 py-3 rounded-lg border ${
            dataMode === 'supabase'
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted border-border text-muted-foreground'
          }`}>
            <div className="text-sm font-medium">Supabase</div>
            <div className="text-xs opacity-70">
              {supabaseConfigured ? '設定済み' : '未設定'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Supabase Mode: Auth Status */}
      {dataMode === 'supabase' && (
        <>
          {/* Connection Status */}
          <div className="bg-accent/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-card-foreground">Supabase接続状態</h3>
              <button
                onClick={loadData}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Supabase設定</span>
                <span className={supabaseConfigured ? 'text-green-500' : 'text-red-500'}>
                  {supabaseConfigured ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>設定済み</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>未設定</span>
                    </div>
                  )}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ログイン状態</span>
                <span className={authState.isAuthenticated ? 'text-green-500' : 'text-yellow-500'}>
                  {authState.loading ? (
                    <span>読込中...</span>
                  ) : authState.isAuthenticated ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ログイン済み</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>未ログイン</span>
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Auth User Info */}
          {authState.user && (
            <div className="bg-accent/30 rounded-xl p-4">
              <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Auth ユーザー情報
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Auth UID:</span>
                  <span className="text-card-foreground font-mono text-[10px] break-all">{authState.user.id}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Email:</span>
                  <span className="text-card-foreground">{authState.user.email}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* User Profile (from users table) */}
          <div className="bg-accent/30 rounded-xl p-4">
            <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              ユーザープロファイル (usersテーブル)
            </h3>
            
            {profileLoading && (
              <div className="text-xs text-muted-foreground">読込中...</div>
            )}
            
            {profileError && (
              <div className="flex items-start gap-2 text-xs text-red-500">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">プロファイル取得エラー</div>
                  <div>{profileError}</div>
                  <div className="mt-2 text-muted-foreground">
                    ※ usersテーブルに該当するレコードを作成してください
                  </div>
                </div>
              </div>
            )}
            
            {!profileLoading && !profileError && profile && (
              <div className="space-y-3">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[60px]">名前:</span>
                    <span className="text-card-foreground">{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[60px]">Email:</span>
                    <span className="text-card-foreground">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[60px]">ロール:</span>
                    <span className="text-card-foreground capitalize">{profile.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[60px]">組織ID:</span>
                    <span className="text-card-foreground font-mono text-[10px]">{profile.orgId}</span>
                  </div>
                  {profile.clientId && (
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground min-w-[60px]">Client ID:</span>
                      <span className="text-card-foreground font-mono text-[10px]">{profile.clientId}</span>
                    </div>
                  )}
                </div>
                
                {/* Validation */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs mb-2">
                    {validation.valid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">RLS準拠：問題なし</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        <span className="text-yellow-500">RLS準拠：問題あり</span>
                      </>
                    )}
                  </div>
                  
                  {validation.issues.length > 0 && (
                    <div className="space-y-1">
                      {validation.issues.map((issue, i) => (
                        <div key={i} className="text-xs text-yellow-500 pl-5">
                          • {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!profileLoading && !profileError && !profile && !authState.user && (
              <div className="text-xs text-muted-foreground">
                ログインしていません
              </div>
            )}
          </div>
          
          {/* Session Info */}
          {authState.session && (
            <div className="bg-accent/30 rounded-xl p-4">
              <h3 className="text-sm text-card-foreground mb-3">セッション情報</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Access Token:</span>
                  <span className="text-card-foreground font-mono text-[10px] break-all">
                    {authState.session.access_token.substring(0, 40)}...
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Expires At:</span>
                  <span className="text-card-foreground">
                    {authState.session.expires_at 
                      ? new Date(authState.session.expires_at * 1000).toLocaleString('ja-JP')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Mock Mode: Current User */}
      {dataMode === 'mock' && (
        <div className="bg-accent/30 rounded-xl p-4">
          <h3 className="text-sm text-card-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            現在のユーザー (Mock)
          </h3>
          
          {profile ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground min-w-[60px]">名前:</span>
                <span className="text-card-foreground">{profile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground min-w-[60px]">Email:</span>
                <span className="text-card-foreground">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground min-w-[60px]">ロール:</span>
                <span className="text-card-foreground capitalize">{profile.role}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              ユーザーが選択されていません
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            ※ Mockモードでは「設定」タブでユーザーを切り替えられます
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
        <h3 className="text-sm text-card-foreground mb-2">Auth統合の確認手順</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>1. Supabaseプロジェクトでユーザーを作成（Authentication）</div>
          <div>2. usersテーブルにレコードを追加（auth_uidを一致させる）</div>
          <div>3. LandingPageからログイン</div>
          <div>4. このAuthタブで状態を確認</div>
          <div>5. RLS準拠チェックで問題がないことを確認</div>
        </div>
      </div>
    </div>
  );
}
