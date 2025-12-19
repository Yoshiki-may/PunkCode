import { AlertCircle, MessageSquareOff, RotateCcw, Lightbulb, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface BottleneckItem {
  id: string;
  label: string;
  count: number;
  icon: typeof AlertCircle;
  color: string;
}

export function BottleneckAnalysis() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBottleneck, setSelectedBottleneck] = useState<BottleneckItem | null>(null);

  const bottlenecks: BottleneckItem[] = [
    {
      id: 'stagnant',
      label: '滞留原因タグ',
      count: 8,
      icon: AlertCircle,
      color: 'text-[#D97706]',
    },
    {
      id: 'no-reply',
      label: '未返信数',
      count: 7,
      icon: MessageSquareOff,
      color: 'text-[#DC2626]',
    },
    {
      id: 'rejected',
      label: '差し戻し回数',
      count: 3,
      icon: RotateCcw,
      color: 'text-[#7C3AED]',
    },
  ];

  const handleBottleneckClick = (item: BottleneckItem) => {
    setSelectedBottleneck(item);
    setDrawerOpen(true);
  };

  const handleImprovementClick = () => {
    console.log('Open improvement suggestions');
    // TODO: 改善提案Drawer実装
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-card-foreground">ボトルネック分析</h3>
          <span className="text-xs text-muted-foreground">改善ポイント</span>
        </div>

        <div className="space-y-3 mb-6">
          {bottlenecks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleBottleneckClick(item)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} strokeWidth={2} />
                  <span className="text-sm text-card-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-card-foreground font-semibold">{item.count}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 改善提案CTA */}
        <button
          onClick={handleImprovementClick}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary to-success text-primary-foreground hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
              <Lightbulb className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="text-sm mb-0.5">PALSS AI 改善提案</div>
              <div className="text-xs opacity-80">AIが最適化案を生成</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {selectedBottleneck && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedBottleneck.id,
            title: selectedBottleneck.label,
            clientName: '複数のクライアント',
            status: '要対応',
            deadline: '2024/12/20',
            assignee: '営業チーム',
            type: 'ボトルネック',
            priority: 'high',
            description: `${selectedBottleneck.label}に関する問題が${selectedBottleneck.count}件検出されています。早急な対応が必要です。`,
            kpi: [
              { label: '問題件数', value: `${selectedBottleneck.count}件` },
              { label: '平均解決日数', value: '5日' },
            ],
            deliverables: [
              '問題の特定と分析',
              '改善アクションプラン',
              '進捗レポート',
            ],
            relatedLinks: [
              { label: '過去の改善事例', url: '#' },
              { label: 'ベストプラクティス', url: '#' },
            ],
          }}
        />
      )}
    </>
  );
}