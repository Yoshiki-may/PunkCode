import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface KPIItem {
  label: string;
  value: string;
  change: number;
  unit?: string;
}

type PeriodFilter = '今日' | '今週' | '今月';

interface KPISnapshotProps {
  onViewAllClick?: () => void;
}

export function KPISnapshot({ onViewAllClick }: KPISnapshotProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('今月');

  // Period-specific data
  const kpiData: Record<PeriodFilter, KPIItem[]> = {
    '今日': [
      { label: '受注数', value: '2', change: 100, unit: '件' },
      { label: '売上見込み', value: '850', change: 25, unit: '万円' },
      { label: '商談数', value: '5', change: 15, unit: '件' },
      { label: '成約率', value: '40', change: 10, unit: '%' },
    ],
    '今週': [
      { label: '受注数', value: '5', change: 25, unit: '件' },
      { label: '売上見込み', value: '3,200', change: 18, unit: '万円' },
      { label: '商談数', value: '15', change: 20, unit: '件' },
      { label: '成約率', value: '33', change: 8, unit: '%' },
    ],
    '今月': [
      { label: '受注数', value: '18', change: 35, unit: '件' },
      { label: '売上見込み', value: '12,500', change: 22, unit: '万円' },
      { label: '商談数', value: '52', change: 12, unit: '件' },
      { label: '成約率', value: '35', change: 5, unit: '%' },
    ],
  };

  const kpis = kpiData[selectedPeriod];

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium text-card-foreground">KPI Snapshot</h3>
        
        {/* Period Filter */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['今日', '今週', '今月'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {kpis.map((kpi, index) => (
          <div key={index} className="space-y-1">
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl text-card-foreground font-semibold">{kpi.value}</span>
              {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              kpi.change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {kpi.change >= 0 ? (
                <TrendingUp className="w-3 h-3" strokeWidth={2} />
              ) : (
                <TrendingDown className="w-3 h-3" strokeWidth={2} />
              )}
              <span>{Math.abs(kpi.change)}% 前月比</span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link - Fixed at bottom */}
      <button
        onClick={onViewAllClick}
        className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all group"
      >
        <span className="text-sm font-medium">KPI Reportsへ</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}