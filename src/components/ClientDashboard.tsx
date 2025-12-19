import { Video, CheckSquare, Calendar, MessageSquare, TrendingUp, Clock, AlertCircle, Bell } from 'lucide-react';

export function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 border border-[#FDE047]">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#D97706] flex-shrink-0 mt-1" strokeWidth={2} />
          <div className="flex-1">
            <h3 className="text-[#92400E] mb-2">アクションが必要です</h3>
            <p className="text-[#92400E] text-sm mb-3">
              2件の動画承認と1件の素材提出が期限間近です。早めの対応をお願いします。
            </p>
            <button className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl transition-all text-sm">
              今すぐ確認
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <Video className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
            <div className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] rounded-full text-xs">
              2件 確認待ち
            </div>
          </div>
          <div className="text-[#7B8794] text-sm mb-2">動画確認</div>
          <div className="text-[#1F2933] text-3xl">5件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <CheckSquare className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
            <div className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] rounded-full text-xs">
              1件 期限超過
            </div>
          </div>
          <div className="text-[#7B8794] text-sm mb-2">クライアントタスク</div>
          <div className="text-[#1F2933] text-3xl">4件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">議事録</div>
          <div className="text-[#1F2933] text-3xl">12件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-[#059669]" strokeWidth={2} />
            <div className="px-2 py-1 bg-[#C5F3E5] text-[#0C8A5F] rounded-full text-xs">
              +18%
            </div>
          </div>
          <div className="text-[#7B8794] text-sm mb-2">今月の成果</div>
          <div className="text-[#1F2933] text-3xl">72K</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1F2933]">承認待ち動画</h3>
            <button className="text-[#0C8A5F] hover:text-[#0A6F4E] text-sm transition-colors">
              すべて見る →
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] transition-all cursor-pointer">
              <div className="w-24 h-16 bg-[#1F2933] rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200"
                  alt="video"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-[#1F2933] text-sm mb-1">採用ブランディング動画_ver1</h4>
                <div className="flex items-center gap-3 text-xs text-[#7B8794]">
                  <span>YouTube</span>
                  <span>•</span>
                  <span>2:45</span>
                  <span>•</span>
                  <span className="text-[#DC2626]">期限: 12/15</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-lg text-sm transition-all">
                  確認
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] transition-all cursor-pointer">
              <div className="w-24 h-16 bg-[#1F2933] rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200"
                  alt="video"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-[#1F2933] text-sm mb-1">商品紹介_ショート動画_A</h4>
                <div className="flex items-center gap-3 text-xs text-[#7B8794]">
                  <span>Instagram</span>
                  <span>•</span>
                  <span>0:30</span>
                  <span>•</span>
                  <span className="text-[#D97706]">期限: 12/12</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs">
                  確認中
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1F2933]">今週の予定</h3>
            <Calendar className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          </div>
          <div className="space-y-4">
            <div className="pb-4 border-b border-[#F3F4F6]">
              <div className="text-[#0C8A5F] text-sm mb-2">12月11日（水）</div>
              <div className="text-[#1F2933] mb-1">月次レポート会議</div>
              <div className="text-[#7B8794] text-xs">14:00 - 15:00</div>
            </div>
            <div className="pb-4 border-b border-[#F3F4F6]">
              <div className="text-[#7B8794] text-sm mb-2">12月13日（金）</div>
              <div className="text-[#1F2933] mb-1">撮影前打ち合わせ</div>
              <div className="text-[#7B8794] text-xs">10:00 - 11:00</div>
            </div>
            <div>
              <div className="text-[#7B8794] text-sm mb-2">12月16日（月）</div>
              <div className="text-[#1F2933] mb-1">1月施策の相談</div>
              <div className="text-[#7B8794] text-xs">15:00 - 16:00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Your Tasks */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1F2933]">あなたのタスク</h3>
            <button className="text-[#0C8A5F] hover:text-[#0A6F4E] text-sm transition-colors">
              すべて見る →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-[#FEE2E2] rounded-xl border border-[#FEE2E2]">
              <Clock className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[#DC2626] text-sm">撮影用素材の提供</h4>
                  <span className="px-2 py-0.5 bg-[#DC2626] text-white rounded-full text-xs">
                    期限超過
                  </span>
                </div>
                <p className="text-[#92400E] text-xs">期限: 2024/12/12</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB]">
              <CheckSquare className="w-5 h-5 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <h4 className="text-[#1F2933] text-sm mb-1">TikTokアカウント開設手続き</h4>
                <p className="text-[#7B8794] text-xs">期限: 2024/12/15</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB]">
              <CheckSquare className="w-5 h-5 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <h4 className="text-[#1F2933] text-sm mb-1">採用動画の最終確認・承認</h4>
                <p className="text-[#7B8794] text-xs">期限: 2024/12/14</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1F2933]">最近の更新</h3>
            <Bell className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-[#0C8A5F] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-[#1F2933] text-sm mb-1">新しい動画がアップロードされました</p>
                <p className="text-[#7B8794] text-xs">採用ブランディング動画_ver1 • 2時間前</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-[#1F2933] text-sm mb-1">議事録が更新されました</p>
                <p className="text-[#7B8794] text-xs">12月度 月次レポート会議 • 5時間前</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-[#D97706] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-[#1F2933] text-sm mb-1">新しいタスクが追加されました</p>
                <p className="text-[#7B8794] text-xs">1月のTikTok運用スケジュール案の作成 • 昨日</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-[#0C8A5F] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-[#1F2933] text-sm mb-1">動画が承認されました</p>
                <p className="text-[#7B8794] text-xs">12月キャンペーン_メイン動画 • 2日前</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Summary */}
      <div className="bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-2">今月のパフォーマンス</h3>
            <p className="text-white/80 text-sm">11月の成果サマリー</p>
          </div>
          <TrendingUp className="w-12 h-12 text-white/80" strokeWidth={1.5} />
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-white/80 text-sm mb-2">総視聴回数</div>
            <div className="text-white text-2xl mb-1">72,000</div>
            <div className="text-white/90 text-xs">+18% vs 先月</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-white/80 text-sm mb-2">エンゲージメント</div>
            <div className="text-white text-2xl mb-1">6,050</div>
            <div className="text-white/90 text-xs">+24% vs 先月</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-white/80 text-sm mb-2">平均ER</div>
            <div className="text-white text-2xl mb-1">4.8%</div>
            <div className="text-white/90 text-xs">+0.6pt vs 先月</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="text-white/80 text-sm mb-2">コンバージョン</div>
            <div className="text-white text-2xl mb-1">210</div>
            <div className="text-white/90 text-xs">+18% vs 先月</div>
          </div>
        </div>
      </div>
    </div>
  );
}