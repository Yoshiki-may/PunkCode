import { useState } from 'react';
import { AlertTriangle, Clock, TrendingUp, Search, ChevronDown } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  taskCount: number;
  workload: 'light' | 'medium' | 'heavy' | 'critical';
  tasks: Task[];
  hoursThisWeek: number;
  capacityHours: number;
}

interface Task {
  id: string;
  name: string;
  client: string;
  deadline: string;
  relativeTime: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
}

export function DirectionWorkload() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'workload' | 'tasks' | 'name'>('workload');

  const members: TeamMember[] = [
    {
      id: '1',
      name: '田中太郎',
      initials: 'TT',
      role: 'ディレクター',
      taskCount: 12,
      workload: 'critical',
      hoursThisWeek: 42,
      capacityHours: 40,
      tasks: [
        {
          id: 't1',
          name: 'Instagram Reels - 新商品紹介',
          client: 'AXAS株式会社',
          deadline: '2024/12/14 18:00',
          relativeTime: 'あと4時間',
          priority: 'high',
          estimatedHours: 8,
        },
        {
          id: 't2',
          name: 'TikTok - 企業紹介',
          client: 'デジタルフロンティア',
          deadline: '2024/12/15 12:00',
          relativeTime: 'あと20時間',
          priority: 'medium',
          estimatedHours: 6,
        },
      ],
    },
    {
      id: '2',
      name: '佐藤花子',
      initials: 'SH',
      role: 'ディレクター',
      taskCount: 9,
      workload: 'heavy',
      hoursThisWeek: 36,
      capacityHours: 40,
      tasks: [
        {
          id: 't3',
          name: 'YouTube動画 - ブランドストーリー',
          client: 'BAYMAX株式会社',
          deadline: '2024/12/15 10:00',
          relativeTime: 'あと18時間',
          priority: 'high',
          estimatedHours: 10,
        },
      ],
    },
    {
      id: '3',
      name: '鈴木一郎',
      initials: 'SI',
      role: 'ディレクター',
      taskCount: 7,
      workload: 'medium',
      hoursThisWeek: 28,
      capacityHours: 40,
      tasks: [
        {
          id: 't4',
          name: 'TikTok - チャレンジ動画',
          client: 'デジタルフロンティア',
          deadline: '2024/12/16 14:00',
          relativeTime: 'あと2日',
          priority: 'medium',
          estimatedHours: 5,
        },
      ],
    },
    {
      id: '4',
      name: '高橋美咲',
      initials: 'TM',
      role: 'アシスタント',
      taskCount: 5,
      workload: 'light',
      hoursThisWeek: 20,
      capacityHours: 40,
      tasks: [
        {
          id: 't5',
          name: 'Instagram Stories - キャンペーン',
          client: 'AXAS株式会社',
          deadline: '2024/12/17 10:00',
          relativeTime: 'あと3日',
          priority: 'low',
          estimatedHours: 4,
        },
      ],
    },
    {
      id: '5',
      name: '伊藤健太',
      initials: 'IK',
      role: 'ディレクター',
      taskCount: 8,
      workload: 'medium',
      hoursThisWeek: 30,
      capacityHours: 40,
      tasks: [
        {
          id: 't6',
          name: 'YouTube Short - 商品解説',
          client: 'BAYMAX株式会社',
          deadline: '2024/12/16 16:00',
          relativeTime: 'あと2日',
          priority: 'medium',
          estimatedHours: 6,
        },
      ],
    },
  ];

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'critical':
        return 'bg-destructive';
      case 'heavy':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-amber-500';
      case 'light':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  const getWorkloadLabel = (workload: string) => {
    switch (workload) {
      case 'critical':
        return '危険';
      case 'heavy':
        return '重';
      case 'medium':
        return '中';
      case 'light':
        return '軽';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const getWorkloadPercentage = (member: TeamMember) => {
    return Math.round((member.hoursThisWeek / member.capacityHours) * 100);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'workload':
        const workloadOrder = { critical: 4, heavy: 3, medium: 2, light: 1 };
        return workloadOrder[b.workload] - workloadOrder[a.workload];
      case 'tasks':
        return b.taskCount - a.taskCount;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const stats = {
    total: members.length,
    critical: members.filter(m => m.workload === 'critical').length,
    heavy: members.filter(m => m.workload === 'heavy').length,
    avgTasks: Math.round(members.reduce((sum, m) => sum + m.taskCount, 0) / members.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">稼働管理</h1>
          <p className="text-sm text-muted-foreground">チームメンバーの稼働状況を把握</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">チーム人数</div>
          <div className="text-2xl text-card-foreground">{stats.total}</div>
        </div>
        <div className="bg-card rounded-xl border border-destructive/20 p-4">
          <div className="text-xs text-destructive mb-1">危険状態</div>
          <div className="text-2xl text-destructive">{stats.critical}</div>
        </div>
        <div className="bg-card rounded-xl border border-orange-500/20 p-4">
          <div className="text-xs text-orange-600 mb-1">高負荷</div>
          <div className="text-2xl text-orange-600">{stats.heavy}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">平均タスク数</div>
          <div className="text-2xl text-card-foreground">{stats.avgTasks}</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="検索（名前、役割）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-10"
            >
              <option value="workload">稼働状況順</option>
              <option value="tasks">タスク数順</option>
              <option value="name">名前順</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-4">
        {sortedMembers.map((member) => {
          const isExpanded = selectedMember === member.id;
          const percentage = getWorkloadPercentage(member);

          return (
            <div
              key={member.id}
              className="bg-card rounded-xl border border-border overflow-hidden transition-all"
            >
              {/* Member Summary */}
              <button
                onClick={() => setSelectedMember(isExpanded ? null : member.id)}
                className="w-full p-6 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Member Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base">
                      {member.initials}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base text-card-foreground">{member.name}</span>
                        {member.workload === 'critical' && (
                          <AlertTriangle className="w-4 h-4 text-destructive" strokeWidth={2} />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex items-center gap-6">
                    {/* Task Count */}
                    <div className="text-center">
                      <div className="text-2xl text-card-foreground">{member.taskCount}</div>
                      <div className="text-xs text-muted-foreground">タスク</div>
                    </div>

                    {/* Hours */}
                    <div className="text-center min-w-[100px]">
                      <div className="text-sm text-card-foreground mb-1">
                        {member.hoursThisWeek}h / {member.capacityHours}h
                      </div>
                      <div className="text-xs text-muted-foreground">{percentage}% 稼働</div>
                    </div>

                    {/* Workload Badge */}
                    <div className="min-w-[80px] text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        member.workload === 'critical' ? 'bg-destructive/10 text-destructive' :
                        member.workload === 'heavy' ? 'bg-orange-500/10 text-orange-600' :
                        member.workload === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-success/10 text-success'
                      }`}>
                        {getWorkloadLabel(member.workload)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workload Bar */}
                <div className="mt-4 w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getWorkloadColor(member.workload)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </button>

              {/* Expanded: Task List */}
              {isExpanded && (
                <div className="border-t border-border p-6 bg-accent/10">
                  <h4 className="text-sm text-card-foreground mb-4">アサイン中のタスク</h4>
                  <div className="space-y-2">
                    {member.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-card-foreground mb-1">{task.name}</div>
                            <div className="text-xs text-muted-foreground">{task.client}</div>
                          </div>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            <span>{task.relativeTime}</span>
                          </div>
                          <span>•</span>
                          <span>見積: {task.estimatedHours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="text-muted-foreground text-sm">該当するメンバーがいません</div>
        </div>
      )}
    </div>
  );
}
