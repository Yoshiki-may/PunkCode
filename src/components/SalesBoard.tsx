import { NextAction } from './sales-board/NextAction';
import { AlertsWidget } from './sales-board/AlertsWidget';
import { KPISnapshot } from './sales-board/KPISnapshot';
import { PipelineStepper } from './sales-board/PipelineStepper';
import { WeeklyActions } from './sales-board/WeeklyActions';
import { BottleneckAnalysis } from './sales-board/BottleneckAnalysis';

interface SalesBoardProps {
  onNavigate?: (view: string) => void;
}

export function SalesBoard({ onNavigate }: SalesBoardProps) {
  return (
    <div className="space-y-6">
      {/* 上段3カラム */}
      <div className="grid grid-cols-3 gap-6">
        <NextAction onViewAllClick={() => onNavigate?.('tasks')} />
        <AlertsWidget onViewAllClick={() => onNavigate?.('inbox-alerts')} />
        <KPISnapshot onViewAllClick={() => onNavigate?.('kpi-reports')} />
      </div>

      {/* 中段：Pipeline Stepper */}
      <PipelineStepper onViewAllClick={() => onNavigate?.('pipeline')} />

      {/* 下段2カラム */}
      <div className="grid grid-cols-2 gap-6">
        <WeeklyActions />
        <BottleneckAnalysis />
      </div>
    </div>
  );
}