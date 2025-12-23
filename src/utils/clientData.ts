// 共通クライアントデータ管理
// DirectionBoard、SalesBoardなど全てのボードで使用される一元管理されたクライアントデータ
// Phase 9.3: Repository経由でデータを取得（mock/supabase自動切替） + outbox統合

import { storage, STORAGE_KEYS } from './storage';
import { getAllClients as getDBClients, Client as DBClient } from './mockDatabase';
import { normalizeTask, normalizeApproval, touchTask, touchApproval, normalizeTasks, normalizeApprovals } from './dataMigration';
// Phase 9.3: Repository経由でデータ取得
import { getTaskRepository, getApprovalRepository, getNotificationRepository, getClientRepository } from '../repositories';
import { getCurrentAuthUser } from './auth';
import { getCurrentDataMode } from './supabase';
import { addOutboxItem, updateOutboxItem } from './outbox';

export interface ClientBasicInfo {
  id: string;
  name: string;
  industry: string;
  initials: string;
  contractStart: string;
  monthlyPosts: number;
  platforms: ('Instagram' | 'Twitter' | 'TikTok' | 'Facebook' | 'YouTube')[];
  followers: number;
  followerChange: number;
  engagement: number;
  engagementChange: number;
  status: 'approval-delay' | 'extra-requests' | 'recent-delay' | 'healthy';
  statusLabel: string;
  activeTasks: number;
  isPinned: boolean;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  description?: string;
  // 契約ステータス（サイドバーとメイン画面の同期用）
  contractStatus: 'negotiating' | 'contracted' | 'active' | 'pending' | 'paused';
}

export interface ClientKPI {
  followers: { current: number; change: number; target: number };
  engagement: { current: number; change: number; target: number };
  reach: { current: number; change: number; target: number };
  impressions: { current: number; change: number; target: number };
  posts: { current: number; monthlyTarget: number };
  satisfaction: { score: number; previousScore: number };
}

export interface ClientTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'approval' | 'rejected' | 'completed';
  postDate: string;
  platform: 'Instagram' | 'Twitter' | 'TikTok' | 'Facebook' | 'YouTube';
  assignee: string;
  initials: string;
  rejectedCount?: number;
  dueDate?: string;
  delayReason?: string;
  nextAction?: string;
  // Phase 4: 追加フィールド（KPI/停滞検出用）
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
  completedAt?: string;
}

