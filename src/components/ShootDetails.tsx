import { Calendar, MapPin, Clock, User, Target, Lightbulb, Video, Sparkles, CheckCircle2, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function ShootDetails() {
  const [comments, setComments] = useState([
    {
      id: '1',
      user: '山田太郎（ディレクター）',
      message: 'CEOインタビューは自然光が入る会議室Aで撮影予定です。事前に照明チェックお願いします。',
      timestamp: '2024/12/08 14:30',
    },
    {
      id: '2',
      user: '佐藤花子（編集者）',
      message: '了解しました。チームメンバーの働く様子は、特に手元の作業シーンを多めに撮影してください。',
      timestamp: '2024/12/08 15:15',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [showAISummary, setShowAISummary] = useState(false);

  const shoot = {
    id: '1',
    projectName: '採用ブランディング動画',
    clientName: 'デジタルフロンティア株式会社',
    brandName: 'デジタルフロンティア',
    date: '2024/12/10',
    startTime: '10:00',
    endTime: '15:00',
    location: '渋谷オフィス（渋谷区道玄坂1-2-3 フロンティアビル 5F）',
    type: 'インタビュー / オフィス撮影',
    director: '山田太郎',
    editor: '佐藤花子',
    status: 'confirmed',
    purpose: '採用強化',
    goal: '応募数を月10件以上に増加させる',
    concept: '「挑戦を楽しむチーム」温かみのあるドキュメンタリータッチで、働く人の表情と日常を切り取る。',
    keywords: ['ドキュメンタリー', '自然光', 'リアルな日常', '温かみ', '手持ち撮影'],
    mustShots: [
      'CEO インタビュー（3分程度、会議室Aで自然光を活かす）',
      'チームメンバーの働く様子（特に手元作業、会話シーン）',
      'オフィス全景（エントランス、執務室、ミーティングルーム）',
      'ランチタイムや休憩中のリラックスした様子',
      '窓から見える景色（オフィスの開放感を演出）',
    ],
    ngItems: [
      '特定メンバーの顔（事前にリスト共有）',
      '社外秘資料が映り込む角度',
      '整理されていないデスク周り',
    ],
    references: [
      {
        id: '1',
        title: '過去制作：テックスタートアップ採用動画',
        url: 'https://youtube.com/example1',
        type: 'internal',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        tags: ['インタビュー', 'ドキュメンタリー', 'オフィス'],
      },
      {
        id: '2',
        title: 'リファレンス：Slack - Work in Progress',
        url: 'https://youtube.com/example2',
        type: 'external',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
        tags: ['ドキュメンタリー', '自然光', '日常'],
      },
      {
        id: '3',
        title: 'リファレンス：Notion - Make it Yours',
        url: 'https://youtube.com/example3',
        type: 'external',
        thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
        tags: ['温かみ', 'リアル', '多様性'],
      },
    ],
  };

  const aiSummary = {
    cameraWork: '手持ち撮影が多く、被写体に寄って臨場感を出す。固定カメラは全景や引きのシーンのみ。',
    composition: '人物のアップ（表情重視）とミディアムショット（作業シーン）が中心。ロングショットは空間の広がりを見せる時のみ。',
    lighting: '自然光を最大限活用。窓際での撮影が多く、柔らかく温かい光を意識。補助照明は最小限。',
    colorTone: '暖色系で統一。フラットな色味ではなく、少しコントラストを効かせて立体感を出す。',
    movement: '被写体の動きに合わせてカメラも動く。会話シーンでは自然なパン。固定は避ける。',
    summary: 'この案件では「日常のリアル感」が最重要。手持ちで被写体に寄り、自然光を活かしながら会話・仕草をそのまま切り取る方向でお願いします。作られた感じではなく、その場の空気感をそのまま映像に残すイメージです。',
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: String(comments.length + 1),
      user: 'カメラマン（あなた）',
      message: newComment,
      timestamp: new Date().toLocaleString('ja-JP'),
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">{shoot.projectName}</h1>
        <p className="text-[#7B8794]">{shoot.clientName}</p>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] rounded-2xl p-8 text-white shadow-[0_8px_16px_0_rgba(12,138,95,0.2)]">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-white/60 text-xs mb-1">撮影日時</div>
                <div className="text-lg">{shoot.date}</div>
                <div className="text-sm text-white/80">{shoot.startTime} - {shoot.endTime}</div>
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
              <Video className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-white/60 text-xs mb-1">撮影種別</div>
                <div className="text-sm">{shoot.type}</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-white/60 text-xs mb-1">担当チーム</div>
                <div className="text-sm">ディレクター: {shoot.director}</div>
                <div className="text-sm">編集者: {shoot.editor}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-white/60 text-xs mb-1">目的・ゴール</div>
                <div className="text-sm">{shoot.purpose}</div>
                <div className="text-sm text-white/80">{shoot.goal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Concept & Keywords */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-[#D97706]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">コンセプト</h3>
          </div>
          <p className="text-[#52606D] mb-6 leading-relaxed">{shoot.concept}</p>
          <div className="mb-2 text-sm text-[#7B8794]">キーワード</div>
          <div className="flex flex-wrap gap-2">
            {shoot.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Must Shots */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#0C8A5F]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">マストショット</h3>
          </div>
          <ul className="space-y-3">
            {shoot.mustShots.map((shot, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0C8A5F] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-[#52606D] text-sm">{shot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* NG Items */}
      <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-[#DC2626]" strokeWidth={2} />
          <h3 className="text-[#DC2626]">撮影時の注意事項（NG）</h3>
        </div>
        <ul className="space-y-2">
          {shoot.ngItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-[#DC2626] text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* References */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="p-8 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
              <h3 className="text-[#1F2933]">ロールモデル & リファレンス</h3>
            </div>
            <button
              onClick={() => setShowAISummary(!showAISummary)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm">AIで要約</span>
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {shoot.references.map((ref) => (
              <div
                key={ref.id}
                className="border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all group"
              >
                <div className="relative aspect-video bg-[#1F2933]">
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/90 hover:bg-white text-[#1F2933] rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={2} />
                      開く
                    </a>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                      ref.type === 'internal'
                        ? 'bg-[#0C8A5F] text-white'
                        : 'bg-[#4F46E5] text-white'
                    }`}>
                      {ref.type === 'internal' ? '自社実績' : 'リファレンス'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[#1F2933] text-sm mb-3 line-clamp-2">{ref.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {ref.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-[#F3F4F6] text-[#52606D] rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          {showAISummary && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" strokeWidth={2} />
                <h4 className="text-[#1F2933]">AIからの撮影ブリーフ</h4>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-purple-600 mb-1">カメラワーク</div>
                  <p className="text-[#52606D] text-sm">{aiSummary.cameraWork}</p>
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">画角・構図</div>
                  <p className="text-[#52606D] text-sm">{aiSummary.composition}</p>
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">光の使い方</div>
                  <p className="text-[#52606D] text-sm">{aiSummary.lighting}</p>
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">色味</div>
                  <p className="text-[#52606D] text-sm">{aiSummary.colorTone}</p>
                </div>
                <div>
                  <div className="text-sm text-purple-600 mb-1">動き</div>
                  <p className="text-[#52606D] text-sm">{aiSummary.movement}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl">
                <div className="text-sm text-purple-600 mb-2">まとめ</div>
                <p className="text-[#1F2933] leading-relaxed">{aiSummary.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="p-8 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
            <h3 className="text-[#1F2933]">撮影コメント</h3>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-[#F9FAFB] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1F2933] text-sm">{comment.user}</span>
                  <span className="text-[#9CA3AF] text-xs">{comment.timestamp}</span>
                </div>
                <p className="text-[#52606D] text-sm">{comment.message}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all resize-none"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="px-6 py-2.5 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all"
            >
              コメントを追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
