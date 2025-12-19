import { Briefcase, User, Clock, AlertCircle, CheckCircle2, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  client: string;
  projectName: string;
  salesPerson: string;
  director: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  deadline: string;
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

const statusConfig = {
  planning: { label: '企画中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  'in-progress': { label: '制作中', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
  review: { label: 'レビュー', color: 'bg-[#FED7E2] text-[#DB2777]' },
  completed: { label: '完了', color: 'bg-[#C5F3E5] text-[#0C8A5F]' },
};

const priorityConfig = {
  high: { label: '高', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  medium: { label: '中', color: 'bg-[#FEF3C7] text-[#D97706]' },
  low: { label: '低', color: 'bg-[#E0E7FF] text-[#4F46E5]' },
};

export function DirectionBoard() {
  const [selectedPhase, setSelectedPhase] = useState('all');

  const projects: Project[] = [
    {
      id: '1',
      client: 'デジタルフロンティア',
      projectName: 'コーポレートサイトリニューアル',
      salesPerson: 'REONA',
      director: '山田ディレクター',
      status: 'in-progress',
      deadline: '2024/12/20',
      progress: 65,
      priority: 'high',
    },
    {
      id: '2',
      client: 'グローバルソリューションズ',
      projectName: 'プロモーション動画制作',
      salesPerson: '佐藤営業',
      director: '鈴木ディレクター',
      status: 'review',
      deadline: '2024/12/15',
      progress: 85,
      priority: 'high',
    },
    {
      id: '3',
      client: 'クリエイティブワークス',
      projectName: 'ブランディング企画',
      salesPerson: 'REONA',
      director: '田中ディレクター',
      status: 'planning',
      deadline: '2024/12/25',
      progress: 30,
      priority: 'medium',
    },
    {
      id: '4',
      client: 'テックイノベーション',
      projectName: 'LP制作',
      salesPerson: '高橋営業',
      director: '山田ディレクター',
      status: 'completed',
      deadline: '2024/11/30',
      progress: 100,
      priority: 'medium',
    },
    {
      id: '5',
      client: 'マーケティングソリューションズ',
      projectName: 'SNS広告クリエイティブ',
      salesPerson: '佐藤営業',
      director: '伊藤ディレクター',
      status: 'in-progress',
      deadline: '2024/12/18',
      progress: 45,
      priority: 'low',
    },
  ];

  const filteredProjects = selectedPhase === 'all'
    ? projects
    : projects.filter(p => p.status === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all shadow-[0_1px_3px_0_rgba(12,138,95,0.3)]">
          <Plus className="w-5 h-5" strokeWidth={2} />
          新規プロジェクト
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">進行中プロジェクト</div>
          <div className="text-[#1F2933] text-3xl">{projects.filter(p => p.status === 'in-progress').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">レビュー待ち</div>
          <div className="text-[#1F2933] text-3xl">{projects.filter(p => p.status === 'review').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">完了</div>
          <div className="text-[#1F2933] text-3xl">{projects.filter(p => p.status === 'completed').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="text-[#7B8794] text-sm mb-2">平均進捗率</div>
          <div className="text-[#1F2933] text-3xl">
            {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
          </div>
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
            onClick={() => setSelectedPhase('all')}
            className={`px-4 py-2 rounded-xl transition-all border ${
              selectedPhase === 'all'
                ? 'bg-[#0C8A5F] text-white border-[#0C8A5F]'
                : 'bg-white text-[#52606D] border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            すべて ({projects.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = projects.filter(p => p.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedPhase(key)}
                className={`px-4 py-2 rounded-xl transition-all border ${
                  selectedPhase === key
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

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const statusInfo = statusConfig[project.status];
          const priorityInfo = priorityConfig[project.priority];
          const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed';

          return (
            <div
              key={project.id}
              className={`bg-white rounded-2xl border p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all ${
                isOverdue ? 'border-[#FEE2E2]' : 'border-[#E5E7EB]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${priorityInfo.color}`}>
                      {priorityInfo.label}
                    </span>
                  </div>
                  <h3 className="text-[#1F2933] mb-1">{project.projectName}</h3>
                  <div className="text-[#7B8794] text-sm">{project.client}</div>
                </div>
                {isOverdue && (
                  <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" strokeWidth={2} />
                )}
              </div>

              {/* Team */}
              <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-[#FAFBFC] rounded-xl">
                <div>
                  <div className="flex items-center gap-2 text-[#7B8794] text-xs mb-1">
                    <Briefcase className="w-3.5 h-3.5" strokeWidth={2} />
                    営業担当
                  </div>
                  <div className="text-[#1F2933] text-sm">{project.salesPerson}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#7B8794] text-xs mb-1">
                    <User className="w-3.5 h-3.5" strokeWidth={2} />
                    ディレクター
                  </div>
                  <div className="text-[#1F2933] text-sm">{project.director}</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#7B8794]">進捗率</span>
                  <span className="text-[#1F2933]">{project.progress}%</span>
                </div>
                <div className="bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] h-full rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-2 text-[#7B8794] text-sm">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  納期: {project.deadline}
                </div>
                <button className="px-4 py-2 text-[#0C8A5F] hover:bg-[#C5F3E5] rounded-xl transition-all text-sm">
                  詳細
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}