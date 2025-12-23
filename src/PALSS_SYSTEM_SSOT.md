# PALSS SYSTEM — 仕様SSOT（Single Source of Truth）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: Phase 1-9.3完了、Phase 8/8.5完了、本番実装準備完了  
**Target**: バックエンド実装チーム

---

## 🎯 A) Definition of Done（完成定義）— 本番運用可能条件

### 1. 認証・権限（Auth/RLS）

- [ ] **Supabase Auth統合完了**: Email/Password認証、JWT発行
- [ ] **7ロール定義**: Sales, Direction, Editor, Creator, Support, Control, Client
- [ ] **RLSポリシー実装**: 全6テーブル（clients, tasks, approvals, comments, contracts, notifications）
- [ ] **org_id/client_id分離**: 社内ロール=org_id、Clientロール=client_id
- [ ] **403/401エラーハンドリング**: 権限なし時のUI表示
- [ ] **ログアウト機能**: セッション破棄、LocalStorageクリア

### 2. データ整合（SSOT）

- [ ] **Supabaseマスターデータ化**: LocalStorageはキャッシュ、Supabaseが真実
- [ ] **Outbox統合**: 全Write操作（create/update/delete）がOutbox経由
- [ ] **Outbox retry機能**: 失敗時の自動/手動リトライ
- [ ] **Outbox可視化**: QAパネルでpending/failed/succeeded確認可能
- [ ] **autoPull (Full/Incremental)**: 初回全件、2回目以降差分のみ
- [ ] **lastPulledAt管理**: テーブル別に最終Pull日時を記録
- [ ] **エラー時据え置き**: Pull失敗時はlastPulledAtを更新しない
- [ ] **競合解決**: updated_atベースで新しい方を優先

### 3. 主要機能

- [ ] **タスク管理**: CRUD、期限、ステータス（未着手/進行中/完了）、クライアント紐付け
- [ ] **承認管理**: CRUD、承認/差し戻し操作、期限、ステータス（待機中/承認済/差し戻し）
- [ ] **コメント投稿**: タスク/承認へのコメント、Client→Team/Team→Client判別
- [ ] **契約管理**: CRUD、開始日/終了日/更新期限、金額、ステータス（交渉中/契約中/終了）
- [ ] **通知**: 5種（タスク期限、承認期限、コメント、契約更新、承認アクション）
- [ ] **クライアント追加**: 新規クライアント登録、org紐付け

### 4. アラート（5種）

- [ ] **stagnantTasks**: 停滞タスク（X日間更新なし）
- [ ] **overdueTasks**: 期限切れタスク
- [ ] **noReplyComments**: 未返信コメント（Client→Teamでチーム返信なし）
- [ ] **contractRenewals**: 契約更新期限間近（Y日以内）
- [ ] **overdueApprovals**: 承認期限切れ

### 5. KPI（動的計算）

**Direction KPI**:
- [ ] **納期遵守率**: (期限内完了タスク / 完了タスク) × 100
- [ ] **差し戻し率**: (差し戻し承認 / 全承認) × 100
- [ ] **平均リードタイム**: タスク作成から完了までの平均日数

**Sales KPI**:
- [ ] **受注金額**: 契約中ステータスの契約金額合計
- [ ] **受注件数**: 契約中ステータスの契約件数
- [ ] **提案件数**: 交渉中ステータスの契約件数
- [ ] **受注率**: (契約中件数 / (契約中件数 + 交渉中件数)) × 100

### 6. 監視・パフォーマンス

- [ ] **Performance計測**: autoPull実行時間（Full/Incremental）、テーブル別内訳
- [ ] **Outboxエラー可視化**: QAパネルで失敗Operation確認
- [ ] **Incremental Pull効果**: 97-98%時間短縮、99.9%件数削減

### 7. 画面品質

