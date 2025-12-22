import { User, Bell, Lock, Users, Palette, Zap, HelpCircle, Shield, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SettingsPopupProps {
  onClose: () => void;
  onViewChange: (view: string) => void;
  activeView: string;
}

interface SettingsMenuItem {
  id: string;
  icon: typeof User;
  label: string;
  badge?: string;
}

interface SettingsSection {
  title: string;
  items: SettingsMenuItem[];
}

export function SettingsPopup({ onClose, onViewChange, activeView }: SettingsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const sections: SettingsSection[] = [
    {
      title: 'アカウント',
      items: [
        { id: 'settings-profile', icon: User, label: 'プロフィール' },
        { id: 'settings-notifications', icon: Bell, label: '通知設定' },
        { id: 'settings-privacy', icon: Lock, label: 'プライバシー＆セキュリティ' },
      ],
    },
    {
      title: 'チーム',
      items: [
        { id: 'settings-members', icon: Users, label: 'メンバー', badge: '12' },
        { id: 'settings-permissions', icon: Shield, label: '権限管理' },
      ],
    },
    {
      title: 'システム',
      items: [
        { id: 'settings-appearance', icon: Palette, label: '外観' },
        { id: 'settings-integrations', icon: Zap, label: '連携サービス', badge: '5' },
        { id: 'settings-help', icon: HelpCircle, label: 'ヘルプ＆サポート' },
      ],
    },
  ];

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed left-20 bottom-4 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-base text-card-foreground">設定</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto">
          {sections.map((section, index) => (
            <div key={section.title} className={index !== 0 ? 'border-t border-border' : ''}>
              {/* Section Title */}
              <div className="px-4 py-2 mt-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              </div>

              {/* Section Items */}
              <div className="px-2 pb-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-card-foreground hover:bg-accent/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}