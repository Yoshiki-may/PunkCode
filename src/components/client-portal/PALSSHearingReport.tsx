import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface HearingItem {
  category: string;
  question: string;
  answer: string;
  priority: 'high' | 'medium' | 'low';
}

interface PALSSHearingReportProps {
  clientName: string;
  hearingDate: string;
  items?: HearingItem[];
}

export function PALSSHearingReport({ 
  clientName, 
  hearingDate,
  items = [
    {
      category: 'ターゲット層',
      question: '主なターゲット顧客層は？',
      answer: '20代後半〜30代女性、都市部在住、年収400万円以上',
      priority: 'high'
    },
    {
      category: 'ブランドイメージ',
      question: '目指すブランドイメージは？',
      answer: 'ナチュラル・洗練された・親しみやすい',
      priority: 'high'
    },
    {
      category: 'コンテンツ方針',
      question: '重視するコンテンツタイプは？',
      answer: 'ライフスタイル提案、商品使用シーン、ユーザーレビュー',
      priority: 'medium'
    },
    {
      category: '投稿頻度',
      question: '希望する投稿頻度は？',
      answer: 'Instagram: 週3回、TikTok: 週2回',
      priority: 'medium'
    },
    {
      category: 'KPI目標',
      question: '達成したいKPIは？',
      answer: 'フォロワー数20%増、エンゲージメント率5%以上',
      priority: 'high'
    },
    {
      category: '予算',
      question: '月間予算の目安は？',
      answer: '月額50〜70万円',
      priority: 'low'
    }
  ]
}: PALSSHearingReportProps) {
  
  const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          label: '重要'
        };
      case 'medium':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          label: '標準'
        };
      case 'low':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          label: '参考'
        };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-violet-500/5 to-purple-500/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-1">
                PALSSヒアリング結果レポート
              </h3>
              <p className="text-xs text-muted-foreground">
                クライアント: {clientName} | ヒアリング日: {hearingDate}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            確認済み
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {items.map((item, index) => {
            const priorityConfig = getPriorityConfig(item.priority);
            const Icon = priorityConfig.icon;
            
            return (
              <div 
                key={index}
                className="group bg-muted/30 hover:bg-muted/50 border border-border rounded-lg p-4 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  {/* Priority Icon */}
                  <div className={`${priorityConfig.bg} ${priorityConfig.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Category & Priority */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${priorityConfig.bg} ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>

                    {/* Question */}
                    <h4 className="text-sm font-medium text-card-foreground mb-2">
                      {item.question}
                    </h4>

                    {/* Answer */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">重要項目</div>
              <div className="text-lg font-semibold text-red-500">
                {items.filter(item => item.priority === 'high').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">標準項目</div>
              <div className="text-lg font-semibold text-yellow-500">
                {items.filter(item => item.priority === 'medium').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">参考項目</div>
              <div className="text-lg font-semibold text-green-500">
                {items.filter(item => item.priority === 'low').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
