import { CheckCircle2, Circle, ChevronRight, Phone, Mail, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface ActionItem {
  id: string;
  title: string;
  nextAction: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  assignee: string;
  clientName: string;
  completed: boolean;
  actionType: 'call' | 'email' | 'task';
}

interface NextActionProps {
  onViewAllClick?: () => void;
}

export function NextAction({ onViewAllClick }: NextActionProps) {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'AXAS株式会社',
      nextAction: '提案資料最終確認・送付',
      priority: 'high',
      deadline: '14:00',
      assignee: '田中太郎',
      clientName: 'AXAS株式会社',
      completed: false,
      actionType: 'email',
    },
    {
      id: '2',
      title: 'BAYMAX株式会社',
      nextAction: 'フォローアップ電話',
      priority: 'high',
      deadline: '16:00',
      assignee: '佐藤花子',
      clientName: 'BAYMAX株式会社',
      completed: false,
      actionType: 'call',
    },
    {
      id: '3',
      title: 'デジタルフロンティア株式会社',
      nextAction: '議事録作成・共有',
      priority: 'medium',
      deadline: '18:00',
      assignee: '自分',
      clientName: 'デジタルフロンティア株式会社',
      completed: false,
      actionType: 'task',
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

  const handleQuickAction = (e: React.MouseEvent, action: ActionItem) => {
    e.stopPropagation();
    
    switch (action.actionType) {
      case 'call':
        alert(`📞 ${action.clientName}に発信中...`);
        break;
      case 'email':
        alert(`📧 ${action.clientName}へのメールテンプレートを開きます`);
        break;
      case 'task':
        toggleComplete(action.id);
        break;
    }
  };

  const getActionIcon = (type: 'call' | 'email' | 'task') => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'task':
        return CheckSquare;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-card-foreground">Next Action</h3>
          <span className="text-xs text-muted-foreground">今日の最重要Top3</span>
        </div>

        <div className="space-y-3">
          {actions.map((action) => {
            const ActionIcon = getActionIcon(action.actionType);
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-all group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(action.id);
                  }}
                  className="flex-shrink-0"
                >
                  {action.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" strokeWidth={2} />
                  )}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleDetailClick(action)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${action.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                      {action.title}
                    </span>
                    <span className={`text-xs ${getPriorityColor(action.priority)}`}>
                      {action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{action.nextAction}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{action.assignee}</span>
                    <span>•</span>
                    <span className={getPriorityColor(action.priority)}>{action.deadline}</span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={(e) => handleQuickAction(e, action)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all opacity-0 group-hover:opacity-100"
                  title={
                    action.actionType === 'call' 
                      ? '電話発信' 
                      : action.actionType === 'email' 
                      ? 'メール送信' 
                      : 'タスク完了'
                  }
                >
                  <ActionIcon className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Button to Tasks */}
        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all group"
          >
            <span className="text-sm font-medium">すべてのタスクを見る</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        )}
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
            assignee: selectedAction.assignee,
            type: selectedAction.actionType,
            priority: selectedAction.priority,
            description: `${selectedAction.clientName}への提案資料作成タスクです。期限までに完了させる必要があります。`,
            contractValue: '¥5,000,000',
            kpi: [
              { label: '進捗率', value: '75%' },
              { label: '残り時間', value: `${selectedAction.deadline}まで` },
            ],
            deliverables: [
              '提案資料（PowerPoint）',
              '見積書',
              'スケジュール案',
            ],
            relatedLinks: [
              { label: 'クライアント情報', url: '#' },
              { label: '過去の提案資料', url: '#' },
            ],
          }}
        />
      )}
    </>
  );
}