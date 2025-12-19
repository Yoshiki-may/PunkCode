import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPI {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  isPositive: boolean;
}

interface KPISnapshotCardProps {
  onNavigate?: (view: string) => void;
}

export function KPISnapshotCard({ onNavigate }: KPISnapshotCardProps) {
  const kpis: KPI[] = [
    {
      id: '1',
      label: '納期遵守率',
      value: '92',
      unit: '%',
      change: 3,
      trend: 'up',
      isPositive: true,
    },
    {
      id: '2',
      label: '差戻し率',
      value: '8',
      unit: '%',
      change: -2,
      trend: 'down',
      isPositive: true,
    },
    {
      id: '3',
      label: '平均リードタイム',
      value: '7.2',
      unit: '日',
      change: -1,
      trend: 'down',
      isPositive: true,
    },
  ];

  const getTrendIcon = (trend: string, isPositive: boolean) => {
    if (trend === 'up') {
      return isPositive ? (
        <TrendingUp className="w-4 h-4 text-success" strokeWidth={2} />
      ) : (
        <TrendingUp className="w-4 h-4 text-destructive" strokeWidth={2} />
      );
    } else if (trend === 'down') {
      return isPositive ? (
        <TrendingDown className="w-4 h-4 text-success" strokeWidth={2} />
      ) : (
        <TrendingDown className="w-4 h-4 text-destructive" strokeWidth={2} />
      );
    } else {
      return <Minus className="w-4 h-4 text-muted-foreground" strokeWidth={2} />;
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('kpi-reports')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">KPI Snapshot</h3>
        <span className="text-xs text-muted-foreground">今月の要点</span>
      </div>

      {/* KPI Grid */}
      <div className="space-y-4 mb-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all">
            {/* Label */}
            <div className="text-xs text-muted-foreground mb-2">{kpi.label}</div>
            
            {/* Value + Unit */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl text-card-foreground">{kpi.value}</span>
              <span className="text-sm text-muted-foreground">{kpi.unit}</span>
            </div>

            {/* Trend */}
            <div className="flex items-center gap-2">
              {getTrendIcon(kpi.trend, kpi.isPositive)}
              <span className={`text-xs ${kpi.isPositive ? 'text-success' : 'text-destructive'}`}>
                {Math.abs(kpi.change)}% 前週比
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
      >
        <span>KPIレポート</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}
