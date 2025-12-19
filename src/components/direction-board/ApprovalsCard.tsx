import { ChevronRight, RotateCcw, Clock } from 'lucide-react';
import { useState } from 'react';

interface Approval {
  id: string;
  name: string;
  client: string;
  deadline: string;
  relativeTime: string;
  rejectedCount: number;
  assignee: string;
  initials: string;
}

interface ApprovalsCardProps {
  onNavigate?: (view: string) => void;
}

export function ApprovalsCard({
  onNavigate
}: ApprovalsCardProps) {
  const mockApprovals: Approval[] = [
    {
      id: '1',
      name: 'Instagram Reels - 新商品紹介',
      client: 'AXAS株式会社',
      deadline: '2024/12/14 18:00',
      relativeTime: 'あと6時間',
      rejectedCount: 2,
      assignee: '田中太郎',
      initials: 'TT',
    },
    {
      id: '2',
      name: 'YouTube動画 - ブランドストーリー',
      client: 'BAYMAX株式会社',
      deadline: '2024/12/15 12:00',
      relativeTime: 'あと22時間',
      rejectedCount: 0,
      assignee: '佐藤花子',
      initials: 'SH',
    },
    {
      id: '3',
      name: 'Facebook広告 - キャンペーン',
      client: 'COSMO株式会社',
      deadline: '2024/12/16 15:00',
      relativeTime: 'あと30時間',
      rejectedCount: 1,
      assignee: '山田次郎',
      initials: 'SY',
    },
    {
      id: '4',
      name: 'Twitter広告 - キャンペーン',
      client: 'DREAM株式会社',
      deadline: '2024/12/17 10:00',
      relativeTime: 'あと38時間',
      rejectedCount: 0,
      assignee: '伊藤美咲',
      initials: 'IM',
    },
    {
      id: '5',
      name: 'LinkedIn広告 - キャンペーン',
      client: 'EARTH株式会社',
      deadline: '2024/12/18 14:00',
      relativeTime: 'あと46時間',
      rejectedCount: 0,
      assignee: '佐藤健太',
      initials: 'SK',
    },
    {
      id: '6',
      name: 'Instagram広告 - キャンペーン',
      client: 'FIRE株式会社',
      deadline: '2024/12/19 09:00',
      relativeTime: 'あと54時間',
      rejectedCount: 0,
      assignee: '田中智子',
      initials: 'TZ',
    },
    {
      id: '7',
      name: 'YouTube広告 - キャンペーン',
      client: 'GOLD株式会社',
      deadline: '2024/12/20 13:00',
      relativeTime: 'あと62時間',
      rejectedCount: 0,
      assignee: '佐藤花子',
      initials: 'SH',
    },
    {
      id: '8',
      name: 'Facebook広告 - キャンペーン',
      client: 'HEART株式会社',
      deadline: '2024/12/21 08:00',
      relativeTime: 'あと70時間',
      rejectedCount: 0,
      assignee: '山田次郎',
      initials: 'SY',
    },
    {
      id: '9',
      name: 'Twitter広告 - キャンペーン',
      client: 'ICE株式会社',
      deadline: '2024/12/22 12:00',
      relativeTime: 'あと78時間',
      rejectedCount: 0,
      assignee: '伊藤美咲',
      initials: 'IM',
    },
    {
      id: '10',
      name: 'LinkedIn広告 - キャンペーン',
      client: 'JADE株式会社',
      deadline: '2024/12/23 11:00',
      relativeTime: 'あと86時間',
      rejectedCount: 0,
      assignee: '佐藤健太',
      initials: 'SK',
    },
    {
      id: '11',
      name: 'Instagram広告 - キャンペーン',
      client: 'KING株式会社',
      deadline: '2024/12/24 10:00',
      relativeTime: 'あと94時間',
      rejectedCount: 0,
      assignee: '田中智子',
      initials: 'TZ',
    },
    {
      id: '12',
      name: 'YouTube広告 - キャンペーン',
      client: 'LION株式会社',
      deadline: '2024/12/25 09:00',
      relativeTime: 'あと102時間',
      rejectedCount: 0,
      assignee: '佐藤花子',
      initials: 'SH',
    },
  ];

  const [approvals, setApprovals] = useState(mockApprovals.slice(0, 2));
  const totalCount = 12;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('direction-approvals')}
    >
      {/* Horizontal Layout */}
      <div className="flex items-center gap-8">
        {/* Left: Header & Metric */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-card-foreground">Approvals</h3>
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-accent">承認待ち</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl text-card-foreground">{totalCount}</div>
            <div className="text-sm text-muted-foreground">件の承認待ち</div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-24 bg-border flex-shrink-0" />

        {/* Center: Preview List - 横並び */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {approvals.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl hover:bg-accent/50 transition-all border border-transparent hover:border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-card-foreground flex-1 line-clamp-1">{item.name}</div>
                {item.rejectedCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs ml-2 flex-shrink-0">
                    <RotateCcw className="w-3 h-3" strokeWidth={2} />
                    <span>{item.rejectedCount}回</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-muted-foreground">{item.client}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-destructive" strokeWidth={2} />
                  <span className="text-destructive">{item.relativeTime}</span>
                </div>
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

        {/* Divider */}
        <div className="w-px h-24 bg-border flex-shrink-0" />

        {/* Right: CTA */}
        <div className="flex-shrink-0">
          <button className="flex flex-col items-center justify-center gap-2 px-6 py-4 text-primary hover:text-primary/80 transition-colors group/btn">
            <span className="text-sm whitespace-nowrap">承認センターへ</span>
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}