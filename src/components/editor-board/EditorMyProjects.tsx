import { useState } from 'react';
import { Search, Filter, Calendar, User, Film, Image as ImageIcon, AlertCircle } from 'lucide-react';

export function EditorMyProjects() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      client: 'クライアントA',
      projectName: 'Instagram リール編集',
      type: '動画編集',
      status: '編集中',
      priority: 'high',
      deadline: '2024-12-20',
      assignedBy: 'ディレクター田中',
      createdAt: '2024-12-18',
      version: 'v2',
      estimatedTime: '3時間',
      completedTime: '2時間',
      requirements: '15秒、縦型、トレンドBGM使用、テロップ多め',
      assets: { videos: 5, images: 3 },
    },
    {
      id: 2,
      client: 'クライアントB',
      projectName: 'プロモーション動画編集',
      type: '動画編集',
      status: 'レビュー待ち',
      priority: 'high',
      deadline: '2024-12-20',
      assignedBy: 'ディレクター佐藤',
      createdAt: '2024-12-17',
      version: 'v3',
      estimatedTime: '5時間',
      completedTime: '5時間',
      requirements: '60秒、横型、企業ブランディング、ナレーション付き',
      assets: { videos: 8, images: 12 },
    },
    {
      id: 3,
      client: 'クライアントC',
      projectName: '商品写真レタッチ',
      type: '画像編集',
      status: '修正依頼',
      priority: 'medium',
      deadline: '2024-12-21',
      assignedBy: 'ディレクター山田',
      createdAt: '2024-12-16',
      version: 'v1',
      estimatedTime: '2時間',
      completedTime: '1.5時間',
      requirements: '10枚、背景削除、色調補正、サイズ統一',
      feedback: '背景の白をもっと純白に調整してください',
      assets: { images: 10 },
    },
    {
      id: 4,
      client: 'クライアントD',
      projectName: 'ブランドムービー編集',
      type: '動画編集',
      status: '編集待ち',
      priority: 'medium',
      deadline: '2024-12-23',
      assignedBy: 'ディレクター田中',
      createdAt: '2024-12-19',
      version: 'v1',
      estimatedTime: '8時間',
      requirements: '120秒、シネマティック、カラーグレーディング重視',
      assets: { videos: 15, images: 5 },
    },
    {
      id: 5,
      client: 'クライアントE',
      projectName: 'SNS投稿画像作成',
      type: '画像編集',
      status: '承認済み',
      priority: 'low',
      deadline: '2024-12-25',
      assignedBy: 'ディレクター佐藤',
      createdAt: '2024-12-15',
      version: 'final',
      estimatedTime: '1時間',
      completedTime: '1時間',
      requirements: 'Instagram/Twitter/Facebook用、各3サイズ',
      assets: { images: 9 },
    },
    {
      id: 6,
      client: 'クライアントF',
      projectName: 'YouTube動画編集',
      type: '動画編集',
      status: '編集中',
      priority: 'low',
      deadline: '2024-12-27',
      assignedBy: 'ディレクター山田',
      createdAt: '2024-12-18',
      version: 'v1',
      estimatedTime: '6時間',
      completedTime: '3時間',
      requirements: '10分、解説動画、字幕必須、サムネイル作成',
      assets: { videos: 3, images: 15 },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '編集待ち': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case '編集中': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'レビュー待ち': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case '修正依頼': return 'bg-red-500/10 text-red-700 border-red-200';
      case '承認済み': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    return type.includes('動画') ? Film : ImageIcon;
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">My Projects</h1>
        <p className="text-sm text-muted-foreground">担当編集案件一覧</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="クライアント名やプロジェクト名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">すべて</option>
              <option value="編集待ち">編集待ち</option>
              <option value="編集中">編集中</option>
              <option value="レビュー待ち">レビュー待ち</option>
              <option value="修正依頼">修正依頼</option>
              <option value="承認済み">承認済み</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {['all', '編集待ち', '編集中', 'レビュー待ち', '修正依頼', '承認済み'].map((status) => {
          const count = status === 'all' ? projects.length : projects.filter(p => p.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-3 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-muted'
              }`}
            >
              <div className="text-2xl mb-1">{count}</div>
              <div className="text-xs">{status === 'all' ? '全て' : status}</div>
            </button>
          );
        })}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const TypeIcon = getTypeIcon(project.type);
          
          return (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <TypeIcon className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg">{project.client}</h3>
                    <span className={`px-3 py-1 border rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                      優先度: {project.priority === 'high' ? '高' : project.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span className="px-2 py-1 bg-muted text-xs rounded">
                      {project.version}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.projectName}</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  編集開始
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">納期:</span>
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">依頼者:</span>
                  <span>{project.assignedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Film className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">素材:</span>
                  <span>
                    {project.assets.videos && `動画${project.assets.videos}本`}
                    {project.assets.videos && project.assets.images && ' / '}
                    {project.assets.images && `画像${project.assets.images}枚`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">予定:</span>
                  <span>{project.estimatedTime}</span>
                  {project.completedTime && (
                    <span className="text-green-600">
                      ({project.completedTime}完了)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg mb-3">
                <div className="text-xs text-muted-foreground mb-1">編集要件</div>
                <div className="text-sm">{project.requirements}</div>
              </div>

              {project.feedback && (
                <div className="p-3 bg-red-500/5 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-red-600 mb-1">修正フィードバック</div>
                      <div className="text-sm text-red-700">{project.feedback}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button className="px-4 py-2 text-sm bg-muted hover:bg-muted/70 rounded-lg transition-colors">
                  素材を見る
                </button>
                <button className="px-4 py-2 text-sm bg-muted hover:bg-muted/70 rounded-lg transition-colors">
                  履歴を見る
                </button>
                {project.status === 'レビュー待ち' && (
                  <button className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    レビュー状況
                  </button>
                )}
                {project.status === '修正依頼' && (
                  <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    修正対応
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">該当するプロジェクトがありません</p>
        </div>
      )}
    </div>
  );
}
