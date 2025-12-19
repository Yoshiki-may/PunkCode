import { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram, Twitter } from 'lucide-react';

export function ClientCalendarView() {
  const [currentMonth] = useState(new Date(2024, 11)); // December 2024

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleString('ja-JP', { month: 'long', year: 'numeric' });

  // Sample posts data
  const posts: Record<number, Array<{ platform: string; time: string; content: string }>> = {
    20: [
      { platform: 'Instagram', time: '10:00', content: '新商品ティザー' },
      { platform: 'Twitter', time: '15:00', content: 'キャンペーン告知' },
    ],
    21: [
      { platform: 'Instagram', time: '12:00', content: 'ブログ記事シェア' },
    ],
    23: [
      { platform: 'Twitter', time: '14:00', content: 'ユーザー投稿リポスト' },
      { platform: 'Instagram', time: '18:00', content: 'ストーリーズ投稿' },
    ],
    25: [
      { platform: 'Instagram', time: '10:00', content: 'クリスマス特別投稿' },
    ],
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div
        key={day}
        className="aspect-square border border-border rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="text-sm mb-1">{day}</div>
        {posts[day] && (
          <div className="space-y-1">
            {posts[day].map((post, idx) => (
              <div
                key={idx}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded truncate"
                title={post.content}
              >
                {post.time}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Content Calendar</h1>
        <p className="text-sm text-muted-foreground">予定されている投稿スケジュール</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg">{monthName}</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>
      </div>

      {/* Upcoming Posts Detail */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">今後の予定詳細</h2>
        <div className="space-y-4">
          {Object.entries(posts)
            .filter(([day]) => parseInt(day) >= 20)
            .slice(0, 5)
            .map(([day, dayPosts]) => (
              <div key={day} className="space-y-2">
                <div className="text-sm text-muted-foreground">12月{day}日</div>
                {dayPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {post.platform === 'Instagram' ? (
                        <Instagram className="w-4 h-4 text-primary" />
                      ) : (
                        <Twitter className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm mb-1">{post.content}</div>
                      <div className="text-xs text-muted-foreground">
                        {post.platform} • {post.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
