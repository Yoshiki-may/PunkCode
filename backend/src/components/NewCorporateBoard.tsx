import { MoreVertical, ArrowUp, Users, FileText, TrendingUp, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  subtitle?: string;
}

function StatCard({ title, value, change, changeType, subtitle }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-2">{title}</p>
          <h3 className="text-2xl font-semibold text-card-foreground">{value}</h3>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
          changeType === 'increase' 
            ? 'bg-success/10 text-success' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          {changeType === 'increase' && <ArrowUp className="w-3 h-3" />}
          {change}
        </div>
        <span className="text-xs text-muted-foreground">{subtitle || 'vs last month'}</span>
      </div>
    </div>
  );
}

interface ContractData {
  name: string;
  company: string;
  dateAdded: string;
  value: string;
  status: string;
  progress: number;
  initials: string;
}

export function NewCorporateBoard() {
  const contracts: ContractData[] = [
    { name: '年間SNS運用契約', company: 'AXAS株式会社', dateAdded: 'Aug 20, 2023', value: '¥12,000,000', status: 'Active', progress: 85, initials: 'AS' },
    { name: 'キャンペーン制作', company: 'BAYMAX株式会社', dateAdded: 'Sep 5, 2023', value: '¥8,500,000', status: 'Review', progress: 60, initials: 'KC' },
    { name: 'ブランディング支援', company: 'デジタルフロンティア', dateAdded: 'Sep 10, 2023', value: '¥15,000,000', status: 'Active', progress: 75, initials: 'BS' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Corporate Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage contracts and business operations.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="¥42.7M" 
          change="18%" 
          changeType="increase"
        />
        <StatCard 
          title="Active Contracts" 
          value="28" 
          change="12%" 
          changeType="increase"
        />
        <StatCard 
          title="Team Size" 
          value="45" 
          change="6%" 
          changeType="increase"
        />
        <StatCard 
          title="Client Retention" 
          value="94%" 
          change="3%" 
          changeType="increase"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Revenue Overview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Revenue Overview</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Profit</span>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
              const height1 = 30 + Math.random() * 50;
              const height2 = 20 + Math.random() * 40;
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-0.5">
                    <div 
                      className="flex-1 bg-emerald-500/30 hover:bg-emerald-500/40 rounded transition-colors"
                      style={{ height: `${height1}%` }}
                    ></div>
                    <div 
                      className="flex-1 bg-blue-500/30 hover:bg-blue-500/40 rounded transition-colors"
                      style={{ height: `${height2}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{month.substring(0, 1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contract Value Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Contract Value Trend</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-2xl font-semibold text-card-foreground mb-1">¥42,728,600</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                22%
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-48 relative">
            <svg viewBox="0 0 320 180" className="w-full h-full">
              <defs>
                <linearGradient id="contractGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 160 Q 40 145, 80 125 T 160 105 T 240 85 T 320 65 L 320 180 L 0 180 Z"
                fill="url(#contractGradient)"
              />
              <path
                d="M 0 160 Q 40 145, 80 125 T 160 105 T 240 85 T 320 65"
                stroke="rgb(16, 185, 129)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Contracts Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">Active Contracts</h3>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Contract</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Company</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Start Date</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Value</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Progress</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs text-white font-medium">
                        {contract.initials}
                      </div>
                      <span className="text-sm text-card-foreground font-medium">{contract.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{contract.company}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{contract.dateAdded}</td>
                  <td className="py-4 px-6 text-sm text-card-foreground font-medium">{contract.value}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      contract.status === 'Active' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full transition-all"
                          style={{ width: `${contract.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{contract.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
