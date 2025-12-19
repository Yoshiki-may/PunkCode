import { LucideIcon, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

// Menu Section Title
interface MenuSectionTitleProps {
  title: string;
}

export function MenuSectionTitle({ title }: MenuSectionTitleProps) {
  return (
    <div className="px-4 pt-6 pb-2">
      <p className="text-muted-foreground text-[14px] font-normal">{title}</p>
    </div>
  );
}

// Menu Item
interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  badge?: number | string;
  hasArrow?: boolean;
}

export function MenuItem({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false, 
  badge,
  hasArrow = false 
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[35px] px-4 rounded-lg flex items-center gap-3 transition-all relative group ${
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
      }`}
    >
      {/* Left Accent Bar for Active Item */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-r-full" />
      )}
      
      <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      <span className={`text-[14px] flex-1 text-left ${isActive ? 'font-medium' : 'font-normal'}`}>{label}</span>
      
      {badge && (
        <span className="text-[12px] text-muted-foreground shrink-0">{badge}</span>
      )}
      
      {hasArrow && (
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2} />
      )}
    </button>
  );
}

// Search Input
interface DrawerSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function DrawerSearch({ 
  placeholder = "Search...", 
  value = "", 
  onChange 
}: DrawerSearchProps) {
  return (
    <div className="px-4 mb-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[35px] bg-sidebar-accent border border-sidebar-border rounded-lg px-3 text-[14px] text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sidebar-primary"
        />
      </div>
    </div>
  );
}

// Drawer Title
interface DrawerTitleProps {
  title: string;
  action?: ReactNode;
}

export function DrawerTitle({ title, action }: DrawerTitleProps) {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-sidebar-border">
      <h2 className="text-[18px] font-semibold text-sidebar-foreground">{title}</h2>
      {action}
    </div>
  );
}

// Client Item (for Clients drawer)
interface ClientItemProps {
  name: string;
  avatar?: string;
  status?: 'active' | 'pending' | 'inactive';
  onClick?: () => void;
  isActive?: boolean;
}

export function ClientItem({ 
  name, 
  avatar, 
  status = 'active', 
  onClick, 
  isActive = false 
}: ClientItemProps) {
  const statusColors = {
    active: '#0C8A5F',
    pending: '#F59E0B',
    inactive: '#7B8794'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full h-[40px] px-4 rounded-lg flex items-center gap-3 transition-all ${
        isActive
          ? 'bg-sidebar-primary/20'
          : 'hover:bg-sidebar-accent'
      }`}
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-[12px] font-semibold shrink-0 relative">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.slice(0, 2).toUpperCase()
        )}
        {/* Status dot */}
        <div 
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-sidebar"
          style={{ backgroundColor: statusColors[status] }}
        />
      </div>
      
      <span className="text-[14px] text-sidebar-foreground font-normal flex-1 text-left truncate">
        {name}
      </span>
      
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2} />
    </button>
  );
}

// Divider
export function MenuDivider() {
  return <div className="mx-4 my-2 border-t border-sidebar-border" />;
}