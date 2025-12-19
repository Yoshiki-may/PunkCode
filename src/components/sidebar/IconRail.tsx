import { Home, Calendar, Sparkles, Users, Settings, LucideIcon, Lightbulb, Maximize } from 'lucide-react';
import { useState } from 'react';

export interface RailItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

interface IconRailProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onSettingsClick?: () => void;
  onFullscreenClick?: () => void;
  currentBoard?: string;
}

export function IconRail({ activeItem, onItemClick, onSettingsClick, onFullscreenClick, currentBoard }: IconRailProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Base rail items
  const baseRailItems: RailItem[] = [
    { id: 'home', icon: Home, label: 'Overview' },
  ];

  // Add Clients icon only if not on Direction board
  if (currentBoard !== 'direction') {
    baseRailItems.push({ id: 'clients', icon: Users, label: 'Clients' });
  }

  // Add remaining items
  const railItems: RailItem[] = [
    ...baseRailItems,
    { id: 'ai', icon: Sparkles, label: 'PALSS AI' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'sns-news', icon: Lightbulb, label: 'SNS News' },
  ];

  const handleItemClick = (item: RailItem) => {
    onItemClick(item.id);
  };

  return (
    <div className="fixed left-0 top-16 w-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 z-50">
      {/* Rail Items */}
      <div className="flex flex-col gap-2 w-full px-2">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {/* Left Accent Bar */}
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
                )}

                <Icon className="w-6 h-6" strokeWidth={2} />

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border border-border whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Fullscreen Button - Bottom */}
      <div className="relative group w-full px-2 mb-2">
        <button
          onClick={() => onFullscreenClick?.()}
          onMouseEnter={() => setHoveredItem('fullscreen')}
          onMouseLeave={() => setHoveredItem(null)}
          className="w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 relative text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Maximize className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* Tooltip */}
        {hoveredItem === 'fullscreen' && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border border-border whitespace-nowrap z-50 pointer-events-none">
            Fullscreen
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
          </div>
        )}
      </div>

      {/* Settings Button - Bottom */}
      <div className="relative group w-full px-2">
        <button
          onClick={() => onSettingsClick ? onSettingsClick() : onItemClick('settings')}
          onMouseEnter={() => setHoveredItem('settings')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 relative ${
            activeItem === 'settings'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
        >
          {/* Left Accent Bar */}
          {activeItem === 'settings' && (
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
          )}

          <Settings className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* Tooltip */}
        {hoveredItem === 'settings' && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border border-border whitespace-nowrap z-50 pointer-events-none">
            Settings
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
          </div>
        )}
      </div>
    </div>
  );
}