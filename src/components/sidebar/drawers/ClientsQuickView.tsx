import { Users, Search, Plus, ChevronDown, ChevronUp, BarChart3, User, Clock, X, Building2, Mail } from 'lucide-react';
import { useState } from 'react';
import { AddClientModal, NewClientData } from '../../AddClientModal';
import { getAllClients, ClientData } from '../../../utils/clientData';

interface Client {
  id: string;
  companyName: string;
  assignee: string;
  lastUpdate?: string;
  nextAction?: string;
  deadline?: string;
  status: 'negotiating' | 'contracted';
  owner: 'mine' | 'team';
  priority?: 'high' | 'medium' | 'low';
}

interface ClientsQuickViewProps {
  onClientSelect: (clientId: string) => void;
  selectedClient: string | null;
  onShowAll: () => void;
  currentView: string;
  onViewChange?: (view: string) => void;
}

export function ClientsQuickView({ 
  onClientSelect, 
  selectedClient, 
  onShowAll,
  currentView,
  onViewChange
}: ClientsQuickViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'mine' | 'team'>('mine');
  const [statusFilter, setStatusFilter] = useState<'all' | 'negotiating' | 'contracted'>('all');
  const [negotiatingExpanded, setNegotiatingExpanded] = useState(true);
  const [contractedExpanded, setContractedExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 共通クライアントデータから取得
  const allClientsData = getAllClients();
  
  // クライアントデータを変換（共通データの contractStatus を使用）
  const [clientsList, setClientsList] = useState<Client[]>(
    allClientsData.map((client, index) => ({
      id: client.id,
      companyName: client.name,
      assignee: client.contactPerson,
      lastUpdate: client.contractStatus === 'active' ? '2時間前' : undefined,
      nextAction: client.contractStatus === 'negotiating' ? 'フォローアップ' : undefined,
      deadline: client.contractStatus === 'negotiating' ? '12/25' : undefined,
      // 共通データの contractStatus を使用（active を contracted に変換）
      status: (client.contractStatus === 'active' ? 'contracted' : client.contractStatus === 'negotiating' ? 'negotiating' : 'contracted') as 'negotiating' | 'contracted',
      owner: (index < 4 ? 'mine' : 'team') as 'mine' | 'team',
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : index === 2 ? 'low' : undefined,
    }))
  );

  // Filter clients
  const filteredClients = clientsList
    .filter(c => c.owner === scope)
    .filter(c => {
      if (statusFilter === 'all') return true;
      return c.status === statusFilter;
    })
    .filter(c => {
      if (!searchQuery) return true;
      return (
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Group by status
  const negotiatingClients = filteredClients.filter(c => c.status === 'negotiating');
  const contractedClients = filteredClients.filter(c => c.status === 'contracted');

  // Counts for all clients in scope
  const allNegotiatingCount = clientsList.filter(c => c.owner === scope && c.status === 'negotiating').length;
  const allContractedCount = clientsList.filter(c => c.owner === scope && c.status === 'contracted').length;

  const handleAddClient = (newClientData: NewClientData) => {
    if (!newClientData.name || !newClientData.contactPerson || !newClientData.email) {
      return; // Validation
    }

    const newId = (clientsList.length + 1).toString();
    
    // Map contract status to negotiating/contracted
    const status = newClientData.contractStatus === 'active' ? 'contracted' : 'negotiating';

    setClientsList([
      ...clientsList,
      {
        id: newId,
        companyName: newClientData.name,
        assignee: newClientData.contactPerson,
        status: status,
        owner: scope, // Use current scope
        lastUpdate: 'たった今',
      },
    ]);

    setShowAddModal(false);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-chart-4';
      case 'low':
        return 'bg-chart-2';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Client List Header Button */}
      <div className="px-2 pt-3">
        <button
          onClick={onShowAll}
          className={`w-full h-[35px] px-4 rounded-lg flex items-center gap-3 transition-all relative group ${
            currentView === 'clients-all'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
          }`}
        >
          {/* Left Accent Bar for Active Item */}
          {currentView === 'clients-all' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-r-full" />
          )}
          
          <Users className="w-4 h-4 shrink-0" strokeWidth={currentView === 'clients-all' ? 2.5 : 2} />
          <span className={`text-[14px] flex-1 text-left ${currentView === 'clients-all' ? 'font-medium' : 'font-normal'}`}>クライアント一覧</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-3 mb-2 border-t border-sidebar-border opacity-50" />

      {/* Search + Add Button */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="クライアント名 / 担当"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-xs" onClick={() => setShowAddModal(true)}>
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Scope Segmented Control */}
      <div className="px-3 pt-3">
        <div className="flex bg-secondary rounded-lg p-1">
          <button
            onClick={() => setScope('mine')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
              scope === 'mine'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            MINE
          </button>
          <button
            onClick={() => setScope('team')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
              scope === 'team'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            TEAM
          </button>
        </div>
      </div>

      {/* Status Chips */}
      <div className="px-3 pt-3">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => setStatusFilter('negotiating')}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
              statusFilter === 'negotiating'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            商談中
            <span className="ml-1 opacity-70">({allNegotiatingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('contracted')}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
              statusFilter === 'contracted'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            契約済
            <span className="ml-1 opacity-70">({allContractedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
              statusFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            All
            <span className="ml-1 opacity-70">({allNegotiatingCount + allContractedCount})</span>
          </button>
        </div>
      </div>

      {/* Client Lists */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-3">
        {/* Negotiating Section */}
        {(statusFilter === 'all' || statusFilter === 'negotiating') && negotiatingClients.length > 0 && (
          <div>
            <button
              onClick={() => setNegotiatingExpanded(!negotiatingExpanded)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider"
            >
              {negotiatingExpanded ? (
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              ) : (
                <ChevronUp className="w-3 h-3" strokeWidth={2} />
              )}
              <span>商談中 ({negotiatingClients.length})</span>
            </button>

            {negotiatingExpanded && (
              <div className="mt-1 space-y-1">
                {negotiatingClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onClientSelect(client.id)}
                    className={`w-full px-3 py-2.5 rounded-lg transition-all text-left ${
                      currentView === 'client-detail' && selectedClient === client.id
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-secondary hover:bg-accent border border-transparent'
                    }`}
                  >
                    {/* Line 1: Company Name + Priority */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-[10px] flex-shrink-0">
                          {client.companyName.charAt(0)}
                        </div>
                        <span className="text-[11px] text-foreground truncate">{client.companyName}</span>
                      </div>
                      {client.priority && (
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityColor(client.priority)}`} />
                      )}
                    </div>

                    {/* Line 2: Assignee + Deadline */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-2.5 h-2.5" strokeWidth={2} />
                        <span>{client.assignee}</span>
                      </div>
                      {client.deadline && (
                        <div className="flex items-center gap-1 text-chart-4">
                          <Clock className="w-2.5 h-2.5" strokeWidth={2} />
                          <span>{client.deadline}</span>
                        </div>
                      )}
                      {client.lastUpdate && !client.deadline && (
                        <span className="text-muted-foreground">{client.lastUpdate}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contracted Section */}
        {(statusFilter === 'all' || statusFilter === 'contracted') && contractedClients.length > 0 && (
          <div>
            <button
              onClick={() => setContractedExpanded(!contractedExpanded)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider"
            >
              {contractedExpanded ? (
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              ) : (
                <ChevronUp className="w-3 h-3" strokeWidth={2} />
              )}
              <span>契約中 ({contractedClients.length})</span>
            </button>

            {contractedExpanded && (
              <div className="mt-1 space-y-1">
                {contractedClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onClientSelect(client.id)}
                    className={`w-full px-3 py-2.5 rounded-lg transition-all text-left ${
                      currentView === 'client-detail' && selectedClient === client.id
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-secondary hover:bg-accent border border-transparent'
                    }`}
                  >
                    {/* Line 1: Company Name */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-[10px] flex-shrink-0">
                        {client.companyName.charAt(0)}
                      </div>
                      <span className="text-[11px] text-foreground truncate flex-1">{client.companyName}</span>
                    </div>

                    {/* Line 2: Assignee + Last Update */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-2.5 h-2.5" strokeWidth={2} />
                        <span>{client.assignee}</span>
                      </div>
                      {client.lastUpdate && (
                        <span className="text-muted-foreground">更新 {client.lastUpdate}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {negotiatingClients.length === 0 && contractedClients.length === 0 && (
          <div className="px-3 py-8 text-center text-muted-foreground text-xs">
            {searchQuery ? '該当するクライアントがありません' : 'クライアントがありません'}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
}