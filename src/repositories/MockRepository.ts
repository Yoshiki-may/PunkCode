// Mock Repository Implementation
// Phase 9: LocalStorageベースのRepository（既存utilsをラップ）

import type {
  ITaskRepository,
  IApprovalRepository,
  ICommentRepository,
  IContractRepository,
  INotificationRepository,
  IClientRepository,
  IRepositoryFactory
} from './interfaces';

import type { Task, Approval, Comment, Contract, Notification, Client } from '../types';

// LocalStorage直接アクセス用
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getAllClients as getAllDBClients } from '../utils/mockDatabase';

// Helper: CLIENT_TASKSの構造（Record<clientId, Task[]>）からフラット配列に変換
function flattenTasks(): Task[] {
  const tasksRecord = storage.get<Record<string, Task[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
  const tasks: Task[] = [];
  
  Object.entries(tasksRecord).forEach(([clientId, clientTasks]) => {
    clientTasks.forEach(task => {
      tasks.push({
        ...task,
        clientId, // Ensure clientId is set
      } as Task);
    });
  });
  
  return tasks;
}

// Helper: CLIENT_APPROVALSの構造からフラット配列に変換
function flattenApprovals(): Approval[] {
  const approvalsRecord = storage.get<Record<string, Approval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
  const approvals: Approval[] = [];
  
  Object.entries(approvalsRecord).forEach(([clientId, clientApprovals]) => {
    clientApprovals.forEach(approval => {
      approvals.push({
        ...approval,
        clientId, // Ensure clientId is set
      } as Approval);
    });
  });
  
  return approvals;
}

// ==============================
// Mock Task Repository
// ==============================
class MockTaskRepository implements ITaskRepository {
  async getAllTasks(): Promise<Task[]> {
    return Promise.resolve(flattenTasks());
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = await this.getAllTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async getTasksByClientId(clientId: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(t => t.clientId === clientId);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(t => t.status === status);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await this.getAllTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    } as Task;
    
    const updated = [...tasks, newTask];
    storage.set(STORAGE_KEYS.CLIENT_TASKS, updated);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = await this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Task not found: ${id}`);
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    
    tasks[index] = updatedTask;
    storage.set(STORAGE_KEYS.CLIENT_TASKS, tasks);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const filtered = tasks.filter(t => t.id !== id);
    storage.set(STORAGE_KEYS.CLIENT_TASKS, filtered);
  }

  async bulkCreateTasks(tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Task[]> {
    const created: Task[] = [];
    for (const task of tasks) {
      created.push(await this.createTask(task));
    }
    return created;
  }
}

// ==============================
// Mock Approval Repository
// ==============================
class MockApprovalRepository implements IApprovalRepository {
  async getAllApprovals(): Promise<Approval[]> {
    return Promise.resolve(flattenApprovals());
  }

  async getApprovalById(id: string): Promise<Approval | null> {
    const approvals = await this.getAllApprovals();
    return approvals.find(a => a.id === id) || null;
  }

  async getApprovalsByClientId(clientId: string): Promise<Approval[]> {
    const approvals = await this.getAllApprovals();
    return approvals.filter(a => a.clientId === clientId);
  }

  async getApprovalsByStatus(status: string): Promise<Approval[]> {
    const approvals = await this.getAllApprovals();
    return approvals.filter(a => a.status === status);
  }

  async createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>): Promise<Approval> {
    const approvals = await this.getAllApprovals();
    const newApproval: Approval = {
      ...approval,
      id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Approval;
    
    const updated = [...approvals, newApproval];
    storage.set(STORAGE_KEYS.CLIENT_APPROVALS, updated);
    return newApproval;
  }

  async updateApproval(id: string, updates: Partial<Approval>): Promise<Approval> {
    const approvals = await this.getAllApprovals();
    const index = approvals.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error(`Approval not found: ${id}`);
    }
    
    const updatedApproval = {
      ...approvals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    approvals[index] = updatedApproval;
    storage.set(STORAGE_KEYS.CLIENT_APPROVALS, approvals);
    return updatedApproval;
  }

  async deleteApproval(id: string): Promise<void> {
    const approvals = await this.getAllApprovals();
    const filtered = approvals.filter(a => a.id !== id);
    storage.set(STORAGE_KEYS.CLIENT_APPROVALS, filtered);
  }

  async bulkCreateApprovals(approvals: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Approval[]> {
    const created: Approval[] = [];
    for (const approval of approvals) {
      created.push(await this.createApproval(approval));
    }
    return created;
  }
}

// ==============================
// Mock Comment Repository
// ==============================
class MockCommentRepository implements ICommentRepository {
  async getAllComments(): Promise<Comment[]> {
    return Promise.resolve(storage.get<Comment[]>(STORAGE_KEYS.COMMENTS) || []);
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comments = await this.getAllComments();
    return comments.find(c => c.id === id) || null;
  }

  async getCommentsByClientId(clientId: string): Promise<Comment[]> {
    const comments = await this.getAllComments();
    return comments.filter(c => c.clientId === clientId);
  }

  async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    const comments = await this.getAllComments();
    return comments.filter(c => c.taskId === taskId);
  }

  async getCommentsByApprovalId(approvalId: string): Promise<Comment[]> {
    const comments = await this.getAllComments();
    return comments.filter(c => c.approvalId === approvalId);
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const comments = await this.getAllComments();
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    } as Comment;
    
    const updated = [...comments, newComment];
    storage.set(STORAGE_KEYS.COMMENTS, updated);
    return newComment;
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    const comments = await this.getAllComments();
    const index = comments.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Comment not found: ${id}`);
    }
    
    const updatedComment = {
      ...comments[index],
      ...updates,
    };
    
    comments[index] = updatedComment;
    storage.set(STORAGE_KEYS.COMMENTS, comments);
    return updatedComment;
  }

  async deleteComment(id: string): Promise<void> {
    const comments = await this.getAllComments();
    const filtered = comments.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.COMMENTS, filtered);
  }

  async bulkCreateComments(comments: Omit<Comment, 'id' | 'createdAt'>[]): Promise<Comment[]> {
    const created: Comment[] = [];
    for (const comment of comments) {
      created.push(await this.createComment(comment));
    }
    return created;
  }
}

