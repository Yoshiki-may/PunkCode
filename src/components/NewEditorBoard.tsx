import { MoreVertical, ArrowUp, Video, Image, Music, FileText } from 'lucide-react';

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

interface VideoData {
  name: string;
  client: string;
  dateAdded: string;
  deadline: string;
  status: string;
  progress: number;
  type: 'video' | 'image' | 'audio';
}

export function NewEditorBoard() {
  const videos: VideoData[] = [
    { name: 'Instagram Reels #12', client: 'AXAS株式会社', dateAdded: 'Sep 10, 2023', deadline: 'Sep 25, 2023', status: 'Editing', progress: 75, type: 'video' },
    { name: 'YouTube Intro', client: 'BAYMAX株式会社', dateAdded: 'Sep 15, 2023', deadline: 'Sep 30, 2023', status: 'Review', progress: 90, type: 'video' },
    { name: 'Product Photos', client: 'デジタルフロンティア', dateAdded: 'Sep 18, 2023', deadline: 'Oct 5, 2023', status: 'Processing', progress: 45, type: 'image' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-card-foreground mb-1">Editor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track editing projects and deliverables.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Active Projects" 
          value="18" 
          change="12%" 
          changeType="increase"
        />
        <StatCard 
          title="Videos Completed" 
          value="42" 
          change="15%" 
          changeType="increase"
        />
        <StatCard 
          title="Avg. Turnaround" 
          value="2.3 days" 
          change="-8%" 
          changeType="decrease"
          subtitle="improvement"
        />
        <StatCard 
          title="Client Satisfaction" 
          value="96%" 
          change="4%" 
          changeType="increase"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Content Production */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Content Production</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span className="text-xs text-muted-foreground">Images</span>
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
                      className="flex-1 bg-blue-500/30 hover:bg-blue-500/40 rounded transition-colors"
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

        {/* Workflow Efficiency */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-card-foreground">Workflow Efficiency</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-2xl font-semibold text-card-foreground mb-1">92.5%</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                12%
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-48 relative">
            <svg viewBox="0 0 320 180" className="w-full h-full">
              <defs>
                <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 Q 40 140, 80 120 T 160 100 T 240 80 T 320 60 L 320 180 L 0 180 Z"
                fill="url(#efficiencyGradient)"
              />
              <path
                d="M 0 150 Q 40 140, 80 120 T 160 100 T 240 80 T 320 60"
                stroke="rgb(236, 72, 153)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Projects Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">Active Projects</h3>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Project</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Start Date</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Deadline</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Progress</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, i) => {
                const IconComponent = video.type === 'video' ? Video : video.type === 'image' ? Image : Music;
                return (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-card-foreground font-medium">{video.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{video.client}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{video.dateAdded}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{video.deadline}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        video.status === 'Editing' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : video.status === 'Review'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {video.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${video.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{video.progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
