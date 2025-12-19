import { Home, Users, UserPlus, UserCheck, Calendar, Sparkles, Newspaper, Settings, Search, MessageSquare, Plus, Building2 } from 'lucide-react';
import { useState } from 'react';

interface SalesSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface Client {
  id: string;
  companyName: string;
  status: 'pre-contract' | 'post-contract';
  owner: 'mine' | 'team';
}

export function SalesSidebar({ currentView, onViewChange }: SalesSidebarProps) {
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [activeClientTab, setActiveClientTab] = useState<'pre-contract' | 'post-contract'>('pre-contract');
  const [activeOwnerTab, setActiveOwnerTab] = useState<'mine' | 'team'>('mine');

  // クライアントのモックデータ
  const clients: Client[] = [
    { id: '1', companyName: 'AXAS株式会社', status: 'pre-contract', owner: 'mine' },
    { id: '2', companyName: 'BAYMAX株式会社', status: 'pre-contract', owner: 'mine' },
    { id: '3', companyName: 'デジタルフロンティア株式会社', status: 'pre-contract', owner: 'team' },
    { id: '4', companyName: 'グローバルソリューションズ', status: 'pre-contract', owner: 'team' },
    { id: '5', companyName: 'クリエイティブワークス', status: 'pre-contract', owner: 'mine' },
    { id: '6', companyName: 'エンタープライズ株式会社', status: 'post-contract', owner: 'mine' },
    { id: '7', companyName: 'フューチャーデザイン', status: 'post-contract', owner: 'mine' },
    { id: '8', companyName: 'スマートビジネス', status: 'post-contract', owner: 'team' },
    { id: '9', companyName: 'イノベーティブ株式会社', status: 'post-contract', owner: 'team' },
  ];

  const menuItems = [
    // 共通機能
    { id: 'home', icon: Home, label: 'Sales Board', type: 'common' },
    { id: 'chat', icon: MessageSquare, label: 'チャット', type: 'common', badge: '5' },
    { id: 'sns-news', icon: Newspaper, label: 'SNS NEWS', type: 'common' },
    { id: 'schedule', icon: Calendar, label: 'スケジュール', type: 'common' },
    
    // AI機能
    { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI for Sales', type: 'ai' },
    
    // 専門機能（クライアント管理を削除）
    { id: 'settings', icon: Settings, label: '設定', type: 'secondary' },
  ];

  const commonItems = menuItems.filter(item => item.type === 'common');
  const aiItems = menuItems.filter(item => item.type === 'ai');
  const specializedItems = menuItems.filter(item => item.type === 'specialized');
  const secondaryItems = menuItems.filter(item => item.type === 'secondary');

  // クライアントリストのフィルタリング
  const filteredClients = clients
    .filter(c => c.owner === activeOwnerTab)
    .filter(c => c.status === activeClientTab)
    .filter(c => {
      if (!clientSearchQuery) return true;
      return c.companyName.toLowerCase().includes(clientSearchQuery.toLowerCase());
    });

  return (
    <aside className="fixed left-0 top-16 w-[344px] h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex overflow-hidden">
      {/* Icon Rail - Left Column */}
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-2">
        {[...commonItems, ...aiItems].map((item) => {
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
        {/* Main Navigation Labels */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {/* Quick Access Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Quick Access</h4>
            <div className="space-y-1">
              {commonItems.slice(0, 4).map((item) => {
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

          {/* Recent Section */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-3">Recent</h4>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-sidebar-foreground hover:bg-sidebar-accent">
                <div className="w-4 h-4 rounded-full bg-blue-500/20"></div>
                <span className="flex-1 text-left text-xs">Last Viewed: Sales Dashboard</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-sidebar-foreground hover:bg-sidebar-accent">
                <div className="w-4 h-4 rounded-full bg-purple-500/20"></div>
                <span className="flex-1 text-left text-xs">Last Viewed: AI Caption Writer</span>
              </button>
            </div>
          </div>

          <div className="my-4 border-t border-sidebar-border"></div>

          {/* Client Management Section */}
          <div className="space-y-3">
            {/* Search Bar with Add Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs transition-all"
                />
              </div>
              <button className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {/* Owner Tab Navigation - Mine / Team */}
            <div className="bg-muted rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveOwnerTab('mine')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-all ${
                  activeOwnerTab === 'mine'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mine
              </button>
              <button
                onClick={() => setActiveOwnerTab('team')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-all ${
                  activeOwnerTab === 'team'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Team
              </button>
            </div>

            {/* Contract Status Tab Navigation */}
            <div className="bg-muted rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveClientTab('pre-contract')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-all ${
                  activeClientTab === 'pre-contract'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pre
              </button>
              <button
                onClick={() => setActiveClientTab('post-contract')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-all ${
                  activeClientTab === 'post-contract'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Post
              </button>
            </div>

            {/* Client List */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB] transition-all text-xs group"
                  >
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                    <span className="flex-1 text-left truncate">{client.companyName}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-[#7B8794] text-xs">
                  {clientSearchQuery ? '該当なし' : 'クライアントなし'}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}