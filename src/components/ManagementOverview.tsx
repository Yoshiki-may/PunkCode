import { TrendingUp, Users, Briefcase, DollarSign, BarChart3, Activity } from 'lucide-react';

export function ManagementOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">組織全体俯瞰</h1>
        <p className="text-[#7B8794]">全部門の状況を一目で把握</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">総クライアント数</div>
          <div className="text-[#1F2933] text-3xl mb-1">42</div>
          <div className="text-[#0C8A5F] text-sm">+8% from last month</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">進行中プロジェクト</div>
          <div className="text-[#1F2933] text-3xl mb-1">18</div>
          <div className="text-[#0C8A5F] text-sm">+3 new this week</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">月間売上</div>
          <div className="text-[#1F2933] text-3xl mb-1">¥24.5M</div>
          <div className="text-[#0C8A5F] text-sm">+12% from last month</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-[#DB2777]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">チーム稼働率</div>
          <div className="text-[#1F2933] text-3xl mb-1">87%</div>
          <div className="text-[#0C8A5F] text-sm">Optimal range</div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">部門別状況</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#F3F4F6]">
            <h4 className="text-[#1F2933] mb-4">営業部門</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">テレアポ件数</span>
                <span className="text-[#1F2933]">156件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">アポ獲得率</span>
                <span className="text-[#0C8A5F]">32%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">商談進行中</span>
                <span className="text-[#1F2933]">24件</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#F3F4F6]">
            <h4 className="text-[#1F2933] mb-4">ディレクション部門</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">管理プロジェクト</span>
                <span className="text-[#1F2933]">18件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">納期遵守率</span>
                <span className="text-[#0C8A5F]">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">リソース使用率</span>
                <span className="text-[#1F2933]">85%</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-[#FAFBFC] rounded-xl border border-[#F3F4F6]">
            <h4 className="text-[#1F2933] mb-4">編集部門</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">編集中タスク</span>
                <span className="text-[#1F2933]">12件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">完了タスク（今月）</span>
                <span className="text-[#0C8A5F]">48件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B8794]">平均納品時間</span>
                <span className="text-[#1F2933]">4.2日</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Items */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-6">重要アラート</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#FEF2F2] rounded-xl border border-[#FEE2E2]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#DC2626] rounded-full"></div>
                <span className="text-[#DC2626]">納期遅延リスク</span>
              </div>
              <p className="text-[#52606D] text-sm">テックイノベーション案件が遅延の可能性</p>
            </div>
            <div className="p-4 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#D97706] rounded-full"></div>
                <span className="text-[#D97706]">承認待ち</span>
              </div>
              <p className="text-[#52606D] text-sm">3件の提案が承認待ち状態</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-6">今週のハイライト</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#C5F3E5] rounded-xl border border-[#9FE8D1]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#0C8A5F] rounded-full"></div>
                <span className="text-[#0C8A5F]">新規契約</span>
              </div>
              <p className="text-[#52606D] text-sm">5社の新規契約を締結</p>
            </div>
            <div className="p-4 bg-[#E0E7FF] rounded-xl border border-[#C7D2FE]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                <span className="text-[#4F46E5]">プロジェクト完了</span>
              </div>
              <p className="text-[#52606D] text-sm">8件のプロジェクトが成功裏に完了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
