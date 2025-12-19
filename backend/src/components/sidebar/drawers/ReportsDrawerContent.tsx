import { FileText, Download, BarChart3, PieChart, TrendingUp, Clock, Calendar } from 'lucide-react';
import { DrawerSearch, MenuSectionTitle, MenuItem } from '../DrawerComponents';

interface ReportsDrawerContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function ReportsDrawerContent({ activeView, onViewChange }: ReportsDrawerContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="pt-3">
        <DrawerSearch placeholder="Search reports..." />
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Quick Actions */}
        <MenuSectionTitle title="Quick Actions" />
        <div className="space-y-1">
          <MenuItem
            icon={FileText}
            label="Generate Report"
            onClick={() => {/* TODO: Open report generator */}}
          />
          <MenuItem
            icon={Download}
            label="Export Data"
            onClick={() => {/* TODO: Open export dialog */}}
          />
        </div>

        {/* Report Types */}
        <MenuSectionTitle title="Report Types" />
        <div className="space-y-1">
          <MenuItem
            icon={BarChart3}
            label="Weekly Summary"
            onClick={() => onViewChange('reports-weekly')}
            isActive={activeView === 'reports-weekly'}
            hasArrow
          />
          <MenuItem
            icon={PieChart}
            label="Monthly Analytics"
            onClick={() => onViewChange('reports-monthly')}
            isActive={activeView === 'reports-monthly'}
            hasArrow
          />
          <MenuItem
            icon={TrendingUp}
            label="Performance Report"
            onClick={() => onViewChange('reports-performance')}
            isActive={activeView === 'reports-performance'}
            hasArrow
          />
          <MenuItem
            icon={FileText}
            label="Custom Report"
            onClick={() => onViewChange('reports-custom')}
            isActive={activeView === 'reports-custom'}
            hasArrow
          />
        </div>

        {/* Time Periods */}
        <MenuSectionTitle title="Time Periods" />
        <div className="space-y-1">
          <MenuItem
            icon={Clock}
            label="Last 7 Days"
            onClick={() => onViewChange('reports-7days')}
            isActive={activeView === 'reports-7days'}
          />
          <MenuItem
            icon={Calendar}
            label="Last 30 Days"
            onClick={() => onViewChange('reports-30days')}
            isActive={activeView === 'reports-30days'}
          />
          <MenuItem
            icon={Calendar}
            label="This Quarter"
            onClick={() => onViewChange('reports-quarter')}
            isActive={activeView === 'reports-quarter'}
          />
        </div>
      </div>
    </div>
  );
}