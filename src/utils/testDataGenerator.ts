// QAパネル用テストデータ生成ユーティリティ
// stagnant/overdue タスクなどを生成して検証を容易にする

import { addClientTask, getAllClients, ClientTask } from './clientData';
import { getStagnantThreshold, getNoReplyThreshold, getRenewalThreshold } from './qaConfig';
import { getCurrentUser } from './mockDatabase';
import { addComment } from './commentData';
import { addContract } from './contractData';

/**
 * 停滞タスクを生成（stagnant検証用）
 * lastActivityAt を stagnantDays + 1 日前に設定
 */
export const generateStagnantTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0]; // 最初のクライアントに追加
  const stagnantThreshold = getStagnantThreshold();
  
  const now = new Date();
  const stagnantDate = new Date(now);
  stagnantDate.setDate(stagnantDate.getDate() - (stagnantThreshold + 1));
  
  const createdDate = new Date(stagnantDate);
  createdDate.setDate(createdDate.getDate() - 5); // さらに5日前に作成
  
  const postDate = new Date(now);
  postDate.setDate(postDate.getDate() + 3); // 3日後に投稿予定
  
  const testTask: ClientTask = {
    id: `test-stagnant-${Date.now()}`,
    title: `[TEST] 停滞タスク（${stagnantThreshold + 1}日間更新なし）`,
    status: 'in-progress',
    postDate: postDate.toISOString().split('T')[0],
    platform: 'Instagram',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: createdDate.toISOString(),
    updatedAt: stagnantDate.toISOString(),
    lastActivityAt: stagnantDate.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * 期限切れタスクを生成（overdue検証用）
 * dueDate を 3日前に設定
 */
export const generateOverdueTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  const now = new Date();
  const overdueDate = new Date(now);
  overdueDate.setDate(overdueDate.getDate() - 3); // 3日前が期限
  
  const createdDate = new Date(overdueDate);
  createdDate.setDate(createdDate.getDate() - 7); // 期限の7日前に作成
  
  const testTask: ClientTask = {
    id: `test-overdue-${Date.now()}`,
    title: '[TEST] 期限切れタスク（3日超過）',
    status: 'in-progress',
    postDate: overdueDate.toISOString().split('T')[0],
    dueDate: overdueDate.toISOString().split('T')[0],
    platform: 'Twitter',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: createdDate.toISOString(),
    updatedAt: now.toISOString(),
    lastActivityAt: now.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * 通常タスクを生成（正常動作確認用）
 */
export const generateNormalTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  const now = new Date();
  const postDate = new Date(now);
  postDate.setDate(postDate.getDate() + 7); // 7日後に投稿予定
  
  const testTask: ClientTask = {
    id: `test-normal-${Date.now()}`,
    title: '[TEST] 通常タスク（問題なし）',
    status: 'in-progress',
    postDate: postDate.toISOString().split('T')[0],
    platform: 'TikTok',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    lastActivityAt: now.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * 未返信状態を生成（noReply検証用）
 * クライアントからのコメント（isFromClient=true）を noReplyDays + 1 日前に追加
 */
export const generateNoReplyComment = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const noReplyThreshold = getNoReplyThreshold();
  
  const now = new Date();
  const commentDate = new Date(now);
  commentDate.setDate(commentDate.getDate() - (noReplyThreshold + 1));
  
  return addComment({
    clientId: targetClient.id,
    userId: 'client_user_test',
    content: `[TEST] ${noReplyThreshold + 1}日前のクライアントコメント（未返信）`,
    isFromClient: true,
    createdAt: commentDate.toISOString()
  });
};

/**
 * 返信を追加（noReply解消検証用）
 * チームからの返信（isFromClient=false）を追加してnoReplyCountが減ることを確認
 */
export const generateTeamReply = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  return addComment({
    clientId: targetClient.id,
    userId: currentUser?.id || 'user_test',
    content: '[TEST] チームからの返信（noReply解消）',
    isFromClient: false,
    createdAt: new Date().toISOString()
  });
};

/**
 * 更新期限が近い契約を生成（contractRenewal検証用）
 * renewalDate を now + (renewalDays - 1) 日に設定
 */
export const generateUpcomingRenewalContract = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const renewalThreshold = getRenewalThreshold();
  
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + (renewalThreshold - 1)); // 閾値-1日後（対象内）
  
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 180); // 180日前に契約開始
  
  return addContract({
    clientId: targetClient.id,
    status: 'active',
    monthlyFee: 350000,
    startDate: startDate.toISOString(),
    renewalDate: renewalDate.toISOString(),
    createdAt: startDate.toISOString()
  });
};

/**
 * 更新期限が遠い契約を生成（contractRenewal対象外検証用）
 * renewalDate を now + (renewalDays + 30) 日に設定
 */
