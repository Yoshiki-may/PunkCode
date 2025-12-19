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
        <MenuSectionTitle title="Account" />
        <div className="space-y-1">
          <MenuItem
            icon={User}
            label="Profile"
            onClick={() => onViewChange('settings-profile')}
            isActive={activeView === 'settings-profile'}
            hasArrow
          />
          <MenuItem
            icon={Bell}
            label="Notifications"
            onClick={() => onViewChange('settings-notifications')}
            isActive={activeView === 'settings-notifications'}
            hasArrow
          />
          <MenuItem
            icon={Lock}
            label="Privacy & Security"
            onClick={() => onViewChange('settings-privacy')}
            isActive={activeView === 'settings-privacy'}
            hasArrow
          />
        </div>

        {/* Team */}
        <MenuSectionTitle title="Team" />
        <div className="space-y-1">
          <MenuItem
            icon={Users}
            label="Members"
            onClick={() => onViewChange('settings-members')}
            isActive={activeView === 'settings-members'}
            badge="12"
            hasArrow
          />
          <MenuItem
            icon={Shield}
            label="Roles & Permissions"
            onClick={() => onViewChange('settings-permissions')}
            isActive={activeView === 'settings-permissions'}
            hasArrow
          />
        </div>

        {/* System */}
        <MenuSectionTitle title="System" />
        <div className="space-y-1">
          <MenuItem
            icon={Palette}
            label="Appearance"
            onClick={() => onViewChange('settings-appearance')}
            isActive={activeView === 'settings-appearance'}
            hasArrow
          />
          <MenuItem
            icon={Zap}
            label="Integrations"
            onClick={() => onViewChange('settings-integrations')}
            isActive={activeView === 'settings-integrations'}
            badge="5"
            hasArrow
          />
          <MenuItem
            icon={HelpCircle}
            label="Help & Support"
            onClick={() => onViewChange('settings-help')}
            isActive={activeView === 'settings-help'}
            hasArrow
          />
        </div>
      </div>
    </div>
  );
}