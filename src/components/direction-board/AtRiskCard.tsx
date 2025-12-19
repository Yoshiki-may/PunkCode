import { ChevronRight, AlertTriangle, Clock, PackageX, Timer } from 'lucide-react';

interface RiskItem {
  id: string;
  name: string;
  client: string;
  relativeTime: string;
  riskType: 'delayed' | 'missing-material' | 'urgent';
  assignee: string;
  initials: string;
}

interface AtRiskCardProps {
  onNavigate?: (view: string) => void;
}

export function AtRiskCard({ onNavigate }: AtRiskCardProps) {
  const risks: RiskItem[] = [
    {
      id: '1',
      name: 'TikTok動画 - 商品PR',
      client: 'AXAS株式会社',
      relativeTime: 'あと4時間',
      riskType: 'urgent',
      assignee: '田中太郎',
      initials: 'TT',
    },
    {
      id: '2',
      name: 'Instagram Reels - キャンペーン',
      client: 'BAYMAX株式会社',
      relativeTime: '遅延2日',
      riskType: 'delayed',
      assignee: '佐藤花子',
      initials: 'SH',
    },
    {
      id: '3',
      name: 'YouTube Short - 解説動画',
      client: 'デジタルフロンティア',
      relativeTime: '素材待ち',
      riskType: 'missing-material',
      assignee: '鈴木一郎',
      initials: 'SI',
    },
  ];

  const riskCounts = {
    delayed: 2,
    missingMaterial: 3,
    urgent: 4,
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
