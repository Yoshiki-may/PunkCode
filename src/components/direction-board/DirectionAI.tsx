import { Sparkles, Video, Lightbulb, FileText, Presentation, ArrowRight, Check, Loader2, ChevronRight, Building2, Search } from 'lucide-react';
import { useState } from 'react';

type AIFunction = 'planning' | 'script' | 'ideas' | 'document';
type StepStatus = 'idle' | 'processing' | 'completed';

interface ProcessStep {
  id: string;
  label: string;
  status: StepStatus;
}

const planningSteps: ProcessStep[] = [
  { id: '1', label: 'クライアント情報を分析', status: 'idle' },
  { id: '2', label: 'ターゲットオーディエンスを特定', status: 'idle' },
  { id: '3', label: 'トレンドとインサイトを収集', status: 'idle' },
  { id: '4', label: 'コンテンツ企画を生成', status: 'idle' },
  { id: '5', label: 'KPI目標を設定', status: 'idle' },
];

const scriptSteps: ProcessStep[] = [
  { id: '1', label: '企画内容を分析', status: 'idle' },
  { id: '2', label: 'ターゲット視聴者を特定', status: 'idle' },
  { id: '3', label: 'ストーリー構成を作成', status: 'idle' },
  { id: '4', label: 'セリフとナレーションを生成', status: 'idle' },
  { id: '5', label: '演出指示を追加', status: 'idle' },
];

const ideasSteps: ProcessStep[] = [
  { id: '1', label: 'ブランド特性を分析', status: 'idle' },
  { id: '2', label: '最新トレンドをスキャン', status: 'idle' },
  { id: '3', label: '競合コンテンツを調査', status: 'idle' },
  { id: '4', label: 'クリエイティブアイデアを生成', status: 'idle' },
  { id: '5', label: '実行プランを提案', status: 'idle' },
];

const documentSteps: ProcessStep[] = [
  { id: '1', label: 'プロジェクトデータを収集', status: 'idle' },
  { id: '2', label: 'KPI実績を分析', status: 'idle' },
  { id: '3', label: 'インサイトを抽出', status: 'idle' },
  { id: '4', label: '資料構成を作成', status: 'idle' },
  { id: '5', label: 'ビジュアル資料を生成', status: 'idle' },
];

