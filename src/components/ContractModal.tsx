import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { Contract } from '../utils/contractData';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Partial<Contract>) => void;
  contract?: Contract | null;
  clientId: string;
}

export function ContractModal({ isOpen, onClose, onSave, contract, clientId }: ContractModalProps) {
  const [formData, setFormData] = useState({
    clientId: clientId,
    status: 'negotiating' as Contract['status'],
    monthlyFee: 0,
    startDate: '',
    endDate: '',
    renewalDate: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // 編集モードの場合、既存データを設定
  useEffect(() => {
    if (contract) {
      setFormData({
        clientId: contract.clientId,
        status: contract.status,
        monthlyFee: contract.monthlyFee,
        startDate: contract.startDate?.split('T')[0] || '',
        endDate: contract.endDate?.split('T')[0] || '',
        renewalDate: contract.renewalDate?.split('T')[0] || '',
      });
    } else {
      setFormData({
        clientId: clientId,
        status: 'negotiating',
        monthlyFee: 0,
        startDate: '',
        endDate: '',
        renewalDate: '',
      });
    }
    setErrors({});
  }, [contract, clientId, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = 'ステータスは必須です';
    }
    
    if (formData.monthlyFee < 0) {
      newErrors.monthlyFee = '月額料金は0以上である必要があります';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '契約開始日は必須です';
    }
    
    if (formData.status === 'active' && !formData.renewalDate) {
      newErrors.renewalDate = 'アクティブ契約の場合、更新期限日は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const contractData: Partial<Contract> = {
        ...(contract ? { id: contract.id } : {}),
        clientId: formData.clientId,
        status: formData.status,
        monthlyFee: formData.monthlyFee,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        renewalDate: formData.renewalDate ? new Date(formData.renewalDate).toISOString() : undefined,
      };
      
      await onSave(contractData);
      onClose();
    } catch (error) {
      console.error('[ContractModal] Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl text-card-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
            {contract ? '契約を編集' : '新規契約を追加'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              ステータス <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Contract['status'] })}
              className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="negotiating">商談中</option>
              <option value="active">アクティブ</option>
              <option value="paused">一時停止</option>
              <option value="expired">期限切れ</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-destructive">{errors.status}</p>
            )}
          </div>

          {/* Monthly Fee */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              月額料金（円） <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                step="1000"
              />
            </div>
            {errors.monthlyFee && (
              <p className="mt-1 text-xs text-destructive">{errors.monthlyFee}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              契約開始日 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-xs text-destructive">{errors.startDate}</p>
            )}
          </div>

          {/* Renewal Date */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              更新期限日 {formData.status === 'active' && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.renewalDate && (
              <p className="mt-1 text-xs text-destructive">{errors.renewalDate}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              更新期限アラートに使用されます
            </p>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              契約終了日（オプション）
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-card-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : contract ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