// ==============================
// Mock Contract Repository
// ==============================
class MockContractRepository implements IContractRepository {
  async getAllContracts(): Promise<Contract[]> {
    return Promise.resolve(storage.get<Contract[]>(STORAGE_KEYS.CONTRACTS) || []);
  }

  async getContractById(id: string): Promise<Contract | null> {
    const contracts = await this.getAllContracts();
    return contracts.find(c => c.id === id) || null;
  }

  async getContractsByClientId(clientId: string): Promise<Contract[]> {
    const contracts = await this.getAllContracts();
    return contracts.filter(c => c.clientId === clientId);
  }

  async getContractsByStatus(status: string): Promise<Contract[]> {
    const contracts = await this.getAllContracts();
    return contracts.filter(c => c.status === status);
  }

  async createContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    const contracts = await this.getAllContracts();
    const newContract: Contract = {
      ...contract,
      id: `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Contract;
    
    const updated = [...contracts, newContract];
    storage.set(STORAGE_KEYS.CONTRACTS, updated);
    return newContract;
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const contracts = await this.getAllContracts();
    const index = contracts.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Contract not found: ${id}`);
    }
    
    const updatedContract = {
      ...contracts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    contracts[index] = updatedContract;
    storage.set(STORAGE_KEYS.CONTRACTS, contracts);
    return updatedContract;
  }

  async deleteContract(id: string): Promise<void> {
    const contracts = await this.getAllContracts();
    const filtered = contracts.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.CONTRACTS, filtered);
  }

  async bulkCreateContracts(contracts: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Contract[]> {
    const created: Contract[] = [];
    for (const contract of contracts) {
      created.push(await this.createContract(contract));
    }
    return created;
  }
}

// ==============================
// Mock Notification Repository
// ==============================
class MockNotificationRepository implements INotificationRepository {
  async getAllNotifications(): Promise<Notification[]> {
    return Promise.resolve(storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || []);
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    const notifications = await this.getAllNotifications();
    return notifications.find(n => n.id === id) || null;
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const notifications = await this.getAllNotifications();
    return notifications.filter(n => !n.read);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notifications = await this.getAllNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    } as Notification;
    
    const updated = [...notifications, newNotification];
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotification;
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification> {
    const notifications = await this.getAllNotifications();
    const index = notifications.findIndex(n => n.id === id);
    
    if (index === -1) {
      throw new Error(`Notification not found: ${id}`);
    }
    
    const updatedNotification = {
      ...notifications[index],
      ...updates,
    };
    
    notifications[index] = updatedNotification;
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return updatedNotification;
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.updateNotification(id, { read: true });
  }

  async markAllAsRead(): Promise<void> {
    const notifications = await this.getAllNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  async deleteNotification(id: string): Promise<void> {
    const notifications = await this.getAllNotifications();
    const filtered = notifications.filter(n => n.id !== id);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, filtered);
  }

  async bulkCreateNotifications(notifications: Omit<Notification, 'id' | 'createdAt'>[]): Promise<Notification[]> {
    const created: Notification[] = [];
    for (const notification of notifications) {
      created.push(await this.createNotification(notification));
    }
    return created;
  }
}

// ==============================
// Mock Client Repository
// ==============================
class MockClientRepository implements IClientRepository {
  async getAllClients(): Promise<Client[]> {
    return Promise.resolve(getAllDBClients());
  }

  async getClientById(id: string): Promise<Client | null> {
    const clients = await this.getAllClients();
    return clients.find(c => c.id === id) || null;
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const clients = await this.getAllClients();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Client;
    
    const updated = [...clients, newClient];
    storage.set(STORAGE_KEYS.CLIENTS, updated);
    return newClient;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const clients = await this.getAllClients();
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Client not found: ${id}`);
    }
    
    const updatedClient = {
      ...clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    clients[index] = updatedClient;
    storage.set(STORAGE_KEYS.CLIENTS, clients);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    const clients = await this.getAllClients();
    const filtered = clients.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.CLIENTS, filtered);
  }

  async bulkCreateClients(clients: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Client[]> {
    const created: Client[] = [];
    for (const client of clients) {
      created.push(await this.createClient(client));
    }
    return created;
  }
}

// ==============================
// Mock Repository Factory
// ==============================
export class MockRepositoryFactory implements IRepositoryFactory {
  public tasks: ITaskRepository;
  public approvals: IApprovalRepository;
  public comments: ICommentRepository;
  public contracts: IContractRepository;
  public notifications: INotificationRepository;
  public clients: IClientRepository;

  constructor() {
    this.tasks = new MockTaskRepository();
    this.approvals = new MockApprovalRepository();
    this.comments = new MockCommentRepository();
    this.contracts = new MockContractRepository();
    this.notifications = new MockNotificationRepository();
    this.clients = new MockClientRepository();
  }
}

// Export singleton instance
export const mockRepositoryFactory = new MockRepositoryFactory();