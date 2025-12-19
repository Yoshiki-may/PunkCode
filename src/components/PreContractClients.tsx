import { Phone, Calendar, Search, FileText, MessageSquare, FileCheck, Plus, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

interface Client {
  id: string;
  company: string;
  contact: string;
  status: 'telemarketing' | 'appointment-confirmed' | 'research' | 'meeting-notes' | 'chatbot' | 'proposal';
  lastContact: string;
  estimatedValue: string;
  nextAction: string;
}

const statusConfig = {
  telemarketing: { label: 'テレアポ', icon: Phone, color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  'appointment-confirmed': { label: 'アポ確定', icon: Calendar, color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  research: { label: '企業リサーチ', icon: Search, color: 'bg-[#FEF3C7] text-[#D97706]' },
  'meeting-notes': { label: '議事録', icon: FileText, color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  chatbot: { label: 'ヒアリングBot', icon: MessageSquare, color: 'bg-[#FED7E2] text-[#DB2777]' },
  proposal: { label: '提案資料作成', icon: FileCheck, color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
};

export function PreContractClients() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [clients] = useState<Client[]>([
    {
      id: '1',
      company: '株式会社サンプル商事',
      contact: '山田太郎',
      status: 'telemarketing',
      lastContact: '2024/12/09',
      estimatedValue: '¥3,200,000',
      nextAction: '12/12 再架電',
    },
    {
      id: '2',
      company: 'グローバルエンタープライズ',
      contact: '佐藤花子',
      status: 'appointment-confirmed',
      lastContact: '2024/12/08',
      estimatedValue: '¥8,500,000',
      nextAction: '12/11 訪問',
    },
    {
      id: '3',
      company: 'テック・インダストリーズ',
      contact: '鈴木一郎',
      status: 'research',
      lastContact: '2024/12/07',
      estimatedValue: '¥1,500,000',
      nextAction: '12/13 リサーチ完了予定',
    },
    {
      id: '4',
      company: 'マーケティングソリューションズ',
      contact: '田中美咲',
      status: 'meeting-notes',
      lastContact: '2024/12/10',
      estimatedValue: '¥4,200,000',
      nextAction: '12/11 議事録共有',
    },
    {
      id: '5',
      company: 'イノベーション株式会社',
      contact: '高橋健太',
      status: 'chatbot',
      lastContact: '2024/12/09',
      estimatedValue: '¥5,500,000',
      nextAction: '12/14 ヒアリング実施',
    },
    {
      id: '6',
      company: '株式会社ビジネスパートナー',
      contact: '中村優子',
      status: 'proposal',
      lastContact: '2024/12/08',
      estimatedValue: '¥2,800,000',
      nextAction: '12/15 提案書送付',
    },
  ]);

  const filteredClients = selectedStatus === 'all' 
    ? clients 
    : clients.filter(c => c.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">契約前クライアント管理</h1>
          <p className="text-[#7B8794]">営業プロセスの各ステージを管理</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]">
          <Plus className="w-5 h-5" strokeWidth={2} />
          新規クライアント追加
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">ステージフィルター</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl transition-all border ${
              selectedStatus === 'all'
                ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            すべて ({clients.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = clients.filter(c => c.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                  selectedStatus === key
                    ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                    : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left px-8 py-4 text-[#52606D] text-sm">企業名</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">担当者</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">ステージ</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">最終接触</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">見込み額</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">次のアクション</th>
                <th className="text-right px-8 py-4 text-[#52606D] text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => {
                const statusInfo = statusConfig[client.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <tr
                    key={client.id}
                    className={`border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${
                      index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="text-[#1F2933]">{client.company}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D]">{client.contact}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" strokeWidth={2} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#7B8794] text-sm">{client.lastContact}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933]">{client.estimatedValue}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D] text-sm">{client.nextAction}</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-[#0C8A5F] hover:bg-[#C5F3E5] rounded-xl transition-all">
                        詳細
                        <ChevronRight className="w-4 h-4" strokeWidth={2} />
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
