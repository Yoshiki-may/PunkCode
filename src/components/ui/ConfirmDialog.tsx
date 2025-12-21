import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          icon: 'text-amber-600',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
        onClick={onCancel}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-[101] p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-10 h-10 rounded-full bg-${variant === 'danger' ? 'red' : variant === 'warning' ? 'amber' : 'blue'}-100 flex items-center justify-center flex-shrink-0`}>
            <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-card-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${styles.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
