import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: {
    name: string;
    industry?: string;
    mainContactName?: string;
    mainContactEmail?: string;
  }) => void;
}

export function AddClientModal({ isOpen, onClose, onSave }: AddClientModalProps) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [mainContactName, setMainContactName] = useState('');
  const [mainContactEmail, setMainContactEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!name.trim()) {
      setError('クライアント名は必須です');
      return;
    }

    // 保存
    onSave({
      name: name.trim(),
      industry: industry.trim() || undefined,
      mainContactName: mainContactName.trim() || undefined,
      mainContactEmail: mainContactEmail.trim() || undefined
    });

    // リセット
    setName('');
    setIndustry('');
    setMainContactName('');
    setMainContactEmail('');
    setError('');
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setIndustry('');
    setMainContactName('');
    setMainContactEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-lg">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground">新規クライアント追加</h2>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* エラー表示 */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="size-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* クライアント名（必須） */}
          <div>
            <label htmlFor="name" className="block text-sm text-foreground mb-1">
              クライアント名 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="例: 株式会社サンプル"
              required
            />
          </div>

          {/* 業種（任意） */}
          <div>
            <label htmlFor="industry" className="block text-sm text-foreground mb-1">
              業種
            </label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="例: 美容・コスメ"
            />
          </div>

          {/* 担当者名（任意） */}
          <div>
            <label htmlFor="mainContactName" className="block text-sm text-foreground mb-1">
              担当者名
            </label>
            <input
              type="text"
              id="mainContactName"
              value={mainContactName}
              onChange={(e) => setMainContactName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="例: 田中 太郎"
            />
          </div>

          {/* メールアドレス（任意） */}
          <div>
            <label htmlFor="mainContactEmail" className="block text-sm text-foreground mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="mainContactEmail"
              value={mainContactEmail}
              onChange={(e) => setMainContactEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="例: tanaka@example.com"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-muted/50 text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
