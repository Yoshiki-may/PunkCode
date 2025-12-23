// Comment/Activity データモデル
// noReply判定とクライアントコミュニケーション追跡のための基盤
// Phase 9.3: Write系のみRepository経由（Read系は同期互換のため現状維持） + outbox統合

import { storage } from './storage';
import { getCommentRepository } from '../repositories';
import { getCurrentAuthUser } from './auth';
import { getCurrentDataMode } from './supabase';
import { addOutboxItem, updateOutboxItem, deleteOutboxItem } from './outbox';

const STORAGE_KEY = 'palss_client_comments';

export interface Comment {
  id: string;
  clientId: string;
  taskId?: string;           // タスクに関連するコメント
  approvalId?: string;       // 承認に関連するコメント
  userId: string;            // コメント投稿者のユーザーID
  content: string;           // コメント内容
  createdAt: string;         // ISO 8601形式
  isFromClient: boolean;     // true=クライアントからのコメント、false=チームからの返信
  // Phase 9.3: Supabase用メタデータ
  org_id?: string;
  client_id?: string;
  user_id?: string;
}

// 全コメント取得（同期返却、既存互換性維持）
export const getAllComments = (): Comment[] => {
  return storage.get<Comment[]>(STORAGE_KEY) || [];
};

// クライアント別コメント取得（時系列順）
export const getClientComments = (clientId: string): Comment[] => {
  const allComments = getAllComments();
  return allComments
    .filter(c => c.clientId === clientId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

// タスク別コメント取得
export const getTaskComments = (clientId: string, taskId: string): Comment[] => {
  const allComments = getAllComments();
  return allComments
    .filter(c => c.clientId === clientId && c.taskId === taskId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

// 承認別コメント取得
export const getApprovalComments = (clientId: string, approvalId: string): Comment[] => {
  const allComments = getAllComments();
  return allComments
    .filter(c => c.clientId === clientId && c.approvalId === approvalId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

// コメント追加（Repository経由 + outbox統合）
export const addComment = (
  comment: Omit<Comment, 'id' | 'createdAt'> & { 
    id?: string;
    createdAt?: string;
  }
): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getCommentRepository();
    const authUser = getCurrentAuthUser();
    
    const commentData: Omit<Comment, 'id' | 'createdAt'> = {
      clientId: comment.clientId,
      taskId: comment.taskId,
      approvalId: comment.approvalId,
      userId: comment.userId,
      content: comment.content,
      isFromClient: comment.isFromClient,
      // Phase 9.3: Supabase用メタデータ自動補完
      org_id: authUser?.org_id,
      client_id: comment.clientId,
      user_id: comment.userId
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('comment.create', commentData);
    }
    
    // Repository経由で作成（非同期だが、fire-and-forgetで互換性維持）
    repo.createComment(commentData)
      .then(created => {
        console.log('[commentData] Comment created via repository:', created.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allComments = getAllComments();
        const newComment: Comment = {
          ...created,
          id: comment.id || created.id, // 既存IDがあれば優先（seed用）
          createdAt: comment.createdAt || created.createdAt
        };
        
        // 重複チェック
        const exists = allComments.some(c => c.id === newComment.id);
        if (!exists) {
          allComments.push(newComment);
          storage.set(STORAGE_KEY, allComments);
        }
      })
      .catch(error => {
        console.error('[commentData] Failed to create comment via repository:', error);
        
        // outbox失敗マーク
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          updateOutboxItem(outboxId, {
            status: 'failed',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
        }
        
        // フォールバック: LocalStorageに直接書き込み
        const allComments = getAllComments();
        const newComment: Comment = {
          id: comment.id || `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clientId: comment.clientId,
          taskId: comment.taskId,
          approvalId: comment.approvalId,
          userId: comment.userId,
          content: comment.content,
          createdAt: comment.createdAt || new Date().toISOString(),
          isFromClient: comment.isFromClient,
          org_id: authUser?.org_id,
          client_id: comment.clientId,
          user_id: comment.userId
        };
        allComments.push(newComment);
        storage.set(STORAGE_KEY, allComments);
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to add comment:', error);
    return false;
  }
};

// 全コメント削除
export const clearAllComments = (): boolean => {
  return storage.set(STORAGE_KEY, []);
};

// Seed投入（初回のみ）
export const seedCommentsIfEmpty = (): void => {
  const existingComments = getAllComments();
  if (existingComments.length > 0) {
    return; // 既にデータがある場合はスキップ
  }
  
  const now = new Date();
  
  // 6クライアント分のシードデータ（最低限1往復）
  // client-1: 返信済み（問題なし）
  addComment({
    clientId: 'client-1',
    userId: 'client_user_1',
    content: '投稿スケジュールの確認をお願いします。',
    isFromClient: true,
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5日前
  });
  addComment({
    clientId: 'client-1',
    userId: 'user_direction_001',
    content: 'ご確認いただきありがとうございます。スケジュール通り進めます。',
    isFromClient: false,
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4日前
  });
  
  // client-2: 返信済み（問題なし）
  addComment({
    clientId: 'client-2',
    userId: 'client_user_2',
    content: 'クリエイティブの修正依頼があります。',
    isFromClient: true,
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3日前
  });
  addComment({
    clientId: 'client-2',
    userId: 'user_editor_001',
    content: '承知いたしました。修正版をお送りします。',
    isFromClient: false,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2日前
  });
  
  // client-3: 未返信（6日前のコメント、デフォルト閾値5日を超過）
  addComment({
    clientId: 'client-3',
    userId: 'client_user_3',
    content: 'レポートの内容について質問があります。',
    isFromClient: true,
    createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6日前
  });
  
  // client-4: 返信済み（問題なし）
  addComment({
    clientId: 'client-4',
    userId: 'client_user_4',
    content: '次回の打ち合わせ日程を調整したいです。',
    isFromClient: true,
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7日前
  });
  addComment({
    clientId: 'client-4',
    userId: 'user_sales_001',
    content: 'ありがとうございます。候補日をお送りします。',
    isFromClient: false,
    createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6日前
  });
  
  // client-5: コメントなし（正常）
  
  // client-6: 返信済み（問題なし）
  addComment({
    clientId: 'client-6',
    userId: 'client_user_6',
    content: '今月の進捗状況を教えてください。',
    isFromClient: true,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2日前
  });
  addComment({
    clientId: 'client-6',
    userId: 'user_direction_001',
    content: '進捗レポートをお送りしました。',
    isFromClient: false,
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1日前
  });
  
  console.log('✅ Comments seeded successfully');
};

// 未返信クライアントを取得（noReply判定用）
export const getNoReplyClients = (noReplyDays: number): string[] => {
  const allComments = getAllComments();
  const clientIds = [...new Set(allComments.map(c => c.clientId))];
  const now = new Date();
  
  return clientIds.filter(clientId => {
    const clientComments = getClientComments(clientId);
    if (clientComments.length === 0) return false;
    
    // 最後のコメントを取得
    const lastComment = clientComments[clientComments.length - 1];
    
    // 最後のコメントがクライアントからでない場合は対象外
    if (!lastComment.isFromClient) return false;
    
    // 最後のコメントから経過日数を計算
    const daysSinceComment = Math.floor(
      (now.getTime() - new Date(lastComment.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // 閾値以上経過しているか
    return daysSinceComment >= noReplyDays;
  });
};