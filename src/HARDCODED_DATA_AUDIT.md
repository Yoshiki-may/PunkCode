# PALSS SYSTEM - ハードコードされたデータ・機能の洗い出し

## 📊 データカテゴリ別一覧

### 1. ✅ 既にLocalStorage化済み

#### ユーザー・アカウント管理
- **ファイル**: `/utils/mockDatabase.ts`
- **状態**: LocalStorage実装済み
- **内容**:
  - ユーザー情報（6アカウント）
  - 現在ログイン中のユーザー
  - チームメンバー一覧

#### クライアントデータ（一部）
- **ファイル**: `/utils/mockDatabase.ts`
- **状態**: LocalStorage実装済み（新規追加分のみ）
- **内容**:
  - 新規追加されたクライアント
  - クライアント担当者情報
  - 契約ステータス

---

### 2. ⚠️ 部分的にハードコード（LocalStorage統合必要）

#### クライアントデータ（メイン）
- **ファイル**: `/utils/clientData.ts`
- **状態**: 静的データ + LocalStorage統合済み（getClientByIdのみ）
- **ハードコード内容**:
  ```typescript
  - clientsData: ClientData[] = [6件の静的クライアント]
  ```
- **機能**:
  - `getClientById()` - ✅ LocalStorage統合済み
  - `getClientsByStatus()` - ❌ 静的データのみ
  - `getPinnedClients()` - ❌ 静的データのみ
  - `getAllClients()` - ❌ 静的データのみ
  - `searchClients()` - ❌ 静的データのみ

#### クライアント詳細データ
- **各クライアントに含まれるハードコードデータ**:
  - ✅ 基本情報（name, industry, contactなど）- LocalStorage化可能
  - ❌ KPIデータ（followers, engagement, reach, impressionsなど）
  - ❌ タスク一覧（tasks[]）
  - ❌ 最近のコンテンツ（recentContent[]）
  - ❌ 承認待ち一覧（pendingApprovals[]）

---

### 3. ❌ 完全にハードコード（LocalStorage化必要）

#### 通知システム
- **ファイル**: `/components/Header_Complete.tsx`
- **ハードコード箇所**:
  ```typescript
  const defaultNotifications: Notification[] = [
    { id: '1', type: 'info', title: '新しいクライアントが追加されました', ... },
    { id: '2', type: 'success', title: 'コンテンツが承認されました', ... },
    { id: '3', type: 'warning', title: 'レビュー期限が近づいています', ... },
    { id: '4', type: 'info', title: 'チームメンバーが参加しました', ... },
    { id: '5', type: 'success', title: '投稿が公開されました', ... },
  ]
  ```
- **LocalStorage**: 一部実装済み（保存・読み込みは可能、初期データがハードコード）

#### Direction Board - 承認待ちリスト
- **ファイル**: `/components/direction-board/ApprovalsCard.tsx`
- **ハードコード**:
  ```typescript
  const mockApprovals: Approval[] = [
    { id: '1', name: 'Instagram Reels - 新商品紹介', client: 'AXAS株式会社', ... },
    { id: '2', name: 'TikTok動画 - 商品PR', client: 'BAYMAX株式会社', ... },
    { id: '3', name: 'Twitter投稿 - 製品アップデート', client: 'AXAS株式会社', ... },
  ]
  ```

#### Direction Board - リスク管理（At Risk）
- **ファイル**: `/components/direction-board/AtRiskCard.tsx`
- **ハードコード**:
  ```typescript
  const risks: RiskItem[] = [
    { id: '1', name: 'TikTok動画 - 商品PR', client: 'AXAS株式会社', riskType: 'delayed', ... },
    { id: '2', name: 'Instagram Reels - キャンペーン', client: 'BAYMAX株式会社', ... },
    { id: '3', name: 'YouTube動画 - 商品レビュー', client: 'デジタルフロンティア', ... },
  ]
  ```

#### Direction Board - クライアント監視リスト
- **ファイル**: `/components/direction-board/ClientWatchlistCard.tsx`
- **ハードコード**:
  ```typescript
  const clients: Client[] = [
    { id: '1', name: 'AXAS株式会社', status: 'approval-delay', issue: '承認待ち3日経過', ... },
    { id: '2', name: 'BAYMAX株式会社', status: 'extra-requests', issue: '追加要望+5件', ... },
    { id: '3', name: 'デジタルフロンティア', status: 'recent-delay', issue: '納期1日遅延', ... },
  ]
  ```

