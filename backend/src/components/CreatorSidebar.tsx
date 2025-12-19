import { Home, Sparkles, Newspaper, MessageSquare, Calendar, FolderKanban, Upload, Award, Settings, Search } from 'lucide-react';
import { useState } from 'react';

interface CreatorSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function CreatorSidebar({ currentView, onViewChange }: CreatorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    // 共通機能
    { id: 'creator-home', icon: Home, label: 'Creator Board', type: 'common' },
    { id: 'chat', icon: MessageSquare, label: 'チャット', type: 'common', badge: '5' },
    { id: 'sns-news', icon: Newspaper, label: 'SNS NEWS', type: 'common' },
    { id: 'creator-calendar', icon: Calendar, label: 'スケジュール', type: 'common' },
    
    // AI機能
    { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI for Creator', type: 'ai' },
    
    // 専門機能
    { id: 'creator-projects', icon: FolderKanban, label: 'プロジェクト一覧', type: 'specialized' },
    { id: 'creator-upload', icon: Upload, label: '素材アップロード', type: 'specialized', badge: '3' },
    { id: 'creator-portfolio', icon: Award, label: 'ポートフォリオ', type: 'specialized' },
    { id: 'settings', icon: Settings, label: '設定', type: 'secondary' },
  ];

  const commonItems = menuItems.filter(item => item.type === 'common');
  const aiItems = menuItems.filter(item => item.type === 'ai');
  const specializedItems = menuItems.filter(item => item.type === 'specialized');
  const secondaryItems = menuItems.filter(item => item.type === 'secondary');

  return (
    <aside className="fixed left-0 top-16 w-[344px] h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex overflow-hidden">
      {/* Icon Rail - Left Column */}
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-2">
        {[...commonItems, ...aiItems, ...specializedItems].map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          );
        })}
        
        <div className="flex-1" />
        
        {/* Settings at bottom */}
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>

      {/* Context Drawer - Right Column */}
      <div className="flex-1 flex flex-col overflow-hidden bg-sidebar">
        {/* Search Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs transition-all"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {/* Quick Access Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Quick Access</h4>
            <div className="space-y-1">
              {commonItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-4 border-t border-sidebar-border"></div>

          {/* Favorites Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Favorites</h4>
            <div className="space-y-1">
              {aiItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-4 border-t border-sidebar-border"></div>

          {/* Projects Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Projects</h4>
            <div className="space-y-1">
              {specializedItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-4 border-t border-sidebar-border"></div>

          {/* Recent Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Recent</h4>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-sidebar-foreground hover:bg-sidebar-accent">
                <div className="w-4 h-4 rounded-full bg-pink-500/20"></div>
                <span className="flex-1 text-left text-xs">Last Project: Instagram Reels</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-sidebar-foreground hover:bg-sidebar-accent">
                <div className="w-4 h-4 rounded-full bg-purple-500/20"></div>
                <span className="flex-1 text-left text-xs">Last Upload: Product Photos</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}