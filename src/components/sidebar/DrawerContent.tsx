import { Home, Inbox, Calendar, MessageSquare, BarChart3, FileText, PieChart, Settings, Link as LinkIcon, HelpCircle, Briefcase, Users as UsersIcon, Pencil, Video, Building2, UserCircle } from 'lucide-react';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';

interface DrawerContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
  expandedGroups: string[];
  onGroupToggle: (group: string) => void;
  currentBoard: string;
  onBoardChange: (board: string) => void;
}

export function DrawerContent({ 
  activeView, 
  onViewChange, 
  expandedGroups, 
  onGroupToggle,
  currentBoard,
  onBoardChange 
}: DrawerContentProps) {
  const isGroupExpanded = (group: string) => expandedGroups.includes(group);

  return (
    <div className="p-3 space-y-4">
      {/* Workspace Section */}
      <NavGroup
        title="Workspace"
        expanded={isGroupExpanded('workspace')}
        onToggle={() => onGroupToggle('workspace')}
      >
        <NavItem
          icon={Home}
          label="Overview"
          active={activeView === 'overview'}
          onClick={() => onViewChange('overview')}
        />
        <NavItem
          icon={Inbox}
          label="Inbox"
          active={activeView === 'inbox'}
          badge={5}
          onClick={() => onViewChange('inbox')}
        />
        <NavItem
          icon={Calendar}
          label="Schedule"
          active={activeView === 'schedule'}
          onClick={() => onViewChange('schedule')}
        />
        <NavItem
          icon={MessageSquare}
          label="Chat"
          active={activeView === 'chat'}
          badge={3}
          onClick={() => onViewChange('chat')}
        />
      </NavGroup>

      {/* Boards Section */}
      <NavGroup
        title="Boards"
        expanded={isGroupExpanded('boards')}
        onToggle={() => onGroupToggle('boards')}
      >
        <NavItem
          icon={Briefcase}
          label="Sales"
          active={currentBoard === 'sales'}
          onClick={() => {
            onBoardChange('sales');
            onViewChange('home');
          }}
        />
        <NavItem
          icon={UsersIcon}
          label="Direction"
          active={currentBoard === 'direction'}
          onClick={() => {
            onBoardChange('direction');
            onViewChange('direction-home');
          }}
        />
        <NavItem
          icon={Video}
          label="Creator"
          active={currentBoard === 'creator'}
          onClick={() => {
            onBoardChange('creator');
            onViewChange('creator-home');
          }}
        />
        <NavItem
          icon={Pencil}
          label="Editor"
          active={currentBoard === 'editor'}
          onClick={() => {
            onBoardChange('editor');
            onViewChange('editor-home');
          }}
        />
        <NavItem
          icon={Building2}
          label="Corporate"
          active={currentBoard === 'support'}
          onClick={() => {
            onBoardChange('support');
            onViewChange('management-home');
          }}
        />
        <NavItem
          icon={UserCircle}
          label="Client Portal"
          active={currentBoard === 'client'}
          onClick={() => {
            onBoardChange('client');
            onViewChange('client-home');
          }}
        />
      </NavGroup>

      {/* Reports Section */}
      <NavGroup
        title="Reports"
        expanded={isGroupExpanded('reports')}
        onToggle={() => onGroupToggle('reports')}
      >
        <NavItem
          icon={FileText}
          label="Weekly"
          active={activeView === 'reports-weekly'}
          onClick={() => onViewChange('reports-weekly')}
        />
        <NavItem
          icon={BarChart3}
          label="Monthly"
          active={activeView === 'reports-monthly'}
          onClick={() => onViewChange('reports-monthly')}
        />
        <NavItem
          icon={PieChart}
          label="Quarterly"
          active={activeView === 'reports-quarterly'}
          onClick={() => onViewChange('reports-quarterly')}
        />
      </NavGroup>

      {/* System Section */}
      <NavGroup
        title="System"
        expanded={isGroupExpanded('system')}
        onToggle={() => onGroupToggle('system')}
      >
        <NavItem
          icon={Settings}
          label="Settings"
          active={activeView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
        <NavItem
          icon={LinkIcon}
          label="Integrations"
          active={activeView === 'integrations'}
          onClick={() => onViewChange('integrations')}
        />
        <NavItem
          icon={HelpCircle}
          label="Help"
          active={activeView === 'help'}
          onClick={() => onViewChange('help')}
        />
      </NavGroup>
    </div>
  );
}
