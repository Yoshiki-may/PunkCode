import { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calendar,
  AlertCircle,
  Clock,
  MessageSquarePlus,
  Pin,
  ChevronRight
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  industry: string;
  initials: string;
  contractStart: string;
  monthlyPosts: number;
  platforms: string[];
  followers: number;
  followerChange: number;
  engagement: number;
  engagementChange: number;
  status: 'approval-delay' | 'extra-requests' | 'recent-delay' | 'healthy';
  statusLabel: string;
  activeTasks: number;
  isPinned: boolean;
}

interface MyClientsProps {
  onClientSelect?: (clientId: string) => void;
}

const mockClients: Client[] = [
  {
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
    isPinned: true
  },
  {
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
    isPinned: true
  },
  {
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
    isPinned: false
  },
  {
    id: 'client-4',
    name: 'デジタルフロンティア',
    industry: 'エンターテイメント',
    initials: 'DF',
    contractStart: '2024.02.10',
    monthlyPosts: 24,
    platforms: ['Twitter', 'TikTok'],
    followers: 15680,
    followerChange: 3.7,
    engagement: 6.4,
    engagementChange: 2.1,
    status: 'recent-delay',
    statusLabel: '直近遅延',
    activeTasks: 6,
    isPinned: false
  },
  {
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
    isPinned: false
  },
  {
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
    isPinned: false
  }
];

export function MyClients({ onClientSelect }: MyClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredClients = mockClients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500',
      'Twitter': 'bg-blue-400',
      'TikTok': 'bg-black dark:bg-white',
      'Facebook': 'bg-blue-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'approval-delay':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'extra-requests':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'recent-delay':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approval-delay':
        return <Clock className="w-3 h-3" strokeWidth={2} />;
      case 'extra-requests':
        return <MessageSquarePlus className="w-3 h-3" strokeWidth={2} />;
      case 'recent-delay':
        return <AlertCircle className="w-3 h-3" strokeWidth={2} />;
      default:
        return null;
    }
  };

  const statusFilters = [
    { value: 'all', label: 'すべて' },
    { value: 'healthy', label: '順調' },
    { value: 'approval-delay', label: '承認滞留' },
    { value: 'extra-requests', label: '追加要望増' },
    { value: 'recent-delay', label: '直近遅延' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">My Clients</h1>
          <p className="text-sm text-muted-foreground">担当しているクライアント一覧</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
          + 新規クライアント
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="クライアント名・業種で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-transparent rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-accent/50 border border-transparent rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {statusFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-2">総クライアント数</div>
          <div className="text-2xl text-card-foreground">{mockClients.length}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-2">ピン留め</div>
          <div className="text-2xl text-card-foreground">{mockClients.filter(c => c.isPinned).length}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-2">アクティブタスク</div>
          <div className="text-2xl text-card-foreground">{mockClients.reduce((sum, c) => sum + c.activeTasks, 0)}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-2">要注意</div>
          <div className="text-2xl text-destructive">{mockClients.filter(c => c.status !== 'healthy').length}</div>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onClientSelect?.(client.id)}
            className="bg-card rounded-2xl border border-border p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Client Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{client.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-card-foreground truncate">{client.name}</h3>
                    {client.isPinned && (
                      <Pin className="w-4 h-4 text-primary fill-primary flex-shrink-0" strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{client.industry}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" strokeWidth={2} />
            </div>

            {/* Platforms */}
            <div className="flex items-center gap-2 mb-4">
              {client.platforms.map((platform) => (
                <div
                  key={platform}
                  className={`w-6 h-6 rounded-full ${getPlatformColor(platform)} flex items-center justify-center`}
                  title={platform}
                >
                  <div className="w-3 h-3 bg-white/90 rounded-full" />
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                月{client.monthlyPosts}投稿
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-accent/30 rounded-lg p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Users className="w-3 h-3" strokeWidth={2} />
                  <span>フォロワー</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg text-card-foreground">
                    {(client.followers / 1000).toFixed(1)}k
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs ${client.followerChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {client.followerChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3" strokeWidth={2} />
                    )}
                    <span>{Math.abs(client.followerChange)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/30 rounded-lg p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                  <span>エンゲージメント</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg text-card-foreground">{client.engagement}%</div>
                  <div className={`flex items-center gap-0.5 text-xs ${client.engagementChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {client.engagementChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3" strokeWidth={2} />
                    )}
                    <span>{Math.abs(client.engagementChange)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" strokeWidth={2} />
                <span>{client.contractStart}〜</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {client.activeTasks}件のタスク
                </span>
                {client.status !== 'healthy' && (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(client.status)}`}>
                    {getStatusIcon(client.status)}
                    {client.statusLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground" strokeWidth={2} />
          </div>
          <p className="text-muted-foreground">該当するクライアントが見つかりません</p>
        </div>
      )}
    </div>
  );
}
