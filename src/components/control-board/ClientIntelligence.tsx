import { Building2, TrendingUp, AlertTriangle, Star, DollarSign, Plus } from 'lucide-react';
import { useState } from 'react';
import { AddClientModal } from '../AddClientModal';
import { addClient } from '../../utils/clientData';

export function ClientIntelligence() {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  
  const handleAddClient = (client: {
    name: string;
    industry?: string;
    mainContactName?: string;
    mainContactEmail?: string;
  }) => {
    addClient(client);
    // モーダルは AddClientModal内で閉じられる
  };
  
  const clientStats = {
    total: 28,
    active: 24,
    newThisMonth: 3,
    churnRisk: 2,
    avgLTV: 2400000,
    avgNPS: 8.2,
  };

  const clients = [
    {
      name: 'クライアントA',
      status: 'active',
      ltv: 4500000,
      monthlyValue: 450000,
      contractEnd: '2025-06-30',
      nps: 9.2,
      projects: 12,
      riskLevel: 'low',
      satisfaction: 4.8,
    },
    {
      name: 'クライアントB',
      status: 'active',
      ltv: 3200000,
      monthlyValue: 320000,
      contractEnd: '2025-03-31',
      nps: 8.5,
      projects: 8,
      riskLevel: 'low',
      satisfaction: 4.6,
    },
    {
      name: 'クライアントC',
      status: 'active',
      ltv: 1800000,
      monthlyValue: 180000,
      contractEnd: '2025-01-15',
      nps: 6.5,
      projects: 5,
      riskLevel: 'high',
      satisfaction: 3.8,
    },
    {
      name: 'クライアントD',
      status: 'active',
      ltv: 2800000,
      monthlyValue: 280000,
      contractEnd: '2025-08-20',
      nps: 8.8,
      projects: 10,
      riskLevel: 'low',
      satisfaction: 4.7,
    },
    {
      name: 'クライアントE',
      status: 'new',
      ltv: 850000,
      monthlyValue: 85000,
      contractEnd: '2025-12-19',
      nps: 7.5,
      projects: 2,
      riskLevel: 'medium',
      satisfaction: 4.2,
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-500/10';
      case 'medium': return 'text-orange-600 bg-orange-500/10';
      case 'low': return 'text-green-600 bg-green-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return '高リスク';
      case 'medium': return '中リスク';
      case 'low': return '低リスク';
      default: return '-';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Client Intelligence</h1>
          <p className="text-sm text-muted-foreground">クライアント統括 - 契約状況・満足度・リスク管理</p>
        </div>
        <button
          onClick={() => setIsAddClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          <span>新規クライアント</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{clientStats.total}</div>
          <div className="text-sm text-muted-foreground">総クライアント</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-green-600">{clientStats.active}</div>
          <div className="text-sm text-muted-foreground">アクティブ</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-blue-600">+{clientStats.newThisMonth}</div>
          <div className="text-sm text-muted-foreground">今月新規</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-red-600">{clientStats.churnRisk}</div>
          <div className="text-sm text-muted-foreground">解約リスク</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-lg mb-1">¥{(clientStats.avgLTV/1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground">平均LTV</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{clientStats.avgNPS}</div>
          <div className="text-sm text-muted-foreground">平均NPS</div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">クライアント一覧</h2>
        <div className="space-y-4">
          {clients.map((client, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm mb-1">{client.name}</h3>
                    {client.status === 'new' && (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded">
                        新規
                      </span>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${getRiskColor(client.riskLevel)}`}>
                  {getRiskLabel(client.riskLevel)}
                </div>
              </div>

              <div className="grid md:grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">LTV</div>
                  <div>¥{(client.ltv/1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">月額</div>
                  <div>¥{(client.monthlyValue/1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">契約終了</div>
                  <div>{client.contractEnd}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">NPS</div>
                  <div className="flex items-center gap-1">
                    <span>{client.nps}</span>
                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">案件数</div>
                  <div>{client.projects}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">満足度</div>
                  <div className="flex items-center gap-1">
                    <span>{client.satisfaction}</span>
                    <span className="text-xs text-muted-foreground">/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* AddClientModal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSave={handleAddClient}
      />
    </div>
  );
}