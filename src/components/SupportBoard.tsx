import { MessageCircle, AlertCircle, CheckCircle2, Clock, User, Tag, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  client: string;
  contact: string;
  subject: string;
  category: 'technical' | 'billing' | 'general' | 'urgent';
  status: 'new' | 'in-progress' | 'waiting' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: string;
  lastUpdate: string;
  responseTime: string;
}

const categoryConfig = {
  technical: { label: '技術サポート', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  billing: { label: '請求・契約', color: 'bg-[#FEF3C7] text-[#D97706]' },
  general: { label: '一般問い合わせ', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  urgent: { label: '緊急対応', color: 'bg-[#FEE2E2] text-[#DC2626]' },
};

const statusConfig = {
  new: { label: '新規', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  'in-progress': { label: '対応中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  waiting: { label: '顧客待ち', color: 'bg-[#F3F4F6] text-[#6B7280]' },
  resolved: { label: '解決済み', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
};

const priorityConfig = {
  high: { label: '高', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  medium: { label: '中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: '低', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
};

export function SupportBoard() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const tickets: SupportTicket[] = [
    {
      id: '1',
      ticketNumber: '#2024-1205',
      client: 'デジタルフロンティア',
      contact: '伊藤大輔',
      subject: '動画アップロードがエラーになる',
      category: 'technical',
      status: 'in-progress',
      priority: 'high',
      assignee: '山本サポート',
      createdAt: '2024/12/10 09:30',
      lastUpdate: '2024/12/10 11:45',
      responseTime: '2時間15分',
    },
    {
      id: '2',
      ticketNumber: '#2024-1206',
      client: 'グローバルソリューションズ',
      contact: '山本真理',
      subject: '請求書の再発行依頼',
      category: 'billing',
      status: 'waiting',
      priority: 'medium',
      assignee: '佐藤サポート',
      createdAt: '2024/12/09 14:20',
      lastUpdate: '2024/12/09 15:00',
      responseTime: '40分',
    },
    {
      id: '3',
      ticketNumber: '#2024-1207',
      client: 'クリエイティブワークス',
      contact: '吉田拓也',
      subject: '新機能の使い方について',
      category: 'general',
      status: 'resolved',
      priority: 'low',
      assignee: '田中サポート',
      createdAt: '2024/12/08 10:15',
      lastUpdate: '2024/12/08 16:30',
      responseTime: '6時間15分',
    },
    {
      id: '4',
      ticketNumber: '#2024-1208',
      client: 'テックイノベーション',
      contact: '小林健二',
      subject: 'サービスが利用できない【緊急】',
      category: 'urgent',
      status: 'in-progress',
      priority: 'high',
      assignee: '山本サポート',
      createdAt: '2024/12/10 13:00',
      lastUpdate: '2024/12/10 13:15',
      responseTime: '15分',
    },
    {
      id: '5',
      ticketNumber: '#2024-1209',
      client: 'マーケティングソリューションズ',
      contact: '田中美咲',
      subject: 'プラン変更の相談',
      category: 'billing',
      status: 'new',
      priority: 'medium',
      assignee: '未割当',
      createdAt: '2024/12/10 14:30',
      lastUpdate: '2024/12/10 14:30',
      responseTime: '未対応',
    },
  ];

  const filteredTickets = selectedStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]">
          <Plus className="w-5 h-5" strokeWidth={2} />
          新規チケット作成
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">新規チケット</div>
          <div className="text-[#1F2933] text-3xl">{tickets.filter(t => t.status === 'new').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">対応中</div>
          <div className="text-[#1F2933] text-3xl">{tickets.filter(t => t.status === 'in-progress').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">顧客待ち</div>
          <div className="text-[#1F2933] text-3xl">{tickets.filter(t => t.status === 'waiting').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">解決済み</div>
          <div className="text-[#1F2933] text-3xl">{tickets.filter(t => t.status === 'resolved').length}</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">ステータスフィルター</h3>
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
            すべて ({tickets.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = tickets.filter(t => t.status === key).length;
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

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left px-8 py-4 text-[#52606D] text-sm">チケット番号</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">件名</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">顧客</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">カテゴリ</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">ステータス</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">優先度</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">担当者</th>
                <th className="text-left px-6 py-4 text-[#52606D] text-sm">対応時間</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => {
                const categoryInfo = categoryConfig[ticket.category];
                const statusInfo = statusConfig[ticket.status];
                const priorityInfo = priorityConfig[ticket.priority];
                const isUrgent = ticket.category === 'urgent';

                return (
                  <tr
                    key={ticket.id}
                    className={`border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors ${
                      index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                    } ${isUrgent ? 'border-l-4 border-l-[#DC2626]' : ''}`}
                  >
                    <td className="px-8 py-5">
                      <div className="text-[#1F2933] mb-1">{ticket.ticketNumber}</div>
                      <div className="text-[#7B8794] text-xs">{ticket.createdAt}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933] mb-1">{ticket.subject}</div>
                      {isUrgent && (
                        <div className="flex items-center gap-1 text-[#DC2626] text-xs">
                          <AlertCircle className="w-3 h-3" strokeWidth={2} />
                          緊急対応
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#1F2933]">{ticket.client}</div>
                      <div className="text-[#7B8794] text-sm">{ticket.contact}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#52606D]">{ticket.assignee}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[#7B8794] text-sm">
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        {ticket.responseTime}
                      </div>
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