import { Search, Users, AlertCircle, Loader2 } from 'lucide-react';

interface EmptyStateProps {
  type: 'empty' | 'search' | 'permission' | 'loading' | 'error';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          title: '該当なし',
          description: message || '検索条件に一致するクライアントが見つかりませんでした',
        };
      case 'empty':
        return {
          icon: Users,
          title: 'クライアントがありません',
          description: message || '新規クライアントを追加してください',
        };
      case 'permission':
        return {
          icon: AlertCircle,
          title: 'アクセス権限がありません',
          description: message || 'このセクションを表示する権限がありません',
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: 'エラーが発生しました',
          description: message || 'データの取得に失敗しました。再度お試しください',
        };
      case 'loading':
        return {
          icon: Loader2,
          title: '読み込み中...',
          description: message || 'データを取得しています',
        };
      default:
        return {
          icon: Users,
          title: 'データがありません',
          description: message || '',
        };
    }
  };

  const { icon: Icon, title, description } = getContent();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className={`w-12 h-12 rounded-full bg-[#1F2933] flex items-center justify-center mb-3 ${
        type === 'loading' ? 'animate-spin' : ''
      }`}>
        <Icon className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
      </div>
      <h3 className="text-sm text-white mb-1">{title}</h3>
      <p className="text-xs text-[#7B8794] max-w-[200px]">{description}</p>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="px-3 space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-[#1F2933] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#323F4B] rounded-md" />
            <div className="h-3 bg-[#323F4B] rounded flex-1" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2 bg-[#323F4B] rounded w-20" />
            <div className="h-2 bg-[#323F4B] rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
