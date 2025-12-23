# 📊 PALSS SYSTEM - ハードコードとLocalStorage化の現状分析

最終更新: 2025年12月21日

---

## ✅ LocalStorage化済み（動的データ）

### 1. クライアントデータ（`/utils/clientData.ts`）
**状態**: 🟢 部分的にLocalStorage化

#### 静的データ（ハードコード）
- **件数**: 6クライアント
- **データ**: 
  - `client-1`: 株式会社サンプル（美容・コスメ）
  - `client-2`: AXAS株式会社（アパレル）
  - `client-3`: BAYMAX株式会社（テクノロジー）
  - `client-4`: デジタルフロンティア（IT）
  - `client-5`: グローバルソリューションズ（コンサル）
  - `client-6`: クリエイティブワークス（広告代理店）

#### LocalStorage化済みの機能
- ✅ タスクの追加・更新（`STORAGE_KEYS.CLIENT_TASKS`）
- ✅ コンテンツの追加（`STORAGE_KEYS.CLIENT_CONTENT`）
- ✅ 承認待ちの追加・更新（`STORAGE_KEYS.CLIENT_APPROVALS`）
- ✅ 通知の追加・管理（`STORAGE_KEYS.NOTIFICATIONS`）

#### データフロー
```
静的データ（clientsData） ← フォールバック
    ↓
LocalStorage → 優先的に使用
    ↓
getAllClients() / getClientTasks() / getClientApprovals()
    ↓
各ボードで動的に表示
```

---

### 2. タスク管理システム
**状態**: 🟢 完全にLocalStorage化

#### LocalStorage化済みのコンポーネント
✅ `/components/direction-board/DirectionTasks.tsx`
- ハードコードされた8件のタスク → 削除済み
- `getAllTasks()`から動的取得
- ステータス変更がLocalStorageに保存
- 期限・優先度の自動計算

✅ `/components/Tasks.tsx`（Sales Board）
- `getAllTasks()`から動的取得
- ボードビュー・リストビューの切り替え
- タスク詳細パネル

#### 使用している関数
```typescript
getAllTasks(): Array<ClientTask & { clientId: string; clientName: string }>
updateClientTask(clientId: string, taskId: string, updates: Partial<ClientTask>): boolean
addClientTask(clientId: string, task: ClientTask): boolean
```

---

### 3. 承認待ちシステム
**状態**: 🟢 完全にLocalStorage化

#### LocalStorage化済みのコンポーネント
✅ `/components/direction-board/ApprovalsCard.tsx`
- ハードコードされた12件の承認待ち → 削除済み
- `getAllApprovals()`から動的取得
- 期限が近い順にソート

✅ `/components/direction-board/DirectionApprovals.tsx`
- ハードコードされた5件の承認待ち → 削除済み
- 承認・差し戻し処理がLocalStorageに保存
- 自動通知生成

✅ `/components/direction-board/AtRiskCard.tsx`
- ハードコードされた3件のリスク → 削除済み
- タスクと承認待ちから動的にリスク検出
- 期限超過・24時間以内を自動判定

#### 使用している関数
```typescript
getAllApprovals(): Array<ClientApproval & { clientId: string; clientName: string }>
updateClientApproval(clientId: string, approvalId: string, updates: Partial<ClientApproval>): boolean
addClientApproval(clientId: string, approval: ClientApproval): boolean
```

---

### 4. 通知システム
**状態**: 🟢 完全にLocalStorage化

#### LocalStorage化済みのコンポーネント
✅ `/components/Header_Complete.tsx`
- ハードコードされた5件のデフォルト通知 → 削除済み
- `getAllNotifications()`から動的取得
- 5秒ごとに自動リロード
- 既読/未読管理、削除機能

#### 自動通知生成（実装済み）
✅ 承認完了時 → `notifyApprovalCompleted()`
✅ 差し戻し時 → `notifyApprovalRejected()`

#### 自動通知生成（未実装）
❌ タスク追加時 → `notifyTaskAdded()` - 関数は存在するが呼び出しがない
❌ タスク完了時 → `notifyTaskCompleted()` - 関数は存在するが呼び出しがない
❌ 期限切れタスク → `notifyTaskOverdue()` - 関数は存在するが呼び出しがない
❌ クライアント追加時 → `notifyClientAdded()` - 関数は存在するが呼び出しがない

