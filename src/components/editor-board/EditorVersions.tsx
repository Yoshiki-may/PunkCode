import { useState } from 'react';
import { Download, Eye, GitBranch, Calendar, User, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

export function EditorVersions() {
  const [selectedProject, setSelectedProject] = useState('1');

  const projects = [
    { id: '1', name: 'クライアントA - Instagram リール編集' },
    { id: '2', name: 'クライアントB - プロモーション動画' },
    { id: '3', name: 'クライアントC - 商品写真レタッチ' },
  ];

  const versionData = {
    '1': {
      projectName: 'Instagram リール編集',
      client: 'クライアントA',
      versions: [
        {
          id: 3,
          version: 'v3',
          fileName: 'instagram_reel_v3.mp4',
          uploadedAt: '2024-12-19 14:30',
          uploadedBy: '自分',
          size: '13.8 MB',
          status: '承認済み',
          reviewer: 'ディレクター田中',
          reviewedAt: '2024-12-19 16:00',
          feedback: '完璧です！クライアントに送ってください',
          changes: 'カット割りを調整、BGMを変更、テロップの位置を修正',
          thumbnail: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=V3+Approved',
        },
        {
          id: 2,
          version: 'v2',
          fileName: 'instagram_reel_v2.mp4',
          uploadedAt: '2024-12-19 10:30',
          uploadedBy: '自分',
          size: '13.2 MB',
          status: '修正依頼',
          reviewer: 'ディレクター田中',
          reviewedAt: '2024-12-19 12:00',
          feedback: 'BGMをもう少しトレンド感のあるものに変更してください。テロップの位置も調整お願いします',
          changes: '尺を15秒に調整、カラーグレーディング変更',
          thumbnail: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=V2+Revision',
        },
        {
          id: 1,
          version: 'v1',
          fileName: 'instagram_reel_v1.mp4',
          uploadedAt: '2024-12-18 15:00',
          uploadedBy: '自分',
          size: '12.5 MB',
          status: '修正依頼',
          reviewer: 'ディレクター田中',
          reviewedAt: '2024-12-18 16:30',
          feedback: '全体的に良いですが、尺が少し長いです。15秒以内に収めてください',
          changes: '初回バージョン',
          thumbnail: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=V1+First',
        },
      ],
    },
    '2': {
      projectName: 'プロモーション動画',
      client: 'クライアントB',
      versions: [
        {
          id: 3,
          version: 'v3',
          fileName: 'promo_v3.mp4',
          uploadedAt: '2024-12-19 16:00',
          uploadedBy: '自分',
          size: '46.5 MB',
          status: 'レビュー待ち',
          changes: 'ナレーションのタイミングを微調整',
          thumbnail: 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=V3+Pending',
        },
        {
          id: 2,
          version: 'v2',
          fileName: 'promo_v2.mp4',
          uploadedAt: '2024-12-18 11:00',
          uploadedBy: '自分',
          size: '47.2 MB',
          status: '修正依頼',
          reviewer: 'ディレクター佐藤',
          reviewedAt: '2024-12-18 14:00',
          feedback: '良い感じです。ナレーションのタイミングを微調整してください',
          changes: 'カラーグレーディング調整、BGM音量変更',
          thumbnail: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=V2+Review',
        },
        {
          id: 1,
          version: 'v1',
          fileName: 'promo_v1.mp4',
          uploadedAt: '2024-12-17 14:00',
          uploadedBy: '自分',
          size: '45.8 MB',
          status: '修正依頼',
          reviewer: 'ディレクター佐藤',
          reviewedAt: '2024-12-17 17:00',
          feedback: 'シネマティックな雰囲気をもっと出してください',
          changes: '初回バージョン',
          thumbnail: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=V1+Initial',
        },
      ],
    },
    '3': {
      projectName: '商品写真レタッチ',
      client: 'クライアントC',
      versions: [
        {
          id: 2,
          version: 'v2',
          fileName: 'retouched_photos_v2.zip',
          uploadedAt: '2024-12-19 15:00',
          uploadedBy: '自分',
          size: '92.1 MB',
          status: 'レビュー待ち',
          changes: '背景を純白に調整、影の処理を改善',
          thumbnail: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=V2+Images',
        },
        {
          id: 1,
          version: 'v1',
          fileName: 'retouched_photos_v1.zip',
          uploadedAt: '2024-12-18 13:00',
          uploadedBy: '自分',
          size: '89.3 MB',
          status: '修正依頼',
          reviewer: 'ディレクター山田',
          reviewedAt: '2024-12-18 17:00',
          feedback: '背景の白をもっと純白に調整してください',
          changes: '初回バージョン',
          thumbnail: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=V1+Photos',
        },
      ],
    },
  };

  const currentProjectData = versionData[selectedProject as keyof typeof versionData];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '承認済み': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case '修正依頼': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'レビュー待ち': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <GitBranch className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '承認済み': return 'bg-green-500/10 text-green-700 border-green-200';
      case '修正依頼': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'レビュー待ち': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Versions</h1>
        <p className="text-sm text-muted-foreground">バージョン管理・履歴</p>
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

      {/* Project Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg mb-1">{currentProjectData.projectName}</h2>
            <p className="text-sm text-muted-foreground">{currentProjectData.client}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-1">{currentProjectData.versions.length}</div>
            <div className="text-sm text-muted-foreground">バージョン</div>
          </div>
        </div>
      </div>

      {/* Version Timeline */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg mb-6">バージョン履歴</h2>
        
        <div className="space-y-6">
          {currentProjectData.versions.map((version, index) => (
            <div key={version.id} className="relative">
              {/* Timeline Line */}
              {index < currentProjectData.versions.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
              )}

              <div className="flex gap-6">
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center">
                    {getStatusIcon(version.status || 'レビュー待ち')}
                  </div>
                </div>

                {/* Version Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-muted/50 border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg">{version.version}</h3>
                          {version.status && (
                            <span className={`px-3 py-1 border rounded-full text-xs ${getStatusColor(version.status)}`}>
                              {version.status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{version.fileName}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {version.uploadedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {version.uploadedBy}
                          </span>
                          <span>{version.size}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>プレビュー</span>
                        </button>
                        <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>ダウンロード</span>
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={version.thumbnail} 
                        alt={version.version}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Changes */}
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">変更内容</div>
                      <div className="text-sm bg-card rounded-lg p-3">
                        {version.changes}
                      </div>
                    </div>

                    {/* Feedback */}
                    {version.feedback && (
                      <div className={`p-4 rounded-lg border ${
                        version.status === '承認済み' 
                          ? 'bg-green-500/5 border-green-200' 
                          : 'bg-red-500/5 border-red-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <MessageSquare className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            version.status === '承認済み' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{version.reviewer}</span>
                              <span className="text-xs text-muted-foreground">{version.reviewedAt}</span>
                            </div>
                            <p className={`text-sm ${
                              version.status === '承認済み' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {version.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-sm text-muted-foreground">承認済み</h3>
          </div>
          <div className="text-2xl">
            {currentProjectData.versions.filter(v => v.status === '承認済み').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-sm text-muted-foreground">レビュー待ち</h3>
          </div>
          <div className="text-2xl">
            {currentProjectData.versions.filter(v => v.status === 'レビュー待ち').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-sm text-muted-foreground">修正依頼</h3>
          </div>
          <div className="text-2xl">
            {currentProjectData.versions.filter(v => v.status === '修正依頼').length}
          </div>
        </div>
      </div>
    </div>
  );
}
