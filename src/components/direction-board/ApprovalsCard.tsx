import { ChevronRight, RotateCcw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllApprovals } from '../../utils/clientData';

interface Approval {
  id: string;
  name: string;
  client: string;
  clientId: string;
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
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // LocalStorageから承認待ちを読み込み
  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = () => {
    const allApprovals = getAllApprovals();
    
    // ClientApprovalをApproval形式に変換
    const formattedApprovals: Approval[] = allApprovals.map(approval => {
      // 期限から相対時間を計算
      const relativeTime = getRelativeTime(approval.deadline || approval.submittedDate);
      
      // 差し戻し回数を計算（rejected回数をカウント）
      const rejectedCount = 0; // TODO: 承認履歴から計算
      
      return {
        id: approval.id,
        name: approval.title,
        client: approval.clientName,
        clientId: approval.clientId,
        deadline: approval.deadline || approval.submittedDate,
        relativeTime,
        rejectedCount,
        assignee: approval.submittedBy,
        initials: getInitials(approval.submittedBy)
      };
    });
    
    // 期限が近い順にソート
    formattedApprovals.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    });
    
    setTotalCount(formattedApprovals.length);
    setApprovals(formattedApprovals.slice(0, 2)); // 最初の2件のみ表示
  };

  // 期限から相対時間を計算
  const getRelativeTime = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 0) return '期限超過';
    if (hours < 24) return `あと${hours}時間`;
    if (days === 1) return '明日';
    return `${days}日後`;
  };

  // 名前からイニシャルを生成
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

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