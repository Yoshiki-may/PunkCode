import { CheckCircle2, Circle, ChevronDown } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  company: string;
  deadline: string;
  completed: boolean;
  overdue: boolean;
}

export function TodaysTasks() {
  const tasks: Task[] = [
    {
      id: '1',
      title: '提案書の最終確認',
      company: 'グローバルエンタープライズ',
      deadline: '12/10 14:00',
      completed: false,
      overdue: false,
    },
    {
      id: '2',
      title: 'デモ実施',
      company: 'イノベーション株式会社',
      deadline: '12/10 16:00',
      completed: false,
      overdue: false,
    },
    {
      id: '3',
      title: '見積書送付',
      company: 'マーケティングソリューションズ',
      deadline: '12/09 17:00',
      completed: false,
      overdue: true,
    },
    {
      id: '4',
      title: 'フォローアップメール',
      company: '株式会社ビジネスパートナー',
      deadline: '12/10 10:00',
      completed: true,
      overdue: false,
    },
    {
      id: '5',
      title: '契約書確認依頼',
      company: 'デジタルフロンティア',
      deadline: '12/10 15:30',
      completed: false,
      overdue: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#1F2933]">今日のToDo</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl bg-white hover:bg-[#F9FAFB] transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <span className="text-[#52606D] text-sm">すべて</span>
          <ChevronDown className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-1">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
              task.overdue
                ? 'bg-[#FEF2F2] border border-[#FEE2E2]'
                : index % 2 === 0
                ? 'hover:bg-[#F9FAFB]'
                : 'bg-[#FAFBFC] hover:bg-[#F9FAFB]'
            }`}
          >
            <button className="flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
              ) : (
                <Circle className="w-5 h-5 text-[#CBD5E1]" strokeWidth={2} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div
                className={`${
                  task.completed ? 'line-through text-[#94A3B8]' : 'text-[#1F2933]'
                } mb-1`}
              >
                {task.title}
              </div>
              <div className="text-[#7B8794] text-sm truncate">{task.company}</div>
            </div>
            <div
              className={`text-sm flex-shrink-0 ${
                task.overdue ? 'text-[#DC2626]' : 'text-[#7B8794]'
              }`}
            >
              {task.deadline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
