import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, ChevronRight, Filter, Search } from 'lucide-react';

interface PipelineItem {
  id: string;
  name: string;
  client: string;
  stage: 'planning' | 'script' | 'material' | 'editing' | 'first-draft' | 'revision';
  daysInStage: number;
  totalDays: number;
  assignee: string;
  initials: string;
  priority: 'high' | 'medium' | 'low';
}

interface StageStats {
  name: string;
  count: number;
  avgDays: number;
  trend: 'up' | 'down' | 'stable';
}

export function DirectionPipeline() {
  const [selectedStage, setSelectedStage] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const stages: StageStats[] = [
    { name: '企画', count: 8, avgDays: 2.5, trend: 'stable' },
    { name: '台本', count: 6, avgDays: 3.2, trend: 'down' },
    { name: '素材', count: 10, avgDays: 4.8, trend: 'up' },
    { name: '編集', count: 12, avgDays: 5.2, trend: 'up' },
    { name: '初稿', count: 5, avgDays: 1.5, trend: 'stable' },
    { name: '修正', count: 7, avgDays: 2.1, trend: 'down' },
  ];

  const items: PipelineItem[] = [
    {
      id: '1',
      name: 'Instagram Reels - 新商品紹介',
      client: 'AXAS株式会社',
      stage: 'editing',
      daysInStage: 6,
      totalDays: 12,
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'high',
    },
    {
      id: '2',
      name: 'YouTube動画 - ブランドストーリー',
      client: 'BAYMAX株式会社',
      stage: 'material',
      daysInStage: 5,
      totalDays: 8,
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'high',
    },
    {
      id: '3',
      name: 'TikTok - チャレンジ動画',
      client: 'デジタルフロンティア',
      stage: 'script',
      daysInStage: 3,
      totalDays: 5,
      assignee: '鈴木一郎',
      initials: 'SI',
      priority: 'medium',
    },
    {
      id: '4',
      name: 'Instagram Stories - キャンペーン',
      client: 'AXAS株式会社',
      stage: 'first-draft',
      daysInStage: 1,
      totalDays: 14,
      assignee: '高橋美咲',
      initials: 'TM',
      priority: 'low',
    },
    {
      id: '5',
      name: 'YouTube Short - 商品解説',
      client: 'BAYMAX株式会社',
      stage: 'revision',
      daysInStage: 2,
      totalDays: 16,
      assignee: '伊藤健太',
      initials: 'IK',
      priority: 'medium',
    },
    {
      id: '6',
      name: 'TikTok - 企業紹介',
      client: 'デジタルフロンティア',
      stage: 'planning',
      daysInStage: 2,
      totalDays: 2,
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'low',
    },
  ];

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      planning: '企画',
      script: '台本',
      material: '素材',
      editing: '編集',
      'first-draft': '初稿',
      revision: '修正',
    };
    return labels[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-purple-500/10 text-purple-600',
      script: 'bg-blue-500/10 text-blue-600',
      material: 'bg-cyan-500/10 text-cyan-600',
      editing: 'bg-amber-500/10 text-amber-600',
      'first-draft': 'bg-green-500/10 text-green-600',
      revision: 'bg-orange-500/10 text-orange-600',
    };
    return colors[stage] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-destructive" strokeWidth={2} />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-success" strokeWidth={2} />;
    }
    return null;
  };

  const filteredItems = items.filter(item => {
    const matchesStage = selectedStage === 'all' || item.stage === selectedStage;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStage && matchesSearch;
  });

  const totalItems = items.length;
  const maxStageCount = Math.max(...stages.map(s => s.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">パイプライン</h1>
          <p className="text-sm text-muted-foreground">制作工程の進捗と詰まりを可視化</p>
        </div>
      </div>

      {/* Stage Overview - Horizontal Flow */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-card-foreground">工程別の状況</h3>
          <div className="text-sm text-muted-foreground">{totalItems}件進行中</div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {stages.map((stage, index) => (
            <button
              key={index}
              onClick={() => setSelectedStage(selectedStage === stage.name ? 'all' : stage.name)}
              className={`p-4 rounded-xl border transition-all ${
                selectedStage === stage.name
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Stage Name */}
              <div className="text-sm text-card-foreground mb-2">{stage.name}</div>
              
              {/* Count */}
              <div className="text-2xl text-card-foreground mb-2">{stage.count}</div>
              
              {/* Avg Days + Trend */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{stage.avgDays}日</div>
                {getTrendIcon(stage.trend)}
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    stage.count > maxStageCount * 0.7 ? 'bg-destructive' : 
                    stage.count > maxStageCount * 0.4 ? 'bg-amber-500' : 
                    'bg-success'
                  }`}
                  style={{ width: `${(stage.count / maxStageCount) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="検索（コンテンツ名、クライアント）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Clear Filter */}
          {selectedStage !== 'all' && (
            <button
              onClick={() => setSelectedStage('all')}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              フィルタをクリア
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Items List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">コンテンツ名</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">クライアント</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">工程</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">滞留日数</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">総日数</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">担当</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground">優先度</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm text-card-foreground">{item.name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-muted-foreground">{item.client}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStageColor(item.stage)}`}>
                      {getStageLabel(item.stage)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${item.daysInStage > 4 ? 'text-destructive' : 'text-muted-foreground'}`} strokeWidth={2} />
                      <span className={`text-sm ${item.daysInStage > 4 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {item.daysInStage}日
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-muted-foreground">{item.totalDays}日</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                        {item.initials}
                      </div>
                      <div className="text-sm text-card-foreground">{item.assignee}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-muted-foreground text-sm">該当する案件がありません</div>
          </div>
        )}
      </div>
    </div>
  );
}
