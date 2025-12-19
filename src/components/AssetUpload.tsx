import { Upload, Calendar, MapPin, User, FileVideo, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface UploadFile {
  id: string;
  file: File;
  scene: string;
  takeNumber: string;
  format: string;
  note: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
}

export function AssetUpload() {
  const [selectedShoot, setSelectedShoot] = useState('1');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const shoots = [
    {
      id: '1',
      projectName: '採用ブランディング動画',
      clientName: 'デジタルフロンティア株式会社',
      date: '2024/12/10',
      location: '渋谷オフィス',
      director: '山田太郎',
      editor: '佐藤花子',
    },
    {
      id: '2',
      projectName: '12月キャンペーン動画',
      clientName: 'クリエイティブワークス',
      date: '2024/12/12',
      location: '代官山スタジオA',
      director: '鈴木一郎',
      editor: '田中次郎',
    },
  ];

  const sceneOptions = [
    'インタビュー',
    'オープニングカット',
    'Bロール（店内）',
    'Bロール（外観）',
    'Bロール（商品）',
    'チーム作業シーン',
    'オフィス全景',
    'その他',
  ];

  const formatOptions = ['4K (3840x2160)', '1080p (1920x1080)', 'Log撮影', 'その他'];

  const currentShoot = shoots.find(s => s.id === selectedShoot);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: UploadFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      scene: '',
      takeNumber: '',
      format: '',
      note: '',
      status: 'pending',
      progress: 0,
    }));
    setUploadFiles([...uploadFiles, ...newFiles]);
  };

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setUploadFiles(uploadFiles.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFile = (id: string) => {
    setUploadFiles(uploadFiles.filter(f => f.id !== id));
  };

  const simulateUpload = (id: string) => {
    updateFile(id, { status: 'uploading', progress: 0 });
    
    const interval = setInterval(() => {
      setUploadFiles(current => {
        const file = current.find(f => f.id === id);
        if (!file) {
          clearInterval(interval);
          return current;
        }
        
        if (file.progress >= 100) {
          clearInterval(interval);
          return current.map(f => 
            f.id === id ? { ...f, status: 'completed', progress: 100 } : f
          );
        }
        
        return current.map(f => 
          f.id === id ? { ...f, progress: f.progress + 10 } : f
        );
      });
    }, 500);
  };

  const handleUploadAll = () => {
    uploadFiles
      .filter(f => f.status === 'pending' && f.scene && f.format)
      .forEach(f => simulateUpload(f.id));
  };

  const statusConfig = {
    pending: { label: '準備中', color: 'bg-[#E5E7EB] text-[#52606D]', icon: Clock },
    uploading: { label: 'アップロード中', color: 'bg-[#FEF3C7] text-[#D97706]', icon: Clock },
    completed: { label: '完了', color: 'bg-[#C5F3E5] text-[#0C8A5F]', icon: CheckCircle2 },
    failed: { label: 'エラー', color: 'bg-[#FEE2E2] text-[#DC2626]', icon: AlertCircle },
  };

  const uploadStats = {
    total: uploadFiles.length,
    pending: uploadFiles.filter(f => f.status === 'pending').length,
    uploading: uploadFiles.filter(f => f.status === 'uploading').length,
    completed: uploadFiles.filter(f => f.status === 'completed').length,
    failed: uploadFiles.filter(f => f.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2933] mb-2">素材アップロード</h1>
        <p className="text-[#7B8794]">撮影素材を編集者に共有</p>
      </div>

      {/* Shoot Selection */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="mb-4">
          <label className="block text-[#52606D] text-sm mb-2">撮影ジョブを選択</label>
          <select
            value={selectedShoot}
            onChange={(e) => setSelectedShoot(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
          >
            {shoots.map(shoot => (
              <option key={shoot.id} value={shoot.id}>
                {shoot.date} - {shoot.projectName}
              </option>
            ))}
          </select>
        </div>

        {currentShoot && (
          <div className="grid grid-cols-2 gap-6 p-5 bg-[#F9FAFB] rounded-xl">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-[#9CA3AF] text-xs mb-0.5">撮影日</div>
                  <div className="text-[#1F2933] text-sm">{currentShoot.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-[#9CA3AF] text-xs mb-0.5">ロケーション</div>
                  <div className="text-[#1F2933] text-sm">{currentShoot.location}</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-[#9CA3AF] text-xs mb-0.5">ディレクター</div>
                  <div className="text-[#1F2933] text-sm">{currentShoot.director}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-[#7B8794] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-[#9CA3AF] text-xs mb-0.5">編集者</div>
                  <div className="text-[#1F2933] text-sm">{currentShoot.editor}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-xs mb-1">全ファイル</div>
            <div className="text-[#1F2933] text-2xl">{uploadStats.total}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-xs mb-1">準備中</div>
            <div className="text-[#7B8794] text-2xl">{uploadStats.pending}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-xs mb-1">アップロード中</div>
            <div className="text-[#D97706] text-2xl">{uploadStats.uploading}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-xs mb-1">完了</div>
            <div className="text-[#0C8A5F] text-2xl">{uploadStats.completed}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="text-[#7B8794] text-xs mb-1">エラー</div>
            <div className="text-[#DC2626] text-2xl">{uploadStats.failed}</div>
          </div>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          dragActive
            ? 'border-[#0C8A5F] bg-[#C5F3E5]/20'
            : 'border-[#E5E7EB] hover:border-[#0C8A5F] hover:bg-[#F9FAFB]'
        }`}
      >
        <Upload className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-[#1F2933] mb-2">ファイルをドラッグ&ドロップ</p>
        <p className="text-[#7B8794] text-sm mb-4">または</p>
        <label className="inline-block px-6 py-2.5 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all cursor-pointer">
          ファイルを選択
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        <p className="text-[#9CA3AF] text-xs mt-4">対応形式: MP4, MOV, AVI (最大5GB / ファイル)</p>
      </div>

      {/* Uploaded Files List */}
      {uploadFiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileVideo className="w-6 h-6 text-[#7B8794]" strokeWidth={2} />
              <h3 className="text-[#1F2933]">アップロード予定ファイル</h3>
            </div>
            <button
              onClick={handleUploadAll}
              disabled={uploadFiles.filter(f => f.status === 'pending' && f.scene && f.format).length === 0}
              className="px-5 py-2 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              すべてアップロード
            </button>
          </div>
          <div className="p-6 space-y-4">
            {uploadFiles.map((uploadFile) => {
              const statusInfo = statusConfig[uploadFile.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={uploadFile.id}
                  className="border border-[#E5E7EB] rounded-xl p-5"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <FileVideo className="w-10 h-10 text-[#7B8794] flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[#1F2933]">{uploadFile.file.name}</h4>
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#7B8794]">
                        <span>{(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                          {statusInfo.label}
                        </span>
                      </div>
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-[#7B8794] mb-1">
                            <span>アップロード中...</span>
                            <span>{uploadFile.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0C8A5F] to-[#0A6F4E] transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {uploadFile.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#52606D] text-sm mb-2">
                          シーン / カテゴリ <span className="text-[#DC2626]">*</span>
                        </label>
                        <select
                          value={uploadFile.scene}
                          onChange={(e) => updateFile(uploadFile.id, { scene: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-[#1F2933] text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
                        >
                          <option value="">選択してください</option>
                          {sceneOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#52606D] text-sm mb-2">テイク番号</label>
                        <input
                          type="text"
                          value={uploadFile.takeNumber}
                          onChange={(e) => updateFile(uploadFile.id, { takeNumber: e.target.value })}
                          placeholder="例: Take 1"
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-[#1F2933] text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[#52606D] text-sm mb-2">
                          フォーマット <span className="text-[#DC2626]">*</span>
                        </label>
                        <select
                          value={uploadFile.format}
                          onChange={(e) => updateFile(uploadFile.id, { format: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-[#1F2933] text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
                        >
                          <option value="">選択してください</option>
                          {formatOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#52606D] text-sm mb-2">メモ（任意）</label>
                        <input
                          type="text"
                          value={uploadFile.note}
                          onChange={(e) => updateFile(uploadFile.id, { note: e.target.value })}
                          placeholder="例: 手ブレあり、要確認"
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-[#1F2933] text-sm focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
