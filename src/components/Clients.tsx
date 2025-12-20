import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Instagram,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  Pause,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Archive
} from 'lucide-react';
import { AddClientModal, NewClientData } from './AddClientModal';

interface Client {
  id: string;
  name: string;
  avatar: string;
  instagramHandle: string;
  contractStatus: 'active' | 'pending' | 'paused';
  industry: string;
  followers: number;
  engagement: number;
  monthlyFee: number;
  startDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  lastActivity: string;
  nextMeeting?: string;
}

interface ClientsProps {
  onClientSelect?: (clientId: string) => void;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'LUNETTA BEAUTY',
    avatar: 'LB',
    instagramHandle: '@lunetta_beauty',
    contractStatus: 'active',
    industry: 'Beauty & Cosmetics',
    followers: 125800,
    engagement: 4.2,
    monthlyFee: 280000,
    startDate: '2024-09-15',
    contactPerson: '田中 美咲',
    email: 'tanaka@lunetta.co.jp',
    phone: '03-1234-5678',
    location: '東京都渋谷区',
    lastActivity: '2時間前',
    nextMeeting: '2025-12-18 14:00'
  },
  {
    id: '2',
    name: 'URBAN THREADS',
    avatar: 'UT',
    instagramHandle: '@urban_threads',
    contractStatus: 'active',
    industry: 'Fashion & Apparel',
    followers: 89400,
    engagement: 5.1,
    monthlyFee: 320000,
    startDate: '2024-08-01',
    contactPerson: '佐藤 健太',
    email: 'sato@urbanthreads.jp',
    phone: '03-2345-6789',
    location: '東京都港区',
    lastActivity: '1日前',
    nextMeeting: '2025-12-20 10:00'
  },
  {
    id: '3',
    name: 'GREEN WELLNESS',
    avatar: 'GW',
    instagramHandle: '@green_wellness',
    contractStatus: 'active',
    industry: 'Health & Wellness',
    followers: 67200,
    engagement: 3.8,
    monthlyFee: 250000,
    startDate: '2024-10-10',
    contactPerson: '山田 花子',
    email: 'yamada@greenwellness.jp',
    phone: '03-3456-7890',
    location: '東京都世田谷区',
    lastActivity: '3時間前'
  },
  {
    id: '4',
    name: 'TECH INNOVATIONS',
    avatar: 'TI',
    instagramHandle: '@tech_innovations',
    contractStatus: 'pending',
    industry: 'Technology & SaaS',
    followers: 45600,
    engagement: 3.2,
    monthlyFee: 350000,
    startDate: '2025-01-15',
    contactPerson: '鈴木 太郎',
    email: 'suzuki@techinnovations.co.jp',
    phone: '03-4567-8901',
    location: '東京都千代田区',
    lastActivity: '5日前',
    nextMeeting: '2025-12-16 15:00'
  },
  {
    id: '5',
    name: 'GOURMET DELIGHT',
    avatar: 'GD',
    instagramHandle: '@gourmet_delight',
    contractStatus: 'active',
    industry: 'Food & Beverage',
    followers: 112300,
    engagement: 6.3,
    monthlyFee: 290000,
    startDate: '2024-07-20',
    contactPerson: '伊藤 麻衣',
    email: 'ito@gourmetdelight.jp',
    phone: '03-5678-9012',
    location: '東京都中央区',
    lastActivity: '30分前',
    nextMeeting: '2025-12-17 11:00'
  },
  {
    id: '6',
    name: 'FITNESS PRO',
    avatar: 'FP',
    instagramHandle: '@fitness_pro',
    contractStatus: 'paused',
    industry: 'Fitness & Sports',
    followers: 78900,
    engagement: 4.5,
    monthlyFee: 260000,
    startDate: '2024-06-01',
    contactPerson: '高橋 大輔',
    email: 'takahashi@fitnesspro.jp',
    phone: '03-6789-0123',
    location: '東京都新宿区',
    lastActivity: '2週間前'
  },
  {
    id: '7',
    name: 'ECO LIVING',
    avatar: 'EL',
    instagramHandle: '@eco_living',
    contractStatus: 'active',
    industry: 'Lifestyle & Sustainability',
    followers: 56700,
    engagement: 5.8,
    monthlyFee: 240000,
    startDate: '2024-11-01',
    contactPerson: '中村 さくら',
    email: 'nakamura@ecoliving.jp',
    phone: '03-7890-1234',
    location: '東京都目黒区',
    lastActivity: '1時間前',
    nextMeeting: '2025-12-19 13:00'
  },
  {
    id: '8',
    name: 'PET PARADISE',
    avatar: 'PP',
    instagramHandle: '@pet_paradise',
    contractStatus: 'active',
    industry: 'Pet Care & Products',
    followers: 94100,
    engagement: 7.2,
    monthlyFee: 270000,
    startDate: '2024-09-01',
    contactPerson: '小林 一郎',
    email: 'kobayashi@petparadise.jp',
    phone: '03-8901-2345',
    location: '東京都品川区',
    lastActivity: '45分前'
  }
];

