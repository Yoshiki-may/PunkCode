import { AlertCircle, Plus, PauseCircle } from 'lucide-react';

interface FollowUp {
  id: string;
  company: string;
  lastProposal: string;
  daysElapsed: number;
  amount: string;
}

export function FollowUpAlerts() {
  const followUps: FollowUp[] = [
    {
      id: '1',
      company: 'マーケティングソリューションズ',
      lastProposal: '11/08',
      daysElapsed: 32,
      amount: '¥4,200,000',
    },
    {
      id: '2',
      company: '株式会社トレードマスター',
      lastProposal: '11/15',
      daysElapsed: 25,
      amount: '¥6,800,000',
    },
    {
      id: '3',
      company: 'テック・インダストリーズ',
      lastProposal: '11/22',
      daysElapsed: 18,
      amount: '¥1,500,000',
    },
    {
      id: '4',
      company: '株式会社ビジネスパートナー',
      lastProposal: '11/28',
      daysElapsed: 12,
      amount: '¥2,800,000',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="w-5 h-5 text-[#D97706]" strokeWidth={2} />
        <h2 className="text-[#1F2933]">追客アラート</h2>
      </div>
      <div className="space-y-1">
        {followUps.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
              index % 2 === 0 ? 'hover:bg-[#F9FAFB]' : 'bg-[#FAFBFC] hover:bg-[#F9FAFB]'
            }`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1F2933] mb-2">{item.company}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#7B8794]">{item.lastProposal}</span>
                <span
                  className={`px-2.5 py-1 rounded-full ${
                    item.daysElapsed > 30
                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                      : item.daysElapsed > 20
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#C5F3E5] text-[#0C8A5F]'
                  }`}
                >
                  +{item.daysElapsed}日
                </span>
                <span className="text-[#1F2933]">{item.amount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                className="p-2.5 hover:bg-[#C5F3E5] rounded-xl transition-all" 
                title="追客タスクを作成"
              >
                <Plus className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
              </button>
              <button 
                className="p-2.5 hover:bg-[#F3F4F6] rounded-xl transition-all" 
                title="保留にする"
              >
                <PauseCircle className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
