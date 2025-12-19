import { TrendingUp, Lightbulb, Filter, Play, Heart, MessageCircle, Share2, Eye, Instagram, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface TrendVideo {
  id: string;
  platform: 'instagram' | 'tiktok';
  title: string;
  description: string;
  thumbnailUrl: string;
  creator: string;
  postedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  category: string;
  trendScore: number;
}

interface MarketingIdea {
  id: string;
  title: string;
  description: string;
  industry: string;
  successRate: string;
  implementationCost: string;
  expectedROI: string;
  examples: string[];
}

const platformConfig = {
  instagram: { icon: Instagram, label: 'Instagram', color: 'bg-[#FED7E2] text-[#DB2777]' },
  tiktok: { icon: Smartphone, label: 'TikTok', color: 'bg-[#1F2937] text-[#F9FAFB]' },
};

export function SNSNews() {
  const [activeTab, setActiveTab] = useState<'trends' | 'ideas'>('trends');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const trendVideos: TrendVideo[] = [
    {
      id: '1',
      platform: 'instagram',
      title: '企業文化を伝えるオフィスツアーリール',
      description: '社員の日常をドキュメンタリー風に撮影。自然な雰囲気で企業の魅力を伝える手法がトレンド。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      creator: '@techstartup_daily',
      postedAt: '2日前',
      engagement: { likes: 24800, comments: 342, shares: 1240, views: 156000 },
      category: '企業ブランディング',
      trendScore: 95,
    },
    {
      id: '2',
      platform: 'tiktok',
      title: '「1日の密着」社員インタビューシリーズ',
      description: '若手社員の1日を追う短編シリーズ。リアルな働き方を見せることで共感を獲得。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
      creator: '@creative_works_jp',
      postedAt: '5日前',
      engagement: { likes: 89200, comments: 1520, shares: 4320, views: 680000 },
      category: '採用マーケティング',
      trendScore: 92,
    },
    {
      id: '3',
      platform: 'instagram',
      title: 'ビフォーアフター形式のプロジェクト紹介',
      description: '制作過程を見せることでプロフェッショナル性をアピール。透明性が信頼を生む。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      creator: '@design_studio_tokyo',
      postedAt: '1週間前',
      engagement: { likes: 15600, comments: 248, shares: 892, views: 98000 },
      category: 'ポートフォリオ',
      trendScore: 88,
    },
    {
      id: '4',
      platform: 'tiktok',
      title: '「こんな時どうする?」問題解決ストーリー',
      description: 'クライアントの課題をドラマチックに描き、解決策を提示。ストーリーテリングの好例。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      creator: '@marketing_solutions',
      postedAt: '3日前',
      engagement: { likes: 42100, comments: 680, shares: 2890, views: 320000 },
      category: 'サービス紹介',
      trendScore: 90,
    },
    {
      id: '5',
      platform: 'instagram',
      title: 'クリエイティブプロセスのタイムラプス',
      description: '制作の舞台裏を早送りで見せる。視覚的に魅力的で、専門性をアピール。',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400',
      creator: '@video_production_pro',
      postedAt: '4日前',
      engagement: { likes: 18900, comments: 310, shares: 720, views: 124000 },
      category: '制作プロセス',
      trendScore: 86,
    },
  ];

  const marketingIdeas: MarketingIdea[] = [
    {
      id: '1',
      title: '採用ブランディング動画シリーズ',
      description: '社員インタビュー、オフィスツアー、プロジェクト紹介を組み合わせた複数本の短編動画シリーズ。各動画は1-3分で完結し、SNSで段階的に公開することでエンゲージメントを最大化。',
      industry: 'IT・テクノロジー、クリエイティブ',
      successRate: '85%',
      implementationCost: '¥2,500,000 - ¥4,000,000',
      expectedROI: '採用応募数 +40%, SNSフォロワー +25%',
      examples: [
        'Instagram Reels: 若手社員の1日密着（週1回投稿）',
        'TikTok: オフィスの面白スポット紹介（週2回投稿）',
        'YouTube Shorts: プロジェクト成功ストーリー（月2回投稿）',
      ],
    },
    {
      id: '2',
      title: 'クライアント事例紹介ストーリー',
      description: 'Before/Afterを軸にしたクライアント課題解決ストーリー。課題→解決策→成果の3部構成で、視聴者の共感と信頼を獲得。',
      industry: 'マーケティング、コンサルティング',
      successRate: '78%',
      implementationCost: '¥1,800,000 - ¥3,200,000',
      expectedROI: '問い合わせ数 +35%, 商談成約率 +20%',
      examples: [
        'Instagram: 課題提起編（15秒）→ 解決編（30秒）',
        'TikTok: ドラマチックな変化を見せるショート動画',
        'LinkedIn: 詳細な成果データを含むロング版',
      ],
    },
    {
      id: '3',
      title: '専門知識を伝える教育コンテンツ',
      description: '業界のトレンド、ノウハウ、ベストプラクティスを短くわかりやすく解説。専門性をアピールしつつ、視聴者に価値を提供。',
      industry: '全業種対応',
      successRate: '82%',
      implementationCost: '¥800,000 - ¥1,500,000',
      expectedROI: 'ブランド認知度 +50%, リード獲得 +30%',
      examples: [
        'Instagram Reels: 「3分でわかる○○」シリーズ',
        'TikTok: 「今日から使える○○テクニック」',
        'YouTube: 深掘り解説動画（5-10分）',
      ],
    },
    {
      id: '4',
      title: '舞台裏・制作プロセス公開コンテンツ',
      description: 'プロの仕事の舞台裏を見せることで透明性と専門性をアピール。タイムラプスやBTS（Behind The Scenes）形式で視覚的に魅力的に。',
      industry: 'クリエイティブ、制作会社',
      successRate: '75%',
      implementationCost: '¥600,000 - ¥1,200,000',
      expectedROI: 'エンゲージメント率 +60%, ポートフォリオ閲覧 +45%',
      examples: [
        'Instagram: 制作プロセスのタイムラプス',
        'TikTok: 撮影現場の面白エピソード',
        'YouTube: 詳細な制作ドキュメンタリー',
      ],
    },
  ];

  const filteredVideos = selectedPlatform === 'all'
    ? trendVideos
    : trendVideos.filter(v => v.platform === selectedPlatform);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">SNS NEWS</h1>
        <p className="text-[#7B8794]">最新のSNSトレンドとマーケティングアイデアをキャッチアップ</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'trends'
                ? 'bg-[#0C8A5F] text-white shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]'
                : 'text-[#7B8794] hover:bg-[#F5F5F7]'
            }`}
          >
            <TrendingUp className="w-5 h-5" strokeWidth={2} />
            トレンド動画
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'ideas'
                ? 'bg-[#0C8A5F] text-white shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]'
                : 'text-[#7B8794] hover:bg-[#F5F5F7]'
            }`}
          >
            <Lightbulb className="w-5 h-5" strokeWidth={2} />
            マーケティングアイデア
          </button>
        </div>
      </div>

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <>
          {/* Platform Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  selectedPlatform === 'all'
                    ? 'bg-[#0C8A5F] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#7B8794] hover:border-[#0C8A5F]'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setSelectedPlatform('instagram')}
                className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  selectedPlatform === 'instagram'
                    ? 'bg-[#FED7E2] text-[#DB2777] border-2 border-[#DB2777]'
                    : 'bg-white border border-[#E5E7EB] text-[#7B8794] hover:border-[#DB2777]'
                }`}
              >
                <Instagram className="w-4 h-4" strokeWidth={2} />
                Instagram
              </button>
              <button
                onClick={() => setSelectedPlatform('tiktok')}
                className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  selectedPlatform === 'tiktok'
                    ? 'bg-[#1F2937] text-white border-2 border-[#1F2937]'
                    : 'bg-white border border-[#E5E7EB] text-[#7B8794] hover:border-[#1F2937]'
                }`}
              >
                <Smartphone className="w-4 h-4" strokeWidth={2} />
                TikTok
              </button>
            </div>
          </div>

          {/* Trend Videos Grid */}
          <div className="grid grid-cols-2 gap-6">
            {filteredVideos.map((video) => {
              const PlatformIcon = platformConfig[video.platform].icon;
              return (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-64 bg-[#1F2933] overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1F2933] ml-1" strokeWidth={2} fill="currentColor" />
                      </div>
                    </div>
                    {/* Platform Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs flex items-center gap-1 ${platformConfig[video.platform].color} backdrop-blur-sm`}>
                      <PlatformIcon className="w-3 h-3" strokeWidth={2} />
                      {platformConfig[video.platform].label}
                    </div>
                    {/* Trend Score */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#0C8A5F] text-white rounded-full text-xs backdrop-blur-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" strokeWidth={2} />
                      {video.trendScore}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="text-xs text-[#7B8794] bg-[#F5F5F7] px-2 py-1 rounded">
                        {video.category}
                      </span>
                    </div>
                    <h3 className="text-[#1F2933] mb-2">{video.title}</h3>
                    <p className="text-[#7B8794] text-sm mb-4 line-clamp-2">{video.description}</p>
                    
                    {/* Creator */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-[#7B8794]">
                      <span>{video.creator}</span>
                      <span>•</span>
                      <span>{video.postedAt}</span>
                    </div>

                    {/* Engagement Stats */}
                    <div className="grid grid-cols-4 gap-3 pt-4 border-t border-[#E5E7EB]">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#7B8794] mb-1">
                          <Heart className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="text-[#1F2933] text-sm">{formatNumber(video.engagement.likes)}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#7B8794] mb-1">
                          <MessageCircle className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="text-[#1F2933] text-sm">{formatNumber(video.engagement.comments)}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#7B8794] mb-1">
                          <Share2 className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="text-[#1F2933] text-sm">{formatNumber(video.engagement.shares)}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#7B8794] mb-1">
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="text-[#1F2933] text-sm">{formatNumber(video.engagement.views)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Marketing Ideas Tab */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          {marketingIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-[#1F2933] mb-2">{idea.title}</h3>
                  <p className="text-[#7B8794] mb-4">{idea.description}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#C5F3E5] text-[#0C8A5F] rounded-full text-sm">
                  <Lightbulb className="w-4 h-4" strokeWidth={2} />
                  成功率 {idea.successRate}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#FAFBFC] rounded-xl">
                  <div className="text-[#7B8794] text-sm mb-1">対象業界</div>
                  <div className="text-[#1F2933]">{idea.industry}</div>
                </div>
                <div className="p-4 bg-[#FAFBFC] rounded-xl">
                  <div className="text-[#7B8794] text-sm mb-1">実装コスト</div>
                  <div className="text-[#1F2933]">{idea.implementationCost}</div>
                </div>
                <div className="p-4 bg-[#FAFBFC] rounded-xl">
                  <div className="text-[#7B8794] text-sm mb-1">期待ROI</div>
                  <div className="text-[#0C8A5F]">{idea.expectedROI}</div>
                </div>
              </div>

              {/* Examples */}
              <div className="p-5 bg-[#F5F5F7] rounded-xl">
                <div className="text-[#1F2933] mb-3">実装例</div>
                <ul className="space-y-2">
                  {idea.examples.map((example, index) => (
                    <li key={index} className="text-[#52606D] text-sm flex items-start gap-2">
                      <span className="text-[#0C8A5F] mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
