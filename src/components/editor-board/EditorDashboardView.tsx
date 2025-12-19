import { Scissors, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function EditorDashboardView() {
  const stats = [
    { label: 'Active Projects', value: '8', icon: Scissors, color: 'text-purple-500' },
    { label: 'In Review', value: '3', icon: Clock, color: 'text-orange-500' },
    { label: 'Completed This Week', value: '15', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Pending Feedback', value: '2', icon: AlertCircle, color: 'text-red-500' },
  ];

  const urgentProjects = [
    {
      client: 'クライアントA',
      project: 'Instagram リール編集',
      deadline: '2024-12-20',
      status: '編集中',
      timeLeft: '2時間',
      priority: 'high'
    },
    {
      client: 'クライアントB',
      project: 'プロモーション動画編集',
      deadline: '2024-12-20',
      status: 'レビュー待ち',
      timeLeft: '4時間',
      priority: 'high'
    },
    {
      client: 'クライアントC',
      project: '商品写真レタッチ',
      deadline: '2024-12-21',
      status: '修正依頼',
      timeLeft: '1日',
      priority: 'medium'
    },
  ];

  const todayTasks = [
    { time: '10:00', task: 'クライアントA - リール編集完了', status: 'pending' },
    { time: '13:00', task: 'ディレクターとレビューミーティング', status: 'pending' },
    { time: '15:00', task: 'クライアントB - 修正対応', status: 'completed' },
    { time: '17:00', task: 'テンプレート整理', status: 'pending' },
  ];

  const recentActivity = [
    { action: 'レビュー依頼を送信', project: 'クライアントD - ブランドムービー v3', time: '1時間前' },
    { action: '編集を完了', project: 'クライアントE - 商品写真レタッチ', time: '3時間前' },
    { action: '修正依頼を受信', project: 'クライアントF - SNS投稿画像', time: '5時間前' },
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
        <p className="text-sm text-muted-foreground">編集業務の概要</p>
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
        {/* Urgent Projects */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">緊急対応プロジェクト</h2>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {urgentProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors border-l-4 border-red-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{project.client}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                    残り{project.timeLeft}
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

        {/* Today's Tasks */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">今日のタスク</h2>
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-green-500'
                      : 'border-2 border-muted-foreground'
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm mb-1">{task.task}</div>
                  <div className="text-xs text-muted-foreground">{task.time}</div>
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm text-muted-foreground mb-3">今週の完了プロジェクト</h3>
          <div className="text-3xl mb-2">15</div>
          <div className="text-xs text-green-500">先週比 +20%</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm text-muted-foreground mb-3">平均編集時間</h3>
          <div className="text-3xl mb-2">2.5h</div>
          <div className="text-xs text-blue-500">プロジェクトあたり</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm text-muted-foreground mb-3">承認率</h3>
          <div className="text-3xl mb-2">94%</div>
          <div className="text-xs text-green-500">一発承認率</div>
        </div>
      </div>
    </div>
  );
}
