import { Check, X, MessageSquare, Instagram, Twitter, Facebook, CheckCircle } from 'lucide-react';

export function ClientApprovalsView() {
  const pendingApprovals = [
    {
      id: 1,
      platform: 'Instagram',
      scheduledDate: '2024-12-20',
      scheduledTime: '10:00',
      content: '🎄 クリスマスキャンペーン開始！\n\n今年も特別なプレゼント企画をご用意しました✨\n詳しくはストーリーズをチェック👆\n\n#クリスマス #キャンペーン #プレゼント企画',
      imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=400&fit=crop',
      hashtags: ['クリスマス', 'キャンペーン', 'プレゼント企画'],
    },
    {
      id: 2,
      platform: 'Twitter',
      scheduledDate: '2024-12-20',
      scheduledTime: '15:00',
      content: '【新商品発表🎉】\n\n皆様からのご要望にお応えして、待望の新ラインナップが登場します！\n\n詳細は明日12/21の15:00に発表予定です。\nお楽しみに！',
      hashtags: ['新商品', '新発表'],
    },
    {
      id: 3,
      platform: 'Facebook',
      scheduledDate: '2024-12-21',
      scheduledTime: '12:00',
      content: '年末年始の営業時間のお知らせ\n\n12/29(金) - 1/3(水)まで年末年始休業とさせていただきます。\n新年は1/4(木)より通常営業いたします。',
      imageUrl: 'https://images.unsplash.com/photo-1482329833197-916d32bdae74?w=400&h=400&fit=crop',
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="w-5 h-5" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5" />;
      case 'Facebook':
        return <Facebook className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'bg-pink-500/10 text-pink-600 border-pink-200';
      case 'Twitter':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Facebook':
        return 'bg-blue-700/10 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Approvals</h1>
        <p className="text-sm text-muted-foreground">
          承認待ちのコンテンツ: {pendingApprovals.length}件
        </p>
      </div>

      {/* Approval Cards */}
      <div className="space-y-6">
        {pendingApprovals.map((approval) => (
          <div
            key={approval.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getPlatformColor(approval.platform)}`}>
                  {getPlatformIcon(approval.platform)}
                  <span className="text-sm">{approval.platform}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  投稿予定: {approval.scheduledDate} {approval.scheduledTime}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Content */}
                <div>
                  <h3 className="text-sm text-muted-foreground mb-3">投稿内容</h3>
                  <div className="whitespace-pre-wrap text-sm bg-muted/50 rounded-lg p-4 mb-4">
                    {approval.content}
                  </div>
                  {approval.hashtags && approval.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {approval.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {approval.imageUrl && (
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-3">画像プレビュー</h3>
                    <img
                      src={approval.imageUrl}
                      alt="Post preview"
                      className="w-full h-64 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>コメントを追加</span>
              </button>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                  <span>差戻し</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors">
                  <Check className="w-4 h-4" />
                  <span>承認</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pendingApprovals.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg mb-2">承認待ちのコンテンツはありません</h3>
          <p className="text-sm text-muted-foreground">
            新しいコンテンツが作成されると、ここに表示されます
          </p>
        </div>
      )}
    </div>
  );
}