import { Send, Paperclip, Search } from 'lucide-react';
import { useState } from 'react';

export function ClientMessagesView() {
  const [messageInput, setMessageInput] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'direction',
      senderName: 'ディレクター 田中',
      content: 'お世話になっております。来週の投稿スケジュールについて、ご確認をお願いいたします。',
      timestamp: '2024-12-19 14:30',
      avatar: '👤',
    },
    {
      id: 2,
      sender: 'client',
      senderName: 'あなた',
      content: 'ありがとうございます。確認させていただきます。',
      timestamp: '2024-12-19 14:45',
      avatar: '👨‍💼',
    },
    {
      id: 3,
      sender: 'direction',
      senderName: 'ディレクター 田中',
      content: 'スケジュールの中で、12/25のクリスマス投稿について、画像を2パターン用意しました。お好みのものをお選びください。',
      timestamp: '2024-12-19 15:00',
      avatar: '👤',
      attachments: ['christmas_v1.jpg', 'christmas_v2.jpg'],
    },
    {
      id: 4,
      sender: 'client',
      senderName: 'あなた',
      content: 'パターン1の方が良いですね。こちらでお願いします。',
      timestamp: '2024-12-19 15:30',
      avatar: '👨‍💼',
    },
    {
      id: 5,
      sender: 'direction',
      senderName: 'ディレクター 田中',
      content: '承知いたしました。パターン1で進めさせていただきます。ありがとうございます！',
      timestamp: '2024-12-19 15:35',
      avatar: '👤',
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Send message logic
      setMessageInput('');
    }
  };

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
          {messages.map((message) => (
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
                      {message.attachments.map((attachment, idx) => (
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
          ))}
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
