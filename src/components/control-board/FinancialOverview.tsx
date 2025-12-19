import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';

export function FinancialOverview() {
  const financialSummary = {
    revenue: { current: 24500000, target: 25000000, previous: 21800000 },
    profit: { current: 7350000, margin: 30, previous: 6540000 },
    cashflow: { current: 12300000, incoming: 8500000, outgoing: 3200000 },
  };

  const departmentRevenue = [
    { dept: 'Sales Board', revenue: 8500000, profit: 2550000, margin: 30, projects: 12, color: 'bg-blue-500' },
    { dept: 'Direction Board', revenue: 9200000, profit: 2760000, margin: 30, projects: 23, color: 'bg-purple-500' },
    { dept: 'Editor Board', revenue: 4300000, profit: 1290000, margin: 30, projects: 35, color: 'bg-green-500' },
    { dept: 'Creator Board', revenue: 2500000, profit: 750000, margin: 30, projects: 19, color: 'bg-orange-500' },
  ];

  const projectPL = [
    { 
      project: 'クライアントA - SNS運用',
      revenue: 1200000,
      cost: 720000,
      profit: 480000,
      margin: 40,
      status: '進行中',
      statusColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
    { 
      project: 'クライアントB - 動画制作',
      revenue: 850000,
      cost: 595000,
      profit: 255000,
      margin: 30,
      status: '完了',
      statusColor: 'bg-green-500/10 text-green-700 border-green-200'
    },
    { 
      project: 'クライアントC - 商品撮影',
      revenue: 450000,
      cost: 315000,
      profit: 135000,
      margin: 30,
      status: '進行中',
      statusColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
    { 
      project: 'クライアントD - リール制作',
      revenue: 320000,
      cost: 256000,
      profit: 64000,
      margin: 20,
      status: '完了',
      statusColor: 'bg-green-500/10 text-green-700 border-green-200'
    },
    { 
      project: 'クライアントE - ブランディング',
      revenue: 2500000,
      cost: 2250000,
      profit: 250000,
      margin: 10,
      status: '進行中',
      statusColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
  ];

  const cashflowForecast = [
    { month: '1月', incoming: 8500000, outgoing: 5200000, net: 3300000 },
    { month: '2月', incoming: 9200000, outgoing: 5800000, net: 3400000 },
    { month: '3月', incoming: 10500000, outgoing: 6200000, net: 4300000 },
  ];

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change.toFixed(1),
      isPositive: change >= 0
    };
  };

  const revenueChange = calculateChange(financialSummary.revenue.current, financialSummary.revenue.previous);
  const profitChange = calculateChange(financialSummary.profit.current, financialSummary.profit.previous);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Financial Overview</h1>
        <p className="text-sm text-muted-foreground">財務統括 - 売上・利益・キャッシュフロー</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${revenueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{revenueChange.value}%</span>
            </div>
          </div>
          <div className="text-2xl mb-1">{formatCurrency(financialSummary.revenue.current)}</div>
          <div className="text-sm text-muted-foreground mb-3">月間売上</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">目標: {formatCurrency(financialSummary.revenue.target)}</span>
            <span className="text-muted-foreground">
              {((financialSummary.revenue.current / financialSummary.revenue.target) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-2">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(financialSummary.revenue.current / financialSummary.revenue.target) * 100}%` }}
            />
          </div>
        </div>

        {/* Profit */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${profitChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {profitChange.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{profitChange.value}%</span>
            </div>
          </div>
          <div className="text-2xl mb-1">{formatCurrency(financialSummary.profit.current)}</div>
          <div className="text-sm text-muted-foreground mb-3">営業利益</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">利益率</span>
            <span className="text-green-600">{financialSummary.profit.margin}%</span>
          </div>
        </div>

        {/* Cashflow */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="text-2xl mb-1">{formatCurrency(financialSummary.cashflow.current)}</div>
          <div className="text-sm text-muted-foreground mb-3">キャッシュフロー</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">入金予定</span>
              <span className="text-green-600">+{formatCurrency(financialSummary.cashflow.incoming)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">支払予定</span>
              <span className="text-red-600">-{formatCurrency(financialSummary.cashflow.outgoing)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Revenue */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-primary" />
          <h2 className="text-lg">部門別収益</h2>
        </div>
        <div className="space-y-4">
          {departmentRevenue.map((dept, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                  <h3 className="text-sm">{dept.dept}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{dept.projects}案件</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">売上</div>
                  <div className="text-sm">{formatCurrency(dept.revenue)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">利益</div>
                  <div className="text-sm">{formatCurrency(dept.profit)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">利益率</div>
                  <div className="text-sm text-green-600">{dept.margin}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">平均単価</div>
                  <div className="text-sm">{formatCurrency(Math.round(dept.revenue / dept.projects))}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project P/L */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg mb-4">案件別収支</h2>
          <div className="space-y-3">
            {projectPL.map((project, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm">{project.project}</h3>
                  <span className={`px-2 py-1 border rounded-full text-xs ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground mb-1">売上</div>
                    <div>{formatCurrency(project.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">コスト</div>
                    <div>{formatCurrency(project.cost)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">利益</div>
                    <div className="text-green-600">{formatCurrency(project.profit)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">利益率</div>
                    <div className={project.margin >= 30 ? 'text-green-600' : project.margin >= 20 ? 'text-orange-600' : 'text-red-600'}>
                      {project.margin}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cashflow Forecast */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg mb-4">キャッシュフロー予測</h2>
          <div className="space-y-4">
            {cashflowForecast.map((month, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm mb-3">{month.month}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">入金</span>
                    <span className="text-green-600">+{formatCurrency(month.incoming)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">支出</span>
                    <span className="text-red-600">-{formatCurrency(month.outgoing)}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">純収支</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(month.net)}
                      </span>
                    </div>
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
