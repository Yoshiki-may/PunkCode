import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function AIProposal() {
  const [hasResult, setHasResult] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-[#1F2933]">AI提案ドラフト生成</h2>
      </div>
      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-[#52606D] text-sm mb-3">プロジェクト選択</label>
          <select className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent bg-white transition-all appearance-none cursor-pointer">
            <option>グローバルエンタープライズ - 全社導入プラン</option>
            <option>マーケティングソリューションズ - スタンダードプラン</option>
            <option>イノベーション株式会社 - プレミアムプラン</option>
            <option>株式会社ビジネスパートナー - 部門別導入</option>
          </select>
        </div>
        <div>
          <label className="block text-[#52606D] text-sm mb-3">提案プラン数</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all has-[:checked]:border-[#0C8A5F] has-[:checked]:bg-[#C5F3E5]">
              <input
                type="radio"
                name="plan-count"
                value="1"
                defaultChecked
                className="w-4 h-4 text-[#0C8A5F] focus:ring-[#0C8A5F] border-[#CBD5E1]"
              />
              <span className="text-[#1F2933]">1案</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all has-[:checked]:border-[#0C8A5F] has-[:checked]:bg-[#C5F3E5]">
              <input
                type="radio"
                name="plan-count"
                value="2"
                className="w-4 h-4 text-[#0C8A5F] focus:ring-[#0C8A5F] border-[#CBD5E1]"
              />
              <span className="text-[#1F2933]">2案</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all has-[:checked]:border-[#0C8A5F] has-[:checked]:bg-[#C5F3E5]">
              <input
                type="radio"
                name="plan-count"
                value="3"
                className="w-4 h-4 text-[#0C8A5F] focus:ring-[#0C8A5F] border-[#CBD5E1]"
              />
              <span className="text-[#1F2933]">3案</span>
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={() => setHasResult(true)}
        className="w-full bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]"
      >
        <FileText className="w-5 h-5" strokeWidth={2} />
        提案ドラフトを生成
      </button>

      {hasResult && (
        <div className="mt-8 p-6 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl">
          <h3 className="text-[#1F2933] mb-5">生成されたスライド構成案</h3>
          <div className="space-y-3 text-sm text-[#1F2933]">
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">1.</span>
              <span>エグゼクティブサマリー - 導入効果の概要</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">2.</span>
              <span>課題の整理 - 現状分析とペインポイント</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">3.</span>
              <span>ソリューション提案 - PALSS SYSTEMの機能紹介</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">4.</span>
              <span>導入プラン - フェーズ別実装ロードマップ</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">5.</span>
              <span>投資対効果 - ROI試算と期待効果</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-[#7B8794] flex-shrink-0 w-6">6.</span>
              <span>次のステップ - 導入スケジュールと体制</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