export const generateDistantRenewalContract = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const renewalThreshold = getRenewalThreshold();
  
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + (renewalThreshold + 30)); // 閾値+30日後（対象外）
  
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 90); // 90日前に契約開始
  
  return addContract({
    clientId: targetClient.id,
    status: 'active',
    monthlyFee: 280000,
    startDate: startDate.toISOString(),
    renewalDate: renewalDate.toISOString(),
    createdAt: startDate.toISOString()
  });
};

/**
 * KPI検証用タスクを生成（期限内完了）
 * completedAt <= dueDate の条件を満たすタスク
 */
export const generateOnTimeCompletedTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 5); // 5日後が期限
  
  const completedDate = new Date(dueDate);
  completedDate.setDate(completedDate.getDate() - 1); // 期限の1日前に完了（期限内）
  
  const createdDate = new Date(now);
  createdDate.setDate(createdDate.getDate() - 3); // 3日前に作成
  
  const testTask: ClientTask = {
    id: `test-ontime-${Date.now()}`,
    title: '[TEST KPI] 期限内完了タスク',
    status: 'completed',
    postDate: dueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    platform: 'Instagram',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: createdDate.toISOString(),
    updatedAt: completedDate.toISOString(),
    completedAt: completedDate.toISOString(),
    lastActivityAt: completedDate.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * KPI検証用タスクを生成（期限超過完了）
 * completedAt > dueDate の条件を満たすタスク
 */
export const generateOverdueCompletedTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() - 5); // 5日前が期限（既に過ぎている）
  
  const completedDate = new Date(dueDate);
  completedDate.setDate(completedDate.getDate() + 2); // 期限の2日後に完了（期限超過）
  
  const createdDate = new Date(dueDate);
  createdDate.setDate(createdDate.getDate() - 7); // 期限の7日前に作成
  
  const testTask: ClientTask = {
    id: `test-overdue-completed-${Date.now()}`,
    title: '[TEST KPI] 期限超過で完了したタスク',
    status: 'completed',
    postDate: dueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    platform: 'Twitter',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: createdDate.toISOString(),
    updatedAt: completedDate.toISOString(),
    completedAt: completedDate.toISOString(),
    lastActivityAt: completedDate.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * KPI検証用タスクを生成（未完了）
 * completedAt が無いタスク（Direction KPIの分母計算に影響）
 */
export const generateIncompleteTask = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const currentUser = getCurrentUser();
  const targetClient = clients[0];
  
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 3); // 3日後が期限
  
  const createdDate = new Date(now);
  createdDate.setDate(createdDate.getDate() - 2); // 2日前に作成
  
  const testTask: ClientTask = {
    id: `test-incomplete-${Date.now()}`,
    title: '[TEST KPI] 未完了タスク',
    status: 'in-progress',
    postDate: dueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    platform: 'TikTok',
    assignee: currentUser?.name || 'テスト担当者',
    initials: 'TT',
    createdAt: createdDate.toISOString(),
    updatedAt: now.toISOString(),
    lastActivityAt: now.toISOString()
  };
  
  return addClientTask(targetClient.id, testTask);
};

/**
 * 当月のactive契約を生成（Sales KPI検証用）
 */
export const generateCurrentMonthActiveContract = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 15); // 今月15日開始
  
  return addContract({
    clientId: targetClient.id,
    status: 'active',
    monthlyFee: 500000,
    startDate: startDate.toISOString(),
    createdAt: startDate.toISOString()
  });
};

/**
 * 前月のactive契約を生成（Sales KPI前月比検証用）
 */
export const generatePreviousMonthActiveContract = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 10); // 前月10日開始
  
  return addContract({
    clientId: targetClient.id,
    status: 'active',
    monthlyFee: 400000,
    startDate: startDate.toISOString(),
    createdAt: startDate.toISOString()
  });
};

/**
 * 当月のnegotiating契約を生成（Sales KPI提案件数検証用）
 */
export const generateCurrentMonthNegotiatingContract = (): boolean => {
  const clients = getAllClients();
  if (clients.length === 0) {
    console.error('クライアントが存在しません');
    return false;
  }
  
  const targetClient = clients[0];
  const now = new Date();
  const createdDate = new Date(now.getFullYear(), now.getMonth(), 20); // 今月20日作成
  
  return addContract({
    clientId: targetClient.id,
    status: 'negotiating',
    monthlyFee: 350000,
    startDate: now.toISOString(), // 開始日は未定
    createdAt: createdDate.toISOString()
  });
};

/**
 * テストタスクをすべて削除（[TEST]で始まるタスク）
 */
export const cleanupTestTasks = (): boolean => {
  // TODO: [TEST]で始まるタスクを削除する実装
  // 現在のclientData.tsにはdeleteClientTask()が無いため、
  // 今回は手動削除またはseed再投入で対応
  console.log('テストタスクの削除はseed再投入で対応してください');
  return true;
};