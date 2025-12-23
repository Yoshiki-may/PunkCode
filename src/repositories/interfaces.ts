// Repository Interfaces
// Phase 9: データ層の抽象化（Mock / Supabase切替用）
// Phase 8.5: Incremental Pull対応

import type { 
  Task, 
  Approval, 
  Notification, 
  Comment, 
  Contract, 
  Client 
} from '../types';

// ==============================
// Incremental Pull Options
// ==============================
export interface IncrementalPullOptions {
  since?: string; // updated_at or created_at の境界値（ISO 8601）
  limit?: number; // 1回の取得上限
}

export interface IncrementalPullResult<T> {
  items: T[];
  hasMore: boolean; // まだ取得すべきデータがあるか
  latestTimestamp?: string; // 取得した中で最新のタイムスタンプ
}

// ==============================
// Task Repository Interface
// ==============================
export interface ITaskRepository {
  // Read
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  getTasksByClientId(clientId: string): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<Task[]>;
  
  // Incremental Pull (Phase 8.5)
  getTasksIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Task>>;
  
  // Write
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Bulk
  bulkCreateTasks(tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Task[]>;
}

// ==============================
// Approval Repository Interface
// ==============================
export interface IApprovalRepository {
  // Read
  getAllApprovals(): Promise<Approval[]>;
  getApprovalById(id: string): Promise<Approval | null>;
  getApprovalsByClientId(clientId: string): Promise<Approval[]>;
  getApprovalsByStatus(status: string): Promise<Approval[]>;
  
  // Incremental Pull (Phase 8.5)
  getApprovalsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Approval>>;
  
  // Write
  createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>): Promise<Approval>;
  updateApproval(id: string, updates: Partial<Approval>): Promise<Approval>;
  deleteApproval(id: string): Promise<void>;
  
  // Bulk
  bulkCreateApprovals(approvals: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Approval[]>;
}

// ==============================
// Comment Repository Interface
// ==============================
export interface ICommentRepository {
  // Read
  getAllComments(): Promise<Comment[]>;
  getCommentById(id: string): Promise<Comment | null>;
  getCommentsByClientId(clientId: string): Promise<Comment[]>;
  getCommentsByTaskId(taskId: string): Promise<Comment[]>;
  getCommentsByApprovalId(approvalId: string): Promise<Comment[]>;
  
  // Incremental Pull (Phase 8.5)
  getCommentsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Comment>>;
  
  // Write
  createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>;
  updateComment(id: string, updates: Partial<Comment>): Promise<Comment>;
  deleteComment(id: string): Promise<void>;
  
  // Bulk
  bulkCreateComments(comments: Omit<Comment, 'id' | 'createdAt'>[]): Promise<Comment[]>;
}

// ==============================
// Contract Repository Interface
// ==============================
export interface IContractRepository {
  // Read
  getAllContracts(): Promise<Contract[]>;
  getContractById(id: string): Promise<Contract | null>;
  getContractsByClientId(clientId: string): Promise<Contract[]>;
  getContractsByStatus(status: string): Promise<Contract[]>;
  
  // Incremental Pull (Phase 8.5)
  getContractsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Contract>>;
  
  // Write
  createContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract>;
  updateContract(id: string, updates: Partial<Contract>): Promise<Contract>;
  deleteContract(id: string): Promise<void>;
  
  // Bulk
  bulkCreateContracts(contracts: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Contract[]>;
}

// ==============================
// Notification Repository Interface
// ==============================
export interface INotificationRepository {
  // Read
  getAllNotifications(): Promise<Notification[]>;
  getNotificationById(id: string): Promise<Notification | null>;
  getUnreadNotifications(): Promise<Notification[]>;
  
  // Incremental Pull (Phase 8.5)
  getNotificationsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Notification>>;
  
  // Write
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  updateNotification(id: string, updates: Partial<Notification>): Promise<Notification>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  
  // Bulk
  bulkCreateNotifications(notifications: Omit<Notification, 'id' | 'createdAt'>[]): Promise<Notification[]>;
}

// ==============================
// Client Repository Interface
// ==============================
export interface IClientRepository {
  // Read
  getAllClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  
  // Incremental Pull (Phase 8.5)
  getClientsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Client>>;
  
  // Write
  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Bulk
  bulkCreateClients(clients: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Client[]>;
}

// ==============================
// Repository Factory Interface
// ==============================
export interface IRepositoryFactory {
  tasks: ITaskRepository;
  approvals: IApprovalRepository;
  comments: ICommentRepository;
  contracts: IContractRepository;
  notifications: INotificationRepository;
  clients: IClientRepository;
}