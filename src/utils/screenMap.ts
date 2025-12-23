// Phase 6: Screen Map Definition
// 全画面の定義と遷移情報

export interface ScreenDefinition {
  id: string;
  name: string;
  board: string;
  viewId: string;
  description?: string;
  category?: string;
}

// 全画面定義（67画面）
export const SCREEN_MAP: ScreenDefinition[] = [
  // Sales Board (18画面)
  { id: 'sales-1', name: 'Sales Home', board: 'sales', viewId: 'home', category: 'home', description: 'Sales Board ホーム' },
  { id: 'sales-2', name: 'My Clients', board: 'sales', viewId: 'my-clients', category: 'client', description: 'クライアント一覧' },
  { id: 'sales-3', name: 'Client Detail', board: 'sales', viewId: 'sales-client-detail', category: 'client', description: 'クライアント詳細' },
  { id: 'sales-4', name: 'Inbox/Alerts', board: 'sales', viewId: 'inbox-alerts', category: 'notification', description: '通知・アラート' },
  { id: 'sales-5', name: 'Tasks', board: 'sales', viewId: 'tasks', category: 'task', description: 'タスク一覧' },
  { id: 'sales-6', name: 'KPI Reports', board: 'sales', viewId: 'kpi-reports', category: 'report', description: 'KPIレポート' },
  { id: 'sales-7', name: 'Pipeline', board: 'sales', viewId: 'pipeline', category: 'sales', description: 'パイプライン管理' },
  { id: 'sales-8', name: 'Reports (Weekly)', board: 'sales', viewId: 'reports-weekly', category: 'report', description: '週次レポート' },
  { id: 'sales-9', name: 'All Clients', board: 'sales', viewId: 'clients-all', category: 'client', description: '全クライアント' },
  { id: 'sales-10', name: 'Client Detail Page', board: 'sales', viewId: 'client-detail', category: 'client', description: 'クライアント詳細ページ' },
  { id: 'sales-11', name: 'Telemarketing List', board: 'sales', viewId: 'telemarketing-list', category: 'sales', description: 'テレマーケティングリスト' },
  { id: 'sales-12', name: 'PALSS AI Home', board: 'sales', viewId: 'palss-ai', category: 'ai', description: 'AI機能ホーム' },
  { id: 'sales-13', name: 'AI Research', board: 'sales', viewId: 'ai-research', category: 'ai', description: 'AIリサーチ' },
  { id: 'sales-14', name: 'AI Proposal', board: 'sales', viewId: 'ai-proposal', category: 'ai', description: 'AI提案書生成' },
  { id: 'sales-15', name: 'AI Ideas', board: 'sales', viewId: 'ai-ideas', category: 'ai', description: 'AIアイデア生成' },
  { id: 'sales-16', name: 'AI Document', board: 'sales', viewId: 'ai-document', category: 'ai', description: 'AIドキュメント生成' },
  { id: 'sales-17', name: 'Schedule', board: 'sales', viewId: 'schedule', category: 'schedule', description: 'スケジュール' },
  { id: 'sales-18', name: 'Settings', board: 'sales', viewId: 'settings', category: 'settings', description: '設定' },

  // Direction Board (13画面)
  { id: 'direction-1', name: 'Direction Dashboard', board: 'direction', viewId: 'direction-dashboard', category: 'home', description: 'Direction Board ダッシュボード' },
  { id: 'direction-2', name: 'Direction Home', board: 'direction', viewId: 'direction-home', category: 'home', description: 'Direction Board ホーム' },
  { id: 'direction-3', name: 'My Clients', board: 'direction', viewId: 'my-clients', category: 'client', description: 'クライアント一覧' },
  { id: 'direction-4', name: 'Direction Client Detail', board: 'direction', viewId: 'direction-client-detail', category: 'client', description: 'クライアント詳細' },
  { id: 'direction-5', name: 'Tasks', board: 'direction', viewId: 'tasks', category: 'task', description: 'タスク一覧' },
  { id: 'direction-6', name: 'Approvals', board: 'direction', viewId: 'direction-approvals', category: 'approval', description: '承認待ち' },
  { id: 'direction-7', name: 'PALSS AI Home', board: 'direction', viewId: 'palss-ai', category: 'ai', description: 'AI機能ホーム' },
  { id: 'direction-8', name: 'AI Research', board: 'direction', viewId: 'ai-research', category: 'ai', description: 'AIリサーチ' },
  { id: 'direction-9', name: 'AI Proposal', board: 'direction', viewId: 'ai-proposal', category: 'ai', description: 'AI提案書生成' },
  { id: 'direction-10', name: 'AI Ideas', board: 'direction', viewId: 'ai-ideas', category: 'ai', description: 'AIアイデア生成' },
  { id: 'direction-11', name: 'AI Document', board: 'direction', viewId: 'ai-document', category: 'ai', description: 'AIドキュメント生成' },
  { id: 'direction-12', name: 'Schedule', board: 'direction', viewId: 'schedule', category: 'schedule', description: 'スケジュール' },
  { id: 'direction-13', name: 'Settings', board: 'direction', viewId: 'settings', category: 'settings', description: '設定' },

  // Editor Board (10画面)
  { id: 'editor-1', name: 'Editor Dashboard', board: 'editor', viewId: 'editor-dashboard', category: 'home', description: 'Editor Board ダッシュボード' },
  { id: 'editor-2', name: 'Editor Home', board: 'editor', viewId: 'editor-home', category: 'home', description: 'Editor Board ホーム' },
  { id: 'editor-3', name: 'My Projects', board: 'editor', viewId: 'editor-projects', category: 'project', description: '自分のプロジェクト' },
  { id: 'editor-4', name: 'Asset Library', board: 'editor', viewId: 'editor-library', category: 'asset', description: 'アセットライブラリ' },
  { id: 'editor-5', name: 'Workspace', board: 'editor', viewId: 'editor-workspace', category: 'workspace', description: 'ワークスペース' },
  { id: 'editor-6', name: 'Review Queue', board: 'editor', viewId: 'editor-review', category: 'review', description: 'レビュー待ち' },
  { id: 'editor-7', name: 'Versions', board: 'editor', viewId: 'editor-versions', category: 'version', description: 'バージョン管理' },
  { id: 'editor-8', name: 'Messages', board: 'editor', viewId: 'editor-messages', category: 'message', description: 'メッセージ' },
  { id: 'editor-9', name: 'Templates', board: 'editor', viewId: 'editor-templates', category: 'template', description: 'テンプレート' },
  { id: 'editor-10', name: 'Settings', board: 'editor', viewId: 'editor-settings', category: 'settings', description: '設定' },

  // Creator Board (9画面)
  { id: 'creator-1', name: 'Creator Dashboard', board: 'creator', viewId: 'creator-dashboard', category: 'home', description: 'Creator Board ダッシュボード' },
  { id: 'creator-2', name: 'Creator Home', board: 'creator', viewId: 'creator-home', category: 'home', description: 'Creator Board ホーム' },
  { id: 'creator-3', name: 'My Projects', board: 'creator', viewId: 'creator-projects', category: 'project', description: '自分のプロジェクト' },
  { id: 'creator-4', name: 'Shoot Calendar', board: 'creator', viewId: 'creator-calendar', category: 'schedule', description: '撮影カレンダー' },
  { id: 'creator-5', name: 'Upload Assets', board: 'creator', viewId: 'creator-upload', category: 'asset', description: 'アセットアップロード' },
  { id: 'creator-6', name: 'Asset Library', board: 'creator', viewId: 'creator-library', category: 'asset', description: 'アセットライブラリ' },
  { id: 'creator-7', name: 'Messages', board: 'creator', viewId: 'creator-messages', category: 'message', description: 'メッセージ' },
  { id: 'creator-8', name: 'Portfolio', board: 'creator', viewId: 'creator-portfolio', category: 'portfolio', description: 'ポートフォリオ' },
  { id: 'creator-9', name: 'Settings', board: 'creator', viewId: 'creator-settings', category: 'settings', description: '設定' },

  // Control Board (17画面)
  { id: 'control-1', name: 'Executive Dashboard', board: 'support', viewId: 'control-dashboard', category: 'home', description: '経営ダッシュボード' },
  { id: 'control-2', name: 'Management Home', board: 'support', viewId: 'management-home', category: 'home', description: '管理ホーム' },
  { id: 'control-3', name: 'Financial Overview', board: 'support', viewId: 'control-financial', category: 'financial', description: '財務概要' },
  { id: 'control-4', name: 'Project Portfolio', board: 'support', viewId: 'control-projects', category: 'project', description: 'プロジェクトポートフォリオ' },
  { id: 'control-5', name: 'Team Performance', board: 'support', viewId: 'control-team', category: 'team', description: 'チームパフォーマンス' },
  { id: 'control-6', name: 'Team Invite', board: 'support', viewId: 'control-invite', category: 'team', description: 'チーム招待' },
  { id: 'control-7', name: 'Client Intelligence', board: 'support', viewId: 'control-clients', category: 'client', description: 'クライアントインテリジェンス' },
  { id: 'control-8', name: 'Approval Center', board: 'support', viewId: 'control-approvals', category: 'approval', description: '承認センター' },
  { id: 'control-9', name: 'Risk Management', board: 'support', viewId: 'control-risk', category: 'risk', description: 'リスク管理' },
  { id: 'control-10', name: 'Reports & Analytics', board: 'support', viewId: 'control-reports', category: 'report', description: 'レポート・分析' },
  { id: 'control-11', name: 'PALSS AI Home', board: 'support', viewId: 'palss-ai', category: 'ai', description: 'AI機能ホーム' },
  { id: 'control-12', name: 'AI Research', board: 'support', viewId: 'ai-research', category: 'ai', description: 'AIリサーチ' },
  { id: 'control-13', name: 'AI Proposal', board: 'support', viewId: 'ai-proposal', category: 'ai', description: 'AI提案書生成' },
  { id: 'control-14', name: 'AI Ideas', board: 'support', viewId: 'ai-ideas', category: 'ai', description: 'AIアイデア生成' },
  { id: 'control-15', name: 'AI Document', board: 'support', viewId: 'ai-document', category: 'ai', description: 'AIドキュメント生成' },
  { id: 'control-16', name: 'SNS News', board: 'support', viewId: 'sns-news', category: 'news', description: 'SNSニュース' },
  { id: 'control-17', name: 'Settings', board: 'support', viewId: 'settings', category: 'settings', description: '設定' },

  // Client Board (8画面)
  { id: 'client-1', name: 'Client Dashboard', board: 'client', viewId: 'client-dashboard', category: 'home', description: 'クライアントダッシュボード' },
  { id: 'client-2', name: 'Client Home', board: 'client', viewId: 'client-home', category: 'home', description: 'クライアントホーム' },
  { id: 'client-3', name: 'Calendar', board: 'client', viewId: 'client-calendar', category: 'schedule', description: 'カレンダー' },
  { id: 'client-4', name: 'Approvals', board: 'client', viewId: 'client-approvals', category: 'approval', description: '承認' },
  { id: 'client-5', name: 'Reports', board: 'client', viewId: 'client-reports', category: 'report', description: 'レポート' },
  { id: 'client-6', name: 'Messages', board: 'client', viewId: 'client-messages', category: 'message', description: 'メッセージ' },
  { id: 'client-7', name: 'Documents', board: 'client', viewId: 'client-documents', category: 'document', description: 'ドキュメント' },
  { id: 'client-8', name: 'Settings', board: 'client', viewId: 'client-settings', category: 'settings', description: '設定' },

  // PALSS CHAT (1画面)
  { id: 'chat-1', name: 'PALSS Chat', board: 'palss-chat', viewId: 'palss-chat', category: 'chat', description: 'PALSS チャット' },

  // Settings Sub-views (8画面)
  { id: 'settings-1', name: 'Settings - Profile', board: 'sales', viewId: 'settings-profile', category: 'settings', description: 'プロフィール設定' },
  { id: 'settings-2', name: 'Settings - Notifications', board: 'sales', viewId: 'settings-notifications', category: 'settings', description: '通知設定' },
  { id: 'settings-3', name: 'Settings - Privacy', board: 'sales', viewId: 'settings-privacy', category: 'settings', description: 'プライバシー設定' },
  { id: 'settings-4', name: 'Settings - Members', board: 'sales', viewId: 'settings-members', category: 'settings', description: 'メンバー管理' },
  { id: 'settings-5', name: 'Settings - Permissions', board: 'sales', viewId: 'settings-permissions', category: 'settings', description: '権限管理' },
  { id: 'settings-6', name: 'Settings - Appearance', board: 'sales', viewId: 'settings-appearance', category: 'settings', description: '外観設定' },
  { id: 'settings-7', name: 'Settings - Integrations', board: 'sales', viewId: 'settings-integrations', category: 'settings', description: '連携設定' },
  { id: 'settings-8', name: 'Settings - Help', board: 'sales', viewId: 'settings-help', category: 'settings', description: 'ヘルプ' },
];