- [ ] **67画面到達性100%**: ScreenMapで全画面遷移可能
- [ ] **状態定義**: Loading/Empty/Error/403/404/Success
- [ ] **レスポンシブ**: デスクトップ最適化（モバイルは考慮外）
- [ ] **テーマ切替**: PALSS MODE/DARK/FEMINE

### 8. テスト

- [ ] **受入テスト完了**: TC1-TC9（後述のGiven/When/Then）
- [ ] **RLS検証**: Clientロールで他社データ0件
- [ ] **SSOT検証**: Outbox失敗→リトライ→成功
- [ ] **Incremental Pull検証**: 初回Full→2回目以降差分

---

## 🔐 B) RBAC（ロール×操作権限表）

### ロール定義

| ロール | 説明 | org_id | client_id | 想定ユーザー |
|--------|------|--------|-----------|--------------|
| **Sales** | 営業（社内） | ✅ | - | 営業担当者 |
| **Direction** | ディレクション（社内） | ✅ | - | ディレクター |
| **Editor** | エディター（社内） | ✅ | - | 編集担当 |
| **Creator** | クリエイター（社内） | ✅ | - | 制作担当 |
| **Support** | サポート（社内） | ✅ | - | サポート担当 |
| **Control** | 管理（社内） | ✅ | - | 管理者 |
| **Client** | 顧客 | - | ✅ | クライアント企業 |

### 権限表（リソース×操作）

#### clients（クライアント）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ org内全件 | ✅ | ✅ | ❌ | 営業がクライアント管理 |
| Direction | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ org内全件 | ✅ | ✅ | ✅ | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社情報のみ閲覧 |

#### tasks（タスク）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ org内全件 | ✅ | ✅ | ❌ | タスク作成・更新 |
| Direction | ✅ org内全件 | ✅ | ✅ | ❌ | タスク作成・更新 |
| Editor | ✅ org内全件 | ✅ | ✅ | ❌ | タスク作成・更新 |
| Creator | ✅ org内全件 | ✅ | ✅ | ❌ | タスク作成・更新 |
| Support | ✅ org内全件 | ✅ | ✅ | ❌ | タスク作成・更新 |
| Control | ✅ org内全件 | ✅ | ✅ | ✅ | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社タスク閲覧のみ |

#### approvals（承認）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ org内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Direction | ✅ org内全件 | ✅ | ✅ | ❌ | **承認操作可能** |
| Editor | ✅ org内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Creator | ✅ org内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Support | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ org内全件 | ✅ | ✅ | ✅ | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社承認閲覧のみ |

**重要**: 承認操作（承認/差し戻し）はDirectionとControlのみ可能

#### comments（コメント）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ org内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Direction | ✅ org内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Editor | ✅ org内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Creator | ✅ org内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Support | ✅ org内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Control | ✅ org内全件 | ✅ | ✅ | ✅ | 管理者権限 |
| Client | ✅ 自社のみ | ✅ | ❌ | ❌ | 自社タスク/承認へのコメント投稿 |

**重要**: Clientはタスク/承認にコメント可能、noReplyアラート対象

#### contracts（契約）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ org内全件 | ✅ | ✅ | ❌ | 契約管理 |
| Direction | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ org内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ org内全件 | ✅ | ✅ | ✅ | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社契約閲覧のみ |

**重要**: 契約作成・更新はSalesとControlのみ

#### notifications（通知）

| ロール | Read | Create | Update | Delete | 備考 |
|--------|------|--------|--------|--------|------|
| Sales | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |
| Direction | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |
| Editor | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |
| Creator | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |
| Support | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |
| Control | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ✅ | 管理者権限 |
| Client | ✅ 自分宛のみ | ✅（システム）| ✅（既読）| ❌ | 通知受信・既読 |

**重要**: 通知作成はシステム自動生成、ユーザーは既読操作のみ

### RLS実装方針

