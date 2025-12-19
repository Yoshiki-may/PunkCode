import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface NavGroupProps {
  title: string;
  icon?: LucideIcon;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  badge?: number;
}

export function NavGroup({ title, icon: Icon, expanded, onToggle, children, badge }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {/* Group Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2 text-[#7B8794] hover:text-[#9CA3AF] transition-colors group"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
        ) : (
          <ChevronRight className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
        )}
        
        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />}
        
        <span className="text-xs uppercase tracking-wider flex-1 text-left">{title}</span>

        {badge && badge > 0 && (
          <span className="px-1.5 py-0.5 bg-[#1F2933] text-[#9CA3AF] text-[10px] rounded-full flex-shrink-0">
            {badge}
          </span>
        )}
      </button>

      {/* Group Content */}
      {expanded && (
        <div className="space-y-1 py-1">
          {children}
        </div>
      )}
    </div>
  );
}