// Board名の日本語表示
export const BOARD_LABELS: Record<string, string> = {
  'sales': 'Sales',
  'direction': 'Direction',
  'editor': 'Editor',
  'creator': 'Creator',
  'support': 'Control',
  'client': 'Client',
  'palss-chat': 'PALSS CHAT',
};

// カテゴリの日本語表示
export const CATEGORY_LABELS: Record<string, string> = {
  'home': 'ホーム',
  'client': 'クライアント',
  'task': 'タスク',
  'approval': '承認',
  'report': 'レポート',
  'sales': '営業',
  'ai': 'AI機能',
  'schedule': 'スケジュール',
  'settings': '設定',
  'notification': '通知',
  'project': 'プロジェクト',
  'asset': 'アセット',
  'workspace': 'ワークスペース',
  'review': 'レビュー',
  'version': 'バージョン',
  'message': 'メッセージ',
  'template': 'テンプレート',
  'portfolio': 'ポートフォリオ',
  'financial': '財務',
  'team': 'チーム',
  'risk': 'リスク',
  'news': 'ニュース',
  'chat': 'チャット',
  'document': 'ドキュメント',
};

// ボード別に画面を取得
export function getScreensByBoard(board: string): ScreenDefinition[] {
  return SCREEN_MAP.filter(screen => screen.board === board);
}

