import { Sparkles, Search, FileText, Lightbulb, FileOutput, TrendingUp, Building2, Target, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PALSSAIProps {
  boardType?: 'sales' | 'direction' | 'editor' | 'creator' | 'support' | 'client';
}

type AIFunction = 'research' | 'proposal' | 'ideas' | 'document';
type StepStatus = 'idle' | 'processing' | 'completed';

const boardConfig = {
  sales: {
    title: 'PALSS AI for Sales',
    subtitle: 'AI支援による企業リサーチと提案資料の自動生成',
  },
  direction: {
    title: 'PALSS AI for Direction',
    subtitle: 'プロジェクト最適化とリソース配分のAI支援',
  },
  editor: {
    title: 'PALSS AI for Editor',
    subtitle: '編集作業の効率化とクオリティ向上のAI支援',
  },
  creator: {
    title: 'PALSS AI for Creator',
    subtitle: 'クリエイティブ制作のアイデア生成とワークフロー最適化',
  },
  support: {
    title: 'PALSS AI for Management',
    subtitle: '経営判断支援と組織全体の最適化',
  },
  client: {
    title: 'PALSS AI for Client',
    subtitle: 'プロジェクト進捗の可視化とインサイト提供',
  },
};

const aiFeatures = [
  {
    id: 'research' as AIFunction,
    icon: Search,
    title: '企業リサーチ',
    description: 'AIが企業情報、業界トレンド、競合分析を自動収集',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 'proposal' as AIFunction,
    icon: FileText,
    title: '提案ドラフト作成',
    description: 'リサーチ結果から最適な提案内容を自動生成',
    color: 'from-primary to-[#0A6F4E]',
    bgColor: 'bg-accent',
    iconColor: 'text-primary',
    borderColor: 'border-primary/20',
  },
  {
    id: 'ideas' as AIFunction,
    icon: Lightbulb,
    title: 'アイデア作成',
    description: 'クリエイティブなコンセプトとアプローチを提案',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  {
    id: 'document' as AIFunction,
    icon: FileOutput,
    title: '資料作成',
    description: 'プロフェッショナルな提案資料を自動生成',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
];

export function PALSSAI({ boardType = 'sales' }: PALSSAIProps) {
  const [companyName, setCompanyName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<AIFunction | null>(null);
  const [stepStatus, setStepStatus] = useState<Record<AIFunction, StepStatus>>({
    research: 'idle',
    proposal: 'idle',
    ideas: 'idle',
    document: 'idle',
  });

  const config = boardConfig[boardType];

  const handleFeatureClick = (featureId: AIFunction) => {
    setSelectedFeature(featureId);
    
    // Simulate AI processing
    setStepStatus(prev => ({ ...prev, [featureId]: 'processing' }));
    
    setTimeout(() => {
      setStepStatus(prev => ({ ...prev, [featureId]: 'completed' }));
    }, 2000);
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />;
      case 'completed':
        return <Check className="w-5 h-5" strokeWidth={2} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-card-foreground">{config.title}</h1>
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-[#0A6F4E] text-white text-xs rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
              AI Powered
            </span>
          </div>
          <p className="text-muted-foreground">{config.subtitle}</p>
        </div>
      </div>

      {/* AI Workflow Overview */}
      <div className="bg-gradient-to-br from-primary via-primary to-[#0A6F4E] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-white mb-1">AI ワークフロー</h2>
            <p className="text-white/80 text-sm">4つのステップで完結する提案資料作成</p>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-4 gap-4">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const status = stepStatus[feature.id];
            const isActive = selectedFeature === feature.id;
            
            return (
              <div key={feature.id} className="relative">
                <div className={`p-4 rounded-xl backdrop-blur-sm transition-all ${
                  isActive 
                    ? 'bg-white/30 ring-2 ring-white/50' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    {status !== 'idle' && (
                      <div className="text-white">
                        {getStatusIcon(status)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-80 mb-1">Step {index + 1}</div>
                  <div className="text-sm font-medium">{feature.title}</div>
                </div>
                {index < aiFeatures.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" strokeWidth={2} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Input */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-primary" strokeWidth={2} />
          <h3 className="text-card-foreground">対象企業を入力</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="企業名を入力してください（例：株式会社◯◯）"
            className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-all text-card-foreground bg-background placeholder:text-muted-foreground"
          />
        </div>

        {companyName && (
          <div className="mt-4 p-4 bg-accent rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>対象企業: {companyName}</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Feature Cards */}
      <div className="grid grid-cols-2 gap-6">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon;
          const status = stepStatus[feature.id];
          const isDisabled = !companyName;
          const isActive = selectedFeature === feature.id;

          return (
            <button
              key={feature.id}
              onClick={() => !isDisabled && handleFeatureClick(feature.id)}
              disabled={isDisabled}
              className={`relative overflow-hidden bg-card border-2 rounded-2xl p-6 text-left transition-all group ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : isActive
                  ? `${feature.borderColor} shadow-lg`
                  : 'border-border hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {/* Icon and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center transition-transform ${
                  !isDisabled && 'group-hover:scale-110'
                }`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} strokeWidth={2} />
                </div>
                
                {status !== 'idle' && (
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
                    status === 'processing'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {getStatusIcon(status)}
                    {status === 'processing' ? '処理中' : '完了'}
                  </div>
                )}
              </div>

              {/* Title and Description */}
              <div className="space-y-2">
                <h3 className="text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Action Indicator */}
              {!isDisabled && status === 'idle' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-medium">AI実行</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </div>
              )}

              {/* Results Preview */}
              {status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    {feature.id === 'research' && (
                      <>
                        <ResultItem icon={Building2} label="業界: IT・デジタルマーケティング" />
                        <ResultItem icon={Target} label="従業員数: 約250名" />
                        <ResultItem icon={TrendingUp} label="売上: 約18億円" />
                      </>
                    )}
                    {feature.id === 'proposal' && (
                      <>
                        <ResultItem icon={FileText} label="提案タイトル生成完了" />
                        <ResultItem icon={Target} label="課題とソリューション整理済み" />
                        <ResultItem icon={TrendingUp} label="期待効果を算出" />
                      </>
                    )}
                    {feature.id === 'ideas' && (
                      <>
                        <ResultItem icon={Lightbulb} label="3つのコンセプト案を生成" />
                        <ResultItem icon={Sparkles} label="クリエイティブアプローチ提案" />
                        <ResultItem icon={Target} label="ターゲット訴求ポイント整理" />
                      </>
                    )}
                    {feature.id === 'document' && (
                      <>
                        <ResultItem icon={FileOutput} label="PowerPoint 20ページ生成" />
                        <ResultItem icon={Check} label="図表とグラフを自動挿入" />
                        <ResultItem icon={Sparkles} label="デザインテンプレート適用" />
                      </>
                    )}
                  </div>
                  
                  <button className={`mt-4 w-full py-3 bg-gradient-to-r ${feature.color} text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                    詳細を確認
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* All Steps Completed */}
      {Object.values(stepStatus).every(s => s === 'completed') && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 animate-[fadeIn_0.5s_ease-in]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-green-900 mb-2">すべてのAI処理が完了しました</h3>
              <p className="text-green-700">
                {companyName}向けの提案資料が準備できました
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-[#0A6F4E] text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-3">
              <FileOutput className="w-5 h-5" strokeWidth={2} />
              提案資料をダウンロード
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </div>
  );
}