```sql
-- 社内ロール（org_id）
WHERE org_id = auth.jwt() ->> 'org_id'

-- Clientロール（client_id）
WHERE client_id = auth.jwt() ->> 'client_id'

-- 通知（自分宛のみ）
WHERE user_id = auth.uid()
```

---

## 📊 C) 画面状態（State仕様）

### 共通状態定義

全画面で以下の状態を定義：

| 状態 | 条件 | UI表示 | アクション |
|------|------|--------|-----------|
| **Loading** | データ取得中 | スピナー、"読み込み中..." | 待機 |
| **Empty** | データ0件 | "データがありません"、追加ボタン | 新規作成可能 |
| **Error** | 取得失敗 | "エラーが発生しました"、リトライボタン | リトライ |
| **Forbidden (403)** | 権限なし | "アクセス権限がありません" | 戻る |
| **NotFound (404)** | リソースなし | "ページが見つかりません" | ホームへ |
| **Success** | データ取得成功 | データ一覧/詳細表示 | 通常操作 |

### 主要画面の状態

#### 1. Login/Landing

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Initial | 未ログイン | ログインフォーム |
| Loading | 認証処理中 | "ログイン中..." |
| Error | 認証失敗 | "メールアドレスまたはパスワードが正しくありません" |
| Success | 認証成功 | ロール別ホームへリダイレクト |

#### 2. 各Board Home（Sales/Direction/Editor等）

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | 初回データ取得中 | スピナー |
| Empty | クライアント0件 | "クライアントを追加してください" |
| Success | データあり | KPI/アラート/クライアントカード表示 |

#### 3. Client Detail（クライアント詳細）

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | タスク/契約取得中 | スピナー |
| NotFound | client_id不正 | "クライアントが見つかりません" |
| Forbidden | 他社データ（Client） | "アクセス権限がありません" |
| Success | データ取得成功 | タスク一覧/契約一覧/KPI |

#### 4. Task List/Detail

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | タスク取得中 | スピナー |
| Empty | タスク0件 | "タスクがありません"、追加ボタン |
| Success | タスクあり | タスク一覧、フィルタ（ステータス/期限） |

#### 5. Approvals Center

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | 承認取得中 | スピナー |
| Empty | 承認0件 | "承認待ちはありません" |
| Success | 承認あり | 承認一覧、承認/差し戻しボタン（Direction/Control） |

#### 6. Messages（コメント）

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | コメント取得中 | スピナー |
| Empty | コメント0件 | "コメントがありません"、投稿フォーム |
| Success | コメントあり | コメント一覧、投稿フォーム |

#### 7. Contracts（契約）

| 状態 | 条件 | UI表示 |
|------|------|--------|
| Loading | 契約取得中 | スピナー |
| Empty | 契約0件 | "契約がありません"、追加ボタン（Sales/Control） |
| Forbidden | 契約作成権限なし | 追加ボタン非表示 |
| Success | 契約あり | 契約一覧、更新期限アラート |

---

## ✅ D) 受入テスト（Given/When/Then）— 最小セット

### TC1: ログイン→ロール別ホーム

```gherkin
Given: ユーザーがログイン画面にアクセス
And: 有効なメールアドレス・パスワードを入力
When: ログインボタンをクリック
Then: 認証が成功し、JWTトークンが発行される
And: ロールに応じたホーム画面にリダイレクトされる
  - Sales → Sales Board Home
  - Direction → Direction Board Home
  - Client → Client Board Home
And: ヘッダーにユーザー名とロールが表示される
```

### TC2: クライアント選択→カード/KPI/アラートが切替

```gherkin
Given: Salesロールでログイン済み
And: 複数のクライアントが存在する
When: クライアント一覧から特定のクライアントを選択
Then: 選択したクライアントのカードがハイライトされる
And: KPIパネルが選択クライアントのデータで更新される
  - Direction KPI: 納期遵守率、差し戻し率、平均リードタイム
  - Sales KPI: 受注金額、受注件数、提案件数、受注率
And: アラートパネルが選択クライアントのアラートで更新される
  - 停滞タスク、期限切れタスク、未返信コメント、契約更新、承認期限切れ
And: LocalStorageにselectedClientIdが保存される
```

