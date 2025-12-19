import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  unit?: string;
}

function KPICard({ title, value, change, unit = '' }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 flex-1 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all">
      <div className="text-[#7B8794] mb-4">{title}</div>
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <div className="text-[#1F2933] text-4xl tracking-tight">{value}</div>
          {unit && <span className="text-[#7B8794] text-lg">{unit}</span>}
        </div>
      </div>
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          isPositive ? 'bg-[#C5F3E5] text-[#0C8A5F]' : 'bg-[#FEE2E2] text-[#DC2626]'
        }`}
      >
        {isPositive ? <TrendingUp className="w-4 h-4" strokeWidth={2} /> : <TrendingDown className="w-4 h-4" strokeWidth={2} />}
        <span className="text-sm">{isPositive ? '+' : ''}{change}%</span>
      </div>
    </div>
  );
}

export function KPISummary() {
  const kpis = [
    { title: '今月の受注金額', value: '¥12,450,000', change: 15.3 },
    { title: '今月の受注件数', value: '23', change: 8.7, unit: '件' },
    { title: '今月の提案件数', value: '47', change: -4.2, unit: '件' },
    { title: '受注率', value: '48.9', change: 12.1, unit: '%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#1F2933]">営業KPIサマリ</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] rounded-xl bg-white hover:bg-[#F9FAFB] transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <span className="text-[#52606D]">今月</span>
          <ChevronDown className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
}
