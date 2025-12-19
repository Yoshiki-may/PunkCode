import { TrendingUp, Clock } from 'lucide-react';

interface SNSNewsDrawerContentProps {
  activeView?: string;
  onViewChange: (view: string) => void;
}

export function SNSNewsDrawerContent({ activeView, onViewChange }: SNSNewsDrawerContentProps) {
  const newsCategories = [
    {
      id: 'trending',
      label: 'トレンド',
      icon: TrendingUp,
      view: 'sns-news-trending',
    },
    {
      id: 'latest',
      label: '最新ニュース',
      icon: Clock,
      view: 'sns-news-latest',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Categories */}
      <div className="px-3 py-2">
        <div className="space-y-1">
          {newsCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeView === category.view;

            return (
              <button
                key={category.id}
                onClick={() => onViewChange(category.view)}
                className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-3 my-2" />

      {/* Quick Access */}
      <div className="px-3 py-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-3">
          クイックアクセス
        </p>
        <button
          onClick={() => onViewChange('sns-news')}
          className="w-full px-3 py-2 rounded-lg text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          すべて表示
        </button>
      </div>
    </div>
  );
}