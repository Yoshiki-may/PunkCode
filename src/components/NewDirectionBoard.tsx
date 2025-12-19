import { DirectionNextAction } from './direction-board/DirectionNextAction';
import { UnapprovedList } from './direction-board/UnapprovedList';
import { DirectionKPI } from './direction-board/DirectionKPI';
import { ProductionPipeline } from './direction-board/ProductionPipeline';
import { DirectionAlerts } from './direction-board/DirectionAlerts';
import { PostingCalendar } from './direction-board/PostingCalendar';

export function NewDirectionBoard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Direction Board</h1>
          <p className="text-sm text-muted-foreground">クライアント状況とプロジェクト進行を一元管理</p>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="flex gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-6">
          {/* Next Action - 最重要アクション */}
          <DirectionNextAction />

          {/* Unapproved List - 未承認一覧 */}
          <UnapprovedList />

          {/* Production Pipeline - 制作プロセス */}
          <ProductionPipeline />
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="w-[380px] space-y-6">
          {/* KPI Snapshot */}
          <DirectionKPI />

          {/* Alerts */}
          <DirectionAlerts />

          {/* Posting Calendar */}
          <PostingCalendar />
        </div>
      </div>
    </div>
  );
}