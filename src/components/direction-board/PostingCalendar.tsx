import { Calendar, Filter, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface PostingItem {
  id: string;
  client: string;
  platform: string;
  content: string;
  date: string;
  assignee: string;
  status: string;
}

export function PostingCalendar() {
  const [filterType, setFilterType] = useState<'client' | 'platform' | 'assignee'>('client');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PostingItem | null>(null);

  const posts: PostingItem[] = [
    { id: '1', client: 'AXAS株式会社', platform: 'Instagram', content: '新商品紹介Reels', date: '12/14', assignee: '田中太郎', status: '承認済' },
    { id: '2', client: 'BAYMAX株式会社', platform: 'TikTok', content: 'ブランドストーリー', date: '12/15', assignee: '佐藤花子', status: '編集中' },
    { id: '3', client: 'デジタルフロンティア', platform: 'YouTube', content: '製品解説動画', date: '12/16', assignee: '鈴木一郎', status: '承認待ち' },
    { id: '4', client: 'AXAS株式会社', platform: 'YouTube', content: 'チュートリアル動画', date: '12/17', assignee: '田中太郎', status: '企画中' },
    { id: '5', client: 'BAYMAX株式会社', platform: 'Instagram', content: 'キャンペーン告知', date: '12/18', assignee: '佐藤花子', status: '承認済' },
  ];

  const handleItemClick = (item: PostingItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '承認済':
        return 'bg-[#D1FAE5] text-[#059669]';
      case '承認待ち':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case '編集中':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      case '企画中':
        return 'bg-[#F3F4F6] text-[#6B7280]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827]">今週の投稿カレンダー</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'client' | 'platform' | 'assignee')}
              className="text-xs text-[#111827] bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="client">Client別</option>
              <option value="platform">媒体別</option>
              <option value="assignee">担当別</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => handleItemClick(post)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F5F5F7] flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#0C8A5F]" strokeWidth={2} />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm text-[#111827] mb-1 truncate">{post.content}</div>
                <div className="flex items-center gap-3 text-xs text-[#7B8794]">
                  <span className="truncate">{post.client}</span>
                  <span>•</span>
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{post.assignee}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
                <span className="text-xs text-[#DC2626]">{post.date}</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedItem.id,
            title: selectedItem.content,
            clientName: selectedItem.client,
            status: selectedItem.status,
            deadline: `2024/${selectedItem.date}`,
            assignee: selectedItem.assignee,
            type: selectedItem.platform,
            priority: 'medium',
            description: `${selectedItem.client}向けの${selectedItem.platform}投稿コンテンツです。`,
            deliverables: ['動画ファイル', 'キャプション', 'サムネイル'],
          }}
        />
      )}
    </>
  );
}
