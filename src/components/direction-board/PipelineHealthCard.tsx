import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  wip: number;
  avgDays: number;
  trend: 'up' | 'down' | 'stable';
}

interface PipelineHealthCardProps {
  onNavigate?: (view: string) => void;
}

export function PipelineHealthCard({ onNavigate }: PipelineHealthCardProps) {
  const stages: PipelineStage[] = [
    { id: 'planning', name: '企画', wip: 8, avgDays: 2, trend: 'stable' },
    { id: 'script', name: '台本', wip: 6, avgDays: 3, trend: 'down' },
    { id: 'material', name: '素材', wip: 10, avgDays: 4, trend: 'up' },
    { id: 'editing', name: '編集', wip: 12, avgDays: 5, trend: 'up' },
    { id: 'first-draft', name: '初稿', wip: 5, avgDays: 1, trend: 'stable' },
    { id: 'revision', name: '修正', wip: 7, avgDays: 2, trend: 'down' },
  ];

  const maxWip = Math.max(...stages.map(s => s.wip));

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-destructive';
      case 'down':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('direction-pipeline')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Pipeline Health</h3>
        <span className="text-xs text-muted-foreground">工程の詰まり</span>
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">{stages.reduce((sum, s) => sum + s.wip, 0)}</div>
        <div className="text-xs text-muted-foreground">件進行中</div>
      </div>

      {/* Pipeline Stages - Mini Bars */}
      <div className="space-y-3 mb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{stage.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-card-foreground">{stage.wip}件</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{stage.avgDays}日</span>
                {stage.trend !== 'stable' && (
                  <span className={getTrendColor(stage.trend)}>
                    {stage.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3" strokeWidth={2} />
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  stage.wip > maxWip * 0.7 ? 'bg-destructive' : 
                  stage.wip > maxWip * 0.4 ? 'bg-amber-500' : 
                  'bg-success'
                }`}
                style={{ width: `${(stage.wip / maxWip) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
      >
        <span>パイプラインへ</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}
