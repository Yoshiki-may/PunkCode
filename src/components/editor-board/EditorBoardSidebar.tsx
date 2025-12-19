import { 
  LayoutDashboard,
  FolderKanban,
  Image,
  Scissors,
  ArrowUpCircle,
  GitBranch,
  MessageCircle,
  Layers,
  Settings,
  LucideIcon
} from 'lucide-react';

interface EditorBoardSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function EditorBoardSidebar({ currentView, onViewChange }: EditorBoardSidebarProps) {
  const menuItems: MenuItem[] = [
    { id: 'editor-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'editor-projects', icon: FolderKanban, label: 'My Projects', badge: 8 },
    { id: 'editor-library', icon: Image, label: 'Asset Library' },
    { id: 'editor-workspace', icon: Scissors, label: 'Workspace' },
    { id: 'editor-review', icon: ArrowUpCircle, label: 'Review Queue', badge: 3 },
    { id: 'editor-versions', icon: GitBranch, label: 'Versions' },
    { id: 'editor-messages', icon: MessageCircle, label: 'Messages', badge: 4 },
    { id: 'editor-templates', icon: Layers, label: 'Templates' },
  ];

  return (
    <div className="fixed top-16 left-0 w-[280px] h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col z-30">
      {/* Logo Section */}
      <div className="h-14 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-sm text-sidebar-foreground font-medium">Editor Workspace</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings - Bottom Fixed */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => onViewChange('editor-settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentView === 'editor-settings'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
