import { Calendar, Clock, User, Users, Video, Phone, Mail, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ScheduleEvent {
  id: string;
  type: 'appointment' | 'post' | 'meeting' | 'deadline';
  title: string;
  client?: string;
  assignee: string;
  time: string;
  date: string;
  channel?: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'upcoming' | 'in-progress' | 'completed';
}

const typeConfig = {
  appointment: { label: 'アポイントメント', icon: Calendar, color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  post: { label: 'SNS投稿', icon: Share2, color: 'bg-[#FED7E2] text-[#DB2777]' },
  meeting: { label: 'ミーティング', icon: Video, color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  deadline: { label: '納期', icon: Clock, color: 'bg-[#FEF3C7] text-[#D97706]' },
};

export function Schedule() {
  const [viewMode, setViewMode] = useState<'personal' | 'organization'>('personal');
  const [currentDate] = useState(new Date());

  const personalEvents: ScheduleEvent[] = [
    {
      id: '1',
      type: 'appointment',
      title: '初回訪問',
      client: '株式会社サンプル商事',
      assignee: 'REONA',
      time: '10:00',
      date: '2024/12/12',
      status: 'upcoming',
    },
    {
      id: '2',
      type: 'post',
      title: 'Instagram投稿',
      client: 'デジタルフロンティア',
      assignee: 'REONA',
      time: '12:00',
      date: '2024/12/12',
      channel: 'instagram',
      status: 'upcoming',
    },
    {
      id: '3',
      type: 'meeting',
      title: '週次ミーティング',
      client: 'グローバルソリューションズ',
      assignee: 'REONA',
      time: '14:00',
      date: '2024/12/12',
      status: 'upcoming',
    },
    {
      id: '4',
      type: 'post',
      title: 'Facebook投稿',
      client: 'クリエイティブワークス',
      assignee: 'REONA',
      time: '18:00',
      date: '2024/12/13',
      channel: 'facebook',
      status: 'upcoming',
    },
    {
      id: '5',
      type: 'deadline',
      title: '提案資料提出',
      client: 'マーケティングソリューションズ',
      assignee: 'REONA',
      time: '17:00',
      date: '2024/12/15',
      status: 'upcoming',
    },
  ];

  const organizationEvents: ScheduleEvent[] = [
    ...personalEvents,
    {
      id: '6',
      type: 'appointment',
      title: 'デモ実施',
      client: 'テックイノベーション',
      assignee: '佐藤営業',
      time: '11:00',
      date: '2024/12/12',
      status: 'upcoming',
    },
    {
      id: '7',
      type: 'meeting',
      title: 'デザインレビュー',
      client: 'ビジネスハブ株式会社',
      assignee: '山田ディレクター',
      time: '13:00',
      date: '2024/12/12',
      status: 'upcoming',
    },
    {
      id: '8',
      type: 'post',
      title: 'LinkedIn投稿',
      client: 'グローバルエンタープライズ',
      assignee: '田中編集',
      time: '15:00',
      date: '2024/12/12',
      channel: 'linkedin',
      status: 'upcoming',
    },
    {
      id: '9',
      type: 'deadline',
      title: '動画納品',
      client: 'デジタルフロンティア',
      assignee: '鈴木ディレクター',
      time: '16:00',
      date: '2024/12/13',
      status: 'upcoming',
    },
  ];

  const events = viewMode === 'personal' ? personalEvents : organizationEvents;

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">スケジュール</h1>
          <p className="text-[#7B8794]">アポイントメントと投稿予定の管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#F9FAFB] rounded-xl transition-all border border-[#E5E7EB]">
            <ChevronLeft className="w-5 h-5 text-[#52606D]" strokeWidth={2} />
          </button>
          <div className="text-[#1F2933]">
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </div>
          <button className="p-2 hover:bg-[#F9FAFB] rounded-xl transition-all border border-[#E5E7EB]">
            <ChevronRight className="w-5 h-5 text-[#52606D]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2 inline-flex shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <button
          onClick={() => setViewMode('personal')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            viewMode === 'personal'
              ? 'bg-[#0C8A5F] text-white'
              : 'text-[#52606D] hover:bg-[#F9FAFB]'
          }`}
        >
          <User className="w-4 h-4" strokeWidth={2} />
          個人スケジュール
        </button>
        <button
          onClick={() => setViewMode('organization')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            viewMode === 'organization'
              ? 'bg-[#0C8A5F] text-white'
              : 'text-[#52606D] hover:bg-[#F9FAFB]'
          }`}
        >
          <Users className="w-4 h-4" strokeWidth={2} />
          組織全体
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">今日の予定</div>
          <div className="text-[#1F2933] text-3xl">
            {events.filter(e => e.date === '2024/12/12').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">アポイントメント</div>
          <div className="text-[#1F2933] text-3xl">
            {events.filter(e => e.type === 'appointment').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">SNS投稿予定</div>
          <div className="text-[#1F2933] text-3xl">
            {events.filter(e => e.type === 'post').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">納期・締切</div>
          <div className="text-[#1F2933] text-3xl">
            {events.filter(e => e.type === 'deadline').length}
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="bg-[#FAFBFC] px-8 py-4 border-b border-[#E5E7EB] rounded-t-2xl">
              <h3 className="text-[#1F2933]">{date}</h3>
            </div>
            <div className="p-6 space-y-4">
              {dateEvents
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((event) => {
                  const typeInfo = typeConfig[event.type];
                  const TypeIcon = typeInfo.icon;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-6 p-5 bg-[#FAFBFC] rounded-xl hover:bg-[#F9FAFB] transition-all border border-[#F3F4F6]"
                    >
                      <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-[#1F2933]">{event.time}</span>
                        </div>
                        <h3 className="text-[#1F2933] mb-1">{event.title}</h3>
                        {event.client && (
                          <div className="text-[#7B8794] text-sm">{event.client}</div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[#52606D] text-sm mb-1">担当</div>
                        <div className="text-[#1F2933]">{event.assignee}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
