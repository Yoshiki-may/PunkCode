import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Camera, AlertCircle } from 'lucide-react';

export function ShootCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 19)); // Dec 19, 2024
  const [viewType, setViewType] = useState<'week' | 'month'>('week');

  // Sample shoot schedule data
  const shoots = [
    {
      id: 1,
      date: '2024-12-20',
      time: '10:00-12:00',
      client: 'クライアントA',
      project: '新商品プロモーション撮影',
      location: '渋谷スタジオ',
      type: '商品写真',
      status: 'confirmed',
      notes: '商品5点、白背景、複数アングル',
    },
    {
      id: 2,
      date: '2024-12-20',
      time: '15:00-17:00',
      client: 'クライアントB',
      project: 'ブランドムービー撮影',
      location: '六本木オフィス',
      type: '動画',
      status: 'confirmed',
      notes: '60秒、4K、ドローン撮影含む',
    },
    {
      id: 3,
      date: '2024-12-21',
      time: '09:00-11:00',
      client: 'クライアントC',
      project: 'Instagram リール撮影',
      location: '屋外ロケーション',
      type: '動画',
      status: 'pending',
      notes: '15秒×3本、縦型動画',
    },
    {
      id: 4,
      date: '2024-12-23',
      time: '13:00-16:00',
      client: 'クライアントD',
      project: '商品写真撮影',
      location: '池袋スタジオ',
      type: '商品写真',
      status: 'confirmed',
      notes: '商品10点、季節感のある演出',
    },
    {
      id: 5,
      date: '2024-12-24',
      time: '11:00-13:00',
      client: 'クライアントE',
      project: 'スタッフインタビュー撮影',
      location: '新宿オフィス',
      type: '動画',
      status: 'tentative',
      notes: 'インタビュー形式、3名',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'tentative': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '確定';
      case 'pending': return '調整中';
      case 'tentative': return '仮予約';
      default: return status;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getShootsForDate = (date: Date) => {
    const dateString = formatDate(date);
    return shoots.filter(shoot => shoot.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Shoot Calendar</h1>
          <p className="text-sm text-muted-foreground">撮影スケジュール管理</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('week')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewType === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            週
          </button>
          <button
            onClick={() => setViewType('month')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewType === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            月
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => viewType === 'week' ? navigateWeek('prev') : navigateMonth('prev')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-lg">
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </div>
          <button
            onClick={() => viewType === 'week' ? navigateWeek('next') : navigateMonth('next')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewType === 'month' ? (
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div key={index} className="text-center text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, index) => {
              if (!day) {
                return <div key={index} className="aspect-square" />;
              }

              const daysShoots = getShootsForDate(day);
              const hasShoot = daysShoots.length > 0;

              return (
                <div
                  key={index}
                  className={`aspect-square border rounded-lg p-2 transition-all ${
                    isToday(day)
                      ? 'border-primary bg-primary/5'
                      : hasShoot
                      ? 'border-border bg-muted/50 hover:bg-muted'
                      : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="text-sm mb-1">{day.getDate()}</div>
                  {hasShoot && (
                    <div className="space-y-1">
                      {daysShoots.slice(0, 2).map((shoot) => (
                        <div
                          key={shoot.id}
                          className="text-xs px-1 py-0.5 bg-primary/10 text-primary rounded truncate"
                          title={shoot.project}
                        >
                          {shoot.time.split('-')[0]}
                        </div>
                      ))}
                      {daysShoots.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{daysShoots.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Week View
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-7 gap-4">
            {getWeekDays(currentDate).map((day, index) => {
              const daysShoots = getShootsForDate(day);
              const hasShoot = daysShoots.length > 0;

              return (
                <div key={index} className="space-y-3">
                  {/* Day Header */}
                  <div className={`text-center p-3 rounded-lg ${
                    isToday(day) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <div className="text-xs mb-1">
                      {['日', '月', '火', '水', '木', '金', '土'][index]}
                    </div>
                    <div className="text-lg">{day.getDate()}</div>
                  </div>

                  {/* Shoots for this day */}
                  <div className="space-y-2 min-h-[200px]">
                    {daysShoots.map((shoot) => (
                      <div
                        key={shoot.id}
                        className={`p-3 border rounded-lg ${getStatusColor(shoot.status)} hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="text-xs mb-1">{shoot.time}</div>
                        <div className="text-sm mb-1 truncate">{shoot.client}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {shoot.project}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{shoot.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Shoots List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg">今後の撮影予定</h2>
        </div>
        <div className="space-y-3">
          {shoots.map((shoot) => (
            <div
              key={shoot.id}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm">{shoot.client}</h3>
                    <span className={`px-2 py-1 border rounded-full text-xs ${getStatusColor(shoot.status)}`}>
                      {getStatusLabel(shoot.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{shoot.project}</p>
                </div>
                <Camera className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{shoot.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{shoot.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{shoot.location}</span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-background rounded text-xs">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{shoot.notes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
