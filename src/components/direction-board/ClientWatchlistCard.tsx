import { ChevronRight, AlertCircle, MessageSquarePlus, Clock, Pin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  status: 'approval-delay' | 'extra-requests' | 'recent-delay';
  statusLabel: string;
  issue: string;
  isPinned: boolean;
  initials: string;
}

interface ClientWatchlistCardProps {
  onNavigate?: (view: string) => void;
}

export function ClientWatchlistCard({ onNavigate }: ClientWatchlistCardProps) {
  const clients: Client[] = [
    {
      id: '1',
      name: 'AXAS株式会社',
      status: 'approval-delay',
      statusLabel: '承認滞留',
      issue: '5日間未承認',
      isPinned: true,
      initials: 'AX',
    },
    {
      id: '2',
      name: 'BAYMAX株式会社',
      status: 'extra-requests',
      statusLabel: '追加要望増',
      issue: '今週3件追加',
      isPinned: true,
      initials: 'BM',
    },
    {
      id: '3',
      name: 'デジタルフロンティア',
      status: 'recent-delay',
      statusLabel: '直近遅延',
      issue: '前回2日遅延',
      isPinned: false,
      initials: 'DF',
    },
    {
      id: '4',
      name: 'グローバルソリューションズ',
      status: 'approval-delay',
      statusLabel: '承認滞留',
      issue: '3日間未承認',
      isPinned: false,
      initials: 'GS',
    },
    {
      id: '5',
      name: 'クリエイティブワークス',
      status: 'extra-requests',
      statusLabel: '追加要望増',
      issue: '今週2件追加',
      isPinned: false,
      initials: 'CW',
    },
  ];

  // ピン留めクライアントを上に
  const sortedClients = [...clients].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  }).slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approval-delay':
        return <Clock className="w-3 h-3" strokeWidth={2} />;
      case 'extra-requests':
        return <MessageSquarePlus className="w-3 h-3" strokeWidth={2} />;
      case 'recent-delay':
        return <AlertCircle className="w-3 h-3" strokeWidth={2} />;
      default:
        return <AlertCircle className="w-3 h-3" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approval-delay':
        return 'bg-amber-500/10 text-amber-600';
      case 'extra-requests':
        return 'bg-blue-500/10 text-blue-600';
      case 'recent-delay':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-card-foreground">Client Watchlist</h3>
        <span className="text-xs text-muted-foreground">要注意クライアント</span>
      </div>

      {/* Primary Metric */}
      <div className="mb-4">
        <div className="text-3xl text-card-foreground mb-1">{clients.length}</div>
        <div className="text-xs text-muted-foreground">件の要注意案件</div>
      </div>

      {/* Client List */}
      <div className="space-y-2 mb-4">
        {sortedClients.map((client) => (
          <div
            key={client.id}
            className="p-3 rounded-xl hover:bg-accent/50 transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('clients-all');
            }}
          >
            <div className="flex items-start justify-between mb-2">
              {/* Client Name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">
                  {client.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-card-foreground">{client.name}</span>
                    {client.isPinned && (
                      <Pin className="w-3 h-3 text-primary fill-primary" strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{client.issue}</div>
                </div>
              </div>
              
              {/* Status Badge */}
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs flex-shrink-0 ${getStatusColor(client.status)}`}>
                {getStatusIcon(client.status)}
                {client.statusLabel}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors group/btn"
        onClick={() => onNavigate?.('clients-all')}
      >
        <span>クライアント一覧</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}