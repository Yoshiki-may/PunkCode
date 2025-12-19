import { Calendar, Users, FileText, CheckSquare, Paperclip, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Meeting {
  id: string;
  date: string;
  title: string;
  type: string;
  participants: string[];
  duration: string;
  hasAISummary: boolean;
  hasTasks: boolean;
  hasAttachments: boolean;
}

interface MeetingDetail {
  summary: string[];
  undecided: string[];
  transcript: string;
  tasks: Array<{
    id: string;
    title: string;
    assignedTo: 'PALSS' | 'Client';
    dueDate: string;
    status: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

export function MeetingMinutes() {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'tasks' | 'attachments'>('summary');

  const meetings: Meeting[] = [
    {
      id: '1',
      date: '2024/12/10',
      title: '12月度 月次レポート会議',
      type: 'レポート会',
      participants: ['REONA', '山田ディレクター', '田中様（クライアント）', '佐藤様（クライアント）'],
      duration: '1時間',
      hasAISummary: true,
      hasTasks: true,
      hasAttachments: true,
    },
    {
      id: '2',
      date: '2024/12/05',
      title: '新規キャンペーン企画会議',
      type: '企画会議',
      participants: ['REONA', '佐藤編集', '田中様（クライアント）'],
      duration: '1時間30分',
      hasAISummary: true,
      hasTasks: true,
      hasAttachments: true,
    },
    {
      id: '3',
      date: '2024/11/28',
      title: '撮影前打ち合わせ',
      type: '撮影前打ち合わせ',
      participants: ['山田ディレクター', '佐藤編集', '田中様（クライアント）', '鈴木様（クライアント）'],
      duration: '45分',
      hasAISummary: true,
      hasTasks: true,
      hasAttachments: false,
    },
    {
      id: '4',
      date: '2024/11/15',
      title: 'Q4振り返りミーティング',
      type: '振り返り',
      participants: ['REONA', '山田ディレクター', '田中様（クライアント）'],
      duration: '2時間',
      hasAISummary: true,
      hasTasks: false,
      hasAttachments: true,
    },
    {
      id: '5',
      date: '2024/11/01',
      title: 'キックオフミーティング（11月分）',
      type: 'キックオフ',
      participants: ['REONA', '山田ディレクター', '佐藤編集', '田中様（クライアント）', '佐藤様（クライアント）'],
      duration: '1時間',
      hasAISummary: true,
      hasTasks: true,
      hasAttachments: true,
    },
  ];

  const meetingDetails: Record<string, MeetingDetail> = {
    '1': {
      summary: [
        '11月の動画パフォーマンスは前月比+18%と好調',
        'Instagram Reelsのエンゲージメント率が特に高い（平均4.2%）',
        '12月のクリスマスキャンペーン用に3本の動画制作を追加発注',
        'TikTok展開を来年1月から本格スタートすることで合意',
      ],
      undecided: [
        '1月のTikTok運用の詳細スケジュール（次回MTGで確定）',
        '新規採用動画の予算配分（経理部門と調整中）',
      ],
      transcript: `
[14:00] REONA: 本日は11月の月次レポートについてご説明させていただきます。まず全体のサマリーですが...

[14:05] 田中様: なるほど。前月比で18%増というのは想定以上の成果ですね。要因は何でしょうか？

[14:07] REONA: はい、主な要因は2つございます。1つ目はInstagram Reelsでのエンゲージメント率の向上...

[14:15] 佐藤様: TikTokについてもう少し詳しく聞きたいのですが...

[続く...]
      `,
      tasks: [
        {
          id: 't1',
          title: 'クリスマスキャンペーン動画3本の撮影・編集',
          assignedTo: 'PALSS',
          dueDate: '2024/12/20',
          status: '進行中',
        },
        {
          id: 't2',
          title: 'TikTokアカウント開設手続き',
          assignedTo: 'Client',
          dueDate: '2024/12/15',
          status: '未着手',
        },
        {
          id: 't3',
          title: '1月のTikTok運用スケジュール案の作成',
          assignedTo: 'PALSS',
          dueDate: '2024/12/18',
          status: '未着手',
        },
      ],
      attachments: [
        {
          name: '11月度_月次レポート.pdf',
          type: 'PDF',
          url: '#',
        },
        {
          name: '12月施策_提案資料.pdf',
          type: 'PDF',
          url: '#',
        },
      ],
    },
  };

  const selectedMeetingData = meetings.find(m => m.id === selectedMeeting);
  const selectedMeetingDetail = selectedMeeting ? meetingDetails[selectedMeeting] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">議事録・打ち合わせログ</h1>
        <p className="text-[#7B8794]">過去のミーティング内容を確認</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Meeting List */}
        <div className="col-span-1 space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting.id)}
              className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all ${
                selectedMeeting === meeting.id
                  ? 'border-[#0C8A5F] shadow-[0_0_0_3px_rgba(12,138,95,0.1)]'
                  : 'border-[#E5E7EB] hover:border-[#0C8A5F] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#7B8794] text-xs mb-1">{meeting.date}</div>
                  <h3 className="text-[#1F2933] text-sm line-clamp-2">{meeting.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#E0E7FF] text-[#4F46E5] rounded-full text-xs">
                  {meeting.type}
                </span>
                <span className="text-[#7B8794] text-xs">{meeting.duration}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#7B8794]">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" strokeWidth={2} />
                  {meeting.participants.length}名
                </div>
                {meeting.hasAISummary && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                    AI要約
                  </div>
                )}
                {meeting.hasTasks && (
                  <div className="flex items-center gap-1 text-[#0C8A5F]">
                    <CheckSquare className="w-3.5 h-3.5" strokeWidth={2} />
                    ToDo
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Meeting Detail */}
        <div className="col-span-2">
          {selectedMeetingData && selectedMeetingDetail ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              {/* Header */}
              <div className="p-8 border-b border-[#E5E7EB]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-[#1F2933] mb-2">{selectedMeetingData.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-[#7B8794]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" strokeWidth={2} />
                        {selectedMeetingData.date}
                      </div>
                      <div>{selectedMeetingData.duration}</div>
                      <span className="px-3 py-1 bg-[#E0E7FF] text-[#4F46E5] rounded-full text-xs">
                        {selectedMeetingData.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Users className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                  <span className="text-[#7B8794] text-sm">参加者:</span>
                  {selectedMeetingData.participants.map((participant, index) => (
                    <span key={index} className="px-2.5 py-1 bg-[#F3F4F6] text-[#52606D] rounded-full text-xs">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="px-8 pt-6 border-b border-[#E5E7EB]">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`pb-4 px-1 border-b-2 transition-all ${
                      activeTab === 'summary'
                        ? 'border-[#0C8A5F] text-[#0C8A5F]'
                        : 'border-transparent text-[#7B8794] hover:text-[#52606D]'
                    }`}
                  >
                    要約
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`pb-4 px-1 border-b-2 transition-all ${
                      activeTab === 'transcript'
                        ? 'border-[#0C8A5F] text-[#0C8A5F]'
                        : 'border-transparent text-[#7B8794] hover:text-[#52606D]'
                    }`}
                  >
                    議事録詳細
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`pb-4 px-1 border-b-2 transition-all ${
                      activeTab === 'tasks'
                        ? 'border-[#0C8A5F] text-[#0C8A5F]'
                        : 'border-transparent text-[#7B8794] hover:text-[#52606D]'
                    }`}
                  >
                    ToDo & タスク
                  </button>
                  <button
                    onClick={() => setActiveTab('attachments')}
                    className={`pb-4 px-1 border-b-2 transition-all ${
                      activeTab === 'attachments'
                        ? 'border-[#0C8A5F] text-[#0C8A5F]'
                        : 'border-transparent text-[#7B8794] hover:text-[#52606D]'
                    }`}
                  >
                    添付資料
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[#1F2933] mb-4 flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
                        決定事項
                      </h3>
                      <ul className="space-y-3">
                        {selectedMeetingDetail.summary.map((item, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="w-6 h-6 bg-[#C5F3E5] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckSquare className="w-4 h-4 text-[#0C8A5F]" strokeWidth={2} />
                            </div>
                            <span className="text-[#52606D]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedMeetingDetail.undecided.length > 0 && (
                      <div className="pt-6 border-t border-[#F3F4F6]">
                        <h3 className="text-[#1F2933] mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-[#D97706]" strokeWidth={2} />
                          未決定事項
                        </h3>
                        <ul className="space-y-3">
                          {selectedMeetingDetail.undecided.map((item, index) => (
                            <li key={index} className="flex gap-3">
                              <div className="w-6 h-6 bg-[#FEF3C7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MessageSquare className="w-4 h-4 text-[#D97706]" strokeWidth={2} />
                              </div>
                              <span className="text-[#52606D]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div>
                    <div className="p-5 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB]">
                      <pre className="text-[#52606D] text-sm whitespace-pre-wrap font-sans">
                        {selectedMeetingDetail.transcript}
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div className="space-y-3">
                    {selectedMeetingDetail.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-5 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-[#1F2933]">{task.title}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              task.assignedTo === 'PALSS'
                                ? 'bg-[#E0E7FF] text-[#4F46E5]'
                                : 'bg-[#C5F3E5] text-[#0C8A5F]'
                            }`}
                          >
                            {task.assignedTo === 'PALSS' ? 'PALSS担当' : 'クライアント担当'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#7B8794]">
                          <div>期限: {task.dueDate}</div>
                          <div>ステータス: {task.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div className="space-y-3">
                    {selectedMeetingDetail.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-5 bg-[#FAFBFC] rounded-xl border border-[#E5E7EB] hover:border-[#0C8A5F] transition-all cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-[#E0E7FF] rounded-xl flex items-center justify-center">
                          <Paperclip className="w-6 h-6 text-[#4F46E5]" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[#1F2933]">{file.name}</div>
                          <div className="text-[#7B8794] text-sm">{file.type}</div>
                        </div>
                        <button className="px-4 py-2 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all text-sm">
                          ダウンロード
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <Calendar className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[#7B8794]">左側からミーティングを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
