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
import { getAllClients, ClientData } from '../utils/clientData';
import { addClient as addDBClient, getCurrentUser } from '../utils/mockDatabase';

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

// 共通データからClientsコンポーネント用のデータ形式に変換
const convertToClientFormat = (clientData: ClientData): Client => {
  // contractStatus を適切にマッピング
  let contractStatus: 'active' | 'pending' | 'paused' = 'active';
  if (clientData.contractStatus === 'negotiating') {
    contractStatus = 'pending';
  } else if (clientData.contractStatus === 'active' || clientData.contractStatus === 'contracted') {
    contractStatus = 'active';
  }
  
  return {
    id: clientData.id,
    name: clientData.name,
    avatar: clientData.initials,
    instagramHandle: '@' + clientData.name.toLowerCase().replace(/\s+/g, '_').replace(/株式会社|会社/g, ''),
    contractStatus: contractStatus,
    industry: clientData.industry,
    followers: clientData.followers,
    engagement: clientData.engagement,
    monthlyFee: 280000, // デフォルト値
    startDate: clientData.contractStart.replace(/\./g, '-'),
    contactPerson: clientData.contactPerson,
    email: clientData.contactEmail,
    phone: clientData.contactPhone,
    location: clientData.address || '東京都',
    lastActivity: '2時間前',
  };
};

export function Clients({ onClientSelect }: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'followers' | 'engagement' | 'startDate'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 共通データから取得して変換
  const commonClients = getAllClients().map(convertToClientFormat);
  const [clientsList, setClientsList] = useState<Client[]>(commonClients);
  
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

    // 現在のユーザーを取得
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('ユーザーが見つかりません');
      return;
    }

    // LocalStorageに保存
    const newDBClient = addDBClient({
      name: newClientData.contactPerson,
      company: newClientData.name,
      status: newClientData.contractStatus === 'active' ? 'active' : newClientData.contractStatus === 'pending' ? 'pending' : 'inactive',
      assignedTo: currentUser.id,
      createdBy: currentUser.id,
      industry: newClientData.industry,
      budget: newClientData.monthlyFee,
      notes: `電話: ${newClientData.phone}\n住所: ${newClientData.location}`,
    });

    // ローカルステートに追加（UIの即時更新のため）
    const avatar = newClientData.name.substring(0, 2).toUpperCase();
    const today = new Date().toISOString().split('T')[0];

    setClientsList([
      ...clientsList,
      {
        id: newDBClient.id,
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

    setShowAddModal(false);

    // クライアント詳細画面に遷移
    if (onClientSelect) {
      onClientSelect(newDBClient.id);
    }
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