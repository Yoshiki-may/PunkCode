import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, File, Check } from 'lucide-react';

export function CreatorUploadAssets() {
  const [selectedProject, setSelectedProject] = useState('');
  const [fileType, setFileType] = useState<'photo' | 'video' | 'both'>('both');
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const projects = [
    { id: '1', name: 'クライアントA - 新商品プロモーション撮影' },
    { id: '2', name: 'クライアントB - Instagram リール撮影' },
    { id: '3', name: 'クライアントC - ブランドムービー撮影' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedProject || files.length === 0) {
      alert('プロジェクトとファイルを選択してください');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Reset form
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      setFiles([]);
      setDescription('');
      setTags('');
      alert('アップロードが完了しました！');
    }, 500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Upload Assets</h1>
        <p className="text-sm text-muted-foreground">撮影素材をアップロード</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm mb-3 block">プロジェクトを選択 *</label>
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

          {/* File Type */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm mb-3 block">ファイルタイプ</label>
            <div className="flex gap-3">
              <button
                onClick={() => setFileType('photo')}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  fileType === 'photo'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:bg-muted/70'
                }`}
              >
                <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm">写真</div>
              </button>
              <button
                onClick={() => setFileType('video')}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  fileType === 'video'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:bg-muted/70'
                }`}
              >
                <Video className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm">動画</div>
              </button>
              <button
                onClick={() => setFileType('both')}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  fileType === 'both'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:bg-muted/70'
                }`}
              >
                <File className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm">両方</div>
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm mb-3 block">ファイルをアップロード</label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm mb-2">ドラッグ&ドロップ または クリックしてファイルを選択</p>
              <p className="text-xs text-muted-foreground">
                写真: JPG, PNG (最大10MB) / 動画: MP4, MOV (最大5GB)
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept={
                  fileType === 'photo' ? 'image/*' :
                  fileType === 'video' ? 'video/*' :
                  'image/*,video/*'
                }
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm mb-3">選択中のファイル ({files.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm mb-3 block">説明・メモ</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="撮影内容や特記事項を入力..."
              rows={4}
              className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="text-sm mb-3 block">タグ（スペース区切り）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例: 商品撮影 屋外 自然光"
              className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.split(' ').filter(t => t).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">アップロード中...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedProject || files.length === 0}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>アップロード中...</>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>アップロード</span>
              </>
            )}
          </button>
        </div>

        {/* Upload Guidelines */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              アップロードガイドライン
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>写真はJPG/PNG形式、最大10MBまで</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>動画はMP4/MOV形式、最大5GBまで</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>ファイル名は分かりやすく命名</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>複数ファイルの一括アップロード可能</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>タグを付けると検索しやすくなります</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm mb-4">推奨解像度</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instagram フィード:</span>
                <span>1080×1080px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instagram リール:</span>
                <span>1080×1920px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">YouTube:</span>
                <span>1920×1080px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Twitter:</span>
                <span>1200×675px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
