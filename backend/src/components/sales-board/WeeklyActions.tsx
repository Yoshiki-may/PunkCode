import { Calendar, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface Action {
  id: string;
  title: string;
  clientName: string;
  deadline: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

export function WeeklyActions() {
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  
  const actions: Action[] = [
    {
      id: '1',
      title: 'AXAS社への提案資料作成',
      clientName: 'AXAS株式会社',
      deadline: '12/14 14:00',
      assignee: '田中太郎',
      priority: 'high',
    },
    {
      id: '2',
      title: 'BAYMAX社フォローアップ',
      clientName: 'BAYMAX株式会社',
      deadline: '12/14 16:00',
      assignee: '佐藤花子',
      priority: 'high',
    },
    {
      id: '3',
      title: 'デジタルフロンティア社議事録',
      clientName: 'デジタルフロンティア株式会社',
      deadline: '12/15 10:00',
      assignee: '田中太郎',
      priority: 'medium',
    },
    {
      id: '4',
      title: 'グローバルソリューションズ社アポ設定',
      clientName: 'グローバルソリューションズ',
      deadline: '12/15 15:00',
      assignee: '鈴木一郎',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'クリエイティブワークス社ヒアリング',
      clientName: 'クリエイティブワークス',
      deadline: '12/16 11:00',
      assignee: '佐藤花子',
      priority: 'low',
    },
  ];

  const assignees = ['all', '田中太郎', '佐藤花子', '鈴木一郎'];

  const filteredActions = selectedAssignee === 'all'
    ? actions
    : actions.filter(a => a.assignee === selectedAssignee);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'medium':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'low':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-card-foreground">今週のアクション</h3>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="text-xs text-card-foreground bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee === 'all' ? '全員' : assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-all group"
            >
              <div className={`w-1 h-12 rounded-full ${
                action.priority === 'high' ? 'bg-destructive' :
                action.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm text-card-foreground mb-1 truncate">{action.title}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{action.clientName}</span>
                  <span>•</span>
                  <span>{action.assignee}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  <span>{action.deadline}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </button>
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
            status: '進行中',
            deadline: `2024/${selectedAction.deadline}`,
            assignee: selectedAction.assignee,
            type: 'タスク',
            priority: selectedAction.priority,
            description: `${selectedAction.clientName}に対する${selectedAction.title}のタスクです。`,
            contractValue: '¥3,500,000',
            kpi: [
              { label: '進捗率', value: '60%' },
              { label: '残り時間', value: selectedAction.deadline },
            ],
            deliverables: [
              '提案資料',
              '見積書',
            ],
            relatedLinks: [
              { label: 'クライアント情報', url: '#' },
              { label: 'プロジェクト資料', url: '#' },
            ],
          }}
        />
      )}
    </>
  );
}