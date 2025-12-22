import { PALSSChat } from './components/PALSSChat';
import { ToastContainer } from './components/ui/Toast';
import { useState, useEffect } from 'react';
import { Header } from './components/Header_Complete';
import { TwoLayerSidebar } from './components/sidebar/TwoLayerSidebar';
import { QAPanel } from './components/dev/QAPanel';
import { initializeOnce } from './utils/seedInitializer';
import { LandingPage } from './components/LandingPage';
import { ClientRegistration } from './components/ClientRegistration';
import { SalesBoard } from './components/SalesBoard';
import { DirectionDashboard } from './components/direction-board/DirectionDashboard';
import { MyClients } from './components/direction-board/MyClients';
import { DirectionTasks } from './components/direction-board/DirectionTasks';
import { DirectionApprovals } from './components/direction-board/DirectionApprovals';
import { DirectionClientDetail } from './components/direction-board/DirectionClientDetail';
import { PALSSAIHome } from './components/PALSSAIHome';
import { AIResearch } from './components/AIResearch';
import { ScheduleBoard } from './components/ScheduleBoard';
import { SNSNews } from './components/SNSNews';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { DirectionBoard } from './components/DirectionBoard';
import { EditorDashboardView } from './components/editor-board/EditorDashboardView';
import { EditorMyProjects } from './components/editor-board/EditorMyProjects';
import { EditorAssetLibrary } from './components/editor-board/EditorAssetLibrary';
import { EditorWorkspace } from './components/editor-board/EditorWorkspace';
import { EditorReviewQueue } from './components/editor-board/EditorReviewQueue';
import { EditorVersions } from './components/editor-board/EditorVersions';
import { EditorTemplates } from './components/editor-board/EditorTemplates';
import { CreatorDashboardView } from './components/creator-board/CreatorDashboardView';
import { CreatorMyProjects } from './components/creator-board/CreatorMyProjects';
import { ShootCalendar } from './components/creator/ShootCalendar';
import { CreatorUploadAssets } from './components/creator-board/CreatorUploadAssets';
import { CreatorAssetLibrary } from './components/creator-board/CreatorAssetLibrary';
import { CreatorPortfolio } from './components/creator/CreatorPortfolio';
import { ExecutiveDashboard } from './components/control-board/ExecutiveDashboard';
import { FinancialOverview } from './components/control-board/FinancialOverview';
import { ProjectPortfolio } from './components/control-board/ProjectPortfolio';
import { TeamPerformance } from './components/control-board/TeamPerformance';
import { TeamInvite } from './components/control-board/TeamInvite';
import { ClientIntelligence } from './components/control-board/ClientIntelligence';
import { ApprovalCenter } from './components/control-board/ApprovalCenter';
import { RiskManagement } from './components/control-board/RiskManagement';
import { ReportsAnalytics } from './components/control-board/ReportsAnalytics';
import { ClientDashboardView } from './components/client-board/ClientDashboardView';
import { ClientCalendarView } from './components/client-board/ClientCalendarView';
import { ClientApprovalsView } from './components/client-board/ClientApprovalsView';
import { ClientReportsView } from './components/client-board/ClientReportsView';
import { ClientMessagesView } from './components/client-board/ClientMessagesView';
import { ClientDocumentsView } from './components/client-board/ClientDocumentsView';
import { ClientSettingsView } from './components/client-board/ClientSettingsView';
import { InboxAlerts } from './components/InboxAlerts';
import { Tasks } from './components/Tasks';
import { KPIReports } from './components/KPIReports';
import { Pipeline } from './components/Pipeline';
import { Reports } from './components/Reports';
import { Clients } from './components/Clients';
import { TelemarketingList } from './components/TelemarketingList';
import { ClientDetailPage } from './components/ClientDetailPage';
import { ControlBoardSidebar } from './components/control-board/ControlBoardSidebar';
import { ClientBoardSidebar } from './components/client-board/ClientBoardSidebar';
import { CreatorBoardSidebar } from './components/creator-board/CreatorBoardSidebar';
import { EditorBoardSidebar } from './components/editor-board/EditorBoardSidebar';

