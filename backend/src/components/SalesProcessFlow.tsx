import { Phone, Calendar, Search, FileText, MessageSquare, FileCheck, CheckCircle, ArrowRight } from 'lucide-react';

interface ProcessStage {
  id: string;
  name: string;
  icon: any;
  count: number;
  completed: number;
  color: string;
}

export function SalesProcessFlow() {
  const stages: ProcessStage[] = [
    {
      id: 'telemarketing',
      name: 'テレアポ',
      icon: Phone,
      count: 8,
      completed: 5,
      color: 'bg-[#E0E7FF] text-[#4F46E5]',
    },
    {
      id: 'appointment',
      name: 'アポ確定',
      icon: Calendar,
      count: 5,
      completed: 3,
      color: 'bg-[#C5F3E5] text-[#0C8A5F]',
    },
    {
      id: 'research',
      name: '企業リサーチ',
      icon: Search,
      count: 3,
      completed: 2,
      color: 'bg-[#FEF3C7] text-[#D97706]',
    },
    {
      id: 'meeting-notes',
      name: '議事録作成',
      icon: FileText,
      count: 2,
      completed: 1,
      color: 'bg-[#E0E7FF] text-[#4F46E5]',
    },
    {
      id: 'chatbot',
      name: 'ヒアリングBot',
      icon: MessageSquare,
      count: 1,
      completed: 1,
      color: 'bg-[#FED7E2] text-[#DB2777]',
    },
    {
      id: 'proposal',
      name: '提案資料',
      icon: FileCheck,
      count: 1,
      completed: 0,
      color: 'bg-[#C5F3E5] text-[#0C8A5F]',
    },
  ];

  const completionRate = Math.round(
    (stages.reduce((acc, stage) => acc + stage.completed, 0) /
      stages.reduce((acc, stage) => acc + stage.count, 0)) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#1F2933] mb-2">営業プロセスフロー</h2>
            <p className="text-[#7B8794]">テレアポから提案資料作成までの進捗状況</p>
          </div>
          <div className="text-right">
            <div className="text-[#7B8794] text-sm mb-1">全体完了率</div>
            <div className="text-4xl text-[#0C8A5F]">{completionRate}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#F3F4F6] rounded-full h-3 overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>

        {/* Process Stages */}
        <div className="flex items-center justify-between gap-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = stage.completed === stage.count;
            const progress = stage.count > 0 ? (stage.completed / stage.count) * 100 : 0;

            return (
              <div key={stage.id} className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <div
                    className={`${stage.color} rounded-2xl p-6 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
                      )}
                    </div>
                    <h3 className="mb-3">{stage.name}</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>
                        {stage.completed} / {stage.count}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="bg-white/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-current h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-[#CBD5E1] flex-shrink-0" strokeWidth={2} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Details */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-4">今週のアクション</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-xl">
              <div className="text-[#52606D] text-sm">テレアポ実施</div>
              <div className="text-[#1F2933]">8件</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-xl">
              <div className="text-[#52606D] text-sm">アポ調整中</div>
              <div className="text-[#1F2933]">5件</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-xl">
              <div className="text-[#52606D] text-sm">提案資料作成中</div>
              <div className="text-[#1F2933]">1件</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-4">ボトルネック</h3>
          <div className="space-y-3">
            <div className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl">
              <div className="text-[#DC2626] text-sm mb-1">企業リサーチ遅延</div>
              <div className="text-[#7B8794] text-xs">平均3日 → 5日に増加</div>
            </div>
            <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
              <div className="text-[#D97706] text-sm mb-1">議事録作成待ち</div>
              <div className="text-[#7B8794] text-xs">2件が未完了</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-4">今月の実績</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#C5F3E5] rounded-xl">
              <div className="text-[#0C8A5F] text-sm">完了プロセス</div>
              <div className="text-[#0C8A5F]">23件</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-xl">
              <div className="text-[#52606D] text-sm">平均所要日数</div>
              <div className="text-[#1F2933]">12日</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-xl">
              <div className="text-[#52606D] text-sm">成約率</div>
              <div className="text-[#1F2933]">48.9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
