import { Calendar, Camera, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function CreatorDashboardView() {
  const stats = [
    { label: 'Active Projects', value: '5', icon: Camera, color: 'text-blue-500' },
    { label: 'Upcoming Shoots', value: '3', icon: Calendar, color: 'text-purple-500' },
    { label: 'Pending Upload', value: '2', icon: Clock, color: 'text-orange-500' },
    { label: 'Completed This Month', value: '12', icon: CheckCircle, color: 'text-green-500' },
  ];

  const todaySchedule = [
    { 
      time: '10:00-12:00', 
      client: 'クライアントA', 
      type: '商品撮影',
      location: '渋谷スタジオ',
      status: 'upcoming'
    },
    { 
      time: '15:00-17:00', 
      client: 'クライアントB', 
      type: 'ブランドムービー撮影',
      location: '六本木オフィス',
      status: 'upcoming'
    },
  ];

  const pendingProjects = [
    {
      client: 'クライアントC',
      project: 'Instagram リール撮影',
      deadline: '2024-12-20',
      status: '撮影待ち',
      priority: 'high'
    },
    {
      client: 'クライアントD',
      project: '商品写真撮影',
      deadline: '2024-12-21',
      status: 'アップロード待ち',
      priority: 'medium'
    },
    {
      client: 'クライアントE',
      project: 'プロモーション動画',
      deadline: '2024-12-23',
      status: '撮影中',
      priority: 'low'
    },
  ];

  const recentActivity = [
    { action: '素材をアップロードしました', project: 'クライアントA - 商品撮影', time: '2時間前' },
    { action: '撮影を完了しました', project: 'クライアントB - ブランドムービー', time: '5時間前' },
    { action: '新しい撮影依頼を受けました', project: 'クライアントC - Instagram', time: '1日前' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600';
      case 'medium': return 'bg-orange-500/10 text-orange-600';
      case 'low': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Dashboard</h1>
        <p className="text-sm text-muted-foreground">撮影業務の概要</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">今日の撮影予定</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{schedule.time}</span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                      {schedule.type}
                    </span>
                  </div>
                  <div className="text-sm mb-1">{schedule.client}</div>
                  <div className="text-xs text-muted-foreground">📍 {schedule.location}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                今日の予定はありません
              </div>
            )}
          </div>
        </div>

        {/* Pending Projects */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">進行中のプロジェクト</h2>
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {pendingProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{project.client}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' ? '高' : project.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <div className="text-sm mb-1">{project.project}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.status}</span>
                  <span>納期: {project.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">最近のアクティビティ</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm mb-1">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.project}</div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
