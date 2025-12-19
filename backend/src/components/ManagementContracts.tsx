import { FileText, Download, Search, Filter, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Contract {
  id: string;
  client: string;
  contractType: string;
  value: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring-soon' | 'expired' | 'pending';
  renewalDate?: string;
  assignedTo: string;
}

export function ManagementContracts() {
  const [searchQuery, setSearchQuery] = useState('');

  const contracts: Contract[] = [
    {
      id: '1',
      client: 'デジタルフロンティア株式会社',
      contractType: '年間契約',
      value: '¥12,000,000',
      startDate: '2024/01/15',
      endDate: '2025/01/14',
      status: 'active',
      renewalDate: '2024/12/15',
      assignedTo: 'REONA',
    },
    {
      id: '2',
      client: 'グローバルソリューションズ',
      contractType: '単発契約',
      value: '¥3,500,000',
      startDate: '2024/10/01',
      endDate: '2024/12/31',
      status: 'expiring-soon',
      assignedTo: '佐藤営業',
    },
    {
      id: '3',
      client: 'テックイノベーション',
      contractType: '年間契約',
      value: '¥18,000,000',
      startDate: '2023/06/01',
      endDate: '2024/05/31',
      status: 'expired',
      renewalDate: '2024/04/01',
      assignedTo: '山田営業',
    },
    {
      id: '4',
      client: 'クリエイティブワークス',
      contractType: '半期契約',
      value: '¥6,000,000',
      startDate: '2024/07/01',
      endDate: '2024/12/31',
      status: 'active',
      assignedTo: '田中営業',
    },
    {
      id: '5',
      client: 'マーケティングソリューションズ',
      contractType: '単発契約',
      value: '¥2,800,000',
      startDate: '2024/11/01',
      endDate: '2025/01/31',
      status: 'pending',
      assignedTo: 'REONA',
    },
  ];

  const statusConfig = {
    active: { label: '有効', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
    'expiring-soon': { label: '更新間近', color: 'bg-[#FEF3C7] text-[#D97706]', icon: AlertCircle },
    expired: { label: '期限切れ', color: 'bg-[#FEE2E2] text-[#DC2626]', icon: AlertCircle },
    pending: { label: '承認待ち', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: AlertCircle },
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring-soon').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    totalValue: contracts.reduce((sum, c) => {
      const value = parseInt(c.value.replace(/[¥,]/g, ''));
      return sum + value;
    }, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">契約書管理</h1>
          <p className="text-[#7B8794]">全クライアントの契約状況を一元管理</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">総契約数</div>
          <div className="text-[#1F2933] text-3xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">有効契約</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.active}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">更新間近</div>
          <div className="text-[#D97706] text-3xl">{stats.expiring}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">承認待ち</div>
          <div className="text-[#4F46E5] text-3xl">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">契約総額</div>
          <div className="text-[#1F2933] text-2xl">¥{(stats.totalValue / 1000000).toFixed(1)}M</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                placeholder="クライアント名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl hover:bg-[#F3F4F6] transition-all">
            <Filter className="w-5 h-5 text-[#52606D]" strokeWidth={2} />
            フィルター
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left px-8 py-4 text-[#52606D] text-sm">クライアント</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">契約種別</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">契約金額</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">契約期間</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">ステータス</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">担当者</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">アクション</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => {
                const statusInfo = statusConfig[contract.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <tr
                    key={contract.id}
                    className={`border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${
                      index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="text-[#1F2933]">{contract.client}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D]">{contract.contractType}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933]">{contract.value}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D] text-sm">
                        <div>{contract.startDate}</div>
                        <div>〜 {contract.endDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" strokeWidth={2} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D]">{contract.assignedTo}</div>
                    </td>
                    <td className="px-6 py-5">
                      <button className="flex items-center gap-2 px-4 py-2 text-[#0C8A5F] hover:bg-[#C5F3E5] rounded-xl transition-all">
                        <Download className="w-4 h-4" strokeWidth={2} />
                        <span className="text-sm">DL</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
