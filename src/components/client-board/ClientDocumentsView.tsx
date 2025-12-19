import { FileText, Download, Eye, Calendar, File } from 'lucide-react';

export function ClientDocumentsView() {
  const documents = [
    {
      category: '契約書類',
      files: [
        {
          name: 'SNS運用代行契約書_2024年度版.pdf',
          size: '2.3 MB',
          date: '2024-01-15',
          type: 'pdf',
        },
        {
          name: '秘密保持契約書.pdf',
          size: '1.8 MB',
          date: '2024-01-15',
          type: 'pdf',
        },
      ],
    },
    {
      category: '請求書',
      files: [
        {
          name: '請求書_2024年12月分.pdf',
          size: '856 KB',
          date: '2024-12-01',
          type: 'pdf',
        },
        {
          name: '請求書_2024年11月分.pdf',
          size: '842 KB',
          date: '2024-11-01',
          type: 'pdf',
        },
        {
          name: '請求書_2024年10月分.pdf',
          size: '891 KB',
          date: '2024-10-01',
          type: 'pdf',
        },
      ],
    },
    {
      category: '運用ガイドライン',
      files: [
        {
          name: 'Instagram運用ガイドライン.pdf',
          size: '3.2 MB',
          date: '2024-02-01',
          type: 'pdf',
        },
        {
          name: 'Twitter運用ガイドライン.pdf',
          size: '2.8 MB',
          date: '2024-02-01',
          type: 'pdf',
        },
        {
          name: 'コンテンツ制作ガイド.pdf',
          size: '4.1 MB',
          date: '2024-02-01',
          type: 'pdf',
        },
      ],
    },
    {
      category: 'ブランドガイドライン',
      files: [
        {
          name: 'ブランドガイドライン_完全版.pdf',
          size: '15.4 MB',
          date: '2024-01-20',
          type: 'pdf',
        },
        {
          name: 'ロゴ使用規定.pdf',
          size: '2.1 MB',
          date: '2024-01-20',
          type: 'pdf',
        },
        {
          name: 'カラーパレット&フォント.pdf',
          size: '1.5 MB',
          date: '2024-01-20',
          type: 'pdf',
        },
      ],
    },
    {
      category: 'レポート',
      files: [
        {
          name: '月次レポート_2024年11月.pdf',
          size: '5.6 MB',
          date: '2024-12-05',
          type: 'pdf',
        },
        {
          name: '月次レポート_2024年10月.pdf',
          size: '5.2 MB',
          date: '2024-11-05',
          type: 'pdf',
        },
      ],
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Documents</h1>
        <p className="text-sm text-muted-foreground">契約書類、請求書、ガイドラインなど</p>
      </div>

      {/* Document Categories */}
      <div className="space-y-6">
        {documents.map((category, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg mb-4">{category.category}</h2>
            <div className="space-y-2">
              {category.files.map((file, fileIdx) => (
                <div
                  key={fileIdx}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm mb-1 truncate">{file.name}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{file.size}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {file.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Storage Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">ストレージ使用状況</h2>
          <span className="text-sm text-muted-foreground">62.4 MB / 100 MB</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '62.4%' }} />
        </div>
      </div>
    </div>
  );
}
