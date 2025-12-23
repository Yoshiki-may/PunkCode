# Phase 4-6 統合実装ステータス

## 🎯 実装目標

既存UIを一切変更せず、システム全体の動作確認ができるよう「データ配線」「KPI動的化」「QAパネル」「画面遷移」を完全実装する。

---

## ✅ Phase 4-1: Task/Approvalフィールド拡張（完了）

### 実装内容

#### 1. データモデル拡張
**ファイル**: `/utils/clientData.ts`

```typescript
export interface ClientTask {
  // 既存フィールド
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'approval' | 'rejected' | 'completed';
  postDate: string;
  platform: 'Instagram' | 'Twitter' | 'TikTok' | 'Facebook' | 'YouTube';
  assignee: string;
  initials: string;
  rejectedCount?: number;
  dueDate?: string;
  delayReason?: string;
  nextAction?: string;
  
  // Phase 4: 追加フィールド（KPI/停滞検出用）
  createdAt?: string;      // タスク作成日時
  updatedAt?: string;      // 最終更新日時
  lastActivityAt?: string; // 最終アクティビティ日時（停滞検出用）
  completedAt?: string;    // 完了日時（status=completed の場合のみ）
}

export interface ClientApproval {
  // 既存フィールド
  id: string;
  title: string;
  type: 'video' | 'image' | 'copy';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  reviewer: string;
  comments?: string;
  platform: string;
  
  // Phase 4: 追加フィールド（KPI/停滞検出用）
  createdAt?: string;      // 承認要請作成日時
  updatedAt?: string;      // 最終更新日時
  completedAt?: string;    // 承認/差し戻し完了日時
  rejectedCount?: number;  // 差し戻し回数
}
```

#### 2. データマイグレーション
**ファイル**: `/utils/dataMigration.ts`（新規作成）

**目的**: 既存のLocalStorageデータに不足フィールドを補完

**補完ルール**:
- `createdAt`: postDate/dueDate から hashDays（2-10日）前を計算（IDハッシュで一貫性確保）
- `updatedAt`: createdAt以上、now以下の範囲で補完（ランダムだが再現性あり）
- `lastActivityAt`: statusに応じて調整（completedなら=updatedAt、in-progressなら数時間前）
- `completedAt`: status=completedの場合のみ、updatedAtを使用

**関数**:
```typescript
normalizeTask(task: ClientTask): ClientTask
normalizeApproval(approval: ClientApproval): ClientApproval
normalizeTasks(tasks: ClientTask[]): ClientTask[]
normalizeApprovals(approvals: ClientApproval[]): ClientApproval[]
touchTask(task: ClientTask): ClientTask // 更新時に自動でupdatedAt/lastActivityAtを設定
touchApproval(approval: ClientApproval): ClientApproval
```

#### 3. 自動フィールド更新

**`addClientTask`**: 新規タスク追加時に自動で createdAt/updatedAt/lastActivityAt を設定
```typescript
const now = new Date().toISOString();
const normalizedTask: ClientTask = {
  ...task,
  createdAt: task.createdAt || now,
  updatedAt: task.updatedAt || now,
  lastActivityAt: task.lastActivityAt || now
};
```

**`updateClientTask`**: タスク更新時に自動で updatedAt/lastActivityAt を更新
```typescript
const now = new Date().toISOString();
clientTasks[taskIndex] = { ...clientTasks[taskIndex], ...updates, updatedAt: now, lastActivityAt: now };
```

---

## ⏳ Phase 4-2: AlertsWidget未実装項目（進行中）

### 実装方針

#### 1. stagnant（停滞）
**ルール**: lastActivityAt（なければupdatedAt）から N日以上更新がない & status≠completed

**デフォルト閾値**: N = 10日（QAパネルで変更可能）

**実装**:
```typescript
const stagnantTasks = tasks.filter(task => {
  if (task.status === 'completed') return false;
  const lastActivity = task.lastActivityAt || task.updatedAt;
  if (!lastActivity) return false;
  const daysSinceActivity = Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceActivity >= stagnantThreshold; // デフォルト10日
});
```

#### 2. noReply（未返信）
**ルール**: 最後のコメントがisFromClient=trueで、以後isFromClient=falseの返信が無い状態がM日以上

**デフォルト閾値**: M = 5日（QAパネルで変更可能）

**依存**: Comment/Activityデータモデル（Phase 4-3で実装）

**暫定対応**: データ不足時は0件

#### 3. contractRenewal（契約更新期限）
**ルール**: renewalDate（or endDate）が「今日からR日以内」のactive契約

