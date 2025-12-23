// Repository Factory - Central Access Point
// Phase 9: Mock/Supabase自動切り替え

import { getCurrentDataMode } from '../utils/supabase';
import { mockRepositoryFactory } from './MockRepository';
import { supabaseRepositoryFactory } from './SupabaseRepository';
import type { IRepositoryFactory } from './interfaces';

// ==============================
// Get Active Repository Factory
// ==============================
export function getRepositoryFactory(): IRepositoryFactory {
  const mode = getCurrentDataMode();
  
  if (mode === 'supabase') {
    console.log('[Repository] Using Supabase mode');
    return supabaseRepositoryFactory;
  }
  
  console.log('[Repository] Using Mock mode');
  return mockRepositoryFactory;
}

// ==============================
// Convenience exports
// ==============================
export function getTaskRepository() {
  return getRepositoryFactory().tasks;
}

export function getApprovalRepository() {
  return getRepositoryFactory().approvals;
}

export function getCommentRepository() {
  return getRepositoryFactory().comments;
}

export function getContractRepository() {
  return getRepositoryFactory().contracts;
}

export function getNotificationRepository() {
  return getRepositoryFactory().notifications;
}

export function getClientRepository() {
  return getRepositoryFactory().clients;
}

// ==============================
// Re-export interfaces
// ==============================
export type {
  ITaskRepository,
  IApprovalRepository,
  ICommentRepository,
  IContractRepository,
  INotificationRepository,
  IClientRepository,
  IRepositoryFactory
} from './interfaces';
