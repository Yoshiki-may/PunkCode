import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Clock, ChevronDown, Filter, Search, Eye } from 'lucide-react';
import { 
  getAllApprovals, 
  updateClientApproval,
  notifyApprovalCompleted,
  notifyApprovalRejected
} from '../../utils/clientData';

interface ApprovalItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'copy';
  client: string;
  clientId: string;
  project: string;
  deadline: string;
  relativeTime: string;
  rejectedCount: number;
  status: 'pending' | 'urgent' | 'overdue';
  assignee: string;
  initials: string;
  submittedBy: string;
  submitterInitials: string;
  submittedDate: string;
  thumbnailUrl?: string;
  platform?: string;
}

export function DirectionApprovals() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'urgent' | 'overdue'>('all');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'copy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // LocalStorageから承認待ちを読み込み
  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = () => {
    const allApprovals = getAllApprovals();
    
    // ClientApprovalをApprovalItem形式に変換
    const formattedApprovals: ApprovalItem[] = allApprovals.map(approval => {
      // 期限から相対時間を計算
      const relativeTime = getRelativeTime(approval.deadline || approval.submittedDate);
      
      // ステータスを判定（期限と相対時間から）
      const status = getStatusFromDeadline(approval.deadline || approval.submittedDate);
      
      // タイプを判定（プラットフォームから推測）
      const type = getTypeFromTitle(approval.title);
      
      // 差し戻し回数（TODO: 承認履歴から計算）
      const rejectedCount = 0;
      
      return {
        id: approval.id,
        name: approval.title,
        type,
        client: approval.clientName,
        clientId: approval.clientId,
        project: 'SNS運用プロジェクト', // TODO: プロジェクト名を取得
        deadline: approval.deadline || approval.submittedDate,
        relativeTime,
        rejectedCount,
        status,
        assignee: approval.submittedBy,
        initials: getInitials(approval.submittedBy),
        submittedBy: approval.submittedBy,
        submitterInitials: getInitials(approval.submittedBy),
        submittedDate: approval.submittedDate,
        platform: approval.platform
      };
    });
    
    // 期限が近い順にソート
    formattedApprovals.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    });
    
    setApprovals(formattedApprovals);
  };

  // 期限から相対時間を計算
  const getRelativeTime = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 0) return '期限超過';
    if (hours < 24) return `あと${hours}時間`;
    if (days === 1) return '明日';
    if (days <= 7) return `あと${days}日`;
    return `${days}日後`;
  };

  // 期限からステータスを判定
  const getStatusFromDeadline = (deadline: string): 'pending' | 'urgent' | 'overdue' => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return 'overdue';
    if (hours < 24) return 'urgent';
    return 'pending';
  };

  // タイトルからタイプを判定
  const getTypeFromTitle = (title: string): 'video' | 'image' | 'copy' => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('動画') || lowerTitle.includes('video') || lowerTitle.includes('reels') || lowerTitle.includes('tiktok') || lowerTitle.includes('youtube')) {
      return 'video';
    }
    if (lowerTitle.includes('画像') || lowerTitle.includes('image') || lowerTitle.includes('写真') || lowerTitle.includes('photo')) {
      return 'image';
    }
    return 'copy';
  };

  // 名前からイニシャルを生成
  const getInitials = (name: string): string => {
    if (!name) return '??'; // undefined/null/空文字対策
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

  // 承認処理
  const handleApprove = (item: ApprovalItem) => {
    updateClientApproval(item.clientId, item.id, { status: 'approved' });
    // 承認完了通知を生成
    notifyApprovalCompleted(item.client, item.name, item.submittedBy, item.clientId, item.id);
    loadApprovals(); // リロード
  };

  // 差し戻し処理
  const handleReject = (item: ApprovalItem) => {
    updateClientApproval(item.clientId, item.id, { status: 'rejected' });
    // 差し戻し通知を生成
    notifyApprovalRejected(item.client, item.name, item.submittedBy, undefined, item.clientId, item.id);
    loadApprovals(); // リロード
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-destructive/10 text-destructive';
      case 'urgent':
        return 'bg-orange-500/10 text-orange-600';
      case 'pending':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overdue':
        return '期限超過';
      case 'urgent':
        return '緊急';
      case 'pending':
        return '承認待ち';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'image':
        return '🖼️';
      case 'copy':
        return '📝';
      default:
        return '📄';
    }
  };

  const filteredApprovals = approvals.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    urgent: approvals.filter(a => a.status === 'urgent').length,
    overdue: approvals.filter(a => a.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">承認センター</h1>
          <p className="text-sm text-muted-foreground">クライアント承認待ちコンテンツを管理</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">全体</div>
          <div className="text-2xl text-card-foreground">{stats.total}</div>
        </div>
        <div className="bg-card rounded-xl border border-blue-500/20 p-4">
          <div className="text-xs text-blue-600 mb-1">承認待ち</div>
          <div className="text-2xl text-blue-600">{stats.pending}</div>
        </div>
        <div className="bg-card rounded-xl border border-orange-500/20 p-4">
          <div className="text-xs text-orange-600 mb-1">緊急</div>
          <div className="text-2xl text-orange-600">{stats.urgent}</div>
        </div>
        <div className="bg-card rounded-xl border border-destructive/20 p-4">
          <div className="text-xs text-destructive mb-1">期限超過</div>
          <div className="text-2xl text-destructive">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="検索（コンテンツ名、クライアント、プロジェクト）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-card-foreground hover:bg-accent'
            }`}
          >
            <Filter className="w-4 h-4" strokeWidth={2} />
            <span>フィルタ</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">ステータス</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'urgent', 'overdue'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border text-muted-foreground hover:text-card-foreground'
                    }`}
                  >
                    {status === 'all' ? 'すべて' : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">種類</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'video', 'image', 'copy'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      filterType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border text-muted-foreground hover:text-card-foreground'
                    }`}
                  >
                    {type === 'all' ? 'すべて' : type === 'video' ? '動画' : type === 'image' ? '画像' : 'コピー'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approval List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">種類</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">コンテンツ名</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">クライアント</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">プロジェクト</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">提出者</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">期限</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">ステータス</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-card-foreground">{item.name}</div>
                    {item.rejectedCount > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                        <RotateCcw className="w-3 h-3" strokeWidth={2} />
                        <span>{item.rejectedCount}回差戻し</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-card-foreground">{item.client}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-muted-foreground">{item.project}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                        {item.submitterInitials}
                      </div>
                      <div className="text-sm text-card-foreground">{item.submittedBy}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${item.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`} strokeWidth={2} />
                      <span className={`text-sm ${item.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {item.relativeTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="プレビュー">
                        <Eye className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                      </button>
                      <button className="p-1.5 hover:bg-success/10 rounded-lg transition-colors" title="承認" onClick={() => handleApprove(item)}>
                        <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={2} />
                      </button>
                      <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" title="差戻し" onClick={() => handleReject(item)}>
                        <XCircle className="w-4 h-4 text-destructive" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-muted-foreground text-sm">該当する承認待ちコンテンツがありません</div>
          </div>
        )}
      </div>
    </div>
  );
}