import { AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DetailDrawer } from '../DetailDrawer';

interface UnapprovedItem {
  id: string;
  title: string;
  client: string;
  deadline: string;
  rejectedCount: number;
  lastComment: string;
  assignee: string;
}

export function UnapprovedList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnapprovedItem | null>(null);

  const items: UnapprovedItem[] = [
    {
      id: '1',
      title: 'Instagram Reels - 新商品紹介',
      client: 'AXAS株式会社',
      deadline: '12/14 18:00',
      rejectedCount: 2,
      lastComment: 'BGMを変更してください',
      assignee: '田中太郎',
    },
    {
      id: '2',
      title: 'YouTube動画 - ブランドストーリー',
      client: 'BAYMAX株式会社',
      deadline: '12/15 12:00',
      rejectedCount: 0,
      lastComment: '初稿確認中',
      assignee: '佐藤花子',
    },
    {
      id: '3',
      title: 'TikTok - チャレンジ動画',
      client: 'デジタルフロンティア',
      deadline: '12/15 15:00',
      rejectedCount: 1,
      lastComment: 'テロップの位置を調整',
      assignee: '鈴木一郎',
    },
    {
      id: '4',
      title: 'Instagram Feed - キャンペーン告知',
      client: 'AXAS株式会社',
      deadline: '12/16 10:00',
      rejectedCount: 0,
      lastComment: '承認待ち',
      assignee: '田中太郎',
    },
  ];

  const handleItemClick = (item: UnapprovedItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827]">未承認一覧</h3>
          <span className="text-xs text-[#7B8794]">{items.length}件</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left text-xs text-[#7B8794] pb-3">案件名</th>
                <th className="text-left text-xs text-[#7B8794] pb-3">クライアント</th>
                <th className="text-left text-xs text-[#7B8794] pb-3">期限</th>
                <th className="text-center text-xs text-[#7B8794] pb-3">差し戻し</th>
                <th className="text-left text-xs text-[#7B8794] pb-3">最終コメント</th>
                <th className="text-left text-xs text-[#7B8794] pb-3">担当</th>
                <th className="w-8 pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F5F5F7] cursor-pointer group"
                >
                  <td className="py-3 text-sm text-[#111827]">{item.title}</td>
                  <td className="py-3 text-sm text-[#7B8794]">{item.client}</td>
                  <td className="py-3 text-sm text-[#DC2626]">{item.deadline}</td>
                  <td className="py-3 text-center">
                    {item.rejectedCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-xs">
                        <AlertCircle className="w-3 h-3" strokeWidth={2} />
                        {item.rejectedCount}回
                      </span>
                    ) : (
                      <span className="text-xs text-[#7B8794]">-</span>
                    )}
                  </td>
                  <td className="py-3 text-sm text-[#7B8794] max-w-[200px] truncate">{item.lastComment}</td>
                  <td className="py-3 text-sm text-[#7B8794]">{item.assignee}</td>
                  <td className="py-3">
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          data={{
            id: selectedItem.id,
            title: selectedItem.title,
            clientName: selectedItem.client,
            status: selectedItem.rejectedCount > 0 ? '差し戻し' : '承認待ち',
            deadline: `2024/${selectedItem.deadline}`,
            assignee: selectedItem.assignee,
            type: '動画制作',
            priority: selectedItem.rejectedCount > 0 ? 'high' : 'medium',
            description: selectedItem.lastComment,
            kpi: [
              { label: '差し戻し回数', value: `${selectedItem.rejectedCount}回` },
            ],
            deliverables: ['動画ファイル', 'サムネイル', 'キャプション'],
          }}
        />
      )}
    </>
  );
}
