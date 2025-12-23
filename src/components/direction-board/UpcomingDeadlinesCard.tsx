import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllTasks, getAllApprovals } from '../../utils/clientData';

interface Deadline {
  id: string;
  name: string;
  client: string;
  date: string;
  relativeTime: string;
  type: 'delivery' | 'shooting' | 'posting';
  assignee: string;
  initials: string;
  dueDate: Date; // ソート用
}

interface UpcomingDeadlinesCardProps {
  onNavigate?: (view: string) => void;
}

export function UpcomingDeadlinesCard({ onNavigate }: UpcomingDeadlinesCardProps) {
  const [activeTab, setActiveTab] = useState<'delivery' | 'shooting' | 'posting'>('delivery');
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  // タスクと承認待ちから期限データを動的に取得
  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = () => {
    const tasks = getAllTasks();
    const approvals = getAllApprovals();
    
    const allDeadlines: Deadline[] = [];
    
    // タスクから期限を抽出
    tasks.forEach(task => {
      if (task.dueDate || task.postDate) {
        const dueDateStr = task.dueDate || task.postDate;
        const dueDate = new Date(dueDateStr);
        
        // タイプを判定（タイトルから推測）
        let type: 'delivery' | 'shooting' | 'posting' = 'delivery';
        const titleLower = task.title.toLowerCase();
        if (titleLower.includes('撮影') || titleLower.includes('shooting')) {
          type = 'shooting';
        } else if (titleLower.includes('投稿') || titleLower.includes('posting') || task.status === 'completed') {
          type = 'posting';
        }
        
        allDeadlines.push({
          id: task.id,
          name: task.title,
          client: task.clientName,
          date: formatDate(dueDate),
          relativeTime: getRelativeTime(dueDate),
          type,
          assignee: task.assignee,
          initials: task.initials,
          dueDate
        });
      }
    });
    
    // 承認待ちから期限を抽出
    approvals.forEach(approval => {
      if (approval.submittedDate) {
        // 承認待ちの場合、提出日から期限を推測（+3日）
        const submittedDate = new Date(approval.submittedDate);
        const dueDate = new Date(submittedDate);
        dueDate.setDate(dueDate.getDate() + 3);
        
        allDeadlines.push({
          id: approval.id,
          name: approval.title,
          client: approval.clientName,
          date: formatDate(dueDate),
          relativeTime: getRelativeTime(dueDate),
          type: 'delivery', // 承認待ちは納期として扱う
          assignee: approval.reviewer,
          initials: getInitials(approval.reviewer),
          dueDate
        });
      }
    });
    
    // 期限が近い順にソート
    allDeadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    
    setDeadlines(allDeadlines);
  };

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const getRelativeTime = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return '期限超過';
    if (hours < 24) return '今日';
    if (days === 1) return '明日';
    if (days < 7) return `あと${days}日`;
    return `${days}日後`;
  };

  const getInitials = (name: string): string => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  const filteredDeadlines = deadlines.filter(d => d.type === activeTab).slice(0, 5);

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'delivery':
        return '納期';
      case 'shooting':
        return '撮影';
      case 'posting':
        return '投稿';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onNavigate?.('direction-projects')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Upcoming Deadlines</h3>
        <span className="text-xs text-muted-foreground">今週の締切</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1">
        {(['delivery', 'shooting', 'posting'] as const).map((type) => (
          <button
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(type);
            }}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
              activeTab === type
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            {getTabLabel(type)}
          </button>
        ))}
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">{filteredDeadlines.length}</div>
        <div className="text-xs text-muted-foreground">件の{getTabLabel(activeTab)}予定</div>
      </div>

      {/* Preview List */}
      <div className="space-y-2 mb-4">
        {filteredDeadlines.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl hover:bg-accent/50 transition-all"
          >
            {/* Item Name */}
            <div className="text-sm text-card-foreground mb-2">{item.name}</div>
            
            {/* Client + Deadline + Assignee */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted-foreground">{item.client}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-destructive" strokeWidth={2} />
                <span className="text-destructive">{item.relativeTime}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{item.date}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                  {item.initials}
                </div>
                <span className="text-muted-foreground">{item.assignee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
      >
        <span>スケジュールへ</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}