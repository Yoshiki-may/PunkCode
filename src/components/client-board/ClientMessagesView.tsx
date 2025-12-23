import { Send, Paperclip, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getClientComments, addComment } from '../../utils/commentData';
import { getCurrentAuthUser } from '../../utils/auth';
import { getAppState } from '../../utils/appState';

export function ClientMessagesView() {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  // 現在のクライアントIDとユーザー情報を取得
  const currentUser = getCurrentAuthUser();
  const appState = getAppState();
  const clientId = appState.selectedClientBoardClientId || appState.selectedClientId || currentUser?.client_id;

  // コメント一覧を読み込み
  useEffect(() => {
    if (!clientId) {
      setMessages([]);
      return;
    }

    const loadMessages = () => {
      const comments = getClientComments(clientId);
      
      // Comment型をメッセージ表示用に変換
      const formattedMessages = comments.map(comment => ({
        id: comment.id,
        sender: comment.isFromClient ? 'client' : 'direction',
        senderName: comment.isFromClient ? 'あなた' : 'ディレクター',
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        avatar: comment.isFromClient ? '👨‍💼' : '👤',
      }));
      
      setMessages(formattedMessages);
    };

    loadMessages();
    
    // autoPull対応：5秒間隔で再読み込み
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [clientId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending || !clientId || !currentUser) {
      return;
    }

    setIsSending(true);

    try {
      // コメントを追加（outbox統合済み）
      const success = addComment({
        clientId,
        userId: currentUser.id,
        content: messageInput.trim(),
        isFromClient: currentUser.role === 'client'
      });

      if (success) {
        setMessageInput('');
        
        // 即座にローカル表示を更新（楽観的UI更新）
        const newMessage = {
          id: `temp-${Date.now()}`,
          sender: 'client',
          senderName: 'あなた',
          content: messageInput.trim(),
          timestamp: new Date().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          avatar: '👨‍💼',
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('[ClientMessagesView] Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // クライアントが選択されていない場合
  if (!clientId) {
    return (
      <div className="p-8 h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>クライアントが選択されていません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-foreground mb-2">Messages</h1>
        <p className="text-sm text-muted-foreground">担当ディレクターとのコミュニケーション</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <div className="text-sm">ディレクター 田中</div>
              <div className="text-xs text-muted-foreground">オンライン</div>
            </div>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>まだメッセージがありません</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'client' ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
                <div className={`flex-1 max-w-[70%] ${message.sender === 'client' ? 'items-end' : ''}`}>
                  <div className="text-xs text-muted-foreground mb-1">
                    {message.senderName} • {message.timestamp}
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      message.sender === 'client'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-background/20 rounded text-xs"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              placeholder="メッセージを入力..."
              disabled={isSending}
              className="flex-1 px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !messageInput.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}