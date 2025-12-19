import { Home, Video, MessageSquare, CheckSquare, BarChart3, Settings, Search, Bell, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface ClientSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ClientSidebar({ currentView, onViewChange }: ClientSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // 未読通知数

  const menuItems = [
    // 共通機能
    { id: 'client-home', icon: Home, label: 'Client Board', type: 'common' },
    { id: 'chat', icon: MessageSquare, label: 'チャット', type: 'common' },
    { id: 'sns-news', icon: Bell, label: 'SNS NEWS', type: 'common' },
    { id: 'client-tasks', icon: CheckSquare, label: 'スケジュール', type: 'common', badge: '5' },
    
    // AI機能
    { id: 'client-ai-report', icon: BarChart3, label: 'PALSS AI for Client', type: 'ai' },
    
    // 専門機能
    { id: 'client-video-review', icon: Video, label: '動画確認', type: 'specialized', badge: '2' },
    { id: 'client-asset-library', icon: FolderOpen, label: '素材ライブラリ', type: 'specialized' },
    { id: 'client-settings', icon: Settings, label: '設定', type: 'secondary' },
  ];

  const commonItems = menuItems.filter(item => item.type === 'common');
  const aiItems = menuItems.filter(item => item.type === 'ai');
  const specializedItems = menuItems.filter(item => item.type === 'specialized');
  const secondaryItems = menuItems.filter(item => item.type === 'secondary');

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1F2933] fixed left-0 top-16 bottom-0 flex flex-col">
      {/* Notification Banner */}
      {notifications > 0 && (
        <div className="mx-4 mt-4 p-3 bg-[#0C8A5F] rounded-xl">
          <div className="flex items-center gap-2 text-white">
            <Bell className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">{notifications}件の新着通知</span>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="p-4 border-b border-[#1F2933]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" strokeWidth={2} />
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1F2933] border border-[#323F4B] rounded-xl text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all relative ${
                  isActive
                    ? 'bg-[#1F2933] text-[#F9FAFB]'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0C8A5F] rounded-r-full"></div>
                )}
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 bg-[#DC2626] text-white text-xs rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="mx-4 border-t border-[#1F2933] my-2"></div>

        {/* AI Navigation */}
        <div className="px-4 py-4">
          {aiItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all relative ${
                  isActive
                    ? 'bg-[#1F2933] text-[#F9FAFB]'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0C8A5F] rounded-r-full"></div>
                )}
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="mx-4 border-t border-[#1F2933] my-2"></div>

        {/* Specialized Navigation */}
        <div className="px-4 py-4">
          {specializedItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all relative ${
                  isActive
                    ? 'bg-[#1F2933] text-[#F9FAFB]'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0C8A5F] rounded-r-full"></div>
                )}
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 bg-[#DC2626] text-white text-xs rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="mx-4 border-t border-[#1F2933] my-2"></div>

        {/* Secondary Navigation */}
        <div className="px-4 py-4">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all relative ${
                  isActive
                    ? 'bg-[#1F2933] text-[#F9FAFB]'
                    : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0C8A5F] rounded-r-full"></div>
                )}
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[#1F2933]">
        <div className="flex items-center gap-3 p-3 bg-[#1F2933] rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-full flex items-center justify-center">
            <span className="text-white">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#F9FAFB] text-sm truncate">デジタルフロンティア</div>
            <div className="text-[#9CA3AF] text-xs">管理者</div>
          </div>
        </div>
      </div>
    </aside>
  );
}