### TC3: タスク追加→期限/アラート/KPI/通知へ連鎖反映

```gherkin
Given: Salesロールでログイン済み
And: クライアントAが選択されている
When: "新規タスク"ボタンをクリック
And: タスクフォームに以下を入力
  - タイトル: "デザイン修正"
  - 期限: 明日
  - ステータス: 未着手
  - クライアント: クライアントA
And: "作成"ボタンをクリック
Then: Outboxにcreate操作が記録される
And: autoPullで次回同期時にSupabaseから取得される
And: タスク一覧に新規タスクが表示される
And: 期限が明日のため、アラート（overdueTasks候補）として監視される
And: Direction KPIの"平均リードタイム"計算対象に含まれる
And: 担当者（Direction）に通知が作成される（タスク期限通知）
```

### TC4: 承認（承認/差し戻し）→通知/アラート/KPI反映

```gherkin
Given: Directionロールでログイン済み
And: 承認待ちの承認が1件存在する
When: Approvals Centerで承認詳細を開く
And: "承認"ボタンをクリック
Then: Outboxにupdate操作が記録される（status: approved）
And: autoPullで次回同期時にSupabaseから取得される
And: 承認ステータスが"承認済"に変更される
And: 申請者（Sales）に通知が作成される（承認アクション通知）
And: アラート（overdueApprovals）から除外される
And: Direction KPIの"差し戻し率"計算対象に含まれる（承認として）

Given: Directionロールでログイン済み
And: 承認待ちの承認が1件存在する
When: "差し戻し"ボタンをクリック
And: 差し戻し理由を入力: "資料不足"
Then: 承認ステータスが"差し戻し"に変更される
And: 申請者（Sales）に通知が作成される（差し戻し通知）
And: Direction KPIの"差し戻し率"が上昇する
```

### TC5: コメント（Client→Team）→noReply増、返信で減

```gherkin
Given: Clientロールでログイン済み
And: 自社のタスクAが存在する
When: タスクA詳細画面でコメント投稿フォームに入力
  - コメント内容: "修正内容を確認したいです"
And: "投稿"ボタンをクリック
Then: Outboxにcreate操作が記録される
And: コメントがタスクAに紐付けられる
And: コメント種別が"Client to Team"として記録される
And: アラート（noReplyComments）にカウントされる
And: 担当者（Team）に通知が作成される（コメント通知）

Given: Salesロールでログイン済み
And: Client→Teamコメントが1件存在する
When: 返信コメントを投稿
  - コメント内容: "確認しました、修正します"
And: "投稿"ボタンをクリック
Then: コメント種別が"Team to Client"として記録される
And: アラート（noReplyComments）からClient→Teamコメントが除外される
And: Clientに通知が作成される（返信通知）
```

### TC6: 契約追加/更新期限→contractRenewal/KPI変化

```gherkin
Given: Salesロールでログイン済み
And: クライアントAが選択されている
When: "新規契約"ボタンをクリック
And: 契約フォームに以下を入力
  - 契約名: "SNS運用代行"
  - 開始日: 2024-01-01
  - 終了日: 2024-12-31
  - 更新期限: 2024-11-30（終了日の30日前）
  - 金額: 1,200,000円
  - ステータス: 契約中
And: "作成"ボタンをクリック
Then: Outboxにcreate操作が記録される
And: autoPullで次回同期時にSupabaseから取得される
And: 契約一覧に新規契約が表示される
And: 更新期限が30日以内の場合、アラート（contractRenewals）にカウントされる
And: Sales KPIの"受注金額"に1,200,000円が加算される
And: Sales KPIの"受注件数"が1増加する
And: Sales KPIの"受注率"が再計算される
```

