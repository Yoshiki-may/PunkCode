import { useState } from 'react';
import { 
  Plus, 
  X, 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram,
  AlertCircle
} from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: NewClientData) => void;
}

export interface NewClientData {
  name: string;
  instagramHandle: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  contractStatus: 'active' | 'pending' | 'paused';
  monthlyFee: number;
}

export function AddClientModal({ isOpen, onClose, onAddClient }: AddClientModalProps) {
  const [newClient, setNewClient] = useState<NewClientData>({
    name: '',
    instagramHandle: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    contractStatus: 'pending',
    monthlyFee: 0,
  });

  const handleSubmit = () => {
    if (!newClient.name || !newClient.contactPerson || !newClient.email) {
      return; // Validation
    }

    onAddClient(newClient);

    // Reset form
    setNewClient({
      name: '',
      instagramHandle: '',
      industry: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      contractStatus: 'pending',
      monthlyFee: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg">新規クライアント追加</h3>
          </div>
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors" 
            onClick={onClose}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-sm mb-2">
              クライアント名
              <span className="text-destructive ml-1">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="株式会社サンプル"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Instagram Handle */}
            <div>
              <label className="block text-sm mb-2">Instagramアカウント</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={newClient.instagramHandle}
                  onChange={(e) => setNewClient({ ...newClient, instagramHandle: e.target.value })}
                  placeholder="@username"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm mb-2">業種</label>
              <input
                type="text"
                value={newClient.industry}
                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                placeholder="Beauty & Cosmetics"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm mb-2">
              担当者名
              <span className="text-destructive ml-1">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={newClient.contactPerson}
                onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                placeholder="山田 太郎"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2">
                メールアドレス
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="example@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-2">電話番号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="03-1234-5678"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm mb-2">所在地</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={newClient.location}
                onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                placeholder="東京都渋谷区"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Contract Status */}
            <div>
              <label className="block text-sm mb-2">契約ステータス</label>
              <select
                value={newClient.contractStatus}
                onChange={(e) => setNewClient({ ...newClient, contractStatus: e.target.value as 'active' | 'pending' | 'paused' })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="pending">保留中</option>
                <option value="active">契約中</option>
                <option value="paused">一時停止</option>
              </select>
            </div>

            {/* Monthly Fee */}
            <div>
              <label className="block text-sm mb-2">月額契約金額</label>
              <input
                type="number"
                value={newClient.monthlyFee || ''}
                onChange={(e) => setNewClient({ ...newClient, monthlyFee: parseInt(e.target.value) || 0 })}
                placeholder="280000"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-card z-10">
          <button
            className="px-4 py-2.5 rounded-lg text-foreground hover:bg-muted transition-all"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            onClick={handleSubmit}
            disabled={!newClient.name || !newClient.contactPerson || !newClient.email}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
