import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, Calendar, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ClientAIReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAIChat, setShowAIChat] = useState(false);

  const monthlyData = [
    { month: '7月', views: 45000, engagement: 3800, conversions: 120 },
    { month: '8月', views: 52000, engagement: 4200, conversions: 145 },
    { month: '9月', views: 48000, engagement: 3950, conversions: 132 },
    { month: '10月', views: 61000, engagement: 5100, conversions: 178 },
    { month: '11月', views: 72000, engagement: 6050, conversions: 210 },
  ];

  const platformData = [
    { platform: 'YouTube', views: 38000, engagement: 4.2, conversions: 95 },
    { platform: 'Instagram', views: 24000, engagement: 5.8, conversions: 78 },
    { platform: 'TikTok', views: 10000, engagement: 7.5, conversions: 37 },
  ];

  const topVideos = [
    {
      id: '1',
      title: '採用ブランディング_メインビデオ',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
      platform: 'YouTube',
      views: 12500,
      engagement: 5.2,
      conversions: 42,
    },
    {
      id: '2',
      title: '商品紹介_ショート動画A',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
      platform: 'Instagram',
      views: 8900,
      engagement: 6.8,
      conversions: 28,
    },
    {
      id: '3',
      title: 'TikTok_トレンド投稿001',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
      platform: 'TikTok',
      views: 7200,
      engagement: 8.1,
      conversions: 19,
    },
  ];

  const aiInsights = [
    {
      type: 'positive',
      title: 'Instagram Reelsが好調',
      description: 'エンゲージメント率が前月比+24%。特に20代女性層からの反応が良好です。',
      recommendation: 'Reels形式のコンテンツを週3本→5本に増やすことを推奨します。',
    },
    {
      type: 'warning',
      title: 'YouTube平均視聴時間が低下',
      description: '平均視聴時間が2:45→2:12に減少。動画の長さに対する視聴完了率が下がっています。',
      recommendation: '動画の尺を3分以内に抑え、冒頭5秒でフックを強化することを提案します。',
    },
    {
      type: 'opportunity',
      title: 'TikTok参入のタイミング',
      description: '競合他社のTikTok活用が少ない今が参入チャンスです。',
      recommendation: '1月からのTikTok本格運用で先行者利益を獲得できる可能性が高いです。',
    },
  ];

  const quickQuestions = [
    '今月の結果を簡単に教えて',
    'どの動画が一番成果が良かった？',
    'PALSSさん側で今動いているタスクは？',
    '自分たちがやるべきことは？',
    '来月の改善案を教えて',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">PALSS AI レポート</h1>
          <p className="text-[#7B8794]">AIによる成果分析とインサイト</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
          >
            <option value="week">過去1週間</option>
            <option value="month">過去1ヶ月</option>
            <option value="quarter">過去3ヶ月</option>
            <option value="year">過去1年</option>
          </select>
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            AIに質問
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">総視聴回数</div>
          <div className="text-[#1F2933] text-3xl mb-1">72,000</div>
          <div className="text-[#0C8A5F] text-sm">+18% from last month</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-[#DC2626]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">エンゲージメント</div>
          <div className="text-[#1F2933] text-3xl mb-1">6,050</div>
          <div className="text-[#0C8A5F] text-sm">+24% from last month</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">平均エンゲージメント率</div>
          <div className="text-[#1F2933] text-3xl mb-1">4.8%</div>
          <div className="text-[#0C8A5F] text-sm">+0.6pt from last month</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
            <TrendingUp className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">コンバージョン</div>
          <div className="text-[#1F2933] text-3xl mb-1">210</div>
          <div className="text-[#0C8A5F] text-sm">+18% from last month</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8" strokeWidth={2} />
          <h2 className="text-white">AIインサイト</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                {insight.type === 'positive' && (
                  <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                )}
                {insight.type === 'warning' && (
                  <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                )}
                {insight.type === 'opportunity' && (
                  <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
                )}
                <h3 className="text-white">{insight.title}</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">{insight.description}</p>
              <div className="pt-4 border-t border-white/20">
                <div className="text-white/70 text-xs mb-2">推奨アクション</div>
                <p className="text-white/90 text-sm">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-6">月次トレンド</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#7B8794" />
              <YAxis stroke="#7B8794" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} name="視聴回数" />
              <Line type="monotone" dataKey="engagement" stroke="#0C8A5F" strokeWidth={2} name="エンゲージメント" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h3 className="text-[#1F2933] mb-6">プラットフォーム別パフォーマンス</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="platform" stroke="#7B8794" />
              <YAxis stroke="#7B8794" />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#4F46E5" name="視聴回数" />
              <Bar dataKey="conversions" fill="#0C8A5F" name="コンバージョン" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Videos */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">パフォーマンストップ3</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {topVideos.map((video, index) => (
            <div key={video.id} className="relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-full flex items-center justify-center text-white z-10">
                {index + 1}
              </div>
              <div className="bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="aspect-video bg-[#1F2933] overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h4 className="text-[#1F2933] text-sm mb-3 line-clamp-2">{video.title}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#7B8794]">プラットフォーム</span>
                      <span className="text-[#52606D]">{video.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7B8794]">視聴回数</span>
                      <span className="text-[#52606D]">{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7B8794]">エンゲージメント率</span>
                      <span className="text-[#0C8A5F]">{video.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7B8794]">コンバージョン</span>
                      <span className="text-[#52606D]">{video.conversions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Panel */}
      {showAIChat && (
        <div className="fixed bottom-8 right-8 w-96 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_40px_0_rgba(0,0,0,0.15)] z-50">
          <div className="p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                <h3 className="text-white">AIアシスタント</h3>
              </div>
              <button onClick={() => setShowAIChat(false)} className="text-white hover:text-white/80">
                ✕
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-[#7B8794] text-sm mb-3">よく使う質問:</p>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#52606D] text-sm rounded-lg transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#E5E7EB]">
              <textarea
                placeholder="AIに質問してみましょう..."
                className="w-full p-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent resize-none"
                rows={3}
              />
              <button className="w-full mt-2 px-4 py-2 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all text-sm">
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
