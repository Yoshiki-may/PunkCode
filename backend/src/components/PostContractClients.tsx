import { CheckCircle, Phone, Mail, MessageCircle, Calendar, TrendingUp, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

interface PostContractClient {
  id: string;
  company: string;
  contact: string;
  contractDate: string;
  contractValue: string;
  projectStatus: 'active' | 'completed' | 'on-hold';
  lastContact: string;
  contactChannel: 'email' | 'phone' | 'slack' | 'meeting';
  nextMeeting: string;
  satisfaction: number;
}

const statusConfig = {
  active: { label: '進行中', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  completed: { label: '完了', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  'on-hold': { label: '保留中', color: 'bg-[#FEF3C7] text-[#D97706]' },
};

const channelConfig = {
  email: { icon: Mail, label: 'メール' },
  phone: { icon: Phone, label: '電話' },
  slack: { icon: MessageCircle, label: 'Slack' },
  meeting: { icon: Calendar, label: '対面' },
};

export function PostContractClients() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [clients] = useState<PostContractClient[]>([
    {
      id: '1',
      company: 'デジタルフロンティア株式会社',
      contact: '伊藤大輔',
      contractDate: '2024/10/15',
      contractValue: '¥9,200,000',
      projectStatus: 'active',
      lastContact: '2024/12/08',
      contactChannel: 'slack',
      nextMeeting: '12/15 週次MTG',
      satisfaction: 5,
    },
    {
      id: '2',
      company: 'グローバルソリューションズ',
      contact: '山本真理',
      contractDate: '2024/09/20',
      contractValue: '¥12,500,000',
      projectStatus: 'active',
      lastContact: '2024/12/09',
      contactChannel: 'meeting',
      nextMeeting: '12/12 進捗報告',
      satisfaction: 4,
    },
    {
      id: '3',
      company: 'テックイノベーション',
      contact: '小林健二',
      contractDate: '2024/11/01',
      contractValue: '¥6,800,000',
      projectStatus: 'completed',
      lastContact: '2024/11/30',
      contactChannel: 'email',
      nextMeeting: '-',
      satisfaction: 5,
    },
    {
      id: '4',
      company: 'ビジネスハブ株式会社',
      contact: '加藤愛',
      contractDate: '2024/08/10',
      contractValue: '¥4,500,000',
      projectStatus: 'on-hold',
      lastContact: '2024/11/20',
      contactChannel: 'phone',
      nextMeeting: '調整中',
      satisfaction: 3,
    },
    {
      id: '5',
      company: 'クリエイティブワークス',
      contact: '吉田拓也',
      contractDate: '2024/10/25',
      contractValue: '¥8,300,000',
      projectStatus: 'active',
      lastContact: '2024/12/10',
      contactChannel: 'slack',
      nextMeeting: '12/13 デザインレビュー',
      satisfaction: 5,
    },
  ]);

  const filteredClients = selectedStatus === 'all'
    ? clients
    : clients.filter(c => c.projectStatus === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">契約後クライアント管理</h1>
          <p className="text-[#7B8794]">進行中案件と連絡履歴を管理</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-sm mb-1">総契約金額</div>
            <div className="text-[#1F2933] text-2xl">¥41,300,000</div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-sm mb-1">契約社数</div>
            <div className="text-[#1F2933] text-2xl">{clients.length} 社</div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">プロジェクトステータス</h3>
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
            const count = clients.filter(c => c.projectStatus === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`px-4 py-2 rounded-xl transition-all border ${
                  selectedStatus === key
                    ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                    : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
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
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">契約日</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">契約金額</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">ステータス</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">最終連絡</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">満足度</th>
                <th className="text-right px-8 py-4 text-[#52606D] text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => {
                const statusInfo = statusConfig[client.projectStatus];
                const channelInfo = channelConfig[client.contactChannel];
                const ChannelIcon = channelInfo.icon;
                return (
                  <tr
                    key={client.id}
                    className={`border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${
                      index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="text-[#1F2933] mb-1">{client.company}</div>
                      <div className="flex items-center gap-2 text-xs text-[#7B8794]">
                        <ChannelIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        {channelInfo.label}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D]">{client.contact}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#7B8794] text-sm">{client.contractDate}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933]">{client.contractValue}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#7B8794] text-sm mb-1">{client.lastContact}</div>
                      <div className="text-[#52606D] text-xs">{client.nextMeeting}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < client.satisfaction ? 'bg-[#0C8A5F]' : 'bg-[#E5E7EB]'
                            }`}
                          ></div>
                        ))}
                      </div>
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