#### Direction Board - タスク管理
- **ファイル**: `/components/direction-board/DirectionTasks.tsx`
- **予想**: タスクデータがハードコード（未確認）

#### Direction Board - 承認画面（詳細）
- **ファイル**: `/components/direction-board/DirectionApprovals.tsx`
- **ハードコード**:
  ```typescript
  const approvals: ApprovalItem[] = [
    { id: '1', name: 'Instagram Reels - 新商品紹介', type: 'video', client: 'AXAS株式会社', ... },
    // ... 合計13件のハードコードされた承認アイテム
  ]
  ```

#### Direction Board - アラート
- **ファイル**: `/components/direction-board/DirectionAlerts.tsx`
- **ハードコード**:
  ```typescript
  const [alerts] = useState<Alert[]>([
    { id: '1', type: 'pending-approval', title: '承認待ち', count: 5, severity: 'critical', ... },
    { id: '2', type: 'rejected', title: '差し戻し', count: 3, severity: 'warning', ... },
    { id: '3', type: 'urgent', title: '緊急対応', count: 2, severity: 'critical', ... },
    { id: '4', type: 'no-reply', title: '未返信', count: 4, severity: 'warning', ... },
  ])
  ```

#### Direction Board - AI機能
- **ファイル**: `/components/direction-board/DirectionAI.tsx`
- **ハードコード**:
  ```typescript
  const planningSteps: ProcessStep[] = [...] // 5ステップ
  const scriptSteps: ProcessStep[] = [...] // 5ステップ
  const ideasSteps: ProcessStep[] = [...] // 5ステップ
  const documentSteps: ProcessStep[] = [...] // 5ステップ
  
  const clients = [
    { id: 'axas', name: 'AXAS株式会社' },
    { id: 'baymax', name: 'BAYMAX株式会社' },
    { id: 'sample', name: '株式会社サンプル' },
    { id: 'digital', name: 'デジタルフロンティア' },
  ]
  ```

#### Direction Board - クライアント詳細ページ
- **ファイル**: `/components/direction-board/DirectionClientDetail.tsx`
- **ハードコード**:
  ```typescript
  const mockApprovals: ApprovalItem[] = [3件]
  const mockProposals: Proposal[] = [3件]
  ```

#### Sales Board - タスク
- **ファイル**: `/components/Tasks.tsx`
- **予想**: タスクデータがハードコード（未確認）

#### Sales Board - パイプライン
- **ファイル**: `/components/Pipeline.tsx`
- **予想**: 案件データがハードコード（未確認）

#### Sales Board - レポート
- **ファイル**: `/components/Reports.tsx`
- **予想**: レポートデータがハードコード（未確認）

#### Client Board - タスク/スケジュール
- **ファイル**: `/components/ClientTasks.tsx`
- **予想**: クライアント向けタスクがハードコード（未確認）

#### Client Board - サイドバー通知
- **ファイル**: `/components/ClientSidebar.tsx`
- **ハードコード**:
  ```typescript
  const [notifications] = useState(3); // 未読通知数
  ```

#### Editor Board - プロジェクト
- **ファイル**: `/components/editor-board/EditorMyProjects.tsx`
- **予想**: 編集プロジェクトがハードコード（未確認）

#### Editor Board - レビューキュー
- **ファイル**: `/components/editor-board/EditorReviewQueue.tsx`
- **予想**: レビュー待ちアイテムがハードコード（未確認）

#### Creator Board - プロジェクト
- **ファイル**: `/components/creator-board/CreatorMyProjects.tsx`
- **予想**: 制作プロジェクトがハードコード（未確認）

#### Control Board - 各種ダッシュボード
- **ファイル**: `/components/control-board/ExecutiveDashboard.tsx`
- **ファイル**: `/components/control-board/FinancialOverview.tsx`
- **ファイル**: `/components/control-board/ProjectPortfolio.tsx`
- **ファイル**: `/components/control-board/TeamPerformance.tsx`
- **ファイル**: `/components/control-board/ReportsAnalytics.tsx`
- **予想**: 全てのデータがハードコード（未確認）

