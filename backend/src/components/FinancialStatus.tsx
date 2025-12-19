import { DollarSign, TrendingUp, TrendingDown, Calendar, PieChart, BarChart3, CreditCard } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export function FinancialStatus() {
  const monthlyRevenue = [
    { month: '7月', revenue: 18500000, expenses: 12300000, profit: 6200000 },
    { month: '8月', revenue: 21200000, expenses: 13800000, profit: 7400000 },
    { month: '9月', revenue: 19800000, expenses: 13100000, profit: 6700000 },
    { month: '10月', revenue: 24300000, expenses: 15200000, profit: 9100000 },
    { month: '11月', revenue: 28500000, expenses: 16800000, profit: 11700000 },
    { month: '12月（予測）', revenue: 30200000, expenses: 17500000, profit: 12700000 },
  ];

  const revenueBySource = [
    { name: '新規契約', value: 12500000, color: '#0C8A5F' },
    { name: '継続契約', value: 14200000, color: '#4F46E5' },
    { name: 'スポット案件', value: 1800000, color: '#D97706' },
  ];

  const clientPaymentStatus = [
    { client: 'デジタルフロンティア', amount: 12000000, status: 'paid', dueDate: '2024/11/30' },
    { client: 'グローバルソリューションズ', amount: 3500000, status: 'pending', dueDate: '2024/12/15' },
    { client: 'テックイノベーション', amount: 18000000, status: 'overdue', dueDate: '2024/11/30' },
    { client: 'クリエイティブワークス', amount: 6000000, status: 'paid', dueDate: '2024/12/05' },
    { client: 'マーケティングソリューションズ', amount: 2800000, status: 'pending', dueDate: '2024/12/20' },
  ];

  const statusConfig = {
    paid: { label: '入金済み', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
    pending: { label: '請求中', color: 'bg-[#FEF3C7] text-[#D97706]' },
    overdue: { label: '期限超過', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  };

  const expenses = [
    { category: '人件費', amount: 9200000, percentage: 54.8 },
    { category: '外注費', amount: 4100000, percentage: 24.4 },
    { category: '設備・ソフトウェア', amount: 1800000, percentage: 10.7 },
    { category: 'マーケティング', amount: 1200000, percentage: 7.1 },
    { category: 'その他', amount: 500000, percentage: 3.0 },
  ];

  const stats = {
    monthlyRevenue: 28500000,
    monthlyProfit: 11700000,
    profitMargin: 41.1,
    outstandingPayments: clientPaymentStatus
      .filter(c => c.status === 'pending' || c.status === 'overdue')
      .reduce((sum, c) => sum + c.amount, 0),
    overdueCount: clientPaymentStatus.filter(c => c.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">財務状況</h1>
        <p className="text-[#7B8794]">売上・利益・入金状況の管理</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">月間売上（11月）</div>
          <div className="text-[#1F2933] text-3xl mb-1">¥28.5M</div>
          <div className="text-[#0C8A5F] text-sm">+17% vs 先月</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">月間利益（11月）</div>
          <div className="text-[#1F2933] text-3xl mb-1">¥11.7M</div>
          <div className="text-[#0C8A5F] text-sm">利益率: {stats.profitMargin}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">未入金額</div>
          <div className="text-[#D97706] text-3xl mb-1">¥{(stats.outstandingPayments / 1000000).toFixed(1)}M</div>
          <div className="text-[#7B8794] text-sm">2件の請求中</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-[#DC2626]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">期限超過</div>
          <div className="text-[#DC2626] text-3xl mb-1">{stats.overdueCount}件</div>
          <div className="text-[#7B8794] text-sm">早急な対応が必要</div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">売上・利益推移</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#7B8794" />
            <YAxis stroke="#7B8794" />
            <Tooltip 
              formatter={(value: number) => `¥${(value / 1000000).toFixed(1)}M`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#0C8A5F" name="売上" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="#7B8794" name="経費" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#4F46E5" name="利益" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">売上内訳（11月）</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={revenueBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `¥${(value / 1000000).toFixed(1)}M`} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-6">
            {revenueBySource.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: source.color }}></div>
                  <span className="text-[#52606D] text-sm">{source.name}</span>
                </div>
                <span className="text-[#1F2933]">¥{(source.value / 1000000).toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">経費内訳（11月）</h3>
          </div>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#52606D] text-sm">{expense.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#7B8794] text-xs">{expense.percentage}%</span>
                    <span className="text-[#1F2933]">¥{(expense.amount / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7B8794] to-[#52606D] rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#F3F4F6]">
            <div className="flex items-center justify-between">
              <span className="text-[#1F2933]">経費合計</span>
              <span className="text-[#1F2933] text-xl">¥16.8M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="p-8 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">クライアント別入金状況</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left px-8 py-4 text-[#52606D] text-sm">クライアント</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">請求金額</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">支払期限</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {clientPaymentStatus.map((payment, index) => {
                const statusInfo = statusConfig[payment.status];
                const isOverdue = payment.status === 'overdue';

                return (
                  <tr
                    key={index}
                    className={`border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${
                      isOverdue ? 'bg-[#FEF2F2]' : index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="text-[#1F2933]">{payment.client}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933]">¥{payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`text-sm ${isOverdue ? 'text-[#DC2626]' : 'text-[#52606D]'}`}>
                        {payment.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-[#FAFBFC] border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div className="text-[#7B8794] text-sm">請求総額</div>
            <div className="text-[#1F2933] text-xl">
              ¥{clientPaymentStatus.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
