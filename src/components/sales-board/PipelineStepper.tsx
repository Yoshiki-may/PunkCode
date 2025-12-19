import { ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  amount: number; // in 万円
  avgDays: number;
  color: string;
}

interface PipelineStepperProps {
  onViewAllClick?: () => void;
}

export function PipelineStepper({ onViewAllClick }: PipelineStepperProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const stages: PipelineStage[] = [
    {
      id: 'lead',
      name: 'Lead',
      count: 24,
      amount: 8500,
      avgDays: 3,
      color: 'bg-slate-500',
    },
    {
      id: 'qualification',
      name: 'Qualification',
      count: 15,
      amount: 6200,
      avgDays: 5,
      color: 'bg-blue-500',
    },
    {
      id: 'proposal',
      name: 'Proposal',
      count: 12,
      amount: 5800,
      avgDays: 7,
      color: 'bg-amber-500',
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      count: 8,
      amount: 4200,
      avgDays: 10,
      color: 'bg-orange-500',
    },
    {
      id: 'contract',
      name: 'Contract',
      count: 5,
      amount: 3500,
      avgDays: 4,
      color: 'bg-green-500',
    },
  ];

  const handleStageClick = (stage: PipelineStage) => {
    setSelectedStage(stage);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-card-foreground">Pipeline Stepper</h3>
          <span className="text-xs text-muted-foreground">営業プロセス全体</span>
        </div>

        <div className="relative">
          {/* ステージ概要 */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                className="p-3 rounded-lg border border-border hover:border-primary hover:shadow-sm transition-all group bg-card text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-medium text-card-foreground">{stage.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold text-card-foreground">{stage.count}</span>
                    <span className="text-xs text-muted-foreground">件</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stage.amount.toLocaleString()}万円</div>
                  <div className="text-xs text-muted-foreground">平均{stage.avgDays}日</div>
                </div>
              </button>
            ))}
          </div>

          {/* CTA Button to Pipeline */}
          {onViewAllClick && (
            <button
              onClick={onViewAllClick}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all group"
            >
              <span className="text-sm font-medium">Pipelineへ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {selectedStage && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedStage.id,
            title: `${selectedStage.name}ステージの案件`,
            clientName: '複数のクライアント',
            status: '進行中',
            deadline: '2024/12/20',
            assignee: '営業チーム',
            type: selectedStage.name,
            priority: 'medium',
            description: `${selectedStage.name}ステージに${selectedStage.count}件の案件があります。次のアクション: 次のステージへ`,
            kpi: [
              { label: '案件数', value: `${selectedStage.count}件` },
              { label: '平均滞留日数', value: `${selectedStage.avgDays}日` },
              { label: '金額', value: `${selectedStage.amount}万円` },
            ],
            deliverables: [
              '次のステージへ進める',
              '進捗レポート',
            ],
          }}
        />
      )}
    </>
  );
}