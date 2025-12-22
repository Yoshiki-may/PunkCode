import { Image, Video, FileText, Download, Upload, Search, Filter, Calendar, CheckCircle2, Clock, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'logo';
  thumbnail: string;
  uploadedBy: 'Client' | 'PALSS';
  uploadDate: string;
  size: string;
  status: 'pending' | 'approved' | 'in-use';
  usedIn?: string;
}

const typeConfig = {
  image: { label: '画像', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: Image },
  video: { label: '動画', color: 'bg-[#FEE2E2] text-[#DC2626]', icon: Video },
  document: { label: 'ドキュメント', color: 'bg-[#FEF3C7] text-[#D97706]', icon: FileText },
  logo: { label: 'ロゴ', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: Image },
};

const statusConfig = {
  pending: { label: '確認中', color: 'bg-[#FEF3C7] text-[#D97706]', icon: Clock },
  approved: { label: '承認済み', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
  'in-use': { label: '使用中', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: CheckCircle2 },
};

export function ClientAssetLibrary() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUploader, setFilterUploader] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const assets: Asset[] = [
    {
      id: '1',
      name: '会社ロゴ_メイン.png',
      type: 'logo',
      thumbnail: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/11/15',
      size: '2.3 MB',
      status: 'in-use',
      usedIn: '採用ブランディング動画',
    },
    {
      id: '2',
      name: '店舗外観_正面.jpg',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/11/20',
      size: '4.1 MB',
      status: 'approved',
    },
    {
      id: '3',
      name: '商品カタログ_2024.pdf',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/11/25',
      size: '8.5 MB',
      status: 'approved',
    },
    {
      id: '4',
      name: '撮影素材_サンプル動画.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
      uploadedBy: 'PALSS',
      uploadDate: '2024/12/01',
      size: '125 MB',
      status: 'in-use',
      usedIn: '12月キャンペーン動画',
    },
    {
      id: '5',
      name: 'スタッフ写真_集合.jpg',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/11/18',
      size: '3.2 MB',
      status: 'in-use',
      usedIn: '採用ブランディング動画',
    },
    {
      id: '6',
      name: 'ブランドガイドライン.pdf',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/11/10',
      size: '6.8 MB',
      status: 'approved',
    },
    {
      id: '7',
      name: '商品画像_A_001.png',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      uploadedBy: 'Client',
      uploadDate: '2024/12/05',
      size: '2.1 MB',
      status: 'pending',
    },
    {
      id: '8',
      name: 'インタビュー素材_編集後.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      uploadedBy: 'PALSS',
      uploadDate: '2024/12/07',
      size: '89 MB',
      status: 'approved',
    },
  ];

  const filteredAssets = assets.filter(asset => {
    if (filterType !== 'all' && asset.type !== filterType) return false;
    if (filterUploader !== 'all' && asset.uploadedBy !== filterUploader) return false;
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: assets.length,
    client: assets.filter(a => a.uploadedBy === 'Client').length,
    palss: assets.filter(a => a.uploadedBy === 'PALSS').length,
    pending: assets.filter(a => a.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">素材ライブラリ</h1>
          <p className="text-[#7B8794]">プロジェクトに使用する素材の管理</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all"
        >
          <Upload className="w-5 h-5" strokeWidth={2} />
          素材をアップロード
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <FolderOpen className="w-8 h-8 text-[#7B8794]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">全素材</div>
          <div className="text-[#1F2933] text-3xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-8 h-8 text-[#0C8A5F]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">提供済み</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.client}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8 text-[#4F46E5]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">PALSS提供</div>
          <div className="text-[#4F46E5] text-3xl">{stats.palss}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-[#D97706]" strokeWidth={2} />
          </div>
          <div className="text-[#7B8794] text-sm mb-2">確認中</div>
          <div className="text-[#D97706] text-3xl">{stats.pending}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                placeholder="素材名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            >
              <option value="all">すべての種類</option>
              <option value="image">画像</option>
              <option value="video">動画</option>
              <option value="document">ドキュメント</option>
              <option value="logo">ロゴ</option>
            </select>
            <select
              value={filterUploader}
              onChange={(e) => setFilterUploader(e.target.value)}
              className="px-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            >
              <option value="all">すべて</option>
              <option value="Client">クライアント提供</option>
              <option value="PALSS">PALSS提供</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredAssets.map((asset) => {
          const typeInfo = typeConfig[asset.type];
          const statusInfo = statusConfig[asset.status];
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#1F2933] overflow-hidden">
                {asset.type === 'document' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB]">
                    <FileText className="w-16 h-16 text-[#7B8794]" strokeWidth={1.5} />
                  </div>
                ) : (
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-4 py-2 bg-white/90 hover:bg-white text-[#1F2933] rounded-lg text-sm transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" strokeWidth={2} />
                    ダウンロード
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${typeInfo.color}`}>
                    <TypeIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    {typeInfo.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[#1F2933] text-sm mb-3 line-clamp-2">{asset.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusInfo.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    {statusInfo.label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    asset.uploadedBy === 'Client' 
                      ? 'bg-[#C5F3E5] text-[#0C8A5F]' 
                      : 'bg-[#E0E7FF] text-[#4F46E5]'
                  }`}>
                    {asset.uploadedBy === 'Client' ? 'クライアント' : 'PALSS'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#7B8794]">
                  <div className="flex items-center justify-between">
                    <span>アップロード日</span>
                    <span className="text-[#52606D]">{asset.uploadDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ファイルサイズ</span>
                    <span className="text-[#52606D]">{asset.size}</span>
                  </div>
                  {asset.usedIn && (
                    <div className="pt-2 border-t border-[#F3F4F6]">
                      <div className="text-[#7B8794] mb-1">使用先</div>
                      <div className="text-[#0C8A5F]">{asset.usedIn}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1F2933]">素材をアップロード</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-[#7B8794] hover:text-[#1F2933] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-12 text-center hover:border-[#0C8A5F] transition-all cursor-pointer">
                <Upload className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-[#1F2933] mb-2">ファイルをドラッグ&ドロップ</p>
                <p className="text-[#7B8794] text-sm mb-4">または</p>
                <button className="px-6 py-2.5 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all">
                  ファイルを選択
                </button>
                <p className="text-[#9CA3AF] text-xs mt-4">対応形式: JPG, PNG, PDF, MP4 (最大500MB)</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-[#52606D] text-sm mb-2">素材名</label>
                  <input
                    type="text"
                    placeholder="例: 会社ロゴ_メイン.png"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#52606D] text-sm mb-2">メモ（任意）</label>
                  <textarea
                    placeholder="この素材についての説明や使用用途など..."
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#52606D] border border-[#E5E7EB] rounded-xl transition-all"
                >
                  キャンセル
                </button>
                <button className="flex-1 px-4 py-2.5 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all">
                  アップロード
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}