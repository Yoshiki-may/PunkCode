import { Circle, CheckCircle2, ChevronRight, Clock, User, Plus, Filter, Search, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllTasks, updateClientTask, addClientTask, getAllClients } from '../../utils/clientData';
import { AddTaskModal } from '../AddTaskModal';

interface Task {
  id: string;
  name: string;
  client: string;
  clientId: string;
  deadline: string;
  relativeTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  initials: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  platform?: string;
}

export function DirectionTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // LocalStorageからタスクを読み込み
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const allTasks = getAllTasks();
    
    // ClientTaskをTask形式に変換
    const formattedTasks: Task[] = allTasks.map(task => {
      // 期限から相対時間を計算
      const relativeTime = getRelativeTime(task.postDate);
      
      // ステータスをマッピング
      let status: 'pending' | 'in-progress' | 'completed' = 'pending';
      if (task.status === 'in-progress') status = 'in-progress';
      if (task.status === 'completed') status = 'completed';
      
      // 優先度を判定（期限が近いほど高優先度）
      const priority = getPriorityFromDeadline(task.postDate);
      
      // カテゴリーをステータスから判定
      const category = getCategoryFromStatus(task.status);
      
      return {
        id: task.id,
        name: task.title,
        client: task.clientName,
        clientId: task.clientId,
        deadline: task.postDate,
        relativeTime,
        status,
        assignee: task.assignee,
        initials: task.initials,
        priority,
        category,
        platform: task.platform
      };
    });
    
    setTasks(formattedTasks);
  };

  // 期限から相対時間を計算
  const getRelativeTime = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 0) return '期限超過';
    if (hours < 24) return `あと${hours}時間`;
    if (days === 1) return '明日';
    return `${days}日後`;
  };

  // 期限から優先度を判定
  const getPriorityFromDeadline = (deadline: string): 'high' | 'medium' | 'low' => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return 'high';
    if (hours < 72) return 'medium';
    return 'low';
  };

  // ステータスからカテゴリーを判定
  const getCategoryFromStatus = (status: string): string => {
    if (status === 'approval' || status === 'rejected') return '承認';
    if (status === 'in-progress') return '制作中';
    if (status === 'completed') return '完了';
    return 'スケジュール';
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    // LocalStorageを更新
    updateClientTask(task.clientId, id, { 
      status: newStatus === 'completed' ? 'completed' : 'pending'
    });
    
    // ローカルステートを更新
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
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
      
      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskAdded={() => {
          loadTasks(); // タスクを再読み込み
        }}
      />
    </div>
  );
}