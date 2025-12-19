import { CheckCircle2, Circle, Clock, Plus, Search, User, Users, Calendar, Link as LinkIcon, MoreHorizontal, ArrowRight, Filter } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  assigneeType: 'self' | 'team';
  clientName: string;
  projectName: string;
  deadline: string;
  createdBy: string;
  createdDate: string;
  relatedLinks?: string[];
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'AXAS社への提案資料最終確認・送付',
      description: '提案資料のレビューを完了し、クライアントへ送付する',
      status: 'in-progress',
      priority: 'high',
      assignee: '自分',
      assigneeType: 'self',
      clientName: 'AXAS株式会社',
      projectName: 'SNS運用代行プロジェクト',
      deadline: '2024/12/14 14:00',
      createdBy: '田中太郎',
      createdDate: '2024/12/10',
      relatedLinks: ['提案資料.pptx', '見積書.xlsx'],
    },
    {
      id: '2',
      title: 'BAYMAXフォローアップ電話',
      description: '前回の提案後のフォローアップを実施',
      status: 'todo',
      priority: 'high',
      assignee: '佐藤花子',
      assigneeType: 'team',
      clientName: 'BAYMAX株式会社',
      projectName: 'インフルエンサーマーケティング',
      deadline: '2024/12/14 16:00',
      createdBy: '自分',
      createdDate: '2024/12/12',
    },
    {
      id: '3',
      title: 'デジタルフロンティア社議事録作成・共有',
      description: '12/11のミーティングの議事録を作成して共有',
      status: 'in-progress',
      priority: 'medium',
      assignee: '自分',
      assigneeType: 'self',
      clientName: 'デジタルフロンティア株式会社',
      projectName: 'コンテンツ制作サポート',
      deadline: '2024/12/14 18:00',
      createdBy: '自分',
      createdDate: '2024/12/11',
      relatedLinks: ['ミーティング録音.mp3'],
    },
    {
      id: '4',
      title: 'クリエイティブワークス見積書作成',
      description: '新規プロジェクトの見積書を作成',
      status: 'review',
      priority: 'medium',
      assignee: '鈴木一郎',
      assigneeType: 'team',
      clientName: 'クリエイティブワークス',
      projectName: 'ブランディング支援',
      deadline: '2024/12/15 12:00',
      createdBy: '田中太郎',
      createdDate: '2024/12/13',
    },
    {
      id: '5',
      title: 'マーケティングラボ月次レポート作成',
      description: '11月分の運用レポートを作成',
      status: 'todo',
      priority: 'low',
      assignee: '高橋美咲',
      assigneeType: 'team',
      clientName: 'マーケティングラボ',
      projectName: '月次運用サポート',
      deadline: '2024/12/16 17:00',
      createdBy: '山田次郎',
      createdDate: '2024/12/13',
    },
    {
      id: '6',
      title: 'ビジネスソリューションズ契約書レビュー',
      description: '更新契約書の内容確認',
      status: 'completed',
      priority: 'high',
      assignee: '自分',
      assigneeType: 'self',
      clientName: 'ビジネスソリューションズ',
      projectName: 'コンサルティング',
      deadline: '2024/12/13 10:00',
      createdBy: '自分',
      createdDate: '2024/12/12',
    },
    {
      id: '7',
      title: 'SNS投稿コンテンツ作成',
      description: '来週分のSNS投稿を5件作成',
      status: 'in-progress',
      priority: 'medium',
      assignee: '自分',
      assigneeType: 'self',
      clientName: 'AXAS株式会社',
      projectName: 'SNS運用代行プロジェクト',
      deadline: '2024/12/15 17:00',
      createdBy: '田中太郎',
      createdDate: '2024/12/13',
    },
  ]);

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'self' | 'team'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Task['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'completed' ? 'todo' : 'completed'
        };
      }
      return task;
    }));
  };

  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };
      case 'medium':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'low':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return '進行中';
      case 'review':
        return 'レビュー待ち';
      case 'completed':
        return '完了';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterAssignee !== 'all' && task.assigneeType !== filterAssignee) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  const selfTasksCount = tasks.filter(t => t.assigneeType === 'self' && t.status !== 'completed').length;
  const overdueTasksCount = tasks.filter(t => {
    const deadline = new Date(t.deadline);
    return deadline < new Date() && t.status !== 'completed';
  }).length;

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
    const priorityStyles = getPriorityStyles(task.priority);
    const isSelected = selectedTaskId === task.id;

    return (
      <button
        onClick={() => setSelectedTaskId(task.id)}
        className={`w-full text-left p-4 bg-card border rounded-xl transition-all hover:shadow-md group ${
          isSelected ? 'border-primary shadow-md' : 'border-border'
        }`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleComplete(task.id);
              }}
              className="flex-shrink-0 mt-0.5"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-success transition-colors" strokeWidth={2} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium mb-2 line-clamp-2 ${
                task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'
              }`}>
                {task.title}
              </h3>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`px-2 py-0.5 text-xs rounded-full border ${priorityStyles.badge}`}>
                  優先度: {getPriorityLabel(task.priority)}
                </span>
                {task.assigneeType === 'self' ? (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs rounded-full flex items-center gap-1">
                    <User className="w-3 h-3" strokeWidth={2} />
                    自分
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" strokeWidth={2} />
                    {task.assignee}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-card-foreground">{task.clientName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {task.deadline}
                    {isOverdue && ' (期限切れ)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Panel - Task Board/List */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-card-foreground mb-2">Tasks</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {selfTasksCount}件の進行中タスク
                </span>
                {overdueTasksCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    期限切れ {overdueTasksCount}件
                  </span>
                )}
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" strokeWidth={2} />
              新規タスク
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="タスクを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value as any)}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべて</option>
              <option value="self">自分</option>
              <option value="team">チーム</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">すべての優先度</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>

            <div className="flex gap-1 p-1 bg-background border border-border rounded-lg">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'board' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                ボード
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                リスト
              </button>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'board' ? (
            <div className="grid grid-cols-4 gap-4 h-full">
              {(['todo', 'in-progress', 'review', 'completed'] as Task['status'][]).map((status) => (
                <div key={status} className="flex flex-col min-h-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-card-foreground">
                      {getStatusLabel(status)}
                    </h3>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                      {tasksByStatus[status].length}
                    </span>
                  </div>
                  <div className="flex-1 bg-accent/30 border border-border rounded-xl p-3 overflow-y-auto space-y-3">
                    {tasksByStatus[status].map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {tasksByStatus[status].length === 0 && (
                      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                        タスクなし
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <CheckCircle2 className="w-16 h-16 text-muted-foreground/30 mb-4" strokeWidth={1.5} />
                    <p className="text-muted-foreground">該当するタスクはありません</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Task Detail */}
      {selectedTask && (
        <div className="w-96 flex-shrink-0 bg-card border border-border rounded-xl p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <button
                  onClick={() => handleToggleComplete(selectedTask.id)}
                  className="flex-shrink-0 mt-1"
                >
                  {selectedTask.status === 'completed' ? (
                    <CheckCircle2 className="w-8 h-8 text-success" strokeWidth={2} />
                  ) : (
                    <Circle className="w-8 h-8 text-muted-foreground hover:text-success transition-colors" strokeWidth={2} />
                  )}
                </button>
                <div className="flex-1">
                  <h2 className={`text-base font-semibold mb-2 ${
                    selectedTask.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'
                  }`}>
                    {selectedTask.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 flex-wrap">
                {(['todo', 'in-progress', 'review', 'completed'] as Task['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedTask.id, status)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      selectedTask.status === status
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">優先度</span>
                  {(() => {
                    const styles = getPriorityStyles(selectedTask.priority);
                    return (
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${styles.badge}`}>
                        {getPriorityLabel(selectedTask.priority)}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">担当者</span>
                  <span className="text-sm text-card-foreground font-medium">
                    {selectedTask.assignee}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">依頼者</span>
                  <span className="text-sm text-card-foreground">
                    {selectedTask.createdBy}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    期限
                  </span>
                  <span className={`text-sm font-medium ${
                    new Date(selectedTask.deadline) < new Date() && selectedTask.status !== 'completed'
                      ? 'text-red-600'
                      : 'text-card-foreground'
                  }`}>
                    {selectedTask.deadline}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4 bg-background rounded-lg space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground mb-3">プロジェクト情報</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">クライアント</span>
                    <span className="text-sm text-card-foreground font-medium">
                      {selectedTask.clientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">プロジェクト</span>
                    <span className="text-sm text-card-foreground">
                      {selectedTask.projectName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              {selectedTask.relatedLinks && selectedTask.relatedLinks.length > 0 && (
                <div className="p-4 bg-background rounded-lg">
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" strokeWidth={2} />
                    関連ファイル
                  </h3>
                  <div className="space-y-2">
                    {selectedTask.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center gap-2 p-2 bg-card hover:bg-accent rounded-lg transition-colors group"
                      >
                        <span className="text-sm text-card-foreground group-hover:text-primary flex-1">
                          {link}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" strokeWidth={2} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border">
              <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                タスクを開く
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
