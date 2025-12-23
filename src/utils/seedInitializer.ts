// 初回起動時の自動Seed投入
// Comment/Contractデータの初期化を管理

import { seedCommentsIfEmpty } from './commentData';
import { seedContractsIfEmpty } from './contractData';
import { isInitialized, markAsInitialized } from './qaConfig';

/**
 * 初回起動時に全Seedデータを自動投入
 * QAパネルのSeed再投入でも使用可能
 */
export const initializeAllSeeds = (): void => {
  // Comment/Contract Seedは既存システム（tasks/approvals）と独立して初期化
  seedCommentsIfEmpty();
  seedContractsIfEmpty();
  
  console.log('✅ All seed data initialized');
};

/**
 * アプリ起動時に1度だけ実行される初期化
 * 既存システムに影響を与えず、Comment/Contractのみ初期化
 */
export const initializeOnce = (): void => {
  // Comment/Contractは既存のタスク/承認システムと独立
  // 初回のみ自動投入（QAConfigの初期化フラグは使わない）
  initializeAllSeeds();
};