### TC7: RLS（Clientは自社のみ、他社は0件）

```gherkin
Given: Clientロール（クライアントA）でログイン済み
When: タスク一覧画面にアクセス
Then: RLSにより、client_id = "クライアントA"のタスクのみ取得される
And: 他社（クライアントB, C等）のタスクは0件
And: タスク一覧に自社タスクのみ表示される

Given: Clientロール（クライアントA）でログイン済み
When: クライアント一覧画面にアクセス
Then: RLSにより、client_id = "クライアントA"のクライアント情報のみ取得される
And: 他社のクライアント情報は取得されない
And: クライアント一覧に自社のみ表示される

Given: Salesロール（org_id = "org_palss"）でログイン済み
When: タスク一覧画面にアクセス
Then: RLSにより、org_id = "org_palss"の全クライアントのタスクが取得される
And: 他組織のタスクは0件
And: タスク一覧に自組織の全クライアントのタスクが表示される
```

### TC8: SSOT信頼性（outbox failed可視化、retryで回復）

```gherkin
Given: Salesロールでログイン済み
And: ネットワークが不安定（意図的にOffline）
When: 新規タスクを作成
And: "作成"ボタンをクリック
Then: Outboxにcreate操作が記録される（status: pending）
And: Supabaseへの同期が失敗する
And: Outboxステータスが"failed"に変更される
And: QAパネル → Outboxタブで"failed"操作が表示される
And: エラーメッセージが記録される

Given: Outboxに"failed"操作が存在する
And: ネットワークが復旧
When: QAパネル → Outboxタブで"Retry All Failed"ボタンをクリック
Then: 失敗したOperation（全件）が再実行される
And: Supabaseへの同期が成功する
And: Outboxステータスが"succeeded"に変更される
And: LocalStorageキャッシュに反映される
And: 画面にタスクが表示される
```

### TC9: Incremental Pull（初回Full→2回目以降差分、lastPulledAt更新、エラー時据え置き）

```gherkin
# 初回Full Pull
Given: 初回ログイン（lastPulledAt = null）
When: autoPullが自動実行される
Then: 全6テーブルでFull Pullが実行される
  - clients: getAllClients()で全件取得
  - tasks: getAllTasks()で全件取得
  - approvals: getAllApprovals()で全件取得
  - comments: getAllComments()で全件取得
  - contracts: getAllContracts()で全件取得
  - notifications: getAllNotifications()で全件取得
And: 取得データの最大タイムスタンプがlastPulledAtに記録される
And: lastFullPulledAtが設定される
And: QAパネル → IncrementalタブでPull種別が"Full Pull"と表示される
And: PerformanceタブでTotal Duration: 1500-4500ms程度

# 2回目以降Incremental Pull（差分0）
Given: Full Pull完了後（lastPulledAt設定済み）
And: データ変更なし
When: autoPullが60秒後に自動実行される
Then: 全6テーブルでIncremental Pullが実行される
  - getXXXIncremental({ since: lastPulledAt, limit: 500 })
And: 差分0件のため、取得データなし
And: lastPulledAtは更新されない（差分なし）
And: QAパネル → IncrementalタブでPull種別が"Incremental Pull"と表示される
And: PerformanceタブでTotal Duration: 50-300ms程度（97-98%短縮）

# Incremental Pull（差分あり）
Given: Full Pull完了後（lastPulledAt設定済み）
And: タスクを1件追加（updated_at > lastPulledAt）
When: autoPullが60秒後に自動実行される
Then: tasksテーブルでIncremental Pullが実行される
  - getTasksIncremental({ since: lastPulledAt, limit: 500 })
And: 追加タスク1件が取得される
And: 既存LocalStorageキャッシュとマージされる（id主キー、updated_at比較）
And: lastPulledAtが取得データの最大タイムスタンプに更新される
And: Incrementalタブでtasksの取得件数が1件と表示される

# エラー時lastPulledAt据え置き
Given: Full Pull完了後（lastPulledAt設定済み）
And: ネットワークが不安定（意図的にOffline）
When: autoPullが60秒後に自動実行される
Then: Incremental Pullが失敗する
And: lastPulledAtは更新されない（据え置き）
And: Incrementalタブでエラーメッセージが表示される
And: 次回autoPullで同じlastPulledAtから再試行される（取りこぼし防止）

Given: ネットワークが復旧
When: autoPullが次回実行される
Then: 前回失敗したlastPulledAtから差分取得が再試行される
And: Incremental Pullが成功する
And: lastPulledAtが更新される
```

