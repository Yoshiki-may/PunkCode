import { Circle, CheckCircle2, ChevronRight, Clock, User, Plus, Filter, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  name: string;
  client: string;
  deadline: string;
  relativeTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  initials: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function DirectionTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: '株式会社AXAS 台本最終確認',
      client: 'AXAS株式会社',
      deadline: '2024/12/14 14:00',
      relativeTime: 'あと2時間',
      status: 'pending',
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'high',
      category: '承認',
    },
    {
      id: '2',
      name: 'BAYMAX社初稿承認依頼',
      client: 'BAYMAX株式会社',
      deadline: '2024/12/14 16:00',
      relativeTime: 'あと4時間',
      status: 'pending',
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'high',
      category: '承認',
    },
    {
      id: '3',
      name: 'デジタルフロンティア社投稿スケジュール調整',
      client: 'デジタルフロンティア株式会社',
      deadline: '2024/12/14 18:00',
      relativeTime: 'あと6時間',
      status: 'in-progress',
      assignee: '鈴木一郎',
      initials: 'SI',
      priority: 'medium',
      category: 'スケジュール',
    },
    {
      id: '4',
      name: 'クリエイティブワークス 企画提案資料作成',
      client: 'クリエイティブワークス株式会社',
      deadline: '2024/12/15 10:00',
      relativeTime: '明日',
      status: 'pending',
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'medium',
      category: '企画',
    },
    {
      id: '5',
      name: 'マーケティングラボ 月次レポート作成',
      client: 'マーケティングラボ株式会社',
      deadline: '2024/12/15 15:00',
      relativeTime: '明日',
      status: 'pending',
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'low',
      category: 'レポート',
    },
    {
      id: '6',
      name: 'AXAS株式会社 撮影スケジュール確認',
      client: 'AXAS株式会社',
      deadline: '2024/12/15 17:00',
      relativeTime: '明日',
      status: 'completed',
      assignee: '鈴木一郎',
      initials: 'SI',
      priority: 'medium',
      category: 'スケジュール',
    },
    {
      id: '7',
      name: 'BAYMAX株式会社 コンテンツ企画MTG',
      client: 'BAYMAX株式会社',
      deadline: '2024/12/16 11:00',
      relativeTime: '2日後',
      status: 'pending',
      assignee: '田中太郎',
      initials: 'TT',
      priority: 'medium',
      category: 'ミーティング',
    },
    {
      id: '8',
      name: 'デジタルフロンティア 動画編集フィードバック',
      client: 'デジタルフロンティア株式会社',
      deadline: '2024/12/16 16:00',
      relativeTime: '2日後',
      status: 'in-progress',
      assignee: '佐藤花子',
      initials: 'SH',
      priority: 'high',
      category: 'フィードバック',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'in-progress':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      default:
        return 'bg-[#FEF3C7] text-[#D97706]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '進行中';
      default:
        return '未着手';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      default:
        return '低';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const todayTasks = filteredTasks.filter(t => t.relativeTime.includes('時間'));
  const upcomingTasks = filteredTasks.filter(t => !t.relativeTime.includes('時間'));

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Tasks</h1>
          <p className="text-sm text-muted-foreground">すべてのタスクを管理</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>新規タスク</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-card-foreground mb-1">{tasks.length}</div>
          <div className="text-xs text-muted-foreground">総タスク数</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-[#D97706] mb-1">{pendingCount}</div>
          <div className="text-xs text-muted-foreground">未着手</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-[#2563EB] mb-1">{inProgressCount}</div>
          <div className="text-xs text-muted-foreground">進行中</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl text-[#059669] mb-1">{completedCount}</div>
          <div className="text-xs text-muted-foreground">完了</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タスクやクライアントを検索..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ステータス:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべて</option>
              <option value="pending">未着手</option>
              <option value="in-progress">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">優先度:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" strokeWidth={2} />
            <h3 className="text-card-foreground">今日のタスク</h3>
            <span className="text-xs text-muted-foreground">({todayTasks.length}件)</span>
          </div>

          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-accent/50 transition-all cursor-pointer group border border-transparent hover:border-border"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(task.id);
                  }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm mb-2 ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                    {task.name}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-muted-foreground">{task.client}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-destructive" strokeWidth={2} />
                      <span className="text-destructive">{task.relativeTime}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className={`px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                      優先度: {getPriorityLabel(task.priority)}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{task.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                        {task.initials}
                      </div>
                      <span className="text-muted-foreground">{task.assignee}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
            <h3 className="text-card-foreground">今後のタスク</h3>
            <span className="text-xs text-muted-foreground">({upcomingTasks.length}件)</span>
          </div>

          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-accent/50 transition-all cursor-pointer group border border-transparent hover:border-border"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(task.id);
                  }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm mb-2 ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                    {task.name}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-muted-foreground">{task.client}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                      <span className="text-muted-foreground">{task.relativeTime}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className={`px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                      優先度: {getPriorityLabel(task.priority)}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{task.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                        {task.initials}
                      </div>
                      <span className="text-muted-foreground">{task.assignee}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTasks.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">該当するタスクが見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
