import { CheckSquare, Clock, AlertTriangle, Calendar, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: 'PALSS' | 'Client' | 'Both';
  assignedPerson: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  category: string;
  relatedContent?: string;
  priority: 'high' | 'medium' | 'low';
}

const statusConfig = {
  'not-started': { label: '未着手', color: 'bg-[#F3F4F6] text-[#6B7280]' },
  'in-progress': { label: '進行中', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  completed: { label: '完了', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  overdue: { label: '期限超過', color: 'bg-[#FEE2E2] text-[#DC2626]' },
};

const assignedToConfig = {
  PALSS: { label: 'PALSS担当', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  Client: { label: 'クライアント担当', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  Both: { label: '両者調整', color: 'bg-[#FEF3C7] text-[#D97706]' },
};

export function ClientTasks() {
  const [filterAssigned, setFilterAssigned] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const tasks: Task[] = [
    {
      id: '1',
      title: 'TikTokアカウント開設手続き',
      description: '1月からのTikTok運用開始に向けて、アカウント開設手続きを完了させる',
      assignedTo: 'Client',
      assignedPerson: '田中様',
      dueDate: '2024/12/15',
      status: 'not-started',
      category: '素材提出',
      priority: 'high',
    },
    {
      id: '2',
      title: '撮影用素材の提供',
      description: '採用ブランディング動画用の社内写真・ロゴデータを提供',
      assignedTo: 'Client',
      assignedPerson: '佐藤様',
      dueDate: '2024/12/12',
      status: 'overdue',
      category: '素材提出',
      priority: 'high',
    },
    {
      id: '3',
      title: 'クリスマスキャンペーン動画3本の撮影・編集',
      description: '12月キャンペーン用の動画制作（企画・撮影・編集・納品）',
      assignedTo: 'PALSS',
      assignedPerson: '山田ディレクター',
      dueDate: '2024/12/20',
      status: 'in-progress',
      category: '撮影・編集',
      relatedContent: '12月キャンペーン',
      priority: 'high',
    },
    {
      id: '4',
      title: '11月度請求書の確認・支払い',
      description: '11月分の制作費用請求書の確認と支払い処理',
      assignedTo: 'Client',
      assignedPerson: '経理部',
      dueDate: '2024/12/18',
      status: 'not-started',
      category: '請求・支払い',
      priority: 'medium',
    },
    {
      id: '5',
      title: '1月のTikTok運用スケジュール案の作成',
      description: 'TikTok運用開始に向けた投稿スケジュールと企画案の作成',
      assignedTo: 'PALSS',
      assignedPerson: 'REONA',
      dueDate: '2024/12/18',
      status: 'not-started',
      category: '企画',
      priority: 'medium',
    },
    {
      id: '6',
      title: '次回撮影日程の調整',
      description: '1月撮影分の日程調整（候補日を3つ提示）',
      assignedTo: 'Both',
      assignedPerson: '山田ディレクター / 田中様',
      dueDate: '2024/12/16',
      status: 'in-progress',
      category: '日程調整',
      priority: 'medium',
    },
    {
      id: '7',
      title: '採用動画の最終確認・承認',
      description: '採用ブランディング動画の最終版確認と承認',
      assignedTo: 'Client',
      assignedPerson: '田中様',
      dueDate: '2024/12/14',
      status: 'not-started',
      category: '最終承認',
      priority: 'high',
    },
    {
      id: '8',
      title: 'Instagram Reels 5本の編集',
      description: '12月後半投稿用のReels編集作業',
      assignedTo: 'PALSS',
      assignedPerson: '佐藤編集',
      dueDate: '2024/12/22',
      status: 'in-progress',
      category: '撮影・編集',
      priority: 'medium',
    },
  ];

  const filteredTasks = tasks.filter(task => {
    if (filterAssigned !== 'all' && task.assignedTo !== filterAssigned) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    clientTasks: tasks.filter(t => t.assignedTo === 'Client').length,
    palssTasks: tasks.filter(t => t.assignedTo === 'PALSS').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const groupedTasks = {
    'not-started': filteredTasks.filter(t => t.status === 'not-started'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    overdue: filteredTasks.filter(t => t.status === 'overdue'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1F2933] mb-2">タスク / スケジュール</h1>
          <p className="text-[#7B8794]">PALSS・クライアント双方のタスク管理</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl transition-all ${
              view === 'list'
                ? 'bg-[#0C8A5F] text-white'
                : 'bg-white text-[#52606D] border border-[#E5E7EB]'
            }`}
          >
            リスト表示
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 rounded-xl transition-all ${
              view === 'kanban'
                ? 'bg-[#0C8A5F] text-white'
                : 'bg-white text-[#52606D] border border-[#E5E7EB]'
            }`}
          >
            カンバン表示
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">全タスク</div>
          <div className="text-[#1F2933] text-3xl">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">クライアント担当</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.clientTasks}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">PALSS担当</div>
          <div className="text-[#4F46E5] text-3xl">{stats.palssTasks}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">期限超過</div>
          <div className="text-[#DC2626] text-3xl">{stats.overdue}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">完了</div>
          <div className="text-[#0C8A5F] text-3xl">{stats.completed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                placeholder="タスクを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            <select
              value={filterAssigned}
              onChange={(e) => setFilterAssigned(e.target.value)}
              className="px-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            >
              <option value="all">すべて</option>
              <option value="Client">クライアント担当</option>
              <option value="PALSS">PALSS担当</option>
              <option value="Both">両者調整</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            >
              <option value="all">すべて</option>
              <option value="not-started">未着手</option>
              <option value="in-progress">進行中</option>
              <option value="completed">完了</option>
              <option value="overdue">期限超過</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Display */}
      {view === 'list' ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const statusInfo = statusConfig[task.status];
            const assignedInfo = assignedToConfig[task.assignedTo];
            const isOverdue = task.status === 'overdue';
            const isClientTask = task.assignedTo === 'Client';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all ${
                  isOverdue ? 'border-l-4 border-l-[#DC2626]' : isClientTask ? 'border-l-4 border-l-[#0C8A5F]' : 'border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#1F2933]">{task.title}</h3>
                      {task.priority === 'high' && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded-full text-xs">
                          <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                          重要
                        </div>
                      )}
                    </div>
                    <p className="text-[#7B8794] text-sm mb-3">{task.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs ${assignedInfo.color}`}>
                        {assignedInfo.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-xs">
                        {task.category}
                      </span>
                      {task.relatedContent && (
                        <span className="text-[#7B8794] text-xs">関連: {task.relatedContent}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-[#7B8794] mb-2">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      {task.dueDate}
                    </div>
                    <div className="text-sm text-[#52606D]">{task.assignedPerson}</div>
                  </div>
                </div>
                {isClientTask && task.status !== 'completed' && (
                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <button className="px-4 py-2 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all text-sm">
                      完了にする
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(groupedTasks).map(([status, tasks]) => {
            const statusInfo = statusConfig[status as keyof typeof statusConfig];
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#1F2933]">{statusInfo.label}</h3>
                  <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full text-xs">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const assignedInfo = assignedToConfig[task.assignedTo];
                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
                      >
                        <h4 className="text-[#1F2933] text-sm mb-2 line-clamp-2">{task.title}</h4>
                        <div className="space-y-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${assignedInfo.color}`}>
                            {assignedInfo.label}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-[#7B8794]">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
