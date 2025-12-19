import { Calendar, CheckCircle, TrendingUp, Users } from 'lucide-react';

export function ClientDashboardView() {
  const stats = [
    { label: 'Total Posts This Month', value: '24', icon: Calendar, color: 'text-blue-500' },
    { label: 'Pending Approvals', value: '3', icon: CheckCircle, color: 'text-orange-500' },
    { label: 'Avg. Engagement Rate', value: '4.8%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Followers', value: '12.4K', icon: Users, color: 'text-purple-500' },
  ];

  const upcomingPosts = [
    { date: '2024-12-20', time: '10:00', platform: 'Instagram', content: '新商品のティザー投稿' },
    { date: '2024-12-20', time: '15:00', platform: 'Twitter', content: 'キャンペーン告知' },
    { date: '2024-12-21', time: '12:00', platform: 'Facebook', content: 'ブログ記事シェア' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Dashboard</h1>
        <p className="text-sm text-muted-foreground">SNS運用の全体概要</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} strokeWidth={2} />
              </div>
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Posts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">今週の投稿予定</h2>
        <div className="space-y-3">
          {upcomingPosts.map((post, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">
                {post.date}
                <br />
                <span className="text-xs">{post.time}</span>
              </div>
              <div className="flex-shrink-0 w-24">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {post.platform}
                </span>
              </div>
              <div className="flex-1 text-sm">{post.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">最新のアクティビティ</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-muted-foreground">2時間前</span>
            <span>Instagram投稿が公開されました</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-muted-foreground">5時間前</span>
            <span>新しいメッセージが届いています</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-muted-foreground">1日前</span>
            <span>承認待ちのコンテンツがあります</span>
          </div>
        </div>
      </div>
    </div>
  );
}
