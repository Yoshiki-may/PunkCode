import { ChevronRight, User, AlertTriangle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  taskCount: number;
  workload: 'light' | 'medium' | 'heavy' | 'critical';
}

interface WorkloadCardProps {
  onNavigate?: (view: string) => void;
}

export function WorkloadCard({ onNavigate }: WorkloadCardProps) {
  const members: TeamMember[] = [
    { id: '1', name: '田中太郎', initials: 'TT', taskCount: 12, workload: 'critical' },
    { id: '2', name: '佐藤花子', initials: 'SH', taskCount: 9, workload: 'heavy' },
    { id: '3', name: '鈴木一郎', initials: 'SI', taskCount: 7, workload: 'medium' },
    { id: '4', name: '高橋美咲', initials: 'TM', taskCount: 5, workload: 'light' },
    { id: '5', name: '伊藤健太', initials: 'IK', taskCount: 8, workload: 'medium' },
  ];

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'critical':
        return 'bg-destructive';
      case 'heavy':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-amber-500';
      case 'light':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  const getWorkloadLabel = (workload: string) => {
    switch (workload) {
      case 'critical':
        return '危険';
      case 'heavy':
        return '重';
      case 'medium':
        return '中';
      case 'light':
        return '軽';
      default:
        return '';
    }
  };

  const getWorkloadWidth = (taskCount: number) => {
    const max = Math.max(...members.map(m => m.taskCount));
    return (taskCount / max) * 100;
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('direction-workload')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Workload</h3>
        <span className="text-xs text-muted-foreground">担当別の詰まり</span>
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">
          {members.filter(m => m.workload === 'critical').length}
        </div>
        <div className="text-xs text-muted-foreground">人が危険状態</div>
      </div>

      {/* Member List - Top 5 */}
      <div className="space-y-3 mb-4">
        {members.map((member) => (
          <div key={member.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                  {member.initials}
                </div>
                <span className="text-sm text-card-foreground">{member.name}</span>
                {member.workload === 'critical' && (
                  <AlertTriangle className="w-4 h-4 text-destructive" strokeWidth={2} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{member.taskCount}件</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  member.workload === 'critical' ? 'bg-destructive/10 text-destructive' :
                  member.workload === 'heavy' ? 'bg-orange-500/10 text-orange-600' :
                  member.workload === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-success/10 text-success'
                }`}>
                  {getWorkloadLabel(member.workload)}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${getWorkloadColor(member.workload)}`}
                style={{ width: `${getWorkloadWidth(member.taskCount)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
      >
        <span>稼働詳細</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}
