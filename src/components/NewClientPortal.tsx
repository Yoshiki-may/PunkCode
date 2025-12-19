import { MoreVertical, ArrowUp, FileText, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { PALSSHearingReport } from './client-portal/PALSSHearingReport';
import { InstagramRealtimeData } from './client-portal/InstagramRealtimeData';
import { OperationFlowProgress } from './client-portal/OperationFlowProgress';

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

interface DeliverableData {
  name: string;
  type: string;
  dateDelivered: string;
  status: string;
  engagement: string;
  performance: number;
}

export function NewClientPortal() {
  const deliverables: DeliverableData[] = [
    { name: 'Instagram Reels #12', type: 'Video', dateDelivered: 'Sep 20, 2023', status: 'Published', engagement: '12.5K', performance: 85 },
    { name: 'Product Launch Campaign', type: 'Campaign', dateDelivered: 'Sep 25, 2023', status: 'Published', engagement: '28.3K', performance: 92 },
    { name: 'Brand Photography Set', type: 'Images', dateDelivered: 'Sep 28, 2023', status: 'Delivered', engagement: '—', performance: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Client Portal</h1>
          <p className="text-sm text-muted-foreground">契約済みクライアント様向けダッシュボード - キャンペーンとパフォーマンス指標をご確認いただけます</p>
        </div>
      </div>

      {/* PALSS Hearing Report */}
      <PALSSHearingReport 
        clientName="株式会社サンプル企業"
        hearingDate="2024/01/10"
      />

      {/* Operation Flow Progress */}
      <OperationFlowProgress 
        clientName="株式会社サンプル企業"
        projectName="SNS運用プロジェクト 2024 Q1"
        overallProgress={43}
      />

      {/* Instagram Realtime Data */}
      <InstagramRealtimeData 
        accountName="sample_company_official"
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Total Engagement" 
          value="127.5K" 
          change="24%" 
          changeType="increase"
        />
        <StatCard 
          title="Active Campaigns" 
          value="8" 
          change="2" 
          changeType="increase"
          subtitle="new this month"
        />
        <StatCard 
          title="Avg. Performance" 
          value="89%" 
          change="7%" 
          changeType="increase"
        />
        <StatCard 
          title="Content Delivered" 
          value="42" 
          change="15%" 
          changeType="increase"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Engagement Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Engagement Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <span className="text-xs text-muted-foreground">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span className="text-xs text-muted-foreground">TikTok</span>
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
                      className="flex-1 bg-violet-500/30 hover:bg-violet-500/40 rounded transition-colors"
                      style={{ height: `${height1}%` }}
                    ></div>
                    <div 
                      className="flex-1 bg-pink-500/30 hover:bg-pink-500/40 rounded transition-colors"
                      style={{ height: `${height2}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{month.substring(0, 1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Campaign Performance</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-2xl font-semibold text-card-foreground mb-1">89.2%</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                18%
              </div>
              <span className="text-xs text-muted-foreground">average rating</span>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-48 relative">
            <svg viewBox="0 0 320 180" className="w-full h-full">
              <defs>
                <linearGradient id="performanceGradientClient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 Q 40 135, 80 115 T 160 95 T 240 75 T 320 55 L 320 180 L 0 180 Z"
                fill="url(#performanceGradientClient)"
              />
              <path
                d="M 0 150 Q 40 135, 80 115 T 160 95 T 240 75 T 320 55"
                stroke="rgb(168, 85, 247)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Deliverables Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">Recent Deliverables</h3>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Content</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Delivery Date</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Engagement</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Performance</th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map((item, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-card-foreground font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{item.type}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{item.dateDelivered}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      item.status === 'Published' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-card-foreground font-medium">{item.engagement}</td>
                  <td className="py-4 px-6">
                    {item.performance > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${item.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{item.performance}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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