// データマイグレーション・正規化ユーティリティ
// Phase 4: Task/Approvalの不足フィールドを補完する

import { ClientTask, ClientApproval } from './clientData';

/**
 * タスクIDからハッシュ値を生成（2-10の範囲）
 * 同じIDは常に同じ値を返す（再現性）
 */
function getHashFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 9) + 2; // 2-10の範囲
}

/**
 * タスクデータを正規化（不足フィールドを補完）
 * 
 * 補完ルール:
 * - createdAt: postDate/dueDate から hashDays 日前を計算（一貫性のある推測）
 * - updatedAt: createdAt 以上、now 以下の範囲で補完
 * - lastActivityAt: status によって調整（completed なら updatedAt、それ以外は updatedAt - 数日）
 * - completedAt: status が completed なら updatedAt を使用
 */
export function normalizeTask(task: ClientTask): ClientTask {
  try {
    const now = new Date();
    const hashDays = getHashFromId(task.id); // 2-10日（一貫性のある値）
    
    // createdAt の補完
    let createdAt: Date;
    if (task.createdAt) {
      createdAt = new Date(task.createdAt);
    } else {
      // postDate or dueDate から hashDays 日前を計算
      const referenceDate = task.dueDate ? new Date(task.dueDate) : task.postDate ? new Date(task.postDate) : now;
      createdAt = new Date(referenceDate);
      createdAt.setDate(createdAt.getDate() - hashDays);
    }
    
    // updatedAt の補完
    let updatedAt: Date;
    if (task.updatedAt) {
      updatedAt = new Date(task.updatedAt);
    } else {
      // createdAt から現在までの間でランダムだが一貫性のある日付
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const updateDaysAgo = Math.min(hashDays % (daysSinceCreation + 1), daysSinceCreation);
      updatedAt = new Date(now);
      updatedAt.setDate(updatedAt.getDate() - updateDaysAgo);
    }
    
    // lastActivityAt の補完
    let lastActivityAt: Date;
    if (task.lastActivityAt) {
      lastActivityAt = new Date(task.lastActivityAt);
    } else {
      // status に応じて調整
      if (task.status === 'completed') {
        lastActivityAt = updatedAt; // 完了時 = 最終更新
      } else if (task.status === 'in-progress' || task.status === 'approval') {
        // 進行中・承認待ちは比較的最近
        lastActivityAt = new Date(updatedAt);
        lastActivityAt.setHours(lastActivityAt.getHours() - (hashDays * 2)); // 数時間〜数日前
      } else {
        // pending/rejected は更新からやや時間が経過
        lastActivityAt = new Date(updatedAt);
        lastActivityAt.setDate(lastActivityAt.getDate() - (hashDays % 5)); // 数日前
      }
    }
    
    // completedAt の補完
    let completedAt: string | undefined = task.completedAt;
    if (task.status === 'completed' && !completedAt) {
      completedAt = updatedAt.toISOString();
    }
    
    return {
      ...task,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      lastActivityAt: lastActivityAt.toISOString(),
      completedAt
    };
  } catch (error) {
    console.error('[DataMigration] Error normalizing task:', task.id, error);
    // エラー時は元のタスクを返す（最低限のデフォルト値を追加）
    return {
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString(),
      lastActivityAt: task.lastActivityAt || new Date().toISOString()
    };
  }
}

/**
 * 承認データを正規化（不足フィールドを補完）
 * 
 * 補完ルール:
 * - createdAt: submittedDate の hashDays 日前を計算
 * - updatedAt: createdAt 以上、now 以下の範囲で補完
 * - completedAt: status が approved/rejected なら updatedAt を使用
 * - rejectedCount: status が rejected なら 1、それ以外は 0
 */
export function normalizeApproval(approval: ClientApproval): ClientApproval {
  try {
    const now = new Date();
    const hashDays = getHashFromId(approval.id); // 2-10日（一貫性のある値）
    
    // createdAt の補完
    let createdAt: Date;
    if (approval.createdAt) {
      createdAt = new Date(approval.createdAt);
    } else {
      // submittedDate から hashDays 日前を計算
      const submittedDate = approval.submittedDate ? new Date(approval.submittedDate) : now;
      createdAt = new Date(submittedDate);
      createdAt.setDate(createdAt.getDate() - hashDays);
    }
    
    // updatedAt の補完
    let updatedAt: Date;
    if (approval.updatedAt) {
      updatedAt = new Date(approval.updatedAt);
    } else {
      // createdAt から現在までの間でランダムだが一貫性のある日付
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const updateDaysAgo = Math.min(hashDays % (daysSinceCreation + 1), daysSinceCreation);
      updatedAt = new Date(now);
      updatedAt.setDate(updatedAt.getDate() - updateDaysAgo);
    }
    
    // completedAt の補完
    let completedAt: string | undefined = approval.completedAt;
    if ((approval.status === 'approved' || approval.status === 'rejected') && !completedAt) {
      completedAt = updatedAt.toISOString();
    }
    
    // rejectedCount の補完
    let rejectedCount: number = approval.rejectedCount || 0;
    if (approval.status === 'rejected' && rejectedCount === 0) {
      rejectedCount = 1; // 最低1回
    }
    
    return {
      ...approval,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      completedAt,
      rejectedCount
    };
  } catch (error) {
    console.error('[DataMigration] Error normalizing approval:', approval.id, error);
    // エラー時は元の承認を返す（最低限のデフォルト値を追加）
    return {
      ...approval,
      createdAt: approval.createdAt || new Date().toISOString(),
      updatedAt: approval.updatedAt || new Date().toISOString(),
      rejectedCount: approval.rejectedCount || 0
    };
  }
}

/**
 * タスク配列を一括正規化
 */
export function normalizeTasks(tasks: ClientTask[]): ClientTask[] {
  return tasks.map(normalizeTask);
}

/**
 * 承認配列を一括正規化
 */
export function normalizeApprovals(approvals: ClientApproval[]): ClientApproval[] {
  return approvals.map(normalizeApproval);
}

/**
 * タスク更新時に updatedAt/lastActivityAt を自動更新
 */
export function touchTask(task: ClientTask): ClientTask {
  const now = new Date().toISOString();
  return {
    ...task,
    updatedAt: now,
    lastActivityAt: now,
    // completedAt: status が completed に変わった場合のみ設定
    completedAt: task.status === 'completed' && !task.completedAt ? now : task.completedAt
  };
}

/**
 * 承認更新時に updatedAt を自動更新
 */
export function touchApproval(approval: ClientApproval): ClientApproval {
  const now = new Date().toISOString();
  return {
    ...approval,
    updatedAt: now,
    // completedAt: status が approved/rejected に変わった場合のみ設定
    completedAt: (approval.status === 'approved' || approval.status === 'rejected') && !approval.completedAt ? now : approval.completedAt
  };
}