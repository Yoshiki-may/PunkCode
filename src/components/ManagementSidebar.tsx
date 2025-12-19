import { Home, BarChart3, FileText, Users, CheckCircle, DollarSign, Sparkles, Newspaper, Settings, Search, MessageSquare, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ManagementSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ManagementSidebar({ currentView, onViewChange }: ManagementSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    // 共通機能
    { id: 'management-home', icon: Home, label: 'Corporate Board', type: 'common' },
    { id: 'chat', icon: MessageSquare, label: 'チャット', type: 'common', badge: '5' },
    { id: 'sns-news', icon: Newspaper, label: 'SNS NEWS', type: 'common' },
    { id: 'schedule', icon: Calendar, label: 'スケジュール', type: 'common' },
    
    // AI機能
    { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI for Management', type: 'ai' },
    
    // 専門機能
    { id: 'management-overview', icon: BarChart3, label: '組織全体俯瞰', type: 'specialized' },
    { id: 'management-financial', icon: DollarSign, label: '財務状況', type: 'specialized' },
    { id: 'management-contracts', icon: FileText, label: '契約書管理', type: 'specialized' },
    { id: 'management-clients', icon: Users, label: 'クライアント全体管理', type: 'specialized' },
    { id: 'management-approvals', icon: CheckCircle, label: '承認・エスカレーション', type: 'specialized' },
    { id: 'settings', icon: Settings, label: '設定', type: 'secondary' },
  ];

  const commonItems = menuItems.filter(item => item.type === 'common');
  const aiItems = menuItems.filter(item => item.type === 'ai');
  const specializedItems = menuItems.filter(item => item.type === 'specialized');
  const secondaryItems = menuItems.filter(item => item.type === 'secondary');

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#111827] border-r border-[#1F2933] flex flex-col overflow-hidden">
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

        {/* Specialized Navigation */}
        <div className="px-4 py-4">
          {specializedItems.map((item) => {
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