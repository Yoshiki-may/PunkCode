import { useState } from 'react';
import { Download, Search, Filter, Image as ImageIcon, Video, Calendar, Eye, Trash2 } from 'lucide-react';

export function CreatorAssetLibrary() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const projects = [
    { id: 'all', name: 'すべてのプロジェクト' },
    { id: '1', name: 'クライアントA - 新商品プロモーション撮影' },
    { id: '2', name: 'クライアントB - Instagram リール撮影' },
    { id: '3', name: 'クライアントC - ブランドムービー撮影' },
  ];

  const assets = [
    {
      id: 1,
      projectId: '1',
      projectName: 'クライアントA - 新商品プロモーション撮影',
      fileName: 'product_001.jpg',
      fileType: 'image',
      size: '8.2 MB',
      uploadedAt: '2024-12-19 10:30',
      status: 'アップロード済み',
      tags: ['商品', '白背景', '正面'],
      thumbnail: 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Product+001',
      resolution: '4000x6000',
      camera: 'Canon EOS R5',
    },
    {
      id: 2,
      projectId: '1',
      projectName: 'クライアントA - 新商品プロモーション撮影',
      fileName: 'product_002.jpg',
      fileType: 'image',
      size: '7.9 MB',
      uploadedAt: '2024-12-19 10:32',
      status: 'アップロード済み',
      tags: ['商品', '白背景', '斜め'],
      thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Product+002',
      resolution: '4000x6000',
      camera: 'Canon EOS R5',
    },
    {
      id: 3,
      projectId: '1',
      projectName: 'クライアントA - 新商品プロモーション撮影',
      fileName: 'product_003.jpg',
      fileType: 'image',
      size: '8.5 MB',
      uploadedAt: '2024-12-19 10:35',
      status: 'アップロード済み',
      tags: ['商品', '白背景', '詳細'],
      thumbnail: 'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Product+003',
      resolution: '4000x6000',
      camera: 'Canon EOS R5',
    },
    {
      id: 4,
      projectId: '2',
      projectName: 'クライアントB - Instagram リール撮影',
      fileName: 'reel_main_001.mp4',
      fileType: 'video',
      size: '45.2 MB',
      uploadedAt: '2024-12-18 14:20',
      status: 'アップロード済み',
      tags: ['リール', '屋外', 'メイン'],
      thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Reel+001',
      duration: '00:15',
      resolution: '1080x1920',
      camera: 'Sony A7IV',
    },
    {
      id: 5,
      projectId: '2',
      projectName: 'クライアントB - Instagram リール撮影',
      fileName: 'reel_main_002.mp4',
      fileType: 'video',
      size: '52.8 MB',
      uploadedAt: '2024-12-18 14:25',
      status: 'アップロード済み',
      tags: ['リール', '屋外', 'サブ'],
      thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Reel+002',
      duration: '00:18',
      resolution: '1080x1920',
      camera: 'Sony A7IV',
    },
    {
      id: 6,
      projectId: '2',
      projectName: 'クライアントB - Instagram リール撮影',
      fileName: 'broll_001.mp4',
      fileType: 'video',
      size: '38.5 MB',
      uploadedAt: '2024-12-18 14:30',
      status: 'アップロード済み',
      tags: ['B-roll', '自然', '背景'],
      thumbnail: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=B-Roll',
      duration: '00:12',
      resolution: '1080x1920',
      camera: 'Sony A7IV',
    },
    {
      id: 7,
      projectId: '3',
      projectName: 'クライアントC - ブランドムービー撮影',
      fileName: 'brand_interview_001.mp4',
      fileType: 'video',
      size: '156.3 MB',
      uploadedAt: '2024-12-17 11:00',
      status: 'アップロード済み',
      tags: ['インタビュー', '室内', 'メイン'],
      thumbnail: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Interview',
      duration: '03:25',
      resolution: '3840x2160',
      camera: 'RED Komodo',
    },
    {
      id: 8,
      projectId: '3',
      projectName: 'クライアントC - ブランドムービー撮影',
      fileName: 'brand_drone_001.mp4',
      fileType: 'video',
      size: '189.7 MB',
      uploadedAt: '2024-12-17 15:30',
      status: 'アップロード済み',
      tags: ['ドローン', '空撮', '屋外'],
      thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Drone',
      duration: '02:10',
      resolution: '3840x2160',
      camera: 'DJI Mavic 3',
    },
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesProject = selectedProject === 'all' || asset.projectId === selectedProject;
    const matchesFileType = fileTypeFilter === 'all' || asset.fileType === fileTypeFilter;
    const matchesSearch = asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesFileType && matchesSearch;
  });

  const toggleFileSelection = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`選択した${selectedFiles.length}件のファイルを削除しますか？`)) {
      alert(`${selectedFiles.length}ファイルを削除しました`);
      setSelectedFiles([]);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Asset Library</h1>
          <p className="text-sm text-muted-foreground">アップロード済み素材一覧</p>
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>削除 ({selectedFiles.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ファイル名、プロジェクト、タグで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* File Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">すべて</option>
              <option value="video">動画のみ</option>
              <option value="image">画像のみ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{assets.length}</div>
          <div className="text-sm text-muted-foreground">全素材数</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{assets.filter(a => a.fileType === 'video').length}</div>
          <div className="text-sm text-muted-foreground">動画素材</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{assets.filter(a => a.fileType === 'image').length}</div>
          <div className="text-sm text-muted-foreground">画像素材</div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className={`bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all ${
              selectedFiles.includes(asset.id) ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            }`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <img 
                src={asset.thumbnail} 
                alt={asset.fileName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                {getFileIcon(asset.fileType)}
              </div>
              <div className="absolute top-2 right-2">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(asset.id)}
                  onChange={() => toggleFileSelection(asset.id)}
                  className="w-5 h-5"
                />
              </div>
              {asset.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {asset.duration}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm mb-2 truncate" title={asset.fileName}>
                {asset.fileName}
              </h3>
              
              <div className="space-y-2 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1 truncate">
                  <span>{asset.projectName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{asset.uploadedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📷 {asset.camera}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-muted-foreground">{asset.size}</span>
                <span className="text-muted-foreground">{asset.resolution}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {asset.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`${asset.fileName}をプレビューします`)}
                  className="flex-1 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`${asset.fileName}をダウンロードします`)}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">該当する素材がありません</p>
        </div>
      )}
    </div>
  );
}
