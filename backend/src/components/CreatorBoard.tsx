import { Calendar, MapPin, Clock, User, Video, CheckCircle2, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

interface Shoot {
  id: string;
  projectName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  director: string;
  editor: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'done';
  mustShots: string[];
  concept: string;
}

export function CreatorBoard() {
  const todaysShoots: Shoot[] = [
    {
      id: '1',
      projectName: '採用ブランディング動画',
      clientName: 'デジタルフロンティア株式会社',
      date: '2024/12/10',
      startTime: '10:00',
      endTime: '15:00',
      location: '渋谷オフィス（渋谷区道玄坂1-2-3）',
      type: 'インタビュー / オフィス撮影',
      director: '山田太郎',
      editor: '佐藤花子',
      status: 'confirmed',
      mustShots: [
        'CEO インタビュー（3分）',
        'チームメンバーの働く様子（自然光で）',
        'オフィス全景（エントランス、執務室、ミーティングルーム）',
      ],
      concept: '「挑戦を楽しむチーム」温かみのあるドキュメンタリータッチ',
    },
  ];

  const upcomingShoots: Shoot[] = [
    {
      id: '2',
      projectName: '12月キャンペーン動画',
      clientName: 'クリエイティブワークス',
      date: '2024/12/12',
      startTime: '09:00',
      endTime: '13:00',
      location: '代官山スタジオA',
      type: '商品撮影',
      director: '鈴木一郎',
      editor: '田中次郎',
      status: 'scheduled',
      mustShots: [
        '商品単体のクローズアップ',
        '商品を使用するシーン（手元のみ）',
        'ライフスタイルイメージ（背景ボケ）',
      ],
      concept: '「日常の中の小さなラグジュアリー」シネマティックで洗練された質感',
    },
    {
      id: '3',
      projectName: '店舗紹介動画',
      clientName: 'グローバルソリューションズ',
      date: '2024/12/14',
      startTime: '14:00',
      endTime: '18:00',
      location: '表参道店舗（港区南青山3-4-5）',
      type: '店舗撮影',
      director: '高橋三郎',
      editor: '伊藤美咲',
      status: 'scheduled',
      mustShots: [
        '店舗外観（正面、サイド）',
        '店内の雰囲気（客席、カウンター）',
        'スタッフの接客シーン',
      ],
      concept: '「心地よい空間と丁寧なサービス」自然光を活かした明るく温かい映像',
    },
    {
      id: '4',
      projectName: 'プロモーション動画',
      clientName: 'テックイノベーション',
      date: '2024/12/16',
      startTime: '11:00',
      endTime: '16:00',
      location: '品川オフィス',
      type: 'ドキュメンタリー',
      director: '山田太郎',
      editor: '佐藤花子',
      status: 'scheduled',
      mustShots: [
        '開発チームの作業風景',
        '製品デモシーン',
        '経営陣インタビュー',
      ],
      concept: '「テクノロジーで未来を創る」躍動感とスピード感のある映像',
    },
  ];

  const statusConfig = {
    scheduled: { label: '予定', color: 'bg-[#E5E7EB] text-[#52606D]', icon: Calendar },
    confirmed: { label: '確定', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
    'in-progress': { label: '撮影中', color: 'bg-[#FEF3C7] text-[#D97706]', icon: AlertCircle },
    done: { label: '完了', color: 'bg-[#E0E7FF] text-[#4F46E5]', icon: CheckCircle2 },
  };

  return (
    <div className="space-y-8">
      {/* Today's Shoots */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-[#0C8A5F]" strokeWidth={2} />
          <h2 className="text-[#1F2933] text-xl">今日の撮影</h2>
          <span className="px-3 py-1 bg-[#0C8A5F] text-white rounded-full text-sm">
            {todaysShoots.length}件
          </span>
        </div>

        {todaysShoots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <Calendar className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-[#7B8794]">今日の撮影予定はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysShoots.map((shoot) => {
              const statusInfo = statusConfig[shoot.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={shoot.id}
                  className="bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-2xl p-8 text-white shadow-[0_8px_16px_0_rgba(12,138,95,0.2)]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl">{shoot.projectName}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" strokeWidth={2} />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-white/80 text-lg mb-2">{shoot.clientName}</p>
                      <p className="text-white/60 text-sm">{shoot.type}</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                      <span className="text-sm">詳細を見る</span>
                      <ChevronRight className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <div className="text-white/60 text-xs mb-1">時間</div>
                        <div className="text-lg">{shoot.startTime} - {shoot.endTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <div className="text-white/60 text-xs mb-1">場所</div>
                        <div className="text-sm">{shoot.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <div className="text-white/60 text-xs mb-1">担当チーム</div>
                        <div className="text-sm">D: {shoot.director}</div>
                        <div className="text-sm">E: {shoot.editor}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5" strokeWidth={2} />
                      <h4 className="text-sm">コンセプト</h4>
                    </div>
                    <p className="text-white/90 text-sm mb-4">{shoot.concept}</p>
                    <div className="mb-2 text-xs text-white/60">マストショット</div>
                    <ul className="space-y-2">
                      {shoot.mustShots.map((shot, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/80" strokeWidth={2} />
                          <span>{shot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Shoots */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
          <h2 className="text-[#1F2933] text-xl">近日の撮影予定</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {upcomingShoots.map((shoot) => {
            const statusInfo = statusConfig[shoot.status];
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={shoot.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#1F2933] text-lg mb-2 group-hover:text-[#0C8A5F] transition-colors">
                      {shoot.projectName}
                    </h3>
                    <p className="text-[#7B8794] text-sm mb-1">{shoot.clientName}</p>
                    <p className="text-[#9CA3AF] text-xs">{shoot.type}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusInfo.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#52606D]">
                    <Calendar className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                    <span>{shoot.date}</span>
                    <span className="text-[#9CA3AF]">•</span>
                    <span>{shoot.startTime} - {shoot.endTime}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#52606D]">
                    <MapPin className="w-4 h-4 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="line-clamp-1">{shoot.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F3F4F6]">
                  <div className="text-xs text-[#7B8794] mb-2">マストショット（{shoot.mustShots.length}件）</div>
                  <ul className="space-y-1">
                    {shoot.mustShots.slice(0, 2).map((shot, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-[#52606D]">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5 text-[#9CA3AF]" strokeWidth={2} />
                        <span className="line-clamp-1">{shot}</span>
                      </li>
                    ))}
                    {shoot.mustShots.length > 2 && (
                      <li className="text-xs text-[#9CA3AF] pl-5">
                        +{shoot.mustShots.length - 2}件
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <button className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all text-left group">
          <Calendar className="w-8 h-8 text-[#0C8A5F] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <h3 className="text-[#1F2933] mb-1">撮影カレンダー</h3>
          <p className="text-[#7B8794] text-sm">月間スケジュールを確認</p>
        </button>
        <button className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all text-left group">
          <Video className="w-8 h-8 text-[#4F46E5] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <h3 className="text-[#1F2933] mb-1">プロジェクト一覧</h3>
          <p className="text-[#7B8794] text-sm">全プロジェクトを確認</p>
        </button>
        <button className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all text-left group">
          <Sparkles className="w-8 h-8 text-[#D97706] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <h3 className="text-[#1F2933] mb-1">素材アップロード</h3>
          <p className="text-[#7B8794] text-sm">撮影素材をアップロード</p>
        </button>
      </div>
    </div>
  );
}