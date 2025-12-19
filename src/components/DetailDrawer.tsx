import { X, Calendar, User, Tag, Building2, FileText, TrendingUp, Package, ExternalLink, Clock, CheckCircle, XCircle, UserPlus, RotateCcw, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    clientName: string;
    status: string;
    deadline: string;
    assignee: string;
    type?: string;
    priority?: string;
    description?: string;
    contractValue?: string;
    kpi?: {
      label: string;
      value: string;
    }[];
    deliverables?: string[];
    relatedLinks?: {
      label: string;
      url: string;
    }[];
  };
}

export function DetailDrawer({ isOpen, onClose, data }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'files' | 'comments' | 'actions'>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'files', label: 'Files' },
    { id: 'comments', label: 'Comments' },
    { id: 'actions', label: 'Actions' },
  ] as const;

  const timeline = [
    { id: '1', date: '2024/12/14 14:30', action: 'ステータス更新', user: '田中太郎', detail: '提案資料作成中 → レビュー待ち' },
    { id: '2', date: '2024/12/14 10:15', action: 'コメント追加', user: '佐藤花子', detail: '資料の構成について確認が必要です' },
    { id: '3', date: '2024/12/13 16:45', action: 'ファイル追加', user: '田中太郎', detail: '提案資料_draft_v2.pptx' },
    { id: '4', date: '2024/12/13 11:20', action: 'タスク作成', user: '鈴木一郎', detail: 'AXAS社への提案資料作成' },
  ];

  const files = [
    { id: '1', name: '提案資料_draft_v2.pptx', size: '2.4 MB', uploadedBy: '田中太郎', uploadedAt: '2024/12/13 16:45' },
    { id: '2', name: 'ヒアリングシート.pdf', size: '856 KB', uploadedBy: '佐藤花子', uploadedAt: '2024/12/12 14:20' },
    { id: '3', name: '見積書.xlsx', size: '124 KB', uploadedBy: '鈴木一郎', uploadedAt: '2024/12/11 10:30' },
  ];

  const comments = [
    { id: '1', user: '佐藤花子', avatar: '佐', time: '2時間前', text: '資料の構成について、もう少しビジュアルを追加した方が良いかもしれません。' },
    { id: '2', user: '田中太郎', avatar: '田', time: '5時間前', text: '提案資料のドラフトv2をアップロードしました。ご確認お願いします。' },
    { id: '3', user: '鈴木一郎', avatar: '鈴', time: '1日前', text: 'ヒアリングの結果、予算は500万円程度とのことです。' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case '進行中':
      case 'in progress':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      case '完了':
      case 'completed':
        return 'bg-[#D1FAE5] text-[#059669]';
      case '保留':
      case 'on hold':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case '期限切れ':
      case 'overdue':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-[#F3F4F6] text-[#6B7280]';
    switch (priority.toLowerCase()) {
      case 'high':
      case '高':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'medium':
      case '中':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'low':
      case '低':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <>
      {/* Overlay背景 */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#E5E7EB] p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-[#111827] mb-2 truncate">{data.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
                {data.priority && (
                  <span className={`px-2.5 py-1 rounded-full text-xs ${getPriorityColor(data.priority)}`}>
                    優先度: {data.priority}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              <X className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
          </div>

          {/* Meta情報 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
              <span className="text-[#7B8794]">クライアント:</span>
              <span className="text-[#111827] truncate">{data.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
              <span className="text-[#7B8794]">担当:</span>
              <span className="text-[#111827] truncate">{data.assignee}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
              <span className="text-[#7B8794]">期限:</span>
              <span className="text-[#DC2626]">{data.deadline}</span>
            </div>
            {data.type && (
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                <span className="text-[#7B8794]">種別:</span>
                <span className="text-[#111827] truncate">{data.type}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-[#E5E7EB] px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#0C8A5F]'
                    : 'text-[#7B8794] hover:text-[#111827]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0C8A5F]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 説明 */}
              {data.description && (
                <div>
                  <h4 className="text-sm text-[#7B8794] mb-2">説明</h4>
                  <p className="text-sm text-[#111827]">{data.description}</p>
                </div>
              )}

              {/* 契約情報 */}
              {data.contractValue && (
                <div>
                  <h4 className="text-sm text-[#7B8794] mb-2">契約金額</h4>
                  <p className="text-xl text-[#111827]">{data.contractValue}</p>
                </div>
              )}

              {/* KPI */}
              {data.kpi && data.kpi.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <h4 className="text-sm text-[#7B8794]">関連KPI</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {data.kpi.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-[#F5F5F7]">
                        <div className="text-xs text-[#7B8794] mb-1">{item.label}</div>
                        <div className="text-lg text-[#111827]">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 納品物 */}
              {data.deliverables && data.deliverables.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <h4 className="text-sm text-[#7B8794]">納品物</h4>
                  </div>
                  <ul className="space-y-2">
                    {data.deliverables.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-[#111827]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0C8A5F]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 関連リンク */}
              {data.relatedLinks && data.relatedLinks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <h4 className="text-sm text-[#7B8794]">関連リンク</h4>
                  </div>
                  <div className="space-y-2">
                    {data.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors text-sm text-[#0C8A5F] group"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="group-hover:underline">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0C8A5F] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-[#E5E7EB] mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#111827]">{item.action}</span>
                      <span className="text-xs text-[#7B8794]">by {item.user}</span>
                    </div>
                    <p className="text-sm text-[#7B8794] mb-1">{item.detail}</p>
                    <span className="text-xs text-[#9CA3AF]">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group"
                >
                  <FileText className="w-10 h-10 text-[#0C8A5F]" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#111827] mb-0.5 truncate">{file.name}</div>
                    <div className="flex items-center gap-2 text-xs text-[#7B8794]">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                </div>
              ))}
              <button className="w-full p-3 rounded-lg border-2 border-dashed border-[#E5E7EB] hover:border-[#0C8A5F] hover:bg-[#F5F5F7] transition-all text-sm text-[#7B8794] hover:text-[#0C8A5F]">
                + ファイルを追加
              </button>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0C8A5F] text-white flex items-center justify-center text-xs flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#111827]">{comment.user}</span>
                      <span className="text-xs text-[#7B8794]">{comment.time}</span>
                    </div>
                    <p className="text-sm text-[#7B8794] p-3 bg-[#F5F5F7] rounded-lg">{comment.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#7B8794] text-white flex items-center justify-center text-xs flex-shrink-0">
                  You
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="コメントを追加..."
                    className="w-full p-3 border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-[#0C8A5F] text-white rounded-lg hover:bg-[#0A7550] transition-colors text-sm">
                      投稿
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#D1FAE5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                  <CheckCircle className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#111827] mb-0.5">完了にする</div>
                  <div className="text-xs text-[#7B8794]">タスクを完了としてマーク</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#111827] mb-0.5">期限を延期</div>
                  <div className="text-xs text-[#7B8794]">新しい期限を設定</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DBEAFE] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <UserPlus className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#111827] mb-0.5">担当者を変更</div>
                  <div className="text-xs text-[#7B8794]">別の担当者にアサイン</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FEE2E2] text-[#DC2626] group-hover:bg-[#DC2626] group-hover:text-white transition-colors">
                  <RotateCcw className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#111827] mb-0.5">差し戻し</div>
                  <div className="text-xs text-[#7B8794]">前のステップに戻す</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] hover:shadow-md transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#0C8A5F] group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-[#111827] mb-0.5">コメントを追加</div>
                  <div className="text-xs text-[#7B8794]">メモや指示を残す</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#0C8A5F] to-[#059669] text-white hover:shadow-lg transition-all group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                  <Plus className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm mb-0.5">次のアクションを作成</div>
                  <div className="text-xs text-white/80">新しいタスクを追加</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