#### 使用している関数
```typescript
getAllNotifications(): Notification[]
addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): boolean
markNotificationAsRead(notificationId: string): boolean
markAllNotificationsAsRead(): boolean
deleteNotification(notificationId: string): boolean
clearAllNotifications(): boolean
```

---

### 5. ユーザー管理
**状態**: 🟢 完全にLocalStorage化

#### LocalStorage化済み
✅ `/utils/mockDatabase.ts`
- 6つのユーザーアカウント（Sales、Direction、Editor、Creator、Support、Client）
- `STORAGE_KEYS.TEAM_MEMBERS`に保存
- ログイン状態の管理（`STORAGE_KEYS.CURRENT_USER`）

---

## ❌ ハードコード（静的データ）

### 1. Direction Board - KPIスナップショット
**ファイル**: `/components/direction-board/KPISnapshotCard.tsx`
**状態**: 🔴 完全にハードコード

#### ハードコードされているデータ
```typescript
const kpis: KPI[] = [
  {
    id: '1',
    label: '納期遵守率',
    value: '92',
    unit: '%',
    change: 3,
    trend: 'up',
    isPositive: true,
  },
  {
    id: '2',
    label: '差戻し率',
    value: '8',
    unit: '%',
    change: -2,
    trend: 'down',
    isPositive: true,
  },
  {
    id: '3',
    label: '平均リードタイム',
    value: '7.2',
    unit: '日',
    change: -1,
    trend: 'down',
    isPositive: true,
  },
];
```

#### 必要な実装
- [ ] タスクと承認待ちから動的に計算
- [ ] 納期遵守率: 完了タスク数 ÷ 期限内完了タスク数
- [ ] 差戻し率: 差し戻された承認数 ÷ 総承認数
- [ ] 平均リードタイム: タスク完了日 - タスク作成日の平均

---

### 2. Direction Board - 期限一覧
**ファイル**: `/components/direction-board/UpcomingDeadlinesCard.tsx`
**状態**: 🔴 完全にハードコード

#### ハードコードされているデータ
```typescript
const deadlines: Deadline[] = [
  {
    id: '1',
    name: 'Instagram Reels - 新商品紹介',
    client: 'AXAS株式会社',
    date: '12/14',
    relativeTime: '今日',
    type: 'delivery',
    assignee: '田中太郎',
    initials: 'TT',
  },
  // ... 5件の期限データ
];
```

#### 必要な実装
- [ ] `getAllTasks()`と`getAllApprovals()`から動的に取得
- [ ] 期限が近い順にソート
- [ ] タイプ別フィルター（納期、撮影、投稿）

---

### 3. Direction Board - クライアントウォッチリスト
**ファイル**: `/components/direction-board/ClientWatchlistCard.tsx`
**状態**: 🟡 不明（未確認）

#### 想定されるハードコード
- クライアントリスト
- ウォッチリストの状態

#### 必要な実装
- [ ] `getAllClients()`から取得
- [ ] ウォッチリスト状態をLocalStorageに保存
- [ ] ピン留め機能の実装

---

### 4. Direction Board - ワークロード
**ファイル**: `/components/direction-board/WorkloadCard.tsx`
**状態**: 🟡 不明（未確認）

#### 想定されるハードコード
- 担当者別のタスク数
- ワークロードの状態

#### 必要な実装
- [ ] `getAllTasks()`から担当者別に集計
- [ ] キャパシティ管理機能

---

### 5. Direction Board - パイプライン健全性
**ファイル**: `/components/direction-board/PipelineHealthCard.tsx`
**状態**: 🟡 不明（未確認）

#### 想定されるハードコード
- パイプラインステージ
- 各ステージのタスク数

#### 必要な実装
- [ ] タスクのステータスから動的に計算

---

### 6. Sales Board - アラートウィジェット
**ファイル**: `/components/sales-board/AlertsWidget.tsx`
**状態**: 🔴 完全にハードコード

