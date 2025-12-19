import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TwoLayerSidebar } from './components/sidebar/TwoLayerSidebar';
import { SalesBoard } from './components/SalesBoard';
import { InboxAlerts } from './components/InboxAlerts';
import { Tasks } from './components/Tasks';
import { Pipeline } from './components/Pipeline';
import { KPIReports } from './components/KPIReports';
import { NewDirectionBoard } from './components/NewDirectionBoard';
import { NewEditorBoard } from './components/NewEditorBoard';
import { NewCreatorBoard } from './components/NewCreatorBoard';
import { NewCorporateBoard } from './components/NewCorporateBoard';
import { NewClientPortal } from './components/NewClientPortal';
import { DirectionBoard } from './components/DirectionBoard';
import { EditorBoard } from './components/EditorBoard';
import { CreatorBoard } from './components/CreatorBoard';
import { SupportBoard } from './components/SupportBoard';
import { Schedule } from './components/Schedule';
import { ScheduleBoard } from './components/ScheduleBoard';
import { SNSNews } from './components/SNSNews';
import { PALSSAI } from './components/PALSSAI';
import { TelemarketingList } from './components/TelemarketingList';
import { Chat } from './components/Chat';
import { ManagementOverview } from './components/ManagementOverview';
import { ManagementContracts } from './components/ManagementContracts';
import { ManagementApprovals } from './components/ManagementApprovals';
import { FinancialStatus } from './components/FinancialStatus';
import { ClientDashboard } from './components/ClientDashboard';
import { VideoReview } from './components/VideoReview';
import { MeetingMinutes } from './components/MeetingMinutes';
import { ClientTasks } from './components/ClientTasks';
import { ClientAIReport } from './components/ClientAIReport';
import { ClientAssetLibrary } from './components/ClientAssetLibrary';
import { ShootCalendar } from './components/ShootCalendar';
import { AssetUpload } from './components/AssetUpload';
import { CreatorPortfolio } from './components/CreatorPortfolio';
import { ClientDetailPage } from './components/ClientDetailPage';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { Clients } from './components/Clients';
import { PALSSChat } from './components/PALSSChat';
import { PALSSAIHome } from './components/PALSSAIHome';
import { AIResearch } from './components/AIResearch';

