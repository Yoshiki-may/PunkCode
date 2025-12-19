import { Award, Video, Calendar, Clock, TrendingUp, ExternalLink, Play } from 'lucide-react';

export function CreatorPortfolio() {
  const stats = {
    totalShoots: 48,
    totalHours: 192,
    projectsInvolved: 24,
    thisMonthShoots: 12,
    thisMonthHours: 48,
    avgShootDuration: 4,
  };

  const projects = [
    {
      id: '1',
      title: '採用ブランディング動画',
      client: 'デジタルフロンティア株式会社',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      shootDate: '2024/12/10',
      duration: '5時間',
      views: '12,500',
      status: 'published',
      videoUrl: 'https://youtube.com/example1',
      role: 'リードカメラマン',
    },
    {
      id: '2',
      title: '12月キャンペーン動画',
      client: 'クリエイティブワークス',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      shootDate: '2024/11/28',
      duration: '4時間',
      views: '8,300',
      status: 'published',
      videoUrl: 'https://youtube.com/example2',
      role: 'リードカメラマン',
    },
    {
      id: '3',
      title: '店舗紹介動画',
      client: 'グローバルソリューションズ',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      shootDate: '2024/11/20',
      duration: '4時間',
      views: '15,200',
      status: 'published',
      videoUrl: 'https://youtube.com/example3',
      role: 'リードカメラマン',
    },
    {
      id: '4',
      title: 'プロモーション動画',
      client: 'テックイノベーション',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
      shootDate: '2024/11/15',
      duration: '5時間',
      views: '22,100',
      status: 'published',
      videoUrl: 'https://youtube.com/example4',
      role: 'リードカメラマン',
    },
    {
      id: '5',
      title: 'イベント撮影',
      client: 'マーケティングソリューションズ',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      shootDate: '2024/11/08',
      duration: '8時間',
      views: '18,700',
      status: 'published',
      videoUrl: 'https://youtube.com/example5',
      role: 'リードカメラマン',
    },
    {
      id: '6',
      title: 'インタビュー動画シリーズ',
      client: 'デジタルフロンティア株式会社',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      shootDate: '2024/10/25',
      duration: '6時間',
      views: '9,400',
      status: 'published',
      videoUrl: 'https://youtube.com/example6',
      role: 'リードカメラマン',
    },
  ];

  const monthlyData = [
    { month: '7月', shoots: 8, hours: 32 },
    { month: '8月', shoots: 10, hours: 40 },
    { month: '9月', shoots: 9, hours: 36 },
    { month: '10月', shoots: 11, hours: 44 },
    { month: '11月', shoots: 12, hours: 48 },
    { month: '12月', shoots: 5, hours: 20 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">ポートフォリオ</h1>
        <p className="text-[#7B8794]">撮影実績と統計</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-6 gap-6">
        <div className="bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-2xl p-6 text-white shadow-[0_4px_6px_-1px_rgba(12,138,95,0.2)]">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8" strokeWidth={2} />
          </div>
          <div className="text-white/80 text-sm mb-2">総撮影本数</div>
          <div className="text-4xl mb-1">{stats.totalShoots}</div>
          <div className="text-white/60 text-xs">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">総撮影時間</div>
          <div className="text-[#1F2933] text-4xl mb-1">{stats.totalHours}</div>
          <div className="text-[#7B8794] text-xs">時間</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">参加プロジェクト</div>
          <div className="text-[#1F2933] text-4xl mb-1">{stats.projectsInvolved}</div>
          <div className="text-[#7B8794] text-xs">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-[#7B8794]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">今月の撮影</div>
          <div className="text-[#1F2933] text-4xl mb-1">{stats.thisMonthShoots}</div>
          <div className="text-[#7B8794] text-xs">件</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-[#7B8794]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">今月の時間</div>
          <div className="text-[#1F2933] text-4xl mb-1">{stats.thisMonthHours}</div>
          <div className="text-[#7B8794] text-xs">時間</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">平均撮影時間</div>
          <div className="text-[#0C8A5F] text-4xl mb-1">{stats.avgShootDuration}</div>
          <div className="text-[#7B8794] text-xs">時間 / 件</div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">月別撮影実績</h3>
        </div>
        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const maxShoots = Math.max(...monthlyData.map(d => d.shoots));
            const shootPercentage = (data.shoots / maxShoots) * 100;
            const maxHours = Math.max(...monthlyData.map(d => d.hours));
            const hoursPercentage = (data.hours / maxHours) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#52606D] text-sm w-16">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1">
                        <div className="w-full h-6 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${shootPercentage}%` }}
                          >
                            <span className="text-white text-xs">{data.shoots}件</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[#7B8794] text-xs w-16 text-right">{data.hours}時間</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects Portfolio */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h2 className="text-[#1F2933] text-xl">代表的なプロジェクト</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#1F2933] overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-[#1F2933] rounded-lg transition-all"
                  >
                    <Play className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm">再生</span>
                  </a>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-[#0C8A5F] text-white rounded-full text-xs">
                    公開中
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-2 text-white text-xs bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Play className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>{project.views} views</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-[#1F2933] mb-2 line-clamp-2 group-hover:text-[#0C8A5F] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#7B8794] text-sm mb-4">{project.client}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[#52606D]">
                    <span className="text-[#9CA3AF]">役割</span>
                    <span>{project.role}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#52606D]">
                    <span className="text-[#9CA3AF]">撮影日</span>
                    <span>{project.shootDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#52606D]">
                    <span className="text-[#9CA3AF]">撮影時間</span>
                    <span>{project.duration}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 text-[#0C8A5F] hover:bg-[#C5F3E5] rounded-lg transition-all text-sm"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2} />
                    動画を見る
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">最近のフィードバック</h3>
        </div>
        <div className="space-y-4">
          <div className="p-5 bg-[#F9FAFB] rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] flex items-center justify-center text-white flex-shrink-0">
                YT
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#1F2933]">山田太郎（ディレクター）</span>
                  <span className="text-[#9CA3AF] text-xs">2024/12/08</span>
                </div>
                <div className="text-[#7B8794] text-sm mb-2">採用ブランディング動画</div>
              </div>
            </div>
            <p className="text-[#52606D] text-sm leading-relaxed">
              自然光の使い方が素晴らしかったです。特にインタビューシーンの柔らかい光の演出が、クライアントの求めていた温かみのある雰囲気にぴったりでした。次回もぜひお願いします！
            </p>
          </div>
          <div className="p-5 bg-[#F9FAFB] rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white flex-shrink-0">
                SH
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#1F2933]">佐藤花子（編集者）</span>
                  <span className="text-[#9CA3AF] text-xs">2024/11/30</span>
                </div>
                <div className="text-[#7B8794] text-sm mb-2">12月キャンペーン動画</div>
              </div>
            </div>
            <p className="text-[#52606D] text-sm leading-relaxed">
              手元のクローズアップショットが非常に美しく、編集時に使いやすい素材を多く撮影していただきました。構図も完璧で、ほとんど調整なしで使えました。ありがとうございました！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
