import { Search, Plus, Building2, User, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { EmptyState, SkeletonLoader } from './EmptyStates';

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

interface ClientsSectionProps {
  onClientSelect: (clientId: string) => void;
  selectedClient: string | null;
  loading?: boolean;
  error?: string | null;
}

export function ClientsSection({ onClientSelect, selectedClient, loading, error }: ClientsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'mine' | 'team'>('mine');
  const [statusFilter, setStatusFilter] = useState<'all' | 'negotiating' | 'contracted'>('all');
  const [negotiatingExpanded, setNegotiatingExpanded] = useState(true);
  const [contractedExpanded, setContractedExpanded] = useState(true);

  // Mock client data
  const clients: Client[] = [
    {
      id: '1',
      companyName: 'AXAS株式会社',
      assignee: '田中太郎',
      nextAction: '提案資料提出',
      deadline: '12/14',
      status: 'negotiating',
      owner: 'mine',
      priority: 'high',
    },
    {
      id: '2',
      companyName: 'BAYMAX株式会社',
      assignee: '佐藤花子',
      nextAction: 'フォローアップ',
      deadline: '12/15',
      status: 'negotiating',
      owner: 'mine',
      priority: 'medium',
    },
    {
      id: '3',
      companyName: 'クリエイティブワークス',
      assignee: '鈴木一郎',
      lastUpdate: '3時間前',
      status: 'negotiating',
      owner: 'mine',
      priority: 'low',
    },
    {
      id: '4',
      companyName: 'エンタープライズ株式会社',
      assignee: '田中太郎',
      lastUpdate: '2時間前',
      status: 'contracted',
      owner: 'mine',
    },
    {
      id: '5',
      companyName: 'フューチャーデザイン',
      assignee: '佐藤花子',
      lastUpdate: '5時間前',
      status: 'contracted',
      owner: 'mine',
    },
    {
      id: '6',
      companyName: 'デジタルフロンティア',
      assignee: '高橋美咲',
      nextAction: 'ヒアリング',
      deadline: '12/16',
      status: 'negotiating',
      owner: 'team',
    },
    {
      id: '7',
      companyName: 'スマートビジネス',
      assignee: '伊藤健太',
      lastUpdate: '1日前',
      status: 'contracted',
      owner: 'team',
    },
  ];

  // Filter clients
  const filteredClients = clients
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
  const allNegotiatingCount = clients.filter(c => c.owner === scope && c.status === 'negotiating').length;
  const allContractedCount = clients.filter(c => c.owner === scope && c.status === 'contracted').length;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#DC2626]';
      case 'medium':
        return 'bg-[#D97706]';
      case 'low':
        return 'bg-[#2563EB]';
      default:
        return 'bg-[#4B5563]';
    }
  };

  return (
    <div className="p-3 space-y-3">
      {/* Search Bar + Add Button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" strokeWidth={2} />
          <input
            type="text"
            placeholder="クライアント名 / 担当 / #タグ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1F2933] border border-[#323F4B] rounded-lg text-[#F9FAFB] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent text-xs transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-2.5 py-2 bg-[#1F2933] border border-[#323F4B] text-[#9CA3AF] rounded-lg hover:bg-[#323F4B] hover:text-white hover:border-[#0C8A5F] transition-all text-xs">
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>新規</span>
        </button>
      </div>

      {/* Scope Segmented Control */}
      <div className="flex bg-[#1F2933] rounded-lg p-0.5">
        <button
          onClick={() => setScope('mine')}
          className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
            scope === 'mine'
              ? 'bg-[#0C8A5F] text-white'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Mine
        </button>
        <button
          onClick={() => setScope('team')}
          className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-all ${
            scope === 'team'
              ? 'bg-[#0C8A5F] text-white'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Team
        </button>
      </div>

      {/* Status Chips */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
            statusFilter === 'all'
              ? 'bg-[#0C8A5F] text-white'
              : 'bg-[#1F2933] text-[#9CA3AF] hover:text-white'
          }`}
        >
          All
          <span className="ml-1 opacity-70">({allNegotiatingCount + allContractedCount})</span>
        </button>
        <button
          onClick={() => setStatusFilter('negotiating')}
          className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
            statusFilter === 'negotiating'
              ? 'bg-[#0C8A5F] text-white'
              : 'bg-[#1F2933] text-[#9CA3AF] hover:text-white'
          }`}
        >
          商談
          <span className="ml-1 opacity-70">({allNegotiatingCount})</span>
        </button>
        <button
          onClick={() => setStatusFilter('contracted')}
          className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
            statusFilter === 'contracted'
              ? 'bg-[#0C8A5F] text-white'
              : 'bg-[#1F2933] text-[#9CA3AF] hover:text-white'
          }`}
        >
          契約
          <span className="ml-1 opacity-70">({allContractedCount})</span>
        </button>
      </div>

      {/* Client Lists */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {/* Loading State */}
        {loading && <SkeletonLoader />}

        {/* Error State */}
        {error && !loading && (
          <EmptyState type="error" message={error} />
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Negotiating Section */}
            {(statusFilter === 'all' || statusFilter === 'negotiating') && negotiatingClients.length > 0 && (
              <div>
                <button
                  onClick={() => setNegotiatingExpanded(!negotiatingExpanded)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] text-[#7B8794] hover:text-[#9CA3AF] transition-all uppercase tracking-wider"
                >
                  {negotiatingExpanded ? (
                    <ChevronDown className="w-3 h-3" strokeWidth={2} />
                  ) : (
                    <ChevronRight className="w-3 h-3" strokeWidth={2} />
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
                          selectedClient === client.id
                            ? 'bg-[#0C8A5F]/20 border border-[#0C8A5F]'
                            : 'bg-[#1F2933] hover:bg-[#323F4B] border border-transparent'
                        }`}
                      >
                        {/* Line 1: Company Name + Priority */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0C8A5F] to-[#059669] flex items-center justify-center text-white text-[10px] flex-shrink-0">
                              {client.companyName.charAt(0)}
                            </div>
                            <span className="text-[11px] text-white truncate">{client.companyName}</span>
                          </div>
                          {client.priority && (
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityColor(client.priority)}`} />
                          )}
                        </div>

                        {/* Line 2: Assignee + Deadline */}
                        <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                          <div className="flex items-center gap-1">
                            <User className="w-2.5 h-2.5" strokeWidth={2} />
                            <span>{client.assignee}</span>
                          </div>
                          {client.deadline && (
                            <div className="flex items-center gap-1 text-[#D97706]">
                              <Clock className="w-2.5 h-2.5" strokeWidth={2} />
                              <span>{client.deadline}</span>
                            </div>
                          )}
                          {client.lastUpdate && !client.deadline && (
                            <span className="text-[#7B8794]">{client.lastUpdate}</span>
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
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-[10px] text-[#7B8794] hover:text-[#9CA3AF] transition-all uppercase tracking-wider"
                >
                  {contractedExpanded ? (
                    <ChevronDown className="w-3 h-3" strokeWidth={2} />
                  ) : (
                    <ChevronRight className="w-3 h-3" strokeWidth={2} />
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
                          selectedClient === client.id
                            ? 'bg-[#0C8A5F]/20 border border-[#0C8A5F]'
                            : 'bg-[#1F2933] hover:bg-[#323F4B] border border-transparent'
                        }`}
                      >
                        {/* Line 1: Company Name */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0C8A5F] to-[#059669] flex items-center justify-center text-white text-[10px] flex-shrink-0">
                            {client.companyName.charAt(0)}
                          </div>
                          <span className="text-[11px] text-white truncate flex-1">{client.companyName}</span>
                        </div>

                        {/* Line 2: Assignee + Last Update */}
                        <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                          <div className="flex items-center gap-1">
                            <User className="w-2.5 h-2.5" strokeWidth={2} />
                            <span>{client.assignee}</span>
                          </div>
                          {client.lastUpdate && (
                            <span className="text-[#7B8794]">更新 {client.lastUpdate}</span>
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
              <div className="px-3 py-8 text-center text-[#7B8794] text-xs">
                {searchQuery ? '該当するクライアントがありません' : 'クライアントがありません'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}