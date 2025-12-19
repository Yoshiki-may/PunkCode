import { useState, useEffect } from 'react';
import { IconRail } from './IconRail';
import { ContextDrawer } from './ContextDrawer';
import { CompactDrawer } from './CompactDrawer';
import { HomeDrawerContent } from './drawers/HomeDrawerContent';
import { ScheduleDrawerContent } from './drawers/ScheduleDrawerContent';
import { PALSSAIDrawerContent } from './drawers/PALSSAIDrawerContent';
import { ClientsQuickView } from './drawers/ClientsQuickView';
import { SettingsDrawerContent } from './drawers/SettingsDrawerContent';
import { SNSNewsDrawerContent } from './drawers/SNSNewsDrawerContent';
import { SettingsPopup } from './SettingsPopup';

interface TwoLayerSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentBoard: string;
  onBoardChange: (board: string) => void;
  drawerWidth?: 280 | 320;
  onMinimizedChange?: (isMinimized: boolean) => void;
  selectedClientId?: string | null;
  onClientSelect?: (clientId: string) => void;
  scheduleDate?: Date;
  onScheduleDateChange?: (date: Date) => void;
  onMaximizeToggle?: () => void;
  sidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
}

export function TwoLayerSidebar({ 
  currentView, 
  onViewChange, 
  currentBoard, 
  onBoardChange,
  drawerWidth = 280,
  onMinimizedChange,
  selectedClientId,
  onClientSelect,
  scheduleDate,
  onScheduleDateChange,
  onMaximizeToggle,
  sidebarWidth,
  onSidebarWidthChange
}: TwoLayerSidebarProps) {
  const [activeRailItem, setActiveRailItem] = useState<string>('home');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  // Sync activeRailItem with currentView
  useEffect(() => {
    if (currentView === 'home' || currentView === 'inbox-alerts' || currentView === 'tasks' || currentView === 'kpi-reports' || currentView === 'pipeline') {
      setActiveRailItem('home');
    } else if (currentView === 'clients-all' || currentView === 'client-detail') {
      setActiveRailItem('clients');
    } else if (currentView === 'schedule') {
      setActiveRailItem('schedule');
    } else if (currentView === 'palss-ai') {
      setActiveRailItem('ai');
    } else if (currentView === 'sns-news') {
      setActiveRailItem('sns-news');
    } else if (currentView.startsWith('settings')) {
      setActiveRailItem('settings');
    }
  }, [currentView]);

  const handleRailItemClick = (itemId: string) => {
    // Just switch the active item, don't automatically expand
    setActiveRailItem(itemId);

    // Map rail item to view
    switch (itemId) {
      case 'home':
        onViewChange('home');
        break;
      case 'schedule':
        onViewChange('schedule');
        break;
      case 'sns-news':
        onViewChange('sns-news');
        break;
      case 'ai':
        onViewChange('palss-ai');
        break;
      case 'clients':
        onViewChange('clients-all');
        break;
    }
  };

  const handleSettingsClick = () => {
    setShowSettingsPopup(true);
  };

  const handleFullscreenClick = () => {
    onMaximizeToggle?.();
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    onClientSelect?.(clientId);
    // TODO: Open client detail in main area or detail drawer
  };

  const handleShowAllClients = () => {
    // TODO: Navigate to full clients page in main area
    onViewChange('clients-all');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    onMinimizedChange?.(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
    onMinimizedChange?.(false);
  };

  const getDrawerTitle = () => {
    switch (activeRailItem) {
      case 'home':
        return 'Home';
      case 'schedule':
        return 'Schedule';
      case 'ai':
        return 'PALSS AI';
      case 'clients':
        return 'Clients';
      case 'settings':
        return 'Settings';
      case 'sns-news':
        return 'SNS News';
      default:
        return 'Navigation';
    }
  };

  const renderDrawerContent = () => {
    switch (activeRailItem) {
      case 'home':
        return (
          <HomeDrawerContent
            onViewChange={onViewChange}
            currentView={currentView}
          />
        );
      case 'schedule':
        return (
          <ScheduleDrawerContent
            activeView={currentView}
            onViewChange={onViewChange}
            scheduleDate={scheduleDate}
            onScheduleDateChange={onScheduleDateChange}
          />
        );
      case 'ai':
        return (
          <PALSSAIDrawerContent
            activeView={currentView}
            onViewChange={onViewChange}
          />
        );
      case 'clients':
        return (
          <ClientsQuickView
            onClientSelect={handleClientSelect}
            selectedClient={selectedClient}
            onShowAll={handleShowAllClients}
            currentView={currentView}
            onViewChange={onViewChange}
          />
        );
      case 'sns-news':
        return (
          <SNSNewsDrawerContent
            activeView={currentView}
            onViewChange={onViewChange}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-[#7B8794] text-sm">
            機能を選択してください
          </div>
        );
    }
  };

  // Drawer should not show for settings
  const shouldShowDrawer = activeRailItem !== 'settings';

  // Calculate the actual drawer width (subtract Icon Rail width of 64px)
  const ICON_RAIL_WIDTH = 64;
  const actualDrawerWidth = sidebarWidth ? sidebarWidth - ICON_RAIL_WIDTH : drawerWidth;

  return (
    <div className="relative">
      {/* Icon Rail (Layer 1) - Always visible */}
      <IconRail
        activeItem={activeRailItem}
        onItemClick={handleRailItemClick}
        onSettingsClick={handleSettingsClick}
        onFullscreenClick={handleFullscreenClick}
      />

      {/* Context Drawer (Layer 2) - Full or Compact */}
      {shouldShowDrawer && (
        <ContextDrawer
          width={actualDrawerWidth}
          title={getDrawerTitle()}
          onMinimize={handleMinimize}
          onExpand={handleExpand}
          isMinimized={isMinimized}
          activeItem={activeRailItem}
          onItemClick={handleRailItemClick}
          currentView={currentView}
          onViewChange={onViewChange}
        >
          {renderDrawerContent()}
        </ContextDrawer>
      )}

      {/* Resize Handle */}
      {shouldShowDrawer && !isMinimized && (
        <div
          className="fixed top-16 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors z-50 group"
          style={{ left: `${sidebarWidth ? sidebarWidth : (ICON_RAIL_WIDTH + drawerWidth)}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = sidebarWidth || (ICON_RAIL_WIDTH + drawerWidth);

            const handleMouseMove = (e: MouseEvent) => {
              const delta = e.clientX - startX;
              const newWidth = Math.max(240, Math.min(600, startWidth + delta));
              onSidebarWidthChange?.(newWidth);
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-border group-hover:bg-primary/30 transition-colors" />
        </div>
      )}

      {/* Settings Popup */}
      {showSettingsPopup && (
        <SettingsPopup
          onClose={() => setShowSettingsPopup(false)}
          onViewChange={onViewChange}
          activeView={currentView}
        />
      )}
    </div>
  );
}