export interface ClientContent {
  id: string;
  title: string;
  platform: string;
  status: 'scheduled' | 'published' | 'draft';
  date: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface ClientApproval {
  id: string;
  title: string;
  type: 'video' | 'image' | 'copy';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  reviewer: string;
  comments?: string;
  platform: string;
  // Phase 4: 追加フィールド（KPI/停滞検出用）
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  rejectedCount?: number;
}

export interface ClientData extends ClientBasicInfo {
  kpi: ClientKPI;
  tasks: ClientTask[];
  recentContent: ClientContent[];
  pendingApprovals: ClientApproval[];
}

// ダミークライアントデータ
export const clientsData: ClientData[] = [
  {
    // 基本情報
    id: 'client-1',
    name: '株式会社サンプル',
    industry: '美容・コスメ',
    initials: 'SS',
    contractStart: '2024.04.01',
    monthlyPosts: 32,
    platforms: ['Instagram', 'Twitter', 'TikTok'],
    followers: 24580,
    followerChange: 6.3,
    engagement: 7.2,
    engagementChange: 5.9,
    status: 'healthy',
    statusLabel: '順調',
    activeTasks: 8,
    isPinned: true,
    contactPerson: '佐藤美咲',
    contactEmail: 'sato@sample-corp.co.jp',
    contactPhone: '03-1234-5001',
    address: '東京都渋谷区代々木1-1-1',
    description: '国内最大手の化粧品メーカー。主にInstagram/TikTokでの若年層向けブランディングを強化中。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'active',
    
    // KPI
    kpi: {
      followers: { current: 24580, change: 6.3, target: 30000 },
      engagement: { current: 7.2, change: 5.9, target: 8.0 },
      reach: { current: 185000, change: 12.4, target: 200000 },
      impressions: { current: 420000, change: 8.7, target: 500000 },
      posts: { current: 28, monthlyTarget: 32 },
      satisfaction: { score: 9.2, previousScore: 8.8 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-s1',
        title: '新商品発表 Instagram Reels',
        status: 'in-progress',
        postDate: '2024/12/25',
        platform: 'Instagram',
        assignee: '田中太郎',
        initials: 'TT'
      },
      {
        id: 'task-s2',
        title: 'クリスマスキャンペーン TikTok',
        status: 'approval',
        postDate: '2024/12/24',
        platform: 'TikTok',
        assignee: '佐藤花子',
        initials: 'SH'
      },
      {
        id: 'task-s3',
        title: 'ブランドストーリー Twitter投稿',
        status: 'completed',
        postDate: '2024/12/20',
        platform: 'Twitter',
        assignee: '鈴木一郎',
        initials: 'SI'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-s1',
        title: '冬の新作リップ紹介',
        platform: 'Instagram',
        status: 'published',
        date: '2024/12/18',
        engagement: { likes: 3420, comments: 124, shares: 89, views: 28500 }
      },
      {
        id: 'content-s2',
        title: 'メイクアップチュートリアル',
        platform: 'TikTok',
        status: 'published',
        date: '2024/12/15',
        engagement: { likes: 8920, comments: 342, shares: 456, views: 125000 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: [
      {
        id: 'approval-s1',
        title: '新商品発表 Instagram Reels',
        type: 'video',
        submittedDate: '2024/12/21 14:00',
        status: 'pending',
        reviewer: '佐藤美咲',
        platform: 'Instagram'
      }
    ]
  },
  
  {
    // 基本情報
    id: 'client-2',
    name: 'AXAS株式会社',
    industry: 'IT・テクノロジー',
    initials: 'AX',
    contractStart: '2024.03.15',
    monthlyPosts: 28,
    platforms: ['Instagram', 'Twitter'],
    followers: 18230,
    followerChange: -2.1,
    engagement: 5.8,
    engagementChange: -1.2,
    status: 'approval-delay',
    statusLabel: '承認滞留',
    activeTasks: 12,
    isPinned: true,
    contactPerson: '山田太郎',
    contactEmail: 'yamada@axas.co.jp',
    contactPhone: '03-1234-5678',
    address: '東京都港区六本木3-2-1',
    description: 'SaaSプロダクトを提供するIT企業。BtoB向けのソートリーダーシップ戦略を展開中。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'active',
    
    // KPI
    kpi: {
      followers: { current: 18230, change: -2.1, target: 20000 },
      engagement: { current: 5.8, change: -1.2, target: 7.0 },
      reach: { current: 142000, change: -3.5, target: 180000 },
      impressions: { current: 320000, change: -2.8, target: 400000 },
      posts: { current: 24, monthlyTarget: 28 },
      satisfaction: { score: 7.8, previousScore: 8.5 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-a1',
        title: 'Instagram Reels - 新商品紹介',
        status: 'approval',
        postDate: '2024/12/24',
        platform: 'Instagram',
        assignee: '田中太郎',
        initials: 'TT',
        dueDate: '2024/12/23 18:00',
        delayReason: 'クライアント承認待ち（3日経過）',
        nextAction: '再催促メール送信'
      },
      {
        id: 'task-a2',
        title: 'Twitter - 製品アップデート告知',
        status: 'rejected',
        postDate: '2024/12/22',
        platform: 'Twitter',
        assignee: '佐藤花子',
        initials: 'SH',
        rejectedCount: 2,
        nextAction: '修正版再提出'
      },
      {
        id: 'task-a3',
        title: 'Instagram Stories - キャンペーン',
        status: 'in-progress',
        postDate: '2024/12/26',
        platform: 'Instagram',
        assignee: '鈴木一郎',
        initials: 'SI'
      },
      {
        id: 'task-a4',
        title: 'TikTok動画 - 商品PR',
        status: 'pending',
        postDate: '2024/12/28',
        platform: 'TikTok',
        assignee: '田太郎',
        initials: 'TT'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-a1',
        title: '新機能リリース告知',
        platform: 'Twitter',
        status: 'published',
        date: '2024/12/19',
        engagement: { likes: 245, comments: 32, shares: 18, views: 5200 }
      },
      {
        id: 'content-a2',
        title: '活用事例紹介',
        platform: 'Instagram',
        status: 'published',
        date: '2024/12/16',
        engagement: { likes: 512, comments: 28, shares: 45, views: 8900 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: [
      {
        id: 'approval-a1',
        title: 'Instagram Reels - 新商品紹介',
        type: 'video',
        submittedDate: '2024/12/18 15:00',
        status: 'pending',
        reviewer: '山田太郎',
        comments: '3日間返信なし',
        platform: 'Instagram'
      },
      {
        id: 'approval-a2',
        title: 'Twitter投稿 - 製品アップデート',
        type: 'copy',
        submittedDate: '2024/12/20 10:00',
        status: 'revision',
        reviewer: '山田太郎',
        comments: 'トーンを修正してください',
        platform: 'Twitter'
      }
    ]
  },
  
  {
    // 基本情報
    id: 'client-3',
    name: 'BAYMAX株式会社',
    industry: 'フード・飲食',
    initials: 'BM',
    contractStart: '2024.05.01',
    monthlyPosts: 40,
    platforms: ['Instagram', 'TikTok', 'Facebook'],
    followers: 32150,
    followerChange: 12.4,
    engagement: 9.1,
    engagementChange: 8.3,
    status: 'extra-requests',
    statusLabel: '追加要望増',
    activeTasks: 15,
    isPinned: false,
    contactPerson: '高橋健一',
    contactEmail: 'takahashi@baymax.co.jp',
    contactPhone: '03-2345-6789',
    address: '東京都新宿区西新宿2-8-1',
    description: '全国展開のカフェチェーン。季節限定メニューのプロモーションに注力。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'negotiating',
    
    // KPI
    kpi: {
      followers: { current: 32150, change: 12.4, target: 40000 },
      engagement: { current: 9.1, change: 8.3, target: 10.0 },
      reach: { current: 245000, change: 15.2, target: 300000 },
      impressions: { current: 580000, change: 18.5, target: 650000 },
      posts: { current: 38, monthlyTarget: 40 },
      satisfaction: { score: 8.5, previousScore: 8.2 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-b1',
        title: 'クリスマス限定メニュー Instagram',
        status: 'in-progress',
        postDate: '2024/12/23',
        platform: 'Instagram',
        assignee: '佐藤花子',
        initials: 'SH'
      },
      {
        id: 'task-b2',
        title: '店舗紹介 TikTok動画',
        status: 'approval',
        postDate: '2024/12/25',
        platform: 'TikTok',
        assignee: '鈴木一郎',
        initials: 'SI'
      },
      {
        id: 'task-b3',
        title: 'キャンペーン告知 Facebook',
        status: 'pending',
        postDate: '2024/12/27',
        platform: 'Facebook',
        assignee: '田中太郎',
        initials: 'TT'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-b1',
        title: '冬の新メニュー',
        platform: 'Instagram',
        status: 'published',
        date: '2024/12/17',
        engagement: { likes: 5420, comments: 234, shares: 156, views: 42000 }
      },
      {
        id: 'content-b2',
        title: 'バリスタの1日',
        platform: 'TikTok',
        status: 'published',
        date: '2024/12/14',
        engagement: { likes: 12300, comments: 456, shares: 789, views: 185000 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: [
      {
        id: 'approval-b1',
        title: 'クリスマス限定メニュー',
        type: 'image',
        submittedDate: '2024/12/21 11:00',
        status: 'pending',
        reviewer: '高橋健一',
        platform: 'Instagram'
      }
    ]
  },
  
  {
    // 基本情報
    id: 'client-4',
    name: 'デジタルフロンティア',
    industry: 'エンターテイメント',
    initials: 'DF',
    contractStart: '2024.02.10',
    monthlyPosts: 24,
    platforms: ['Twitter', 'TikTok', 'YouTube'],
    followers: 15680,
    followerChange: 3.7,
    engagement: 6.4,
    engagementChange: 2.1,
    status: 'recent-delay',
    statusLabel: '直近遅延',
    activeTasks: 6,
    isPinned: false,
    contactPerson: '伊藤美和',
    contactEmail: 'ito@digitalfrontier.jp',
    contactPhone: '03-3456-7890',
    address: '東京都品川区大崎1-2-2',
    description: 'ゲーム・アニメコンテンツ制作会社。新作タイトルのティザー展開中。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'negotiating',
    
    // KPI
    kpi: {
      followers: { current: 15680, change: 3.7, target: 18000 },
      engagement: { current: 6.4, change: 2.1, target: 7.5 },
      reach: { current: 98000, change: 5.3, target: 120000 },
      impressions: { current: 210000, change: 4.2, target: 280000 },
      posts: { current: 20, monthlyTarget: 24 },
      satisfaction: { score: 8.0, previousScore: 8.1 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-d1',
        title: '新作ゲーム告知 Twitter',
        status: 'in-progress',
        postDate: '2024/12/24',
        platform: 'Twitter',
        assignee: '鈴木一郎',
        initials: 'SI',
        dueDate: '2024/12/23 15:00',
        delayReason: '素材待ち（1日遅延）'
      },
      {
        id: 'task-d2',
        title: 'ティザー動画 TikTok',
        status: 'approval',
        postDate: '2024/12/26',
        platform: 'TikTok',
        assignee: '田中太郎',
        initials: 'TT'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-d1',
        title: 'キャラクター紹介',
        platform: 'Twitter',
        status: 'published',
        date: '2024/12/18',
        engagement: { likes: 1820, comments: 145, shares: 234, views: 18500 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: [
      {
        id: 'approval-d1',
        title: 'ティザー動画',
        type: 'video',
        submittedDate: '2024/12/21 16:00',
        status: 'pending',
        reviewer: '伊藤美和',
        platform: 'TikTok'
      }
    ]
  },
  
  {
    // 基本情報
    id: 'client-5',
    name: 'グローバルソリューションズ',
    industry: 'コンサルティング',
    initials: 'GS',
    contractStart: '2024.01.20',
    monthlyPosts: 20,
    platforms: ['Instagram', 'Twitter'],
    followers: 9840,
    followerChange: 1.8,
    engagement: 4.2,
    engagementChange: 0.5,
    status: 'healthy',
    statusLabel: '順調',
    activeTasks: 4,
    isPinned: false,
    contactPerson: '中村誠',
    contactEmail: 'nakamura@globalsolutions.co.jp',
    contactPhone: '03-4567-8901',
    address: '東京都千代田区丸の内1-9-2',
    description: '経営コンサルティングファーム。BtoB向けソートリーダーシップ構築を推進。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'negotiating',
    
    // KPI
    kpi: {
      followers: { current: 9840, change: 1.8, target: 12000 },
      engagement: { current: 4.2, change: 0.5, target: 5.0 },
      reach: { current: 62000, change: 2.3, target: 80000 },
      impressions: { current: 145000, change: 1.9, target: 180000 },
      posts: { current: 18, monthlyTarget: 20 },
      satisfaction: { score: 8.8, previousScore: 8.7 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-g1',
        title: 'インサイト記事 Twitter',
        status: 'in-progress',
        postDate: '2024/12/25',
        platform: 'Twitter',
        assignee: '佐藤花子',
        initials: 'SH'
      },
      {
        id: 'task-g2',
        title: 'ウェビナー告知 Instagram',
        status: 'completed',
        postDate: '2024/12/20',
        platform: 'Instagram',
        assignee: '田中太郎',
        initials: 'TT'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-g1',
        title: '業界トレンド分析',
        platform: 'Twitter',
        status: 'published',
        date: '2024/12/19',
        engagement: { likes: 342, comments: 45, shares: 67, views: 4200 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: []
  },
  
  {
    // 基本情報
    id: 'client-6',
    name: 'クリエイティブワークス',
    industry: 'デザイン・制作',
    initials: 'CW',
    contractStart: '2024.06.01',
    monthlyPosts: 36,
    platforms: ['Instagram', 'Twitter', 'TikTok'],
    followers: 28900,
    followerChange: 8.9,
    engagement: 7.8,
    engagementChange: 4.2,
    status: 'healthy',
    statusLabel: '順調',
    activeTasks: 10,
    isPinned: false,
    contactPerson: '小林麻衣',
    contactEmail: 'kobayashi@creativeworks.jp',
    contactPhone: '03-5678-9012',
    address: '東京都目黒区中目黒1-10-23',
    description: 'デザイン制作会社。クリエイティブなビジュアルコンテンツに特化。',
    // 契約ステータス（サイドバーとメイン画面の同期用）
    contractStatus: 'active',
    
    // KPI
    kpi: {
      followers: { current: 28900, change: 8.9, target: 35000 },
      engagement: { current: 7.8, change: 4.2, target: 9.0 },
      reach: { current: 215000, change: 11.5, target: 250000 },
      impressions: { current: 495000, change: 9.8, target: 550000 },
      posts: { current: 34, monthlyTarget: 36 },
      satisfaction: { score: 9.0, previousScore: 8.7 }
    },
    
    // タスク
    tasks: [
      {
        id: 'task-c1',
        title: 'ポートフォリオ紹介 Instagram',
        status: 'in-progress',
        postDate: '2024/12/24',
        platform: 'Instagram',
        assignee: '田中太郎',
        initials: 'TT'
      },
      {
        id: 'task-c2',
        title: 'デザインプロセス TikTok',
        status: 'approval',
        postDate: '2024/12/26',
        platform: 'TikTok',
        assignee: '佐藤花子',
        initials: 'SH'
      },
      {
        id: 'task-c3',
        title: 'クライアント事例 Twitter',
        status: 'completed',
        postDate: '2024/12/21',
        platform: 'Twitter',
        assignee: '鈴木一郎',
        initials: 'SI'
      }
    ],
    
    // 最近のコンテンツ
    recentContent: [
      {
        id: 'content-c1',
        title: '最新デザイン作品',
        platform: 'Instagram',
        status: 'published',
        date: '2024/12/18',
        engagement: { likes: 4250, comments: 198, shares: 234, views: 35000 }
      },
      {
        id: 'content-c2',
        title: 'クリエイティブTips',
        platform: 'TikTok',
        status: 'published',
        date: '2024/12/16',
        engagement: { likes: 9800, comments: 321, shares: 567, views: 142000 }
      }
    ],
    
    // 承認待ち
    pendingApprovals: [
      {
        id: 'approval-c1',
        title: 'デザインプロセス動画',
        type: 'video',
        submittedDate: '2024/12/21 13:00',
        status: 'pending',
        reviewer: '小林麻衣',
        platform: 'TikTok'
      }
    ]
  }
];

// ヘルパー関数 - LocalStorageとの統合
export const getClientById = (id: string): ClientData | undefined => {
  // まずLocalStorageから新しく追加されたクライアントを探す
  const dbClients = getDBClients();
  const dbClient = dbClients.find(c => c.id === id);
  
  if (dbClient) {
    // LocalStorageのクライアントデータをClientData形式に変換
    const baseClient = convertDBClientToClientData(dbClient);
    // LocalStorageからタスク、コンテンツ、承認待ちを取得して追加
    return {
      ...baseClient,
      tasks: getClientTasks(id),
      recentContent: getClientContent(id),
      pendingApprovals: getClientApprovals(id)
    };
  }
  
  // LocalStorageになければ、静的データから探す
  const staticClient = clientsData.find(client => client.id === id);
  if (!staticClient) return undefined;
  
  // 静的クライアントでもLocalStorageのデータを優先
  return {
    ...staticClient,
    tasks: getClientTasks(id),
    recentContent: getClientContent(id),
    pendingApprovals: getClientApprovals(id)
  };
};

// LocalStorageのClient型をClientData型に変換
function convertDBClientToClientData(dbClient: DBClient): ClientData {
  const initials = dbClient.company.substring(0, 2).toUpperCase();
  
  return {
    id: dbClient.id,
    name: dbClient.company,
    industry: dbClient.industry || '未設定',
    initials: initials,
    contractStart: new Date(dbClient.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
    monthlyPosts: 0,
    platforms: ['Instagram'],
    followers: 0,
    followerChange: 0,
    engagement: 0,
    engagementChange: 0,
    status: dbClient.status === 'active' ? 'healthy' : 'approval-delay',
    statusLabel: dbClient.status === 'active' ? '順調' : '要確認',
    activeTasks: 0,
    isPinned: false,
    contactPerson: dbClient.name,
    contactEmail: '',
    contactPhone: '',
    address: '',
    description: dbClient.notes || '',
    contractStatus: dbClient.status === 'active' ? 'active' : dbClient.status === 'pending' ? 'pending' : 'paused',
    kpi: {
      followers: { current: 0, change: 0, target: 10000 },
      engagement: { current: 0, change: 0, target: 5.0 },
      reach: { current: 0, change: 0, target: 50000 },
      impressions: { current: 0, change: 0, target: 100000 },
      posts: { current: 0, monthlyTarget: 20 },
      satisfaction: { score: 0, previousScore: 0 }
    },
    tasks: [],
    recentContent: [],
    pendingApprovals: []
  };
}

export const getClientsByStatus = (status: ClientBasicInfo['status']): ClientData[] => {
  // 全クライアント（静的 + LocalStorage）を取得してフィルター
  return getAllClients().filter(client => client.status === status);
};

export const getPinnedClients = (): ClientData[] => {
  // 全クライアント（静的 + LocalStorage）を取得してフィルター
  return getAllClients().filter(client => client.isPinned);
};

export const getAllClients = (): ClientData[] => {
  // LocalStorageのクライアントを取得
  const dbClients = getDBClients();
  
  // LocalStorageのクライアントをClientData形式に変換
  const dynamicClients = dbClients.map(convertDBClientToClientData);
  
  // 静的データとマージ（重複を避けるため、IDで確認）
  const staticClientIds = clientsData.map(c => c.id);
  const newDynamicClients = dynamicClients.filter(c => !staticClientIds.includes(c.id));
  
  return [...clientsData, ...newDynamicClients];
};

export const searchClients = (query: string): ClientData[] => {
  const lowerQuery = query.toLowerCase();
  // 全クライアント（静的 + LocalStorage）を取得して検索
  return getAllClients().filter(client => 
    client.name.toLowerCase().includes(lowerQuery) ||
    client.industry.toLowerCase().includes(lowerQuery)
  );
};

// クライアントのKPIを更新
export const updateClientKPI = (clientId: string, kpi: Partial<ClientKPI>): boolean => {
  const allKPIs = storage.get<Record<string, ClientKPI>>(STORAGE_KEYS.CLIENT_KPI) || {};
  const currentKPI = allKPIs[clientId] || getClientById(clientId)?.kpi;
  
  if (!currentKPI) return false;
  
  allKPIs[clientId] = { ...currentKPI, ...kpi };
  return storage.set(STORAGE_KEYS.CLIENT_KPI, allKPIs);
};

// クライアントのタスクを追加（Phase 9.3: Repository経由 + outbox統合）
export const addClientTask = (clientId: string, task: ClientTask): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getTaskRepository();
    const authUser = getCurrentAuthUser();
    
    // 新規タスクには createdAt/updatedAt/lastActivityAt を自動設定
    const now = new Date().toISOString();
    const normalizedTask: ClientTask = {
      ...task,
      createdAt: task.createdAt || now,
      updatedAt: task.updatedAt || now,
      lastActivityAt: task.lastActivityAt || now
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('task.create', {
        ...normalizedTask,
        clientId,
        org_id: authUser?.org_id,
        client_id: clientId,
        user_id: authUser?.id
      });
    }
    
    // Repository経由で作成（非同期だが、fire-and-forgetで互換性維持）
    repo.createTask({
      ...normalizedTask,
      clientId,
      org_id: authUser?.org_id,
      client_id: clientId,
      user_id: authUser?.id
    } as any)
      .then(created => {
        console.log('[clientData] Task created via repository:', created.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allTasks = storage.get<Record<string, ClientTask[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
        const clientTasks = allTasks[clientId] || [];
        
        // 重複チェック
        const exists = clientTasks.some(t => t.id === created.id);
        if (!exists) {
          allTasks[clientId] = [...clientTasks, { ...created, ...normalizedTask }];
          storage.set(STORAGE_KEYS.CLIENT_TASKS, allTasks);
        }
      })
      .catch(error => {
        console.error('[clientData] Failed to create task via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[clientData] PERMANENT FAILURE: Task creation blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const allTasks = storage.get<Record<string, ClientTask[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
        const clientTasks = allTasks[clientId] || [];
        allTasks[clientId] = [...clientTasks, normalizedTask];
        storage.set(STORAGE_KEYS.CLIENT_TASKS, allTasks);
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to add client task:', error);
    return false;
  }
};

// クライアントのタスクを更新（Phase 9.3: Repository経由 + outbox統合）
export const updateClientTask = (clientId: string, taskId: string, updates: Partial<ClientTask>): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getTaskRepository();
    
    const now = new Date().toISOString();
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: now,
      lastActivityAt: now
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('task.update', {
        id: taskId,
        updates: updatesWithTimestamp
      });
    }
    
    // Repository経由で更新（非同期だが、fire-and-forgetで互換性維持）
    repo.updateTask(taskId, updatesWithTimestamp as any)
      .then(updated => {
        console.log('[clientData] Task updated via repository:', updated.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allTasks = storage.get<Record<string, ClientTask[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
        const clientTasks = allTasks[clientId] || [];
        
        const taskIndex = clientTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          clientTasks[taskIndex] = { ...clientTasks[taskIndex], ...updatesWithTimestamp };
          allTasks[clientId] = clientTasks;
          storage.set(STORAGE_KEYS.CLIENT_TASKS, allTasks);
        }
      })
      .catch(error => {
        console.error('[clientData] Failed to update task via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[clientData] PERMANENT FAILURE: Task update blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const allTasks = storage.get<Record<string, ClientTask[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
        const clientTasks = allTasks[clientId] || [];
        
        const taskIndex = clientTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          clientTasks[taskIndex] = { ...clientTasks[taskIndex], ...updatesWithTimestamp };
          allTasks[clientId] = clientTasks;
          storage.set(STORAGE_KEYS.CLIENT_TASKS, allTasks);
        }
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to update client task:', error);
    return false;
  }
};

// クライアントのコンテンツを追加
export const addClientContent = (clientId: string, content: ClientContent): boolean => {
  const allContent = storage.get<Record<string, ClientContent[]>>(STORAGE_KEYS.CLIENT_CONTENT) || {};
  const clientContent = allContent[clientId] || [];
  
  allContent[clientId] = [...clientContent, content];
  return storage.set(STORAGE_KEYS.CLIENT_CONTENT, allContent);
};

// クライアントの承認待ちを追加
export const addClientApproval = (clientId: string, approval: ClientApproval): boolean => {
  const allApprovals = storage.get<Record<string, ClientApproval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
  const clientApprovals = allApprovals[clientId] || [];
  
  allApprovals[clientId] = [...clientApprovals, approval];
  return storage.set(STORAGE_KEYS.CLIENT_APPROVALS, allApprovals);
};

// クライアントの承認待ちを更新（Phase 9.3: Repository経由 + outbox統合）
export const updateClientApproval = (clientId: string, approvalId: string, updates: Partial<ClientApproval>): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getApprovalRepository();
    
    const now = new Date().toISOString();
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: now
    };
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('approval.update', {
        id: approvalId,
        updates: updatesWithTimestamp
      });
    }
    
    // Repository経由で更新（非同期だが、fire-and-forgetで互換性維持）
    repo.updateApproval(approvalId, updatesWithTimestamp as any)
      .then(updated => {
        console.log('[clientData] Approval updated via repository:', updated.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const allApprovals = storage.get<Record<string, ClientApproval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
        const clientApprovals = allApprovals[clientId] || [];
        
        const approvalIndex = clientApprovals.findIndex(a => a.id === approvalId);
        if (approvalIndex !== -1) {
          clientApprovals[approvalIndex] = { ...clientApprovals[approvalIndex], ...updatesWithTimestamp };
          allApprovals[clientId] = clientApprovals;
          storage.set(STORAGE_KEYS.CLIENT_APPROVALS, allApprovals);
        }
      })
      .catch(error => {
        console.error('[clientData] Failed to update approval via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[clientData] PERMANENT FAILURE: Approval update blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const allApprovals = storage.get<Record<string, ClientApproval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
        const clientApprovals = allApprovals[clientId] || [];
        
        const approvalIndex = clientApprovals.findIndex(a => a.id === approvalId);
        if (approvalIndex !== -1) {
          clientApprovals[approvalIndex] = { ...clientApprovals[approvalIndex], ...updatesWithTimestamp };
          allApprovals[clientId] = clientApprovals;
          storage.set(STORAGE_KEYS.CLIENT_APPROVALS, allApprovals);
        }
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to update client approval:', error);
    return false;
  }
};

// クライアントのタスク一覧を取得
export const getClientTasks = (clientId: string): ClientTask[] => {
  const allTasks = storage.get<Record<string, ClientTask[]>>(STORAGE_KEYS.CLIENT_TASKS) || {};
  const storedTasks = allTasks[clientId] || [];
  
  // 静的データからもタスクを取得
  const staticClient = clientsData.find(c => c.id === clientId);
  const staticTasks = staticClient?.tasks || [];
  
  // LocalStorageのタスクを優先、なければ静的データを使用
  return storedTasks.length > 0 ? storedTasks : staticTasks;
};

// クライアントのコンテンツ一覧を取得
export const getClientContent = (clientId: string): ClientContent[] => {
  const allContent = storage.get<Record<string, ClientContent[]>>(STORAGE_KEYS.CLIENT_CONTENT) || {};
  const storedContent = allContent[clientId] || [];
  
  // 静的データからもコンテンツを取得
  const staticClient = clientsData.find(c => c.id === clientId);
  const staticContent = staticClient?.recentContent || [];
  
  return storedContent.length > 0 ? storedContent : staticContent;
};

// クライアントの承認待ち一覧を取得
export const getClientApprovals = (clientId: string): ClientApproval[] => {
  const allApprovals = storage.get<Record<string, ClientApproval[]>>(STORAGE_KEYS.CLIENT_APPROVALS) || {};
  const storedApprovals = allApprovals[clientId] || [];
  
  // 静的データからも承認待ちを取得
  const staticClient = clientsData.find(c => c.id === clientId);
  const staticApprovals = staticClient?.pendingApprovals || [];
  
  return storedApprovals.length > 0 ? storedApprovals : staticApprovals;
};

// 全承認待ちを取得（全クライアント）
// Phase 9.3: 同期版（既存コードとの互換性維持）
export const getAllApprovals = (): Array<ClientApproval & { clientId: string; clientName: string }> => {
  const allClients = getAllClients();
  const result: Array<ClientApproval & { clientId: string; clientName: string }> = [];
  
  allClients.forEach(client => {
    const approvals = getClientApprovals(client.id);
    approvals.forEach(approval => {
      result.push({
        ...approval,
        clientId: client.id,
        clientName: client.name
      });
    });
  });
  
  return result;
};

// 全タスクを取得（全クライアント）
// Phase 9.3: 同期版（既存コードとの互換性維持）
export const getAllTasks = (): Array<ClientTask & { clientId: string; clientName: string }> => {
  const allClients = getAllClients();
  const result: Array<ClientTask & { clientId: string; clientName: string }> = [];
  
  allClients.forEach(client => {
    const tasks = getClientTasks(client.id);
    tasks.forEach(task => {
      result.push({
        ...task,
        clientId: client.id,
        clientName: client.name
      });
    });
  });
  
  return result;
};

// ========================================
// 通知管理
// ========================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetUserId?: string; // 特定のユーザー向け通知（未指定の場合は全員）
  relatedClientId?: string;
  relatedItemId?: string; // タスクIDや承認ID
}

// 全通知を取得
export const getAllNotifications = (): Notification[] => {
  const notifications = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
  return notifications;
};

// 通知を追加
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): boolean => {
  const notifications = getAllNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  notifications.unshift(newNotification); // 最新を先頭に追加
  
  // 通知は最新100件まで保持
  const limitedNotifications = notifications.slice(0, 100);
  
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, limitedNotifications);
};

// 通知を既読にする
export const markNotificationAsRead = (notificationId: string): boolean => {
  const notifications = getAllNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
};

// 全通知を既読にする
export const markAllNotificationsAsRead = (): boolean => {
  const notifications = getAllNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
};

// 通知を削除
export const deleteNotification = (notificationId: string): boolean => {
  const notifications = getAllNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, filtered);
};

// 全通知をクリア
export const clearAllNotifications = (): boolean => {
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, []);
};

// ========================================
// 自動通知生成ヘルパー
// ========================================

// タスク追加時の通知
export const notifyTaskAdded = (clientName: string, taskTitle: string, assignee: string, clientId: string, taskId: string): boolean => {
  return addNotification({
    type: 'info',
    title: '新しいタスクが追加されました',
    message: `${clientName}: ${taskTitle}（担当: ${assignee}）`,
    read: false,
    relatedClientId: clientId,
    relatedItemId: taskId
  });
};

// 承認要請時の通知
export const notifyApprovalRequested = (clientName: string, contentTitle: string, reviewer: string, clientId: string, approvalId: string): boolean => {
  return addNotification({
    type: 'warning',
    title: '承認要請があります',
    message: `${clientName}: ${contentTitle}の承認��お願いします`,
    read: false,
    targetUserId: reviewer,
    relatedClientId: clientId,
    relatedItemId: approvalId
  });
};

// 承認完了時の通知
export const notifyApprovalCompleted = (clientName: string, contentTitle: string, submitter: string, clientId: string, approvalId: string): boolean => {
  return addNotification({
    type: 'success',
    title: 'コンテンツが承認されました',
    message: `${clientName}: ${contentTitle}が承認されました`,
    read: false,
    targetUserId: submitter,
    relatedClientId: clientId,
    relatedItemId: approvalId
  });
};

// 差し戻し時の通知
export const notifyApprovalRejected = (clientName: string, contentTitle: string, submitter: string, comments: string | undefined, clientId: string, approvalId: string): boolean => {
  const message = comments 
    ? `${clientName}: ${contentTitle}が差し戻されました（理由: ${comments}）`
    : `${clientName}: ${contentTitle}が差し戻されました`;
    
  return addNotification({
    type: 'error',
    title: 'コンテンツが差し戻されました',
    message,
    read: false,
    targetUserId: submitter,
    relatedClientId: clientId,
    relatedItemId: approvalId
  });
};

// タスク完時の通知
export const notifyTaskCompleted = (clientName: string, taskTitle: string, assignee: string, clientId: string, taskId: string): boolean => {
  return addNotification({
    type: 'success',
    title: 'タスクが完了しました',
    message: `${clientName}: ${taskTitle}が完了しました（担当: ${assignee}）`,
    read: false,
    relatedClientId: clientId,
    relatedItemId: taskId
  });
};

// 期限切れタスクの通知
export const notifyTaskOverdue = (clientName: string, taskTitle: string, assignee: string, clientId: string, taskId: string): boolean => {
  return addNotification({
    type: 'error',
    title: 'タスクが期限超過しています',
    message: `${clientName}: ${taskTitle}が期限を過ぎています（担当: ${assignee}）`,
    read: false,
    targetUserId: assignee,
    relatedClientId: clientId,
    relatedItemId: taskId
  });
};

// クライアント追加時の通知
export const notifyClientAdded = (clientName: string, clientId: string): boolean => {
  return addNotification({
    type: 'info',
    title: '新しいクライアントが追加されました',
    message: `${clientName}が登録されました`,
    read: false,
    relatedClientId: clientId
  });
};

// ========================================
// クライアント管理（Phase 7-3）
// ========================================

// クライアント追加（Repository経由 + outbox統合）
export const addClient = (
  client: {
    name: string;
    industry?: string;
    mainContactName?: string;
    mainContactEmail?: string;
  }
): boolean => {
  try {
    const mode = getCurrentDataMode();
    const repo = getClientRepository();
    const authUser = getCurrentAuthUser();
    
    // supabaseモードのみoutbox追加
    let outboxId: string | undefined;
    if (mode === 'supabase') {
      outboxId = addOutboxItem('client.create', {
        ...client,
        org_id: authUser?.org_id
      });
    }
    
    // Repository経由で作成（非同期だが、fire-and-forgetで互換性維持）
    repo.createClient({
      name: client.name,
      company: client.name,
      status: 'pending',
      assignedTo: authUser?.id || 'unknown',
      createdBy: authUser?.id || 'unknown',
      industry: client.industry,
      // mainContactName/mainContactEmail をマッピング
      contactPerson: client.mainContactName || '',
      email: client.mainContactEmail || `temp-${Date.now()}@example.com`, // email必須のためダミー生成
      contractStatus: 'pending',
      monthlyFee: 0
    } as any)
      .then(created => {
        console.log('[clientData] Client created via repository:', created.id);
        
        // outbox成功マーク
        if (outboxId) {
          updateOutboxItem(outboxId, {
            status: 'sent',
            lastAttemptAt: new Date().toISOString()
          });
        }
        
        // LocalStorageにも反映（mock mode互換性のため）
        const clients = getDBClients();
        const newClient: DBClient = {
          id: created.id,
          name: client.mainContactName || client.name,
          company: client.name,
          status: 'pending',
          assignedTo: authUser?.id || 'unknown',
          createdAt: created.createdAt || new Date().toISOString(),
          updatedAt: created.updatedAt || new Date().toISOString(),
          createdBy: authUser?.id || 'unknown',
          industry: client.industry
        };
        
        // 重複チェック
        const exists = clients.some(c => c.id === newClient.id);
        if (!exists) {
          storage.set(STORAGE_KEYS.CLIENTS, [...clients, newClient]);
        }
        
        // 通知を生成
        notifyClientAdded(client.name, created.id);
      })
      .catch(error => {
        console.error('[clientData] Failed to create client via repository:', error);
        
        // outbox失敗マーク（permanent failure判定）
        if (outboxId) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isPermanent = errorMsg.includes('RLS') || 
                              errorMsg.includes('permission') || 
                              errorMsg.includes('403') ||
                              errorMsg.includes('unauthorized');
          
          updateOutboxItem(outboxId, {
            status: isPermanent ? 'failed' : 'pending',
            lastAttemptAt: new Date().toISOString(),
            lastError: errorMsg,
            retryCount: 0
          });
          
          // permanent failureの場合、DEV通知を出す（フォールバックで成功扱いにしない）
          if (isPermanent) {
            console.error('[clientData] PERMANENT FAILURE: Client creation blocked by RLS/permission');
            // フォールバックはスキップ（失敗を隠さない）
            return;
          }
        }
        
        // フォールバック: LocalStorageに直接書き込み（一時的な失敗の場合のみ）
        const clients = getDBClients();
        const newClient: DBClient = {
          id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: client.mainContactName || client.name,
          company: client.name,
          status: 'pending',
          assignedTo: authUser?.id || 'unknown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: authUser?.id || 'unknown',
          industry: client.industry
        };
        
        storage.set(STORAGE_KEYS.CLIENTS, [...clients, newClient]);
        
        // 通知を生成
        notifyClientAdded(client.name, newClient.id);
      });
    
    // 同期返却（既存互換性のため）
    return true;
  } catch (error) {
    console.error('Failed to add client:', error);
    return false;
  }
};