#### ハードコードされているデータ
```typescript
const alerts: Alert[] = [
  {
    id: '1',
    type: 'overdue',
    title: '期限切れ',
    subtitle: 'タスク期限超過',
    count: 3,
    severity: 'critical',
    icon: AlertTriangle,
  },
  // ... 5件のアラート
];
```

#### 必要な実装
- [ ] 期限切れタスクを動的にカウント
- [ ] 未返信クライアントを検出
- [ ] 停滞案件を検出
- [ ] 承認待ちを動的にカウント

---

### 7. Sales Board - KPIサマリ
**ファイル**: `/components/KPISummary.tsx`
**状態**: 🔴 完全にハードコード

#### ハードコードされているデータ
```typescript
const kpis = [
  { title: '今月の受注金額', value: '¥12,450,000', change: 15.3 },
  { title: '今月の受注件数', value: '23', change: 8.7, unit: '件' },
  { title: '今月の提案件数', value: '47', change: -4.2, unit: '件' },
  { title: '受注率', value: '48.9', change: 12.1, unit: '%' },
];
```

#### 必要な実装
- [ ] 契約データを追加（新しいデータ構造が必要）
- [ ] 月次集計機能
- [ ] 前月比計算

---

### 8. Sales Board - ボトルネック分析
**ファイル**: `/components/sales-board/BottleneckAnalysis.tsx`
**状態**: 🟡 不明（未確認）

#### 想定されるハードコード
- パイプラインステージ別の停滞状況

#### 必要な実装
- [ ] タスクの滞留時間を計算
- [ ] ボトルネックの自動検出

---

### 9. Sales Board - 次のアクション
**ファイル**: `/components/sales-board/NextAction.tsx`
**状態**: 🟡 不明（未確認）

#### 想定されるハードコード
- おすすめのアクションリスト

#### 必要な実装
- [ ] 期限が近いタスクを優先表示
- [ ] 未対応の承認待ちを表示

---

### 10. その他のハードコードされている可能性のあるコンポーネント

#### Direction Board
- `/components/direction-board/DirectionKPI.tsx` 🟡
- `/components/direction-board/DirectionNextAction.tsx` 🟡
- `/components/direction-board/DirectionPipeline.tsx` 🟡
- `/components/direction-board/DirectionProjects.tsx` 🟡
- `/components/direction-board/DirectionWorkload.tsx` 🟡
- `/components/direction-board/PostingCalendar.tsx` 🟡
- `/components/direction-board/ProductionPipeline.tsx` 🟡
- `/components/direction-board/TodayFocus.tsx` 🟡

#### Sales Board
- `/components/Pipeline.tsx` 🟡
- `/components/SalesProcessFlow.tsx` 🟡
- `/components/TelemarketingList.tsx` 🟡
- `/components/TodaysTasks.tsx` 🟡

#### Client Board
- `/components/client-board/*` 🟡（未確認）

#### Creator Board
- `/components/creator-board/*` 🟡（未確認）

#### Editor Board
- `/components/editor-board/*` 🟡（未確認）

#### Control Board
- `/components/control-board/*` 🟡（未確認）

---

## 📊 統計サマリー

### LocalStorage化の進捗

| カテゴリ | 状態 | 進捗率 |
|---------|------|--------|
| クライアントデータ | 🟢 部分的にLocalStorage化 | 70% |
| タスク管理 | 🟢 完全にLocalStorage化 | 100% |
| 承認待ち管理 | 🟢 完全にLocalStorage化 | 100% |
| 通知システム | 🟢 完全にLocalStorage化 | 100% |
| ユーザー管理 | 🟢 完全にLocalStorage化 | 100% |
| Direction Board - ダッシュボード | 🟡 一部LocalStorage化 | 40% |
| Sales Board - ダッシュボード | 🔴 ほぼハードコード | 10% |
| その他のボード | 🟡 未確認 | 不明 |

### 全体の進捗
```
████████░░░░░░░░░░░░░░░░░░░░ 25% 完了
```

---

## 🎯 優先度別の実装推奨順序

### 🔴 最優先（ユーザー体験に直接影響）
1. **Direction Board - 期限一覧** (`UpcomingDeadlinesCard.tsx`)
   - タスクと承認待ちから動的に取得
   - 期限管理の中核機能
   
