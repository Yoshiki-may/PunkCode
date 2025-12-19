import { Award, TrendingUp, Users, Target } from 'lucide-react';

export function TeamPerformance() {
  const departments = [
    {
      name: 'Sales Board',
      members: 5,
      metrics: {
        conversionRate: 32,
        avgDealSize: 850000,
        dealsWon: 12,
        revenue: 8500000,
      },
      topPerformers: [
        { name: '田中', deals: 5, value: 3500000, rating: 4.9 },
        { name: '佐藤', deals: 4, value: 2800000, rating: 4.7 },
      ],
      color: 'bg-blue-500',
    },
    {
      name: 'Direction Board',
      members: 8,
      metrics: {
        projectsManaged: 23,
        onTimeDelivery: 87,
        clientSatisfaction: 4.6,
        avgProjectValue: 400000,
      },
      topPerformers: [
        { name: 'ディレクター佐藤', projects: 8, satisfaction: 4.8 },
        { name: 'ディレクター田中', projects: 7, satisfaction: 4.7 },
      ],
      color: 'bg-purple-500',
    },
    {
      name: 'Editor Board',
      members: 6,
      metrics: {
        tasksCompleted: 35,
        avgCompletionTime: 4.2,
        revisionRate: 15,
        qualityScore: 4.5,
      },
      topPerformers: [
        { name: 'Editor山田', tasks: 12, speed: 3.8, quality: 4.9 },
        { name: 'Editor高橋', tasks: 10, speed: 4.0, quality: 4.6 },
      ],
      color: 'bg-green-500',
    },
    {
      name: 'Creator Board',
      members: 4,
      metrics: {
        shootsCompleted: 19,
        onTimeRate: 95,
        assetQuality: 4.7,
        avgShootTime: 2.5,
      },
      topPerformers: [
        { name: 'Creator鈴木', shoots: 8, quality: 4.9, onTime: 100 },
        { name: 'Creator田中', shoots: 6, quality: 4.6, onTime: 95 },
      ],
      color: 'bg-orange-500',
    },
  ];

  const resourceUtilization = [
    { board: 'Sales', utilization: 75, available: 2, busy: 3, overbooked: 0 },
    { board: 'Direction', utilization: 87, available: 1, busy: 6, overbooked: 1 },
    { board: 'Editor', utilization: 92, available: 0, busy: 5, overbooked: 1 },
    { board: 'Creator', utilization: 78, available: 1, busy: 3, overbooked: 0 },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Team Performance</h1>
        <p className="text-sm text-muted-foreground">チームパフォーマンス - 部門別・個人別実績</p>
      </div>

      {/* Resource Utilization */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg">リソース稼働状況</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceUtilization.map((resource, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm mb-2">{resource.board} Board</div>
              <div className="text-2xl mb-3">{resource.utilization}%</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">余裕あり</span>
                  <span className="text-green-600">{resource.available}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">稼働中</span>
                  <span>{resource.busy}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">過負荷</span>
                  <span className="text-red-600">{resource.overbooked}名</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="space-y-6">
        {departments.map((dept, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                <h3 className="text-lg">{dept.name}</h3>
                <span className="text-sm text-muted-foreground">{dept.members}名</span>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {Object.entries(dept.metrics).map(([key, value], idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">
                    {key === 'conversionRate' && '成約率'}
                    {key === 'avgDealSize' && '平均案件単価'}
                    {key === 'dealsWon' && '成約数'}
                    {key === 'revenue' && '売上'}
                    {key === 'projectsManaged' && '管理案件数'}
                    {key === 'onTimeDelivery' && '納期達成率'}
                    {key === 'clientSatisfaction' && '満足度'}
                    {key === 'avgProjectValue' && '平均案件額'}
                    {key === 'tasksCompleted' && '完了タスク'}
                    {key === 'avgCompletionTime' && '平均完了時間'}
                    {key === 'revisionRate' && '修正率'}
                    {key === 'qualityScore' && '品質スコア'}
                    {key === 'shootsCompleted' && '完了撮影'}
                    {key === 'onTimeRate' && '定時完了率'}
                    {key === 'assetQuality' && '素材品質'}
                    {key === 'avgShootTime' && '平均撮影時間'}
                  </div>
                  <div className="text-lg">
                    {typeof value === 'number' && value > 1000 ? `¥${value.toLocaleString()}` : 
                     typeof value === 'number' && value < 10 ? value.toFixed(1) :
                     typeof value === 'number' && key.includes('Rate') ? `${value}%` :
                     value}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Performers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm">トップパフォーマー</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {dept.topPerformers.map((performer, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{performer.name}</span>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-orange-500" />
                        <span className="text-xs">#{idx + 1}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {Object.entries(performer).filter(([key]) => key !== 'name').map(([key, value], i) => (
                        <div key={i}>
                          <div className="text-muted-foreground">
                            {key === 'deals' && '成約'}
                            {key === 'value' && '売上'}
                            {key === 'rating' && '評価'}
                            {key === 'projects' && '案件'}
                            {key === 'satisfaction' && '満足度'}
                            {key === 'tasks' && 'タスク'}
                            {key === 'speed' && '速度'}
                            {key === 'quality' && '品質'}
                            {key === 'shoots' && '撮影'}
                            {key === 'onTime' && '定時%'}
                          </div>
                          <div className="mt-0.5">
                            {typeof value === 'number' && value > 1000000 ? `¥${(value/1000000).toFixed(1)}M` :
                             typeof value === 'number' && value > 1000 ? `¥${(value/1000).toFixed(0)}K` :
                             value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