export function Clients({ onClientSelect }: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'followers' | 'engagement' | 'startDate'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>(mockClients);
  const [newClient, setNewClient] = useState({
    name: '',
    instagramHandle: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    contractStatus: 'pending' as 'active' | 'pending' | 'paused',
    monthlyFee: 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
      case 'paused':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'paused':
        return <Pause className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '契約中';
      case 'pending':
        return '保留中';
      case 'paused':
        return '一時停止';
      default:
        return '不明';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return '¥' + amount.toLocaleString();
  };

  const handleAddClient = (newClientData: NewClientData) => {
    if (!newClientData.name || !newClientData.contactPerson || !newClientData.email) {
      return; // Validation
    }

    // Generate avatar from first 2 letters
    const avatar = newClientData.name.substring(0, 2).toUpperCase();

    const newId = (clientsList.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];

    setClientsList([
      ...clientsList,
      {
        id: newId,
        name: newClientData.name,
        avatar: avatar,
        instagramHandle: newClientData.instagramHandle || '@' + newClientData.name.toLowerCase().replace(/\s+/g, '_'),
        contractStatus: newClientData.contractStatus,
        industry: newClientData.industry,
        followers: 0,
        engagement: 0,
        monthlyFee: newClientData.monthlyFee,
        startDate: today,
        contactPerson: newClientData.contactPerson,
        email: newClientData.email,
        phone: newClientData.phone,
        location: newClientData.location,
        lastActivity: 'たった今',
      },
    ]);

    // Reset form
    setNewClient({
      name: '',
      instagramHandle: '',
      industry: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      contractStatus: 'pending',
      monthlyFee: 0,
    });

    setShowAddModal(false);
  };

  // Filter and sort clients
  const filteredClients = clientsList
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.instagramHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.contractStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'followers':
          return b.followers - a.followers;
        case 'engagement':
          return b.engagement - a.engagement;
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });

  const stats = {
    total: clientsList.length,
    active: clientsList.filter(c => c.contractStatus === 'active').length,
    pending: clientsList.filter(c => c.contractStatus === 'pending').length,
    paused: clientsList.filter(c => c.contractStatus === 'paused').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-1">クライアント一覧</h1>
          <p className="text-muted-foreground text-sm">
            全{stats.total}件のクライアント
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          新規クライアント
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'all' 
              ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setStatusFilter('all')}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className={`w-5 h-5 ${statusFilter === 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">全体</span>
          </div>
          <div className={`text-2xl ${statusFilter === 'all' ? 'text-primary' : 'text-foreground'}`}>
            {stats.total}
          </div>
          <div className="text-xs text-muted-foreground mt-1">総クライアント数</div>
        </div>

        <div 
          className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'active' 
              ? 'border-green-600 dark:border-green-400 ring-2 ring-green-600/20 dark:ring-green-400/20 shadow-lg' 
              : 'border-border hover:border-green-600/50 dark:hover:border-green-400/50'
          }`}
          onClick={() => setStatusFilter('active')}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-xs text-muted-foreground">契約中</span>
          </div>
          <div className={`text-2xl ${statusFilter === 'active' ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
            {stats.active}
          </div>
          <div className="text-xs text-muted-foreground mt-1">アクティブ</div>
        </div>

        <div 
          className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'pending' 
              ? 'border-yellow-600 dark:border-yellow-400 ring-2 ring-yellow-600/20 dark:ring-yellow-400/20 shadow-lg' 
              : 'border-border hover:border-yellow-600/50 dark:hover:border-yellow-400/50'
          }`}
          onClick={() => setStatusFilter('pending')}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs text-muted-foreground">保留中</span>
          </div>
          <div className={`text-2xl ${statusFilter === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'}`}>
            {stats.pending}
          </div>
          <div className="text-xs text-muted-foreground mt-1">ペンディング</div>
        </div>

        <div 
          className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'paused' 
              ? 'border-gray-600 dark:border-gray-400 ring-2 ring-gray-600/20 dark:ring-gray-400/20 shadow-lg' 
              : 'border-border hover:border-gray-600/50 dark:hover:border-gray-400/50'
          }`}
          onClick={() => setStatusFilter('paused')}
        >
          <div className="flex items-center justify-between mb-2">
            <Pause className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-muted-foreground">一時停止</span>
          </div>
          <div className={`text-2xl ${statusFilter === 'paused' ? 'text-gray-600 dark:text-gray-400' : 'text-foreground'}`}>
            {stats.paused}
          </div>
          <div className="text-xs text-muted-foreground mt-1">ポーズ</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="クライアント名、Instagram、業種で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-accent border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-accent border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">全てのステータス</option>
              <option value="active">契約中</option>
              <option value="pending">保留中</option>
              <option value="paused">一時停止</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">並び替え:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-accent border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="name">名前</option>
              <option value="followers">フォロワー数</option>
              <option value="engagement">エンゲージメント率</option>
              <option value="startDate">契約開始日</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onClientSelect && onClientSelect(client.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shrink-0">
                  {client.avatar}
                </div>
                <div>
                  <h3 className="text-foreground group-hover:text-primary transition-colors">
                    {client.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{client.instagramHandle}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getStatusColor(client.contractStatus)}`}>
                  {getStatusIcon(client.contractStatus)}
                  <span className="text-xs">{getStatusLabel(client.contractStatus)}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-accent rounded-lg">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">業種</div>
                <div className="text-sm text-foreground">{client.industry}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">契約金額</div>
                <div className="text-sm text-foreground">{formatCurrency(client.monthlyFee)}/月</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">フォロワー</div>
                <div className="text-sm text-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  {formatNumber(client.followers)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">エンゲージメント</div>
                <div className="text-sm text-foreground flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  {client.engagement}%
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{client.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{client.location}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                最終活動: {client.lastActivity}
              </div>
              <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 group/btn">
                詳細を見る
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Next Meeting Badge */}
            {client.nextMeeting && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">次回ミーティング:</span>
                  <span className="text-foreground">{client.nextMeeting}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">クライアントが見つかりません</h3>
          <p className="text-sm text-muted-foreground">
            検索条件を変更するか、新しいクライアントを追加してください
          </p>
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
}