2. **Sales Board - アラートウィジェット** (`AlertsWidget.tsx`)
   - 期限切れ、承認待ちを動的にカウント
   - 営業活動の重要な指標

3. **タスク追加機能**
   - 現在は表示のみで追加不可
   - `notifyTaskAdded()`を呼び出す

### 🟡 中優先（機能の完全性）
4. **Direction Board - KPIスナップショット** (`KPISnapshotCard.tsx`)
   - タスクと承認待ちから動的に計算
   - パフォーマンス指標として重要

5. **Sales Board - KPIサマリ** (`KPISummary.tsx`)
   - 契約データの追加が必要
   - 営業成果の可視化

6. **クライアント追加機能**
   - `notifyClientAdded()`を呼び出す
   - 新規クライアント登録の完全な実装

### 🟢 低優先（追加機能）
7. **ワークロード管理** (`WorkloadCard.tsx`)
   - チーム全体のキャパシティ管理

8. **パイプライン健全性** (`PipelineHealthCard.tsx`)
   - プロジェクト進捗の可視化

9. **その他のダッシュボードコンポーネント**
   - 各ボードの専用機能

---

## 💡 次にやるべきこと

### STEP 4: 期限管理のLocalStorage化 🔴
**対象ファイル**: `/components/direction-board/UpcomingDeadlinesCard.tsx`

**実装内容**:
1. ハードコードされた5件の期限データを削除
2. `getAllTasks()`と`getAllApprovals()`から動的取得
3. 期限が近い順にソート
4. タイプ別フィルター（納期、撮影、投稿）の実装

### STEP 5: タスク追加機能の実装 🔴
**対象ファイル**: `/components/direction-board/DirectionTasks.tsx`

**実装内容**:
1. 「新規タスク」ボタンのモーダル実装
2. タスク追加フォーム
3. `addClientTask()`の呼び出し
4. `notifyTaskAdded()`で自動通知生成

### STEP 6: Sales Board アラートのLocalStorage化 🔴
**対象ファイル**: `/components/sales-board/AlertsWidget.tsx`

**実装内容**:
1. ハードコードされた5件のアラートを削除
2. タスクと承認待ちから動的にカウント
3. 期限切れ、未返信、停滞案件の自動検出

---

## 📝 技術的な制約と考慮事項

### LocalStorageの制限
- **容量制限**: 約5-10MB（ブラウザによる）
- **対策**: 最新100件の通知のみ保持、古いデータの自動削除

### データ整合性
- **問題**: 複数のタブで同時編集すると不整合が発生する可能性
- **対策**: StorageEventを監視して自動リロード（一部実装済み）

### パフォーマンス
- **問題**: データが増えるとフィルタリング・ソートが遅延
- **対策**: インデックス作成、仮想スクロールの導入

### データ移行
- **問題**: 静的データからLocalStorageへの移行
- **対策**: 初回起動時に静的データをLocalStorageにコピー（現在は手動）

---

## 🔍 確認が必要なコンポーネント（未調査）

以下のコンポーネントは詳細な確認が必要です：

### Direction Board
- [ ] `ClientWatchlistCard.tsx`
- [ ] `WorkloadCard.tsx`
- [ ] `PipelineHealthCard.tsx`
- [ ] `DirectionKPI.tsx`
- [ ] `DirectionNextAction.tsx`
- [ ] `DirectionPipeline.tsx`
- [ ] `DirectionProjects.tsx`
- [ ] `DirectionWorkload.tsx`
- [ ] `PostingCalendar.tsx`
- [ ] `ProductionPipeline.tsx`
- [ ] `TodayFocus.tsx`

### Sales Board
- [ ] `BottleneckAnalysis.tsx`
- [ ] `NextAction.tsx`
- [ ] `PipelineStepper.tsx`
- [ ] `WeeklyActions.tsx`

### その他
- [ ] Client Board全体
- [ ] Creator Board全体
- [ ] Editor Board全体
- [ ] Control Board全体

---

**最終更新**: 2025年12月21日  
**次回レビュー推奨**: 新しいコンポーネント追加時、または大規模な機能実装後
