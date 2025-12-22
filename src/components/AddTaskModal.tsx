// タスク追加モーダル（既存UIを変更せず、配線のみ実装）

import { X } from 'lucide-react';
import { useState } from 'react';
import { addClientTask, getAllClients, notifyTaskAdded, type ClientTask } from '../utils/clientData';
import { getCurrentUser } from '../utils/mockDatabase';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
  preselectedClientId?: string;
}

export function AddTaskModal({ isOpen, onClose, onTaskAdded, preselectedClientId }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(preselectedClientId || '');
  const [platform, setPlatform] = useState<'Instagram' | 'Twitter' | 'TikTok' | 'Facebook' | 'YouTube'>('Instagram');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'approval' | 'rejected' | 'completed'>('pending');
  const [postDate, setPostDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const clients = getAllClients();
  const currentUser = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !clientId || !postDate) {
      alert('タイトル、クライアント、投稿日は必須です');
      return;
    }

    setIsSaving(true);

    // イニシャルを生成
    const getInitials = (name: string): string => {
      if (!name) return '??';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[0][0] + parts[1][0];
      }
      return name.substring(0, 2);
    };

    const newTask: ClientTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      status,
      postDate,
      platform,
      assignee: assignee || currentUser?.name || '未割当',
      initials: getInitials(assignee || currentUser?.name || '未割当'),
      dueDate: postDate,
    };

    // タスクを追加
    const success = addClientTask(clientId, newTask);

    if (success) {
      // 通知を生成
      const client = clients.find(c => c.id === clientId);
      if (client) {
        notifyTaskAdded(
          client.name,
          title,
          assignee || currentUser?.name || '未割当',
          clientId,
          newTask.id
        );
      }

      // リセット
      setTitle('');
      setClientId(preselectedClientId || '');
      setPlatform('Instagram');
      setStatus('pending');
      setPostDate('');
      setAssignee('');
      
      setIsSaving(false);
      
      // コールバック
      if (onTaskAdded) {
        onTaskAdded();
      }
      
      onClose();
    } else {
      setIsSaving(false);
      alert('タスクの追加に失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-card-foreground">新規タスク追加</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* タイトル */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              タイトル <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="例: Instagram Reels - 新商品紹介"
              required
            />
          </div>

          {/* クライアント */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              クライアント <span className="text-destructive">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">選択してください</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* プラットフォーム */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              プラットフォーム
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">未着手</option>
              <option value="in-progress">進行中</option>
              <option value="approval">承認待ち</option>
              <option value="rejected">差戻し</option>
              <option value="completed">完了</option>
            </select>
          </div>

          {/* 投稿日 */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              投稿日 <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* 担当者 */}
          <div>
            <label className="block text-sm text-card-foreground mb-2">
              担当者
            </label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={currentUser?.name || '担当者名を入力'}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-card-foreground hover:bg-accent transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? '追加中...' : 'タスクを追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
