import { Camera, TrendingUp, Calendar, Clock, MapPin, MoreVertical, ArrowUp, Filter } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from './DetailDrawer';

interface CreationTask {
  id: string;
  title: string;
  client: string;
  platform: string;
  format: string;
  duration: string;
  aspectRatio: string;
  materials: string[];
  status: 'todo' | 'doing' | 'needs-review' | 'ready';
  deadline: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  color: string;
}

interface CustomerData {
  name: string;
  dateAdded: string;
  lastActive: string;
  spend: string;
  progress: number;
}

export function NewCreatorBoard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CreationTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(14); // December 14

  const scheduleEvents: ScheduleEvent[] = [
    { id: '1', title: 'AXAS社 新商品撮影', time: '09:00 - 11:00', location: '渋谷スタジオ', color: 'bg-blue-500' },
    { id: '2', title: 'クライアントMTG', time: '13:00 - 14:00', location: 'オンライン', color: 'bg-purple-500' },
    { id: '3', title: 'Instagram Reels編集', time: '14:30 - 16:30', color: 'bg-green-500' },
    { id: '4', title: 'BAYMAX社 打ち合わせ', time: '17:00 - 18:00', location: '本社オフィス', color: 'bg-amber-500' },
  ];

  const tasks: CreationTask[] = [
    {
      id: '1',
      title: 'Instagram Reels素材撮影',
      client: 'AXAS株式会社',
      platform: 'Instagram',
      format: 'Reels',
      duration: '30秒',
      aspectRatio: '9:16',
      materials: ['B-roll', '写真', '音声'],
      status: 'doing',
      deadline: '12/14 18:00',
    },
    {
      id: '2',
      title: 'YouTube動画素材収集',
      client: 'BAYMAX株式会社',
      platform: 'YouTube',
      format: 'Long',
      duration: '3分',
      aspectRatio: '16:9',
      materials: ['B-roll', '写真'],
      status: 'todo',
      deadline: '12/15 12:00',
    },
  ];

  const customers: CustomerData[] = [
    { name: 'Corey Mango', dateAdded: 'Aug 20, 2023', lastActive: 'Sep 12, 2023 - 1:20pm', spend: '$172.80', progress: 72 },
    { name: 'Cristofr Franci', dateAdded: 'Aug 30, 2023', lastActive: 'Sep 20, 2023 - 5:20pm', spend: '$227.32', progress: 62 },
    { name: 'Jakob Schlefer', dateAdded: 'Jul 20, 2023', lastActive: 'Sep 26, 2023 - 1:20pm', spend: '$272.80', progress: 80 },
  ];

  const handleTaskClick = (task: CreationTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  // Calendar data for December 2024
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 6; // December 1, 2024 is Sunday

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-card-foreground mb-1">Welcome back, Maria Westervelt</h1>
            <p className="text-sm text-muted-foreground">Your current sales and activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-card-foreground hover:bg-accent transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Dates
            </button>
            <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-card-foreground hover:bg-accent transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-4 gap-4">
          {/* Daily Revenue */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Daily Revenue</p>
                <h3 className="text-2xl font-semibold text-card-foreground">$3,072.90</h3>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                12%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Avg. Order Value</p>
                <h3 className="text-2xl font-semibold text-card-foreground">$726.80</h3>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                10%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>

          {/* Daily Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Daily Orders</p>
                <h3 className="text-2xl font-semibold text-card-foreground">172</h3>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs font-medium">
                -01%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>

          {/* Sales */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Total Sales</p>
                <h3 className="text-2xl font-semibold text-card-foreground">$4,272.86</h3>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                <ArrowUp className="w-3 h-3" />
                16%
              </div>
              <span className="text-xs text-muted-foreground">$172.14K avg</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue Growth Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-card-foreground">Revenue Growth</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">Website</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-xs text-muted-foreground">E-commerce</span>
                </div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 flex items-end justify-between gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = 40 + Math.random() * 60;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-[10px] text-muted-foreground">{month.substring(0, 1)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales Chart with Gradient */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-card-foreground">Sales Performance</h3>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-2xl font-semibold text-card-foreground mb-1">$4,272.86</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
                  <ArrowUp className="w-3 h-3" />
                  16%
                </div>
                <span className="text-xs text-muted-foreground">vs previous period</span>
              </div>
            </div>

            {/* Sales Chart with Area Fill */}
            <div className="h-48 relative">
              <svg viewBox="0 0 320 180" className="w-full h-full">
                <defs>
                  <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 140 Q 40 120, 80 100 T 160 80 T 240 60 T 320 40 L 320 180 L 0 180 Z"
                  fill="url(#salesGradient)"
                />
                <path
                  d="M 0 140 Q 40 120, 80 100 T 160 80 T 240 60 T 320 40"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Customers Movement Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-sm font-medium text-card-foreground">Recent Customers</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Date Added</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Spend</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Progress</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-card-foreground font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{customer.dateAdded}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{customer.lastActive}</td>
                    <td className="py-4 px-6 text-sm text-card-foreground font-medium">{customer.spend}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${customer.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{customer.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTask && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedTask.id,
            title: selectedTask.title,
            clientName: selectedTask.client,
            status: selectedTask.status === 'ready' ? '完了' : selectedTask.status === 'needs-review' ? 'レビュー待ち' : '進行中',
            deadline: `2024/${selectedTask.deadline}`,
            assignee: 'クリエイターチーム',
            type: selectedTask.platform,
            priority: 'medium',
            description: `${selectedTask.client}向けの${selectedTask.platform}素材制作タスクです。`,
            deliverables: selectedTask.materials,
            relatedLinks: [
              { label: 'ブリーフ資料', url: '#' },
              { label: '参考動画', url: '#' },
            ],
          }}
        />
      )}
    </>
  );
}