export function DirectionAI() {
  const [selectedClient, setSelectedClient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<AIFunction | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const clients = [
    { id: 'axas', name: 'AXAS株式会社' },
    { id: 'baymax', name: 'BAYMAX株式会社' },
    { id: 'digital', name: 'デジタルフロンティア' },
    { id: 'creative', name: 'クリエイティブワークス' },
    { id: 'marketing', name: 'マーケティングラボ' },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setSearchQuery(clients.find(c => c.id === clientId)?.name || '');
  };

  const handleFeatureClick = (featureId: AIFunction) => {
    if (!selectedClient) {
      alert('最初にクライアントを選択してください');
      return;
    }
    
    setSelectedFeature(featureId);
    
    // Select appropriate steps based on feature
    let steps: ProcessStep[] = [];
    switch (featureId) {
      case 'planning':
        steps = planningSteps;
        break;
      case 'script':
        steps = scriptSteps;
        break;
      case 'ideas':
        steps = ideasSteps;
        break;
      case 'document':
        steps = documentSteps;
        break;
    }
    
    setProcessSteps(steps.map(s => ({ ...s, status: 'idle' })));
    setCurrentStepIndex(-1);
    setIsProcessing(false);
  };

  const handleStartGeneration = () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    
    // Simulate step-by-step processing
    processNextStep(0);
  };

  const processNextStep = (stepIndex: number) => {
    if (stepIndex >= processSteps.length) {
      setIsProcessing(false);
      return;
    }

    // Mark current step as processing
    setProcessSteps(prev => 
      prev.map((step, idx) => ({
        ...step,
        status: idx === stepIndex ? 'processing' : step.status
      }))
    );

    // Simulate processing time
    setTimeout(() => {
      // Mark current step as completed
      setProcessSteps(prev => 
        prev.map((step, idx) => ({
          ...step,
          status: idx === stepIndex ? 'completed' : step.status
        }))
      );

      setCurrentStepIndex(stepIndex + 1);
      processNextStep(stepIndex + 1);
    }, 1500);
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" strokeWidth={2} />;
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />;
      default:
        return <div className="w-2 h-2 rounded-full bg-muted" />;
    }
  };

  if (selectedFeature) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedFeature(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" strokeWidth={2} />
          <span>戻る</span>
        </button>

        {/* Feature Processing */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-xl text-card-foreground mb-2">
                  {selectedFeature === 'planning' && '企画作成'}
                  {selectedFeature === 'script' && '台本作成'}
                  {selectedFeature === 'ideas' && 'アイデア生成'}
                  {selectedFeature === 'document' && '資料作成'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedClient && clients.find(c => c.id === selectedClient)?.name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-card-foreground mb-2">
                    追加情報・要望（任意）
                  </label>
                  <textarea
                    placeholder="AIに伝えたい追加情報や要望を入力してください..."
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  onClick={handleStartGeneration}
                  disabled={isProcessing}
                  className="w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" strokeWidth={2} />
                  <span>AI生成を開始</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Process Status */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm text-card-foreground mb-4">生成プロセス</h3>
              
              <div className="space-y-3">
                {processSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      step.status === 'processing' 
                        ? 'bg-primary/5 border border-primary/20' 
                        : step.status === 'completed'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${
                        step.status === 'idle' 
                          ? 'text-muted-foreground' 
                          : 'text-card-foreground'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentStepIndex >= processSteps.length && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                    <span className="text-sm font-medium text-green-900">生成完了</span>
                  </div>
                  <p className="text-xs text-green-700">
                    AIによる生成が完了しました。結果を確認してください。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#FFF5F7] to-[#F0FFF4] -m-6 p-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-purple-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-green-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-pink-300/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[40px] text-[#1a1a1a] mb-2 tracking-tight">PALSS AI SYSTEM</h1>
          <p className="text-[15px] text-[#666666]">クライアントの未来を、AIと共に描く</p>
        </div>

        {/* Search Bar */}
        <div className="mb-16">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="クライアントを検索して指定..."
              className="w-full px-6 py-4 pr-14 bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-full text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
              <ChevronRight className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
            </button>

            {/* Search Dropdown */}
            {searchQuery && !selectedClient && filteredClients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-[#E5E7EB] rounded-2xl shadow-lg overflow-hidden z-10">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client.id)}
                    className="w-full px-6 py-3 text-left hover:bg-[#F8F9FA] transition-colors flex items-center gap-3"
                  >
                    <Building2 className="w-4 h-4 text-[#9CA3AF]" strokeWidth={2} />
                    <span className="text-sm text-[#1a1a1a]">{client.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Feature Cards */}
        <div className="grid grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* 企画作成 */}
          <button
            onClick={() => handleFeatureClick('planning')}
            disabled={!selectedClient}
            className="bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-3xl p-10 text-center hover:shadow-xl hover:border-[#E0E0E0] hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
              <FileText className="w-9 h-9 text-[#3B82F6]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] text-[#1a1a1a] mb-2.5">企画作成</h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              SNSキャンペーン、コンテンツ企画を自動生成します
            </p>
          </button>

          {/* 台本作成 */}
          <button
            onClick={() => handleFeatureClick('script')}
            disabled={!selectedClient}
            className="bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-3xl p-10 text-center hover:shadow-xl hover:border-[#E0E0E0] hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#E8F5F0] flex items-center justify-center group-hover:bg-[#D1EBE3] transition-colors">
              <Video className="w-9 h-9 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] text-[#1a1a1a] mb-2.5">台本作成</h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              動画・コンテンツの台本とシナリオを自動生成します
            </p>
          </button>

          {/* アイデア生成 */}
          <button
            onClick={() => handleFeatureClick('ideas')}
            disabled={!selectedClient}
            className="bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-3xl p-10 text-center hover:shadow-xl hover:border-[#E0E0E0] hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#FEF3C7] flex items-center justify-center group-hover:bg-[#FDE68A] transition-colors">
              <Lightbulb className="w-9 h-9 text-[#F59E0B]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] text-[#1a1a1a] mb-2.5">アイデア生成</h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              クリエイティブなコンセプトとアプローチを提案します
            </p>
          </button>

          {/* 資料作成 */}
          <button
            onClick={() => handleFeatureClick('document')}
            disabled={!selectedClient}
            className="bg-white/80 backdrop-blur-sm border border-[#E5E7EB] rounded-3xl p-10 text-center hover:shadow-xl hover:border-[#E0E0E0] hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#F3E8FF] flex items-center justify-center group-hover:bg-[#E9D5FF] transition-colors">
              <Presentation className="w-9 h-9 text-[#A855F7]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] text-[#1a1a1a] mb-2.5">資料作成</h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              プレゼン資料、レポートを自動生成します
            </p>
          </button>
        </div>

        {/* Bottom Message */}
        <div className="text-center">
          <p className="text-[13px] text-[#999999]">
            {selectedClient 
              ? `${clients.find(c => c.id === selectedClient)?.name}のAI機能をご利用いただけます` 
              : 'クライアントを選択してAI機能をご利用ください'
            }
          </p>
        </div>
      </div>
    </div>
  );
}