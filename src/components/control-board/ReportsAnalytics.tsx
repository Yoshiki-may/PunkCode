import { FileBarChart, Download, Calendar, TrendingUp } from 'lucide-react';

export function ReportsAnalytics() {
  const reports = [
    {
      id: 1,
      title: '週次経営レポート',
      period: '2024年12月第3週',
      generatedAt: '2024-12-19 09:00',
      type: 'weekly',
      status: 'ready',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: '月次売上レポート',
      period: '2024年11月',
      generatedAt: '2024-12-01 10:00',
      type: 'monthly',
      status: 'ready',
      size: '5.8 MB',
    },
    {
      id: 3,
      title: '四半期業績レポート',
      period: '2024年Q3',
      generatedAt: '2024-10-05 15:00',
      type: 'quarterly',
      status: 'ready',
      size: '12.3 MB',
    },
  ];

  const customReports = [
    { id: 1, name: 'Board別収益分析', lastRun: '2024-12-15' },
    { id: 2, name: 'クライアント別LTV分析', lastRun: '2024-12-10' },
    { id: 3, name: 'リソース稼働率レポート', lastRun: '2024-12-18' },
  ];

  const kpiTrends = [
    { metric: '月間売上', current: 24500000, trend: '+12.5%', trendPositive: true },
    { metric: '営業利益', current: 7350000, trend: '+15.2%', trendPositive: true },
    { metric: '案件数', current: 47, trend: '+8', trendPositive: true },
    { metric: 'クライアント数', current: 28, trend: '+3', trendPositive: true },
    { metric: '成約率', current: 32, trend: '+5%', trendPositive: true },
    { metric: 'チーム稼働率', current: 87, trend: '-3%', trendPositive: false },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">レポート・分析 - 自動生成レポートとカスタム分析</p>
      </div>

      {/* Auto-Generated Reports */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            <h2 className="text-lg">自動生成レポート</h2>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
            新規レポート作成
          </button>
        </div>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm">{report.title}</h3>
                    <span className="px-2 py-1 bg-green-500/10 text-green-700 text-xs rounded">
                      {report.status === 'ready' ? '生成済み' : '生成中'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.period}
                    </span>
                    <span>•</span>
                    <span>生成日時: {report.generatedAt}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button className="px-3 py-1 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Trends */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg">KPIトレンド</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiTrends.map((kpi, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">{kpi.metric}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl">
                  {kpi.metric.includes('売上') || kpi.metric.includes('利益') 
                    ? `¥${(kpi.current / 1000000).toFixed(1)}M`
                    : kpi.metric.includes('率')
                    ? `${kpi.current}%`
                    : kpi.current}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trendPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                  <span>{kpi.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Custom Reports */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg mb-4">カスタムレポート</h2>
          <div className="space-y-3">
            {customReports.map((report) => (
              <div key={report.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm mb-1">{report.name}</div>
                  <div className="text-xs text-muted-foreground">最終実行: {report.lastRun}</div>
                </div>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  実行
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-dashed border-border rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground">
            + カスタムレポートを作成
          </button>
        </div>

        {/* Data Export */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg mb-4">データエクスポート</h2>
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm mb-3">エクスポート期間を選択</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input 
                  type="date" 
                  className="px-3 py-2 bg-background rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="2024-12-01"
                />
                <input 
                  type="date" 
                  className="px-3 py-2 bg-background rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="2024-12-31"
                />
              </div>
              <div className="text-sm mb-3">データ種別を選択</div>
              <div className="space-y-2 mb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  <span>売上データ</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  <span>案件データ</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  <span>クライアントデータ</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  <span>チームデータ</span>
                </label>
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span>Excelエクスポート</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
