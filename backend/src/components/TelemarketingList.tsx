import { Phone, Clock, TrendingUp, AlertCircle, CheckCircle2, XCircle, Calendar, Plus, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface TelemarketingCall {
  id: string;
  company: string;
  contact: string;
  phoneNumber: string;
  callDate: string;
  callTime: string;
  duration: string;
  status: 'success' | 'callback' | 'rejected' | 'no-answer' | 'interested';
  response: string;
  rejectionReason?: string;
  leadOpportunity: 'high' | 'medium' | 'low';
  nextAction: string;
  notes: string;
}

const statusConfig = {
  success: { label: 'アポ獲得', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
  callback: { label: '折り返し待ち', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: Phone },
  rejected: { label: '断られた', color: 'bg-[#FEE2E2] text-[#DC2626]', icon: XCircle },
  'no-answer': { label: '不在', color: 'bg-[#F3F4F6] text-[#6B7280]', icon: AlertCircle },
  interested: { label: '興味あり', color: 'bg-[#FEF3C7] text-[#D97706]', icon: TrendingUp },
};

const leadOpportunityConfig = {
  high: { label: '高', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  medium: { label: '中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: '低', color: 'bg-[#F3F4F6] text-[#6B7280]' },
};

export function TelemarketingList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const calls: TelemarketingCall[] = [
    {
      id: '1',
      company: '株式会社サンプル商事',
      contact: '山田太郎（営業部長）',
      phoneNumber: '03-1234-5678',
      callDate: '2024/12/10',
      callTime: '14:30',
      duration: '8分',
      status: 'interested',
      response: '動画制作に興味がある。来週詳しく話を聞きたい。',
      leadOpportunity: 'high',
      nextAction: '12/15 再架電してアポ調整',
      notes: '採用動画の制作を検討中。予算は300-500万円程度を想定している様子。',
    },
    {
      id: '2',
      company: 'テクノロジー株式会社',
      contact: '佐藤花子（マーケティング担当）',
      phoneNumber: '03-2345-6789',
      callDate: '2024/12/09',
      callTime: '10:15',
      duration: '12分',
      status: 'success',
      response: 'ぜひ一度お会いしたい。具体的な事例を見せてほしい。',
      leadOpportunity: 'high',
      nextAction: '12/13 14:00 訪問予定',
      notes: 'プロモーション動画を検討。競合他社の事例に興味を持っている。SNSでの展開も視野に入れている。',
    },
    {
      id: '3',
      company: 'グローバル商事',
      contact: '鈴木一郎（総務部）',
      phoneNumber: '03-3456-7890',
      callDate: '2024/12/08',
      callTime: '16:00',
      duration: '3分',
      status: 'rejected',
      response: '現在は必要ない。',
      rejectionReason: '予算確保が難しい。既に他社と契約している。',
      leadOpportunity: 'low',
      nextAction: '3ヶ月後に再アプローチ',
      notes: '予算年度が4月スタート。次期予算で検討の可能性あり。',
    },
    {
      id: '4',
      company: 'マーケティングハブ',
      contact: '田中美咲（代表）',
      phoneNumber: '03-4567-8901',
      callDate: '2024/12/09',
      callTime: '11:00',
      duration: '15分',
      status: 'callback',
      response: '興味深い。ただし今週は忙しいので来週改めて連絡がほしい。',
      leadOpportunity: 'medium',
      nextAction: '12/16 午前中に再架電',
      notes: 'ブランディング動画に関心あり。事例とポートフォリオの送付を依頼された。',
    },
    {
      id: '5',
      company: 'イノベーション企業',
      contact: '高橋健太（営業企画）',
      phoneNumber: '03-5678-9012',
      callDate: '2024/12/10',
      callTime: '09:30',
      duration: '-',
      status: 'no-answer',
      response: '不在のため留守電にメッセージを残した。',
      leadOpportunity: 'medium',
      nextAction: '12/11 15:00 再架電',
      notes: '受付の方から「営業企画の高橋は午後に戻る」との情報あり。',
    },
    {
      id: '6',
      company: 'デジタルエージェンシー',
      contact: '中村優子（クリエイティブディレクター）',
      phoneNumber: '03-6789-0123',
      callDate: '2024/12/07',
      callTime: '13:45',
      duration: '5分',
      status: 'rejected',
      response: '内製で対応している。',
      rejectionReason: '社内に動画制作チームがあり、外注の必要性を感じていない。',
      leadOpportunity: 'low',
      nextAction: '半年後にフォローアップ',
      notes: '内製チームの規模によっては大型案件で外注の可能性あり。',
    },
  ];

  const filteredCalls = calls.filter(call => {
    const matchesStatus = selectedStatus === 'all' || call.status === selectedStatus;
    const matchesSearch = !searchQuery || 
      call.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: calls.length,
    success: calls.filter(c => c.status === 'success').length,
    interested: calls.filter(c => c.status === 'interested').length,
    rejected: calls.filter(c => c.status === 'rejected').length,
    callback: calls.filter(c => c.status === 'callback').length,
    highLead: calls.filter(c => c.leadOpportunity === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">テレアポリスト</h1>
          <p className="text-[#7B8794]">テレマーケティング履歴とリード機会の管理</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]">
          <Plus className="w-5 h-5" strokeWidth={2} />
          新規架電記録
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">総架電数</div>
          <div className="text-[#1F2933] text-3xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">アポ獲得</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.success}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">興味あり</div>
          <div className="text-[#D97706] text-3xl">{stats.interested}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">折り返し</div>
          <div className="text-[#4F46E5] text-3xl">{stats.callback}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">断られた</div>
          <div className="text-[#DC2626] text-3xl">{stats.rejected}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">高リード</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.highLead}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                placeholder="企業名・担当者名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-xl transition-all border ${
                  selectedStatus === 'all'
                    ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                    : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                すべて
              </button>
              {Object.entries(statusConfig).map(([key, config]) => {
                const Icon = config.icon;
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
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => {
          const statusInfo = statusConfig[call.status];
          const leadInfo = leadOpportunityConfig[call.leadOpportunity];
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={call.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all"
            >
              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 rounded-xl ${statusInfo.color} flex items-center justify-center flex-shrink-0`}>
                  <StatusIcon className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[#1F2933]">{call.company}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${leadInfo.color}`}>
                      リード: {leadInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#7B8794] mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" strokeWidth={2} />
                      {call.contact}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      {call.callDate} {call.callTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" strokeWidth={2} />
                      {call.duration}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-[#FAFBFC] rounded-xl">
                      <div className="text-[#7B8794] text-sm mb-2">反応・対応内容</div>
                      <div className="text-[#52606D]">{call.response}</div>
                    </div>
                    {call.rejectionReason && (
                      <div className="p-4 bg-[#FEF2F2] rounded-xl border border-[#FEE2E2]">
                        <div className="text-[#DC2626] text-sm mb-2">断り理由</div>
                        <div className="text-[#52606D]">{call.rejectionReason}</div>
                      </div>
                    )}
                    {!call.rejectionReason && (
                      <div className="p-4 bg-[#C5F3E5] rounded-xl border border-[#9FE8D1]">
                        <div className="text-[#0C8A5F] text-sm mb-2">次のアクション</div>
                        <div className="text-[#52606D]">{call.nextAction}</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
                    <div className="text-[#7B8794] text-sm mb-2">メモ・追加情報</div>
                    <div className="text-[#52606D]">{call.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
