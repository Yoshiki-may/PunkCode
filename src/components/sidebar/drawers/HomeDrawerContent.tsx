import { 
  Home,
  Inbox,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';
import { MenuSectionTitle, MenuItem } from '../DrawerComponents';

interface HomeDrawerContentProps {
  onViewChange: (view: string) => void;
  currentView?: string;
}

export function HomeDrawerContent({ 
  onViewChange,
  currentView = 'home'
}: HomeDrawerContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto px-2 pt-3">
        <div className="space-y-1">
          <MenuItem
            icon={Home}
            label="HOME"
            onClick={() => onViewChange('home')}
            isActive={currentView === 'home'}
          />
          <MenuItem
            icon={CheckSquare}
            label="Tasks"
            onClick={() => onViewChange('tasks')}
            isActive={currentView === 'tasks'}
          />
          <MenuItem
            icon={Inbox}
            label="Inbox / Alerts"
            onClick={() => onViewChange('inbox-alerts')}
            isActive={currentView === 'inbox-alerts'}
          />
          <MenuItem
            icon={Activity}
            label="KPI Reports"
            onClick={() => onViewChange('kpi-reports')}
            isActive={currentView === 'kpi-reports'}
          />
          <MenuItem
            icon={TrendingUp}
            label="Pipeline"
            onClick={() => onViewChange('pipeline')}
            isActive={currentView === 'pipeline'}
          />
        </div>
      </div>
    </div>
  );
}