// Sync Manager - Mock ↔ Supabase データ同期
// Phase 9.1: QAパネルSync機能

import { mockRepositoryFactory } from '../repositories/MockRepository';
import { supabaseRepositoryFactory } from '../repositories/SupabaseRepository';
import { storage } from './storage';
import type { Task, Approval, Comment, Contract, Notification, Client } from '../types';

// ==============================
// Types
// ==============================

export type TableName = 'tasks' | 'approvals' | 'comments' | 'contracts' | 'notifications' | 'clients';

export interface SyncStats {
  tableName: TableName;
  mockCount: number;
  supabaseCount: number;
  diff: number;
}

export interface SyncProgress {
  tableName: TableName;
  total: number;
  current: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface SyncResult {
  tableName: TableName;
  success: boolean;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

export interface IntegrityIssue {
  tableName: TableName;
  itemId: string;
  issue: string;
  severity: 'error' | 'warning';
}

// ==============================
// Sync Statistics
// ==============================

export async function getSyncStats(): Promise<SyncStats[]> {
  const stats: SyncStats[] = [];
  
  try {
    // Tasks
    const mockTasks = await mockRepositoryFactory.tasks.getAllTasks();
    const supabaseTasks = await supabaseRepositoryFactory.tasks.getAllTasks().catch(() => []);
    stats.push({
      tableName: 'tasks',
      mockCount: mockTasks.length,
      supabaseCount: supabaseTasks.length,
      diff: mockTasks.length - supabaseTasks.length
    });
    
    // Approvals
    const mockApprovals = await mockRepositoryFactory.approvals.getAllApprovals();
    const supabaseApprovals = await supabaseRepositoryFactory.approvals.getAllApprovals().catch(() => []);
    stats.push({
      tableName: 'approvals',
      mockCount: mockApprovals.length,
      supabaseCount: supabaseApprovals.length,
      diff: mockApprovals.length - supabaseApprovals.length
    });
    
    // Comments
    const mockComments = await mockRepositoryFactory.comments.getAllComments();
    const supabaseComments = await supabaseRepositoryFactory.comments.getAllComments().catch(() => []);
    stats.push({
      tableName: 'comments',
      mockCount: mockComments.length,
      supabaseCount: supabaseComments.length,
      diff: mockComments.length - supabaseComments.length
    });
    
    // Contracts
    const mockContracts = await mockRepositoryFactory.contracts.getAllContracts();
    const supabaseContracts = await supabaseRepositoryFactory.contracts.getAllContracts().catch(() => []);
    stats.push({
      tableName: 'contracts',
      mockCount: mockContracts.length,
      supabaseCount: supabaseContracts.length,
      diff: mockContracts.length - supabaseContracts.length
    });
    
    // Notifications
    const mockNotifications = await mockRepositoryFactory.notifications.getAllNotifications();
    const supabaseNotifications = await supabaseRepositoryFactory.notifications.getAllNotifications().catch(() => []);
    stats.push({
      tableName: 'notifications',
      mockCount: mockNotifications.length,
      supabaseCount: supabaseNotifications.length,
      diff: mockNotifications.length - supabaseNotifications.length
    });
    
    // Clients
    const mockClients = await mockRepositoryFactory.clients.getAllClients();
    const supabaseClients = await supabaseRepositoryFactory.clients.getAllClients().catch(() => []);
    stats.push({
      tableName: 'clients',
      mockCount: mockClients.length,
      supabaseCount: supabaseClients.length,
      diff: mockClients.length - supabaseClients.length
    });
  } catch (error) {
    console.error('Error getting sync stats:', error);
  }
  
  return stats;
}

// ==============================
// Last Sync Time
// ==============================

const SYNC_TIME_KEY = 'palss_last_sync_time';

export function getLastSyncTime(): string | null {
  return storage.get(SYNC_TIME_KEY);
}

export function setLastSyncTime(): void {
  storage.set(SYNC_TIME_KEY, new Date().toISOString());
}

// ==============================
// Mock → Supabase Sync
// ==============================

export async function syncMockToSupabase(
  tables: TableName[],
  onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  
  // Default org_id（仮）
  const ORG_ID = '00000000-0000-0000-0000-000000000001';
  
  for (const tableName of tables) {
    const result: SyncResult = {
      tableName,
      success: false,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };
    
    try {
      onProgress?.({
        tableName,
        total: 0,
        current: 0,
        status: 'processing'
      });
      
      // Get data from Mock
      let mockData: any[] = [];
      
      switch (tableName) {
        case 'clients':
          mockData = await mockRepositoryFactory.clients.getAllClients();
          break;
        case 'tasks':
          mockData = await mockRepositoryFactory.tasks.getAllTasks();
          break;
        case 'approvals':
          mockData = await mockRepositoryFactory.approvals.getAllApprovals();
          break;
        case 'comments':
          mockData = await mockRepositoryFactory.comments.getAllComments();
          break;
        case 'contracts':
          mockData = await mockRepositoryFactory.contracts.getAllContracts();
          break;
        case 'notifications':
          mockData = await mockRepositoryFactory.notifications.getAllNotifications();
          break;
      }
      
      onProgress?.({
        tableName,
        total: mockData.length,
        current: 0,
        status: 'processing'
      });
      
      // Sync each item
      for (let i = 0; i < mockData.length; i++) {
        try {
          const item = mockData[i];
          
          // Add org_id if not present
          const dataToSync = {
            ...item,
            orgId: item.orgId || ORG_ID
          };
          
          // Check if exists in Supabase
          let exists = false;
          
          try {
            switch (tableName) {
              case 'clients':
                exists = !!(await supabaseRepositoryFactory.clients.getClientById(item.id));
                break;
              case 'tasks':
                exists = !!(await supabaseRepositoryFactory.tasks.getTaskById(item.id));
                break;
              case 'approvals':
                exists = !!(await supabaseRepositoryFactory.approvals.getApprovalById(item.id));
                break;
              case 'comments':
                exists = !!(await supabaseRepositoryFactory.comments.getCommentById(item.id));
                break;
              case 'contracts':
                exists = !!(await supabaseRepositoryFactory.contracts.getContractById(item.id));
                break;
              case 'notifications':
                exists = !!(await supabaseRepositoryFactory.notifications.getNotificationById(item.id));
                break;
            }
          } catch {
            exists = false;
          }
          
          // Create or Update
          if (exists) {
            // Update
            switch (tableName) {
              case 'clients':
                await supabaseRepositoryFactory.clients.updateClient(item.id, dataToSync);
                break;
              case 'tasks':
                await supabaseRepositoryFactory.tasks.updateTask(item.id, dataToSync);
                break;
              case 'approvals':
                await supabaseRepositoryFactory.approvals.updateApproval(item.id, dataToSync);
                break;
              case 'comments':
                await supabaseRepositoryFactory.comments.updateComment(item.id, dataToSync);
                break;
              case 'contracts':
                await supabaseRepositoryFactory.contracts.updateContract(item.id, dataToSync);
                break;
              case 'notifications':
                await supabaseRepositoryFactory.notifications.updateNotification(item.id, dataToSync);
                break;
            }
            result.updated++;
          } else {
            // Create (remove id/createdAt/updatedAt to let DB generate)
            const { id, createdAt, updatedAt, ...createData } = dataToSync;
            
            switch (tableName) {
              case 'clients':
                await supabaseRepositoryFactory.clients.createClient(createData);
                break;
              case 'tasks':
                await supabaseRepositoryFactory.tasks.createTask(createData);
                break;
              case 'approvals':
                await supabaseRepositoryFactory.approvals.createApproval(createData);
                break;
              case 'comments':
                await supabaseRepositoryFactory.comments.createComment(createData);
                break;
              case 'contracts':
                await supabaseRepositoryFactory.contracts.createContract(createData);
                break;
              case 'notifications':
                await supabaseRepositoryFactory.notifications.createNotification(createData);
                break;
            }
            result.created++;
          }
          
          onProgress?.({
            tableName,
            total: mockData.length,
            current: i + 1,
            status: 'processing'
          });
        } catch (error: any) {
          result.failed++;
          result.errors.push(`Item ${i}: ${error.message}`);
        }
      }
      
      result.success = result.failed === 0;
      
      onProgress?.({
        tableName,
        total: mockData.length,
        current: mockData.length,
        status: result.success ? 'success' : 'error',
        error: result.errors[0]
      });
    } catch (error: any) {
      result.errors.push(error.message);
      onProgress?.({
        tableName,
        total: 0,
        current: 0,
        status: 'error',
        error: error.message
      });
    }
    
    results.push(result);
  }
  
  setLastSyncTime();
  return results;
}

// ==============================
// Supabase → Mock Sync
// ==============================

export async function syncSupabaseToMock(
  tables: TableName[],
  onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  
  for (const tableName of tables) {
    const result: SyncResult = {
      tableName,
      success: false,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };
    
    try {
      onProgress?.({
        tableName,
        total: 0,
        current: 0,
        status: 'processing'
      });
      
      // Get data from Supabase
      let supabaseData: any[] = [];
      
      switch (tableName) {
        case 'clients':
          supabaseData = await supabaseRepositoryFactory.clients.getAllClients();
          break;
        case 'tasks':
          supabaseData = await supabaseRepositoryFactory.tasks.getAllTasks();
          break;
        case 'approvals':
          supabaseData = await supabaseRepositoryFactory.approvals.getAllApprovals();
          break;
        case 'comments':
          supabaseData = await supabaseRepositoryFactory.comments.getAllComments();
          break;
        case 'contracts':
          supabaseData = await supabaseRepositoryFactory.contracts.getAllContracts();
          break;
        case 'notifications':
          supabaseData = await supabaseRepositoryFactory.notifications.getAllNotifications();
          break;
      }
      
      onProgress?.({
        tableName,
        total: supabaseData.length,
        current: 0,
        status: 'processing'
      });
      
      // Replace all Mock data with Supabase data
      // This is a simple overwrite approach
      switch (tableName) {
        case 'clients':
          storage.set('clients', supabaseData);
          break;
        case 'tasks':
          storage.set('client_tasks', supabaseData);
          break;
        case 'approvals':
          storage.set('client_approvals', supabaseData);
          break;
        case 'comments':
          storage.set('comments', supabaseData);
          break;
        case 'contracts':
          storage.set('contracts', supabaseData);
          break;
        case 'notifications':
          storage.set('notifications', supabaseData);
          break;
      }
      
      result.created = supabaseData.length;
      result.success = true;
      
      onProgress?.({
        tableName,
        total: supabaseData.length,
        current: supabaseData.length,
        status: 'success'
      });
    } catch (error: any) {
      result.errors.push(error.message);
      onProgress?.({
        tableName,
        total: 0,
        current: 0,
        status: 'error',
        error: error.message
      });
    }
    
    results.push(result);
  }
  
  setLastSyncTime();
  return results;
}

// ==============================
// Integrity Check
// ==============================

export async function checkDataIntegrity(): Promise<IntegrityIssue[]> {
  const issues: IntegrityIssue[] = [];
  
  try {
    // Get all data
    const clients = await mockRepositoryFactory.clients.getAllClients();
    const tasks = await mockRepositoryFactory.tasks.getAllTasks();
    const approvals = await mockRepositoryFactory.approvals.getAllApprovals();
    const comments = await mockRepositoryFactory.comments.getAllComments();
    const contracts = await mockRepositoryFactory.contracts.getAllContracts();
    
    const clientIds = new Set(clients.map(c => c.id));
    
    // Check tasks
    for (const task of tasks) {
      if (task.clientId && !clientIds.has(task.clientId)) {
        issues.push({
          tableName: 'tasks',
          itemId: task.id,
          issue: `Client not found: ${task.clientId}`,
          severity: 'error'
        });
      }
    }
    
    // Check approvals
    for (const approval of approvals) {
      if (approval.clientId && !clientIds.has(approval.clientId)) {
        issues.push({
          tableName: 'approvals',
          itemId: approval.id,
          issue: `Client not found: ${approval.clientId}`,
          severity: 'error'
        });
      }
    }
    
    // Check comments
    for (const comment of comments) {
      if (comment.clientId && !clientIds.has(comment.clientId)) {
        issues.push({
          tableName: 'comments',
          itemId: comment.id,
          issue: `Client not found: ${comment.clientId}`,
          severity: 'error'
        });
      }
    }
    
    // Check contracts
    for (const contract of contracts) {
      if (contract.clientId && !clientIds.has(contract.clientId)) {
        issues.push({
          tableName: 'contracts',
          itemId: contract.id,
          issue: `Client not found: ${contract.clientId}`,
          severity: 'error'
        });
      }
    }
  } catch (error: any) {
    issues.push({
      tableName: 'clients',
      itemId: 'unknown',
      issue: `Integrity check failed: ${error.message}`,
      severity: 'error'
    });
  }
  
  return issues;
}

// ==============================
// Snapshot (Backup)
// ==============================

const SNAPSHOT_KEY = 'palss_mock_snapshot';

export function createMockSnapshot(): void {
  const snapshot = {
    timestamp: new Date().toISOString(),
    data: {
      clients: storage.get('clients') || [],
      tasks: storage.get('client_tasks') || [],
      approvals: storage.get('client_approvals') || [],
      comments: storage.get('comments') || [],
      contracts: storage.get('contracts') || [],
      notifications: storage.get('notifications') || []
    }
  };
  
  storage.set(SNAPSHOT_KEY, snapshot);
  console.log('[Sync] Mock snapshot created:', snapshot.timestamp);
}

export function restoreMockSnapshot(): boolean {
  const snapshot = storage.get(SNAPSHOT_KEY);
  
  if (!snapshot || !snapshot.data) {
    return false;
  }
  
  storage.set('clients', snapshot.data.clients);
  storage.set('client_tasks', snapshot.data.tasks);
  storage.set('client_approvals', snapshot.data.approvals);
  storage.set('comments', snapshot.data.comments);
  storage.set('contracts', snapshot.data.contracts);
  storage.set('notifications', snapshot.data.notifications);
  
  console.log('[Sync] Mock snapshot restored:', snapshot.timestamp);
  return true;
}

export function hasSnapshot(): boolean {
  const snapshot = storage.get(SNAPSHOT_KEY);
  return !!(snapshot && snapshot.timestamp);
}

export function getSnapshotTimestamp(): string | null {
  const snapshot = storage.get(SNAPSHOT_KEY);
  return snapshot?.timestamp || null;
}

// ==============================
// Clear Operations
// ==============================

export async function clearSupabaseData(tables: TableName[]): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  
  for (const tableName of tables) {
    const result: SyncResult = {
      tableName,
      success: false,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };
    
    try {
      // Get all IDs
      let items: any[] = [];
      
      switch (tableName) {
        case 'clients':
          items = await supabaseRepositoryFactory.clients.getAllClients();
          break;
        case 'tasks':
          items = await supabaseRepositoryFactory.tasks.getAllTasks();
          break;
        case 'approvals':
          items = await supabaseRepositoryFactory.approvals.getAllApprovals();
          break;
        case 'comments':
          items = await supabaseRepositoryFactory.comments.getAllComments();
          break;
        case 'contracts':
          items = await supabaseRepositoryFactory.contracts.getAllContracts();
          break;
        case 'notifications':
          items = await supabaseRepositoryFactory.notifications.getAllNotifications();
          break;
      }
      
      // Delete each
      for (const item of items) {
        try {
          switch (tableName) {
            case 'clients':
              await supabaseRepositoryFactory.clients.deleteClient(item.id);
              break;
            case 'tasks':
              await supabaseRepositoryFactory.tasks.deleteTask(item.id);
              break;
            case 'approvals':
              await supabaseRepositoryFactory.approvals.deleteApproval(item.id);
              break;
            case 'comments':
              await supabaseRepositoryFactory.comments.deleteComment(item.id);
              break;
            case 'contracts':
              await supabaseRepositoryFactory.contracts.deleteContract(item.id);
              break;
            case 'notifications':
              await supabaseRepositoryFactory.notifications.deleteNotification(item.id);
              break;
          }
          result.created++; // using 'created' as delete count
        } catch (error: any) {
          result.failed++;
          result.errors.push(error.message);
        }
      }
      
      result.success = result.failed === 0;
    } catch (error: any) {
      result.errors.push(error.message);
    }
    
    results.push(result);
  }
  
  return results;
}

export function clearMockData(tables: TableName[]): void {
  for (const tableName of tables) {
    switch (tableName) {
      case 'clients':
        storage.remove('clients');
        break;
      case 'tasks':
        storage.remove('client_tasks');
        break;
      case 'approvals':
        storage.remove('client_approvals');
        break;
      case 'comments':
        storage.remove('comments');
        break;
      case 'contracts':
        storage.remove('contracts');
        break;
      case 'notifications':
        storage.remove('notifications');
        break;
    }
  }
}
