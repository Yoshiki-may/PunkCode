import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { calculateDirectionKPI } from '../../utils/kpiCalculator';
import { getAppState } from '../../utils/appState';

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
  const [kpis, setKpis] = useState<KPI[]>([]);
  
  // KPIを計算（5秒ごとに再計算して動的更新を反映）
  useEffect(() => {
    calculateKPIs();
    
    const interval = setInterval(calculateKPIs, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const calculateKPIs = () => {
    try {
      const appState = getAppState();
      const clientId = appState.selectedClientId || undefined;
      
      // Direction KPIを計算
      const result = calculateDirectionKPI(clientId);
      
      // 納期遵守率（高いほど良い）
      const onTimeTrend = result.onTimeRateChange > 0 ? 'up' : result.onTimeRateChange < 0 ? 'down' : 'stable';
      const onTimeIsPositive = result.onTimeRateChange >= 0;
      
      // 差し戻し率（低いほど良い）
      const rejectionTrend = result.rejectionRateChange > 0 ? 'up' : result.rejectionRateChange < 0 ? 'down' : 'stable';
      const rejectionIsPositive = result.rejectionRateChange <= 0; // 減少が良い
      
      // 平均リードタイム（短いほど良い）
      const leadTimeTrend = result.leadTimeChange > 0 ? 'up' : result.leadTimeChange < 0 ? 'down' : 'stable';
      const leadTimeIsPositive = result.leadTimeChange <= 0; // 減少が良い
      
      const calculatedKPIs: KPI[] = [
        {
          id: '1',
          label: '納期遵守率',
          value: result.onTimeRate.toFixed(0),
          unit: '%',
          change: Math.abs(result.onTimeRateChange),
          trend: onTimeTrend,
          isPositive: onTimeIsPositive,
        },
        {
          id: '2',
          label: '差戻し率',
          value: result.rejectionRate.toFixed(0),
          unit: '%',
          change: Math.abs(result.rejectionRateChange),
          trend: rejectionTrend,
          isPositive: rejectionIsPositive,
        },
        {
          id: '3',
          label: '平均リードタイム',
          value: result.averageLeadTime.toFixed(1),
          unit: '日',
          change: Math.abs(result.leadTimeChange),
          trend: leadTimeTrend,
          isPositive: leadTimeIsPositive,
        },
      ];
      
      setKpis(calculatedKPIs);
    } catch (error) {
      console.error('[KPISnapshotCard] Error calculating KPIs:', error);
      // エラー時はデフォルト値を設定
      const defaultKPIs: KPI[] = [
        { id: '1', label: '納期遵守率', value: '0', unit: '%', change: 0, trend: 'stable', isPositive: true },
        { id: '2', label: '差戻し率', value: '0', unit: '%', change: 0, trend: 'stable', isPositive: true },
        { id: '3', label: '平均リードタイム', value: '0.0', unit: '日', change: 0, trend: 'stable', isPositive: true },
      ];
      setKpis(defaultKPIs);
    }
  };

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
                {kpi.change.toFixed(0)}% 前週比
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