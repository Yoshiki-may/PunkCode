// Performance計測ユーティリティ（DEV専用）
// Phase 8: パフォーマンス最適化のための計測・可視化

import { storage } from './storage';

const PERF_KEY = 'palss_performance_metrics';
const MAX_HISTORY = 20; // 直近N回の履歴保持

export interface PerformanceMetric {
  name: string;
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  // autoPull関連
  lastAutoPullDurationMs?: number;
  lastAutoPullTimestamp?: string;
  lastAutoPullCounts?: {
    clients: number;
    tasks: number;
    approvals: number;
    comments: number;
    contracts: number;
  };
  autoPullHistory: Array<{
    durationMs: number;
    timestamp: string;
    counts: {
      clients: number;
      tasks: number;
      approvals: number;
      comments: number;
      contracts: number;
    };
    breakdown?: {
      clients?: number;
      tasks?: number;
      approvals?: number;
      comments?: number;
      contracts?: number;
    };
  }>;
  
  // Repository操作履歴
  repositoryHistory: PerformanceMetric[];
  
  // LocalStorage操作履歴
  localStorageHistory: PerformanceMetric[];
  
  // Top遅延操作
  slowestOperations: PerformanceMetric[];
}

// メトリクス取得
export function getPerformanceMetrics(): PerformanceMetrics {
  const metrics = storage.get<PerformanceMetrics>(PERF_KEY);
  return metrics || {
    autoPullHistory: [],
    repositoryHistory: [],
    localStorageHistory: [],
    slowestOperations: []
  };
}

// メトリクス保存
export function setPerformanceMetrics(metrics: PerformanceMetrics): void {
  storage.set(PERF_KEY, metrics);
}

// メトリクスクリア
export function clearPerformanceMetrics(): void {
  storage.remove(PERF_KEY);
}

// パフォーマンス計測開始
export function startMeasure(name: string): () => void {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);
    recordMetric(name, durationMs);
  };
}

// メトリクス記録
export function recordMetric(name: string, durationMs: number, metadata?: Record<string, any>): void {
  const metrics = getPerformanceMetrics();
  const metric: PerformanceMetric = {
    name,
    durationMs,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  // カテゴリ別に記録
  if (name.startsWith('repository.')) {
    metrics.repositoryHistory.push(metric);
    metrics.repositoryHistory = metrics.repositoryHistory.slice(-MAX_HISTORY);
  } else if (name.startsWith('localStorage.')) {
    metrics.localStorageHistory.push(metric);
    metrics.localStorageHistory = metrics.localStorageHistory.slice(-MAX_HISTORY);
  }
  
  // Top遅延更新
  updateSlowestOperations(metrics, metric);
  
  setPerformanceMetrics(metrics);
}

// autoPull計測記録
export function recordAutoPullMetric(
  durationMs: number,
  counts: {
    clients: number;
    tasks: number;
    approvals: number;
    comments: number;
    contracts: number;
  },
  breakdown?: {
    clients?: number;
    tasks?: number;
    approvals?: number;
    comments?: number;
    contracts?: number;
  }
): void {
  const metrics = getPerformanceMetrics();
  
  metrics.lastAutoPullDurationMs = durationMs;
  metrics.lastAutoPullTimestamp = new Date().toISOString();
  metrics.lastAutoPullCounts = counts;
  
  metrics.autoPullHistory.push({
    durationMs,
    timestamp: new Date().toISOString(),
    counts,
    breakdown
  });
  
  // 履歴保持
  metrics.autoPullHistory = metrics.autoPullHistory.slice(-MAX_HISTORY);
  
  setPerformanceMetrics(metrics);
}

// Top遅延操作更新
function updateSlowestOperations(metrics: PerformanceMetrics, newMetric: PerformanceMetric): void {
  metrics.slowestOperations.push(newMetric);
  metrics.slowestOperations.sort((a, b) => b.durationMs - a.durationMs);
  metrics.slowestOperations = metrics.slowestOperations.slice(0, 10); // Top 10
}

// 平均計算
export function getAverageAutoPullDuration(): number {
  const metrics = getPerformanceMetrics();
  if (metrics.autoPullHistory.length === 0) return 0;
  
  const sum = metrics.autoPullHistory.reduce((acc, h) => acc + h.durationMs, 0);
  return Math.round(sum / metrics.autoPullHistory.length);
}

// Repository操作平均
export function getAverageRepositoryDuration(operationName?: string): number {
  const metrics = getPerformanceMetrics();
  const history = operationName
    ? metrics.repositoryHistory.filter(h => h.name === operationName)
    : metrics.repositoryHistory;
  
  if (history.length === 0) return 0;
  
  const sum = history.reduce((acc, h) => acc + h.durationMs, 0);
  return Math.round(sum / history.length);
}

// LocalStorage操作平均
export function getAverageLocalStorageDuration(operationName?: string): number {
  const metrics = getPerformanceMetrics();
  const history = operationName
    ? metrics.localStorageHistory.filter(h => h.name === operationName)
    : metrics.localStorageHistory;
  
  if (history.length === 0) return 0;
  
  const sum = history.reduce((acc, h) => acc + h.durationMs, 0);
  return Math.round(sum / history.length);
}
