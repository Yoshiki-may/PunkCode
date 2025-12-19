import { X, Search } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ExpandableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'dock' | 'overlay';
  width?: 280 | 320;
  children: ReactNode;
  title?: string;
}

export function ExpandableDrawer({ isOpen, onClose, mode, width = 280, children, title = 'Navigation' }: ExpandableDrawerProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Background (only in overlay mode) */}
      {mode === 'overlay' && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-16 left-16 h-[calc(100vh-4rem)] bg-[#111827] border-r border-[#1F2933] shadow-2xl overflow-hidden transition-all duration-300 ${
          mode === 'overlay' ? 'z-50' : 'z-30'
        }`}
        style={{ width: `${width}px` }}
      >
        {/* Drawer Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#1F2933]">
          <h2 className="text-sm text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#1F2933] hover:text-white transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}