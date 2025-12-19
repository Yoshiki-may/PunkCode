import { Play, MessageSquare, CheckCircle2, AlertCircle, Clock, Download, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  status: 'unviewed' | 'in-review' | 'change-requested' | 'waiting-revision' | 'approved' | 'published';
  platform: string;
  uploadDate: string;
  dueDate?: string;
  uploadedBy: string;
  comments: number;
  duration: string;
}

const statusConfig = {
  unviewed: { label: '未確認', color: 'bg-[#F3F4F6] text-[#6B7280]', icon: Clock },
  'in-review': { label: '確認中', color: 'bg-[#FEF3C7] text-[#D97706]', icon: Clock },
  'change-requested': { label: '修正依頼中', color: 'bg-[#FEE2E2] text-[#DC2626]', icon: AlertCircle },
  'waiting-revision': { label: '再提出待ち', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: Clock },
  approved: { label: '承認済み', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
  published: { label: '投稿済み', color: 'bg-[#D1FAE5] text-[#059669]', icon: CheckCircle2 },
};

export function VideoReview() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const videos: Video[] = [
    {
      id: '1',
      title: '採用ブランディング動画_ver1',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
      status: 'unviewed',
      platform: 'YouTube',
      uploadDate: '2024/12/10 15:30',
      dueDate: '2024/12/15',
      uploadedBy: '山田ディレクター',
      comments: 0,
      duration: '2:45',
    },
    {
      id: '2',
      title: '商品紹介_ショート動画_A',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
      status: 'in-review',
      platform: 'Instagram',
      uploadDate: '2024/12/09 11:20',
      dueDate: '2024/12/12',
      uploadedBy: '佐藤編集',
      comments: 2,
      duration: '0:30',
    },
    {
      id: '3',
      title: '12月キャンペーン_メイン動画',
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
      status: 'approved',
      platform: 'YouTube',
      uploadDate: '2024/12/08 14:00',
      uploadedBy: 'REONA',
      comments: 5,
      duration: '3:20',
    },
    {
      id: '4',
      title: 'インタビュー動画_社員A',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      status: 'change-requested',
      platform: 'YouTube',
      uploadDate: '2024/12/07 16:45',
      dueDate: '2024/12/14',
      uploadedBy: '田中編集',
      comments: 8,
      duration: '5:12',
    },
    {
      id: '5',
      title: 'TikTok_トレンド投稿_001',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
      status: 'published',
      platform: 'TikTok',
      uploadDate: '2024/12/05 10:00',
      uploadedBy: '佐藤編集',
      comments: 3,
      duration: '0:15',
    },
  ];

  const filteredVideos = videos.filter(video => {
    if (filterStatus !== 'all' && video.status !== filterStatus) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: videos.length,
    unviewed: videos.filter(v => v.status === 'unviewed').length,
    inReview: videos.filter(v => v.status === 'in-review').length,
    changeRequested: videos.filter(v => v.status === 'change-requested').length,
    approved: videos.filter(v => v.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">動画・コンテンツ確認</h1>
        <p className="text-[#7B8794]">制作された動画の確認・コメント・承認</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">全動画</div>
          <div className="text-[#1F2933] text-3xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">未確認</div>
          <div className="text-[#DC2626] text-3xl">{stats.unviewed}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">確認中</div>
          <div className="text-[#D97706] text-3xl">{stats.inReview}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">修正依頼中</div>
          <div className="text-[#DC2626] text-3xl">{stats.changeRequested}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">承認済み</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.approved}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                placeholder="動画タイトルで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            >
              <option value="all">すべて</option>
              <option value="unviewed">未確認</option>
              <option value="in-review">確認中</option>
              <option value="change-requested">修正依頼中</option>
              <option value="approved">承認済み</option>
              <option value="published">投稿済み</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const statusInfo = statusConfig[video.status];
          const StatusIcon = statusInfo.icon;
          const isUrgent = video.dueDate && new Date(video.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

          return (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all cursor-pointer overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#1F2933] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                  {video.duration}
                </div>
                {isUrgent && video.status !== 'approved' && video.status !== 'published' && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#DC2626] text-white text-xs rounded">
                    期限迫る
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[#1F2933] text-sm line-clamp-2 flex-1">{video.title}</h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusInfo.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    {statusInfo.label}
                  </span>
                  <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-xs">
                    {video.platform}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#7B8794]">
                  <div className="flex items-center justify-between">
                    <span>アップロード</span>
                    <span className="text-[#52606D]">{video.uploadDate}</span>
                  </div>
                  {video.dueDate && (
                    <div className="flex items-center justify-between">
                      <span>確認期限</span>
                      <span className={`${isUrgent ? 'text-[#DC2626]' : 'text-[#52606D]'}`}>
                        {video.dueDate}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>担当者</span>
                    <span className="text-[#52606D]">{video.uploadedBy}</span>
                  </div>
                </div>

                {video.comments > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center gap-2 text-[#7B8794] text-xs">
                    <MessageSquare className="w-4 h-4" strokeWidth={2} />
                    {video.comments}件のコメント
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Detail Modal (Placeholder) */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[#1F2933] mb-2">{selectedVideo.title}</h2>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const statusInfo = statusConfig[selectedVideo.status];
                      const StatusIcon = statusInfo.icon;
                      return (
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" strokeWidth={2} />
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                    <span className="text-[#7B8794] text-sm">{selectedVideo.platform}</span>
                    <span className="text-[#7B8794] text-sm">{selectedVideo.uploadDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-[#7B8794] hover:text-[#1F2933] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Video Player */}
                <div className="col-span-2">
                  <div className="aspect-video bg-[#1F2933] rounded-xl flex items-center justify-center">
                    <Play className="w-24 h-24 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-[#1F2933] mb-4">動画情報</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#7B8794]">再生時間</span>
                        <span className="text-[#1F2933]">{selectedVideo.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7B8794]">アップロード者</span>
                        <span className="text-[#1F2933]">{selectedVideo.uploadedBy}</span>
                      </div>
                      {selectedVideo.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-[#7B8794]">確認期限</span>
                          <span className="text-[#DC2626]">{selectedVideo.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comments & Actions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[#1F2933] mb-4">コメント</h3>
                    <div className="space-y-3 mb-4">
                      <div className="p-4 bg-[#FAFBFC] rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-[#0C8A5F] rounded-full"></div>
                          <div>
                            <div className="text-[#1F2933] text-sm">あなた</div>
                            <div className="text-[#7B8794] text-xs">2024/12/10 14:20</div>
                          </div>
                        </div>
                        <p className="text-[#52606D] text-sm">サンプルコメント</p>
                      </div>
                    </div>
                    <textarea
                      placeholder="コメントを入力..."
                      className="w-full p-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                      承認する
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626] rounded-xl transition-all">
                      <AlertCircle className="w-5 h-5" strokeWidth={2} />
                      修正依頼
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#52606D] border border-[#E5E7EB] rounded-xl transition-all">
                      <Download className="w-5 h-5" strokeWidth={2} />
                      ダウンロード
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
