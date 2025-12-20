import { ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react';
import { useState } from 'react';
import { LoginModal } from './LoginModal';

interface LandingPageProps {
  onLogin: () => void;
  onClientSignup?: () => void;
  theme: 'light' | 'dark' | 'feminine' | 'palss';
}

export function LandingPage({ onLogin, onClientSignup, theme }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    onLogin();
  };

  const features = [
    {
      icon: Shield,
      title: 'セキュアな案件管理',
      description: 'Sales・Direction・Editor・Creator・Client 全てのワークフローを一元管理',
    },
    {
      icon: Zap,
      title: 'AI搭載システム',
      description: 'PALSS AI SYSTEMが提案・リサーチ・制作をサポート',
    },
    {
      icon: Users,
      title: '役割別アクセス',
      description: '社内メンバー・クライアントそれぞれに最適化されたインターフェース',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl tracking-tight">PALSS SYSTEM</span>
          </div>

          {/* Login Button */}
          <button
            onClick={onLogin}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Content */}
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>SNS代行会社向け統合管理システム</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl mb-6 tracking-tight leading-tight">
              すべてのワークフローを
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                一つのシステムで
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              PALSS SYSTEMは、SNS代行業務の<span className="text-foreground">営業・ディレクション・編集・撮影・クライアント管理</span>を
              シームレスに統合する次世代SaaSプラットフォームです
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <span>システムにログイン</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>エンタープライズセキュリティ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI搭載</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7サポート</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4">
                SNS代行業務に特化した機能
              </h2>
              <p className="text-lg text-muted-foreground">
                複雑なワークフローをシンプルに、チーム全体の生産性を最大化
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Boards Overview */}
        <section className="relative py-24 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl mb-4">
                役割に応じた専用ボード
              </h2>
              <p className="text-lg text-muted-foreground">
                社内メンバー・クライアントそれぞれに最適化されたインターフェース
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Sales Board', color: 'bg-blue-500', desc: '営業管理' },
                { name: 'Direction Board', color: 'bg-purple-500', desc: 'ディレクション' },
                { name: 'Editor Board', color: 'bg-green-500', desc: '編集業務' },
                { name: 'Creator Board', color: 'bg-orange-500', desc: '撮影管理' },
                { name: 'Control Board', color: 'bg-red-500', desc: '経営俯瞰' },
                { name: 'Client Board', color: 'bg-pink-500', desc: 'クライアント' },
                { name: 'PALSS AI', color: 'bg-gradient-to-r from-purple-500 to-pink-500', desc: 'AI統合' },
              ].map((board, index) => (
                <div
                  key={index}
                  className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all"
                >
                  <div className={`w-3 h-3 rounded-full ${board.color} mb-4`} />
                  <h3 className="text-sm mb-1">{board.name}</h3>
                  <p className="text-xs text-muted-foreground">{board.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl mb-6">
              今すぐPALSS SYSTEMを
              <br />
              体験してください
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              アカウントをお持ちの方は、ログインして業務を開始できます
            </p>
            <button
              onClick={handleLoginClick}
              className="px-10 py-5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg font-medium inline-flex items-center gap-2 shadow-xl shadow-primary/20"
            >
              <span>ログインして開始</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 PALSS SYSTEM. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">プライバシーポリシー</button>
              <button className="hover:text-foreground transition-colors">利用規約</button>
              <button className="hover:text-foreground transition-colors">お問い合わせ</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}