import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users, 
  Heart, 
  MessageCircle,
  Eye,
  Target,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  FileText,
  BarChart3,
  Lightbulb,
  BookOpen,
  Share2,
  Archive,
  Upload,
  Filter,
  Search,
  X,
  Check,
  Download,
  ExternalLink,
  History,
  Flag,
  Link,
  Bell,
  ArrowUp,
  Zap,
  PlayCircle,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Instagram,
  Twitter as TwitterIcon,
  Facebook,
  Sparkles,
  Activity,
  TrendingUpIcon,
  Send,
  VideoIcon,
  Building2,
  User,
  Mail,
  Phone,
  Copy
} from 'lucide-react';
import { getClientById, ClientData } from '../../utils/clientData';
import { getClientComments, addComment } from '../../utils/commentData';
import { getCurrentAuthUser } from '../../utils/auth';
import { getClientContract, addContract, updateContract, Contract } from '../../utils/contractData';
import { ContractModal } from '../ContractModal';

interface DirectionClientDetailProps {
  clientId?: string;
  onBack?: () => void;
}

type TabType = 'dashboard' | 'basicInfo' | 'progress' | 'calendar' | 'approval' | 'report' | 'proposal' | 'brand' | 'communication' | 'archive' | 'assets' | 'contract';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'approval' | 'rejected' | 'completed';
  postDate: string;
  platform: 'Instagram' | 'Twitter' | 'TikTok' | 'Facebook';
  assignee: string;
  initials: string;
  rejectedCount?: number;
  dueDate?: string;
  delayReason?: string;
  nextAction?: string;
}

interface KPI {
  label: string;
  current: string;
  previous: string;
  change: number;
  icon: any;
}

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: 'scheduled' | 'published' | 'draft';
  date: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

interface ApprovalItem {
  id: string;
  title: string;
  type: '投稿' | '動画' | '企画書';
  submittedBy: string;
  submittedDate: string;
  platform: string;
  thumbnailUrl?: string;
}

interface Proposal {
  id: string;
  title: string;
  objective: string;
  reference: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  nextMonthTicket?: boolean;
}

// mockClientは後でclientDataから取得するため削除

// mockTasksはclientData.tasksから取得するため、ここでは不要

// mockKPIsはclientData.kpiから動的に生成するため削除
const buildMockKPIs = (clientData: ClientData): KPI[] => [
  {
    label: 'フォロワー数',
    current: clientData.kpi.followers.current.toLocaleString(),
    previous: Math.round(clientData.kpi.followers.current / (1 + clientData.kpi.followers.change / 100)).toLocaleString(),
    change: clientData.kpi.followers.change,
    icon: Users
  },
  {
    label: 'エンゲージメント率',
    current: `${clientData.kpi.engagement.current}%`,
    previous: `${Math.round(clientData.kpi.engagement.current / (1 + clientData.kpi.engagement.change / 100) * 10) / 10}%`,
    change: clientData.kpi.engagement.change,
    icon: TrendingUp
  },
  {
    label: 'リーチ',
    current: (clientData.kpi.reach.current / 1000).toFixed(1) + 'k',
    previous: Math.round(clientData.kpi.reach.current / (1 + clientData.kpi.reach.change / 100) / 1000).toFixed(1) + 'k',
    change: clientData.kpi.reach.change,
    icon: Eye
  },
  {
    label: 'インプレッション',
    current: (clientData.kpi.impressions.current / 1000).toFixed(1) + 'k',
    previous: Math.round(clientData.kpi.impressions.current / (1 + clientData.kpi.impressions.change / 100) / 1000).toFixed(1) + 'k',
    change: clientData.kpi.impressions.change,
    icon: Activity
  }
];

const mockApprovals: ApprovalItem[] = [
  {
    id: 'a1',
    title: '新商品ローンチキャンペーン投稿',
    type: '投稿',
    submittedBy: 'Yamada',
    submittedDate: '2025.12.19 10:30',
    platform: 'Instagram'
  },
  {
    id: 'a2',
    title: '年末挨拶動画',
    type: '動画',
    submittedBy: 'Sato',
    submittedDate: '2025.12.19 09:15',
    platform: 'TikTok'
  },
  {
    id: 'a3',
    title: '1月キャンペーン企画書',
    type: '企画書',
    submittedBy: 'Tanaka',
    submittedDate: '2025.12.18 16:45',
    platform: 'Instagram'
  }
];