// PALSS SYSTEM - Main Application Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClientRegistered, setIsClientRegistered] = useState(false);
  const [currentBoard, setCurrentBoard] = useState('sales');
  const [currentView, setCurrentView] = useState('home');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedAIClientId, setSelectedAIClientId] = useState<string | null>(null);
  const [selectedDirectionClientId, setSelectedDirectionClientId] = useState<string | null>(null);
  const [selectedSalesClientId, setSelectedSalesClientId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'feminine' | 'palss'>('palss');
  const [activeSettingsSection, setActiveSettingsSection] = useState('appearance');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date(2025, 11, 15)); // Dec 15, 2025
  const [scheduleViewType, setScheduleViewType] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(344);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [userRole, setUserRole] = useState<'sales' | 'direction' | 'editor' | 'creator' | 'support' | 'client'>('sales');
  
  // DEV: QAパネル表示状態
  const [showQAPanel, setShowQAPanel] = useState(false);
  
  // 初回起動時にSeedデータを初期化（Comment/Contract）
  useEffect(() => {
    initializeOnce();
  }, []);

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
      
      // DEV: Ctrl+Shift+D でQAパネルを表示/非表示
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowQAPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return <LandingPage 
      onLogin={(selectedRole?: string) => {
        setIsLoggedIn(true);
        // 選択された役割に応じてボードを設定
        if (selectedRole) {
          setCurrentBoard(selectedRole);
          setUserRole(selectedRole as 'sales' | 'direction' | 'editor' | 'creator' | 'support' | 'client');
          // 各ボードの初期ビューを設定
          switch (selectedRole) {
            case 'sales':
              setCurrentView('home');
              break;
            case 'direction':
              setCurrentView('direction-dashboard');
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
              setIsClientRegistered(true); // Clientアカウントは登録済みとして扱う
              setCurrentView('client-home');
              break;
            default:
              setCurrentView('home');
          }
        }
      }} 
      theme={theme} 
    />;
  }

  // Show client registration if logged in but not registered (for client users)
  if (isLoggedIn && !isClientRegistered && currentBoard === 'client') {
    return (
      <ClientRegistration 
        onComplete={() => {
          setIsClientRegistered(true);
          setCurrentBoard('client');
          setCurrentView('client-home');
        }}
        onBackToLanding={() => {
          setIsLoggedIn(false);
          setIsClientRegistered(false);
          setCurrentBoard('sales');
        }}
        theme={theme} 
      />
    );
  }

  const renderView = () => {
    // Direction Board
    if (currentBoard === 'direction') {
      switch (currentView) {
        case 'direction-dashboard':
        case 'direction-home':
          return <DirectionDashboard 
            onNavigate={setCurrentView}
          />;
        case 'my-clients':
          return <MyClients 
            onClientSelect={(clientId) => {
              setSelectedDirectionClientId(clientId);
              setCurrentView('direction-client-detail');
            }}
          />;
        case 'tasks':
          return <DirectionTasks />;
        case 'direction-approvals':
          return <DirectionApprovals />;
        case 'direction-client-detail':
          return <DirectionClientDetail 
            clientId={selectedDirectionClientId || undefined}
            onBack={() => setCurrentView('my-clients')}
          />;
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
        case 'schedule':
          return <ScheduleBoard 
            selectedDate={scheduleDate}
            onDateChange={setScheduleDate}
            viewType={scheduleViewType}
            onViewTypeChange={setScheduleViewType}
          />;
        case 'sns-news':
          return <SNSNews />;
        case 'chat':
          return <Chat />;
        case 'settings':
          const directionSection = currentView.startsWith('settings-') 
            ? currentView.replace('settings-', '') 
            : 'appearance';
          return (
            <Settings 
              isDarkMode={theme === 'dark'}
              onDarkModeToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
              theme={theme}
              onThemeChange={setTheme}
              activeSection={directionSection}
            />
          );
        default:
          return <DirectionBoard />;
      }
    }

    // Editor Board
    if (currentBoard === 'editor') {
      switch (currentView) {
        case 'editor-dashboard':
          return <EditorDashboardView />;
        case 'editor-projects':
          return <EditorMyProjects />;
        case 'editor-library':
          return <EditorAssetLibrary />;
        case 'editor-workspace':
          return <EditorWorkspace />;
        case 'editor-review':
          return <EditorReviewQueue />;
        case 'editor-versions':
          return <EditorVersions />;
        case 'editor-messages':
          return <Chat />; // Reuse Chat component
        case 'editor-templates':
          return <EditorTemplates />;
        case 'editor-settings':
          return <Settings 
            isDarkMode={theme === 'dark'}
            onDarkModeToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            theme={theme}
            onThemeChange={setTheme}
            activeSection="appearance"
          />;
        case 'editor-home':
        default:
          return <EditorDashboardView />;
      }
    }

    // Creator Board
    if (currentBoard === 'creator') {
      switch (currentView) {
        case 'creator-dashboard':
          return <CreatorDashboardView />;
        case 'creator-projects':
          return <CreatorMyProjects />;
        case 'creator-calendar':
          return <ShootCalendar />;
        case 'creator-upload':
          return <CreatorUploadAssets />;
        case 'creator-library':
          return <CreatorAssetLibrary />;
        case 'creator-messages':
          return <Chat />; // Reuse Chat component
        case 'creator-portfolio':
          return <CreatorPortfolio />;
        case 'creator-settings':
          return <Settings 
            isDarkMode={theme === 'dark'}
            onDarkModeToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            theme={theme}
            onThemeChange={setTheme}
            activeSection="appearance"
          />;
        case 'creator-home':
        default:
          return <CreatorDashboardView />;
      }
    }

    // Management Board (Support) - Control Board
    if (currentBoard === 'support') {
      switch (currentView) {
        case 'control-dashboard':
        case 'management-home':
          return <ExecutiveDashboard />;
        case 'control-financial':
          return <FinancialOverview />;
        case 'control-projects':
          return <ProjectPortfolio />;
        case 'control-team':
          return <TeamPerformance />;
        case 'control-invite':
          return <TeamInvite />;
        case 'control-clients':
          return <ClientIntelligence />;
        case 'control-approvals':
          return <ApprovalCenter />;
        case 'control-risk':
          return <RiskManagement />;
        case 'control-reports':
          return <ReportsAnalytics />;
        case 'control-ai':
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
        case 'control-news':
        case 'sns-news':
          return <SNSNews />;
        case 'control-messages':
        case 'chat':
          return <Chat />;
        case 'control-settings':
        case 'settings':
          return <Settings 
            isDarkMode={theme === 'dark'}
            onDarkModeToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            theme={theme}
            onThemeChange={setTheme}
            activeSection="appearance"
          />;
        default:
          return <ExecutiveDashboard />;
      }
    }

    // Client Board
    if (currentBoard === 'client') {
      switch (currentView) {
        case 'client-dashboard':
          return <ClientDashboardView />;
        case 'client-calendar':
          return <ClientCalendarView />;
        case 'client-approvals':
          return <ClientApprovalsView />;
        case 'client-reports':
          return <ClientReportsView />;
        case 'client-messages':
          return <ClientMessagesView />;
        case 'client-documents':
          return <ClientDocumentsView />;
        case 'client-settings':
          return <ClientSettingsView />;
        case 'client-home':
        default:
          return <ClientDashboardView />;
      }
    }

    // Sales Board (default)
    switch (currentView) {
      case 'palss-chat':
        return <PALSSChat />;
      case 'home':
        return <SalesBoard onNavigate={setCurrentView} />;
      case 'my-clients':
        return <MyClients 
          onClientSelect={(clientId) => {
            setSelectedSalesClientId(clientId);
            setCurrentView('sales-client-detail');
          }}
        />;
      case 'sales-client-detail':
        return <DirectionClientDetail 
          clientId={selectedSalesClientId || undefined}
          onBack={() => setCurrentView('my-clients')}
        />;
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
    // Control Board (Support) uses simple sidebar
    if (currentBoard === 'support') {
      return (
        <ControlBoardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      );
    }
    
    // Client Board uses simple sidebar
    if (currentBoard === 'client') {
      return (
        <ClientBoardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      );
    }
    
    // Creator Board uses simple sidebar
    if (currentBoard === 'creator') {
      return (
        <CreatorBoardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      );
    }
    
    // Editor Board uses simple sidebar
    if (currentBoard === 'editor') {
      return (
        <EditorBoardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      );
    }
    
    // Other boards use TwoLayerSidebar
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
  // - Client/Creator/Editor Board: Simple sidebar (280px)
  // - Other boards: TwoLayerSidebar
  //   - Minimized: Icon Rail + Compact Drawer (64px + 48px = 112px)
  //   - Expanded: Icon Rail + Context Drawer (64px + 280px = 344px)
  const getSidebarWidth = () => {
    if (currentBoard === 'client' || currentBoard === 'creator' || currentBoard === 'editor') {
      return 280; // Simple sidebar for Client/Creator/Editor Board
    }
    if (isMinimized) {
      return 112; // Icon Rail + Compact Drawer (64px + 48px)
    }
    return sidebarWidth; // Use dynamic sidebar width
  };

  const handleBoardChange = (board: string) => {
    // If switching to Client Board and not registered yet, show registration
    if (board === 'client' && !isClientRegistered) {
      setCurrentBoard(board);
      return;
    }

    setCurrentBoard(board);
    // Reset to appropriate home view when switching boards
    switch (board) {
      case 'sales':
        setCurrentView('home');
        break;
      case 'direction':
        setCurrentView('direction-dashboard');
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
          userRole={userRole}
          onSettingsClick={() => setCurrentView('settings-appearance')}
          onLogout={() => {
            setIsLoggedIn(false);
            setIsClientRegistered(false);
            setCurrentBoard('sales');
            setCurrentView('home');
          }}
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
      <ToastContainer />
      {/* DEV: QAパネル */}
      {showQAPanel && <QAPanel isOpen={showQAPanel} onClose={() => setShowQAPanel(false)} />}
    </div>
  );
}