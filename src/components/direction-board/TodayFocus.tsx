import { Circle, CheckCircle2, ChevronRight, Clock, User } from 'lucide-react';
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
}

interface TodayFocusProps {
  onNavigate?: (view: string) => void;
}

export function TodayFocus({ onNavigate }: TodayFocusProps) {
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
    },
  ]);

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

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Today Focus</h3>
        <span className="text-xs text-muted-foreground">今日の最優先</span>
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">{tasks.filter(t => t.status !== 'completed').length}</div>
        <div className="text-xs text-muted-foreground">件の最重要タスク</div>
      </div>

      {/* Preview List */}
      <div className="space-y-2 mb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all cursor-pointer group"
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
              {/* Item Name */}
              <div className={`text-sm mb-1 ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                {task.name}
              </div>
              
              {/* Client + Deadline + Status + Assignee */}
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

      {/* CTA */}
      <button
        onClick={() => onNavigate?.('tasks')}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group"
      >
        <span>すべて見る</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}
