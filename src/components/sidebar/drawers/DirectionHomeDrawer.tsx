import { 
  LayoutDashboard,
  CheckCircle2,
  Briefcase,
  ListTodo
} from 'lucide-react';
import { MenuItem } from '../DrawerComponents';

interface DirectionHomeDrawerProps {
  onViewChange: (view: string) => void;
  currentView?: string;
}

export function DirectionHomeDrawer({ 
  onViewChange,
  currentView = 'direction-dashboard'
}: DirectionHomeDrawerProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto px-2 pt-3">
        <div className="space-y-1">
          <MenuItem
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={() => onViewChange('direction-dashboard')}
            isActive={currentView === 'direction-dashboard'}
          />
          <MenuItem
            icon={Briefcase}
            label="My Clients"
            onClick={() => onViewChange('my-clients')}
            isActive={currentView === 'my-clients'}
          />
          <MenuItem
            icon={CheckCircle2}
            label="Approvals"
            onClick={() => onViewChange('direction-approvals')}
            isActive={currentView === 'direction-approvals'}
          />
          <MenuItem
            icon={ListTodo}
            label="Tasks"
            onClick={() => onViewChange('tasks')}
            isActive={currentView === 'tasks'}
          />
        </div>
      </div>
    </div>
  );
}