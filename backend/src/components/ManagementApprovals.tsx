import { AlertTriangle, CheckCircle2, XCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface Approval {
  id: string;
  type: 'proposal' | 'contract' | 'budget' | 'escalation';
  title: string;
  client: string;
  requestedBy: string;
  department: string;
  amount?: string;
  priority: 'high' | 'medium' | 'low';
  requestDate: string;
  description: string;
  reason: string;
}

const typeConfig = {
  proposal: { label: '提案承認', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  contract: { label: '契約承認', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  budget: { label: '予算承認', color: 'bg-[#FEF3C7] text-[#D97706]' },
  escalation: { label: 'エスカレーション', color: 'bg-[#FEE2E2] text-[#DC2626]' },
};

const priorityConfig = {
  high: { label: '高', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  medium: { label: '中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: '低', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
};

export function ManagementApprovals() {
  const [approvals] = useState<Approval[]>([
    {
      id: '1',
      type: 'escalation',
      title: '納期延長の承認依頼',
      client: 'テックイノベーション',
      requestedBy: '山田ディレクター',
      department: 'ディレクション',
      priority: 'high',
      requestDate: '2024/12/10 14:30',
      description: 'クライアントからの追加修正依頼により、当初の納期での完了が困難な状況です。',
      reason: '追加修正3回 + 新規コンテンツ追加により、工数が当初見積もりの1.5倍に増加',
    },
    {
      id: '2',
      type: 'proposal',
      title: '新規プロジェクト提案承認',
      client: 'デジタルフロンティア株式会社',
      requestedBy: 'REONA',
      department: '営業',
      amount: '¥4,500,000',
      priority: 'high',
      requestDate: '2024/12/09 16:00',
      description: '採用ブランディング動画制作の提案書について、最終承認をお願いします。',
      reason: '予算規模が大きいため、最終承認が必要',
    },
    {
      id: '3',
      type: 'budget',
      title: '追加予算の承認',
      client: 'グローバルソリューションズ',
      requestedBy: '佐藤ディレクター',
      department: 'ディレクション',
      amount: '¥800,000',
      priority: 'medium',
      requestDate: '2024/12/08 11:20',
      description: 'プロジェクト進行中に発生した追加撮影費用の承認依頼です。',
      reason: 'クライアント要望により撮影日が1日追加',
    },
    {
      id: '4',
      type: 'contract',
      title: '契約更新の承認',
      client: 'クリエイティブワークス',
      requestedBy: '田中営業',
      department: '営業',
      amount: '¥6,000,000',
      priority: 'medium',
      requestDate: '2024/12/07 09:45',
      description: '半期契約の更新について、条件変更を含む契約書の承認をお願いします。',
      reason: '契約金額の変更があるため',
    },
    {
      id: '5',
      type: 'escalation',
      title: 'クライアントクレーム対応',
      client: 'マーケティングソリューションズ',
      requestedBy: '鈴木サポート',
      department: 'カスタマーサポート',
      priority: 'high',
      requestDate: '2024/12/10 10:00',
      description: '納品物の品質についてクレームがあり、再制作が必要な状況です。',
      reason: '重大なクレーム案件のため、経営判断が必要',
    },
  ]);

  const handleApprove = (id: string) => {
    alert(`承認ID: ${id}\n承認しました`);
  };

  const handleReject = (id: string) => {
    alert(`承認ID: ${id}\n却下しました`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">承認・エスカレーション</h1>
          <p className="text-[#7B8794]">各部門からの承認依頼とエスカレーション案件</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <div className="text-[#7B8794] text-sm">承認待ち</div>
          </div>
          <div className="text-[#1F2933] text-3xl">{approvals.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-[#DC2626]" strokeWidth={2} />
            <div className="text-[#7B8794] text-sm">高優先度</div>
          </div>
          <div className="text-[#DC2626] text-3xl">
            {approvals.filter(a => a.priority === 'high').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpRight className="w-6 h-6 text-[#DC2626]" strokeWidth={2} />
            <div className="text-[#7B8794] text-sm">エスカレーション</div>
          </div>
          <div className="text-[#DC2626] text-3xl">
            {approvals.filter(a => a.type === 'escalation').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-6 h-6 text-[#0C8A5F]" strokeWidth={2} />
            <div className="text-[#7B8794] text-sm">今月承認</div>
          </div>
          <div className="text-[#0C8A5F] text-3xl">24</div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.map((approval) => {
          const typeInfo = typeConfig[approval.type];
          const priorityInfo = priorityConfig[approval.priority];
          const isEscalation = approval.type === 'escalation';

          return (
            <div
              key={approval.id}
              className={`bg-white rounded-2xl border p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all ${
                isEscalation ? 'border-l-4 border-l-[#DC2626]' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${priorityInfo.color}`}>
                      優先度: {priorityInfo.label}
                    </span>
                    {isEscalation && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#FEE2E2] text-[#DC2626] rounded-full text-sm">
                        <AlertTriangle className="w-4 h-4" strokeWidth={2} />
                        緊急対応必要
                      </div>
                    )}
                  </div>
                  <h3 className="text-[#1F2933] mb-2">{approval.title}</h3>
                  <div className="flex items-center gap-6 text-sm text-[#7B8794] mb-4">
                    <div>クライアント: {approval.client}</div>
                    <div>申請者: {approval.requestedBy}</div>
                    <div>部門: {approval.department}</div>
                    <div>申請日時: {approval.requestDate}</div>
                  </div>
                  {approval.amount && (
                    <div className="text-[#1F2933] text-xl mb-4">金額: {approval.amount}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-5 bg-[#FAFBFC] rounded-xl">
                  <div className="text-[#7B8794] text-sm mb-2">依頼内容</div>
                  <div className="text-[#52606D]">{approval.description}</div>
                </div>
                <div className="p-5 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
                  <div className="text-[#D97706] text-sm mb-2">承認が必要な理由</div>
                  <div className="text-[#52606D]">{approval.reason}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
                <button
                  onClick={() => handleApprove(approval.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]"
                >
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                  承認する
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626] rounded-xl transition-all"
                >
                  <XCircle className="w-5 h-5" strokeWidth={2} />
                  却下する
                </button>
                <button className="ml-auto px-6 py-3 bg-white hover:bg-[#F9FAFB] text-[#52606D] border border-[#E5E7EB] rounded-xl transition-all">
                  詳細を確認
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
