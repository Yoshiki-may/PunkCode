import { Shield, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validators } from '../../utils/validation';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
  isSystem: boolean;
}

interface RoleForm {
  name: string;
  description: string;
  permissions: string[];
}

export function PermissionsSettings() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [roleForm, setRoleForm] = useState<RoleForm>({
    name: '',
    description: '',
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'オーナー',
      description: 'すべての機能にアクセス可能',
      memberCount: 1,
      permissions: ['all'],
      isSystem: true,
    },
    {
      id: '2',
      name: '管理者',
      description: 'チーム管理と設定変更が可能',
      memberCount: 2,
      permissions: ['manage_team', 'manage_settings', 'view_analytics', 'create_projects', 'edit_content', 'approve_content', 'manage_clients'],
      isSystem: true,
    },
    {
      id: '3',
      name: 'メンバー',
      description: '基本的な作業権限',
      memberCount: 8,
      permissions: ['view_analytics', 'create_projects', 'edit_content'],
      isSystem: true,
    },
    {
      id: '4',
      name: 'エディター',
      description: 'コンテンツ編集に特化',
      memberCount: 3,
      permissions: ['create_projects', 'edit_content', 'approve_content'],
      isSystem: false,
    },
    {
      id: '5',
      name: 'クリエイター',
      description: 'コンテンツ制作に特化',
      memberCount: 4,
      permissions: ['create_projects', 'edit_content'],
      isSystem: false,
    },
    {
      id: '6',
      name: 'ゲスト',
      description: '閲覧のみ可能',
      memberCount: 1,
      permissions: [],
      isSystem: true,
    },
  ]);

  const [permissions] = useState<Permission[]>([
    { id: 'manage_team', name: 'チーム管理', description: 'メンバーの追加・削除・役割変更' },
    { id: 'manage_settings', name: '設定管理', description: 'システム設定の変更' },
    { id: 'manage_clients', name: 'クライアント管理', description: 'クライアントの追加・編集・削除' },
    { id: 'view_analytics', name: '分析閲覧', description: 'レポートと分析データの閲覧' },
    { id: 'create_projects', name: 'プロジェクト作成', description: '新規プロジェクトの作成' },
    { id: 'edit_content', name: 'コンテンツ編集', description: 'コンテンツの作成・編集' },
    { id: 'approve_content', name: 'コンテンツ承認', description: 'コンテンツの承認・却下' },
    { id: 'manage_billing', name: '請求管理', description: '請求情報の管理' },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Load saved roles
  useEffect(() => {
    const savedRoles = storage.get<Role[]>(STORAGE_KEYS.ROLES);
    if (savedRoles && savedRoles.length > 0) {
      setRoles(savedRoles);
    }
  }, []);

  // Save roles when changed
  useEffect(() => {
    storage.set(STORAGE_KEYS.ROLES, roles);
  }, [roles]);

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.includes('all') || role.permissions.includes(permissionId);
  };

  const togglePermission = (permissionId: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const validateRoleForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameValidation = validators.required(roleForm.name, '役割名');
    if (!nameValidation.valid) {
      errors.name = nameValidation.error!;
    }

    // Check if name already exists (when creating new role)
    if (!editingRole && roles.some(r => r.name === roleForm.name)) {
      errors.name = 'この役割名は既に存在します';
    }

    const descValidation = validators.required(roleForm.description, '説明');
    if (!descValidation.valid) {
      errors.description = descValidation.error!;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRole = async () => {
    if (!validateRoleForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newRole: Role = {
        id: Date.now().toString(),
        name: roleForm.name,
        description: roleForm.description,
        memberCount: 0,
        permissions: roleForm.permissions,
        isSystem: false,
      };

      setRoles([...roles, newRole]);
      toast.success(`役割「${roleForm.name}」を作成しました`);
      
      setShowCreateModal(false);
      setRoleForm({ name: '', description: '', permissions: [] });
      setFormErrors({});
    } catch (error) {
      toast.error('役割の作成に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRole = (role: Role) => {
    if (role.isSystem) {
      toast.error('システムロールは編集できません');
      return;
    }
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowEditModal(true);
  };

  const handleUpdateRole = async () => {
    if (!validateRoleForm() || !editingRole) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: roleForm.name, description: roleForm.description, permissions: roleForm.permissions }
          : r
      ));

      toast.success(`役割「${roleForm.name}」を更新しました`);
      
      setShowEditModal(false);
      setEditingRole(null);
      setRoleForm({ name: '', description: '', permissions: [] });
      setFormErrors({});
    } catch (error) {
      toast.error('役割の更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      toast.error('システムロールは削除できません');
      return;
    }
    if (role.memberCount > 0) {
      toast.error('メンバーが割り当てられている役割は削除できません');
      return;
    }
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      toast.success(`役割「${roleToDelete.name}」を削除しました`);
      setShowDeleteDialog(false);
      setRoleToDelete(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-foreground text-2xl">権限管理</h1>
            <button 
              onClick={() => {
                setRoleForm({ name: '', description: '', permissions: [] });
                setFormErrors({});
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              カスタムロールを作成
            </button>
          </div>
          <p className="text-muted-foreground text-sm">役割と権限の管理</p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-card-foreground">{role.name}</h3>
                    {role.isSystem && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        システム
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {role.memberCount} 人のメンバー
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditRole(role)}
                    disabled={role.isSystem}
                    className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    disabled={role.isSystem || role.memberCount > 0}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.includes('all') ? (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    すべての権限
                  </span>
                ) : role.permissions.length === 0 ? (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    権限なし
                  </span>
                ) : (
                  role.permissions.map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? (
                      <span
                        key={permId}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {perm.name}
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Matrix */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-card-foreground">権限マトリックス</h2>
            <p className="text-sm text-muted-foreground mt-1">
              各役割に割り当てられた権限の一覧
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                    権限
                  </th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-card-foreground">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </td>
                    {roles.map(role => (
                      <td key={role.id} className="px-4 py-4 text-center">
                        {hasPermission(role, permission.id) && (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Role Modal */}
        {(showCreateModal || showEditModal) && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setEditingRole(null);
              setRoleForm({ name: '', description: '', permissions: [] });
              setFormErrors({});
            }} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl z-[101] p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg text-card-foreground mb-4">
                {showEditModal ? '役割を編集' : 'カスタムロールを作成'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">役割名 *</label>
                  <input
                    type="text"
                    placeholder="例: マーケティングチーム"
                    value={roleForm.name}
                    onChange={(e) => {
                      setRoleForm({ ...roleForm, name: e.target.value });
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
                  <label className="block text-sm text-muted-foreground mb-2">説明 *</label>
                  <textarea
                    rows={2}
                    placeholder="この役割の説明..."
                    value={roleForm.description}
                    onChange={(e) => {
                      setRoleForm({ ...roleForm, description: e.target.value });
                      if (formErrors.description) {
                        setFormErrors({ ...formErrors, description: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                      formErrors.description ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3">権限</label>
                  <div className="grid grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={roleForm.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mt-1 w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-card-foreground">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingRole(null);
                    setRoleForm({ name: '', description: '', permissions: [] });
                    setFormErrors({});
                  }}
                  className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={showEditModal ? handleUpdateRole : handleCreateRole}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '保存中...' : showEditModal ? '更新' : '作成'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="役割を削除しますか？"
          message={`役割「${roleToDelete?.name}」を削除します。この操作は取り消せません。`}
          confirmLabel="削除"
          cancelLabel="キャンセル"
          variant="danger"
          onConfirm={confirmDeleteRole}
          onCancel={() => {
            setShowDeleteDialog(false);
            setRoleToDelete(null);
          }}
        />
      </div>
    </div>
  );
}
