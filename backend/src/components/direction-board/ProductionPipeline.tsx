import { Lightbulb, FileText, Image, Scissors, Eye, Edit, CheckCircle, Upload, BarChart, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface PipelineStep {
  id: string;
  name: string;
  icon: typeof Lightbulb;
  count: number;
  avgDays: number;
  overdue: number;
  assignees: string[];
}

export function ProductionPipeline() {
  const [selectedStep, setSelectedStep] = useState<PipelineStep | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const steps: PipelineStep[] = [
    {
      id: 'planning',
      name: '企画',
      icon: Lightbulb,
      count: 8,
      avgDays: 2,
      overdue: 0,
      assignees: ['田中', '佐藤'],
    },
    {
      id: 'script',
      name: '台本',
      icon: FileText,
      count: 6,
      avgDays: 3,
      overdue: 1,
      assignees: ['田中', '鈴木'],
    },
    {
      id: 'material',
      name: '素材',
      icon: Image,
      count: 10,
      avgDays: 4,
      overdue: 2,
      assignees: ['佐藤', '高橋'],
    },
    {
      id: 'editing',
      name: '編集',
      icon: Scissors,
      count: 12,
      avgDays: 5,
      overdue: 1,
      assignees: ['鈴木', '伊藤'],
    },
    {
      id: 'first-draft',
      name: '初稿',
      icon: Eye,
      count: 5,
      avgDays: 1,
      overdue: 0,
      assignees: ['田中'],
    },
    {
      id: 'revision',
      name: '修正',
      icon: Edit,
      count: 7,
      avgDays: 2,
      overdue: 1,
      assignees: ['鈴木', '伊藤'],
    },
    {
      id: 'approval',
      name: '承認',
      icon: CheckCircle,
      count: 4,
      avgDays: 3,
      overdue: 2,
      assignees: ['田中', '佐藤'],
    },
    {
      id: 'posting',
      name: '投稿',
      icon: Upload,
      count: 3,
      avgDays: 1,
      overdue: 0,
      assignees: ['佐藤'],
    },
    {
      id: 'report',
      name: 'レポート',
      icon: BarChart,
      count: 2,
      avgDays: 2,
      overdue: 0,
      assignees: ['田中'],
    },
  ];

  const handleStepClick = (step: PipelineStep) => {
    setSelectedStep(step);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827]">Production Pipeline</h3>
          <span className="text-xs text-[#7B8794]">制作プロセス全体</span>
        </div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-3 min-w-max">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step)}
                      className="w-56 p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-lg transition-all group bg-white"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F5F5F7] group-hover:bg-[#0C8A5F] transition-colors">
                          <Icon className="w-5 h-5 text-[#111827] group-hover:text-white transition-colors" strokeWidth={2} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-[#111827] mb-0.5">{step.name}</div>
                          <div className="text-xs text-[#7B8794]">{step.count}件</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#7B8794]">平均滞留</span>
                          <span className="text-[#111827]">{step.avgDays}日</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#7B8794]">期限切れ</span>
                          <span className={step.overdue > 0 ? 'text-[#DC2626]' : 'text-[#059669]'}>
                            {step.overdue}件
                          </span>
                        </div>
                        <div className="pt-2 border-t border-[#E5E7EB]">
                          <div className="text-xs text-[#7B8794] mb-1">担当者</div>
                          <div className="text-xs text-[#0C8A5F]">{step.assignees.join(', ')}</div>
                        </div>
                      </div>
                    </button>

                    {index < steps.length - 1 && (
                      <ChevronRight className="w-6 h-6 text-[#9CA3AF] mx-2 flex-shrink-0" strokeWidth={2} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedStep && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedStep.id,
            title: `${selectedStep.name}ステップの案件`,
            clientName: '複数のクライアント',
            status: selectedStep.overdue > 0 ? '期限切れあり' : '進行中',
            deadline: '2024/12/20',
            assignee: selectedStep.assignees.join(', '),
            type: selectedStep.name,
            priority: selectedStep.overdue > 0 ? 'high' : 'medium',
            description: `${selectedStep.name}ステップに${selectedStep.count}件の案件があります。期限切れ: ${selectedStep.overdue}件`,
            kpi: [
              { label: '案件数', value: `${selectedStep.count}件` },
              { label: '平均滞留日数', value: `${selectedStep.avgDays}日` },
              { label: '期限切れ', value: `${selectedStep.overdue}件` },
            ],
          }}
        />
      )}
    </>
  );
}
