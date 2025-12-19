import { Calendar as CalendarIcon, Clock, User, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  assignee?: string;
  type: 'mine' | 'team';
  color: string;
}

interface ScheduleBoardProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewType: 'day' | 'week' | 'month' | 'year';
  onViewTypeChange: (viewType: 'day' | 'week' | 'month' | 'year') => void;
}

export function ScheduleBoard({
  selectedDate,
  onDateChange,
  viewType,
  onViewTypeChange
}: ScheduleBoardProps) {
  // Sample events data with more realistic scheduling
  const events: CalendarEvent[] = [
    // Dec 14 (Saturday)
    {
      id: '1',
      title: 'デジタルフロンティア社 撮影',
      date: '2025-12-14',
      startTime: '10:00',
      endTime: '15:00',
      location: '渋谷オフィス',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    // Dec 15 (Monday) - Current week start
    {
      id: '2',
      title: 'AXAS社 提案資料最終確認',
      date: '2025-12-15',
      startTime: '14:00',
      endTime: '15:00',
      assignee: '田中太郎',
      type: 'team',
      color: 'bg-purple-500',
    },
    // Dec 16 (Tuesday)
    {
      id: '3',
      title: 'クリエイティブワークス撮影',
      date: '2025-12-16',
      startTime: '09:00',
      endTime: '13:00',
      location: '代官山スタジオ',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    {
      id: '4',
      title: 'チームミーティング',
      date: '2025-12-16',
      startTime: '14:00',
      endTime: '15:00',
      assignee: '佐藤花子',
      type: 'team',
      color: 'bg-purple-500',
    },
    // Dec 17 (Wednesday)
    {
      id: '5',
      title: '午前ミーティング',
      date: '2025-12-17',
      startTime: '10:00',
      endTime: '11:30',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    {
      id: '6',
      title: 'プロジェクトレビュー',
      date: '2025-12-17',
      startTime: '13:00',
      endTime: '14:00',
      assignee: '鈴木一郎',
      type: 'team',
      color: 'bg-purple-500',
    },
    {
      id: '7',
      title: 'クライアント打ち合わせ',
      date: '2025-12-17',
      startTime: '15:00',
      endTime: '16:30',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    // Dec 18 (Thursday)
    {
      id: '8',
      title: '編集レビュー会議',
      date: '2025-12-18',
      startTime: '11:00',
      endTime: '12:00',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    {
      id: '9',
      title: 'SNS投稿確認',
      date: '2025-12-18',
      startTime: '14:00',
      endTime: '15:00',
      assignee: '山田次郎',
      type: 'team',
      color: 'bg-purple-500',
    },
    {
      id: '10',
      title: '週次進捗報告',
      date: '2025-12-18',
      startTime: '16:00',
      endTime: '17:00',
      assignee: '自分',
      type: 'team',
      color: 'bg-purple-500',
    },
    // Dec 19 (Friday)
    {
      id: '11',
      title: 'プロジェクト進捗会議',
      date: '2025-12-19',
      startTime: '10:00',
      endTime: '11:00',
      assignee: '鈴木一郎',
      type: 'team',
      color: 'bg-purple-500',
    },
    {
      id: '12',
      title: 'コンテンツ制作',
      date: '2025-12-19',
      startTime: '13:00',
      endTime: '17:00',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    // Dec 20 (Saturday)
    {
      id: '13',
      title: 'クライアントミーティング',
      date: '2025-12-20',
      startTime: '10:00',
      endTime: '11:30',
      location: '新宿オフィス',
      assignee: '自分',
      type: 'mine',
      color: 'bg-yellow-500',
    },
    {
      id: '14',
      title: '週次レビュー',
      date: '2025-12-20',
      startTime: '15:00',
      endTime: '16:00',
      assignee: '山田次郎',
      type: 'team',
      color: 'bg-purple-500',
    },
  ];

  // Get week dates based on selected date
  const getWeekDates = () => {
    const dates = [];
    // Start from Sunday of the selected week
    const start = new Date(selectedDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekDayNames = ['日', '月', '火', '水', '木', '金', '土'];

  // Time slots - Start from 6:00 AM (hour 6 to 23)
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);
    
    const startMinutes = (startHour - 6) * 60 + startMin; // Offset by 6 hours
    const endMinutes = (endHour - 6) * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    
    const pixelsPerHour = 40; // Compressed height
    const top = (startMinutes / 60) * pixelsPerHour;
    const height = (durationMinutes / 60) * pixelsPerHour;
    
    return { top, height };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Navigation handlers
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.getFullYear()}年 ${start.getMonth() + 1}月`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-card-foreground text-sm font-medium"
          >
            今日
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-card-foreground" strokeWidth={2} />
            </button>
            <button
              onClick={goToNextWeek}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-card-foreground" strokeWidth={2} />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-card-foreground">
            {formatDateRange()}
          </h2>
        </div>

        {/* View Type Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewTypeChange('day')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewType === 'day'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            日
          </button>
          <button
            onClick={() => onViewTypeChange('week')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewType === 'week'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            週
          </button>
          <button
            onClick={() => onViewTypeChange('month')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewType === 'month'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            月
          </button>
          <button
            onClick={() => onViewTypeChange('year')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewType === 'year'
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            年
          </button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {/* Empty corner cell */}
            <div className="border-r border-border" />
            
            {/* Day headers */}
            {weekDates.map((date, index) => {
              const isCurrentDay = isToday(date);
              return (
                <div
                  key={index}
                  className={`py-3 text-center border-r border-border last:border-r-0 ${
                    isCurrentDay ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`text-xs text-muted-foreground mb-1`}>
                    {weekDayNames[date.getDay()]}曜日
                  </div>
                  <div className={`text-sm font-medium ${
                    isCurrentDay ? 'text-primary' : 'text-card-foreground'
                  }`}>
                    {date.getDate()}
                  </div>
                  {isCurrentDay && (
                    <div className="w-6 h-6 mx-auto mt-1 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Body */}
        <div className="overflow-auto" style={{ maxHeight: '720px' }}>
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {/* Time column + Week columns */}
            {timeSlots.map((hour) => (
              <div key={hour} className="contents">
                {/* Time label */}
                <div className="h-[40px] border-r border-b border-border bg-muted/20 flex items-start justify-center pt-1">
                  <span className="text-xs text-muted-foreground">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>

                {/* Day cells */}
                {weekDates.map((date, dayIndex) => {
                  const dayEvents = getEventsForDate(date);
                  const hourEvents = dayEvents.filter(event => {
                    const [startHour] = event.startTime.split(':').map(Number);
                    return startHour === hour;
                  });

                  return (
                    <div
                      key={dayIndex}
                      className={`h-[40px] border-r border-b border-border last:border-r-0 relative ${
                        isToday(date) ? 'bg-primary/[0.02]' : ''
                      }`}
                    >
                      {/* Render events that start in this hour */}
                      {hourEvents.map((event) => {
                        const { top, height } = getEventStyle(event);
                        const relativeTop = top - ((hour - 6) * 40);

                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 ${event.color} rounded px-1.5 py-1 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                            style={{
                              top: `${relativeTop}px`,
                              height: `${height}px`,
                              minHeight: '20px'
                            }}
                          >
                            <div className="text-[10px] text-white font-medium leading-tight truncate">
                              {event.title}
                            </div>
                            {height > 25 && (
                              <div className="text-[9px] text-white/80 leading-tight">
                                {event.startTime}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
