import { TrendingUp, Users, Heart, MessageCircle, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ClientReportsView() {
  const engagementData = [
    { month: '7月', instagram: 3.2, twitter: 2.1, facebook: 1.8 },
    { month: '8月', instagram: 3.8, twitter: 2.5, facebook: 2.1 },
    { month: '9月', instagram: 4.2, twitter: 2.8, facebook: 2.3 },
    { month: '10月', instagram: 4.5, twitter: 3.1, facebook: 2.6 },
    { month: '11月', instagram: 4.8, twitter: 3.4, facebook: 2.8 },
    { month: '12月', instagram: 5.1, twitter: 3.6, facebook: 3.0 },
  ];

  const followerData = [
    { month: '7月', followers: 8200 },
    { month: '8月', followers: 9100 },
    { month: '9月', followers: 10200 },
    { month: '10月', followers: 11000 },
    { month: '11月', followers: 11800 },
    { month: '12月', followers: 12400 },
  ];

  const topPosts = [
    {
      platform: 'Instagram',
      content: 'クリスマス限定商品の紹介投稿',
      date: '2024-12-15',
      likes: 1247,
      comments: 89,
      shares: 45,
    },
    {
      platform: 'Twitter',
      content: 'お客様の声を紹介するスレッド',
      date: '2024-12-12',
      likes: 892,
      comments: 124,
      shares: 156,
    },
    {
      platform: 'Facebook',
      content: '年末キャンペーン告知',
      date: '2024-12-10',
      likes: 654,
      comments: 67,
      shares: 98,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Reports</h1>
          <p className="text-sm text-muted-foreground">SNSパフォーマンス分析レポート</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          <span>レポートをダウンロード</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-sm text-muted-foreground">総フォロワー数</div>
          </div>
          <div className="text-2xl mb-1">12,400</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+5.1% vs 先月</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div className="text-sm text-muted-foreground">平均いいね数</div>
          </div>
          <div className="text-2xl mb-1">842</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.3% vs 先月</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-sm text-muted-foreground">平均コメント数</div>
          </div>
          <div className="text-2xl mb-1">93</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8.7% vs 先月</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground">エンゲージメント率</div>
          </div>
          <div className="text-2xl mb-1">4.8%</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+0.3pt vs 先月</span>
          </div>
        </div>
      </div>

      {/* Engagement Rate Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-6">エンゲージメント率の推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2} name="Instagram" />
            <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} name="Twitter" />
            <Line type="monotone" dataKey="facebook" stroke="#4267B2" strokeWidth={2} name="Facebook" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Follower Growth Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-6">フォロワー数の推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={followerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="followers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">パフォーマンスの高い投稿</h2>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {post.platform}
                  </span>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <div className="text-sm mb-3">{post.content}</div>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{post.shares.toLocaleString()} シェア</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
