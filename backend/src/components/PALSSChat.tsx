import { useState, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, Users, Target, TrendingUp, FileText, Lightbulb } from 'lucide-react';

interface ChatCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  prompt: string;
}

export function PALSSChat() {
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'feminine' | 'palss'>('palss');

  // Detect theme from document
  useEffect(() => {
    // Auto-detect theme from document
    if (document.documentElement.classList.contains('dark')) {
      setCurrentTheme('dark');
    } else if (document.documentElement.classList.contains('feminine')) {
      setCurrentTheme('feminine');
    } else if (document.documentElement.classList.contains('palss')) {
      setCurrentTheme('palss');
    } else {
      setCurrentTheme('light');
    }

    // Optional: Listen for theme changes
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        setCurrentTheme('dark');
      } else if (document.documentElement.classList.contains('feminine')) {
        setCurrentTheme('feminine');
      } else if (document.documentElement.classList.contains('palss')) {
        setCurrentTheme('palss');
      } else {
        setCurrentTheme('light');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const chatCards: ChatCard[] = [
    {
      id: 'request',
      title: 'PALSSに要望を伝える',
      description: 'SNS代行に関するご要望やご相談をお聞かせください',
      icon: MessageCircle,
      prompt: 'PALSSへの要望を詳しく教えてください。どのようなSNS代行サービスをお求めですか？'
    },
    {
      id: 'team',
      title: 'PALSSのチームを深く知る',
      description: '私たちのチーム体制やサポート体制をご紹介します',
      icon: Users,
      prompt: 'PALSSのチーム構成について詳しく知りたいことを教えてください'
    },
    {
      id: 'strategy',
      title: 'SNS戦略を相談する',
      description: '御社に最適なSNS運用戦略を一緒に考えます',
      icon: Target,
      prompt: 'SNS戦略についてお聞かせください。現在のSNS運用状況や目標は？'
    },
    {
      id: 'growth',
      title: '成長施策を提案してもらう',
      description: 'フォロワー増加やエンゲージメント向上の施策を提案',
      icon: TrendingUp,
      prompt: 'SNSアカウントの成長について、現在の課題や目標を教えてください'
    },
    {
      id: 'report',
      title: 'レポート作成を依頼',
      description: '現状分析や競合調査レポートを作成します',
      icon: FileText,
      prompt: 'どのようなレポートが必要ですか？調査したい内容を教えてください'
    },
    {
      id: 'ideas',
      title: 'コンテンツアイデアを相談',
      description: '魅力的な投稿コンテンツのアイデアを提案',
      icon: Lightbulb,
      prompt: 'どのようなコンテンツをお探しですか？業界やターゲット層を教えてください'
    }
  ];

  const handleCardClick = (card: ChatCard) => {
    setIsActive(true);
    setMessages([
      { role: 'assistant', content: card.prompt }
    ]);
    setInputValue('');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!isActive) {
      setIsActive(true);
    }

    const userMessage = inputValue.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInputValue('');

    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('clientId') || undefined;
    const sessionId = params.get('sessionId') || undefined;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          clientId,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = (await response.json()) as { reply?: string };
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || '??????????????????????????',
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '??AI????????????????????????????',
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get background gradient classes based on theme
  const getBackgroundGradient = () => {
    switch (currentTheme) {
      case 'palss':
      case 'light':
        return 'palss-ai-bg';
      case 'dark':
        return 'dark-ai-bg';
      case 'feminine':
        return 'feminine-ai-bg';
      default:
        return 'palss-ai-bg';
    }
  };

  return (
    <div className={`min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-8 relative overflow-hidden ${getBackgroundGradient()}`}>
      {!isActive ? (
        // Initial State - Cards View
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-3" style={{ fontFamily: 'serif' }}>
              PALSS CHAT <span className="text-muted-foreground text-2xl">v0.2</span>
            </h1>
          </div>

          {/* Search Input */}
          <div className="relative mb-16">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="SNS代行について質問する..."
                className="w-full px-6 py-4 pr-14 rounded-full border border-border/30 bg-card/40 backdrop-blur-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card/50 transition-all shadow-lg"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 w-10 h-10 rounded-full bg-foreground/90 backdrop-blur-sm text-background flex items-center justify-center hover:bg-foreground transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="group relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:border-primary/50 hover:bg-card/50 hover:shadow-xl transition-all duration-200 text-left shadow-lg"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-foreground mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            カードを選択するか、上記の検索バーから直接質問してください
          </div>
        </div>
      ) : (
        // Active Chat State
        <div className="w-full max-w-4xl flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg">PALSS CHAT</h2>
                <p className="text-sm text-muted-foreground">AI SNS代行アシスタント</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsActive(false);
                setMessages([]);
              }}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              新しいチャット
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-6 py-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="w-full px-6 py-4 pr-14 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}