import { useState } from 'react';
import { Search, Layers, Download, Heart, Eye, Clock, Zap } from 'lucide-react';

export function EditorTemplates() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'すべて', count: 24 },
    { id: 'intro', name: 'イントロ/アウトロ', count: 6 },
    { id: 'transition', name: 'トランジション', count: 8 },
    { id: 'text', name: 'テキストアニメーション', count: 5 },
    { id: 'color', name: 'カラーグレーディング', count: 3 },
    { id: 'bgm', name: 'BGM/効果音', count: 2 },
  ];

  const templates = [
    {
      id: 1,
      name: 'モダン イントロ',
      category: 'intro',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Modern+Intro',
      duration: '00:05',
      uses: 45,
      likes: 12,
      description: 'モダンでスタイリッシュなイントロテンプレート。企業ブランディングに最適。',
      tags: ['モダン', 'シンプル', '企業向け'],
    },
    {
      id: 2,
      name: 'ダイナミック トランジション',
      category: 'transition',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Transition',
      duration: '00:02',
      uses: 78,
      likes: 23,
      description: 'スムーズでダイナミックなトランジション効果。動画に動きを加える。',
      tags: ['ダイナミック', 'スムーズ', '汎用'],
    },
    {
      id: 3,
      name: 'タイピング テキスト',
      category: 'text',
      type: 'animation',
      thumbnail: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Typing+Text',
      duration: '00:03',
      uses: 92,
      likes: 34,
      description: 'タイピング効果のテキストアニメーション。解説動画に最適。',
      tags: ['テキスト', 'タイピング', '解説向け'],
    },
    {
      id: 4,
      name: 'シネマティック グレーディング',
      category: 'color',
      type: 'preset',
      thumbnail: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Cinematic',
      uses: 156,
      likes: 67,
      description: '映画のようなシネマティックなカラーグレーディングプリセット。',
      tags: ['シネマティック', '映画風', 'ドラマチック'],
    },
    {
      id: 5,
      name: 'ミニマル アウトロ',
      category: 'intro',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Minimal+Outro',
      duration: '00:04',
      uses: 38,
      likes: 15,
      description: 'シンプルでミニマルなアウトロテンプレート。SNS動画に最適。',
      tags: ['ミニマル', 'シンプル', 'SNS向け'],
    },
    {
      id: 6,
      name: 'ポップアップ テキスト',
      category: 'text',
      type: 'animation',
      thumbnail: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Popup+Text',
      duration: '00:02',
      uses: 65,
      likes: 28,
      description: 'ポップでキャッチーなテキストアニメーション。Instagram向け。',
      tags: ['ポップ', 'キャッチー', 'Instagram'],
    },
    {
      id: 7,
      name: 'スライド トランジション',
      category: 'transition',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Slide',
      duration: '00:01',
      uses: 123,
      likes: 45,
      description: 'スムーズなスライドトランジション。場面転換に。',
      tags: ['スライド', 'スムーズ', '汎用'],
    },
    {
      id: 8,
      name: 'ヴィンテージ グレーディング',
      category: 'color',
      type: 'preset',
      thumbnail: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Vintage',
      uses: 89,
      likes: 41,
      description: 'レトロでヴィンテージなカラーグレーディング。',
      tags: ['ヴィンテージ', 'レトロ', 'ノスタルジック'],
    },
    {
      id: 9,
      name: 'ロゴ アニメーション',
      category: 'intro',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Logo+Anim',
      duration: '00:03',
      uses: 56,
      likes: 21,
      description: 'ロゴをアニメーション化するテンプレート。',
      tags: ['ロゴ', 'アニメーション', 'ブランディング'],
    },
    {
      id: 10,
      name: 'アップビート BGM',
      category: 'bgm',
      type: 'audio',
      thumbnail: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Upbeat+BGM',
      duration: '02:30',
      uses: 234,
      likes: 98,
      description: '明るくアップビートなBGM。プロモーション動画に。',
      tags: ['BGM', 'アップビート', '明るい'],
    },
    {
      id: 11,
      name: 'グロー テキスト',
      category: 'text',
      type: 'animation',
      thumbnail: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Glow+Text',
      duration: '00:02',
      uses: 72,
      likes: 31,
      description: '光るテキストアニメーション。印象的な演出に。',
      tags: ['グロー', '光', '印象的'],
    },
    {
      id: 12,
      name: 'ズーム トランジション',
      category: 'transition',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Zoom',
      duration: '00:01',
      uses: 145,
      likes: 52,
      description: 'ダイナミックなズームトランジション。',
      tags: ['ズーム', 'ダイナミック', 'インパクト'],
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'animation': return '✨';
      case 'preset': return '🎨';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Templates</h1>
        <p className="text-sm text-muted-foreground">編集テンプレート・プリセット集</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="テンプレート名やタグで検索..."
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">テンプレート数</span>
          </div>
          <div className="text-2xl">{templates.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">総使用回数</span>
          </div>
          <div className="text-2xl">{templates.reduce((sum, t) => sum + t.uses, 0)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-muted-foreground">お気に入り</span>
          </div>
          <div className="text-2xl">{templates.reduce((sum, t) => sum + t.likes, 0)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">最終更新</span>
          </div>
          <div className="text-sm">今日</div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Eye className="w-5 h-5 text-gray-900" />
                </button>
                <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Download className="w-5 h-5 text-gray-900" />
                </button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                <span>{getTypeIcon(template.type)}</span>
                {template.duration && <span>{template.duration}</span>}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm mb-2 line-clamp-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{template.uses}回使用</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{template.likes}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span>使用する</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">該当するテンプレートがありません</p>
        </div>
      )}

      {/* Upload New Template */}
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg mb-2">新しいテンプレートを追加</h3>
        <p className="text-sm text-muted-foreground mb-4">
          よく使う編集テンプレートやプリセットを保存して、作業効率をアップ
        </p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          テンプレートをアップロード
        </button>
      </div>
    </div>
  );
}