---

## ⚠️ E) 未決項目（意思決定ポイント）

以下の項目は実装方針が未確定。バックエンド実装前に決定が必要：

### 1. Clientロールの書き込み権限

**質問**: Clientロールで以下の操作を許可すべきか？

- [ ] **契約の作成・更新**: Clientが契約を提案・修正できるか？
  - 現状: Sales/Controlのみ
  - 検討: Clientも契約提案できるようにするか？

- [ ] **タスクの作成**: Clientが新規タスクを作成できるか？
  - 現状: 閲覧のみ
  - 検討: Client主導でタスク依頼できるようにするか？

**推奨**: 初期リリースでは閲覧のみ。Phase 2でClient主導機能を追加検討。

### 2. 削除伝搬（deleted_at）

**質問**: 削除操作をどう扱うか？

- [ ] **論理削除（deleted_at）**: レコードを残し、deleted_atフラグで制御
  - メリット: 履歴追跡、復元可能
  - デメリット: クエリ複雑化、RLSに`deleted_at IS NULL`追加

- [ ] **物理削除（DELETE）**: レコードを完全削除
  - メリット: シンプル
  - デメリット: 復元不可、履歴なし

**推奨**: Phase 8.6で論理削除（deleted_at）を導入。RLSに`deleted_at IS NULL`を追加。

### 3. Realtime導入

**質問**: Supabase Realtime Subscriptionsをどこに導入するか？

- [ ] **notifications**: リアルタイム通知表示
  - メリット: 通知がリアルタイムで届く
  - デメリット: WebSocket接続、コスト増

- [ ] **comments**: コメント投稿がリアルタイム反映
  - メリット: チャットのようなUX
  - デメリット: WebSocket接続、コスト増

- [ ] **tasks**: タスク更新がリアルタイム反映
  - メリット: 他ユーザーの変更がすぐ見える
  - デメリット: WebSocket接続、コスト増

**推奨**: Phase 10でnotifications/commentsのみRealtimeを試験導入。tasksはautoPullで十分。

### 4. KPI期限基準

**質問**: Direction KPI「納期遵守率」の期限基準は？

- [ ] **A案**: タスク作成日から完了日までの実績日数 vs 期限日数
- [ ] **B案**: 期限日までに完了したか（期限日 ≥ 完了日）

**推奨**: B案（期限日までに完了したか）が直感的。

### 5. 承認操作の範囲

**質問**: EditorやCreatorも承認操作ができるべきか？

- [ ] **現状**: Direction/Controlのみ承認可能
- [ ] **検討**: EditorやCreatorも限定的に承認できるようにするか？

**推奨**: 初期リリースではDirection/Controlのみ。Phase 2で拡張検討。

### 6. autoPull間隔

**質問**: autoPullの実行間隔は？

- [ ] **現状**: 60秒（1分）
- [ ] **検討**: 環境やユーザー数に応じて可変にするか？
  - 本番: 60秒
  - 開発: 30秒
  - 高トラフィック: 120秒

**推奨**: 初期は60秒固定。Phase 10で動的調整を検討。

---

## 📋 実装優先度

### Phase 10 (本番リリース準備)

