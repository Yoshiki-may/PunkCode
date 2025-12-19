import { useState } from 'react';
import { Send, Upload, AlertCircle, User, FileText } from 'lucide-react';

export function EditorReviewQueue() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [recipients, setRecipients] = useState({
    director: true,
    client: false,
  });
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [deadline, setDeadline] = useState('');

  const projects = [
    { id: '1', name: 'クライアントA - Instagram リール編集', client: 'クライアントA' },
    { id: '2', name: 'クライアントB - プロモーション動画', client: 'クライアントB' },
    { id: '3', name: 'クライアントC - 商品写真レタッチ', client: 'クライアントC' },
  ];

  const files = [
    { id: '1', name: 'instagram_reel_v3.mp4', size: '45.2 MB', version: 'v3' },
    { id: '2', name: 'promotion_video_final.mp4', size: '128.5 MB', version: 'final' },
    { id: '3', name: 'product_photos_retouched.zip', size: '89.3 MB', version: 'v2' },
  ];

  const pendingReviews = [
    {
      id: 1,
      project: 'クライアントD - ブランドムービー',
      file: 'brand_movie_v2.mp4',
      sentTo: 'ディレクター田中',
      status: 'レビュー中',
      sentAt: '2024-12-19 14:30',
      priority: 'high',
    },
    {
      id: 2,
      project: 'クライアントE - SNS投稿画像',
      file: 'sns_images_v1.zip',
      sentTo: 'ディレクター佐藤',
      status: '承認済み',
      sentAt: '2024-12-19 10:00',
      priority: 'medium',
    },
    {
      id: 3,
      project: 'クライアントF - 商品動画',
      file: 'product_video_v3.mp4',
      sentTo: 'クライアントF',
      status: '修正依頼',
      sentAt: '2024-12-18 16:00',
      priority: 'high',
      feedback: 'BGMを明るいトーンに変更してください',
    },
  ];

  const handleSubmitReview = () => {
    if (!selectedProject || !selectedFile) {
      alert('プロジェクトとファイルを選択してください');
      return;
    }

    alert('レビュー依頼を送信しました！');
    
    // Reset form
    setSelectedProject('');
    setSelectedFile('');
    setMessage('');
    setPriority('medium');
    setDeadline('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'レビュー中': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case '承認済み': return 'bg-green-500/10 text-green-700 border-green-200';
      case '修正依頼': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Review Queue</h1>
        <p className="text-sm text-muted-foreground">編集完了後のレビュー依頼・エスカレーション</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Review Request Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg">新しいレビュー依頼</h2>
            </div>

            <div className="space-y-4">
              {/* Project Selection */}
              <div>
                <label className="text-sm mb-2 block">プロジェクトを選択 *</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">プロジェクトを選択してください</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Selection */}
              <div>
                <label className="text-sm mb-2 block">ファイルを選択 *</label>
                <select
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">ファイルを選択してください</option>
                  {files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name} ({file.version}) - {file.size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipients */}
              <div>
                <label className="text-sm mb-2 block">送信先 *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="checkbox"
                      checked={recipients.director}
                      onChange={(e) => setRecipients({ ...recipients, director: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">ディレクター（レビュー依頼）</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="checkbox"
                      checked={recipients.client}
                      onChange={(e) => setRecipients({ ...recipients, client: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">クライアント（承認依頼）</span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm mb-2 block">メッセージ</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="レビューポイントや確認事項を入力..."
                  rows={4}
                  className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="text-sm mb-2 block">優先度</label>
                  <div className="flex gap-2">
                    {(['high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-lg border transition-all ${
                          priority === p
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted border-border hover:bg-muted/70'
                        }`}
                      >
                        <div className="text-sm">
                          {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="text-sm mb-2 block">期限</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>レビュー依頼を送信</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="text-sm">レビュー依頼のポイント</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>完成版は必ずディレクターレビューを通す</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>クライアント送付前は必ず確認</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>バージョン番号を明記</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>変更点・確認ポイントを明確に</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>期限に余裕を持って依頼</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4">エスカレーションフロー</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center text-xs text-blue-600">1</div>
                <span className="text-muted-foreground">編集完了</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center text-xs text-purple-600">2</div>
                <span className="text-muted-foreground">ディレクターレビュー</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center text-xs text-orange-600">3</div>
                <span className="text-muted-foreground">必要に応じて修正</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center text-xs text-green-600">4</div>
                <span className="text-muted-foreground">クライアント承認</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-4">送信済みレビュー依頼</h2>
        <div className="space-y-3">
          {pendingReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm">{review.project}</h3>
                    <span className={`px-3 py-1 border rounded-full text-xs ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className={`text-xs ${getPriorityColor(review.priority)}`}>
                      {review.priority === 'high' ? '高優先度' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <FileText className="w-3 h-3" />
                    <span>{review.file}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{review.sentTo}</span>
                    <span>•</span>
                    <span>{review.sentAt}</span>
                  </div>
                </div>
              </div>
              {review.feedback && (
                <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">フィードバック:</div>
                  <div className="text-sm">{review.feedback}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
