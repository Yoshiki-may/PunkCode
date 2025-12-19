import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Camera } from 'lucide-react';

export function CreatorMyProjects() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      client: 'クライアントA',
      projectName: '新商品プロモーション撮影',
      type: '商品写真',
      status: '撮影待ち',
      priority: 'high',
      deadline: '2024-12-20',
      location: '渋谷スタジオ',
      shootDate: '2024-12-20 10:00',
      requirements: '商品5点、白背景、複数アングル',
    },
    {
      id: 2,
      client: 'クライアントB',
      projectName: 'Instagram リール撮影',
      type: '動画',
      status: 'アップロード待ち',
      priority: 'high',
      deadline: '2024-12-21',
      location: '六本木オフィス',
      shootDate: '2024-12-19 14:00',
      requirements: '15秒×3本、縦型動画',
    },
    {
      id: 3,
      client: 'クライアントC',
      projectName: 'ブランドムービー撮影',
      type: '動画',
      status: '撮影中',
      priority: 'medium',
      deadline: '2024-12-23',
      location: '屋外ロケーション',
      shootDate: '2024-12-20 09:00',
      requirements: '60秒、4K、ドローン撮影含む',
    },
    {
      id: 4,
      client: 'クライアントD',
      projectName: 'スタッフインタビュー撮影',
      type: '動画',
      status: 'レビュー待ち',
      priority: 'low',
      deadline: '2024-12-25',
      location: '新宿オフィス',
      shootDate: '2024-12-18 13:00',
      requirements: 'インタビュー形式、3名',
    },
    {
      id: 5,
      client: 'クライアントE',
      projectName: '季節限定商品撮影',
      type: '商品写真',
      status: '承認済み',
      priority: 'low',
      deadline: '2024-12-27',
      location: '池袋スタジオ',
      shootDate: '2024-12-17 11:00',
      requirements: '商品10点、季節感のある演出',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '撮影待ち': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case '撮影中': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'アップロード待ち': return 'bg-orange-500/10 text-orange-700 border-orange-200';
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
        <p className="text-sm text-muted-foreground">担当撮影案件一覧</p>
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
              <option value="撮影待ち">撮影待ち</option>
              <option value="撮影中">撮影中</option>
              <option value="アップロード待ち">アップロード待ち</option>
              <option value="レビュー待ち">レビュー待ち</option>
              <option value="修正依頼">修正依頼</option>
              <option value="承認済み">承認済み</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {['all', '撮影待ち', '撮影中', 'アップロード待ち', 'レビュー待ち', '承認済み'].map((status) => {
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
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{project.client}</h3>
                  <span className={`px-3 py-1 border rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                    優先度: {project.priority === 'high' ? '高' : project.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.projectName}</p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                詳細を見る
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">タイプ:</span>
                <span>{project.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">撮影日:</span>
                <span>{project.shootDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">場所:</span>
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">納期:</span>
                <span>{project.deadline}</span>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">撮影要件</div>
              <div className="text-sm">{project.requirements}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">該当するプロジェクトがありません</p>
        </div>
      )}
    </div>
  );
}
