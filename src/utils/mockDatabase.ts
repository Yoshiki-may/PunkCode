// Mock Database for testing cross-account data sharing
import { storage, STORAGE_KEYS } from './storage';

export interface User {
  id: string;
  role: 'sales' | 'direction' | 'editor' | 'creator' | 'support' | 'client';
  name: string;
  email: string;
  avatar?: string;
  department?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  assignedTo: string; // User ID
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID
  industry?: string;
  budget?: number;
  nextMeeting?: string;
  notes?: string;
}

// Mock users - each account has a realistic name
export const MOCK_USERS: User[] = [
  {
    id: 'user_sales_001',
    role: 'sales',
    name: '田中 太郎',
    email: 'tanaka@palss.co.jp',
    department: '営業部',
  },
  {
    id: 'user_direction_001',
    role: 'direction',
    name: '佐藤 花子',
    email: 'sato@palss.co.jp',
    department: 'ディレクション部',
  },
  {
    id: 'user_editor_001',
    role: 'editor',
    name: '鈴木 一郎',
    email: 'suzuki@palss.co.jp',
    department: '編集部',
  },
  {
    id: 'user_creator_001',
    role: 'creator',
    name: '高橋 美咲',
    email: 'takahashi@palss.co.jp',
    department: '制作部',
  },
  {
    id: 'user_support_001',
    role: 'support',
    name: '伊藤 健太',
    email: 'ito@palss.co.jp',
    department: '管理部',
  },
  {
    id: 'user_client_001',
    role: 'client',
    name: '山田 商事',
    email: 'yamada@example.com',
    department: 'クライアント',
  },
];

// Initialize mock database
export function initializeMockDatabase() {
  // Initialize team members if not exists
  const existingMembers = storage.get<User[]>(STORAGE_KEYS.TEAM_MEMBERS);
  if (!existingMembers) {
    storage.set(STORAGE_KEYS.TEAM_MEMBERS, MOCK_USERS);
  }

  // Initialize clients with some sample data if not exists
  const existingClients = storage.get<Client[]>(STORAGE_KEYS.CLIENTS);
  if (!existingClients) {
    const sampleClients: Client[] = [
      {
        id: 'client_001',
        name: '山田 太郎',
        company: '株式会社サンプル',
        status: 'active',
        assignedTo: 'user_sales_001', // 田中 太郎
        createdAt: new Date(2024, 11, 1).toISOString(),
        updatedAt: new Date(2024, 11, 1).toISOString(),
        createdBy: 'user_sales_001',
        industry: 'IT',
        budget: 5000000,
        nextMeeting: '2025-01-15',
        notes: '新規クライアント。SNS運用に興味あり。',
      },
      {
        id: 'client_002',
        name: '佐々木 花子',
        company: '佐々木コーポレーション',
        status: 'active',
        assignedTo: 'user_direction_001', // 佐藤 花子
        createdAt: new Date(2024, 10, 15).toISOString(),
        updatedAt: new Date(2024, 11, 10).toISOString(),
        createdBy: 'user_sales_001',
        industry: '小売',
        budget: 3000000,
        nextMeeting: '2025-01-20',
        notes: 'Instagram運用中。成果報告が必要。',
      },
    ];
    storage.set(STORAGE_KEYS.CLIENTS, sampleClients);
  }
}

// Get current logged in user
export function getCurrentUser(): User | null {
  return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
}

// Set current logged in user
export function setCurrentUser(user: User): boolean {
  return storage.set(STORAGE_KEYS.CURRENT_USER, user);
}

// Get user by ID
export function getUserById(userId: string): User | null {
  const members = storage.get<User[]>(STORAGE_KEYS.TEAM_MEMBERS) || MOCK_USERS;
  return members.find(user => user.id === userId) || null;
}

// Get user by role
export function getUserByRole(role: string): User | null {
  const members = storage.get<User[]>(STORAGE_KEYS.TEAM_MEMBERS) || MOCK_USERS;
  return members.find(user => user.role === role) || null;
}

// Get all team members
export function getAllTeamMembers(): User[] {
  return storage.get<User[]>(STORAGE_KEYS.TEAM_MEMBERS) || MOCK_USERS;
}

// Get all clients
export function getAllClients(): Client[] {
  return storage.get<Client[]>(STORAGE_KEYS.CLIENTS) || [];
}

// Get all users
export function getAllUsers(): User[] {
  return storage.get<User[]>(STORAGE_KEYS.TEAM_MEMBERS) || MOCK_USERS;
}

// Add new client
export function addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
  const clients = getAllClients();
  const newClient: Client = {
    ...client,
    id: `client_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  storage.set(STORAGE_KEYS.CLIENTS, clients);
  return newClient;
}

// Update client
export function updateClient(clientId: string, updates: Partial<Client>): Client | null {
  const clients = getAllClients();
  const index = clients.findIndex(c => c.id === clientId);
  if (index === -1) return null;

  clients[index] = {
    ...clients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  storage.set(STORAGE_KEYS.CLIENTS, clients);
  return clients[index];
}

// Delete client
export function deleteClient(clientId: string): boolean {
  const clients = getAllClients();
  const filtered = clients.filter(c => c.id !== clientId);
  if (filtered.length === clients.length) return false;
  
  storage.set(STORAGE_KEYS.CLIENTS, filtered);
  return true;
}

// Get clients assigned to specific user
export function getClientsByAssignee(userId: string): Client[] {
  const clients = getAllClients();
  return clients.filter(c => c.assignedTo === userId);
}