// Supabase Repository Implementation
// Phase 9: SupabaseベースのRepository
// Phase 8.5: Incremental Pull対応

import type {
  ITaskRepository,
  IApprovalRepository,
  ICommentRepository,
  IContractRepository,
  INotificationRepository,
  IClientRepository,
  IRepositoryFactory,
  IncrementalPullOptions,
  IncrementalPullResult
} from './interfaces';

import type { Task, Approval, Comment, Contract, Notification, Client } from '../types';
import { getSupabaseClient } from '../utils/supabase';

// ==============================
// Helper: Snake case <-> Camel case変換
// ==============================
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// ==============================
// Supabase Task Repository
// ==============================
class SupabaseTaskRepository implements ITaskRepository {
  private supabase = getSupabaseClient();

  async getAllTasks(): Promise<Task[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('tasks').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('tasks').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async getTasksByClientId(clientId: string): Promise<Task[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('tasks').select('*').eq('client_id', clientId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('tasks').select('*').eq('status', status);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeTask = toSnakeCase(task);
    const { data, error } = await this.supabase.from('tasks').insert(snakeTask).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('tasks')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateTasks(tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Task[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeTasks = toSnakeCase(tasks);
    const { data, error } = await this.supabase.from('tasks').insert(snakeTasks).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull
  async getTasksIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Task>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('tasks')
      .select('*')
      .order('updated_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('updated_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].updatedAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Approval Repository
// ==============================
class SupabaseApprovalRepository implements IApprovalRepository {
  private supabase = getSupabaseClient();

  async getAllApprovals(): Promise<Approval[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('approvals').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getApprovalById(id: string): Promise<Approval | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('approvals').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async getApprovalsByClientId(clientId: string): Promise<Approval[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('approvals').select('*').eq('client_id', clientId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getApprovalsByStatus(status: string): Promise<Approval[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('approvals').select('*').eq('status', status);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>): Promise<Approval> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeApproval = toSnakeCase(approval);
    const { data, error } = await this.supabase.from('approvals').insert(snakeApproval).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateApproval(id: string, updates: Partial<Approval>): Promise<Approval> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('approvals')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteApproval(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('approvals').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateApprovals(approvals: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Approval[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeApprovals = toSnakeCase(approvals);
    const { data, error } = await this.supabase.from('approvals').insert(snakeApprovals).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull
  async getApprovalsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Approval>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('approvals')
      .select('*')
      .order('updated_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('updated_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].updatedAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Comment Repository
// ==============================
class SupabaseCommentRepository implements ICommentRepository {
  private supabase = getSupabaseClient();

  async getAllComments(): Promise<Comment[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('comments').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getCommentById(id: string): Promise<Comment | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('comments').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async getCommentsByClientId(clientId: string): Promise<Comment[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('comments').select('*').eq('client_id', clientId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('comments').select('*').eq('task_id', taskId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getCommentsByApprovalId(approvalId: string): Promise<Comment[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('comments').select('*').eq('approval_id', approvalId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeComment = toSnakeCase(comment);
    const { data, error } = await this.supabase.from('comments').insert(snakeComment).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('comments')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteComment(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateComments(comments: Omit<Comment, 'id' | 'createdAt'>[]): Promise<Comment[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeComments = toSnakeCase(comments);
    const { data, error } = await this.supabase.from('comments').insert(snakeComments).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull (created_atベース)
  async getCommentsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Comment>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('created_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].createdAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Contract Repository
// ==============================
class SupabaseContractRepository implements IContractRepository {
  private supabase = getSupabaseClient();

  async getAllContracts(): Promise<Contract[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('contracts').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getContractById(id: string): Promise<Contract | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('contracts').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async getContractsByClientId(clientId: string): Promise<Contract[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('contracts').select('*').eq('client_id', clientId);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getContractsByStatus(status: string): Promise<Contract[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('contracts').select('*').eq('status', status);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async createContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeContract = toSnakeCase(contract);
    const { data, error } = await this.supabase.from('contracts').insert(snakeContract).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('contracts')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteContract(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('contracts').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateContracts(contracts: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Contract[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeContracts = toSnakeCase(contracts);
    const { data, error } = await this.supabase.from('contracts').insert(snakeContracts).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull
  async getContractsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Contract>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('contracts')
      .select('*')
      .order('updated_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('updated_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].updatedAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Notification Repository
// ==============================
class SupabaseNotificationRepository implements INotificationRepository {
  private supabase = getSupabaseClient();

  async getAllNotifications(): Promise<Notification[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('notifications').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('notifications').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('notifications').select('*').eq('read', false);
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeNotification = toSnakeCase(notification);
    const { data, error } = await this.supabase.from('notifications').insert(snakeNotification).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('notifications')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.updateNotification(id, { read: true });
  }

  async markAllAsRead(): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('notifications').update({ read: true }).eq('read', false);
    if (error) throw error;
  }

  async deleteNotification(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateNotifications(notifications: Omit<Notification, 'id' | 'createdAt'>[]): Promise<Notification[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeNotifications = toSnakeCase(notifications);
    const { data, error } = await this.supabase.from('notifications').insert(snakeNotifications).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull (created_atベース)
  async getNotificationsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Notification>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('created_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].createdAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Client Repository
// ==============================
class SupabaseClientRepository implements IClientRepository {
  private supabase = getSupabaseClient();

  async getAllClients(): Promise<Client[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('clients').select('*');
    if (error) throw error;
    return toCamelCase(data || []);
  }

  async getClientById(id: string): Promise<Client | null> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { data, error } = await this.supabase.from('clients').select('*').eq('id', id).single();
    if (error) return null;
    return toCamelCase(data);
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeClient = toSnakeCase(client);
    const { data, error } = await this.supabase.from('clients').insert(snakeClient).select().single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await this.supabase
      .from('clients')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteClient(id: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const { error } = await this.supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  }

  async bulkCreateClients(clients: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Client[]> {
    if (!this.supabase) throw new Error('Supabase not configured');
    const snakeClients = toSnakeCase(clients);
    const { data, error } = await this.supabase.from('clients').insert(snakeClients).select();
    if (error) throw error;
    return toCamelCase(data || []);
  }

  // Phase 8.5: Incremental Pull
  async getClientsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Client>> {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    let query = this.supabase
      .from('clients')
      .select('*')
      .order('updated_at', { ascending: true });
    
    if (options?.since) {
      query = query.gt('updated_at', options.since);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const items = toCamelCase(data || []);
    const latestTimestamp = items.length > 0 ? items[items.length - 1].updatedAt : undefined;
    
    return {
      items,
      hasMore: items.length === (options?.limit || 0),
      latestTimestamp
    };
  }
}

// ==============================
// Supabase Repository Factory
// ==============================
export class SupabaseRepositoryFactory implements IRepositoryFactory {
  public tasks: ITaskRepository;
  public approvals: IApprovalRepository;
  public comments: ICommentRepository;
  public contracts: IContractRepository;
  public notifications: INotificationRepository;
  public clients: IClientRepository;

  constructor() {
    this.tasks = new SupabaseTaskRepository();
    this.approvals = new SupabaseApprovalRepository();
    this.comments = new SupabaseCommentRepository();
    this.contracts = new SupabaseContractRepository();
    this.notifications = new SupabaseNotificationRepository();
    this.clients = new SupabaseClientRepository();
  }
}

// Export singleton instance
export const supabaseRepositoryFactory = new SupabaseRepositoryFactory();