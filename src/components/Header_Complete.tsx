import { Bell, Search, User, Settings, LogOut, ChevronDown, Check, Trash2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from '../utils/mockDatabase';
import { 
  getAllNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification as deleteNotificationFromDB, 
  clearAllNotifications as clearAllNotificationsFromDB,
  type Notification
} from '../utils/clientData';

interface HeaderProps {
  currentBoard: string;
  onBoardChange: (board: string) => void;
  theme?: 'light' | 'dark' | 'feminine' | 'palss';
  onSettingsClick?: () => void;
  onLogout?: () => void;
  userRole?: 'sales' | 'direction' | 'editor' | 'creator' | 'support' | 'client';
}

export function Header({ currentBoard, onBoardChange, theme = 'dark', onSettingsClick, onLogout, userRole }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const boards = [
    { id: 'sales', label: 'Sales' },
    { id: 'direction', label: 'Direction' },
    { id: 'editor', label: 'Editor' },
    { id: 'creator', label: 'Creator' },
    { id: 'support', label: 'Control' },
    { id: 'client', label: 'Client' },
    { id: 'palss-chat', label: 'PALSS CHAT' },
  ];

  // Filter boards based on user role
  // Control (support) role can see all boards
  // Other roles can only see their own board and PALSS CHAT
  const visibleBoards = userRole === 'support' 
    ? boards 
    : boards.filter(board => 
        board.id === userRole || 
        board.id === 'palss-chat'
      );

  // Initialize notifications - LocalStorageから読み込み
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = getAllNotifications();
    setNotifications(allNotifications);
  };

  // 通知リストを定期的にリロード（他のコンポーネントで追加された通知を反映）
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 5000); // 5秒ごとにリロード

    return () => clearInterval(interval);
  }, []);

  // Save notifications when changed
  useEffect(() => {
    if (notifications.length > 0) {
      storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }, [notifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    deleteNotificationFromDB(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    clearAllNotificationsFromDB();
    setNotifications([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you would implement actual search functionality
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    onSettingsClick?.();
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    if (confirm('ログアウトしますか？')) {
      onLogout?.();
    }
  };

  // Get user profile from storage
  const currentUser = getCurrentUser();
  const userName = currentUser?.name || 'Tanaka Taro';
  const userEmail = currentUser?.email || 'tanaka.taro@palss.com';
  const userInitials = userName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-sidebar border-b border-sidebar-border h-16 flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo - positioned at the far left */}
        <div className="flex items-center flex-shrink-0">
          <h1 
            className="tracking-tight transition-colors text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={theme === 'palss' ? { color: '#124E37' } : {}}
            onClick={() => onBoardChange('sales')}
          >
            PALSS SYSTEM
          </h1>
          {/* Dev Mode Indicator */}
          {currentUser && (
            <span className="ml-3 px-2 py-1 text-xs rounded-md bg-amber-100 text-amber-700 border border-amber-200">
              開発モード: {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          )}
        </div>

        {/* Board Navigation - centered */}
        <nav className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {visibleBoards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                currentBoard === board.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {board.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search Button */}
          <div className="relative" ref={searchRef}>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Search className="w-5 h-5 text-sidebar-foreground/70" strokeWidth={2} />
            </button>

            {/* Search Dropdown */}
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl p-4 z-[60]">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </form>
                <div className="mt-3 text-xs text-muted-foreground">
                  クライアント、プロジェクト、コンテンツを検索
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Bell className="w-5 h-5 text-sidebar-foreground/70" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-white text-xs rounded-full px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[60]">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-card-foreground">通知</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {unreadCount}件の未読通知
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline"
                      >
                        すべて既読
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        すべて削除
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">通知はありません</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border hover:bg-accent/50 transition-colors ${
                          !notification.read ? 'bg-accent/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="text-sm text-card-foreground">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/70 mt-2">
                                  {getTimeAgo(notification.timestamp)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 hover:bg-accent rounded transition-colors"
                                    title="既読にする"
                                  >
                                    <Check className="w-4 h-4 text-muted-foreground" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 hover:bg-red-50 rounded transition-colors"
                                  title="削除"
                                >
                                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: theme === 'palss' ? '#124E37' : '#374151' }}
              >
                {userInitials}
              </div>
              <span className="text-sm text-sidebar-foreground">{userName}</span>
              <ChevronDown className="w-4 h-4 text-sidebar-foreground/70" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[60]">
                {/* User Info */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: theme === 'palss' ? '#124E37' : '#374151' }}
                    >
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-card-foreground truncate">{userName}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    プロフィール
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    設定
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}