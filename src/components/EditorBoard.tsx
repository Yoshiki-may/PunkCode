import { Video, Image, FileText, Clock, CheckCircle2, AlertCircle, Play, Pause, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  type: 'video' | 'image' | 'article';
  title: string;
  client: string;
  assignee: string;
  status: 'waiting' | 'in-progress' | 'review' | 'approved' | 'revision';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  progress: number;
  duration?: string;
}

const typeConfig = {
  video: { label: '動画編集', icon: Video, color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  image: { label: '画像編集', icon: Image, color: 'bg-[#FED7E2] text-[#DB2777]' },
  article: { label: '記事作成', icon: FileText, color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
};

const statusConfig = {
  waiting: { label: '待機中', color: 'bg-[#F3F4F6] text-[#6B7280]' },
  'in-progress': { label: '編集中', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  review: { label: 'レビュー待ち', color: 'bg-[#FEF3C7] text-[#D97706]' },
  approved: { label: '承認済み', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
  revision: { label: '修正依頼', color: 'bg-[#FEE2E2] text-[#DC2626]' },
};

const priorityConfig = {
  high: { label: '高', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  medium: { label: '中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: '低', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
};

export function EditorBoard() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const tasks: Task[] = [
    {
      id: '1',
      type: 'video',
      title: 'プロモーション動画',
      client: 'デジタルフロンティア',
      assignee: '山田編集',
      status: 'in-progress',
      priority: 'high',
      deadline: '2024/12/15',
      progress: 65,
      duration: '2:30',
    },
    {
      id: '2',
      type: 'image',
      title: 'Instagram投稿用画像',
      client: 'グローバルソリューションズ',
      assignee: '佐藤デザイナー',
      status: 'review',
      priority: 'medium',
      deadline: '2024/12/12',
      progress: 90,
    },
    {
      id: '3',
      type: 'article',
      title: 'ブログ記事執筆',
      client: 'クリエイティブワークス',
      assignee: '田中ライター',
      status: 'approved',
      priority: 'medium',
      deadline: '2024/12/10',
      progress: 100,
    },
    {
      id: '4',
      type: 'video',
      title: '製品紹介動画',
      client: 'テックイノベーション',
      assignee: '鈴木編集',
      status: 'revision',
      priority: 'high',
      deadline: '2024/12/13',
      progress: 75,
      duration: '3:45',
    },
    {
      id: '5',
      type: 'image',
      title: 'バナー制作',
      client: 'マーケティングソリューションズ',
      assignee: '佐藤デザイナー',
      status: 'waiting',
      priority: 'low',
      deadline: '2024/12/18',
      progress: 0,
    },
    {
      id: '6',
      type: 'video',
      title: 'セミナー動画編集',
      client: 'ビジネスハブ株式会社',
      assignee: '山田編集',
      status: 'in-progress',
      priority: 'medium',
      deadline: '2024/12/16',
      progress: 40,
      duration: '45:00',
    },
  ];

  const filteredTasks = selectedFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]">
          <Plus className="w-5 h-5" strokeWidth={2} />
          新規タスク追加
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">待機中</div>
          <div className="text-[#1F2933] text-3xl">{tasks.filter(t => t.status === 'waiting').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">編集中</div>
          <div className="text-[#1F2933] text-3xl">{tasks.filter(t => t.status === 'in-progress').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">レビュー待ち</div>
          <div className="text-[#1F2933] text-3xl">{tasks.filter(t => t.status === 'review').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">修正依頼</div>
          <div className="text-[#1F2933] text-3xl">{tasks.filter(t => t.status === 'revision').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">承認済み</div>
          <div className="text-[#1F2933] text-3xl">{tasks.filter(t => t.status === 'approved').length}</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
          <h3 className="text-[#1F2933]">ステータスフィルター</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all border ${
              selectedFilter === 'all'
                ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            すべて ({tasks.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = tasks.filter(t => t.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`px-4 py-2 rounded-xl transition-all border ${
                  selectedFilter === key
                    ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                    : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredTasks.map((task) => {
          const typeInfo = typeConfig[task.type];
          const statusInfo = statusConfig[task.status];
          const priorityInfo = priorityConfig[task.priority];
          const TypeIcon = typeInfo.icon;
          const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'approved';

          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all ${
                isOverdue ? 'border-[#FEE2E2]' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    <span className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</span>
                  </div>
                </div>
                {isOverdue && (
                  <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" strokeWidth={2} />
                )}
              </div>

              <h3 className="text-[#1F2933] mb-2">{task.title}</h3>
              <div className="text-[#7B8794] text-sm mb-4">{task.client}</div>

              {task.duration && (
                <div className="flex items-center gap-2 text-sm text-[#52606D] mb-4 p-3 bg-[#FAFBFC] rounded-xl">
                  <Play className="w-4 h-4" strokeWidth={2} />
                  尺: {task.duration}
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#7B8794]">進捗</span>
                  <span className="text-[#1F2933]">{task.progress}%</span>
                </div>
                <div className="bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] h-full rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                <div>
                  <div className="text-[#7B8794] text-xs mb-1">担当編集者</div>
                  <div className="text-[#1F2933] text-sm">{task.assignee}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#7B8794] text-xs mb-1">納期</div>
                  <div className={`text-sm ${isOverdue ? 'text-[#DC2626]' : 'text-[#1F2933]'}`}>
                    {task.deadline}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}