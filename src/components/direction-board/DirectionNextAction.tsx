import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface ActionItem {
  id: string;
  title: string;
  clientName: string;
  deadline: string;
  completed: boolean;
}

export function DirectionNextAction() {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: '1',
      title: '株式会社AXAS 台本最終確認',
      clientName: 'AXAS株式会社',
      deadline: '14:00',
      completed: false,
    },
    {
      id: '2',
      title: 'BAYMAX社初稿承認依頼',
      clientName: 'BAYMAX株式会社',
      deadline: '16:00',
      completed: false,
    },
    {
      id: '3',
      title: 'デジタルフロンティア社投稿スケジュール調整',
      clientName: 'デジタルフロンティア株式会社',
      deadline: '18:00',
      completed: false,
    },
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  const toggleComplete = (id: string) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, completed: !action.completed } : action
    ));
  };

  const handleDetailClick = (action: ActionItem) => {
    setSelectedAction(action);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827]">Next Action</h3>
          <span className="text-xs text-[#7B8794]">今日の最重要Top3</span>
        </div>

        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] transition-all cursor-pointer group"
              onClick={() => handleDetailClick(action)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(action.id);
                }}
                className="mt-0.5 flex-shrink-0"
              >
                {action.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
                ) : (
                  <Circle className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#0C8A5F] transition-colors" strokeWidth={2} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm ${action.completed ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>
                    {action.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#7B8794]">
                  <span>{action.clientName}</span>
                  <span>•</span>
                  <span className="text-[#DC2626]">{action.deadline}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>

      {selectedAction && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedAction.id,
            title: selectedAction.title,
            clientName: selectedAction.clientName,
            status: selectedAction.completed ? '完了' : '進行中',
            deadline: `2024/12/14 ${selectedAction.deadline}`,
            assignee: 'ディレクションチーム',
            type: 'ディレクション',
            priority: 'high',
            description: `${selectedAction.clientName}の制作案件に関するディレクションタスクです。`,
            deliverables: ['台本', '企画書', '承認資料'],
          }}
        />
      )}
    </>
  );
}
