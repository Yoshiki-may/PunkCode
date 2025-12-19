import { Home, CheckSquare, FolderOpen, Clock, Sparkles, Newspaper, Settings, Search, MessageSquare, UserCheck, Plus, Building2 } from 'lucide-react';
import { useState } from 'react';

interface EditorSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface Client {
  id: string;
  companyName: string;
  status: 'pre-contract' | 'post-contract';
  owner: 'mine' | 'team';
}

export function EditorSidebar({ currentView, onViewChange }: EditorSidebarProps) {
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
    { id: 'editor-home', icon: Home, label: 'Editor Board', type: 'common' },
    { id: 'chat', icon: MessageSquare, label: 'チャット', type: 'common', badge: '5' },
    { id: 'sns-news', icon: Newspaper, label: 'SNS NEWS', type: 'common' },
    { id: 'schedule', icon: Clock, label: 'スケジュール', type: 'common' },
    
    // AI機能
    { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI for Editor', type: 'ai' },
    
    // 専門機能（クライアント管理を削除）
    { id: 'editor-my-tasks', icon: CheckSquare, label: 'マイタスク', type: 'specialized' },
    { id: 'editor-asset-library', icon: FolderOpen, label: '素材ライブラリ', type: 'specialized' },
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
    <aside className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] bg-[#111827] border-r border-[#1F2933] flex flex-col overflow-hidden">
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          {commonItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? 'bg-[#0C8A5F] text-white shadow-lg'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1F2933] text-[#9CA3AF]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[#1F2933]"></div>

        {/* AI Navigation */}
        <div className="px-4 py-4">
          {aiItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? 'bg-[#0C8A5F] text-white shadow-lg'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1F2933] text-[#9CA3AF]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[#1F2933]"></div>

        {/* Client Management Section */}
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {/* Search Bar with Add Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="クライアント検索..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#1F2933] border border-[#323F4B] rounded-lg text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0C8A5F] focus:border-transparent text-xs transition-all"
                />
              </div>
              <button className="flex items-center justify-center w-8 h-8 bg-[#0C8A5F] text-white rounded-lg hover:bg-[#0A7550] transition-all">
                <Plus className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Owner Tab Navigation - Mine / Team */}
            <div className="bg-[#1F2933] rounded-lg p-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveOwnerTab('mine')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeOwnerTab === 'mine'
                      ? 'bg-[#0C8A5F] text-white'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  Mine
                </button>
                <button
                  onClick={() => setActiveOwnerTab('team')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeOwnerTab === 'team'
                      ? 'bg-[#0C8A5F] text-white'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  Team
                </button>
              </div>
            </div>

            {/* Status Tab Navigation - 商談中 / 契約済み */}
            <div className="bg-[#1F2933] rounded-lg p-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveClientTab('pre-contract')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeClientTab === 'pre-contract'
                      ? 'bg-[#0C8A5F] text-white'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  商談中
                  <span className={`ml-1 ${
                    activeClientTab === 'pre-contract' ? 'text-white/80' : 'text-[#7B8794]'
                  }`}>
                    ({clients.filter(c => c.owner === activeOwnerTab && c.status === 'pre-contract').length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveClientTab('post-contract')}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeClientTab === 'post-contract'
                      ? 'bg-[#0C8A5F] text-white'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  契約済み
                  <span className={`ml-1 ${
                    activeClientTab === 'post-contract' ? 'text-white/80' : 'text-[#7B8794]'
                  }`}>
                    ({clients.filter(c => c.owner === activeOwnerTab && c.status === 'post-contract').length})
                  </span>
                </button>
              </div>
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
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[#1F2933]"></div>

        {/* Specialized Navigation */}
        <div className="px-4 pb-4">
          {specializedItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0C8A5F] text-white shadow-lg scale-[1.02]'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB] hover:scale-[1.01] hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[#1F2933]"></div>

        {/* Secondary Navigation */}
        <div className="px-4 py-4">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? 'bg-[#0C8A5F] text-white shadow-lg'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}