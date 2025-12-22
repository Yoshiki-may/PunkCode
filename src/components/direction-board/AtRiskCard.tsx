import { ChevronRight, AlertTriangle, Clock, PackageX, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllApprovals, getAllTasks } from '../../utils/clientData';

interface RiskItem {
  id: string;
  name: string;
  client: string;
  clientId: string;
  relativeTime: string;
  riskType: 'delayed' | 'missing-material' | 'urgent';
  assignee: string;
  initials: string;
}

interface AtRiskCardProps {
  onNavigate?: (view: string) => void;
}

export function AtRiskCard({ onNavigate }: AtRiskCardProps) {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [riskCounts, setRiskCounts] = useState({
    delayed: 0,
    missingMaterial: 0,
    urgent: 0,
  });

  // LocalStorageからリスクを読み込み
  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = () => {
    const allApprovals = getAllApprovals();
    const allTasks = getAllTasks();
    
    const riskItems: RiskItem[] = [];
    let delayedCount = 0;
    let missingMaterialCount = 0;
    let urgentCount = 0;
    
    // 承認待ちから遅延・緊急をチェック
    allApprovals.forEach(approval => {
      const deadline = new Date(approval.deadline || approval.submittedDate);
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      let riskType: 'delayed' | 'urgent' | null = null;
      let relativeTime = '';
      
      if (hours < 0) {
        // 期限超過 = 遅延
        const days = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
        riskType = 'delayed';
        relativeTime = `遅延${days}日`;
        delayedCount++;
      } else if (hours < 24) {
        // 24時間以内 = 緊急
        riskType = 'urgent';
        relativeTime = `あと${hours}時間`;
        urgentCount++;
      }
      
      if (riskType) {
        riskItems.push({
          id: approval.id,
          name: approval.title,
          client: approval.clientName,
          clientId: approval.clientId,
          relativeTime,
          riskType,
          assignee: approval.submittedBy,
          initials: getInitials(approval.submittedBy)
        });
      }
    });
    
    // タスクから遅延・緊急をチェック
    allTasks.forEach(task => {
      const deadline = new Date(task.postDate);
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      // 完了済みはスキップ
      if (task.status === 'completed') return;
      
      let riskType: 'delayed' | 'urgent' | null = null;
      let relativeTime = '';
      
      if (hours < 0) {
        // 期限超過 = 遅延
        const days = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
        riskType = 'delayed';
        relativeTime = `遅延${days}日`;
        delayedCount++;
      } else if (hours < 24) {
        // 24時間以内 = 緊急
        riskType = 'urgent';
        relativeTime = `あと${hours}時間`;
        urgentCount++;
      }
      
      if (riskType) {
        riskItems.push({
          id: task.id,
          name: task.title,
          client: task.clientName,
          clientId: task.clientId,
          relativeTime,
          riskType,
          assignee: task.assignee,
          initials: task.initials
        });
      }
    });
    
    // 素材未着の簡易判定（TODO: 実際のデータに応じて実装）
    missingMaterialCount = 3; // 仮の値
    
    // 期限が近い順にソート
    riskItems.sort((a, b) => {
      // urgentを優先、次にdelayed
      if (a.riskType === 'urgent' && b.riskType !== 'urgent') return -1;
      if (a.riskType !== 'urgent' && b.riskType === 'urgent') return 1;
      return 0;
    });
    
    setRisks(riskItems.slice(0, 3)); // 最初の3件のみ表示
    setRiskCounts({
      delayed: delayedCount,
      missingMaterial: missingMaterialCount,
      urgent: urgentCount
    });
  };

  // 名前からイニシャルを生成
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'delayed':
        return <AlertTriangle className="w-3 h-3" strokeWidth={2} />;
      case 'missing-material':
        return <PackageX className="w-3 h-3" strokeWidth={2} />;
      case 'urgent':
        return <Timer className="w-3 h-3" strokeWidth={2} />;
      default:
        return <AlertTriangle className="w-3 h-3" strokeWidth={2} />;
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'delayed':
        return 'bg-destructive/10 text-destructive';
      case 'missing-material':
        return 'bg-amber-500/10 text-amber-600';
      case 'urgent':
        return 'bg-orange-500/10 text-orange-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskLabel = (type: string) => {
    switch (type) {
      case 'delayed':
        return '遅延';
      case 'missing-material':
        return '素材未着';
      case 'urgent':
        return '緊急';
      default:
        return 'リスク';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('inbox-alerts')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">At Risk</h3>
        <span className="text-xs text-muted-foreground">要対応</span>
      </div>

      {/* Primary Metric - カテゴリ別チップ */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">遅延</span>
          <span className="text-base ml-1">{riskCounts.delayed}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600">
          <PackageX className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">素材未着</span>
          <span className="text-base ml-1">{riskCounts.missingMaterial}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600">
          <Timer className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">期限24h以内</span>
          <span className="text-base ml-1">{riskCounts.urgent}</span>
        </div>
      </div>

      {/* Preview List - 直近3件 */}
      <div className="space-y-2 mb-4">
        {risks.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl hover:bg-accent/50 transition-all"
          >
            {/* Item Name */}
            <div className="text-sm text-card-foreground mb-2">{item.name}</div>
            
            {/* Client + Time + Risk Type + Assignee */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted-foreground">{item.client}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-destructive" strokeWidth={2} />
                <span className="text-destructive">{item.relativeTime}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getRiskColor(item.riskType)}`}>
                {getRiskIcon(item.riskType)}
                {getRiskLabel(item.riskType)}
              </span>
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
        <span>リスク一覧</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}