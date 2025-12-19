import { MessageSquare, Hash, Lock, Users, Search, Plus, MoreVertical, Paperclip, Send, Smile, AtSign, Image, FileText, Video as VideoIcon, Phone, VideoOff, User, Circle, ChevronDown, Pin, Star, Archive, Trash2, Edit3, Reply, Heart, ThumbsUp, Laugh, CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  participants?: string[];
  isPinned?: boolean;
  onlineStatus?: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  isEdited?: boolean;
  attachments?: { type: 'image' | 'file' | 'video'; url: string; name: string }[];
  replyTo?: { userName: string; content: string };
  isRead?: boolean;
}

export function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const channels: Channel[] = [
    {
      id: 'general',
      name: '全体連絡',
      type: 'public',
      unreadCount: 5,
      lastMessage: 'お疲れ様です！今日の進捗共有です',
      lastMessageTime: '10:30',
      isPinned: true,
    },
    {
      id: 'sales-team',
      name: '営業チーム',
      type: 'public',
      unreadCount: 2,
      lastMessage: '新規案件の進捗確認をお願いします',
      lastMessageTime: '09:45',
    },
    {
      id: 'direction-team',
      name: 'ディレクションチーム',
      type: 'public',
      unreadCount: 0,
      lastMessage: 'コンセプト資料を共有しました',
      lastMessageTime: '昨日',
    },
    {
      id: 'editor-team',
      name: '編集チーム',
      type: 'private',
      unreadCount: 8,
      lastMessage: 'レンダリング完了しました',
      lastMessageTime: '11:20',
    },
    {
      id: 'creator-team',
      name: 'クリエイターチーム',
      type: 'public',
      unreadCount: 0,
      lastMessage: '撮影素材アップロード完了',
      lastMessageTime: '2日前',
    },
    {
      id: 'project-abc',
      name: 'プロジェクト：採用動画',
      type: 'private',
      unreadCount: 3,
      lastMessage: 'クライアントから修正依頼がきました',
      lastMessageTime: '10:15',
      isPinned: true,
    },
    {
      id: 'dm-yamada',
      name: '山田太郎',
      type: 'dm',
      unreadCount: 1,
      lastMessage: '確認しました、ありがとうございます',
      lastMessageTime: '12:00',
      onlineStatus: 'online',
    },
    {
      id: 'dm-sato',
      name: '佐藤花子',
      type: 'dm',
      unreadCount: 0,
      lastMessage: '了解です！',
      lastMessageTime: '昨日',
      onlineStatus: 'away',
    },
    {
      id: 'dm-suzuki',
      name: '鈴木一郎',
      type: 'dm',
      unreadCount: 0,
      lastMessage: 'お疲れ様でした',
      lastMessageTime: '3日前',
      onlineStatus: 'offline',
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      userId: 'yamada',
      userName: '山田太郎',
      content: 'おはようございます！今日のミーティング資料を共有します。',
      timestamp: '09:00',
      isRead: true,
    },
    {
      id: '2',
      userId: 'sato',
      userName: '佐藤花子',
      content: 'ありがとうございます！確認させていただきます。',
      timestamp: '09:05',
      reactions: [
        { emoji: '👍', count: 3, users: ['鈴木一郎', '田中次郎', '高橋三郎'] },
      ],
      isRead: true,
    },
    {
      id: '3',
      userId: 'suzuki',
      userName: '鈴木一郎',
      content: 'クライアントから新しい要望が来ています。緊急度は中程度です。',
      timestamp: '09:30',
      attachments: [
        { type: 'file', url: '#', name: 'クライアント要望書.pdf' },
      ],
      isRead: true,
    },
    {
      id: '4',
      userId: 'tanaka',
      userName: '田中次郎',
      content: '了解しました。午後に対応します。',
      timestamp: '09:45',
      replyTo: { userName: '鈴木一郎', content: 'クライアントから新しい要望が来ています...' },
      isRead: true,
    },
    {
      id: '5',
      userId: 'current-user',
      userName: 'あなた',
      content: 'お疲れ様です！今日の進捗共有です。採用動画プロジェクトは予定通り進行中です。',
      timestamp: '10:30',
      reactions: [
        { emoji: '❤️', count: 2, users: ['山田太郎', '佐藤花子'] },
        { emoji: '👏', count: 1, users: ['鈴木一郎'] },
      ],
      isRead: true,
      isEdited: true,
    },
    {
      id: '6',
      userId: 'yamada',
      userName: '山田太郎',
      content: '素晴らしいですね！引き続きよろしくお願いします 🎉',
      timestamp: '10:35',
      isRead: false,
    },
  ];

  const currentChannel = channels.find(c => c.id === selectedChannel);
  const pinnedChannels = channels.filter(c => c.isPinned);
  const publicChannels = channels.filter(c => c.type === 'public' && !c.isPinned);
  const privateChannels = channels.filter(c => c.type === 'private' && !c.isPinned);
  const dmChannels = channels.filter(c => c.type === 'dm');

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // ここでメッセージ送信処理を実装
    console.log('Sending message:', messageText);
    setMessageText('');
    setReplyingTo(null);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    console.log('Adding reaction:', messageId, emoji);
  };

  const statusColors = {
    online: 'bg-[#0C8A5F]',
    away: 'bg-[#D97706]',
    offline: 'bg-[#9CA3AF]',
  };

  const emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '✅', '👀'];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-80 border-r border-[#E5E7EB] flex flex-col">
        {/* Channel Search */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1F2933]">チャット</h2>
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" strokeWidth={2} />
            <input
              type="text"
              placeholder="チャンネルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Channels */}
          {pinnedChannels.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#7B8794] uppercase">
                <Pin className="w-3.5 h-3.5" strokeWidth={2} />
                ピン留め
              </div>
              {pinnedChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-[#C5F3E5] text-[#0C8A5F]'
                      : 'hover:bg-[#F9FAFB] text-[#52606D]'
                  }`}
                >
                  {channel.type === 'public' && <Hash className="w-4 h-4" strokeWidth={2} />}
                  {channel.type === 'private' && <Lock className="w-4 h-4" strokeWidth={2} />}
                  {channel.type === 'dm' && (
                    <div className="relative">
                      <User className="w-4 h-4" strokeWidth={2} />
                      {channel.onlineStatus && (
                        <Circle
                          className={`w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 ${statusColors[channel.onlineStatus]} border-2 border-white rounded-full`}
                          strokeWidth={0}
                          fill="currentColor"
                        />
                      )}
                    </div>
                  )}
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8A5F] text-white rounded-full text-xs">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mt-0.5">
                        <span className="truncate">{channel.lastMessage}</span>
                        <span className="ml-2 flex-shrink-0">{channel.lastMessageTime}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Public Channels */}
          {publicChannels.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#7B8794] uppercase">
                <Hash className="w-3.5 h-3.5" strokeWidth={2} />
                チャンネル
              </div>
              {publicChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-[#C5F3E5] text-[#0C8A5F]'
                      : 'hover:bg-[#F9FAFB] text-[#52606D]'
                  }`}
                >
                  <Hash className="w-4 h-4" strokeWidth={2} />
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8A5F] text-white rounded-full text-xs">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mt-0.5">
                        <span className="truncate">{channel.lastMessage}</span>
                        <span className="ml-2 flex-shrink-0">{channel.lastMessageTime}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Private Channels */}
          {privateChannels.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#7B8794] uppercase">
                <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                プライベート
              </div>
              {privateChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-[#C5F3E5] text-[#0C8A5F]'
                      : 'hover:bg-[#F9FAFB] text-[#52606D]'
                  }`}
                >
                  <Lock className="w-4 h-4" strokeWidth={2} />
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8A5F] text-white rounded-full text-xs">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mt-0.5">
                        <span className="truncate">{channel.lastMessage}</span>
                        <span className="ml-2 flex-shrink-0">{channel.lastMessageTime}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Direct Messages */}
          {dmChannels.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#7B8794] uppercase">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                ダイレクトメッセージ
              </div>
              {dmChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-[#C5F3E5] text-[#0C8A5F]'
                      : 'hover:bg-[#F9FAFB] text-[#52606D]'
                  }`}
                >
                  <div className="relative">
                    <User className="w-4 h-4" strokeWidth={2} />
                    {channel.onlineStatus && (
                      <Circle
                        className={`w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 ${statusColors[channel.onlineStatus]} border-2 border-white rounded-full`}
                        strokeWidth={0}
                        fill="currentColor"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8A5F] text-white rounded-full text-xs">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mt-0.5">
                        <span className="truncate">{channel.lastMessage}</span>
                        <span className="ml-2 flex-shrink-0">{channel.lastMessageTime}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentChannel?.type === 'public' && <Hash className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />}
            {currentChannel?.type === 'private' && <Lock className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />}
            {currentChannel?.type === 'dm' && (
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0C8A5F] to-[#0A6F4E] flex items-center justify-center text-white text-sm">
                  {currentChannel.name.charAt(0)}
                </div>
                {currentChannel.onlineStatus && (
                  <Circle
                    className={`w-3 h-3 absolute -bottom-0.5 -right-0.5 ${statusColors[currentChannel.onlineStatus]} border-2 border-white rounded-full`}
                    strokeWidth={0}
                    fill="currentColor"
                  />
                )}
              </div>
            )}
            <div>
              <h3 className="text-[#1F2933]">{currentChannel?.name}</h3>
              {currentChannel?.type === 'dm' && currentChannel.onlineStatus && (
                <p className="text-xs text-[#7B8794]">
                  {currentChannel.onlineStatus === 'online' && 'オンライン'}
                  {currentChannel.onlineStatus === 'away' && '離席中'}
                  {currentChannel.onlineStatus === 'offline' && 'オフライン'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <VideoIcon className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Users className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-[#7B8794]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group hover:bg-[#F9FAFB] -mx-6 px-6 py-3 transition-colors ${
                !message.isRead ? 'bg-[#C5F3E5]/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white flex-shrink-0">
                  {message.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#1F2933] text-sm">
                      {message.userName}
                      {message.userId === 'current-user' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8A5F] text-white rounded text-xs">あなた</span>
                      )}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">{message.timestamp}</span>
                    {message.isEdited && (
                      <span className="text-xs text-[#9CA3AF]">(編集済み)</span>
                    )}
                    {!message.isRead && (
                      <span className="px-2 py-0.5 bg-[#0C8A5F] text-white rounded-full text-xs">新着</span>
                    )}
                  </div>

                  {/* Reply To */}
                  {message.replyTo && (
                    <div className="mb-2 pl-3 border-l-2 border-[#E5E7EB] py-1">
                      <p className="text-xs text-[#7B8794]">
                        <Reply className="w-3 h-3 inline mr-1" strokeWidth={2} />
                        {message.replyTo.userName}への返信
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate">{message.replyTo.content}</p>
                    </div>
                  )}

                  {/* Message Content */}
                  <p className="text-[#52606D] text-sm leading-relaxed mb-2">{message.content}</p>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          {attachment.type === 'file' && <FileText className="w-8 h-8 text-[#7B8794]" strokeWidth={1.5} />}
                          {attachment.type === 'image' && <Image className="w-8 h-8 text-[#7B8794]" strokeWidth={1.5} />}
                          {attachment.type === 'video' && <VideoIcon className="w-8 h-8 text-[#7B8794]" strokeWidth={1.5} />}
                          <div className="flex-1">
                            <p className="text-sm text-[#1F2933]">{attachment.name}</p>
                            <p className="text-xs text-[#9CA3AF]">クリックして開く</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => handleReaction(message.id, reaction.emoji)}
                          className="flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full transition-colors"
                          title={reaction.users.join(', ')}
                        >
                          <span className="text-sm">{reaction.emoji}</span>
                          <span className="text-xs text-[#52606D]">{reaction.count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowEmojiPicker(true)}
                        className="flex items-center justify-center w-7 h-7 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                      </button>
                    </div>
                  )}

                  {/* Message Actions (visible on hover) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-xs text-[#7B8794]">
                      <button
                        onClick={() => setReplyingTo(message)}
                        className="px-2 py-1 hover:bg-white rounded transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5 inline mr-1" strokeWidth={2} />
                        返信
                      </button>
                      <button className="px-2 py-1 hover:bg-white rounded transition-colors">
                        <Smile className="w-3.5 h-3.5 inline mr-1" strokeWidth={2} />
                        リアクション
                      </button>
                      {message.userId === 'current-user' && (
                        <>
                          <button className="px-2 py-1 hover:bg-white rounded transition-colors">
                            <Edit3 className="w-3.5 h-3.5 inline mr-1" strokeWidth={2} />
                            編集
                          </button>
                          <button className="px-2 py-1 hover:bg-white rounded transition-colors text-[#DC2626]">
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" strokeWidth={2} />
                            削除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-[#E5E7EB] p-4">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="mb-3 p-3 bg-[#F9FAFB] rounded-lg flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-[#7B8794] mb-1">
                  <Reply className="w-3 h-3 inline mr-1" strokeWidth={2} />
                  {replyingTo.userName}への返信
                </p>
                <p className="text-sm text-[#52606D] truncate">{replyingTo.content}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-[#E5E7EB] rounded transition-colors"
              >
                <X className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-[#F9FAFB] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#7B8794]">リアクションを選択</p>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 hover:bg-[#E5E7EB] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Selected emoji:', emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl p-2 hover:bg-white rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`${currentChannel?.name}にメッセージを送信...`}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C8A5F] focus:border-transparent resize-none transition-all"
                rows={1}
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors" title="ファイルを添付">
                  <Paperclip className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                </button>
                <button className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors" title="絵文字">
                  <Smile className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                </button>
                <button className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors" title="メンション">
                  <AtSign className="w-4 h-4 text-[#7B8794]" strokeWidth={2} />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="px-5 py-3 bg-[#0C8A5F] hover:bg-[#0A6F4E] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
