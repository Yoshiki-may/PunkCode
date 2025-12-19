import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface Deadline {
  id: string;
  name: string;
  client: string;
  date: string;
  relativeTime: string;
  type: 'delivery' | 'shooting' | 'posting';
  assignee: string;
  initials: string;
}

interface UpcomingDeadlinesCardProps {
  onNavigate?: (view: string) => void;
}

export function UpcomingDeadlinesCard({ onNavigate }: UpcomingDeadlinesCardProps) {
  const [activeTab, setActiveTab] = useState<'delivery' | 'shooting' | 'posting'>('delivery');

  const deadlines: Deadline[] = [
    {
      id: '1',
      name: 'Instagram Reels - 新商品紹介',
      client: 'AXAS株式会社',
      date: '12/14',
      relativeTime: '今日',
      type: 'delivery',
      assignee: '田中太郎',
      initials: 'TT',
    },
    {
      id: '2',
      name: 'YouTube動画 - ブランドストーリー',
      client: 'BAYMAX株式会社',
      date: '12/15',
      relativeTime: '明日',
      type: 'delivery',
      assignee: '佐藤花子',
      initials: 'SH',
    },
    {
      id: '3',
      name: 'TikTok - チャレンジ動画',
      client: 'デジタルフロンティア',
      date: '12/16',
      relativeTime: 'あと2日',
      type: 'delivery',
      assignee: '鈴木一郎',
      initials: 'SI',
    },
    {
      id: '4',
      name: '商品撮影 - AXAS新商品',
      client: 'AXAS株式会社',
      date: '12/17',
      relativeTime: 'あと3日',
      type: 'shooting',
      assignee: '高橋美咲',
      initials: 'TM',
    },
    {
      id: '5',
      name: 'Instagram投稿 - キャンペーン告知',
      client: 'BAYMAX株式会社',
      date: '12/18',
      relativeTime: 'あと4日',
      type: 'posting',
      assignee: '佐藤花子',
      initials: 'SH',
    },
  ];

  const filteredDeadlines = deadlines.filter(d => d.type === activeTab).slice(0, 5);

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'delivery':
        return '納期';
      case 'shooting':
        return '撮影';
      case 'posting':
        return '投稿';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('direction-projects')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Upcoming Deadlines</h3>
        <span className="text-xs text-muted-foreground">今週の締切</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1">
        {(['delivery', 'shooting', 'posting'] as const).map((type) => (
          <button
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(type);
            }}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
              activeTab === type
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            {getTabLabel(type)}
          </button>
        ))}
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">{filteredDeadlines.length}</div>
        <div className="text-xs text-muted-foreground">件の{getTabLabel(activeTab)}予定</div>
      </div>

      {/* Preview List */}
      <div className="space-y-2 mb-4">
        {filteredDeadlines.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl hover:bg-accent/50 transition-all"
          >
            {/* Item Name */}
            <div className="text-sm text-card-foreground mb-2">{item.name}</div>
            
            {/* Client + Deadline + Assignee */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted-foreground">{item.client}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-destructive" strokeWidth={2} />
                <span className="text-destructive">{item.relativeTime}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{item.date}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                  {item.initials}
                </div>
                <span className="text-muted-foreground">{item.assignee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
      >
        <span>スケジュールへ</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}