export default function App() {
  const [currentBoard, setCurrentBoard] = useState('sales');
  const [currentView, setCurrentView] = useState('home');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedAIClientId, setSelectedAIClientId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'feminine' | 'palss'>('palss');
  const [activeSettingsSection, setActiveSettingsSection] = useState('appearance');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date(2025, 11, 15)); // Dec 15, 2025
  const [scheduleViewType, setScheduleViewType] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(344);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);

  // Apply theme class to document root
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'feminine', 'palss');
    document.body.classList.remove('feminine-bg');
    
    // Add the appropriate theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'feminine') {
      document.documentElement.classList.add('feminine');
      document.body.classList.add('feminine-bg');
    } else if (theme === 'palss') {
      document.documentElement.classList.add('palss');
    }
    // 'light' is the default, no class needed
  }, [theme]);

  // Zoom control with Ctrl + Scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        setZoomLevel((prevZoom) => {
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          const newZoom = prevZoom + delta;
          // Limit zoom between 0.5x and 2x
          return Math.min(Math.max(newZoom, 0.5), 2);
        });
        setShowZoomIndicator(true);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Auto-hide zoom indicator after 2 seconds
  useEffect(() => {
    if (showZoomIndicator) {
      const timer = setTimeout(() => {
        setShowZoomIndicator(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showZoomIndicator, zoomLevel]);

  // ESC key to exit maximize mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  useEffect(() => {
    const rawPath = window.location.pathname;
    const normalizedPath = rawPath.replace(/\/+$/, '') || '/';

    if (normalizedPath === '/hearing') {
      const redirectPath = `/palss-chat${window.location.search}${window.location.hash}`;
      window.history.replaceState(null, '', redirectPath);
      setCurrentBoard('palss-chat');
      setCurrentView('palss-chat');
      return;
    }

    if (normalizedPath === '/palss-chat') {
      setCurrentBoard('palss-chat');
      setCurrentView('palss-chat');
    }
  }, []);

  const renderView = () => {
    // Direction Board
    if (currentBoard === 'direction') {
      switch (currentView) {
        case 'direction-home':
          return <NewDirectionBoard />;
        case 'palss-ai':
          return <PALSSAI boardType="direction" />;
        case 'sns-news':
          return <SNSNews />;
        case 'chat':
          return <Chat />;
        case 'direction-projects':
          return <DirectionBoard />;
        case 'direction-production-schedule':
          return <Schedule />;
        case 'direction-resources':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">リソース管理画面は準備中です</p>
            </div>
          );
        case 'schedule':
          return <ScheduleBoard 
            selectedDate={scheduleDate}
            onDateChange={setScheduleDate}
            viewType={scheduleViewType}
            onViewTypeChange={setScheduleViewType}
          />;
        case 'settings':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">設定画面は準備中です</p>
            </div>
          );
        default:
          return <DirectionBoard />;
      }
    }

    // Editor Board
    if (currentBoard === 'editor') {
      switch (currentView) {
        case 'editor-home':
          return <NewEditorBoard />;
        case 'palss-ai':
          return <PALSSAI boardType="editor" />;
        case 'sns-news':
          return <SNSNews />;
        case 'chat':
          return <Chat />;
        case 'editor-my-tasks':
          return <EditorBoard />;
        case 'editor-asset-library':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">素材ライブラリは準備中です</p>
            </div>
          );
        case 'editor-review-queue':
          return <EditorBoard />;
        case 'schedule':
          return <ScheduleBoard 
            selectedDate={scheduleDate}
            onDateChange={setScheduleDate}
            viewType={scheduleViewType}
            onViewTypeChange={setScheduleViewType}
          />;
        case 'settings':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">設定画面は準備中です</p>
            </div>
          );
        default:
          return <EditorBoard />;
      }
    }

    // Creator Board
    if (currentBoard === 'creator') {
      switch (currentView) {
        case 'creator-home':
          return <NewCreatorBoard />;
        case 'palss-ai':
          return <PALSSAI boardType="creator" />;
        case 'sns-news':
          return <SNSNews />;
        case 'chat':
          return <Chat />;
        case 'creator-calendar':
          return <ShootCalendar />;
        case 'creator-projects':
          return <CreatorBoard />;
        case 'creator-upload':
          return <AssetUpload />;
        case 'creator-portfolio':
          return <CreatorPortfolio />;
        case 'settings':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">設定画面は準備中です</p>
            </div>
          );
        default:
          return <CreatorBoard />;
      }
    }

    // Management Board (Support)
    if (currentBoard === 'support') {
      switch (currentView) {
        case 'management-home':
          return <NewCorporateBoard />;
        case 'palss-ai':
          return <PALSSAI boardType="support" />;
        case 'sns-news':
          return <SNSNews />;
        case 'chat':
          return <Chat />;
        case 'management-overview':
          return <ManagementOverview />;
        case 'management-financial':
          return <FinancialStatus />;
        case 'management-contracts':
          return <ManagementContracts />;
        case 'management-approvals':
          return <ManagementApprovals />;
        case 'schedule':
          return <ScheduleBoard 
            selectedDate={scheduleDate}
            onDateChange={setScheduleDate}
            viewType={scheduleViewType}
            onViewTypeChange={setScheduleViewType}
          />;
        case 'settings':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">設定画面は準備中です</p>
            </div>
          );
        default:
          return <SupportBoard />;
      }
    }

    // Client Board
    if (currentBoard === 'client') {
      switch (currentView) {
        case 'client-home':
          return <NewClientPortal />;
        case 'palss-ai':
          return <PALSSAI boardType="client" />;
        case 'sns-news':
          return <SNSNews />;
        case 'client-tasks':
          return <ClientTasks />;
        case 'client-video-review':
          return <VideoReview />;
        case 'client-meeting-minutes':
          return <MeetingMinutes />;
        case 'client-ai-report':
          return <ClientAIReport />;
        case 'client-asset-library':
          return <ClientAssetLibrary />;
        case 'schedule':
          return <ScheduleBoard 
            selectedDate={scheduleDate}
            onDateChange={setScheduleDate}
            viewType={scheduleViewType}
            onViewTypeChange={setScheduleViewType}
          />;
        case 'settings':
          return (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <p className="text-[#7B8794]">設定画面は準備中です</p>
            </div>
          );
        default:
          return <ClientDashboard />;
      }
    }

    // Sales Board (default)
    switch (currentView) {
      case 'palss-chat':
        return <PALSSChat />;
      case 'home':
        return <SalesBoard onNavigate={setCurrentView} />;
      case 'inbox-alerts':
        return <InboxAlerts />;
      case 'tasks':
        return <Tasks />;
      case 'kpi-reports':
        return <KPIReports />;
      case 'pipeline':
        return <Pipeline />;
      case 'reports-weekly':
        return <Reports />;
      case 'clients-all':
        return <Clients onClientSelect={(clientId) => {
          setSelectedClientId(clientId);
          setCurrentView('client-detail');
        }} />;
      case 'palss-ai':
        return <PALSSAIHome 
          onNavigate={(page, clientId) => {
            setSelectedAIClientId(clientId);
            setCurrentView(page);
          }} 
          theme={theme}
        />;
      case 'ai-research':
        return selectedAIClientId ? (
          <AIResearch 
            clientId={selectedAIClientId}
            onBack={() => setCurrentView('palss-ai')}
          />
        ) : (
          <PALSSAIHome 
            onNavigate={(page, clientId) => {
              setSelectedAIClientId(clientId);
              setCurrentView(page);
            }} 
            theme={theme}
          />
        );
      case 'ai-proposal':
      case 'ai-ideas':
      case 'ai-document':
        return (
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground">このAI機能は準備中です</p>
            <button 
              onClick={() => setCurrentView('palss-ai')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              戻る
            </button>
          </div>
        );
      case 'sns-news':
        return <SNSNews />;
      case 'chat':
        return <Chat />;
      case 'telemarketing-list':
        return <TelemarketingList />;
      case 'schedule':
        return <ScheduleBoard 
          selectedDate={scheduleDate}
          onDateChange={setScheduleDate}
          viewType={scheduleViewType}
          onViewTypeChange={setScheduleViewType}
        />;
      case 'client-detail':
        return selectedClientId ? (
          <ClientDetailPage 
            clientId={selectedClientId}
            onGenerateAIUrl={() => {
              console.log('Generate AI URL for client:', selectedClientId);
              // TODO: Implement AI URL generation
            }}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <p className="text-[#7B8794]">クライアントが選択されていません</p>
          </div>
        );
      case 'settings':
      case 'settings-profile':
      case 'settings-notifications':
      case 'settings-privacy':
      case 'settings-members':
      case 'settings-permissions':
      case 'settings-appearance':
      case 'settings-integrations':
      case 'settings-help':
        // Extract section from view name (e.g., 'settings-appearance' -> 'appearance')
        const section = currentView.startsWith('settings-') 
          ? currentView.replace('settings-', '') 
          : 'appearance';
        return (
          <Settings 
            isDarkMode={theme === 'dark'}
            onDarkModeToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            theme={theme}
            onThemeChange={setTheme}
            activeSection={section}
          />
        );
      default:
        return <SalesBoard />;
    }
  };

  const renderSidebar = () => {
    return (
      <TwoLayerSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        currentBoard={currentBoard}
        onBoardChange={handleBoardChange}
        onMinimizedChange={setIsMinimized}
        selectedClientId={selectedClientId}
        onClientSelect={(clientId) => {
          setSelectedClientId(clientId);
          setCurrentView('client-detail');
        }}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        onMaximizeToggle={() => setIsMaximized(!isMaximized)}
        sidebarWidth={sidebarWidth}
        onSidebarWidthChange={setSidebarWidth}
      />
    );
  };

  // Calculate sidebar width:
  // - Home: Icon Rail + Context Drawer (64px + 280px = 344px)
  // - Minimized: Icon Rail + Compact Drawer (64px + 48px = 112px)
  // - Expanded: Icon Rail + Context Drawer (64px + 280px = 344px)
  const getSidebarWidth = () => {
    if (isMinimized) {
      return 112; // Icon Rail + Compact Drawer (64px + 48px)
    }
    return sidebarWidth; // Use dynamic sidebar width
  };

  const handleBoardChange = (board: string) => {
    setCurrentBoard(board);
    // Reset to appropriate home view when switching boards
    switch (board) {
      case 'sales':
        setCurrentView('home');
        break;
      case 'direction':
        setCurrentView('direction-home');
        break;
      case 'editor':
        setCurrentView('editor-home');
        break;
      case 'creator':
        setCurrentView('creator-home');
        break;
      case 'support':
        setCurrentView('management-home');
        break;
      case 'client':
        setCurrentView('client-home');
        break;
      case 'palss-chat':
        setCurrentView('palss-chat');
        break;
      default:
        setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!isMaximized && (
        <Header 
          currentBoard={currentBoard} 
          onBoardChange={handleBoardChange} 
          theme={theme}
        />
      )}
      {/* Only show sidebar if NOT on PALSS CHAT board and NOT maximized */}
      {currentBoard !== 'palss-chat' && !isMaximized && renderSidebar()}
      
      {/* Main Content Area - Adjust margin based on whether sidebar is shown */}
      <main 
        className="transition-all duration-300 origin-top-left"
        style={{
          marginTop: isMaximized ? '0px' : '4rem',
          padding: isMaximized ? '0px' : '2rem',
          marginLeft: (currentBoard === 'palss-chat' || isMaximized) ? '0px' : `${getSidebarWidth()}px`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          width: (currentBoard === 'palss-chat' || isMaximized)
            ? `calc(100% / ${zoomLevel})` 
            : `calc((100% - ${getSidebarWidth()}px) / ${zoomLevel})`,
          height: `calc(100% / ${zoomLevel})`
        }}
      >
        <div className={isMaximized ? '' : 'max-w-[1440px] mx-auto'}>
          {renderView()}
        </div>
      </main>

      {/* Zoom Indicator */}
      {showZoomIndicator && (
        <div className="fixed bottom-6 right-6 bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">ズーム</span>
            </div>
            <span className="text-sm text-foreground font-semibold tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground/70">
            Ctrl + スクロールで調整
          </div>
        </div>
      )}
    </div>
  );
}
