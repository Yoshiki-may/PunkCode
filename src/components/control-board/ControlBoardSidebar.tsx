import { 
  LayoutDashboard, 
  DollarSign, 
  Briefcase, 
  Users, 
  Building2, 
  CheckSquare,
  AlertTriangle,
  FileBarChart,
  MessageSquare,
  Settings,
  Newspaper,
  Sparkles,
  UserPlus
} from 'lucide-react';

interface ControlBoardSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ControlBoardSidebar({ currentView, onViewChange }: ControlBoardSidebarProps) {
  const menuItems = [
    { 
      id: 'control-dashboard', 
      icon: LayoutDashboard, 
      label: 'Executive Dashboard',
      description: '統合ダッシュボード'
    },
    { 
      id: 'control-financial', 
      icon: DollarSign, 
      label: 'Financial Overview',
      description: '財務統括'
    },
    { 
      id: 'control-projects', 
      icon: Briefcase, 
      label: 'Project Portfolio',
      description: '全案件俯瞰'
    },
    { 
      id: 'control-team', 
      icon: Users, 
      label: 'Team Performance',
      description: 'チームパフォーマンス'
    },
    { 
      id: 'control-invite', 
      icon: UserPlus, 
      label: 'Team Members',
      description: 'メンバー招待・管理'
    },
    { 
      id: 'control-clients', 
      icon: Building2, 
      label: 'Client Intelligence',
      description: 'クライアント統括'
    },
    { 
      id: 'control-approvals', 
      icon: CheckSquare, 
      label: 'Approval Center',
      description: '承認センター'
    },
    { 
      id: 'control-risk', 
      icon: AlertTriangle, 
      label: 'Risk Management',
      description: 'リスク管理'
    },
    { 
      id: 'control-reports', 
      icon: FileBarChart, 
      label: 'Reports & Analytics',
      description: 'レポート・分析'
    },
  ];

  const commonItems = [
    { id: 'control-ai', icon: Sparkles, label: 'PALSS AI' },
    { id: 'control-news', icon: Newspaper, label: 'SNS NEWS' },
    { id: 'control-messages', icon: MessageSquare, label: 'Messages', badge: '3' },
    { id: 'control-settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside 
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border overflow-y-auto"
      style={{ width: '280px' }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-border">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Control Board</h2>
          <p className="text-xs text-muted-foreground">役員専用管理画面</p>
        </div>

        {/* Main Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? '' : 'text-muted-foreground'}`} />
                <div className="flex-1 text-left">
                  <div className="text-sm">{item.label}</div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Common Items */}
        <nav className="space-y-1">
          {commonItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-muted-foreground'}`} />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}