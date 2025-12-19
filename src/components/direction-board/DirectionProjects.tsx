import { Calendar, Clock, Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface Deadline {
  id: string;
  name: string;
  client: string;
  date: string;
  relativeTime: string;
  type: 'delivery' | 'shooting' | 'posting';
  status: 'on-track' | 'at-risk' | 'overdue';
  assignee: string;
  initials: string;
  priority: 'high' | 'medium' | 'low';
}

export function DirectionProjects() {
  const [activeTab, setActiveTab] = useState<'all' | 'delivery' | 'shooting' | 'posting'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'client'>('date');

  const deadlines: Deadline[] = [
    {
      id: '1',
      name: 'Instagram Reels - 新商品紹介',
      client: 'AXAS株式会社',
      date: '12/14',
      relativeTime: '今日',
      type: 'delivery',
      status: 'at-risk',
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'high',
    },
    {
      id: '2',
      name: 'YouTube動画 - ブランドストーリー',
      client: 'BAYMAX株式会社',
      date: '12/15',
      relativeTime: '明日',
      type: 'delivery',
      status: 'on-track',
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'high',
    },
    {
      id: '3',
      name: 'TikTok - チャレンジ動画',
      client: 'デジタルフロンティア',
      date: '12/16',
      relativeTime: 'あと2日',
      type: 'delivery',
      status: 'on-track',
      assignee: '鈴木一郎',
      initials: 'SI',
      priority: 'medium',
    },
    {
      id: '4',
      name: '商品撮影 - AXAS新商品',
      client: 'AXAS株式会社',
      date: '12/17',
      relativeTime: 'あと3日',
      type: 'shooting',
      status: 'on-track',
      assignee: '高橋美咲',
      initials: 'TM',
      priority: 'high',
    },
    {
      id: '5',
      name: 'Instagram投稿 - キャンペーン告知',
      client: 'BAYMAX株式会社',
      date: '12/18',
      relativeTime: 'あと4日',
      type: 'posting',
      status: 'on-track',
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'medium',
    },
    {
      id: '6',
      name: 'YouTube Short - 商品レビュー',
      client: 'クリエイティブワークス',
      date: '12/19',
      relativeTime: 'あと5日',
      type: 'delivery',
      status: 'on-track',
      assignee: '山田次郎',
      initials: 'YJ',
      priority: 'low',
    },
    {
      id: '7',
      name: 'インフルエンサー撮影',
      client: 'マーケティングラボ',
      date: '12/20',
      relativeTime: 'あと6日',
      type: 'shooting',
      status: 'on-track',
      assignee: '高橋美咲',
      initials: 'TM',
      priority: 'medium',
    },
    {
      id: '8',
      name: 'TikTok投稿 - トレンド動画',
      client: 'AXAS株式会社',
      date: '12/21',
      relativeTime: 'あと7日',
      type: 'posting',
      status: 'on-track',
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'medium',
    },
  ];

  const filteredDeadlines = deadlines.filter(d => {
    if (activeTab !== 'all' && d.type !== activeTab) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !d.client.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'all':
        return 'すべて';
      case 'delivery':
        return '納期';
      case 'shooting':
        return '撮影';
      case 'posting':
        return '投稿';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'at-risk':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track':
        return '順調';
      case 'at-risk':
        return '注意';
      case 'overdue':
        return '遅延';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">プロジェクト管理</h1>
          <p className="text-sm text-muted-foreground">今週の締切と進行状況を一覧表示</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-card-foreground mb-1">{filteredDeadlines.length}</div>
          <div className="text-xs text-muted-foreground">進行中プロジェクト</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-green-600 mb-1">
            {filteredDeadlines.filter(d => d.status === 'on-track').length}
          </div>
          <div className="text-xs text-muted-foreground">順調</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-amber-600 mb-1">
            {filteredDeadlines.filter(d => d.status === 'at-risk').length}
          </div>
          <div className="text-xs text-muted-foreground">要注意</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-red-600 mb-1">
            {filteredDeadlines.filter(d => d.status === 'overdue').length}
          </div>
          <div className="text-xs text-muted-foreground">遅延</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 mb-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(['all', 'delivery', 'shooting', 'posting'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  activeTab === type
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                {getTabLabel(type)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="プロジェクトを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">期限順</option>
              <option value="priority">優先度順</option>
              <option value="client">クライアント順</option>
            </select>
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-2">
          {filteredDeadlines.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Project Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm text-card-foreground">{item.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  
                  {/* Details */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-card-foreground">{item.client}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" strokeWidth={2} />
                      <span>{item.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${item.status === 'at-risk' ? 'text-amber-600' : 'text-muted-foreground'}`} strokeWidth={2} />
                      <span className={item.status === 'at-risk' ? 'text-amber-600' : ''}>{item.relativeTime}</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{getTabLabel(item.type)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                        {item.initials}
                      </div>
                      <span>{item.assignee}</span>
                    </div>
                  </div>
                </div>

                {/* Priority Indicator */}
                <div className={`flex-shrink-0 text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority === 'high' && '高'}
                  {item.priority === 'medium' && '中'}
                  {item.priority === 'low' && '低'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDeadlines.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            該当するプロジェクトがありません
          </div>
        )}
      </div>
    </div>
  );
}
