import { LayoutGrid, List, TrendingUp, Search, Plus, ChevronRight, User, Calendar, DollarSign, Target, Percent, Building2, Phone, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Deal {
  id: string;
  companyName: string;
  contactPerson: string;
  contactEmail?: string;
  contactPhone?: string;
  amount: number; // in 万円
  probability: number; // 0-100
  stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'contract';
  nextAction: string;
  lastUpdate: string;
  deadline: string;
  assignee: string;
  notes?: string;
}

type ViewMode = 'board' | 'list' | 'forecast';

export function Pipeline() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<'all' | Deal['stage']>('all');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      companyName: 'AXAS株式会社',
      contactPerson: '山田太郎',
      contactEmail: 'yamada@axas.co.jp',
      contactPhone: '03-1234-5678',
      amount: 500,
      probability: 75,
      stage: 'proposal',
      nextAction: '提案資料送付',
      lastUpdate: '2024/12/13',
      deadline: '2024/12/20',
      assignee: '田中太郎',
      notes: 'SNS運用代行の大型案件。12/20までに提案書を提出する必要あり。',
    },
    {
      id: '2',
      companyName: 'BAYMAX株式会社',
      contactPerson: '佐藤花子',
      contactEmail: 'sato@baymax.co.jp',
      amount: 800,
      probability: 60,
      stage: 'negotiation',
      nextAction: '価格調整',
      lastUpdate: '2024/12/12',
      deadline: '2024/12/18',
      assignee: '佐藤花子',
      notes: 'インフルエンサーマーケティング案件。価格面で調整が必要。',
    },
    {
      id: '3',
      companyName: 'デジタルフロンティア株式会社',
      contactPerson: '鈴木一郎',
      contactEmail: 'suzuki@df.co.jp',
      amount: 350,
      probability: 40,
      stage: 'qualification',
      nextAction: 'ヒアリング実施',
      lastUpdate: '2024/12/14',
      deadline: '2024/12/25',
      assignee: '鈴木一郎',
      notes: 'コンテンツ制作サポートの要件をヒアリング中。',
    },
    {
      id: '4',
      companyName: 'クリエイティブワークス',
      contactPerson: '高橋次郎',
      contactEmail: 'takahashi@creative.co.jp',
      amount: 1200,
      probability: 90,
      stage: 'contract',
      nextAction: '契約書送付',
      lastUpdate: '2024/12/13',
      deadline: '2024/12/16',
      assignee: '田中太郎',
      notes: 'ブランディング支援の大型案件。ほぼ確定。',
    },
    {
      id: '5',
      companyName: 'マーケティングラボ',
      contactPerson: '伊藤美咲',
      contactEmail: 'ito@mlab.co.jp',
      amount: 200,
      probability: 30,
      stage: 'lead',
      nextAction: '初回アポ設定',
      lastUpdate: '2024/12/14',
      deadline: '2024/12/22',
      assignee: '山田次郎',
      notes: '新規リード。まずは初回面談を設定する。',
    },
    {
      id: '6',
      companyName: 'ビジネスソリューションズ',
      contactPerson: '渡辺健太',
      contactEmail: 'watanabe@bs.co.jp',
      amount: 650,
      probability: 70,
      stage: 'proposal',
      nextAction: '提案プレゼン',
      lastUpdate: '2024/12/11',
      deadline: '2024/12/19',
      assignee: '佐藤花子',
      notes: 'コンサルティング案件。プレゼンの準備が必要。',
    },
    {
      id: '7',
      companyName: 'テックイノベーション',
      contactPerson: '中村美咲',
      contactEmail: 'nakamura@tech.co.jp',
      amount: 450,
      probability: 80,
      stage: 'negotiation',
      nextAction: '最終条件調整',
      lastUpdate: '2024/12/14',
      deadline: '2024/12/17',
      assignee: '田中太郎',
      notes: '契約直前。最終条件の詰めを行う。',
    },
  ]);

  const stages = [
    { 
      id: 'lead', 
      name: 'Lead', 
      nameJa: 'リード',
      color: 'bg-slate-500',
      lightColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200'
    },
    { 
      id: 'qualification', 
      name: 'Qualification', 
      nameJa: '要件定義',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'proposal', 
      name: 'Proposal', 
      nameJa: '提案',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
    { 
      id: 'negotiation', 
      name: 'Negotiation', 
      nameJa: '交渉中',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    },
    { 
      id: 'contract', 
      name: 'Contract', 
      nameJa: '契約',
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
  ];

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = (e: React.DragEvent, stage: Deal['stage']) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    setDeals(deals.map(deal => 
      deal.id === dealId ? { 
        ...deal, 
        stage, 
        lastUpdate: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/') 
      } : deal
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const filteredDeals = deals.filter(deal => {
    if (filterStage !== 'all' && deal.stage !== filterStage) return false;
    if (searchQuery && !deal.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !deal.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStageDeals = (stage: Deal['stage']) => {
    return filteredDeals.filter(deal => deal.stage === stage);
  };

  const getStageTotal = (stage: Deal['stage']) => {
    return getStageDeals(stage).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const weightedForecast = deals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);
  const selectedDeal = selectedDealId ? deals.find(d => d.id === selectedDealId) : null;

  const DealCard = ({ deal }: { deal: Deal }) => {
    const stage = stages.find(s => s.id === deal.stage);
    const isSelected = selectedDealId === deal.id;
    const isOverdue = new Date(deal.deadline) < new Date();

    return (
      <button
        draggable={viewMode === 'board'}
        onDragStart={(e) => handleDragStart(e, deal.id)}
        onClick={() => setSelectedDealId(deal.id)}
        className={`w-full text-left p-4 bg-card border rounded-xl transition-all hover:shadow-md ${
          isSelected ? 'border-primary shadow-md' : 'border-border'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-card-foreground line-clamp-2 flex-1">
              {deal.companyName}
            </h4>
            <span className={`px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${stage?.lightColor} ${stage?.textColor} ${stage?.borderColor}`}>
              {deal.probability}%
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3" strokeWidth={2} />
            <span>{deal.contactPerson}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">金額</span>
              <span className="text-sm font-semibold text-card-foreground">
                ¥{deal.amount.toLocaleString()}万
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">期限</span>
              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-card-foreground'}`}>
                {deal.deadline}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="w-3 h-3" strokeWidth={2} />
              <span className="text-primary">{deal.nextAction}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" strokeWidth={2} />
              <span>{deal.assignee}</span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-card-foreground mb-2">Pipeline</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {deals.length}件の案件
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  総額 ¥{totalPipelineValue.toLocaleString()}万
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  予測 ¥{Math.round(weightedForecast).toLocaleString()}万
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" strokeWidth={2} />
              新規案件
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="会社名や担当者で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべてのステージ</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.nameJa}</option>
              ))}
            </select>

            <div className="flex gap-1 p-1 bg-background border border-border rounded-lg">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'board' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <List className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('forecast')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'forecast' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <TrendingUp className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'board' && (
            <div className="grid grid-cols-5 gap-4 h-full">
              {stages.map(stage => {
                const stageDeals = getStageDeals(stage.id as Deal['stage']);
                const stageTotal = getStageTotal(stage.id as Deal['stage']);
                
                return (
                  <div
                    key={stage.id}
                    onDrop={(e) => handleDrop(e, stage.id as Deal['stage'])}
                    onDragOver={handleDragOver}
                    className="flex flex-col min-h-0"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <h3 className="text-sm font-medium text-card-foreground">{stage.nameJa}</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        {stageDeals.length}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      ¥{stageTotal.toLocaleString()}万
                    </div>

                    <div className="flex-1 bg-accent/30 border border-border rounded-xl p-3 overflow-y-auto space-y-3">
                      {stageDeals.map(deal => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                      {stageDeals.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                          案件なし
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        会社名
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        担当者
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                        金額
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                        確度
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        ステージ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        次のアクション
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        期限
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        担当
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDeals.map(deal => {
                      const stage = stages.find(s => s.id === deal.stage);
                      const isOverdue = new Date(deal.deadline) < new Date();
                      
                      return (
                        <tr 
                          key={deal.id} 
                          onClick={() => setSelectedDealId(deal.id)}
                          className={`hover:bg-accent/50 transition-colors cursor-pointer ${
                            selectedDealId === deal.id ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-card-foreground">{deal.companyName}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-muted-foreground">{deal.contactPerson}</div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-medium text-card-foreground">
                              ¥{deal.amount.toLocaleString()}万
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full border ${stage?.lightColor} ${stage?.textColor} ${stage?.borderColor}`}>
                              {deal.probability}%
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stage?.color}`} />
                              <span className="text-sm text-card-foreground">{stage?.nameJa}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-primary">{deal.nextAction}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-card-foreground'}`}>
                              {deal.deadline}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-card-foreground">{deal.assignee}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'forecast' && (
            <div className="space-y-6 overflow-y-auto h-full">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-card-foreground">総パイプライン額</h3>
                  </div>
                  <div className="text-3xl font-bold text-card-foreground">
                    ¥{totalPipelineValue.toLocaleString()}
                    <span className="text-base text-muted-foreground ml-2">万円</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-700" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-card-foreground">加重予測額</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    ¥{Math.round(weightedForecast).toLocaleString()}
                    <span className="text-base text-green-600 ml-2">万円</span>
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    確度を考慮した予測値
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-700" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-medium text-card-foreground">総案件数</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">
                    {deals.length}
                    <span className="text-base text-blue-600 ml-2">件</span>
                  </div>
                </div>
              </div>

              {/* Stage Breakdown */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-card-foreground mb-6">ステージ別分析</h3>
                <div className="space-y-4">
                  {stages.map(stage => {
                    const stageDeals = getStageDeals(stage.id as Deal['stage']);
                    const stageTotal = getStageTotal(stage.id as Deal['stage']);
                    const stageWeighted = stageDeals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);
                    const avgProbability = stageDeals.length > 0 
                      ? stageDeals.reduce((sum, deal) => sum + deal.probability, 0) / stageDeals.length 
                      : 0;
                    const percentage = totalPipelineValue > 0 ? (stageTotal / totalPipelineValue) * 100 : 0;

                    return (
                      <div key={stage.id} className={`p-5 rounded-xl border ${stage.borderColor} ${stage.lightColor}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                            <span className="text-sm font-semibold text-card-foreground">{stage.nameJa}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${stage.borderColor} ${stage.textColor}`}>
                              {stageDeals.length}件
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold text-card-foreground">
                              ¥{Math.round(stageWeighted).toLocaleString()}万
                            </div>
                            <div className="text-xs text-muted-foreground">
                              総額: ¥{stageTotal.toLocaleString()}万 ({percentage.toFixed(0)}%)
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-white/50 rounded-full h-2.5 mb-2">
                          <div
                            className={`${stage.color} h-2.5 rounded-full transition-all`}
                            style={{ width: `${avgProbability}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">平均確度</span>
                          <span className={`font-medium ${stage.textColor}`}>{Math.round(avgProbability)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Deal Detail */}
      {selectedDeal && (
        <div className="w-96 flex-shrink-0 bg-card border border-border rounded-xl p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              {(() => {
                const stage = stages.find(s => s.id === selectedDeal.stage);
                return (
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${stage?.color}`} />
                    <span className={`text-xs font-medium ${stage?.textColor}`}>{stage?.nameJa}</span>
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full border ${stage?.lightColor} ${stage?.textColor} ${stage?.borderColor}`}>
                      確度 {selectedDeal.probability}%
                    </span>
                  </div>
                );
              })()}
              <h2 className="text-lg font-bold text-card-foreground mb-2">
                {selectedDeal.companyName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" strokeWidth={2} />
                <span>{selectedDeal.contactPerson}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">案件金額</div>
              <div className="text-2xl font-bold text-primary">
                ¥{selectedDeal.amount.toLocaleString()}
                <span className="text-base text-muted-foreground ml-1">万円</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                予測金額: ¥{Math.round(selectedDeal.amount * selectedDeal.probability / 100).toLocaleString()}万円
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase">連絡先情報</h3>
              <div className="space-y-2">
                {selectedDeal.contactEmail && (
                  <a href={`mailto:${selectedDeal.contactEmail}`} className="flex items-center gap-3 p-3 bg-background hover:bg-accent rounded-lg transition-colors group">
                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" strokeWidth={2} />
                    <span className="text-sm text-card-foreground group-hover:text-primary flex-1">
                      {selectedDeal.contactEmail}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </a>
                )}
                {selectedDeal.contactPhone && (
                  <a href={`tel:${selectedDeal.contactPhone}`} className="flex items-center gap-3 p-3 bg-background hover:bg-accent rounded-lg transition-colors group">
                    <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary" strokeWidth={2} />
                    <span className="text-sm text-card-foreground group-hover:text-primary flex-1">
                      {selectedDeal.contactPhone}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 bg-background rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" strokeWidth={2} />
                  次のアクション
                </span>
                <span className="text-sm text-primary font-medium text-right">
                  {selectedDeal.nextAction}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  期限
                </span>
                <span className={`text-sm font-medium ${
                  new Date(selectedDeal.deadline) < new Date() ? 'text-red-600' : 'text-card-foreground'
                }`}>
                  {selectedDeal.deadline}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" strokeWidth={2} />
                  担当営業
                </span>
                <span className="text-sm text-card-foreground font-medium">
                  {selectedDeal.assignee}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">最終更新</span>
                <span className="text-sm text-muted-foreground">
                  {selectedDeal.lastUpdate}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedDeal.notes && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-xs font-medium text-blue-900 mb-2">メモ</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {selectedDeal.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-border space-y-2">
              <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                案件を編集
              </button>
              <button className="w-full px-4 py-2.5 bg-background hover:bg-accent border border-border rounded-lg text-sm text-card-foreground transition-colors">
                活動履歴を見る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
