import { useState } from 'react';
import { LoginModal } from './LoginModal';
import palssLogo from 'figma:asset/869398b811842ccb3602a1752f76d11ea2045851.png';
import { Layers, Sparkles, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onClientSignup?: () => void;
  theme: 'light' | 'dark' | 'feminine' | 'palss';
}

export function LandingPage({ onLogin, theme }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d5f4f]/10 via-transparent to-[#3a7a63]/10" />
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#2d5f4f]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#3a7a63]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center">
          {/* Main Heading - PALSS統合管理システム */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-[#2d5f4f] via-[#3a7a63] to-[#2d5f4f] bg-clip-text text-transparent font-bold">
                PALSS
              </span>
              <span className="text-[#1a1a1a] dark:text-white font-bold"> SYSTEM</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#6b7280] dark:text-[#9ca3af] mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            PALSS独自の革新的プラットフォーム
          </p>

          {/* Login Button */}
          <button
            onClick={handleLoginClick}
            className="group px-10 py-3.5 bg-[#2d5f4f] hover:bg-[#234739] text-white rounded-xl transition-all font-medium inline-flex items-center gap-3 shadow-lg hover:shadow-xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 hover:scale-105"
          >
            <span>システムログイン</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            {/* Card 1 - オールインワン統合 */}
            <div className="group bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-md border border-[#e5e7eb] dark:border-[#3a3a3a] rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f4f] to-[#3a7a63] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white mb-2">オールインワン統合</h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">業務フロー全体を一元管理</p>
            </div>

            {/* Card 2 - AI統合システム */}
            <div className="group bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-md border border-[#e5e7eb] dark:border-[#3a3a3a] rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f4f] to-[#3a7a63] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white mb-2">AI統合システム</h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">提案・分析・自動化をサポート</p>
            </div>

            {/* Card 3 - リアルタイム同期 */}
            <div className="group bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-md border border-[#e5e7eb] dark:border-[#3a3a3a] rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f4f] to-[#3a7a63] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white mb-2">リアルタイム同期</h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">チーム全体でシームレスに共有</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 仮画面遷移ボタン（開発用） */}
      <button
        onClick={onLogin}
        className="fixed bottom-6 right-6 px-6 py-3 bg-[#2d5f4f] hover:bg-[#234739] text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium z-50 hover:scale-105 flex items-center gap-2"
      >
        <span>画面遷移（開発用）</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}