#### Settings - メンバー管理
- **ファイル**: `/components/settings/MembersTab.tsx`
- **予想**: チームメンバーデータがハードコード（未確認）

#### Settings - 権限設定
- **ファイル**: `/components/settings/PermissionsTab.tsx`
- **予想**: ロール・権限データがハードコード（未確認）

#### Settings - セッション管理
- **ファイル**: `/components/settings/SessionsTab.tsx`
- **予想**: セッションデータがハードコード（未確認）

#### Settings - 統合設定
- **ファイル**: `/components/settings/IntegrationsTab.tsx`
- **予想**: 連携サービスデータがハードコード（未確認）

---

## 🎯 優先度別の対応推奨順序

### 🔴 最優先（直ちにLocalStorage化すべき）

1. **クライアントデータの完全統合**
   - `clientData.ts`の全関数をLocalStorage対応
   - KPI、タスク、コンテンツ、承認待ちの動的管理

2. **通知システム**
   - アカウント別の通知管理
   - リアルタイム更新機能

3. **Direction Board - 承認待ちリスト**
   - クライアントに紐づく承認アイテムの管理
   - ステータス更新の反映

### 🟠 高優先（テスト確認に必要）

4. **タスク管理システム**
   - Direction Board、Sales Board、Editor Board、Creator Board
   - クライアント・プロジェクトに紐づくタスク

5. **リスク管理・アラート**
   - AtRiskCard
   - DirectionAlerts
   - ClientWatchlistCard

6. **クライアント詳細ページの追加データ**
   - 承認待ちアイテム
   - 提案書リスト

### 🟡 中優先（機能完成度向上）

7. **Sales Board 各機能**
   - Pipeline（案件管理）
   - Reports（レポート）

8. **Editor/Creator Board**
   - プロジェクト管理
   - アセットライブラリ
   - レビューキュー

9. **Control Board ダッシュボード**
   - 財務データ
   - チームパフォーマンス
   - プロジェクトポートフォリオ

### 🟢 低優先（後回し可能）

10. **Settings 各種設定**
    - メンバー管理（mockDatabase.tsで部分対応済み）
    - セッション管理
    - 統合設定

---

## 📋 LocalStorage化のためのデータ構造提案

### 追加すべきSTORAGE_KEYS

```typescript
export const STORAGE_KEYS = {
  // 既存
  USER_PROFILE: 'palss_user_profile',
  CURRENT_USER: 'palss_current_user',
  CLIENTS: 'palss_clients',
  TEAM_MEMBERS: 'palss_team_members',
  NOTIFICATIONS: 'palss_notifications',
  
  // 追加推奨
  TASKS: 'palss_tasks',                         // タスク管理
  APPROVALS: 'palss_approvals',                 // 承認待ちアイテム
  PROJECTS: 'palss_projects',                   // プロジェクト
  CONTENT: 'palss_content',                     // コンテンツ
  PROPOSALS: 'palss_proposals',                 // 提案書
  PIPELINE: 'palss_pipeline',                   // 営業パイプライン
  ALERTS: 'palss_alerts',                       // アラート
  KPI_HISTORY: 'palss_kpi_history',             // KPI履歴
  ASSETS: 'palss_assets',                       // アセット
  REVIEWS: 'palss_reviews',                     // レビュー
  FINANCIAL: 'palss_financial',                 // 財務データ
  PERFORMANCE: 'palss_performance',             // パフォーマンスデータ
} as const;
```

---

## ✅ アクションアイテム

- [ ] `clientData.ts`の全関数をLocalStorage統合
- [ ] 通知システムの完全LocalStorage化
- [ ] タスク管理システムの実装
- [ ] 承認待ちシステムの実装
- [ ] リスク・アラート管理の実装
- [ ] プロジェクト管理システムの実装
- [ ] KPI履歴管理の実装
- [ ] Sales Board機能のLocalStorage化
- [ ] Editor/Creator Board機能のLocalStorage化
- [ ] Control Board機能のLocalStorage化
- [ ] Settings機能のLocalStorage化

---

**合計**: 約50箇所以上のハードコードされたデータ・機能が存在
**LocalStorage化済み**: 約10%
**優先対応必要**: 約40%
**後回し可能**: 約50%
