import { User, Bell, Shield, Globe, Smartphone } from 'lucide-react';

export function ClientSettingsView() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground">アカウント設定と環境設定</p>
      </div>

      {/* Account Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg">アカウント情報</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">会社名</label>
            <input
              type="text"
              defaultValue="株式会社サンプル"
              className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">担当者名</label>
            <input
              type="text"
              defaultValue="山田 太郎"
              className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">メールアドレス</label>
            <input
              type="email"
              defaultValue="yamada@sample.co.jp"
              className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">電話番号</label>
            <input
              type="tel"
              defaultValue="03-1234-5678"
              className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg">通知設定</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm mb-1">投稿承認リクエスト</div>
              <div className="text-xs text-muted-foreground">新しい投稿の承認が必要な時に通知</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm mb-1">新しいメッセージ</div>
              <div className="text-xs text-muted-foreground">ディレクターからメッセージが届いた時</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm mb-1">レポート公開</div>
              <div className="text-xs text-muted-foreground">月次レポートが公開された時</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm mb-1">週次サマリー</div>
              <div className="text-xs text-muted-foreground">毎週月曜日に前週のサマリーを受信</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg">連携SNSアカウント</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-600 text-lg">
                📷
              </div>
              <div>
                <div className="text-sm mb-1">Instagram</div>
                <div className="text-xs text-muted-foreground">@sample_company</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">接続済み</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 text-lg">
                🐦
              </div>
              <div>
                <div className="text-sm mb-1">Twitter</div>
                <div className="text-xs text-muted-foreground">@sample_company</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">接続済み</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700/10 rounded-lg flex items-center justify-center text-blue-700 text-lg">
                📘
              </div>
              <div>
                <div className="text-sm mb-1">Facebook</div>
                <div className="text-xs text-muted-foreground">Sample Company</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">接続済み</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg">セキュリティ</h2>
        </div>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-muted hover:bg-muted/70 rounded-lg text-left text-sm transition-colors">
            パスワードを変更
          </button>
          <button className="w-full px-4 py-3 bg-muted hover:bg-muted/70 rounded-lg text-left text-sm transition-colors">
            二段階認証を設定
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg">言語設定</h2>
        </div>
        <select className="w-full px-4 py-2 bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all">
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          変更を保存
        </button>
      </div>
    </div>
  );
}