1. **Auth/RLS完全実装**: 全ロール、全テーブル
2. **Outbox retry UI**: 失敗操作の可視化とリトライ
3. **Incremental Pull検証**: TC9の完全実施
4. **RLS検証**: TC7の完全実施
5. **受入テスト完了**: TC1-TC9

### Phase 11 (本番後の改善)

1. **削除伝搬（deleted_at）**: 論理削除導入
2. **Realtime通知**: notifications/commentsのみ
3. **Client書き込み権限**: 契約提案・タスク作成
4. **パフォーマンス最適化**: autoPull間隔動的調整

---

## 📊 データモデル（最終確認）

### テーブル構成

| テーブル | 主キー | 外部キー | RLSキー | 差分キー | 備考 |
|----------|--------|----------|---------|----------|------|
| clients | id | - | org_id / client_id | updated_at | クライアント情報 |
| tasks | id | client_id | org_id / client_id | updated_at | タスク |
| approvals | id | client_id | org_id / client_id | updated_at | 承認 |
| comments | id | task_id / approval_id | org_id / client_id | created_at | コメント |
| contracts | id | client_id | org_id / client_id | updated_at | 契約 |
| notifications | id | user_id | user_id | created_at | 通知 |

### 重要カラム

**共通カラム**:
- `id`: UUID（主キー）
- `created_at`: TIMESTAMPTZ（作成日時）
- `updated_at`: TIMESTAMPTZ（更新日時、tasksのみ）
- `org_id`: TEXT（社内ロール用）
- `client_id`: TEXT（Clientロール用）

**tasks固有**:
- `title`: TEXT（タスク名）
- `due_date`: DATE（期限）
- `status`: TEXT（未着手/進行中/完了）
- `assigned_to`: UUID（担当者）

**approvals固有**:
- `title`: TEXT（承認件名）
- `due_date`: DATE（承認期限）
- `status`: TEXT（待機中/承認済/差し戻し）
- `approver_id`: UUID（承認者）

**comments固有**:
- `content`: TEXT（コメント本文）
- `author_id`: UUID（投稿者）
- `direction`: TEXT（Client to Team / Team to Client）

**contracts固有**:
- `name`: TEXT（契約名）
- `start_date`: DATE（開始日）
- `end_date`: DATE（終了日）
- `renewal_date`: DATE（更新期限）
- `amount`: DECIMAL（金額）
- `status`: TEXT（交渉中/契約中/終了）

---

## ✅ バックエンド実装チェックリスト

### 1. DB設計

- [ ] Supabase schemaファイル作成（schema.sql）
- [ ] 全6テーブル定義（clients, tasks, approvals, comments, contracts, notifications）
- [ ] インデックス作成（org_id, client_id, updated_at, created_at）
- [ ] トリガー作成（updated_at自動更新）

### 2. RLS実装

- [ ] clients: org_id / client_idで分離
- [ ] tasks: org_id / client_idで分離
- [ ] approvals: org_id / client_idで分離
- [ ] comments: org_id / client_idで分離
- [ ] contracts: org_id / client_idで分離
- [ ] notifications: user_idで分離

### 3. Auth実装

- [ ] Supabase Auth設定（Email/Password）
- [ ] JWT Custom Claimsに org_id / client_id / role 追加
- [ ] ログイン/ログアウトAPI
- [ ] ロール別リダイレクト

### 4. API実装

- [ ] RESTful API（CRUD）またはSupabase Client直接利用
- [ ] getXXXIncremental（差分取得）エンドポイント
- [ ] Outbox retry機能

### 5. テスト

- [ ] 受入テスト（TC1-TC9）実施
- [ ] RLS検証（TC7）
- [ ] SSOT検証（TC8）
- [ ] Incremental Pull検証（TC9）

---

**End of Document**  
**Next Action**: バックエンドチームがこの仕様を元にDB設計・RLS・APIを実装
