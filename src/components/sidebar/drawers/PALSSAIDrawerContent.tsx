import { Search, FileText, Lightbulb, FileOutput } from 'lucide-react';
import { MenuItem } from '../DrawerComponents';

interface PALSSAIDrawerContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function PALSSAIDrawerContent({ activeView, onViewChange }: PALSSAIDrawerContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-2 pt-3">
        <div className="space-y-1">
          <MenuItem
            icon={Search}
            label="企業リサーチ"
            onClick={() => onViewChange('ai-research')}
            isActive={activeView === 'ai-research'}
          />
          <MenuItem
            icon={FileText}
            label="提案ドラフト作成"
            onClick={() => onViewChange('ai-proposal')}
            isActive={activeView === 'ai-proposal'}
          />
          <MenuItem
            icon={Lightbulb}
            label="アイデア作成"
            onClick={() => onViewChange('ai-ideas')}
            isActive={activeView === 'ai-ideas'}
          />
          <MenuItem
            icon={FileOutput}
            label="資料作成"
            onClick={() => onViewChange('ai-document')}
            isActive={activeView === 'ai-document'}
          />
        </div>
      </div>
    </div>
  );
}