// QA/検証パネル用の設定管理
// 閾値、テストモード、デバッグ設定などを管理

import { storage } from './storage';

const QA_CONFIG_KEY = 'palss_qa_config';

export interface QAConfig {
  // 閾値設定
  stagnantDays: number;      // 停滞判定の日数（デフォルト: 10日）
  noReplyDays: number;       // 未返信判定の日数（デフォルト: 5日）
  renewalDays: number;       // 契約更新期限の日数（デフォルト: 30日）
  
  // KPI設定
  kpiDefinition: 'A' | 'B';                                    // KPI定義セット（Direction KPI用）
  deadlineBase: 'dueDate' | 'postDate';                         // 期限基準（納期遵守率の判定基準）
  aggregationPeriod: 'currentMonth' | 'last30Days' | 'last7Days'; // 集計期間（Direction KPI）
  kpiPeriodBase: 'createdAt' | 'dueDate';                      // KPI期間判定基準
  
  // データモード
  dataMode: 'mock' | 'supabase';
  
  // 初期化フラグ
  initialized: boolean;
}

const DEFAULT_QA_CONFIG: QAConfig = {
  stagnantDays: 10,
  noReplyDays: 5,
  renewalDays: 30,
  kpiDefinition: 'A',
  deadlineBase: 'dueDate',
  aggregationPeriod: 'currentMonth',
  kpiPeriodBase: 'createdAt',
  dataMode: 'mock',
  initialized: false
};

// QA設定を取得
export const getQAConfig = (): QAConfig => {
  const config = storage.get<QAConfig>(QA_CONFIG_KEY);
  return config || DEFAULT_QA_CONFIG;
};

// QA設定を保存
export const setQAConfig = (updates: Partial<QAConfig>): boolean => {
  const currentConfig = getQAConfig();
  const newConfig = { ...currentConfig, ...updates };
  return storage.set(QA_CONFIG_KEY, newConfig);
};

// 閾値取得のショートカット
export const getStagnantThreshold = (): number => {
  return getQAConfig().stagnantDays;
};

export const getNoReplyThreshold = (): number => {
  return getQAConfig().noReplyDays;
};

export const getRenewalThreshold = (): number => {
  return getQAConfig().renewalDays;
};

// KPI設定取得のショートカット
export const getKPIDefinition = (): 'A' | 'B' => {
  return getQAConfig().kpiDefinition;
};

export const getDeadlineBase = (): 'dueDate' | 'postDate' => {
  return getQAConfig().deadlineBase;
};

export const getAggregationPeriod = (): 'currentMonth' | 'last30Days' | 'last7Days' => {
  return getQAConfig().aggregationPeriod;
};

export const getKPIPeriodBase = (): 'createdAt' | 'dueDate' => {
  return getQAConfig().kpiPeriodBase;
};

// 初期化フラグ
export const isInitialized = (): boolean => {
  return getQAConfig().initialized;
};

export const markAsInitialized = (): boolean => {
  return setQAConfig({ initialized: true });
};

export const resetInitialized = (): boolean => {
  return setQAConfig({ initialized: false });
};