import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { calculateSalesKPI } from '../utils/kpiCalculator';
import { getAppState } from '../utils/appState';

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
        <span className="text-sm">{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function KPISummary() {
  const [kpis, setKpis] = useState<KPICardProps[]>([]);
  
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
      
      // Sales KPIを計算
      const result = calculateSalesKPI(clientId);
      
      // 金額をフォーマット（¥12,450,000形式）
      const formatCurrency = (value: number): string => {
        return `¥${value.toLocaleString('ja-JP')}`;
      };
      
      const calculatedKPIs: KPICardProps[] = [
        { 
          title: '今月の受注金額', 
          value: formatCurrency(result.monthlyRevenue), 
          change: result.revenueChange 
        },
        { 
          title: '今月の受注件数', 
          value: result.monthlyDeals.toString(), 
          change: result.dealsChange, 
          unit: '件' 
        },
        { 
          title: '今月の提案件数', 
          value: result.monthlyProposals.toString(), 
          change: result.proposalsChange, 
          unit: '件' 
        },
        { 
          title: '受注率', 
          value: result.conversionRate.toFixed(1), 
          change: result.conversionRateChange, 
          unit: '%' 
        },
      ];
      
      setKpis(calculatedKPIs);
    } catch (error) {
      console.error('[KPISummary] Error calculating KPIs:', error);
      // エラー時はデフォルト値を設定
      const defaultKPIs: KPICardProps[] = [
        { title: '今月の受注金額', value: '¥0', change: 0 },
        { title: '今月の受注件数', value: '0', change: 0, unit: '件' },
        { title: '今月の提案件数', value: '0', change: 0, unit: '件' },
        { title: '受注率', value: '0.0', change: 0, unit: '%' },
      ];
      setKpis(defaultKPIs);
    }
  };

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