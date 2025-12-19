import { AlertTriangle, Calendar, DollarSign, Users, TrendingDown } from 'lucide-react';

export function RiskManagement() {
  const risks = [
    {
      id: 1,
      level: 'critical',
      category: '納期リスク',
      title: 'クライアントE - ブランドムービー納期遅延',
      impact: 'high',
      probability: 'high',
      description: '納期まで3日だが、進捗40%。Editor/Creatorのリソース不足',
      affectedBoard: 'Direction',
      mitigation: 'Editor 2名を緊急アサイン、納期延長交渉',
      dueDate: '2024-12-22',
    },
    {
      id: 2,
      level: 'high',
      category: '収益リスク',
      title: 'クライアントF案件 - 予算超過',
      impact: 'medium',
      probability: 'high',
      description: '予算80万円に対し、現在95万円消費。最終的に110万円見込み',
      affectedBoard: 'Direction',
      mitigation: '追加費用の承認依頼、次回案件で調整',
      value: -300000,
    },
    {
      id: 3,
      level: 'high',
      category: 'クライアントリスク',
      title: 'クライアントC - 解約リスク',
      impact: 'high',
      probability: 'medium',
      description: '満足度3.8、NPS 6.5。契約更新時期が来月に迫る',
      affectedBoard: 'Sales',
      mitigation: 'ディレクターとの面談設定、サービス改善提案',
      value: -1800000,
    },
    {
      id: 4,
      level: 'medium',
      category: 'リソースリスク',
      title: 'Editor Board - 人員不足',
      impact: 'medium',
      probability: 'medium',
      description: '来週の稼働率が95%超え。新規案件受注が困難',
      affectedBoard: 'Editor',
      mitigation: 'フリーランス Editor の採用、案件スケジュール調整',
    },
    {
      id: 5,
      level: 'medium',
      category: '収益リスク',
      title: 'クライアントD - 支払遅延',
      impact: 'low',
      probability: 'high',
      description: '請求書発行から45日経過、未入金。過去にも遅延履歴あり',
      affectedBoard: 'Sales',
      mitigation: '督促メール送信、次回契約時に前払い条件追加',
      value: -850000,
    },
  ];

  const riskStats = {
    critical: risks.filter(r => r.level === 'critical').length,
    high: risks.filter(r => r.level === 'high').length,
    medium: risks.filter(r => r.level === 'medium').length,
    totalImpact: risks.reduce((sum, r) => sum + (r.value || 0), 0),
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'high': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical': return '重大';
      case 'high': return '高';
      case 'medium': return '中';
      default: return '低';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '納期リスク': return Calendar;
      case '収益リスク': return DollarSign;
      case 'クライアントリスク': return Users;
      case 'リソースリスク': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-foreground mb-2">Risk Management</h1>
        <p className="text-sm text-muted-foreground">リスク管理 - 納期・収益・クライアント・リソースリスク</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-red-200 rounded-xl p-4">
          <div className="text-2xl mb-1 text-red-600">{riskStats.critical}</div>
          <div className="text-sm text-muted-foreground">重大リスク</div>
        </div>
        <div className="bg-card border border-orange-200 rounded-xl p-4">
          <div className="text-2xl mb-1 text-orange-600">{riskStats.high}</div>
          <div className="text-sm text-muted-foreground">高リスク</div>
        </div>
        <div className="bg-card border border-yellow-200 rounded-xl p-4">
          <div className="text-2xl mb-1 text-yellow-600">{riskStats.medium}</div>
          <div className="text-sm text-muted-foreground">中リスク</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-lg mb-1 text-red-600">
            {riskStats.totalImpact < 0 ? `¥${(Math.abs(riskStats.totalImpact)/1000000).toFixed(1)}M` : '-'}
          </div>
          <div className="text-sm text-muted-foreground">想定損失額</div>
        </div>
      </div>

      {/* Risk List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg">リスク一覧</h2>
        </div>
        <div className="space-y-4">
          {risks.map((risk) => {
            const CategoryIcon = getCategoryIcon(risk.category);
            return (
              <div key={risk.id} className={`p-5 border rounded-lg ${getRiskColor(risk.level)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 border rounded-full text-xs ${getRiskColor(risk.level)}`}>
                        {getRiskLabel(risk.level)}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-1 bg-muted text-xs rounded">
                        <CategoryIcon className="w-3 h-3" />
                        <span>{risk.category}</span>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {risk.affectedBoard}
                      </span>
                    </div>
                    <h3 className="text-sm mb-2">{risk.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>

                    <div className="grid md:grid-cols-3 gap-3 mb-3 text-sm">
                      <div className="p-2 bg-background/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">影響度</div>
                        <div className={
                          risk.impact === 'high' ? 'text-red-600' :
                          risk.impact === 'medium' ? 'text-orange-600' :
                          'text-yellow-600'
                        }>
                          {risk.impact === 'high' ? '高' : risk.impact === 'medium' ? '中' : '低'}
                        </div>
                      </div>
                      <div className="p-2 bg-background/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">発生確率</div>
                        <div className={
                          risk.probability === 'high' ? 'text-red-600' :
                          risk.probability === 'medium' ? 'text-orange-600' :
                          'text-yellow-600'
                        }>
                          {risk.probability === 'high' ? '高' : risk.probability === 'medium' ? '中' : '低'}
                        </div>
                      </div>
                      {risk.value && (
                        <div className="p-2 bg-background/50 rounded">
                          <div className="text-xs text-muted-foreground mb-1">想定損失</div>
                          <div className="text-red-600">¥{Math.abs(risk.value).toLocaleString()}</div>
                        </div>
                      )}
                      {risk.dueDate && (
                        <div className="p-2 bg-background/50 rounded">
                          <div className="text-xs text-muted-foreground mb-1">期限</div>
                          <div>{risk.dueDate}</div>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-background rounded">
                      <div className="text-xs text-muted-foreground mb-1">対策</div>
                      <div className="text-sm">{risk.mitigation}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    対策実行
                  </button>
                  <button className="px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm">
                    詳細
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
