import { Instagram, TrendingUp, Users, Heart, MessageCircle, Eye, ArrowUp, ArrowDown } from 'lucide-react';

interface InstagramMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

interface InstagramRealtimeDataProps {
  accountName: string;
  lastUpdated?: string;
  metrics?: InstagramMetric[];
}

export function InstagramRealtimeData({ 
  accountName,
  lastUpdated = '2分前',
  metrics = [
    {
      label: 'フォロワー数',
      value: '24.8K',
      change: 12.5,
      changeLabel: '今週'
    },
    {
      label: 'エンゲージメント率',
      value: '5.8%',
      change: 0.8,
      changeLabel: '先週比'
    },
    {
      label: '平均いいね数',
      value: '1,247',
      change: 18.3,
      changeLabel: '先週比'
    },
    {
      label: 'リーチ',
      value: '18.2K',
      change: -3.2,
      changeLabel: '先週比'
    },
    {
      label: 'コメント数',
      value: '183',
      change: 24.1,
      changeLabel: '先週比'
    },
    {
      label: 'インプレッション',
      value: '45.6K',
      change: 15.7,
      changeLabel: '先週比'
    }
  ]
}: InstagramRealtimeDataProps) {
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-1">
                Instagram リアルタイムデータ
              </h3>
              <p className="text-xs text-muted-foreground">
                @{accountName} | 最終更新: {lastUpdated}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-500 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const isPositive = metric.change >= 0;
            
            return (
              <div 
                key={index}
                className="group bg-muted/30 hover:bg-muted/50 border border-border rounded-lg p-4 transition-all duration-200"
              >
                {/* Label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {metric.label}
                  </span>
                  {index === 0 && <Users className="w-4 h-4 text-muted-foreground/50" />}
                  {index === 1 && <TrendingUp className="w-4 h-4 text-muted-foreground/50" />}
                  {index === 2 && <Heart className="w-4 h-4 text-muted-foreground/50" />}
                  {index === 3 && <Eye className="w-4 h-4 text-muted-foreground/50" />}
                  {index === 4 && <MessageCircle className="w-4 h-4 text-muted-foreground/50" />}
                  {index === 5 && <Eye className="w-4 h-4 text-muted-foreground/50" />}
                </div>

                {/* Value */}
                <div className="text-2xl font-semibold text-card-foreground mb-2">
                  {metric.value}
                </div>

                {/* Change */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    isPositive 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {metric.changeLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            直近の投稿パフォーマンス
          </h4>
          
          <div className="space-y-3">
            {[
              { title: 'Instagram Reels #25', time: '2時間前', likes: '1.2K', comments: 45, type: 'video' },
              { title: 'プロダクト撮影 #12', time: '8時間前', likes: '856', comments: 28, type: 'image' },
              { title: 'ライフスタイル投稿', time: '1日前', likes: '1.5K', comments: 67, type: 'carousel' }
            ].map((post, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  post.type === 'video' 
                    ? 'bg-gradient-to-br from-pink-500 to-red-500' 
                    : post.type === 'carousel'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-orange-500 to-pink-500'
                }`}>
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-card-foreground">
                    {post.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.time}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-card-foreground font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-card-foreground font-medium">{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
