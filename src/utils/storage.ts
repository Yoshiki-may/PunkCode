// LocalStorage utility functions with type safety

export const storage = {
  // Get item from localStorage
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue || null;
    }
  },

  // Set item in localStorage
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  // Clear all localStorage
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'palss_user_profile',
  NOTIFICATION_SETTINGS: 'palss_notification_settings',
  PRIVACY_SETTINGS: 'palss_privacy_settings',
  THEME: 'palss_theme',
  SESSIONS: 'palss_sessions',
  MEMBERS: 'palss_members',
  ROLES: 'palss_roles',
  INTEGRATIONS: 'palss_integrations',
} as const;
