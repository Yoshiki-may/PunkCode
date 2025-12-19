import { useState } from 'react';
import { Search, Filter, Eye, Heart, Download, Image as ImageIcon, Video, Calendar, Award } from 'lucide-react';

export function CreatorPortfolio() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'すべて', count: 24 },
    { id: 'product', name: '商品写真', count: 8 },
    { id: 'video', name: 'プロモーション動画', count: 6 },
    { id: 'reels', name: 'Instagram リール', count: 5 },
    { id: 'brand', name: 'ブランドムービー', count: 3 },
    { id: 'interview', name: 'インタビュー', count: 2 },
  ];

  const portfolioItems = [
    {
      id: 1,
      title: '商品プロモーション撮影',
      client: 'クライアントA',
      category: 'product',
      type: 'image',
      thumbnail: 'https://via.placeholder.com/600x400/6366F1/FFFFFF?text=Product+Photography',
      date: '2024-12-15',
      views: 342,
      likes: 45,
      description: '新商品の撮影。白背景で商品の特徴を最大限引き出すライティング。',
      tags: ['商品写真', 'スタジオ', '白背景'],
      equipment: 'Canon EOS R5 + RF 50mm f/1.2',
    },
    {
      id: 2,
      title: 'ブランドムービー',
      client: 'クライアントB',
      category: 'brand',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Brand+Movie',
      date: '2024-12-10',
      views: 856,
      likes: 123,
      duration: '02:30',
      description: 'シネマティックな企業ブランディング動画。4K収録、カラーグレーディング込み。',
      tags: ['ブランドムービー', 'シネマティック', '4K'],
      equipment: 'RED Komodo + Zeiss CP.3',
    },
    {
      id: 3,
      title: 'Instagram リール - 商品紹介',
      client: 'クライアントC',
      category: 'reels',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Instagram+Reel',
      date: '2024-12-08',
      views: 1234,
      likes: 289,
      duration: '00:15',
      description: 'トレンド感のある縦型動画。自然光を活かした撮影。',
      tags: ['Instagram', 'リール', 'トレンド'],
      equipment: 'Sony A7IV + Tamron 28-75mm',
    },
    {
      id: 4,
      title: 'インタビュー撮影',
      client: 'クライアントD',
      category: 'interview',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Interview',
      date: '2024-12-05',
      views: 567,
      likes: 78,
      duration: '05:00',
      description: '企業代表のインタビュー撮影。2カメラで収録。',
      tags: ['インタビュー', '2カメラ', '企業向け'],
      equipment: 'Sony A7IV + FX3',
    },
    {
      id: 5,
      title: '商品写真 - ライフスタイル',
      client: 'クライアントE',
      category: 'product',
      type: 'image',
      thumbnail: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Lifestyle+Product',
      date: '2024-12-01',
      views: 445,
      likes: 67,
      description: 'ライフスタイルシーンでの商品撮影。自然光とレフ板のみ。',
      tags: ['商品写真', 'ライフスタイル', '自然光'],
      equipment: 'Canon EOS R6 + RF 24-70mm',
    },
    {
      id: 6,
      title: 'プロモーション動画',
      client: 'クライアントF',
      category: 'video',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Promo+Video',
      date: '2024-11-28',
      views: 923,
      likes: 145,
      duration: '01:30',
      description: '商品のプロモーション動画。ドローン撮影を含む。',
      tags: ['プロモーション', 'ドローン', '商品'],
      equipment: 'DJI Mavic 3 + Sony A7IV',
    },
    {
      id: 7,
      title: 'Instagram リール - Behind the Scenes',
      client: 'クライアントG',
      category: 'reels',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/600x400/06B6D4/FFFFFF?text=BTS+Reel',
      date: '2024-11-25',
      views: 678,
      likes: 112,
      duration: '00:20',
      description: '撮影現場の裏側を紹介するリール動画。',
      tags: ['BTS', 'リール', '舞台裏'],
      equipment: 'iPhone 15 Pro',
    },
    {
      id: 8,
      title: '商品写真 - フラットレイ',
      client: 'クライアントH',
      category: 'product',
      type: 'image',
      thumbnail: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Flat+Lay',
      date: '2024-11-20',
      views: 389,
      likes: 54,
      description: 'フラットレイスタイルの商品撮影。複数商品を配置。',
      tags: ['フラットレイ', '商品写真', 'スタイリング'],
      equipment: 'Canon EOS R5 + RF 50mm',
    },
  ];

  const filteredItems = portfolioItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const stats = {
    totalProjects: 24,
    totalViews: 6543,
    totalLikes: 1234,
    avgRating: 4.8,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Portfolio</h1>
        <p className="text-sm text-muted-foreground">過去の撮影作品集</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">総プロジェクト</span>
          </div>
          <div className="text-2xl">{stats.totalProjects}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">総閲覧数</span>
          </div>
          <div className="text-2xl">{stats.totalViews.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-muted-foreground">総いいね</span>
          </div>
          <div className="text-2xl">{stats.totalLikes.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">平均評価</span>
          </div>
          <div className="text-2xl">{stats.avgRating}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="作品名、クライアント、タグで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                categoryFilter === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Eye className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Download className="w-5 h-5 text-gray-900" />
                </button>
              </div>
              {/* Type Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                {item.type === 'video' ? (
                  <>
                    <Video className="w-3 h-3" />
                    {item.duration && <span>{item.duration}</span>}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo</span>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3 h-3" />
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.client}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Equipment */}
              <div className="mb-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                📷 {item.equipment}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>{item.likes}</span>
                  </div>
                </div>
                <button className="text-primary hover:underline">
                  詳細を見る
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">該当する作品がありません</p>
        </div>
      )}
    </div>
  );
}
