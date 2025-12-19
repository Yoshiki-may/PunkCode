import { useState } from 'react';
import { Play, Pause, Download, Upload, Send, FileText, Image, Film, Clock, CheckCircle } from 'lucide-react';

export function EditorWorkspace() {
  const [selectedProject, setSelectedProject] = useState('1');
  const [isPlaying, setIsPlaying] = useState(false);

  const projects = [
    { id: '1', name: 'クライアントA - Instagram リール編集', type: 'video' },
    { id: '2', name: 'クライアントB - プロモーション動画', type: 'video' },
    { id: '3', name: 'クライアントC - 商品写真レタッチ', type: 'image' },
  ];

  const projectDetails = {
    '1': {
      client: 'クライアントA',
      projectName: 'Instagram リール編集',
      type: 'video',
      deadline: '2024-12-20',
      status: '編集中',
      version: 'v2',
      guidelines: `
【編集ガイドライン】
・尺: 15秒以内
・縦型動画（1080x1920）
・トレンドBGM使用
・テロップ多め、読みやすく
・カット割りはテンポよく
・カラーグレーディング: 明るく鮮やか
・トランジション: シンプルに
      `,
      assets: [
        { id: 1, name: 'product_shoot_001.mp4', type: 'video', duration: '00:15' },
        { id: 2, name: 'product_shoot_002.mp4', type: 'video', duration: '00:18' },
        { id: 3, name: 'broll_nature_001.mp4', type: 'video', duration: '00:12' },
      ],
      versions: [
        { id: 1, name: 'instagram_reel_v1.mp4', uploadedAt: '2024-12-18 15:00', size: '12.5 MB' },
        { id: 2, name: 'instagram_reel_v2.mp4', uploadedAt: '2024-12-19 10:30', size: '13.2 MB', current: true },
      ],
      notes: [
        { id: 1, author: 'ディレクター田中', time: '2024-12-18 16:30', text: '最初のカットが少し長いかもしれません' },
        { id: 2, author: '自分', time: '2024-12-19 09:00', text: 'v2で尺を調整しました' },
      ],
    },
    '2': {
      client: 'クライアントB',
      projectName: 'プロモーション動画',
      type: 'video',
      deadline: '2024-12-20',
      status: 'レビュー待ち',
      version: 'v3',
      guidelines: `
【編集ガイドライン】
・尺: 60秒
・横型動画（1920x1080）
・企業ブランディング重視
・ナレーション付き（支給データ）
・シネマティックな雰囲気
・テロップはシンプルに
・BGM: 落ち着いた企業向け
      `,
      assets: [
        { id: 1, name: 'interview_main_001.mp4', type: 'video', duration: '02:30' },
        { id: 2, name: 'office_broll_001.mp4', type: 'video', duration: '01:45' },
        { id: 3, name: 'narration.mp3', type: 'audio', duration: '00:58' },
      ],
      versions: [
        { id: 1, name: 'promo_v1.mp4', uploadedAt: '2024-12-17 14:00', size: '45.8 MB' },
        { id: 2, name: 'promo_v2.mp4', uploadedAt: '2024-12-18 11:00', size: '47.2 MB' },
        { id: 3, name: 'promo_v3.mp4', uploadedAt: '2024-12-19 16:00', size: '46.5 MB', current: true },
      ],
      notes: [
        { id: 1, author: 'ディレクター佐藤', time: '2024-12-18 12:00', text: 'v2は良い感じです。ナレーションのタイミングを微調整お願いします' },
        { id: 2, author: '自分', time: '2024-12-19 16:30', text: 'v3でナレーションタイミング調整完了。レビュー依頼出します' },
      ],
    },
    '3': {
      client: 'クライアントC',
      projectName: '商品写真レタッチ',
      type: 'image',
      deadline: '2024-12-21',
      status: '修正依頼',
      version: 'v1',
      guidelines: `
【編集ガイドライン】
・10枚の商品写真
・背景削除（純白背景に）
・色調補正（実物に忠実に）
・サイズ統一（4000x6000px）
・ファイル形式: JPG（高品質）
・影の処理: 自然に
      `,
      assets: [
        { id: 1, name: 'product_photo_001.jpg', type: 'image' },
        { id: 2, name: 'product_photo_002.jpg', type: 'image' },
        { id: 3, name: 'product_photo_003.jpg', type: 'image' },
        { id: 4, name: 'product_photo_004.jpg', type: 'image' },
      ],
      versions: [
        { id: 1, name: 'retouched_photos_v1.zip', uploadedAt: '2024-12-18 13:00', size: '89.3 MB', current: true },
      ],
      notes: [
        { id: 1, author: 'ディレクター山田', time: '2024-12-18 17:00', text: '背景の白をもっと純白に調整してください' },
      ],
    },
  };

  const currentProject = projectDetails[selectedProject as keyof typeof projectDetails];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Workspace</h1>
        <p className="text-sm text-muted-foreground">編集作業スペース</p>
      </div>

      {/* Project Selection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <label className="text-sm mb-2 block">プロジェクトを選択</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview Area */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">プレビュー</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-full border border-blue-200">
                  {currentProject.status}
                </span>
                <span className="px-2 py-1 bg-muted text-xs rounded">
                  {currentProject.version}
                </span>
              </div>
            </div>

            {/* Video/Image Preview */}
            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center relative">
              {currentProject.type === 'video' ? (
                <>
                  <Film className="w-16 h-16 text-muted-foreground" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="flex-1 h-1 bg-background/50 rounded-full">
                      <div className="w-1/3 h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">00:05 / 00:15</span>
                  </div>
                </>
              ) : (
                <Image className="w-16 h-16 text-muted-foreground" />
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span>ダウンロード</span>
              </button>
              <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>新バージョンアップロード</span>
              </button>
              <button className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>レビュー依頼</span>
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg">編集ガイドライン</h2>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap text-foreground">
                {currentProject.guidelines}
              </pre>
            </div>
          </div>

          {/* Source Assets */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg mb-4">素材ファイル（Creatorから）</h2>
            <div className="space-y-2">
              {currentProject.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {asset.type === 'video' && <Film className="w-5 h-5 text-purple-500" />}
                    {asset.type === 'image' && <Image className="w-5 h-5 text-blue-500" />}
                    {asset.type === 'audio' && <FileText className="w-5 h-5 text-green-500" />}
                    <div>
                      <div className="text-sm">{asset.name}</div>
                      {asset.duration && (
                        <div className="text-xs text-muted-foreground">{asset.duration}</div>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Version History */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg mb-4">バージョン履歴</h2>
            <div className="space-y-3">
              {currentProject.versions.map((version) => (
                <div
                  key={version.id}
                  className={`p-4 rounded-lg border ${
                    version.current
                      ? 'bg-primary/5 border-primary'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{version.name}</span>
                      {version.current && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                          最新
                        </span>
                      )}
                    </div>
                    <button className="text-xs text-primary hover:underline">
                      ダウンロード
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{version.uploadedAt}</span>
                    <span>•</span>
                    <span>{version.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4">プロジェクト情報</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">クライアント</div>
                <div>{currentProject.client}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">プロジェクト名</div>
                <div>{currentProject.projectName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">納期</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{currentProject.deadline}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">ステータス</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>{currentProject.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Comments */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4">メモ・コメント</h3>
            <div className="space-y-3 mb-4">
              {currentProject.notes.map((note) => (
                <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-primary">{note.author}</span>
                    <span className="text-xs text-muted-foreground">{note.time}</span>
                  </div>
                  <div className="text-sm">{note.text}</div>
                </div>
              ))}
            </div>
            <textarea
              placeholder="メモを追加..."
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
            />
            <button className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
              メモを追加
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4">作業統計</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">素材数:</span>
                <span>{currentProject.assets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">バージョン:</span>
                <span>{currentProject.versions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">コメント:</span>
                <span>{currentProject.notes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
