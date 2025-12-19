import { TrendingUp, TrendingDown, Target, DollarSign, Users, Award, Calendar, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, BarChart3, PieChart, Activity } from 'lucide-react';
import { useState } from 'react';

interface KPIMetric {
  id: string;
  name: string;
  value: number | string;
  target: number;
  unit: string;
  change: number; // percentage change from last period
  trend: 'up' | 'down' | 'stable';
  category: 'revenue' | 'sales' | 'client' | 'activity';
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  deals: number;
  revenue: number;
  targetAchievement: number; // percentage
  rank: number;
}

export function KPIReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'revenue' | 'sales' | 'client' | 'activity'>('all');

  const kpiMetrics: KPIMetric[] = [
    {
      id: '1',
      name: '月次売上',
      value: 12450,
      target: 15000,
      unit: '万円',
      change: 15.3,
      trend: 'up',
      category: 'revenue',
    },
    {
      id: '2',
      name: '受注件数',
      value: 23,
      target: 30,
      unit: '件',
      change: 8.5,
      trend: 'up',
      category: 'sales',
    },
    {
      id: '3',
      name: '商談成約率',
      value: 68,
      target: 75,
      unit: '%',
      change: -2.1,
      trend: 'down',
      category: 'sales',
    },
    {
      id: '4',
      name: '新規顧客獲得',
      value: 8,
      target: 10,
      unit: '社',
      change: 33.3,
      trend: 'up',
      category: 'client',
    },
    {
      id: '5',
      name: 'アクティブ顧客',
      value: 47,
      target: 50,
      unit: '社',
      change: 4.4,
      trend: 'up',
      category: 'client',
    },
    {
      id: '6',
      name: '平均案件単価',
      value: 541,
      target: 500,
      unit: '万円',
      change: 12.1,
      trend: 'up',
      category: 'revenue',
    },
    {
      id: '7',
      name: '商談数',
      value: 34,
      target: 40,
      unit: '件',
      change: 0,
      trend: 'stable',
      category: 'activity',
    },
    {
      id: '8',
      name: '顧客満足度',
      value: 92,
      target: 90,
      unit: '%',
      change: 3.4,
      trend: 'up',
      category: 'client',
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: '田中太郎',
      avatar: 'TT',
      deals: 12,
      revenue: 5400,
      targetAchievement: 108,
      rank: 1,
    },
    {
      id: '2',
      name: '佐藤花子',
      avatar: 'SH',
      deals: 10,
      revenue: 4200,
      targetAchievement: 95,
      rank: 2,
    },
    {
      id: '3',
      name: '鈴木一郎',
      avatar: 'SI',
      deals: 8,
      revenue: 3800,
      targetAchievement: 88,
      rank: 3,
    },
    {
      id: '4',
      name: '高橋美咲',
      avatar: 'TM',
      deals: 7,
      revenue: 2100,
      targetAchievement: 72,
      rank: 4,
    },
    {
      id: '5',
      name: '山田次郎',
      avatar: 'YJ',
      deals: 6,
      revenue: 1950,
      targetAchievement: 65,
      rank: 5,
    },
  ];

  const filteredMetrics = selectedCategory === 'all' 
    ? kpiMetrics 
    : kpiMetrics.filter(m => m.category === selectedCategory);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return ArrowUpRight;
      case 'down':
        return ArrowDownRight;
      case 'stable':
        return Minus;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'stable':
        return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return DollarSign;
      case 'sales':
        return Target;
      case 'client':
        return Users;
      case 'activity':
        return Activity;
      default:
        return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue':
        return 'bg-green-500';
      case 'sales':
        return 'bg-blue-500';
      case 'client':
        return 'bg-purple-500';
      case 'activity':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const overallTargetAchievement = (kpiMetrics.reduce((sum, m) => {
    const achievement = typeof m.value === 'number' ? (m.value / m.target) * 100 : 0;
    return sum + achievement;
  }, 0) / kpiMetrics.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-card-foreground mb-2">KPI Reports</h1>
          <p className="text-muted-foreground">
            営業成績と目標達成状況を可視化
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="month">今月</option>
            <option value="quarter">今四半期</option>
            <option value="year">今年度</option>
          </select>
        </div>
      </div>

      {/* Overall Achievement Summary */}
      <div className="grid grid-cols-3 gap-6">
        {/* Overall Target Achievement */}
        <div className="col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">総合目標達成率</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-card-foreground">
                  {overallTargetAchievement.toFixed(1)}
                </span>
                <span className="text-lg text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full bg-white/50 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all relative overflow-hidden"
                style={{ width: `${Math.min(overallTargetAchievement, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="col-span-1 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-700" strokeWidth={2} />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              +15.3%
            </span>
          </div>
          <h3 className="text-sm text-green-700 mb-2">月次売上</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-800">
              ¥12,450
            </span>
            <span className="text-lg text-green-600">万円</span>
          </div>
          <div className="mt-2 text-xs text-green-600">
            目標: ¥15,000万円 (83.0%)
          </div>
        </div>

        {/* Win Rate */}
        <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-700" strokeWidth={2} />
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" strokeWidth={2} />
              -2.1%
            </span>
          </div>
          <h3 className="text-sm text-blue-700 mb-2">商談成約率</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-800">
              68
            </span>
            <span className="text-lg text-blue-600">%</span>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            目標: 75% (90.7%)
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-accent border border-border'
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setSelectedCategory('revenue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            selectedCategory === 'revenue'
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-accent border border-border'
          }`}
        >
          <DollarSign className="w-4 h-4" strokeWidth={2} />
          売上
        </button>
        <button
          onClick={() => setSelectedCategory('sales')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            selectedCategory === 'sales'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-accent border border-border'
          }`}
        >
          <Target className="w-4 h-4" strokeWidth={2} />
          営業
        </button>
        <button
          onClick={() => setSelectedCategory('client')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            selectedCategory === 'client'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-accent border border-border'
          }`}
        >
          <Users className="w-4 h-4" strokeWidth={2} />
          顧客
        </button>
        <button
          onClick={() => setSelectedCategory('activity')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            selectedCategory === 'activity'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-accent border border-border'
          }`}
        >
          <Activity className="w-4 h-4" strokeWidth={2} />
          活動
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredMetrics.map((metric) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const CategoryIcon = getCategoryIcon(metric.category);
          const achievement = typeof metric.value === 'number' ? (metric.value / metric.target) * 100 : 0;
          const isOverAchieving = achievement >= 100;

          return (
            <div
              key={metric.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${getCategoryColor(metric.category)} rounded-lg flex items-center justify-center`}>
                  <CategoryIcon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                  <TrendIcon className="w-3 h-3" strokeWidth={2} />
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>

              <h3 className="text-sm text-muted-foreground mb-2">{metric.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-card-foreground">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">目標: {metric.target}{metric.unit}</span>
                  <span className={`font-medium ${isOverAchieving ? 'text-green-600' : 'text-amber-600'}`}>
                    {achievement.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isOverAchieving ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(achievement, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Performance */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-card-foreground">チーム成績</h2>
                <p className="text-sm text-muted-foreground">メンバー別の目標達成状況</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1">
              詳細を見る
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-5 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                  member.rank === 1 
                    ? 'bg-amber-100 text-amber-700'
                    : member.rank === 2
                    ? 'bg-slate-100 text-slate-700'
                    : member.rank === 3
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  #{member.rank}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{member.avatar}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{member.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{member.deals}件の成約</span>
                    <span>•</span>
                    <span>¥{member.revenue.toLocaleString()}万円</span>
                  </div>
                </div>

                {/* Achievement */}
                <div className="text-right">
                  <div className={`text-lg font-bold mb-1 ${
                    member.targetAchievement >= 100 
                      ? 'text-green-600' 
                      : member.targetAchievement >= 80
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {member.targetAchievement}%
                  </div>
                  <div className="text-xs text-muted-foreground">目標達成率</div>
                </div>

                {/* Progress Bar */}
                <div className="w-32">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        member.targetAchievement >= 100 
                          ? 'bg-green-500' 
                          : member.targetAchievement >= 80
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(member.targetAchievement, 100)}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Comparison */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-card-foreground">期間比較</h3>
            <PieChart className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground mb-1">前月比</div>
                <div className="text-xl font-bold text-card-foreground">+15.3%</div>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground mb-1">前年同月比</div>
                <div className="text-xl font-bold text-card-foreground">+28.7%</div>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-card-foreground">今月のハイライト</h3>
            <Award className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-700" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">過去最高売上達成</div>
                <div className="text-xs text-green-700 mt-1">月次売上が過去最高を記録しました</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-700" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">新規顧客8社獲得</div>
                <div className="text-xs text-blue-700 mt-1">前月比33%増の新規顧客を獲得</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-purple-700" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-medium text-purple-900">田中太郎が目標達成</div>
                <div className="text-xs text-purple-700 mt-1">108%の目標達成率で1位を獲得</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
