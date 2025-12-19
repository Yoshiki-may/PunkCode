import { CheckSquare, Clock, AlertCircle, DollarSign, FileText } from 'lucide-react';

export function ApprovalCenter() {
  const pendingApprovals = [
    {
      id: 1,
      type: '大型案件承認',
      title: 'クライアントF - 年間SNS運用契約',
      value: 12000000,
      requestedBy: '営業 田中',
      requestedAt: '2024-12-19 14:30',
      priority: 'high',
      details: '年間契約、月額100万円×12ヶ月',
      board: 'Sales',
    },
    {
      id: 2,
      type: '予算超過承認',
      title: 'クライアントE - 追加撮影',
      value: 350000,
      requestedBy: 'ディレクター佐藤',
      requestedAt: '2024-12-19 10:15',
      priority: 'high',
      details: '当初予算80万円に対し、35万円の追加費用発生',
      board: 'Direction',
    },
    {
      id: 3,
      type: '新規契約承認',
      title: 'クライアントG - Instagram運用開始',
      value: 680000,
      requestedBy: '営業 高橋',
      requestedAt: '2024-12-18 16:45',
      priority: 'medium',
      details: '月額68万円、3ヶ月契約',
      board: 'Sales',
    },
    {
      id: 4,
      type: '緊急対応承認',
      title: 'クライアントC - 納期前倒し対応',
      value: 0,
      requestedBy: 'ディレクター田中',
      requestedAt: '2024-12-19 09:00',
      priority: 'critical',
      details: '納期を1週間前倒し。Editor/Creator のリソース調整必要',
      board: 'Direction',
    },
    {
      id: 5,
      type: '契約更新承認',
      title: 'クライアントD - 契約延長',
      value: 2800000,
      requestedBy: '営業 佐藤',
      requestedAt: '2024-12-18 13:20',
      priority: 'medium',
      details: '6ヶ月延長、月額46.6万円',
      board: 'Sales',
    },
  ];

  const approvalHistory = [
    {
      id: 1,
      type: '大型案件承認',
      title: 'クライアントH - 年間契約',
      value: 15000000,
      approvedBy: '役員 山田',
      approvedAt: '2024-12-18 11:30',
      status: 'approved',
    },
    {
      id: 2,
      type: '予算超過承認',
      title: 'クライアントI - 追加制作',
      value: 450000,
      approvedBy: '役員 佐藤',
      approvedAt: '2024-12-17 15:20',
      status: 'approved',
    },
    {
      id: 3,
      type: '新規契約承認',
      title: 'クライアントJ - 動画制作',
      value: 850000,
      approvedBy: '役員 田中',
      approvedAt: '2024-12-16 10:00',
      status: 'rejected',
      reason: '予算規模が小さすぎる',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'high': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      default: return '低';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-2">Approval Center</h1>
        <p className="text-sm text-muted-foreground">承認センター - 重要案件の承認管理</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-orange-600">{pendingApprovals.length}</div>
          <div className="text-sm text-muted-foreground">承認待ち</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-red-600">
            {pendingApprovals.filter(a => a.priority === 'critical').length}
          </div>
          <div className="text-sm text-muted-foreground">緊急</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-lg mb-1">
            ¥{(pendingApprovals.reduce((sum, a) => sum + a.value, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-muted-foreground">承認待ち総額</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{approvalHistory.filter(a => a.status === 'approved').length}</div>
          <div className="text-sm text-muted-foreground">今月承認数</div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg">承認待ち</h2>
        </div>
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 border rounded-full text-xs ${getPriorityColor(approval.priority)}`}>
                      {getPriorityLabel(approval.priority)}
                    </span>
                    <span className="px-2 py-1 bg-muted text-xs rounded">{approval.type}</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{approval.board}</span>
                  </div>
                  <h3 className="text-sm mb-2">{approval.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{approval.details}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>依頼者: {approval.requestedBy}</span>
                    <span>•</span>
                    <span>{approval.requestedAt}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  {approval.value > 0 && (
                    <>
                      <div className="text-lg mb-1">¥{approval.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">案件額</div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                  承認
                </button>
                <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                  却下
                </button>
                <button className="px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm">
                  詳細
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg">承認履歴</h2>
        </div>
        <div className="space-y-3">
          {approvalHistory.map((history) => (
            <div key={history.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      history.status === 'approved' 
                        ? 'bg-green-500/10 text-green-700' 
                        : 'bg-red-500/10 text-red-700'
                    }`}>
                      {history.status === 'approved' ? '承認済み' : '却下'}
                    </span>
                    <span className="px-2 py-1 bg-muted text-xs rounded">{history.type}</span>
                  </div>
                  <h3 className="text-sm mb-1">{history.title}</h3>
                  <div className="text-xs text-muted-foreground">
                    {history.approvedBy} • {history.approvedAt}
                  </div>
                  {history.reason && (
                    <div className="mt-2 text-xs text-red-600">理由: {history.reason}</div>
                  )}
                </div>
                {history.value > 0 && (
                  <div className="text-sm">¥{history.value.toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
