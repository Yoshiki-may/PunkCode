import { Plus, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useState } from 'react';

interface CalendarUser {
  id: string;
  name: string;
  email?: string;
  color: string;
  enabled: boolean;
  type: 'mine' | 'team';
}

interface ScheduleDrawerContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
  scheduleDate?: Date;
  onScheduleDateChange?: (date: Date) => void;
}

export function ScheduleDrawerContent({ 
  activeView, 
  onViewChange,
  scheduleDate,
  onScheduleDateChange
}: ScheduleDrawerContentProps) {
  const [currentDate, setCurrentDate] = useState(scheduleDate || new Date(2025, 11, 15)); // December 15, 2025
  const [calendars, setCalendars] = useState<CalendarUser[]>([
    {
      id: '1',
      name: 'Reona Okamoto',
      color: 'bg-blue-500',
      enabled: true,
      type: 'mine'
    },
    {
      id: '2',
      name: 'reio-カレンダー',
      color: 'bg-yellow-500',
      enabled: true,
      type: 'team'
    },
    {
      id: '3',
      name: 'Niro shinonoya@...',
      email: 'niro.shinonoya@example.com',
      color: 'bg-purple-500',
      enabled: false,
      type: 'team'
    },
    {
      id: '4',
      name: 'Ren Anan',
      color: 'bg-green-500',
      enabled: true,
      type: 'team'
    },
    {
      id: '5',
      name: 'ryoga.yamashita@careau.jp',
      email: 'ryoga.yamashita@careau.jp',
      color: 'bg-pink-500',
      enabled: true,
      type: 'team'
    }
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const toggleCalendar = (id: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === id ? { ...cal, enabled: !cal.enabled } : cal
    ));
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const myCalendars = calendars.filter(c => c.type === 'mine');
  const teamCalendars = calendars.filter(c => c.type === 'team');

  return (
    <div className="flex flex-col h-full">
      {/* New Event Button */}
      <div className="p-3 border-b border-sidebar-border">
        <button className="w-full h-9 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:bg-sidebar-primary/90 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm font-medium">新規</span>
        </button>
      </div>

      {/* Calendar Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Month Navigation */}
        <div className="px-3 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-sidebar-foreground">
              {year}年 {monthNames[month]}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={previousMonth}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-sidebar-accent transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-sidebar-foreground" strokeWidth={2} />
              </button>
              <button
                onClick={nextMonth}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-sidebar-accent transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-sidebar-foreground" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Mini Calendar */}
          <div>
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDays.map(day => (
                <div key={day} className="h-6 flex items-center justify-center text-[10px] text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells before first day */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="h-7" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => {
                      const newDate = new Date(year, month, day);
                      setCurrentDate(newDate);
                      onScheduleDateChange?.(newDate);
                    }}
                    className={`h-7 flex items-center justify-center text-xs rounded transition-all ${
                      today
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Calendars */}
        <div className="px-3 py-2 border-t border-sidebar-border">
          <button 
            className="w-full flex items-center justify-between py-2 text-left group"
            onClick={() => {}}
          >
            <span className="text-xs font-semibold text-sidebar-foreground">マイカレンダー</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" strokeWidth={2} />
          </button>
          
          <div className="space-y-1 mt-1">
            {myCalendars.map(calendar => (
              <div
                key={calendar.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors group"
              >
                <button
                  onClick={() => toggleCalendar(calendar.id)}
                  className="flex-shrink-0 w-4 h-4 rounded border-2 border-current transition-colors flex items-center justify-center"
                  style={{ 
                    borderColor: calendar.enabled ? calendar.color.replace('bg-', '#') : '#888',
                    backgroundColor: calendar.enabled ? calendar.color.replace('bg-', '#') : 'transparent'
                  }}
                >
                  {calendar.enabled && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </button>
                
                <div className={`w-2 h-2 rounded-full ${calendar.color} flex-shrink-0`} />
                
                <span className="text-xs text-sidebar-foreground flex-1 truncate">
                  {calendar.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Calendars */}
        <div className="px-3 py-2 border-t border-sidebar-border">
          <button 
            className="w-full flex items-center justify-between py-2 text-left group"
            onClick={() => {}}
          >
            <span className="text-xs font-semibold text-sidebar-foreground">チームカレンダー</span>
            <Plus className="w-3 h-3 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" strokeWidth={2} />
          </button>
          
          <div className="space-y-1 mt-1">
            {teamCalendars.map(calendar => (
              <div
                key={calendar.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors group"
              >
                <button
                  onClick={() => toggleCalendar(calendar.id)}
                  className="flex-shrink-0 w-4 h-4 rounded border-2 transition-colors flex items-center justify-center"
                  style={{ 
                    borderColor: calendar.enabled ? calendar.color.replace('bg-', '#') : '#888',
                    backgroundColor: calendar.enabled ? calendar.color.replace('bg-', '#') : 'transparent'
                  }}
                >
                  {calendar.enabled ? (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  ) : (
                    <X className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                  )}
                </button>
                
                <div className={`w-2 h-2 rounded-full ${calendar.color} flex-shrink-0`} />
                
                <span className="text-xs text-sidebar-foreground flex-1 truncate">
                  {calendar.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}