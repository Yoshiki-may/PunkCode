import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface Shoot {
  id: string;
  projectName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'done';
}

export function ShootCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11)); // December 2024

  const shoots: Shoot[] = [
    {
      id: '1',
      projectName: '採用ブランディング動画',
      clientName: 'デジタルフロンティア株式会社',
      date: '2024-12-10',
      startTime: '10:00',
      endTime: '15:00',
      location: '渋谷オフィス',
      status: 'confirmed',
    },
    {
      id: '2',
      projectName: '12月キャンペーン動画',
      clientName: 'クリエイティブワークス',
      date: '2024-12-12',
      startTime: '09:00',
      endTime: '13:00',
      location: '代官山スタジオA',
      status: 'scheduled',
    },
    {
      id: '3',
      projectName: '店舗紹介動画',
      clientName: 'グローバルソリューションズ',
      date: '2024-12-14',
      startTime: '14:00',
      endTime: '18:00',
      location: '表参道店舗',
      status: 'scheduled',
    },
    {
      id: '4',
      projectName: 'プロモーション動画',
      clientName: 'テックイノベーション',
      date: '2024-12-16',
      startTime: '11:00',
      endTime: '16:00',
      location: '品川オフィス',
      status: 'scheduled',
    },
    {
      id: '5',
      projectName: '製品紹介動画',
      clientName: 'マーケティングソリューションズ',
      date: '2024-12-18',
      startTime: '13:00',
      endTime: '17:00',
      location: '新宿スタジオ',
      status: 'scheduled',
    },
    {
      id: '6',
      projectName: 'イベント撮影',
      clientName: 'グローバルソリューションズ',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '18:00',
      location: '六本木ヒルズ',
      status: 'confirmed',
    },
    {
      id: '7',
      projectName: '年末挨拶動画',
      clientName: 'デジタルフロンティア株式会社',
      date: '2024-12-24',
      startTime: '14:00',
      endTime: '16:00',
      location: '渋谷オフィス',
      status: 'scheduled',
    },
  ];

  const statusConfig = {
    scheduled: { label: '予定', color: 'bg-[#E5E7EB]', textColor: 'text-[#52606D]' },
    confirmed: { label: '確定', color: 'bg-[#0C8A5F]', textColor: 'text-white' },
    'in-progress': { label: '撮影中', color: 'bg-[#D97706]', textColor: 'text-white' },
    done: { label: '完了', color: 'bg-[#4F46E5]', textColor: 'text-white' },
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek };
  };

  const getShootsForDate = (date: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return shoots.filter(shoot => shoot.date === dateStr);
  };

  const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">撮影カレンダー</h1>
        <p className="text-[#7B8794]">月間撮影スケジュール</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">今月の撮影</div>
          <div className="text-[#1F2933] text-3xl mb-1">{shoots.length}</div>
          <div className="text-[#52606D] text-sm">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">確定済み</div>
          <div className="text-[#0C8A5F] text-3xl mb-1">
            {shoots.filter(s => s.status === 'confirmed').length}
          </div>
          <div className="text-[#52606D] text-sm">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">予定</div>
          <div className="text-[#7B8794] text-3xl mb-1">
            {shoots.filter(s => s.status === 'scheduled').length}
          </div>
          <div className="text-[#52606D] text-sm">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">撮影時間</div>
          <div className="text-[#4F46E5] text-3xl mb-1">48</div>
          <div className="text-[#52606D] text-sm">時間</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        {/* Calendar Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h2 className="text-[#1F2933] text-xl">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center py-2 text-sm ${
                  index === 0 ? 'text-[#DC2626]' : index === 6 ? 'text-[#4F46E5]' : 'text-[#7B8794]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const daysShoots = getShootsForDate(day);
              const isToday = day === 10; // December 10, 2024

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-xl p-2 transition-all ${
                    isToday
                      ? 'border-[#0C8A5F] bg-[#C5F3E5]/20'
                      : daysShoots.length > 0
                        ? 'border-[#E5E7EB] hover:border-[#0C8A5F] hover:bg-[#F9FAFB] cursor-pointer'
                        : 'border-[#F3F4F6]'
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div
                      className={`text-sm mb-1 ${
                        isToday
                          ? 'text-[#0C8A5F]'
                          : index % 7 === 0
                            ? 'text-[#DC2626]'
                            : index % 7 === 6
                              ? 'text-[#4F46E5]'
                              : 'text-[#52606D]'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="flex-1 space-y-1">
                      {daysShoots.slice(0, 2).map((shoot) => {
                        const statusInfo = statusConfig[shoot.status];
                        return (
                          <div
                            key={shoot.id}
                            className={`px-1.5 py-0.5 rounded text-xs truncate ${statusInfo.color} ${statusInfo.textColor}`}
                            title={shoot.projectName}
                          >
                            {shoot.startTime} {shoot.projectName}
                          </div>
                        );
                      })}
                      {daysShoots.length > 2 && (
                        <div className="text-xs text-[#9CA3AF] px-1.5">
                          +{daysShoots.length - 2}件
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Shoots List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">今月の撮影一覧</h3>
          </div>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {shoots.map((shoot) => {
            const statusInfo = statusConfig[shoot.status];
            const date = new Date(shoot.date);
            const dateStr = date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });

            return (
              <div
                key={shoot.id}
                className="p-6 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-[#1F2933] mb-1">{shoot.projectName}</h4>
                    <p className="text-[#7B8794] text-sm">{shoot.clientName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color} ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-[#52606D]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <span>{shoot.startTime} - {shoot.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <span>{shoot.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
