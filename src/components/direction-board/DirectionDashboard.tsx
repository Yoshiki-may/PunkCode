import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2,
  Clock,
  Target,
  Activity,
  Calendar,
  ArrowRight,
  Briefcase,
  ListTodo,
  AlertCircle
} from 'lucide-react';

interface DirectionDashboardProps {
  onNavigate?: (view: string) => void;
}

export function DirectionDashboard({ onNavigate }: DirectionDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-card-foreground mb-1">Direction Dashboard</h1>
        <p className="text-sm text-muted-foreground">全体のKPIと業務状況を把握</p>
      </div>

      {/* Quick Stats - 4列 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              <span>+12%</span>
            </div>
          </div>
          <div className="text-3xl text-card-foreground mb-1">24</div>
          <div className="text-xs text-muted-foreground">アクティブクライアント</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" strokeWidth={2} />
              <span>要対応</span>
            </div>
          </div>
          <div className="text-3xl text-card-foreground mb-1">12</div>
          <div className="text-xs text-muted-foreground">承認待ち</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              <span>85%</span>
            </div>
          </div>
          <div className="text-3xl text-card-foreground mb-1">47</div>
          <div className="text-xs text-muted-foreground">進行中タスク</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" strokeWidth={2} />
              <span>+8%</span>
            </div>
          </div>
          <div className="text-3xl text-card-foreground mb-1">156</div>
          <div className="text-xs text-muted-foreground">今月完了</div>
        </div>
      </div>

      {/* Pipeline & Workload - 統合セクション */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline Status */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-card-foreground">Pipeline Status</h3>
            <Target className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
          </div>

          <div className="space-y-4">
            {/* Stage Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">企画中</span>
                <span className="text-sm text-card-foreground">18件</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">制作中</span>
                <span className="text-sm text-card-foreground">24件</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">承認待ち</span>
                <span className="text-sm text-card-foreground">12件</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">公開済み</span>
                <span className="text-sm text-card-foreground">35件</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          {/* Total Pipeline */}
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">総パイプライン</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-card-foreground">89</span>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                  <span>+5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-card-foreground">Team Workload</h3>
            <Activity className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
          </div>

          <div className="space-y-4">
            {/* Team Members */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-sm">
                  YT
                </div>
                <div>
                  <div className="text-sm text-card-foreground">Yamada Taro</div>
                  <div className="text-xs text-muted-foreground">シニアディレクター</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg text-card-foreground">18</div>
                <div className="text-xs text-amber-600 dark:text-amber-400">高負荷</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm">
                  SH
                </div>
                <div>
                  <div className="text-sm text-card-foreground">Sato Hanako</div>
                  <div className="text-xs text-muted-foreground">ディレクター</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg text-card-foreground">12</div>
                <div className="text-xs text-green-600 dark:text-green-400">適正</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm">
                  TK
                </div>
                <div>
                  <div className="text-sm text-card-foreground">Tanaka Kenji</div>
                  <div className="text-xs text-muted-foreground">ディレクター</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg text-card-foreground">8</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">余裕あり</div>
              </div>
            </div>
          </div>

          {/* Total Workload */}
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">チーム平均稼働率</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-card-foreground">78%</span>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                  <span>適正</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - クイックリンク */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
        <h3 className="text-card-foreground mb-4">クイックアクション</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate?.('direction-approvals')}
            className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              <div className="text-left">
                <div className="text-sm text-card-foreground">承認業務</div>
                <div className="text-xs text-muted-foreground">12件待ち</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" strokeWidth={2} />
          </button>

          <button
            onClick={() => onNavigate?.('my-clients')}
            className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div className="text-left">
                <div className="text-sm text-card-foreground">クライアント</div>
                <div className="text-xs text-muted-foreground">24社</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" strokeWidth={2} />
          </button>

          <button
            onClick={() => onNavigate?.('tasks')}
            className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              </div>
              <div className="text-left">
                <div className="text-sm text-card-foreground">タスク管理</div>
                <div className="text-xs text-muted-foreground">47件進行中</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Weekly Schedule Preview */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-card-foreground">今週のスケジュール</h3>
          <Calendar className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
            <div className="text-center flex-shrink-0">
              <div className="text-xs text-muted-foreground">12/19</div>
              <div className="text-sm text-card-foreground">木</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-card-foreground mb-1">AXAS株式会社 月次レポート提出</div>
              <div className="text-xs text-muted-foreground">14:00 - オンラインMTG</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">重要</span>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
            <div className="text-center flex-shrink-0">
              <div className="text-xs text-muted-foreground">12/20</div>
              <div className="text-sm text-card-foreground">金</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-card-foreground mb-1">BAYMAX株式会社 新規キャンペーン企画</div>
              <div className="text-xs text-muted-foreground">10:00 - 承認締切</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-600">締切近</span>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
            <div className="text-center flex-shrink-0">
              <div className="text-xs text-muted-foreground">12/21</div>
              <div className="text-sm text-card-foreground">土</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-card-foreground mb-1">投稿スケジュール最終確認</div>
              <div className="text-xs text-muted-foreground">全クライアント対象</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600">定例</span>
          </div>
        </div>
      </div>
    </div>
  );
}
