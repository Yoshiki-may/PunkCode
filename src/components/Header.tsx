import { Bell } from 'lucide-react';

interface HeaderProps {
  currentBoard: string;
  onBoardChange: (board: string) => void;
  theme?: 'light' | 'dark' | 'feminine' | 'palss';
}

export function Header({ currentBoard, onBoardChange, theme = 'dark' }: HeaderProps) {
  const boards = [
    { id: 'sales', label: 'Sales' },
    { id: 'direction', label: 'Direction' },
    { id: 'editor', label: 'Editor' },
    { id: 'creator', label: 'Creator' },
    { id: 'support', label: 'Control' },
    { id: 'client', label: 'Client' },
    { id: 'palss-chat', label: 'PALSS CHAT' },
  ];

  return (
    <header className="bg-sidebar border-b border-sidebar-border h-16 flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo - positioned at the far left */}
        <div className="flex items-center flex-shrink-0">
          <h1 
            className="tracking-tight transition-colors text-xl font-bold"
            style={theme === 'palss' ? { color: '#124E37' } : {}}
          >
            PALSS SYSTEM
          </h1>
        </div>

        {/* Board Navigation - centered */}
        <nav className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                currentBoard === board.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {board.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification Bell with Badge */}
          <button className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Bell className="w-5 h-5 text-sidebar-foreground/70" strokeWidth={2} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* User Avatar */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: theme === 'palss' ? '#124E37' : '#374151' }}
            >
              TT
            </div>
            <span className="text-sm text-sidebar-foreground">Tanaka Taro</span>
          </button>
        </div>
      </div>
    </header>
  );
}