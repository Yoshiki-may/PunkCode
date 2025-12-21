import { User, Bell, Lock, Users, Palette, Zap, HelpCircle, Shield } from 'lucide-react';
import { MenuSectionTitle, MenuItem } from '../DrawerComponents';

interface SettingsDrawerContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function SettingsDrawerContent({ activeView, onViewChange }: SettingsDrawerContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Spacer to push content to bottom */}
      <div className="flex-1" />

      {/* Menu Sections - Positioned at bottom */}
      <div className="px-2 pb-4">
        {/* Account */}
        <MenuSectionTitle title="アカウント" />
        <div className="space-y-1">
          <MenuItem
            icon={User}
            label="プロフィール"
            onClick={() => onViewChange('settings-profile')}
            isActive={activeView === 'settings-profile'}
            hasArrow
          />
          <MenuItem
            icon={Bell}
            label="通知設定"
            onClick={() => onViewChange('settings-notifications')}
            isActive={activeView === 'settings-notifications'}
            hasArrow
          />
          <MenuItem
            icon={Lock}
            label="プライバシー＆セキュリティ"
            onClick={() => onViewChange('settings-privacy')}
            isActive={activeView === 'settings-privacy'}
            hasArrow
          />
        </div>

        {/* Team */}
        <MenuSectionTitle title="チーム" />
        <div className="space-y-1">
          <MenuItem
            icon={Users}
            label="メンバー"
            onClick={() => onViewChange('settings-members')}
            isActive={activeView === 'settings-members'}
            badge="12"
            hasArrow
          />
          <MenuItem
            icon={Shield}
            label="権限管理"
            onClick={() => onViewChange('settings-permissions')}
            isActive={activeView === 'settings-permissions'}
            hasArrow
          />
        </div>

        {/* System */}
        <MenuSectionTitle title="システム" />
        <div className="space-y-1">
          <MenuItem
            icon={Palette}
            label="外観"
            onClick={() => onViewChange('settings-appearance')}
            isActive={activeView === 'settings-appearance'}
            hasArrow
          />
          <MenuItem
            icon={Zap}
            label="連携サービス"
            onClick={() => onViewChange('settings-integrations')}
            isActive={activeView === 'settings-integrations'}
            badge="5"
            hasArrow
          />
          <MenuItem
            icon={HelpCircle}
            label="ヘルプ＆サポート"
            onClick={() => onViewChange('settings-help')}
            isActive={activeView === 'settings-help'}
            hasArrow
          />
        </div>
      </div>
    </div>
  );
}