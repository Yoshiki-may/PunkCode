import { Home, Users, CheckCircle2, Search, Newspaper, CalendarDays, Sparkles, Phone } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'home', icon: Home, label: 'ホーム', type: 'main' },
    { id: 'palss-ai', icon: Sparkles, label: 'PALSS AI', type: 'main' },
    { id: 'telemarketing-list', icon: Phone, label: 'テレアポリスト', type: 'main' },
    { id: 'pre-contract', icon: Users, label: '契約前クライアント', type: 'main' },
    { id: 'post-contract', icon: CheckCircle2, label: '契約後クライアント', type: 'main' },
    { id: 'sns-news', icon: Newspaper, label: 'SNS NEWS', type: 'main' },
    { id: 'schedule', icon: CalendarDays, label: 'スケジュール', type: 'main' },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1F2933] fixed left-0 top-16 bottom-0 flex flex-col">
      {/* Search Section */}
      <div className="p-4 border-b border-[#1F2933]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" strokeWidth={2} />
          <input
            type="text"
            placeholder="クライアント検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1F2933] border border-[#323F4B] rounded-xl text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          {menuItems.map((item) => {
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
                {item.id === 'palss-ai' && (
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] text-white text-xs rounded-full">
                      AI
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}