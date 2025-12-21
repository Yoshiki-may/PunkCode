import { User, Mail, Phone, Building2, Briefcase, Camera, Lock, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from '../ui/Toast';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { validators } from '../../utils/validation';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: '太郎',
    lastName: '田中',
    email: 'tanaka.taro@palss.com',
    phone: '+81-90-1234-5678',
    department: 'マーケティング部',
    position: 'マネージャー',
    bio: 'SNS運用とコンテンツ制作を担当しています。',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = storage.get(STORAGE_KEYS.USER_PROFILE);
    if (savedProfile) {
      setFormData(savedProfile.formData || formData);
      setProfileImage(savedProfile.profileImage || null);
    }
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('ファイルサイズは10MB以下にしてください');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success('画像をアップロードしました');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setProfileImage(null);
    toast.success('画像を削除しました');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValidation = validators.email(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error!;
    }

    const phoneValidation = validators.phone(formData.phone);
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      storage.set(STORAGE_KEYS.USER_PROFILE, {
        formData,
        profileImage,
      });
      
      toast.success('プロフィールを保存しました');
    } catch (error) {
      toast.error('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current) {
      newErrors.current = '現在のパスワードを入力してください';
    }

    const passwordValidation = validators.password(passwordData.new);
    if (!passwordValidation.valid) {
      newErrors.new = passwordValidation.error!;
    }

    const matchValidation = validators.passwordMatch(passwordData.new, passwordData.confirm);
    if (!matchValidation.valid) {
      newErrors.confirm = matchValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('パスワードを変更しました');
      setPasswordData({ current: '', new: '', confirm: '' });
      setErrors({});
    } catch (error) {
      toast.error('パスワード変更に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteDialog(false);
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      storage.clear();
      toast.success('アカウントを削除しました');
      
      // Redirect to login after delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast.error('アカウント削除に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    return `${formData.lastName.charAt(0)}${formData.firstName.charAt(0)}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl mb-2">プロフィール</h1>
          <p className="text-muted-foreground text-sm">アカウント情報を管理</p>
        </div>

        {/* Profile Picture */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="text-card-foreground mb-4">プロフィール画像</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: '#124E37' }}
                >
                  {getInitials()}
                </div>
              )}
              <button
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-card-foreground mb-2">
                JPG、GIF、PNGファイル（最大10MB）
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleImageClick}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  画像をアップロード
                </button>
                {profileImage && (
                  <button
                    onClick={handleImageDelete}
                    className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="text-card-foreground mb-4">基本情報</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">姓</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-2">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-2">電話番号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: '' });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">部署</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">役職</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-2">自己紹介</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                const savedProfile = storage.get(STORAGE_KEYS.USER_PROFILE);
                if (savedProfile) {
                  setFormData(savedProfile.formData);
                  setProfileImage(savedProfile.profileImage);
                }
                toast.info('変更を破棄しました');
              }}
              className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-card-foreground">パスワード変更</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">現在のパスワード</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, current: e.target.value });
                  if (errors.current) {
                    setErrors({ ...errors, current: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.current ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {errors.current && <p className="text-xs text-red-600 mt-1">{errors.current}</p>}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">新しいパスワード</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, new: e.target.value });
                  if (errors.new) {
                    setErrors({ ...errors, new: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.new ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {errors.new && <p className="text-xs text-red-600 mt-1">{errors.new}</p>}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">新しいパスワード（確認）</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirm: e.target.value });
                  if (errors.confirm) {
                    setErrors({ ...errors, confirm: '' });
                  }
                }}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.confirm ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '変更中...' : 'パスワードを変更'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-red-600">危険な操作</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            アカウントを削除
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="アカウントを削除しますか？"
          message="この操作は取り消せません。すべてのデータが完全に削除されます。"
          confirmLabel="削除する"
          cancelLabel="キャンセル"
          variant="danger"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  );
}