import { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Instagram, 
  Heart, 
  MessageCircle,
  Share2,
  Eye,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  avatar: string;
  instagramHandle: string;
  contractStatus: 'active' | 'pending' | 'paused';
}

const mockClients: Client[] = [
  { id: '1', name: 'LUNETTA BEAUTY', avatar: 'LB', instagramHandle: '@lunetta_beauty', contractStatus: 'active' },
  { id: '2', name: 'URBAN THREADS', avatar: 'UT', instagramHandle: '@urban_threads', contractStatus: 'active' },
  { id: '3', name: 'GREEN WELLNESS', avatar: 'GW', instagramHandle: '@green_wellness', contractStatus: 'active' },
  { id: '4', name: 'TECH INNOVATIONS', avatar: 'TI', instagramHandle: '@tech_innovations', contractStatus: 'pending' },
];

interface InstagramMetrics {
  followers: number;
  followersChange: number;
  engagement: number;
  engagementChange: number;
  reach: number;
  reachChange: number;
  impressions: number;
  impressionsChange: number;
}

interface RecentPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  date: string;
}

export function Reports() {
  const [selectedClient, setSelectedClient] = useState<Client>(mockClients[0]);

  // Mock Instagram data
  const instagramMetrics: InstagramMetrics = {
    followers: 125800,
    followersChange: 8.5,
    engagement: 4.2,
    engagementChange: -0.3,
    reach: 45600,
    reachChange: 12.4,
    impressions: 89200,
    impressionsChange: 5.8
  };

  const recentPosts: RecentPost[] = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', likes: 3420, comments: 187, shares: 45, engagement: 5.2, date: '2025-12-14' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop', likes: 2890, comments: 156, shares: 38, engagement: 4.8, date: '2025-12-13' },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop', likes: 4120, comments: 223, shares: 67, engagement: 6.1, date: '2025-12-12' },
    { id: '4', imageUrl: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=400&fit=crop', likes: 3680, comments: 198, shares: 52, engagement: 5.5, date: '2025-12-11' },
  ];

  // PALSS Hearing Report data
  const hearingReport = {
    completed: true,
    date: '2025-11-28',
    targetAudience: '25-35歳の女性、美容・ライフスタイルに関心が高い',
    brandVoice: 'フレンドリーで親しみやすく、専門性も感じさせる',
    contentPillars: ['スキンケアルーティン', 'プロダクトレビュー', 'メイクチュートリアル', 'ライフスタイル'],
    goals: ['フォロワー数を20%増加', 'エンゲージメント率5%以上を維持', 'ブランド認知度向上'],
    kpis: [
      { label: 'フォロワー増加率', target: '20%', current: '8.5%', status: 'on-track' },
      { label: 'エンゲージメント率', target: '5.0%', current: '4.2%', status: 'needs-attention' },
      { label: '月間リーチ', target: '50K', current: '45.6K', status: 'on-track' },
    ]
  };

  // Workflow Progress data
  const workflowSteps = [
    { id: 1, name: 'ヒアリング完了', status: 'completed', date: '2025-11-28' },
    { id: 2, name: 'コンテンツ戦略策定', status: 'completed', date: '2025-12-02' },
    { id: 3, name: 'クリエイティブ制作', status: 'in-progress', date: '進行中' },
    { id: 4, name: '投稿スケジュール確定', status: 'pending', date: '予定: 2025-12-18' },
    { id: 5, name: '定期レポート提出', status: 'pending', date: '予定: 2025-12-20' },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-chart-2 bg-chart-2/10';
      case 'in-progress':
        return 'text-chart-1 bg-chart-1/10';
      case 'pending':
        return 'text-muted-foreground bg-secondary';
      default:
        return 'text-muted-foreground bg-secondary';
    }
  };

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-chart-2';
      case 'needs-attention':
        return 'text-chart-4';
      case 'at-risk':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-1">Reports</h1>
          <p className="text-muted-foreground text-sm">
            クライアントごとの詳細レポートと進捗状況
          </p>
        </div>
      </div>

      {/* Client Selector */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">クライアント選択</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockClients.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedClient.id === client.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shrink-0`}>
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{client.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{client.instagramHandle}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PALSS Hearing Report Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground">PALSSヒアリング結果レポート</h2>
              <p className="text-xs text-muted-foreground">完了日: {hearingReport.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-chart-2/10">
            <CheckCircle2 className="w-4 h-4 text-chart-2" />
            <span className="text-xs text-chart-2">完了</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Target Audience */}
          <div>
            <h3 className="text-sm text-foreground mb-2">ターゲットオーディエンス</h3>
            <p className="text-sm text-muted-foreground">{hearingReport.targetAudience}</p>
          </div>

          {/* Brand Voice */}
          <div>
            <h3 className="text-sm text-foreground mb-2">ブランドボイス</h3>
            <p className="text-sm text-muted-foreground">{hearingReport.brandVoice}</p>
          </div>

          {/* Content Pillars */}
          <div>
            <h3 className="text-sm text-foreground mb-3">コンテンツの柱</h3>
            <div className="flex flex-wrap gap-2">
              {hearingReport.contentPillars.map((pillar, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <h3 className="text-sm text-foreground mb-3">目標</h3>
            <ul className="space-y-2">
              {hearingReport.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* KPIs */}
          <div>
            <h3 className="text-sm text-foreground mb-3">主要KPI進捗</h3>
            <div className="space-y-3">
              {hearingReport.kpis.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex-1">
                    <div className="text-sm text-foreground mb-1">{kpi.label}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>目標: {kpi.target}</span>
                      <span>|</span>
                      <span>現在: {kpi.current}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                    kpi.status === 'on-track' 
                      ? 'bg-green-50 dark:bg-green-950/30' 
                      : 'bg-yellow-50 dark:bg-yellow-950/30'
                  }`}>
                    {kpi.status === 'on-track' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                    )}
                    <span className={`text-xs ${getKPIStatusColor(kpi.status)}`}>
                      {kpi.status === 'on-track' ? '順調' : '要注意'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground">運用フロー進捗</h2>
            <p className="text-xs text-muted-foreground">プロジェクト全体の進行状況</p>
          </div>
        </div>

        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center pt-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-950/30' 
                    : step.status === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-950/30'
                    : 'bg-gray-100 dark:bg-gray-800/30'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : step.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                  )}
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-1 ${
                    step.status === 'completed' ? 'bg-green-200 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-800'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm text-foreground">{step.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? '完了' : step.status === 'in-progress' ? '進行中' : '未着手'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Real-time Data */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-foreground">Instagram リアルタイムデータ</h2>
              <p className="text-xs text-muted-foreground">{selectedClient.instagramHandle} • 過去30日間</p>
            </div>
          </div>
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            詳細を見る
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-accent/50">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-1 text-xs ${
                instagramMetrics.followersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {instagramMetrics.followersChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(instagramMetrics.followersChange)}%
              </div>
            </div>
            <div className="text-2xl text-foreground mb-1">{formatNumber(instagramMetrics.followers)}</div>
            <div className="text-xs text-muted-foreground">フォロワー</div>
          </div>

          <div className="p-4 rounded-xl bg-accent/50">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-1 text-xs ${
                instagramMetrics.engagementChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {instagramMetrics.engagementChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(instagramMetrics.engagementChange)}%
              </div>
            </div>
            <div className="text-2xl text-foreground mb-1">{instagramMetrics.engagement}%</div>
            <div className="text-xs text-muted-foreground">エンゲージメント率</div>
          </div>

          <div className="p-4 rounded-xl bg-accent/50">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-1 text-xs ${
                instagramMetrics.reachChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {instagramMetrics.reachChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(instagramMetrics.reachChange)}%
              </div>
            </div>
            <div className="text-2xl text-foreground mb-1">{formatNumber(instagramMetrics.reach)}</div>
            <div className="text-xs text-muted-foreground">リーチ</div>
          </div>

          <div className="p-4 rounded-xl bg-accent/50">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-1 text-xs ${
                instagramMetrics.impressionsChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {instagramMetrics.impressionsChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(instagramMetrics.impressionsChange)}%
              </div>
            </div>
            <div className="text-2xl text-foreground mb-1">{formatNumber(instagramMetrics.impressions)}</div>
            <div className="text-xs text-muted-foreground">インプレッション</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-sm text-foreground mb-3">最近の投稿パフォーマンス</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  <img 
                    src={post.imageUrl} 
                    alt="Post" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatNumber(post.likes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {post.shares}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className={`text-xs ${
                    post.engagement >= 5 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {post.engagement}% ER
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}