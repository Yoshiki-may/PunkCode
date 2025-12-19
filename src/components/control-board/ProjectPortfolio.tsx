import { useState } from 'react';
import { Calendar, Users, DollarSign, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

export function ProjectPortfolio() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'クライアントA - SNS運用',
      board: 'Sales',
      status: '商談中',
      progress: 25,
      value: 1200000,
      startDate: '2024-12-15',
      endDate: '2025-03-15',
      team: ['田中', '佐藤'],
      risk: 'low',
    },
    {
      id: 2,
      name: 'クライアントB - 動画制作',
      board: 'Direction',
      status: '進行中',
      progress: 65,
      value: 850000,
      startDate: '2024-12-01',
      endDate: '2024-12-25',
      team: ['ディレクター佐藤', 'Editor山田', 'Creator鈴木'],
      risk: 'medium',
    },
    {
      id: 3,
      name: 'クライアントC - 商品撮影',
      board: 'Creator',
      status: '撮影完了',
      progress: 80,
      value: 450000,
      startDate: '2024-12-10',
      endDate: '2024-12-20',
      team: ['Creator田中'],
      risk: 'low',
    },
    {
      id: 4,
      name: 'クライアントD - リール制作',
      board: 'Editor',
      status: '編集中',
      progress: 50,
      value: 320000,
      startDate: '2024-12-12',
      endDate: '2024-12-22',
      team: ['Editor高橋'],
      risk: 'low',
    },
    {
      id: 5,
      name: 'クライアントE - ブランディング',
      board: 'Direction',
      status: '遅延',
      progress: 40,
      value: 2500000,
      startDate: '2024-11-01',
      endDate: '2024-12-20',
      team: ['ディレクター田中', 'Editor佐藤', 'Creator山田'],
      risk: 'high',
    },
    {
      id: 6,
      name: 'クライアントF - Instagram運用',
      board: 'Direction',
      status: '進行中',
      progress: 70,
      value: 680000,
      startDate: '2024-12-05',
      endDate: '2024-12-28',
      team: ['ディレクター鈴木', 'Editor伊藤'],
      risk: 'low',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '商談中': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case '進行中': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case '撮影完了': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case '編集中': return 'bg-green-500/10 text-green-700 border-green-200';
      case '遅延': return 'bg-red-500/10 text-red-700 border-red-200';
      case '完了': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '-';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesBoard = boardFilter === 'all' || project.board === boardFilter;
    return matchesStatus && matchesBoard;
  });

  const totalValue = projects.reduce((sum, p) => sum + p.value, 0);
  const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Project Portfolio</h1>
        <p className="text-sm text-muted-foreground">全案件俯瞰 - プロジェクト一覧とステータス管理</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{projects.length}</div>
          <div className="text-sm text-muted-foreground">総プロジェクト数</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{projects.filter(p => p.status === '進行中').length}</div>
          <div className="text-sm text-muted-foreground">進行中</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">¥{totalValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">総案件額</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{avgProgress.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">平均進捗率</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">すべてのステータス</option>
              <option value="商談中">商談中</option>
              <option value="進行中">進行中</option>
              <option value="撮影完了">撮影完了</option>
              <option value="編集中">編集中</option>
              <option value="遅延">遅延</option>
              <option value="完了">完了</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={boardFilter}
              onChange={(e) => setBoardFilter(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">すべてのボード</option>
              <option value="Sales">Sales Board</option>
              <option value="Direction">Direction Board</option>
              <option value="Editor">Editor Board</option>
              <option value="Creator">Creator Board</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{project.name}</h3>
                  <span className={`px-3 py-1 border rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">
                    {project.board} Board
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg mb-1">¥{project.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">案件額</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">進捗率</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    project.progress >= 80 ? 'bg-green-500' : 
                    project.progress >= 50 ? 'bg-blue-500' : 
                    'bg-orange-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">開始日</div>
                  <div>{project.startDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">納期</div>
                  <div>{project.endDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">担当者</div>
                  <div>{project.team.length}名</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className={`w-4 h-4 ${getRiskColor(project.risk)}`} />
                <div>
                  <div className="text-xs text-muted-foreground">リスク</div>
                  <div className={getRiskColor(project.risk)}>{getRiskLabel(project.risk)}</div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">チームメンバー</div>
              <div className="flex flex-wrap gap-2">
                {project.team.map((member, idx) => (
                  <span key={idx} className="px-2 py-1 bg-background text-xs rounded">
                    {member}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
              <button className="px-4 py-2 text-sm bg-muted hover:bg-muted/70 rounded-lg transition-colors">
                詳細を見る
              </button>
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                管理する
              </button>
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
