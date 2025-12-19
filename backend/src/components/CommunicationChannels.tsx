import { Mail, Phone, MessageCircle, Video, Send, Clock } from 'lucide-react';

interface Communication {
  id: string;
  type: 'email' | 'phone' | 'slack' | 'teams';
  client: string;
  contact: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'received' | 'missed' | 'scheduled';
}

const channelConfig = {
  email: { icon: Mail, label: 'メール', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  phone: { icon: Phone, label: '電話', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  slack: { icon: MessageCircle, label: 'Slack', color: 'bg-[#FED7E2] text-[#DB2777]' },
  teams: { icon: Video, label: 'Teams', color: 'bg-[#FEF3C7] text-[#D97706]' },
};

const statusConfig = {
  sent: { label: '送信済', color: 'text-[#0C8A5F]' },
  received: { label: '受信', color: 'text-[#4F46E5]' },
  missed: { label: '不在着信', color: 'text-[#DC2626]' },
  scheduled: { label: '予定', color: 'text-[#D97706]' },
};

export function CommunicationChannels() {
  const recentCommunications: Communication[] = [
    {
      id: '1',
      type: 'email',
      client: 'デジタルフロンティア',
      contact: '伊藤大輔',
      subject: '進捗報告書の送付',
      timestamp: '2024/12/10 14:30',
      status: 'sent',
    },
    {
      id: '2',
      type: 'slack',
      client: 'クリエイティブワークス',
      contact: '吉田拓也',
      subject: 'デザイン修正の確認',
      timestamp: '2024/12/10 11:20',
      status: 'received',
    },
    {
      id: '3',
      type: 'phone',
      client: '株式会社サンプル商事',
      contact: '山田太郎',
      subject: '初回ヒアリング',
      timestamp: '2024/12/09 16:00',
      status: 'missed',
    },
    {
      id: '4',
      type: 'teams',
      client: 'グローバルソリューションズ',
      contact: '山本真理',
      subject: '週次ミーティング',
      timestamp: '2024/12/12 10:00',
      status: 'scheduled',
    },
    {
      id: '5',
      type: 'email',
      client: 'マーケティングソリューションズ',
      contact: '田中美咲',
      subject: '提案書のフォローアップ',
      timestamp: '2024/12/08 09:45',
      status: 'sent',
    },
  ];

  const channelStats = [
    { type: 'email', count: 42, label: 'メール' },
    { type: 'phone', count: 28, label: '電話' },
    { type: 'slack', count: 156, label: 'Slack' },
    { type: 'teams', count: 18, label: 'Teams' },
  ];

  return (
    <div className="space-y-6">
      {/* Channel Stats */}
      <div className="grid grid-cols-4 gap-6">
        {channelStats.map((stat) => {
          const config = channelConfig[stat.type as keyof typeof channelConfig];
          const Icon = config.icon;
          return (
            <div
              key={stat.type}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="text-[#7B8794] text-sm mb-2">{stat.label}</div>
              <div className="text-[#1F2933] text-3xl">{stat.count}</div>
              <div className="text-[#7B8794] text-xs mt-1">今月の連絡数</div>
            </div>
          );
        })}
      </div>

      {/* Recent Communications */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1F2933]">最近の連絡履歴</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-[#0C8A5F] hover:bg-[#C5F3E5] rounded-xl transition-all">
            <Send className="w-4 h-4" strokeWidth={2} />
            新規連絡
          </button>
        </div>

        <div className="space-y-1">
          {recentCommunications.map((comm, index) => {
            const channelInfo = channelConfig[comm.type];
            const statusInfo = statusConfig[comm.status];
            const ChannelIcon = channelInfo.icon;
            return (
              <div
                key={comm.id}
                className={`flex items-center gap-6 px-6 py-4 rounded-xl hover:bg-[#F9FAFB] transition-all ${
                  index % 2 === 0 ? '' : 'bg-[#FAFBFC]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${channelInfo.color} flex items-center justify-center flex-shrink-0`}>
                  <ChannelIcon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#1F2933]">{comm.client}</span>
                    <span className="text-[#7B8794] text-sm">/ {comm.contact}</span>
                  </div>
                  <div className="text-[#52606D] text-sm">{comm.subject}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2 text-[#7B8794] text-sm">
                    <Clock className="w-4 h-4" strokeWidth={2} />
                    {comm.timestamp}
                  </div>
                  <span className={`text-sm ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-4">未対応の連絡</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl">
              <div>
                <div className="text-[#DC2626] mb-1">不在着信</div>
                <div className="text-[#52606D] text-sm">株式会社サンプル商事</div>
              </div>
              <button className="px-4 py-2 bg-[#DC2626] text-white rounded-xl hover:bg-[#B91C1C] transition-all">
                折り返し
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
              <div>
                <div className="text-[#D97706] mb-1">メール返信待ち</div>
                <div className="text-[#52606D] text-sm">2件のメールが未返信</div>
              </div>
              <button className="px-4 py-2 bg-[#D97706] text-white rounded-xl hover:bg-[#B45309] transition-all">
                確認
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-4">今日の予定</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl">
              <div className={`w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center`}>
                <Video className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2933] mb-1">10:00 週次ミーティング</div>
                <div className="text-[#7B8794] text-sm">グローバルソリューションズ</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl">
              <div className={`w-10 h-10 rounded-xl bg-[#C5F3E5] text-[#0C8A5F] flex items-center justify-center`}>
                <Phone className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2933] mb-1">14:00 テレアポ</div>
                <div className="text-[#7B8794] text-sm">株式会社サンプル商事</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
