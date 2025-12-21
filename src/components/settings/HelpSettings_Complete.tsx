import { HelpCircle, Book, Video, MessageCircle, CheckCircle, ExternalLink, Search, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from '../ui/Toast';
import { validators } from '../../utils/validation';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function HelpSettings() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'PALSS SYSTEMとは何ですか？',
      answer: 'PALSS SYSTEMは、SNS代行会社向けのオールインワン統合ダッシュボードです。クライアント管理、コンテンツ制作、承認フロー、スケジュール管理など、SNS運用に必要なすべての機能を一つのプラットフォームで提供します。',
      category: '基本',
    },
    {
      id: '2',
      question: 'チームメンバーを招待するにはどうすればよいですか？',
      answer: '設定 > メンバー から「メンバーを招待」ボタンをクリックし、招待したいメンバーのメールアドレスと役割を入力して招待メールを送信できます。',
      category: 'チーム管理',
    },
    {
      id: '3',
      question: 'クライアントを追加する方法は？',
      answer: 'Sales BoardまたはDirection Boardのサイドバーから「クライアント管理」を選択し、「新規クライアント」ボタンをクリックして必要な情報を入力してください。',
      category: 'クライアント',
    },
    {
      id: '4',
      question: 'コンテンツの承認フローはどのように機能しますか？',
      answer: 'Editor Boardでコンテンツを作成後、Review Queueに追加されます。承認者はReview Queueから内容を確認し、承認または却下を選択できます。承認されたコンテンツは自動的に次のステージに進みます。',
      category: 'ワークフロー',
    },
    {
      id: '5',
      question: 'PALSS AIの機能について教えてください',
      answer: 'PALSS AIは、コンテンツ生成、画像編集、分析レポート作成など、様々な作業を自動化するAIアシスタントです。各ボードから「PALSS AI」メニューにアクセスして利用できます。',
      category: 'AI機能',
    },
    {
      id: '6',
      question: 'データのエクスポートは可能ですか？',
      answer: 'はい、各ボードのダッシュボードや分析画面からデータをCSV、PDF、Excel形式でエクスポートできます。また、設定 > プライバシー＆セキュリティ からアカウントの全データをダウンロードすることも可能です。',
      category: 'データ管理',
    },
    {
      id: '7',
      question: '通知設定をカスタマイズできますか？',
      answer: '設定 > 通知設定 から、メール、デスクトップ、モバイルの各通知を細かくカスタマイズできます。カテゴリー別に通知のオン/オフを切り替えたり、おやすみモードを設定することも可能です。',
      category: '設定',
    },
    {
      id: '8',
      question: '外部サービスとの連携方法は？',
      answer: '設定 > 連携サービス から、Instagram、Twitter、Facebookなどの各種SNSプラットフォームや、Google Analytics、Slackなどのツールと連携できます。各サービスの「連携」ボタンをクリックして認証を完了してください。',
      category: '連携',
    },
    {
      id: '9',
      question: 'パスワードを忘れた場合はどうすればよいですか？',
      answer: 'ログイン画面の「パスワードをお忘れですか？」リンクをクリックし、登録済みのメールアドレスを入力してください。パスワードリセット用のリンクが送信されます。',
      category: 'セキュリティ',
    },
    {
      id: '10',
      question: '料金プランの変更は可能ですか？',
      answer: 'はい、設定 > 請求情報 からいつでもプランを変更できます。上位プランへのアップグレードは即時反映され、ダウングレードは次回更新日から適用されます。',
      category: '料金',
    },
  ];

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'PALSS SYSTEMの始め方',
      description: '初期設定からチーム招待、最初のプロジェクト作成までを解説',
      duration: '5分',
      thumbnail: '🚀',
      category: '基本',
    },
    {
      id: '2',
      title: 'クライアント管理の完全ガイド',
      description: 'クライアント情報の登録、管理、レポート作成の方法',
      duration: '8分',
      thumbnail: '👥',
      category: 'クライアント',
    },
    {
      id: '3',
      title: 'コンテンツ制作ワークフロー',
      description: 'Editor BoardとCreator Boardを使った効率的な制作フロー',
      duration: '12分',
      thumbnail: '🎨',
      category: 'ワークフロー',
    },
    {
      id: '4',
      title: 'PALSS AIの活用方法',
      description: 'AI機能を使った自動化とコンテンツ生成のテクニック',
      duration: '10分',
      thumbnail: '🤖',
      category: 'AI',
    },
    {
      id: '5',
      title: 'スケジュール管理マスター',
      description: 'カレンダー機能を使った投稿スケジュールの最適化',
      duration: '7分',
      thumbnail: '📅',
      category: 'スケジュール',
    },
    {
      id: '6',
      title: '分析レポートの読み方',
      description: 'KPIダッシュボードとレポート機能の使い方',
      duration: '9分',
      thumbnail: '📊',
      category: '分析',
    },
  ];

  const validateContactForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameValidation = validators.required(contactForm.name, 'お名前');
    if (!nameValidation.valid) {
      errors.name = nameValidation.error!;
    }

    const emailValidation = validators.email(contactForm.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!;
    }

    const subjectValidation = validators.required(contactForm.subject, '件名');
    if (!subjectValidation.valid) {
      errors.subject = subjectValidation.error!;
    }

    const messageValidation = validators.required(contactForm.message, 'メッセージ');
    if (!messageValidation.valid) {
      errors.message = messageValidation.error!;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContactForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('お問い合わせを送信しました。担当者より3営業日以内にご連絡いたします。');
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setFormErrors({});
    } catch (error) {
      toast.error('送信に失敗しました。しばらくしてから再度お試しください。');
    } finally {
      setIsSending(false);
    }
  };

  const filteredFAQs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl mb-2">ヘルプ＆サポート</h1>
          <p className="text-muted-foreground text-sm">よくある質問とサポート情報</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <a
            href="https://docs.palss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow text-center group"
          >
            <Book className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-card-foreground mb-1">ドキュメント</h3>
            <p className="text-xs text-muted-foreground mb-2">詳細なマニュアル</p>
            <ExternalLink className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
          
          <a
            href="https://videos.palss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow text-center group"
          >
            <Video className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-card-foreground mb-1">動画チュートリアル</h3>
            <p className="text-xs text-muted-foreground mb-2">ビデオで学ぶ</p>
            <ExternalLink className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
          
          <a
            href="https://community.palss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow text-center group"
          >
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-card-foreground mb-1">コミュニティ</h3>
            <p className="text-xs text-muted-foreground mb-2">他のユーザーと交流</p>
            <ExternalLink className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
          
          <a
            href="https://status.palss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow text-center group"
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-card-foreground mb-1">システム状態</h3>
            <p className="text-xs text-muted-foreground mb-2">稼働状況を確認</p>
            <ExternalLink className="w-4 h-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>

        {/* FAQ Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">よくある質問</h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-2">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors text-left"
                >
                  <div className="flex-1">
                    <span className="text-sm text-card-foreground">{faq.question}</span>
                    <span className="ml-2 text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {faq.category}
                    </span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tutorials Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">チュートリアル動画</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{tutorial.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="text-sm text-card-foreground mb-1">{tutorial.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{tutorial.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                        {tutorial.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">お問い合わせ</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            解決しない問題がございましたら、お気軽にお問い合わせください。
          </p>
          
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">お名前 *</label>
                <input
                  type="text"
                  placeholder="田中 太郎"
                  value={contactForm.name}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, name: e.target.value });
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: '' });
                    }
                  }}
                  className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.name ? 'border-red-500' : 'border-border'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">メールアドレス *</label>
                <input
                  type="email"
                  placeholder="tanaka@example.com"
                  value={contactForm.email}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, email: e.target.value });
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: '' });
                    }
                  }}
                  className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-2">件名 *</label>
              <input
                type="text"
                placeholder="お問い合わせ内容の要約"
                value={contactForm.subject}
                onChange={(e) => {
                  setContactForm({ ...contactForm, subject: e.target.value });
                  if (formErrors.subject) {
                    setFormErrors({ ...formErrors, subject: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  formErrors.subject ? 'border-red-500' : 'border-border'
                }`}
              />
              {formErrors.subject && (
                <p className="text-xs text-red-600 mt-1">{formErrors.subject}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-2">メッセージ *</label>
              <textarea
                rows={5}
                placeholder="お問い合わせ内容を詳しくご記入ください..."
                value={contactForm.message}
                onChange={(e) => {
                  setContactForm({ ...contactForm, message: e.target.value });
                  if (formErrors.message) {
                    setFormErrors({ ...formErrors, message: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                  formErrors.message ? 'border-red-500' : 'border-border'
                }`}
              />
              {formErrors.message && (
                <p className="text-xs text-red-600 mt-1">{formErrors.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSending ? '送信中...' : '送信する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