const mockProposals: Proposal[] = [
  {
    id: 'p1',
    title: 'バレンタインキャンペーン企画',
    objective: 'Z世代女性の認知拡大とUGC創出',
    reference: '@cosmebrand_official の #ShareYourLove キャンペーン',
    status: 'pending',
    submittedDate: '2025.12.15',
    nextMonthTicket: true
  },
  {
    id: 'p2',
    title: 'インフルエンサーコラボ企画',
    objective: '新規顧客層へのリーチ拡大',
    reference: '美容系マイクロインフルエンサー5名との連携',
    status: 'approved',
    submittedDate: '2025.12.10'
  },
  {
    id: 'p3',
    title: 'TikTokチャレンジ企画',
    objective: 'ブランド認知とバイラル狙い',
    reference: '#BeautyChallenge トレンド活用',
    status: 'rejected',
    submittedDate: '2025.12.08'
  }
];

export function DirectionClientDetail({ clientId, onBack }: DirectionClientDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // コメント関連の状態
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const currentUser = getCurrentAuthUser();
  
  // 契約関連の状態
  const [contract, setContract] = useState<Contract | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  
  // 共通データからクライアント情報を取得
  const clientData = getClientById(clientId || 'client-1');
  
  // コメント一覧を読み込み（communicationタブで使用）
  useEffect(() => {
    if (!clientId) {
      setMessages([]);
      return;
    }

    const loadMessages = () => {
      const comments = getClientComments(clientId);
      
      // Comment型をメッセージ表示用に変換
      const formattedMessages = comments.map(comment => ({
        id: comment.id,
        sender: comment.isFromClient ? 'client' : 'team',
        senderName: comment.isFromClient ? 'クライアント' : 'チーム',
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        avatar: comment.isFromClient ? '👨‍💼' : '👤',
      }));
      
      setMessages(formattedMessages);
    };

    loadMessages();
    
    // autoPull対応：5秒間隔で再読み込み
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [clientId]);
  
  // 契約データを読み込み（contractタブで使用）
  useEffect(() => {
    if (!clientId) {
      setContract(null);
      return;
    }

    const loadContract = () => {
      const clientContract = getClientContract(clientId);
      setContract(clientContract || null);
    };

    loadContract();
    
    // autoPull対応：5秒間隔で再読み込み
    const interval = setInterval(loadContract, 5000);
    return () => clearInterval(interval);
  }, [clientId]);
  
  // クライアントデータが見つからない場合のデフォルト
  if (!clientData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">クライアントが見つかりませんでした</p>
          {onBack && (
            <button onClick={onBack} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              戻る
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // クライアントデータからKPIを生成
  const mockKPIs = buildMockKPIs(clientData);
  
  // クライアントデータからタスクを取得
  const mockTasks = clientData.tasks;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'ダッシュボード', icon: Sparkles },
    { id: 'basicInfo' as TabType, label: '基本情報', icon: Building2 },
    { id: 'contract' as TabType, label: '契約管理', icon: FileText },
    { id: 'progress' as TabType, label: '進捗管理', icon: Target },
    { id: 'calendar' as TabType, label: '投稿カレンダー', icon: Calendar },
    { id: 'approval' as TabType, label: '承認センター', icon: CheckCircle2, badge: 3 },
    { id: 'report' as TabType, label: 'レポート', icon: BarChart3 },
    { id: 'proposal' as TabType, label: '企画提案', icon: Lightbulb },
    { id: 'brand' as TabType, label: 'ブランドガイド', icon: BookOpen },
    { id: 'communication' as TabType, label: 'コミュニケーション', icon: MessageCircle },
    { id: 'archive' as TabType, label: '納品アーカイブ', icon: Archive },
    { id: 'assets' as TabType, label: '素材共有', icon: Share2 }
  ];

  const handleGenerateAIUrl = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/hearing?clientId=${clientId || 'client-1'}`;
    setGeneratedUrl(url);
  };

  const handleCopyUrl = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending || !clientId || !currentUser) {
      return;
    }

    setIsSending(true);

    try {
      // コメントを追加（outbox統合済み）
      const success = addComment({
        clientId,
        userId: currentUser.id,
        content: messageInput.trim(),
        isFromClient: currentUser.role === 'client'
      });

      if (success) {
        setMessageInput('');
        
        // 即座にローカル表示を更新（楽観的UI更新）
        const newMessage = {
          id: `temp-${Date.now()}`,
          sender: 'team',
          senderName: 'チーム',
          content: messageInput.trim(),
          timestamp: new Date().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          avatar: '👤',
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('[DirectionClientDetail] Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveContract = (contractData: Partial<Contract>) => {
    if (!clientId) return;
    
    try {
      if (editingContract) {
        // 更新
        const success = updateContract(editingContract.id, contractData);
        if (success) {
          console.log('[DirectionClientDetail] Contract updated');
          // autoPullで最新データが反映される
        }
      } else {
        // 新規追加
        const success = addContract({
          ...contractData,
          clientId,
        } as any);
        if (success) {
          console.log('[DirectionClientDetail] Contract added');
          // autoPullで最新データが反映される
        }
      }
      setIsContractModalOpen(false);
      setEditingContract(null);
    } catch (error) {
      console.error('[DirectionClientDetail] Failed to save contract:', error);
    }
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setIsContractModalOpen(true);
  };

  const handleEditContract = () => {
    if (contract) {
      setEditingContract(contract);
      setIsContractModalOpen(true);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500',
      'Twitter': 'bg-blue-400',
      'TikTok': 'bg-black dark:bg-white',
      'Facebook': 'bg-blue-600',
      'YouTube': 'bg-red-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  const getStatusBadge = (status: Task['status']) => {
    const configs = {
      'pending': { bg: 'bg-muted', text: 'text-muted-foreground', label: '未着手', icon: Clock },
      'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', label: '制作中', icon: Target },
      'approval': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', label: '承認待ち', icon: AlertCircle },
      'rejected': { bg: 'bg-destructive/10', text: 'text-destructive', label: '差戻し', icon: RotateCcw },
      'completed': { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', label: '完了', icon: CheckCircle2 }
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.text} text-xs`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
        <span>{config.label}</span>
      </div>
    );
  };

  const renderProgressTab = () => (
    <div className="space-y-4">
      {mockTasks.map((task) => (
        <div key={task.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${getPlatformColor(task.platform)} flex items-center justify-center flex-shrink-0`}>
              <div className="w-5 h-5 bg-white/90 rounded-md" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-card-foreground">{task.title}</h3>
                {getStatusBadge(task.status)}
              </div>

              {/* Progress Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">投稿予定日</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar className="w-4 h-4 text-primary" strokeWidth={2} />
                    <span className="text-card-foreground">{task.postDate}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">制作期限</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                    <span className="text-card-foreground">{task.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Next Action */}
              {task.nextAction && (
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">次のアクション</div>
                      <div className="text-sm text-card-foreground">{task.nextAction}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delay Reason */}
              {task.delayReason && (
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <div className="text-xs text-destructive mb-0.5">遅延理由</div>
                      <div className="text-sm text-card-foreground">{task.delayReason}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignee */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {task.initials}
                </div>
                <span>担当: {task.assignee}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-4">
      {/* Platform Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selectedPlatform === 'all' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:bg-accent/80'
          }`}
        >
          すべて
        </button>
        {['Instagram', 'Twitter', 'TikTok', 'Facebook'].map((platform) => (
          <button
            key={platform}
            onClick={() => setSelectedPlatform(platform)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedPlatform === platform ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:bg-accent/80'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-accent/30 p-4 border-b border-border">
          <div className="grid grid-cols-7 gap-2">
            {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
              <div key={day} className="text-center text-sm text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-2">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Start from Dec 1 (assuming first day is Tuesday)
              const isCurrentMonth = dayNum >= 1 && dayNum <= 31;
              const hasContent = [4, 10, 15, 19, 23, 24, 26, 28].includes(dayNum);
              
              return (
                <div
                  key={i}
                  className={`aspect-square p-2 rounded-lg border transition-colors ${
                    isCurrentMonth
                      ? hasContent
                        ? 'bg-primary/5 border-primary/30 hover:bg-primary/10 cursor-pointer'
                        : 'bg-card border-border hover:bg-accent/30'
                      : 'bg-muted/20 border-transparent'
                  }`}
                >
                  {isCurrentMonth && (
                    <>
                      <div className={`text-xs mb-1 ${hasContent ? 'text-primary' : 'text-muted-foreground'}`}>
                        {dayNum}
                      </div>
                      {hasContent && (
                        <div className="space-y-0.5">
                          <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          <div className="w-2/3 h-1 bg-blue-400 rounded-full" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          <span className="text-muted-foreground">Instagram</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-400 rounded-full" />
          <span className="text-muted-foreground">Twitter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-black dark:bg-white rounded-full" />
          <span className="text-muted-foreground">TikTok</span>
        </div>
      </div>
    </div>
  );

  const renderApprovalTab = () => (
    <div className="space-y-4">
      {mockApprovals.map((item) => (
        <div key={item.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-card-foreground mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-accent text-xs">{item.type}</span>
                    <span>•</span>
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.submittedBy}が提出</span>
                    <span>•</span>
                    <span>{item.submittedDate}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                  <Check className="w-4 h-4" strokeWidth={2} />
                  承認
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                  <X className="w-4 h-4" strokeWidth={2} />
                  差戻し
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm">
                  <FileText className="w-4 h-4" strokeWidth={2} />
                  修正テンプレ
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm">
                  <History className="w-4 h-4" strokeWidth={2} />
                  履歴
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReportTab = () => (
    <div className="space-y-6">
      {/* KPI Dashboard */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4">KPIダッシュボード（直近30日）</h3>
        <div className="grid grid-cols-4 gap-4">
          {mockKPIs.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change > 0;
            return (
              <div key={kpi.label} className="p-4 rounded-xl bg-accent/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <div className="text-2xl text-card-foreground mb-1">{kpi.current}</div>
                <div className="flex items-center gap-1 text-xs">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" strokeWidth={2} />
                  )}
                  <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                    {isPositive ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-muted-foreground ml-1">({kpi.previous})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4">週次サマリー</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-primary mb-2">📊 結論</div>
            <p className="text-card-foreground">エンゲージメント率が前週比+13.9%と大幅改善。特にリール投稿の反応が良好。</p>
          </div>
          <div>
            <div className="text-sm text-primary mb-2">💡 理由</div>
            <p className="text-card-foreground">トレンド音源を活用したリール3本が拡散。ハッシュタグ戦略の見直しも効果的。</p>
          </div>
          <div>
            <div className="text-sm text-primary mb-2">🎯 次の打ち手</div>
            <p className="text-card-foreground">リール投稿を週2→3回に増加。UGC誘発施策として「#〇〇チャレンジ」企画を提案。</p>
          </div>
        </div>
      </div>

      {/* Top Posts Ranking */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4">投稿別ランキング（エンゲージメント）</h3>
        <div className="space-y-3">
          {[
            { rank: 1, title: 'クリスマスコフレ紹介リール', engagement: '8,234', platform: 'Instagram' },
            { rank: 2, title: '冬のスキンケアルーティン', engagement: '6,892', platform: 'Instagram' },
            { rank: 3, title: '限定セール告知', engagement: '5,421', platform: 'Twitter' }
          ].map((post) => (
            <div key={post.rank} className="flex items-center gap-4 p-3 rounded-lg bg-accent/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                {post.rank}
              </div>
              <div className="flex-1">
                <div className="text-sm text-card-foreground">{post.title}</div>
                <div className="text-xs text-muted-foreground">{post.platform}</div>
              </div>
              <div className="text-right">
                <div className="text-lg text-card-foreground">{post.engagement}</div>
                <div className="text-xs text-muted-foreground">いいね</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProposalTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-card-foreground">企画提案一覧</h3>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
          + 新規企画
        </button>
      </div>

      {mockProposals.map((proposal) => (
        <div key={proposal.id} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-card-foreground">{proposal.title}</h3>
                {proposal.status === 'pending' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                    審議中
                  </span>
                )}
                {proposal.status === 'approved' && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                    承認済み
                  </span>
                )}
                {proposal.status === 'rejected' && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                    却下
                  </span>
                )}
                {proposal.nextMonthTicket && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                    来月提案
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">提出日: {proposal.submittedDate}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">企画の狙い</div>
              <div className="text-sm text-card-foreground">{proposal.objective}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">参考</div>
              <div className="text-sm text-card-foreground">{proposal.reference}</div>
            </div>
          </div>

          {proposal.status === 'pending' && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" strokeWidth={2} />
                承認
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                <ThumbsDown className="w-4 h-4" strokeWidth={2} />
                却下
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderBrandTab = () => (
    <div className="space-y-6">
      {/* Tone & Manner */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" strokeWidth={2} />
          トーン&マナー
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-accent/30">
            <div className="text-xs text-muted-foreground mb-1">トーン</div>
            <div className="text-card-foreground">親しみやすく、明るく前向きな表現。専門用語は避け、わかりやすい言葉選び。</div>
          </div>
          <div className="p-3 rounded-lg bg-accent/30">
            <div className="text-xs text-muted-foreground mb-1">推奨ワード</div>
            <div className="text-card-foreground">「キレイ」「美しい」「輝く」「自分らしく」「自信」</div>
          </div>
        </div>
      </div>

      {/* NG Guidelines */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" strokeWidth={2} />
          NG事項
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-card-foreground">他社製品との比較表現</span>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-card-foreground">効果を断定する表現（「必ず」「絶対」など）</span>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-card-foreground">ネガティブな表現（「老化」「シミ消し」など）</span>
          </div>
        </div>
      </div>

      {/* Reference Accounts */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4">参考アカウント</h3>
        <div className="space-y-2">
          {['@glossier', '@fentybeauty', '@rarebeauty'].map((account, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <span className="text-sm text-card-foreground">{account}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Asset Rules */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-card-foreground mb-4">素材ルール</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-accent/30">
            <div className="text-xs text-muted-foreground mb-1">画像サイズ</div>
            <div className="text-card-foreground">Instagram: 1080×1080px（正方形）/ 1080×1350px（縦長）</div>
          </div>
          <div className="p-3 rounded-lg bg-accent/30">
            <div className="text-xs text-muted-foreground mb-1">動画仕様</div>
            <div className="text-card-foreground">TikTok: 9:16（縦型）、15-60秒推奨、MP4形式</div>
          </div>
          <div className="p-3 rounded-lg bg-accent/30">
            <div className="text-xs text-muted-foreground mb-1">ロゴ使用</div>
            <div className="text-card-foreground">必ずブランドカラー（#FF69B4）を使用。背景色とのコントラスト比4.5:1以上</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContractTab = () => (
    <div className="space-y-6">
      {/* 契約情報カード */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-card-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
            契約情報
          </h3>
          {contract ? (
            <button
              onClick={handleEditContract}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              編集
            </button>
          ) : (
            <button
              onClick={handleAddContract}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              + 新規契約を追加
            </button>
          )}
        </div>

        {contract ? (
          <div className="space-y-4">
            {/* ステータス */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
              <div>
                <div className="text-xs text-muted-foreground mb-1">ステータス</div>
                <div className="flex items-center gap-2">
                  {contract.status === 'active' && (
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                      アクティブ
                    </span>
                  )}
                  {contract.status === 'negotiating' && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
                      商談中
                    </span>
                  )}
                  {contract.status === 'paused' && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
                      一時停止
                    </span>
                  )}
                  {contract.status === 'expired' && (
                    <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                      期限切れ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 月額料金 */}
            <div className="p-4 rounded-lg bg-accent/30">
              <div className="text-xs text-muted-foreground mb-1">月額料金</div>
              <div className="text-2xl text-card-foreground">
                ¥{contract.monthlyFee.toLocaleString()}
              </div>
            </div>

            {/* 日付情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-accent/30">
                <div className="text-xs text-muted-foreground mb-1">契約開始日</div>
                <div className="text-sm text-card-foreground">
                  {new Date(contract.startDate).toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              {contract.renewalDate && (
                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="text-xs text-muted-foreground mb-1">更新期限日</div>
                  <div className="text-sm text-card-foreground">
                    {new Date(contract.renewalDate).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              )}
              
              {contract.endDate && (
                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="text-xs text-muted-foreground mb-1">契約終了日</div>
                  <div className="text-sm text-card-foreground">
                    {new Date(contract.endDate).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              )}
            </div>

            {/* メタ情報 */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">作成日時: </span>
                  <span className="text-card-foreground">
                    {new Date(contract.createdAt).toLocaleString('ja-JP')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">更新日時: </span>
                  <span className="text-card-foreground">
                    {new Date(contract.updatedAt).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-muted-foreground mb-4">まだ契約が登録されていません</p>
            <p className="text-sm text-muted-foreground">
              「新規契約を追加」ボタンから契約情報を登録してください
            </p>
          </div>
        )}
      </div>

      {/* 注意事項 */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-card-foreground mb-2">契約管理について</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• 契約ステータスが「アクティブ」の場合、更新期限日の設定が必須です</p>
              <p>• 更新期限日が設定されている場合、アラートで通知されます</p>
              <p>• 契約情報はSales KPIの計算に使用されます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationTab = () => (
    <div className="space-y-4">
      {/* メッセージ履歴 */}
      <div className="bg-card rounded-xl border border-border flex flex-col" style={{ height: '600px' }}>
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <h3 className="text-card-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" strokeWidth={2} />
            クライアントとのコミュニケーション
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            クライアントとチーム間でのメッセージのやり取り
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>まだメッセージがありません</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'team' ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
                <div className={`flex-1 max-w-[70%] ${message.sender === 'team' ? 'items-end' : ''}`}>
                  <div className="text-xs text-muted-foreground mb-1">
                    {message.senderName} • {message.timestamp}
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      message.sender === 'team'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              placeholder="メッセージを入力..."
              disabled={isSending}
              className="flex-1 px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !messageInput.trim()}
              className="px-6 py-2 flex items-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              送信
            </button>
          </div>
        </div>
      </div>

      {/* Escalation */}
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-card-foreground mb-2">エスカレーション</h3>
            <p className="text-sm text-muted-foreground mb-3">
              問題が発生した場合、マネージャーや上位責任者にエスカレーションできます。
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm">
              <ArrowUp className="w-4 h-4" strokeWidth={2} />
              エスカレーション申請
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchiveTab = () => (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            placeholder="投稿タイトルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm">
          <Filter className="w-4 h-4" strokeWidth={2} />
          フィルター
        </button>
      </div>

      {/* Archive List */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="p-4">
              <h4 className="text-sm text-card-foreground mb-2">クリスマスキャンペーン投稿 #{item}</h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>2025.12.{20 - item}</span>
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-accent rounded-lg hover:bg-accent/80 transition-colors text-xs">
                  <Download className="w-3 h-3" strokeWidth={2} />
                  DL
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-accent rounded-lg hover:bg-accent/80 transition-colors text-xs">
                  <ExternalLink className="w-3 h-3" strokeWidth={2} />
                  表示
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssetsTab = () => (
    <div className="space-y-4">
      {/* Upload Status */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-card-foreground mb-4">素材受領ステータス</h3>
        <div className="space-y-3">
          {[
            { name: '商品画像（12月分）', status: '受領済み', date: '2025.12.15', count: 24 },
            { name: 'ブランドロゴ更新版', status: '受領済み', date: '2025.12.10', count: 3 },
            { name: '1月キャンペーン素材', status: '待機中', date: '期限: 2025.12.25', count: 0 }
          ].map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm text-card-foreground">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">{asset.date} • {asset.count}ファイル</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                asset.status === '受領済み'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {asset.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Links */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-card-foreground mb-4">共有リンク集</h3>
        <div className="space-y-2">
          {[
            { title: 'Googleドライブ（素材フォルダ）', url: 'drive.google.com/...' },
            { title: 'Figmaデザインファイル', url: 'figma.com/file/...' },
            { title: 'Notionブランドガイド', url: 'notion.so/...' }
          ].map((link, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Link className="w-4 h-4 text-primary" strokeWidth={2} />
                <div>
                  <div className="text-sm text-card-foreground">{link.title}</div>
                  <div className="text-xs text-muted-foreground">{link.url}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Update Notifications */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-card-foreground mb-2">差分更新の通知</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded bg-card/50">
                <div className="text-card-foreground mb-1">商品画像が3件追加されました</div>
                <div className="text-xs text-muted-foreground">2時間前</div>
              </div>
              <div className="p-2 rounded bg-card/50">
                <div className="text-card-foreground mb-1">ブランドガイドが更新されました</div>
                <div className="text-xs text-muted-foreground">1日前</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* KPI Dashboard - Top Row */}
            <div className="grid grid-cols-4 gap-4">
              {mockKPIs.map((kpi) => {
                const Icon = kpi.icon;
                const isPositive = kpi.change > 0;
                return (
                  <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                      </div>
                      <span className="text-xs text-muted-foreground">{kpi.label}</span>
                    </div>
                    <div className="text-3xl text-card-foreground mb-2">{kpi.current}</div>
                    <div className="flex items-center gap-1 text-xs">
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" strokeWidth={2} />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-destructive" strokeWidth={2} />
                      )}
                      <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                        {isPositive ? '+' : ''}{kpi.change}%
                      </span>
                      <span className="text-muted-foreground ml-1">({kpi.previous})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar & Approval Center - Middle Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Calendar - Left */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" strokeWidth={2} />
                    投稿カレンダー
                  </h3>
                  <button 
                    onClick={() => setActiveTab('calendar')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    詳細
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                {/* Mini Calendar */}
                <div className="space-y-3">
                  {/* This Week */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">今週の予定</div>
                    {[
                      { day: '12/19', title: '新商品ローンチ投稿', platform: 'Instagram', time: '12:00' },
                      { day: '12/20', title: 'クリスマスセール告知', platform: 'Twitter', time: '15:00' },
                      { day: '12/21', title: '年末挨拶動画', platform: 'TikTok', time: '18:00' }
                    ].map((event, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="text-xs text-muted-foreground min-w-[36px]">{event.day}</div>
                        <div className={`w-1.5 h-1.5 rounded-full ${getPlatformColor(event.platform as any)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-card-foreground truncate">{event.title}</div>
                          <div className="text-xs text-muted-foreground">{event.platform} • {event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg text-card-foreground">8</div>
                      <div className="text-xs text-muted-foreground">今週</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg text-card-foreground">32</div>
                      <div className="text-xs text-muted-foreground">今月</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg text-primary">5</div>
                      <div className="text-xs text-muted-foreground">予定</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Center - Right */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                    承認センター
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">3</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('approval')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    すべて
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  {mockApprovals.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                          {item.type === '動画' ? (
                            <VideoIcon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                          ) : (
                            <FileText className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-card-foreground mb-1 truncate">{item.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="px-1.5 py-0.5 rounded bg-accent">{item.type}</span>
                            <span>•</span>
                            <span>{item.platform}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{item.submittedBy} • {item.submittedDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs">
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                          承認
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent text-card-foreground rounded-lg hover:bg-accent/80 transition-colors text-xs">
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                          差戻し
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Pipeline - Full Width */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-card-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" strokeWidth={2} />
                  進捗管理パイプライン
                </h3>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  詳細表示
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* Pipeline Columns */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { status: 'pending', label: '未着手', tasks: mockTasks.filter(t => t.status === 'pending'), color: 'bg-muted' },
                  { status: 'in-progress', label: '制作中', tasks: mockTasks.filter(t => t.status === 'in-progress'), color: 'bg-blue-500/10' },
                  { status: 'approval', label: '承認待ち', tasks: mockTasks.filter(t => t.status === 'approval'), color: 'bg-amber-500/10' },
                  { status: 'rejected', label: '差戻し', tasks: mockTasks.filter(t => t.status === 'rejected'), color: 'bg-destructive/10' },
                  { status: 'completed', label: '完了', tasks: [], color: 'bg-green-500/10' }
                ].map((column) => (
                  <div key={column.status} className="space-y-2">
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-accent/30">
                      <span className="text-xs text-card-foreground">{column.label}</span>
                      <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task) => (
                        <div key={task.id} className={`p-3 rounded-lg ${column.color} border border-border hover:shadow-sm transition-all cursor-pointer`}>
                          <div className="flex items-start gap-2 mb-2">
                            <div className={`w-6 h-6 rounded ${getPlatformColor(task.platform)} flex items-center justify-center flex-shrink-0`}>
                              <div className="w-3 h-3 bg-white/90 rounded-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-card-foreground line-clamp-2 mb-1">{task.title}</div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="w-3 h-3" strokeWidth={2} />
                                <span>{task.postDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px]">
                              {task.initials}
                            </div>
                            {task.rejectedCount && (
                              <span className="px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive text-[9px]">
                                ×{task.rejectedCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {column.tasks.length === 0 && (
                        <div className="p-4 rounded-lg border-2 border-dashed border-border/50 text-center">
                          <div className="text-xs text-muted-foreground">タスクなし</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposal & Brand Guide - Bottom Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Proposal - Left */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-foreground flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" strokeWidth={2} />
                    企画提案
                  </h3>
                  <button 
                    onClick={() => setActiveTab('proposal')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    すべて
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  {mockProposals.slice(0, 3).map((proposal) => (
                    <div key={proposal.id} className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-card-foreground truncate">{proposal.title}</span>
                            {proposal.status === 'pending' && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] whitespace-nowrap">
                                審議中
                              </span>
                            )}
                            {proposal.status === 'approved' && (
                              <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] whitespace-nowrap">
                                承認
                              </span>
                            )}
                            {proposal.nextMonthTicket && (
                              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] whitespace-nowrap">
                                来月
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{proposal.objective}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{proposal.submittedDate}</div>
                    </div>
                  ))}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg text-amber-600 dark:text-amber-400">1</div>
                      <div className="text-xs text-muted-foreground">審議中</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg text-green-600 dark:text-green-400">1</div>
                      <div className="text-xs text-muted-foreground">承認</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg text-destructive">1</div>
                      <div className="text-xs text-muted-foreground">却下</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Guide - Right */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" strokeWidth={2} />
                    ブランドガイド
                  </h3>
                  <button 
                    onClick={() => setActiveTab('brand')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    詳細
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Tone & Manner */}
                  <div className="p-3 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <span className="text-xs text-muted-foreground">トーン&マナー</span>
                    </div>
                    <p className="text-xs text-card-foreground">親しみやすく、明るく前向きな表現。専門用語は避け、わかりやすい言葉選び。</p>
                  </div>

                  {/* NG Keywords */}
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-destructive" strokeWidth={2} />
                      </div>
                      <span className="text-xs text-muted-foreground">NG表現</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['他社比較', '効果断定', 'ネガティブ表現'].map((ng, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px]">
                          {ng}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Platform Guidelines */}
                  <div className="p-3 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <span className="text-xs text-muted-foreground">素材規定</span>
                    </div>
                    <div className="space-y-1 text-[10px] text-card-foreground">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Instagram:</span>
                        <span>1080×1080px</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">TikTok:</span>
                        <span>9:16 縦型</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ブランドカラー:</span>
                        <span>#FF69B4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'basicInfo':
        return (
          <div className="space-y-6">
            {/* PALSS AI URL発行 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
              <h2 className="text-card-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={2} />
                PALSS AI ヒアリング
              </h2>
              <button
                onClick={handleGenerateAIUrl}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="font-medium">PALSS AI ヒアリングURL発行</span>
                <ExternalLink className="w-4 h-4 opacity-70" strokeWidth={2} />
              </button>

              {generatedUrl && (
                <div className="mt-4 bg-card rounded-xl p-4 border border-border animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">生成されたヒアリングURL</p>
                      <p className="text-sm text-foreground font-mono truncate">{generatedUrl}</p>
                    </div>
                    <button
                      onClick={handleCopyUrl}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isCopied
                          ? 'bg-chart-2/10 text-chart-2'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={2} />
                          <span className="text-sm font-medium">コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" strokeWidth={2} />
                          <span className="text-sm font-medium">コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 基本情報 & 進捗状況 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 基本情報 */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-card-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" strokeWidth={2} />
                  <span>基本情報</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">会社名</span>
                    <span className="text-sm text-card-foreground font-medium">{clientData.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">業種</span>
                    <span className="text-sm text-card-foreground">{clientData.industry}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">担当者</span>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                      <span className="text-sm text-card-foreground">{clientData.contactPerson}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">メール</span>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                      <span className="text-sm text-primary">{clientData.contactEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">電話番号</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                      <span className="text-sm text-card-foreground">{clientData.contactPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">契約日</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                      <span className="text-sm text-card-foreground">{clientData.contractStart}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 進捗状況 */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-card-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2} />
                  <span>進捗状況</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">オンボーディング進捗</span>
                      <span className="text-sm text-foreground font-medium">65%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                        style={{ width: '65%' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">契約年数</span>
                    <span className="text-sm text-card-foreground font-medium">1年目</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">月間投稿数</span>
                    <span className="text-sm text-card-foreground font-medium">{clientData.monthlyPosts}件</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">進行中タスク</span>
                    <span className="text-sm text-primary font-medium">{clientData.activeTasks}件</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 今後のアクティビティ */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-card-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" strokeWidth={2} />
                <span>今後のアクティビティ</span>
              </h2>
              <div className="space-y-2">
                {[
                  { id: 1, title: '運用開始ガイド', date: '2025.12.20 金', status: '資料準備' },
                  { id: 2, title: 'キックオフミーティングの準備', date: '2025.12.22 日', status: '資料準備' },
                  { id: 3, title: '初期ヘルスチェック', date: '2025.12.24 火', status: '予定' },
                  { id: 4, title: 'SNSアカウントのデータ統合', date: '2025.12.26 木', status: '予定' },
                ].map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm text-foreground">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                    </div>
                    {activity.status && (
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                        {activity.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PALSSヒアリングの結果レポート */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-card-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
                  <span>PALSSヒアリングの結果レポート</span>
                </h2>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-chart-2/10">
                  <CheckCircle2 className="w-4 h-4 text-chart-2" strokeWidth={2} />
                  <span className="text-xs text-chart-2">完了</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: '1', title: '会社概要', content: 'IT企業として、最新のテクノロジーソリューションを提供しています。' },
                  { id: '2', title: 'ブランド/提供価値', content: '革新的で信頼性の高いソリューションを通じて、顧客のビジネスを加速します。' },
                  { id: '3', title: '事業課題', content: '市場での認知度向上とリード獲得の最適化が必要です。' },
                  { id: '4', title: '主要目標/成功の定義', content: '6ヶ月以内にフォロワー数20%増加、エンゲージメント率5%以上を達成します。' },
                  { id: '5', title: 'ターゲット層', content: '25-45歳のビジネスパーソン、テクノロジーに関心のある経営者層。' },
                  { id: '6', title: 'コンテンツの方向性', content: '技術トレンド、業界インサイト、成功事例、製品デモを中心に展開します。' },
                  { id: '7', title: '現在のアカウント', content: '@sample_official - 現在フォロワー数15.2K' },
                  { id: '8', title: '競合の認識', content: '主要競合3社を分析済み。差別化ポイントを明確化しました。' },
                  { id: '9', title: '好みのトーン/スタイル', content: 'プロフェッショナルでありながら親しみやすく、革新的な印象を重視。' },
                  { id: '10', title: '使用したくないテーマ', content: '過度なセールス色、技術的すぎる専門用語の多用を避けます。' },
                ].map((section) => (
                  <div
                    key={section.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer bg-accent/20"
                  >
                    <div className="text-sm text-foreground font-medium mb-2">{section.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{section.content}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SNSプラットフォーム */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-card-foreground mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" strokeWidth={2} />
                <span>連携プラットフォーム</span>
              </h2>
              <div className="flex items-center gap-3">
                {clientData.platforms.map((platform) => (
                  <div
                    key={platform}
                    className={`px-4 py-2 rounded-lg ${getPlatformColor(platform)} text-white flex items-center gap-2`}
                  >
                    <div className="w-4 h-4 bg-white/90 rounded" />
                    <span className="text-sm">{platform}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'progress':
        return renderProgressTab();
      case 'calendar':
        return renderCalendarTab();
      case 'approval':
        return renderApprovalTab();
      case 'report':
        return renderReportTab();
      case 'proposal':
        return renderProposalTab();
      case 'brand':
        return renderBrandTab();
      case 'contract':
        return renderContractTab();
      case 'communication':
        return renderCommunicationTab();
      case 'archive':
        return renderArchiveTab();
      case 'assets':
        return renderAssetsTab();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Modal */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => {
          setIsContractModalOpen(false);
          setEditingContract(null);
        }}
        onSave={handleSaveContract}
        contract={editingContract}
        clientId={clientId || ''}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl text-card-foreground mb-1">{clientData.name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{clientData.industry}</span>
            <span>•</span>
            <span>契約開始: {clientData.contractStart}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              {clientData.platforms.map((platform) => (
                <div 
                  key={platform}
                  className={`w-6 h-6 rounded-full ${getPlatformColor(platform)} flex items-center justify-center`}
                  title={platform}
                >
                  <div className="w-3 h-3 bg-white/90 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-card rounded-xl border border-border p-2 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-card-foreground'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}
