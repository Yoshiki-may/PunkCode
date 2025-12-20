import { useState } from 'react';
import { Send, UserPlus, Mail, Shield, CheckCircle, Clock, XCircle, Trash2, Copy } from 'lucide-react';

type Role = 'sales' | 'direction' | 'editor' | 'creator' | 'admin' | 'client';

interface InvitedUser {
  id: string;
  email: string;
  role: Role;
  status: 'pending' | 'registered' | 'expired';
  invitedAt: string;
  invitedBy: string;
}

export function TeamInvite() {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('sales');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles: { value: Role; label: string; description: string; color: string }[] = [
    { 
      value: 'sales', 
      label: '営業', 
      description: 'Sales Board - 商談・案件管理',
      color: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
    { 
      value: 'direction', 
      label: 'ディレクター', 
      description: 'Direction Board - プロジェクト統括',
      color: 'bg-purple-500/10 text-purple-700 border-purple-200'
    },
    { 
      value: 'editor', 
      label: '編集者', 
      description: 'Editor Board - 動画・画像編集',
      color: 'bg-green-500/10 text-green-700 border-green-200'
    },
    { 
      value: 'creator', 
      label: 'クリエイター', 
      description: 'Creator Board - 撮影・制作',
      color: 'bg-orange-500/10 text-orange-700 border-orange-200'
    },
    { 
      value: 'admin', 
      label: '管理者', 
      description: 'Control Board - システム管理・俯瞰',
      color: 'bg-red-500/10 text-red-700 border-red-200'
    },
    { 
      value: 'client', 
      label: 'クライアント', 
      description: 'Client Board - 外部クライアント',
      color: 'bg-pink-500/10 text-pink-700 border-pink-200'
    },
  ];

  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([
    {
      id: '1',
      email: 'tanaka@example.com',
      role: 'sales',
      status: 'registered',
      invitedAt: '2024-12-15 10:30',
      invitedBy: '山田 太郎',
    },
    {
      id: '2',
      email: 'sato@example.com',
      role: 'direction',
      status: 'registered',
      invitedAt: '2024-12-14 14:20',
      invitedBy: '山田 太郎',
    },
    {
      id: '3',
      email: 'yamada.editor@example.com',
      role: 'editor',
      status: 'pending',
      invitedAt: '2024-12-19 09:15',
      invitedBy: '山田 太郎',
    },
    {
      id: '4',
      email: 'suzuki.creator@example.com',
      role: 'creator',
      status: 'pending',
      invitedAt: '2024-12-18 16:45',
      invitedBy: '佐藤 花子',
    },
    {
      id: '5',
      email: 'old.invite@example.com',
      role: 'sales',
      status: 'expired',
      invitedAt: '2024-11-20 11:00',
      invitedBy: '山田 太郎',
    },
  ]);

  const getRoleInfo = (role: Role) => {
    return roles.find(r => r.value === role) || roles[0];
  };

  const getStatusInfo = (status: InvitedUser['status']) => {
    switch (status) {
      case 'pending':
        return { label: '招待中', icon: Clock, color: 'bg-orange-500/10 text-orange-700 border-orange-200' };
      case 'registered':
        return { label: '登録済', icon: CheckCircle, color: 'bg-green-500/10 text-green-700 border-green-200' };
      case 'expired':
        return { label: '期限切れ', icon: XCircle, color: 'bg-gray-500/10 text-gray-700 border-gray-200' };
    }
  };

  const handleSendInvite = async () => {
    if (!email || !email.includes('@')) {
      alert('有効なメールアドレスを入力してください');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: InvitedUser = {
      id: Date.now().toString(),
      email,
      role: selectedRole,
      status: 'pending',
      invitedAt: new Date().toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      invitedBy: '山田 太郎',
    };

    setInvitedUsers([newUser, ...invitedUsers]);
    setEmail('');
    setIsSubmitting(false);
  };

  const handleDeleteInvite = (id: string) => {
    if (confirm('この招待を削除してもよろしいですか？')) {
      setInvitedUsers(invitedUsers.filter(u => u.id !== id));
    }
  };

  const handleResendInvite = (id: string) => {
    setInvitedUsers(invitedUsers.map(u => 
      u.id === id 
        ? { ...u, status: 'pending' as const, invitedAt: new Date().toLocaleString('ja-JP') }
        : u
    ));
  };

  const handleCopyInviteLink = (email: string) => {
    const inviteLink = `https://palss-system.com/invite?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(inviteLink);
    // You could add a toast notification here
  };

  const stats = {
    total: invitedUsers.length,
    pending: invitedUsers.filter(u => u.status === 'pending').length,
    registered: invitedUsers.filter(u => u.status === 'registered').length,
    expired: invitedUsers.filter(u => u.status === 'expired').length,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-foreground mb-2">Team Members</h1>
        <p className="text-sm text-muted-foreground">社内メンバーの招待・権限管理</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1">{stats.total}</div>
          <div className="text-sm text-muted-foreground">総招待数</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">招待中</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-green-600">{stats.registered}</div>
          <div className="text-sm text-muted-foreground">登録済</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl mb-1 text-gray-600">{stats.expired}</div>
          <div className="text-sm text-muted-foreground">期限切れ</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Invite Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-lg">新規招待</h2>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm mb-2">
                メールアドレス
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-2">
                役割
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{role.label}</span>
                        <span className={`px-2 py-0.5 border rounded-full text-xs ${role.color}`}>
                          {role.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSendInvite}
              disabled={isSubmitting || !email}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>送信中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>招待を送信</span>
                </>
              )}
            </button>

            {/* Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  招待メールには登録用リンクが含まれます。リンクの有効期限は7日間です。
                  役割に応じて適切なBoardへのアクセス権限が付与されます。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Invited Users List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-lg">招待済みユーザー</h2>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {invitedUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              const statusInfo = getStatusInfo(user.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={user.id}
                  className="p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm mb-1 truncate">{user.email}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 border rounded-full text-xs ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                        <span className={`px-2 py-0.5 border rounded-full text-xs flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    <div>招待日時: {user.invitedAt}</div>
                    <div>招待者: {user.invitedBy}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResendInvite(user.id)}
                          className="flex-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs"
                        >
                          再送信
                        </button>
                        <button
                          onClick={() => handleCopyInviteLink(user.email)}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-lg transition-colors"
                          title="招待リンクをコピー"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    {user.status === 'expired' && (
                      <button
                        onClick={() => handleResendInvite(user.id)}
                        className="flex-1 px-3 py-1.5 bg-orange-500/10 text-orange-700 rounded-lg hover:bg-orange-500/20 transition-colors text-xs"
                      >
                        再招待
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteInvite(user.id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-700 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {invitedUsers.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">招待済みユーザーはまだいません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
