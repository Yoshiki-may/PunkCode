import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Edit,
  ChevronRight,
  Instagram,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useState } from 'react';
import { getClientById } from '../utils/clientData';

interface ClientDetailPageProps {
  clientId: string;
  onGenerateAIUrl?: () => void;
}

export function ClientDetailPage({ clientId, onGenerateAIUrl }: ClientDetailPageProps) {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // 共通データから取得
  const clientData = getClientById(clientId);
  
  // クライアントが見つからない場合
  if (!clientData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl text-foreground mb-2">クライアントが見つかりません</h2>
          <p className="text-sm text-muted-foreground">指定されたクライアントIDが存在しません</p>
        </div>
      </div>
    );
  }

  // クライアントデータをページ用の形式に変換
  const client = {
    id: clientData.id,
    companyName: clientData.name,
    status: clientData.contractStatus === 'negotiating' ? 'negotiating' as const : 'contracted' as const,
    priority: clientData.isPinned ? 'high' as const : 'medium' as const,
    assignee: clientData.contactPerson,
    contactPerson: clientData.contactPerson,
    email: clientData.contactEmail,
    phone: clientData.contactPhone,
    contractDate: clientData.contractStart,
    lastUpdate: '2時間前',
    progress: 65,
    contractYears: '1年目',
    industry: clientData.industry,
    address: clientData.address,
    description: clientData.description,
  };

  const handleGenerateAIUrl = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/hearing?clientId=${clientId}`;
    setGeneratedUrl(url);
    
    if (onGenerateAIUrl) {
      onGenerateAIUrl();
    }
  };

  const handleCopyUrl = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // 今後のアクティビティ
  const upcomingActivities = [
    { id: 1, title: '運用開始ガイド', date: '2025/12/16 月', status: '資料準備' },
    { id: 2, title: 'キックオフミーティングの準備', date: '2025/12/18 水', status: '資料準備' },
    { id: 3, title: '初期ヘルスチェック', date: '2025/12/20 金', status: '' },
    { id: 4, title: 'SNSアカウントのデータ統合', date: '2025/12/22 日', status: '' },
  ];

  // PALSSヒアリング結果レポート
  const hearingReportSections = [
    { 
      id: '1', 
      title: '会社概要', 
      status: 'completed',
      content: clientData.description || `${clientData.industry}業界で活躍する企業です。`
    },
    { 
      id: '2', 
      title: 'ブランド/提供価値', 
      status: 'completed',
      content: `${clientData.industry}における革新的なソリューションを提供しています。`
    },
    { 
      id: '3', 
      title: '事業課題', 
      status: 'completed',
      content: 'SNSでの認知度向上とエンゲージメント強化が課題です。'
    },
    { 
      id: '4', 
      title: '主要目標/成功の定義', 
      status: 'completed',
      content: `フォロワー数${clientData.kpi.followers.target.toLocaleString()}人達成、エンゲージメント率${clientData.kpi.engagement.target}%以上を目指します。`
    },
    { 
      id: '5', 
      title: 'ターゲット層', 
      status: 'completed',
      content: `${clientData.industry}に関心のある20-40代をメインターゲットとしています。`
    },
    { 
      id: '6', 
      title: 'コンテンツの方向性', 
      status: 'completed',
      content: `${clientData.platforms.join('、')}を活用し、月${clientData.monthlyPosts}投稿を展開します。`
    },
    { 
      id: '7', 
      title: '現在のアカウント', 
      status: 'completed',
      content: `現在フォロワー数${clientData.followers.toLocaleString()}人`
    },
    { 
      id: '8', 
      title: '競合の認識', 
      status: 'completed',
      content: '主要競合を分析済み。差別化ポイントを明確化しました。'
    },
    { 
      id: '9', 
      title: '好みのトーン/スタイル', 
      status: 'completed',
      content: 'プロフェッショナルでありながら親しみやすい印象を重視。'
    },
    { 
      id: '10', 
      title: '使用したくないテーマ', 
      status: 'completed',
      content: '過度なセールス色を避け、価値提供を重視します。'
    },
    { 
      id: '11', 
      title: '法規制/タブー', 
      status: 'completed',
      content: '関連法規制に準拠したコンテンツ制作を徹底します。'
    },
  ];

  // Instagram リアルタイムデータ（実際のクライアントデータを使用）
  const instagramMetrics = {
    followers: { 
      value: clientData.followers, 
      change: clientData.followerChange, 
      trend: clientData.followerChange >= 0 ? 'up' as const : 'down' as const
    },
    engagement: { 
      value: clientData.engagement, 
      change: clientData.engagementChange, 
      trend: clientData.engagementChange >= 0 ? 'up' as const : 'down' as const, 
      isPercentage: true 
    },
    posts: { 
      value: clientData.monthlyPosts, 
      change: 0, 
      trend: 'neutral' as const 
    },
    reach: { 
      value: clientData.kpi.reach.current, 
      change: clientData.kpi.reach.change, 
      trend: clientData.kpi.reach.change >= 0 ? 'up' as const : 'down' as const
    },
  };

  const recentPosts = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop' },
    { id: '4', imageUrl: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=400&fit=crop' },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
            <Building2 className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-foreground text-2xl">{client.companyName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">担当者: {client.assignee}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">最終更新: {client.lastUpdate}</span>
            </div>
          </div>
        </div>

        {/* PALSS AI URL発行ボタン */}
        <div className="space-y-3">
          <button
            onClick={handleGenerateAIUrl}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="font-medium">PALSS AI ヒアリングURL発行</span>
            <ExternalLink className="w-4 h-4 opacity-70" strokeWidth={2} />
          </button>

          {/* Generated URL Display */}
          {generatedUrl && (
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">生成されたヒアリングURL</p>
                  <p className="text-sm text-foreground font-mono truncate">{generatedUrl}</p>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isCopied
                      ? 'bg-chart-2/10 text-chart-2'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm font-medium">コピー完了</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm font-medium">コピー</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 基本情報 & 進捗状況 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 基本情報 */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-card-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" strokeWidth={2} />
              <span>基本情報</span>
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">担当者</span>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  <span className="text-sm text-card-foreground">{client.assignee}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">メール</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  <span className="text-sm text-primary">{client.email}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">電話番号</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  <span className="text-sm text-card-foreground">{client.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground">契約日</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  <span className="text-sm text-card-foreground">{client.contractDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 進捗状況 */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={2} />
              <span>進捗状況</span>
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">オンボーディング進捗</span>
                  <span className="text-sm text-foreground font-medium">{client.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">契約年数</span>
                <span className="text-sm text-card-foreground font-medium">{client.contractYears}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 今後のアクティビティ */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-card-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" strokeWidth={2} />
            <span>今後のアクティビティ</span>
          </h2>
          <div className="space-y-2">
            {upcomingActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-foreground">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">{activity.date}</div>
                  </div>
                </div>
                {activity.status && (
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PALSSヒアリングの結果レポート */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-card-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
              <span>PALSSヒアリングの結果レポート</span>
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-chart-2/10">
              <CheckCircle2 className="w-4 h-4 text-chart-2" strokeWidth={2} />
              <span className="text-xs text-chart-2">完了</span>
            </div>
          </div>

          <div className="space-y-2">
            {hearingReportSections.map((section) => (
              <div
                key={section.id}
                className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <div className="text-sm text-foreground mb-1">{section.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{section.content}</div>
                </div>
                <button className="ml-4 p-2 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram リアルタイムデータ */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-card-foreground flex items-center gap-2">
              <Instagram className="w-4 h-4 text-primary" strokeWidth={2} />
              <span>Instagram リアルタイムデータ</span>
            </h2>
            <span className="text-xs text-muted-foreground">過去30日間</span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">フォロワー</span>
                {instagramMetrics.followers.change !== 0 && (
                  <div className={`flex items-center gap-1 ${instagramMetrics.followers.trend === 'up' ? 'text-chart-2' : 'text-destructive'}`}>
                    {instagramMetrics.followers.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" strokeWidth={2} />
                    )}
                    <span className="text-xs">{Math.abs(instagramMetrics.followers.change)}%</span>
                  </div>
                )}
              </div>
              <div className="text-xl text-foreground font-semibold">
                {formatNumber(instagramMetrics.followers.value)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">エンゲージメント率</span>
                {instagramMetrics.engagement.change !== 0 && (
                  <div className={`flex items-center gap-1 ${instagramMetrics.engagement.trend === 'up' ? 'text-chart-2' : 'text-destructive'}`}>
                    {instagramMetrics.engagement.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" strokeWidth={2} />
                    )}
                    <span className="text-xs">{Math.abs(instagramMetrics.engagement.change)}%</span>
                  </div>
                )}
              </div>
              <div className="text-xl text-foreground font-semibold">
                {instagramMetrics.engagement.value}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">投稿数</span>
              </div>
              <div className="text-xl text-foreground font-semibold">
                {formatNumber(instagramMetrics.posts.value)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">リーチ</span>
              </div>
              <div className="text-xl text-foreground font-semibold">
                {formatNumber(instagramMetrics.reach.value)}
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-sm text-foreground mb-3">最近の投稿</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                    <img 
                      src={post.imageUrl} 
                      alt="Instagram post"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}