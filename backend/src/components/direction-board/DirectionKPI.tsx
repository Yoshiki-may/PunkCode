import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPIItem {
  label: string;
  value: string;
  change: number;
  unit?: string;
}

export function DirectionKPI() {
  const kpis: KPIItem[] = [
    { label: '納期遵守率', value: '92', change: 3, unit: '%' },
    { label: '差し戻し率', value: '8', change: -12, unit: '%' },
    { label: '平均制作日数', value: '7', change: -5, unit: '日' },
    { label: '承認リードタイム', value: '2.5', change: -8, unit: '日' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#111827]">KPI Snapshot</h3>
        <span className="text-xs text-[#7B8794]">今月</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="space-y-1">
            <div className="text-xs text-[#7B8794]">{kpi.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl text-[#111827]">{kpi.value}</span>
              {kpi.unit && <span className="text-sm text-[#7B8794]">{kpi.unit}</span>}
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              kpi.change >= 0 && !kpi.label.includes('差し戻し') ? 'text-[#059669]' : 
              kpi.change < 0 && kpi.label.includes('差し戻し') ? 'text-[#059669]' :
              kpi.change < 0 ? 'text-[#059669]' : 'text-[#DC2626]'
            }`}>
              {(kpi.change >= 0 && !kpi.label.includes('差し戻し')) || (kpi.change < 0 && (kpi.label.includes('差し戻し') || kpi.label.includes('日数') || kpi.label.includes('リードタイム'))) ? (
                <TrendingUp className="w-3 h-3" strokeWidth={2} />
              ) : (
                <TrendingDown className="w-3 h-3" strokeWidth={2} />
              )}
              <span>{Math.abs(kpi.change)}% 前月比</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
