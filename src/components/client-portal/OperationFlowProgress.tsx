import { CheckCircle2, Circle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  dueDate?: string;
  assignee?: string;
  completedDate?: string;
  progress?: number;
}

interface OperationFlowProgressProps {
  clientName: string;
  projectName: string;
  overallProgress: number;
  steps?: FlowStep[];
}

export function OperationFlowProgress({ 
  clientName,
  projectName,
  overallProgress,
  steps = [
    {
      id: '1',
      title: 'ヒアリング・要件定義',
      description: 'クライアントニーズの把握、ターゲット層の確認',
      status: 'completed',
      completedDate: '2024/01/15',
      assignee: '佐藤',
      progress: 100
    },
    {
      id: '2',
      title: 'コンテンツ戦略策定',
      description: '投稿方針、トンマナ、投稿スケジュールの決定',
      status: 'completed',
      completedDate: '2024/01/22',
      assignee: '鈴木',
      progress: 100
    },
    {
      id: '3',
      title: 'クリエイティブ制作',
      description: '写真撮影、動画編集、グラフィックデザイン',
      status: 'in-progress',
      dueDate: '2024/02/05',
      assignee: '田中',
      progress: 65
    },
    {
      id: '4',
      title: 'コンテンツレビュー',
      description: 'クライアント確認、修正対応',
      status: 'pending',
      dueDate: '2024/02/10',
      assignee: '佐藤',
      progress: 0
    },
    {
      id: '5',
      title: '投稿・運用開始',
      description: 'スケジュール投稿、エンゲージメント対応',
      status: 'pending',
      dueDate: '2024/02/15',
      assignee: '山田',
      progress: 0
    },
    {
      id: '6',
      title: '効果測定・レポート',
      description: '月次レポート作成、改善提案',
      status: 'pending',
      dueDate: '2024/03/01',
      assignee: '鈴木',
      progress: 0
    }
  ]
}: OperationFlowProgressProps) {
  
  const getStatusConfig = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success',
          label: '完了',
          dotColor: 'bg-success'
        };
      case 'in-progress':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500',
          label: '進行中',
          dotColor: 'bg-blue-500'
        };
      case 'pending':
        return {
          icon: Circle,
          color: 'text-muted-foreground',
          bg: 'bg-muted/20',
          border: 'border-muted',
          label: '未着手',
          dotColor: 'bg-muted-foreground/30'
        };
      case 'blocked':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          border: 'border-destructive',
          label: 'ブロック',
          dotColor: 'bg-destructive'
        };
    }
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-1">
              運用フロー進捗状況
            </h3>
            <p className="text-xs text-muted-foreground">
              {clientName} - {projectName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-card-foreground">
              {overallProgress}%
            </div>
            <div className="text-xs text-muted-foreground">
              {completedSteps}/{totalSteps} ステップ完了
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Flow Steps */}
      <div className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const config = getStatusConfig(step.status);
            const Icon = config.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border -mb-4"></div>
                )}

                <div className={`group relative bg-muted/20 hover:bg-muted/40 border-2 ${config.border} rounded-lg p-4 transition-all duration-200`}>
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`${config.bg} ${config.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10`}>
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Status */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-card-foreground">
                          {step.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color} whitespace-nowrap`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs">
                        {step.assignee && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-[10px] font-medium">
                                {step.assignee.charAt(0)}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {step.assignee}
                            </span>
                          </div>
                        )}

                        {step.completedDate && (
                          <div className="text-success">
                            ✓ 完了日: {step.completedDate}
                          </div>
                        )}

                        {step.dueDate && !step.completedDate && (
                          <div className={step.status === 'in-progress' ? 'text-blue-500' : 'text-muted-foreground'}>
                            期限: {step.dueDate}
                          </div>
                        )}
                      </div>

                      {/* Progress Bar for In-Progress */}
                      {step.status === 'in-progress' && step.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">進捗率</span>
                            <span className="text-xs font-medium text-card-foreground">{step.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${step.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-success mx-auto mb-2"></div>
              <div className="text-xs text-muted-foreground mb-1">完了</div>
              <div className="text-lg font-semibold text-success">
                {steps.filter(s => s.status === 'completed').length}
              </div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2"></div>
              <div className="text-xs text-muted-foreground mb-1">進行中</div>
              <div className="text-lg font-semibold text-blue-500">
                {steps.filter(s => s.status === 'in-progress').length}
              </div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30 mx-auto mb-2"></div>
              <div className="text-xs text-muted-foreground mb-1">未着手</div>
              <div className="text-lg font-semibold text-muted-foreground">
                {steps.filter(s => s.status === 'pending').length}
              </div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-destructive mx-auto mb-2"></div>
              <div className="text-xs text-muted-foreground mb-1">ブロック</div>
              <div className="text-lg font-semibold text-destructive">
                {steps.filter(s => s.status === 'blocked').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
