import { 
  Home,
  Calendar, 
  Sparkles, 
  Users, 
  Settings, 
  LucideIcon,
  Inbox,
  ListTodo,
  GitBranch,
  PenTool,
  TrendingUp,
  User,
  Shield,
  Bell,
  ChevronRight,
  Activity,
  LayoutDashboard,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

interface CompactDrawerProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onExpand: () => void;
  currentView?: string;
  onViewChange: (view: string) => void;
  currentBoard?: string;
}

interface CompactMenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

// Define menu items for each main category and board
const getMenuItemsForCategory = (category: string, currentBoard?: string): CompactMenuItem[] => {
  switch (category) {
    case 'home':
      // Direction Board has different home menu items
      if (currentBoard === 'direction') {
        return [
          { id: 'direction-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'my-clients', icon: Briefcase, label: 'My Clients' },
          { id: 'direction-approvals', icon: CheckCircle2, label: 'Approvals' },
          { id: 'tasks', icon: ListTodo, label: 'Tasks' },
        ];
      }
      // Sales Board (default)
      return [
        { id: 'home', icon: Home, label: 'HOME' },
        { id: 'tasks', icon: ListTodo, label: 'Tasks' },
        { id: 'inbox-alerts', icon: Inbox, label: 'Inbox / Alerts' },
        { id: 'kpi-reports', icon: Activity, label: 'KPI Reports' },
        { id: 'pipeline', icon: GitBranch, label: 'Pipeline' },
      ];
    case 'schedule':
      return [
        { id: 'schedule', icon: Calendar, label: 'Schedule' },
      ];
    case 'ai':
      return [
        { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI' },
      ];
    case 'clients':
      return [
        { id: 'clients-all', icon: Users, label: 'Clients' },
      ];
    case 'sns-news':
      return [
        { id: 'sns-news', icon: Bell, label: 'SNS News' },
      ];
    case 'settings':
      return [
        { id: 'settings-profile', icon: Settings, label: 'Settings' },
      ];
    default:
      return [];
  }
};

export function CompactDrawer({ activeItem, onItemClick, onExpand, currentView, onViewChange, currentBoard }: CompactDrawerProps) {
  const menuItems = getMenuItemsForCategory(activeItem, currentBoard);

  return (
    <div className="fixed top-16 left-16 w-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 z-30 transition-all duration-300 ease-in-out shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
      {/* Expand Button */}
      <div className="w-full px-2 mb-4">
        <button
          onClick={onExpand}
          className="w-full h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all hover:scale-110 active:scale-95"
          title="展開"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => {
                  onViewChange(item.id);
                }}
                className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 delay-300 z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}