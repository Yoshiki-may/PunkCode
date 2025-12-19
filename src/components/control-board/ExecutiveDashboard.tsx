import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Building2, AlertCircle, Activity } from 'lucide-react';

export function ExecutiveDashboard() {
  const kpiData = [
    {
      label: '月間売上',
      value: '¥24,500,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '進行中案件',
      value: '47',
      change: '+8',
      trend: 'up',
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'アクティブクライアント',
      value: '28',
      change: '+3',
      trend: 'up',
      icon: Building2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'チーム稼働率',
      value: '87%',
      change: '-3%',
      trend: 'down',
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const boardStats = [
    { board: 'Sales Board', deals: 12, value: '¥8,500,000', conversion: '32%', color: 'bg-blue-500' },
    { board: 'Direction Board', projects: 23, inProgress: 18, completed: 5, color: 'bg-purple-500' },
    { board: 'Editor Board', tasks: 35, pending: 12, inReview: 8, done: 15, color: 'bg-green-500' },
    { board: 'Creator Board', shoots: 19, scheduled: 7, completed: 12, color: 'bg-orange-500' },
    { board: 'Client Board', active: 28, satisfaction: '4.7/5', retention: '94%', color: 'bg-pink-500' },
  ];

  const recentActivities = [
    { 
      id: 1, 
      board: 'Sales', 
      user: '営業 田中', 
      action: '新規案件を作成', 
      target: 'クライアントA - SNS運用',
      time: '5分前',
      type: 'success'
    },
    { 
      id: 2, 
      board: 'Direction', 
      user: 'ディレクター佐藤', 
      action: '案件を承認', 
      target: 'クライアントB - 動画制作',
      time: '12分前',
      type: 'info'
    },
    { 
      id: 3, 
      board: 'Editor', 
      user: 'Editor山田', 
      action: 'レビュー依頼を送信', 
      target: 'Instagram リール編集',
      time: '23分前',
      type: 'warning'
    },
    { 
      id: 4, 
      board: 'Creator', 
      user: 'Creator鈴木', 
      action: '素材をアップロード', 
      target: '商品撮影 - 15ファイル',
      time: '1時間前',
      type: 'success'
    },
    { 
      id: 5, 
      board: 'Client', 
      user: 'クライアントC', 
      action: '成果物を承認', 
      target: 'プロモーション動画',
      time: '2時間前',
      type: 'success'
    },
    { 
      id: 6, 
      board: 'Sales', 
      user: '営業 高橋', 
      action: '契約を更新', 
      target: 'クライアントD - 年間契約',
      time: '3時間前',
      type: 'success'
    },
  ];

  const alerts = [
    { id: 1, level: 'critical', title: '納期遅延リスク', message: 'クライアントE案件が納期に間に合わない可能性', board: 'Direction' },
    { id: 2, level: 'warning', title: '予算超過', message: 'クライアントF案件が予算の110%を消費', board: 'Direction' },
    { id: 3, level: 'info', title: 'リソース不足', message: '来週のEditor稼働率が95%超え予測', board: 'Editor' },
  ];

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-200 bg-red-500/5';
      case 'warning': return 'border-orange-200 bg-orange-500/5';
      case 'info': return 'border-blue-200 bg-blue-500/5';
      default: return 'border-gray-200 bg-gray-500/5';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">全ボード統合ダッシュボード - リアルタイム経営指標</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="text-2xl mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg">重要アラート</h2>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.level)}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm">{alert.title}</h3>
                <span className="px-2 py-1 bg-muted text-xs rounded">{alert.board}</span>
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Board Stats */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg">ボード別統計</h2>
          </div>
          <div className="space-y-4">
            {boardStats.map((stat, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <h3 className="text-sm">{stat.board}</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {stat.deals !== undefined && (
                    <>
                      <div>
                        <div className="text-muted-foreground">商談数</div>
                        <div className="text-lg mt-1">{stat.deals}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">見込額</div>
                        <div className="text-lg mt-1">{stat.value}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">成約率</div>
                        <div className="text-lg mt-1">{stat.conversion}</div>
                      </div>
                    </>
                  )}
                  {stat.projects !== undefined && (
                    <>
                      <div>
                        <div className="text-muted-foreground">総案件</div>
                        <div className="text-lg mt-1">{stat.projects}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">進行中</div>
                        <div className="text-lg mt-1">{stat.inProgress}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">完了</div>
                        <div className="text-lg mt-1">{stat.completed}</div>
                      </div>
                    </>
                  )}
                  {stat.tasks !== undefined && (
                    <>
                      <div>
                        <div className="text-muted-foreground">総タスク</div>
                        <div className="text-lg mt-1">{stat.tasks}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">保留</div>
                        <div className="text-lg mt-1">{stat.pending}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">完了</div>
                        <div className="text-lg mt-1">{stat.done}</div>
                      </div>
                    </>
                  )}
                  {stat.shoots !== undefined && (
                    <>
                      <div>
                        <div className="text-muted-foreground">総撮影</div>
                        <div className="text-lg mt-1">{stat.shoots}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">予定</div>
                        <div className="text-lg mt-1">{stat.scheduled}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">完了</div>
                        <div className="text-lg mt-1">{stat.completed}</div>
                      </div>
                    </>
                  )}
                  {stat.active !== undefined && (
                    <>
                      <div>
                        <div className="text-muted-foreground">アクティブ</div>
                        <div className="text-lg mt-1">{stat.active}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">満足度</div>
                        <div className="text-lg mt-1">{stat.satisfaction}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">継続率</div>
                        <div className="text-lg mt-1">{stat.retention}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg">リアルタイムアクティビティ</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {activity.board}
                    </span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <div className="text-sm mb-1">
                    <span className="text-foreground">{activity.user}</span>
                    <span className="text-muted-foreground"> が </span>
                    <span className="text-foreground">{activity.action}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {activity.target}
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
