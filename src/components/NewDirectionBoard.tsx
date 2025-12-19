import { TodayFocus } from './direction-board/TodayFocus';
import { ApprovalsCard } from './direction-board/ApprovalsCard';
import { PipelineHealthCard } from './direction-board/PipelineHealthCard';
import { UpcomingDeadlinesCard } from './direction-board/UpcomingDeadlinesCard';
import { WorkloadCard } from './direction-board/WorkloadCard';
import { ClientWatchlistCard } from './direction-board/ClientWatchlistCard';

interface NewDirectionBoardProps {
  onNavigate?: (view: string) => void;
}

export function NewDirectionBoard({ onNavigate }: NewDirectionBoardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Direction Board</h1>
          <p className="text-sm text-muted-foreground">クライアント状況とプロジェクト進行を一元管理</p>
        </div>
      </div>

      {/* 1段目 - My Clients */}
      <div className="grid grid-cols-1 gap-6">
        <ClientWatchlistCard 
          onNavigate={onNavigate}
        />
      </div>

      {/* 2段目 - Approvals（横長） */}
      <div className="grid grid-cols-1 gap-6">
        <ApprovalsCard onNavigate={onNavigate} />
      </div>

      {/* 3段目 - Today Focus */}
      <div className="grid grid-cols-1 gap-6">
        <TodayFocus onNavigate={onNavigate} />
      </div>

      {/* 4段目 - 進行の健康状態：俯瞰して詰まりを見つける */}
      <div className="grid grid-cols-3 gap-6">
        <PipelineHealthCard onNavigate={onNavigate} />
        <UpcomingDeadlinesCard onNavigate={onNavigate} />
        <WorkloadCard onNavigate={onNavigate} />
      </div>
    </div>
  );
}