**デフォルト閾値**: R = 30日（QAパネルで変更可能）

**依存**: Contractsデータモデル（Phase 4-4で実装）

---

## ⏳ Phase 4-3: Comment/Activityデータモデル（次）

### データ構造

```typescript
export interface Comment {
  id: string;
  clientId: string;
  taskId?: string;
  approvalId?: string;
  userId: string;
  content: string;
  createdAt: string;
  isFromClient: boolean; // true=クライアントからのコメント、false=チームからの返信
}
```

### LocalStorageキー

`palss_client_comments`（既存キーと衝突しない）

### 関数

```typescript
getAllComments(): Comment[]
getClientComments(clientId: string): Comment[]
getTaskComments(clientId: string, taskId: string): Comment[]
getApprovalComments(clientId: string, approvalId: string): Comment[]
addComment(comment: Comment): boolean
seedComments(): void // 初期データ投入（QAパネルから）
```

---

## ⏳ Phase 4-4: Contractsデータモデル（次）

### データ構造

```typescript
export interface Contract {
  id: string;
  clientId: string;
  status: 'negotiating' | 'active' | 'paused' | 'expired';
  monthlyFee: number;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### LocalStorageキー

`palss_contracts`（既存キー、Phase 4で本格使用開始）

### 関数

```typescript
getAllContracts(): Contract[]
getClientContract(clientId: string): Contract | undefined
getContractsByMonth(yearMonth: string): Contract[] // "2024-12"形式
addContract(contract: Contract): boolean
updateContract(id: string, updates: Partial<Contract>): boolean
seedContractsIfEmpty(): void // 6クライアントに対してseed投入
```

### Seed戦略

- client-1, client-2, client-6: active（月額30-50万円）
- client-3, client-4, client-5: negotiating（月額20-40万円）
- renewalDateを設定して契約更新アラートのテスト可能に

---

## ⏳ Phase 4-5: KPISnapshotCard動的化（次）

### 現状

**ファイル**: `/components/direction-board/KPISnapshotCard.tsx`

**ハードコード**:
```typescript
const kpis: KPI[] = [
  { id: '1', label: '納期遵守率', value: '92', unit: '%', change: 3, trend: 'up', isPositive: true },
  { id: '2', label: '差戻し率', value: '8', unit: '%', change: -2, trend: 'down', isPositive: true },
  { id: '3', label: '平均リードタイム', value: '7.2', unit: '日', change: -1, trend: 'down', isPositive: true },
];
```

### 実装方針

#### KPI定義（設定可能）

**納期遵守率**:
- 定義A（デフォルト）: onTimeCompleted / completed
- 定義B: onTimeCompleted / totalTasks
- 期限基準: dueDate or postDate（選択可能、デフォルトはpostDate）

**差し戻し率**:
- 定義A（デフォルト）: rejectedApprovals / (approved + rejected)
- 定義B: rejectedApprovals / totalApprovals

**平均リードタイム**:
- 定義A（デフォルト）: (completedAt - createdAt) の平均（completed タスクのみ）
- 定義B: (postDate - createdAt) の平均（postDateがあるタスクのみ）

#### 動的計算関数

```typescript
// /utils/kpiCalculations.ts（新規作成予定）
calculateOnTimeRate(tasks: ClientTask[], definition: 'A' | 'B', dateField: 'dueDate' | 'postDate'): number
calculateRejectionRate(approvals: ClientApproval[], definition: 'A' | 'B'): number
calculateAverageLeadTime(tasks: ClientTask[], definition: 'A' | 'B'): number
```

---

## ⏳ Phase 4-6: KPISummary動的化（次）

### 現状

**ファイル**: `/components/KPISummary.tsx`

**ハードコード**:
```typescript
const kpis = [
  { title: '今月の受注金額', value: '¥12,450,000', change: 15.3 },
  { title: '今月の受注件数', value: '23', change: 8.7, unit: '件' },
  { title: '今月の提案件数', value: '47', change: -4.2, unit: '件' },
  { title: '受注率', value: '48.9', change: 12.1, unit: '%' },
];
```

### 実装方針

#### KPI定義（暫定）

**今月の受注金額**: 今月startDateのactive契約のmonthlyFee合計
**今月の受注件数**: 今月startDateのactive契約数
**今月の提案件数**: 今月createdAtのnegotiating契約数
**受注率**: active / (active + negotiating)

#### 動的計算関数

```typescript
calculateMonthlyRevenue(contracts: Contract[], yearMonth: string): number
calculateMonthlyDeals(contracts: Contract[], yearMonth: string): number
calculateMonthlyProposals(contracts: Contract[], yearMonth: string): number
calculateWinRate(contracts: Contract[]): number
calculateMonthOverMonthChange(current: number, previous: number): number
```

---

## ⏳ Phase 4-7: Sales Boardタスク保存修正（次）

### 問題

`/components/Tasks.tsx` のステータス変更が`updateClientTask()`に流れていない

### 修正方針

ステータス変更時に確実に`updateClientTask()`を呼び出し、LocalStorageに保存

---

## ⏳ Phase 4-8: notify系の接続（次）

### 実装項目

1. **notifyTaskCompleted()**: タスクがcompletedに遷移した瞬間に1回だけ
2. **notifyTaskOverdue()**: 期限切れ検知時に1回だけ（重複防止でnotified IDsをLocalStorageで管理）
3. **notifyClientAdded()**: クライアント追加時に1回だけ

---

## ⏳ Phase 5: QA/検証パネル（次）

### 実装方針

**表示方法**: DEV専用ページ or オーバーレイ（Ctrl+Shift+D で表示/非表示）

### 機能

1. **ログインユーザー切替**: 6ロール（Sales/Direction/Editor/Creator/Support/Client）
2. **selectedClientId切替**: 全体/ボード別の両方
3. **データモード切替**: mock / supabase（現状はmock固定）
4. **seed再投入/リセット**: `palss_initialized`フラグで初回のみseed投入
5. **LocalStorage状況可視化**: tasks/approvals/notifications/comments/contracts の件数表示
6. **テストデータ注入ボタン**:
   - テストコメント追加（client→team / team→client）
   - 契約追加（active/negotiating）
   - 期限切れタスク生成
   - 停滞タスク生成
7. **KPI定義切替**: 納期遵守率・差し戻し率・平均リードタイムの定義A/B切替
8. **閾値変更**: stagnant（N日）、noReply（M日）、renewal（R日）

---

## ⏳ Phase 6: 画面遷移配線（次）

### A) Inventory（画面一覧作成）

全ページ/全フレームをスキャンし、Screen Mapを作成

### B) 配線

主要フローを実装:
1. ログアウト→ログイン→ホーム
2. クライアント選択→クライアント詳細
3. 案件/タスク一覧→詳細→更新
4. 承認センター→承認/差し戻し
5. レポート/成果物→戻る

### C) 未配線画面リスト作成

到達不能の画面を100%列挙

---

## 📋 最終アウトプット（Phase 6完了時）

1. **Screen Map**（画面一覧＋遷移図）
2. **未配線画面リスト**
3. **データ接続マップ**（各カード/KPI/アラートが参照するデータと計算式）
4. **追加/変更したデータモデル一覧**
5. **追加したLocalStorageキー一覧**
6. **統合テスト手順**
7. **UIを変更していない証跡**（変更ゼロが目標）

---

## 🎯 現在のステータス

```
Phase 4-1: Task/Approvalフィールド拡張   ██████████ 100% ✅
Phase 4-2: AlertsWidget未実装項目        ████░░░░░░  40% 🟡
Phase 4-3: Comment/Activityデータモデル  ░░░░░░░░░░   0% ⏳
Phase 4-4: Contractsデータモデル         ░░░░░░░░░░   0% ⏳
Phase 4-5: KPISnapshotCard動的化         ░░░░░░░░░░   0% ⏳
Phase 4-6: KPISummary動的化              ░░░░░░░░░░   0% ⏳
Phase 4-7: Sales Boardタスク保存修正     ░░░░░░░░░░   0% ⏳
Phase 4-8: notify系の接続                ░░░░░░░░░░   0% ⏳
Phase 5: QA/検証パネル                   ░░░░░░░░░░   0% ⏳
Phase 6: 画面遷移配線                    ░░░░░░░░░░   0% ⏳

全体進捗: ███░░░░░░░░░░░░░░░░░░░░░░░░░ 10% 完了
```

---

## 💡 次のステップ

**優先度順**:
1. Comment/Activityデータモデル実装
2. Contractsデータモデル実装＋seed投入
3. AlertsWidgetの3項目完全実装
4. KPISnapshotCard動的化＋設定可能化
5. KPISummary動的化
6. QAパネル実装（最重要！）
7. 画面遷移配線＋Screen Map作成
8. 統合テスト実施＋最終レポート作成

---

**注意**: 現在、Phase 4-1のみ完了。大規模な実装のため、段階的に進めます。
