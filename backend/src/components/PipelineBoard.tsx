import { Calendar } from 'lucide-react';

interface DealCard {
  id: string;
  company: string;
  dealName: string;
  probability: 'High' | 'Mid' | 'Low';
  amount: string;
  nextAction: string;
}

interface PipelineColumn {
  title: string;
  count: number;
  deals: DealCard[];
}

function DealCard({ deal }: { deal: DealCard }) {
  const probabilityColors = {
    High: 'bg-[#C5F3E5] text-[#0C8A5F] border-[#0C8A5F]',
    Mid: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]',
    Low: 'bg-[#E0E7FF] text-[#4F46E5] border-[#4F46E5]',
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-3 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:border-[#0C8A5F] transition-all cursor-grab active:cursor-grabbing">
      <h3 className="text-[#1F2933] mb-1.5">{deal.company}</h3>
      <div className="text-[#7B8794] text-sm mb-4">{deal.dealName}</div>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs border ${probabilityColors[deal.probability]}`}
        >
          {deal.probability}
        </span>
        <span className="text-[#1F2933]">{deal.amount}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#7B8794]">
        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
        <span>{deal.nextAction}</span>
      </div>
    </div>
  );
}

function PipelineColumn({ column }: { column: PipelineColumn }) {
  return (
    <div className="flex-1 min-w-[220px]">
      <div className="bg-[#F9FAFB] rounded-t-xl px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <h3 className="text-[#1F2933]">{column.title}</h3>
          <span className="bg-white px-3 py-1 rounded-full text-sm text-[#52606D] border border-[#E5E7EB]">
            {column.count}
          </span>
        </div>
      </div>
      <div className="bg-[#FAFBFC] p-4 rounded-b-xl min-h-[450px]">
        {column.deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const columns: PipelineColumn[] = [
    {
      title: 'リード',
      count: 8,
      deals: [
        {
          id: '1',
          company: '株式会社サンプル商事',
          dealName: 'CRMシステム導入',
          probability: 'Mid',
          amount: '¥3,200,000',
          nextAction: '12/12 初回訪問',
        },
        {
          id: '2',
          company: 'テック・インダストリーズ',
          dealName: 'セールスツール検討',
          probability: 'Low',
          amount: '¥1,500,000',
          nextAction: '12/15 ヒアリング',
        },
      ],
    },
    {
      title: '商談中',
      count: 12,
      deals: [
        {
          id: '3',
          company: 'グローバルエンタープライズ',
          dealName: '全社導入プラン',
          probability: 'High',
          amount: '¥8,500,000',
          nextAction: '12/11 デモ実施',
        },
        {
          id: '4',
          company: '株式会社ビジネスパートナー',
          dealName: '部門別導入',
          probability: 'Mid',
          amount: '¥2,800,000',
          nextAction: '12/13 要件定義',
        },
      ],
    },
    {
      title: '提案送付済',
      count: 7,
      deals: [
        {
          id: '5',
          company: 'マーケティングソリューションズ',
          dealName: 'スタンダードプラン',
          probability: 'High',
          amount: '¥4,200,000',
          nextAction: '12/14 フォローアップ',
        },
        {
          id: '6',
          company: '株式会社トレードマスター',
          dealName: 'エンタープライズ版',
          probability: 'Mid',
          amount: '¥6,800,000',
          nextAction: '12/16 質疑応答',
        },
      ],
    },
    {
      title: '合意待ち',
      count: 5,
      deals: [
        {
          id: '7',
          company: 'イノベーション株式会社',
          dealName: 'プレミアムプラン',
          probability: 'High',
          amount: '¥5,500,000',
          nextAction: '12/11 契約確認',
        },
      ],
    },
    {
      title: '受注',
      count: 23,
      deals: [
        {
          id: '8',
          company: 'デジタルフロンティア',
          dealName: '年間契約',
          probability: 'High',
          amount: '¥9,200,000',
          nextAction: '12/10 キックオフ',
        },
      ],
    },
    {
      title: '失注',
      count: 11,
      deals: [
        {
          id: '9',
          company: '株式会社コンペティター選定',
          dealName: 'プラン比較検討',
          probability: 'Low',
          amount: '¥2,100,000',
          nextAction: '失注理由分析',
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <h2 className="text-[#1F2933] mb-8">営業パイプラインボード</h2>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {columns.map((column) => (
          <PipelineColumn key={column.title} column={column} />
        ))}
      </div>
    </div>
  );
}
