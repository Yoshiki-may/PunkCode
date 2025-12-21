// Form validation utilities

export const validators = {
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email) {
      return { valid: false, error: 'メールアドレスを入力してください' };
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return { valid: false, error: '有効なメールアドレスを入力してください' };
    }
    return { valid: true };
  },

  phone: (phone: string): { valid: boolean; error?: string } => {
    if (!phone) {
      return { valid: true }; // Optional field
    }
    const regex = /^[\d\s\-\+\(\)]+$/;
    if (!regex.test(phone)) {
      return { valid: false, error: '有効な電話番号を入力してください' };
    }
    return { valid: true };
  },

  password: (password: string): { valid: boolean; error?: string } => {
    if (!password) {
      return { valid: false, error: 'パスワードを入力してください' };
    }
    if (password.length < 8) {
      return { valid: false, error: 'パスワードは8文字以上で入力してください' };
    }
    return { valid: true };
  },

  passwordMatch: (password: string, confirmPassword: string): { valid: boolean; error?: string } => {
    if (password !== confirmPassword) {
      return { valid: false, error: 'パスワードが一致しません' };
    }
    return { valid: true };
  },

  required: (value: string, fieldName: string): { valid: boolean; error?: string } => {
    if (!value || value.trim() === '') {
      return { valid: false, error: `${fieldName}を入力してください` };
    }
    return { valid: true };
  },

  url: (url: string): { valid: boolean; error?: string } => {
    if (!url) {
      return { valid: true }; // Optional field
    }
    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, error: '有効なURLを入力してください' };
    }
  },
};
