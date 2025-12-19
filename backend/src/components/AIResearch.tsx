import { Search, Building2, TrendingUp, Target, Newspaper, ArrowLeft, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIResearchProps {
  clientId: string;
  clientName?: string;
  onBack: () => void;
}

export function AIResearch({ clientId, clientName = 'デジタルフロンティア株式会社', onBack }: AIResearchProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const mockData = {
    company: clientName,
    industry: 'IT・デジタルマーケティング',
    employees: '約250名',
    revenue: '約18億円（2023年度）',
    latestNews: [
      '新規事業として動画マーケティング部門を立ち上げ（2024年11月）',
      'シリーズBラウンドで8億円の資金調達を実施（2024年9月）',
      '東京オフィスを拡大移転、採用を強化中（2024年8月）',
    ],
    competitors: [
      '株式会社デジタルホールディングス',
      'サイバーエージェント',
      '電通デジタル',
    ],
    challenges: [
      'ブランディング強化の必要性',
      '採用活動の効率化',
      'オンラインプレゼンスの向上',
    ],
    opportunities: [
      '動画コンテンツ需要の高まり',
      'SNSマーケティングへの関心',
      '企業文化の可視化ニーズ',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Search className="w-6 h-6 text-blue-600" strokeWidth={2} />
            <h1 className="text-card-foreground">企業リサーチ</h1>
          </div>
          <p className="text-sm text-muted-foreground">AIによる包括的な企業分析</p>
        </div>
      </div>

      {/* Selected Client */}
      <div className="bg-accent border border-primary/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">分析対象</div>
            <div className="font-medium text-card-foreground">{clientName}</div>
          </div>
        </div>
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-blue-900 mb-2">AI分析中...</h3>
              <p className="text-sm text-blue-700">
                企業情報、業界トレンド、競合分析を実行しています
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <>
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={2} />
              <div>
                <div className="font-medium text-green-900 mb-1">分析完了</div>
                <div className="text-sm text-green-700">包括的な企業情報を取得しました</div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-card-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" strokeWidth={2} />
              基本情報
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-accent rounded-xl">
                <div className="text-xs text-muted-foreground mb-2">業界</div>
                <div className="text-sm text-card-foreground">{mockData.industry}</div>
              </div>
              <div className="p-4 bg-accent rounded-xl">
                <div className="text-xs text-muted-foreground mb-2">従業員数</div>
                <div className="text-sm text-card-foreground">{mockData.employees}</div>
              </div>
              <div className="p-4 bg-accent rounded-xl col-span-2">
                <div className="text-xs text-muted-foreground mb-2">売上規模</div>
                <div className="text-sm text-card-foreground">{mockData.revenue}</div>
              </div>
            </div>
          </div>

          {/* Latest News */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-card-foreground mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" strokeWidth={2} />
              最新ニュース
            </h3>
            <div className="space-y-3">
              {mockData.latestNews.map((news, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-900">• {news}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges & Opportunities */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-card-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" strokeWidth={2} />
                課題
              </h3>
              <div className="space-y-2">
                {mockData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-card-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2} />
                ビジネスチャンス
              </h3>
              <div className="space-y-2">
                {mockData.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitors */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-card-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" strokeWidth={2} />
              競合他社
            </h3>
            <div className="flex flex-wrap gap-3">
              {mockData.competitors.map((competitor, index) => (
                <div key={index} className="px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-900">{competitor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3">
            <button className="flex-1 py-4 bg-gradient-to-r from-primary to-[#0A6F4E] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              提案ドラフトを作成
            </button>
            <button className="px-6 py-4 bg-card border-2 border-border text-card-foreground rounded-xl font-medium hover:bg-accent transition-all">
              レポート出力
            </button>
          </div>
        </>
      )}
    </div>
  );
}
