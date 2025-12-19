import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { CompactDrawer } from './CompactDrawer';

interface ContextDrawerProps {
  width?: number;
  children: ReactNode;
  title?: string;
  onMinimize?: () => void;
  onExpand?: () => void;
  isMinimized?: boolean;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

export function ContextDrawer({ 
  width = 280, 
  children, 
  title,
  onMinimize,
  onExpand,
  isMinimized = false,
  activeItem = '',
  onItemClick = () => {},
  currentView = '',
  onViewChange = () => {}
}: ContextDrawerProps) {
  // Settings should never show compact drawer
  const isSettings = activeItem === 'settings';
  
  // If minimized and not settings, show compact drawer instead
  if (isMinimized && onExpand && !isSettings) {
    return (
      <CompactDrawer
        activeItem={activeItem}
        onItemClick={onItemClick}
        onExpand={onExpand}
        currentView={currentView}
        onViewChange={onViewChange}
      />
    );
  }

  if (isMinimized && !isSettings) {
    return null;
  }

  return (
    <div
      className="fixed top-16 left-16 h-[calc(100vh-4rem)] bg-card border-r border-border shadow-lg overflow-hidden z-30"
      style={{ width: `${width}px` }}
    >
      {/* Drawer Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border">
        <h2 className="text-sm text-card-foreground text-[16px]">{title || 'Sales Board'}</h2>
        {/* Hide minimize button for Settings */}
        {onMinimize && !isSettings && (
          <button
            onClick={onMinimize}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            title="最小化"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Drawer Content */}
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}