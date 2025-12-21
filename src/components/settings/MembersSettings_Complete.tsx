import { Users, Search, UserPlus, Mail, MoreVertical, Crown, Shield, User, Trash2, Edit2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validators } from '../../utils/validation';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  avatar: string;
  department: string;
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
}

interface InviteForm {
  email: string;
  role: 'admin' | 'member' | 'guest';
  message: string;
}

export function MembersSettings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: '',
    role: 'member',
    message: '',
  });

  const [inviteErrors, setInviteErrors] = useState<Record<string, string>>({});

  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: '田中 太郎',
      email: 'tanaka.taro@palss.com',
      role: 'owner',
      avatar: 'TT',
      department: 'マーケティング部',
      joinDate: '2023/01/15',
      status: 'active',
    },
    {
      id: '2',
      name: '佐藤 花子',
      email: 'sato.hanako@palss.com',
      role: 'admin',
      avatar: 'SH',
      department: 'マーケティング部',
      joinDate: '2023/03/20',
      status: 'active',
    },
    {
      id: '3',
      name: '鈴木 一郎',
      email: 'suzuki.ichiro@palss.com',
      role: 'member',
      avatar: 'SI',
      department: 'クリエイティブ部',
      joinDate: '2023/05/10',
      status: 'active',
    },
    {
      id: '4',
      name: '高橋 美咲',
      email: 'takahashi.misaki@palss.com',
      role: 'member',
      avatar: 'TM',
      department: 'クリエイティブ部',
      joinDate: '2023/07/01',
      status: 'active',
    },
    {
      id: '5',
      name: '山田 健太',
      email: 'yamada.kenta@palss.com',
      role: 'member',
      avatar: 'YK',
      department: 'セールス部',
      joinDate: '2023/09/15',
      status: 'active',
    },
    {
      id: '6',
      name: '小林 由美',
      email: 'kobayashi.yumi@palss.com',
      role: 'guest',
      avatar: 'KY',
      department: '外部パートナー',
      joinDate: '2023/11/01',
      status: 'active',
    },
    {
      id: '7',
      name: '伊藤 大輔',
      email: 'ito.daisuke@palss.com',
      role: 'member',
      avatar: 'ID',
      department: 'エディター部',
      joinDate: '2024/01/10',
      status: 'pending',
    },
  ]);

  // Load saved members
  useEffect(() => {
    const savedMembers = storage.get<Member[]>(STORAGE_KEYS.MEMBERS);
    if (savedMembers && savedMembers.length > 0) {
      setMembers(savedMembers);
    }
  }, []);

  // Save members when changed
  useEffect(() => {
    storage.set(STORAGE_KEYS.MEMBERS, members);
  }, [members]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return { label: 'オーナー', icon: Crown, color: 'bg-amber-100 text-amber-700' };
      case 'admin':
        return { label: '管理者', icon: Shield, color: 'bg-blue-100 text-blue-700' };
      case 'member':
        return { label: 'メンバー', icon: User, color: 'bg-green-100 text-green-700' };
      case 'guest':
        return { label: 'ゲスト', icon: User, color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: 'メンバー', icon: User, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const validateInviteForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const emailValidation = validators.email(inviteForm.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!;
    }

    // Check if email already exists
    if (members.some(m => m.email === inviteForm.email)) {
      errors.email = 'このメールアドレスは既に登録されています';
    }

    setInviteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendInvite = async () => {
    if (!validateInviteForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate initials
      const nameParts = inviteForm.email.split('@')[0].split('.');
      const initials = nameParts.map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
      
      const newMember: Member = {
        id: Date.now().toString(),
        name: inviteForm.email.split('@')[0].replace('.', ' '),
        email: inviteForm.email,
        role: inviteForm.role,
        avatar: initials,
        department: '未設定',
        joinDate: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/'),
        status: 'pending',
      };

      setMembers([...members, newMember]);
      toast.success(`${inviteForm.email} に招待メールを送信しました`);
      
      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'member', message: '' });
      setInviteErrors({});
    } catch (error) {
      toast.error('招待の送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'member' | 'guest') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    if (member.role === 'owner') {
      toast.error('オーナーの役割は変更できません');
      return;
    }

    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    
    toast.success(`${member.name} の役割を変更しました`);
    setShowMemberMenu(null);
  };

  const handleResendInvite = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`${member.email} に招待メールを再送信しました`);
      setShowMemberMenu(null);
    } catch (error) {
      toast.error('招待の再送信に失敗しました');
    }
  };

  const handleDeleteMember = (member: Member) => {
    if (member.role === 'owner') {
      toast.error('オーナーは削除できません');
      return;
    }
    setMemberToDelete(member);
    setShowDeleteDialog(true);
    setShowMemberMenu(null);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      toast.success(`${memberToDelete.name} を削除しました`);
      setShowDeleteDialog(false);
      setMemberToDelete(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: members.length,
    admins: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-foreground text-2xl">メンバー</h1>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              メンバーを招待
            </button>
          </div>
          <p className="text-muted-foreground text-sm">チームメンバーの管理と招待</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{stats.total}</div>
            <div className="text-xs text-muted-foreground">総メンバー数</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{stats.admins}</div>
            <div className="text-xs text-muted-foreground">管理者</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{stats.active}</div>
            <div className="text-xs text-muted-foreground">アクティブ</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl text-card-foreground mb-1">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">招待中</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="メンバーを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべての役割</option>
              <option value="owner">オーナー</option>
              <option value="admin">管理者</option>
              <option value="member">メンバー</option>
              <option value="guest">ゲスト</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">アクティブ</option>
              <option value="pending">招待中</option>
              <option value="inactive">非アクティブ</option>
            </select>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    メンバー
                  </th>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    部署
                  </th>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    役割
                  </th>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    参加日
                  </th>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="text-right px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((member) => {
                  const roleBadge = getRoleBadge(member.role);
                  const RoleIcon = roleBadge.icon;

                  return (
                    <tr key={member.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: '#124E37' }}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="text-sm text-card-foreground">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-card-foreground">{member.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${roleBadge.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{member.joinDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : member.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {member.status === 'active' ? 'アクティブ' : member.status === 'pending' ? '招待中' : '非アクティブ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {showMemberMenu === member.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowMemberMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-20 py-1">
                              {member.role !== 'owner' && (
                                <>
                                  <button
                                    onClick={() => handleChangeRole(member.id, 'admin')}
                                    disabled={member.role === 'admin'}
                                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <Shield className="w-4 h-4" />
                                    管理者に変更
                                  </button>
                                  <button
                                    onClick={() => handleChangeRole(member.id, 'member')}
                                    disabled={member.role === 'member'}
                                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <User className="w-4 h-4" />
                                    メンバーに変更
                                  </button>
                                  <button
                                    onClick={() => handleChangeRole(member.id, 'guest')}
                                    disabled={member.role === 'guest'}
                                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <User className="w-4 h-4" />
                                    ゲストに変更
                                  </button>
                                  <div className="border-t border-border my-1" />
                                </>
                              )}
                              {member.status === 'pending' && (
                                <button
                                  onClick={() => handleResendInvite(member.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  招待を再送信
                                </button>
                              )}
                              {member.role !== 'owner' && (
                                <button
                                  onClick={() => handleDeleteMember(member)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  削除
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={() => setShowInviteModal(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-[101] p-6">
              <h3 className="text-lg text-card-foreground mb-4">メンバーを招待</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">メールアドレス *</label>
                  <input
                    type="email"
                    placeholder="example@palss.com"
                    value={inviteForm.email}
                    onChange={(e) => {
                      setInviteForm({ ...inviteForm, email: e.target.value });
                      if (inviteErrors.email) {
                        setInviteErrors({ ...inviteErrors, email: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      inviteErrors.email ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {inviteErrors.email && (
                    <p className="text-xs text-red-600 mt-1">{inviteErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">役割</label>
                  <select 
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="member">メンバー</option>
                    <option value="admin">管理者</option>
                    <option value="guest">ゲスト</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">メッセージ（オプション）</label>
                  <textarea
                    rows={3}
                    placeholder="招待メッセージを追加..."
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteForm({ email: '', role: 'member', message: '' });
                    setInviteErrors({});
                  }}
                  className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
                >
                  キャンセル
                </button>
                <button 
                  onClick={handleSendInvite}
                  disabled={isSending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? '送信中...' : '招待を送信'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="メンバーを削除しますか？"
          message={`${memberToDelete?.name} をチームから削除します。この操作は取り消せません。`}
          confirmLabel="削除"
          cancelLabel="キャンセル"
          variant="danger"
          onConfirm={confirmDeleteMember}
          onCancel={() => {
            setShowDeleteDialog(false);
            setMemberToDelete(null);
          }}
        />
      </div>
    </div>
  );
}