// カテゴリ別に画面を取得
export function getScreensByCategory(category: string): ScreenDefinition[] {
  return SCREEN_MAP.filter(screen => screen.category === category);
}

// 画面IDから画面情報を取得
export function getScreenById(id: string): ScreenDefinition | undefined {
  return SCREEN_MAP.find(screen => screen.id === id);
}

// ViewIDから画面情報を取得
export function getScreenByViewId(viewId: string, board?: string): ScreenDefinition | undefined {
  if (board) {
    return SCREEN_MAP.find(screen => screen.viewId === viewId && screen.board === board);
  }
  return SCREEN_MAP.find(screen => screen.viewId === viewId);
}

// 画面検索（名前部分一致）
export function searchScreens(query: string): ScreenDefinition[] {
  const lowerQuery = query.toLowerCase();
  return SCREEN_MAP.filter(screen =>
    screen.name.toLowerCase().includes(lowerQuery) ||
    screen.viewId.toLowerCase().includes(lowerQuery) ||
    screen.description?.toLowerCase().includes(lowerQuery)
  );
}

// すべてのボードを取得
export function getAllBoards(): string[] {
  return Array.from(new Set(SCREEN_MAP.map(screen => screen.board)));
}

// すべてのカテゴリを取得
export function getAllCategories(): string[] {
  return Array.from(new Set(SCREEN_MAP.map(screen => screen.category).filter(Boolean))) as string[];
}
