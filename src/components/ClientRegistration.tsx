import { useState } from 'react';
import { Building2, User, Mail, Lock, CheckCircle, Shield, BarChart3, MessageSquare, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ClientRegistrationProps {
  onComplete: () => void;
  onBackToLanding: () => void;
  theme: 'light' | 'dark' | 'feminine' | 'palss';
}

export function ClientRegistration({ onComplete, onBackToLanding, theme }: ClientRegistrationProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    personName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const features = [
    {
      icon: BarChart3,
      title: 'リアルタイムレポート',
      description: 'SNS運用の成果を数値で確認。投稿パフォーマンスを常に可視化',
    },
    {
      icon: MessageSquare,
      title: '担当者との直接連絡',
      description: 'チャット機能で迅速なコミュニケーション。レスポンスタイムを最小化',
    },
    {
      icon: CheckCircle,
      title: 'コンテンツ承認',
      description: '投稿前のプレビュー・承認。安心して運用を任せられる体制',
    },
    {
      icon: Shield,
      title: 'セキュアな環境',
      description: 'エンタープライズレベルのセキュリティ。データは厳重に保護',
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名を入力してください';
    }

    if (!formData.personName.trim()) {
      newErrors.personName = '担当者名を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード（確認）を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear form and complete registration
    setIsSubmitting(false);
    onComplete();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo - Clickable to go back to landing */}
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl tracking-tight">PALSS SYSTEM</span>
          </button>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground">
            アカウント登録
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
          <div className="w-full max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Registration Form */}
              <div>
                {/* Title */}
                <div className="mb-8">
                  <h1 className="text-3xl mb-3">クライアントアカウント登録</h1>
                  <p className="text-muted-foreground leading-relaxed">
                    PALSS SYSTEMへようこそ。<br />
                    アカウントを作成して、SNS運用の可視化と効率化を始めましょう。
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm mb-2">
                      会社名
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="株式会社サンプル"
                        className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.companyName ? 'border-red-500' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Person Name */}
                  <div>
                    <label className="block text-sm mb-2">
                      担当者名
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.personName}
                        onChange={(e) => handleInputChange('personName', e.target.value)}
                        placeholder="山田 太郎"
                        className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.personName ? 'border-red-500' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors.personName && (
                      <p className="text-xs text-red-500 mt-1">{errors.personName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm mb-2">
                      メールアドレス
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@company.com"
                        className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.email ? 'border-red-500' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm mb-2">
                      パスワード
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="8文字以上"
                        className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.password ? 'border-red-500' : 'border-border'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm mb-2">
                      パスワード（確認）
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="パスワードを再入力"
                        className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-border'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      アカウント登録により、PALSS SYSTEMの
                      <button type="button" className="text-primary hover:underline mx-1">利用規約</button>
                      および
                      <button type="button" className="text-primary hover:underline mx-1">プライバシーポリシー</button>
                      に同意したものとみなされます。
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>登録中...</span>
                      </>
                    ) : (
                      <>
                        <span>アカウントを作成</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    すでにアカウントをお持ちの方は
                    <button className="text-primary hover:underline ml-1">
                      ログイン
                    </button>
                  </p>
                </div>
              </div>

              {/* Right: Benefits & Next Steps */}
              <div className="lg:sticky lg:top-24">
                {/* What You'll Get */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h2 className="text-xl mb-6">登録後にできること</h2>
                  
                  <div className="space-y-6 mb-8">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next Steps */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm mb-4 text-muted-foreground">登録後の流れ</h3>
                    <div className="space-y-3">
                      {[
                        '専用ダッシュボードにアクセス',
                        '担当者からウェルカムメッセージが届く',
                        'プロジェクトとレポートを確認',
                        'コンテンツ承認フローを開始',
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground">SSL暗号化通信</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground">24/7サポート</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              © 2024 PALSS SYSTEM. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors">お問い合わせ</button>
              <button className="hover:text-foreground transition-colors">ヘルプ</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}