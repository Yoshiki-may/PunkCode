import { Moon, Sun, Sparkles, Leaf } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
  activeSection?: string;
  theme?: 'light' | 'dark' | 'feminine' | 'palss';
  onThemeChange?: (theme: 'light' | 'dark' | 'feminine' | 'palss') => void;
}

export function Settings({ isDarkMode, onDarkModeToggle, activeSection = 'appearance', theme = 'light', onThemeChange }: SettingsProps) {
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-foreground text-2xl mb-2">設定</h1>
          <p className="text-muted-foreground text-sm">アプリケーションの設定を管理</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div>
              <h2 className="text-card-foreground mb-4">外観</h2>
              
              {/* Theme Selection */}
              <div className="space-y-4">
                <div className="py-3">
                  <div className="mb-2">
                    <div className="text-sm text-card-foreground">カラーモード</div>
                    <div className="text-xs text-muted-foreground">
                      お好みのテーマを選択してください
                    </div>
                  </div>
                </div>

                {/* Theme Preview Grid - 3 Columns */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {/* Palss Mode */}
                  <button
                    onClick={() => onThemeChange?.('palss')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'palss'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm">PALSS</span>
                    </div>
                    <div 
                      className="rounded-md p-3 space-y-2 border"
                      style={{
                        background: '#FAFAFA',
                        borderColor: 'rgba(164, 169, 167, 0.2)'
                      }}
                    >
                      <div className="h-2 rounded w-3/4" style={{ background: '#124E37' }} />
                      <div className="h-2 rounded w-1/2" style={{ background: '#D0E5AB' }} />
                      <div className="h-2 rounded w-2/3" style={{ background: '#B4CD89' }} />
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    onClick={() => onThemeChange?.('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm">Dark</span>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 space-y-2">
                      <div className="h-2 bg-gray-700 rounded w-3/4" />
                      <div className="h-2 bg-gray-700 rounded w-1/2" />
                      <div className="h-2 bg-gray-700 rounded w-2/3" />
                    </div>
                  </button>

                  {/* Feminine Mode */}
                  <button
                    onClick={() => onThemeChange?.('feminine')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'feminine'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4" strokeWidth={2} />
                      <span className="text-sm">Feminine</span>
                    </div>
                    <div 
                      className="rounded-md p-3 space-y-2"
                      style={{
                        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF0F5 50%, #FFF5FA 100%)'
                      }}
                    >
                      <div className="h-2 rounded w-3/4" style={{ background: '#E8739E' }} />
                      <div className="h-2 rounded w-1/2" style={{ background: '#F8BBD0' }} />
                      <div className="h-2 rounded w-2/3" style={{ background: '#FCE4EC' }} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-card-foreground mb-4">プロフィール</h2>
              <div className="text-sm text-muted-foreground">
                プロフィール設定は準備中です
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-card-foreground mb-4">通知</h2>
              <div className="text-sm text-muted-foreground">
                通知設定は準備中です
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}