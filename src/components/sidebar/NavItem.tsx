import { LucideIcon, ChevronRight } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
  disabled?: boolean;
  indent?: boolean;
}

export function NavItem({ icon: Icon, label, active = false, badge, onClick, disabled = false, indent = false }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-11 flex items-center gap-3 px-4 rounded-lg transition-all duration-200 group ${
        indent ? 'pl-8' : ''
      } ${
        active
          ? 'bg-[#0C8A5F] text-white'
          : disabled
            ? 'text-[#4B5563] cursor-not-allowed'
            : 'text-[#9CA3AF] hover:bg-[#1F2933] hover:text-white'
      }`}
    >
      {/* Left Accent Bar */}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
      )}

      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
      <span className="text-sm flex-1 text-left truncate">{label}</span>

      {/* Badge */}
      {badge && badge > 0 && (
        <span
          className={`px-1.5 py-0.5 text-[10px] rounded-full flex-shrink-0 ${
            active ? 'bg-white/20 text-white' : 'bg-[#1F2933] text-[#9CA3AF]'
          }`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* Chevron for sub-items */}
      {!badge && (
        <ChevronRight
          className={`w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity ${
            active ? 'opacity-50' : ''
          }`}
          strokeWidth={2}
        />
      )}
    </button>
  );
}
