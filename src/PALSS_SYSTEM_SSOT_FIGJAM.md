# PALSS SYSTEM — 仕様SSOT（FigJam用1枚サマリー）

**Version**: 1.0 | **Date**: 2024-12-22 | **Status**: Phase 1-9.3完了、本番実装準備完了

---

## 🎯 Definition of Done（本番運用可能条件）

### 認証・権限
- [ ] Supabase Auth（Email/Password）
- [ ] 7ロール定義（Sales/Direction/Editor/Creator/Support/Control/Client）
- [ ] RLS全6テーブル実装
- [ ] 403/401エラーハンドリング

### データ整合（SSOT）
- [ ] Supabaseマスターデータ化
- [ ] Outbox全Write統合
- [ ] autoPull（Full/Incremental）
- [ ] lastPulledAt管理

### 主要機能
- [ ] タスク管理（CRUD、期限、ステータス）
- [ ] 承認管理（CRUD、承認/差し戻し）
- [ ] コメント投稿（Client↔Team）
- [ ] 契約管理（CRUD、更新期限）
- [ ] 通知（5種）

### アラート（5種）
- [ ] 停滞タスク | [ ] 期限切れタスク | [ ] 未返信コメント | [ ] 契約更新 | [ ] 承認期限切れ

### KPI
- [ ] Direction KPI（納期遵守率、差し戻し率、平均リードタイム）
- [ ] Sales KPI（受注金額、受注件数、提案件数、受注率）

### 監視・テスト
- [ ] Performance計測 | [ ] Outbox可視化 | [ ] 受入テスト完了（TC1-TC9）

---

## 🔐 RBAC（ロール×権限）クイックリファレンス

| ロール | clients | tasks | approvals | comments | contracts | notifications |
|--------|---------|-------|-----------|----------|-----------|--------------|
| **Sales** | RCU | RCU | RC | RC | **RCU** ✨ | R, 既読 |
| **Direction** | R | RCU | **RCU** ✨ | RC | R | R, 既読 |
| **Editor** | R | RCU | RC | RC | R | R, 既読 |
| **Creator** | R | RCU | RC | RC | R | R, 既読 |
| **Support** | R | RCU | R | RC | R | R, 既読 |
| **Control** | RCUD | RCUD | RCUD | RCUD | RCUD | RCUD |
| **Client** | R（自社）| R（自社）| R（自社）| **RC**（自社）✨ | R（自社）| R, 既読 |

**凡例**: R=Read, C=Create, U=Update, D=Delete  
**✨ 重要**:
- 承認操作（承認/差し戻し）: Direction/Controlのみ
- 契約管理: Sales/Controlのみ
- Client書き込み: コメントのみ

**RLS**:
```sql
-- 社内: WHERE org_id = auth.jwt() ->> 'org_id'
-- Client: WHERE client_id = auth.jwt() ->> 'client_id'
-- 通知: WHERE user_id = auth.uid()
```

---

## 📊 画面状態（全画面共通）

| 状態 | 条件 | UI表示 |
|------|------|--------|
| **Loading** | データ取得中 | スピナー |
| **Empty** | データ0件 | "データがありません"、追加ボタン |
| **Error** | 取得失敗 | "エラーが発生しました"、リトライ |
| **403** | 権限なし | "アクセス権限がありません" |
| **404** | リソースなし | "ページが見つかりません" |
| **Success** | データあり | 一覧/詳細表示 |

---

## ✅ 受入テスト（Given/When/Then）

### TC1: ログイン→ロール別ホーム
```
Given: ログイン画面、有効な認証情報
When: ログインボタンクリック
Then: JWT発行 → ロール別ホームへリダイレクト
```

### TC2: クライアント選択→KPI切替
```
Given: 複数クライアント存在
When: クライアントA選択
Then: KPI/アラートがクライアントAで更新
```

### TC3: タスク追加→連鎖反映
```
Given: クライアントA選択
When: タスク作成（期限: 明日）
Then: Outbox → autoPull → アラート監視 → KPI計算 → 通知作成
```

### TC4: 承認操作→通知/KPI反映
```
Given: 承認待ち1件（Direction）
When: "承認"クリック
Then: ステータス更新 → 通知作成 → KPI（差し戻し率）更新
```

### TC5: コメント→noReply増減
```
Given: Client→Team コメント1件
When: Team返信
Then: noReplyアラート減少 → Client通知
```

### TC6: 契約追加→KPI変化
```
Given: クライアントA選択
When: 契約作成（金額: 120万円、ステータス: 契約中）
Then: Sales KPI（受注金額+120万、受注件数+1、受注率再計算）
```

### TC7: RLS（Clientは自社のみ）
```
Given: Client（クライアントA）ログイン
When: タスク一覧取得
Then: client_id = "A"のみ取得、他社0件
```

### TC8: SSOT（Outbox retry）
```
Given: Offline、タスク作成
When: Outbox failed → ネットワーク復旧 → Retry
Then: Outbox succeeded → LocalStorage反映
```

### TC9: Incremental Pull
```
# 初回
Given: lastPulledAt = null
When: autoPull実行
Then: Full Pull（全6テーブル全件）、1500-4500ms

# 2回目（差分0）
Given: lastPulledAt設定済み、差分なし
When: autoPull実行
Then: Incremental Pull（差分0件）、50-300ms（97-98%短縮）

# 差分あり
Given: タスク1件追加
When: autoPull実行
Then: Incremental Pull（差分1件）→ マージ → lastPulledAt更新

# エラー時
Given: Offline
When: autoPull実行失敗
Then: lastPulledAt据え置き → 次回再試行
```

---

## ⚠️ 未決項目（意思決定必要）

| # | 項目 | 選択肢 | 推奨 |
|---|------|--------|------|
| 1 | **Client書き込み権限** | 契約/タスク作成を許可？ | Phase 2で検討 |
| 2 | **削除伝搬** | deleted_at（論理）vs DELETE（物理）？ | Phase 8.6でdeleted_at導入 |
| 3 | **Realtime** | notifications/comments/tasks？ | Phase 10でnotifications/commentsのみ |
| 4 | **KPI期限基準** | 実績日数 vs 期限日までに完了？ | 期限日までに完了（B案） |
| 5 | **承認操作範囲** | Editor/Creatorも可能？ | Phase 2で検討 |
| 6 | **autoPull間隔** | 60秒固定 vs 動的調整？ | 60秒固定（Phase 10で動的検討） |

---

## 📋 データモデル

| テーブル | 主キー | RLSキー | 差分キー | 重要カラム |
|----------|--------|---------|----------|------------|
| **clients** | id | org_id / client_id | updated_at | name, org_id, client_id |
| **tasks** | id | org_id / client_id | updated_at | title, due_date, status, client_id |
| **approvals** | id | org_id / client_id | updated_at | title, due_date, status, approver_id |
| **comments** | id | org_id / client_id | created_at | content, direction, task_id |
| **contracts** | id | org_id / client_id | updated_at | name, amount, status, renewal_date |
| **notifications** | id | user_id | created_at | title, type, user_id, read |

---

## 🚀 実装フロー（10-15日）

### Week 1: DB/RLS/Auth
**Day 1-2**: DB設計（schema.sql、インデックス、トリガー）  
**Day 3-5**: RLS実装（全6テーブル、JWT Custom Claims）  
**Day 6-7**: Auth実装（ログイン/ログアウト、ロール別リダイレクト）

### Week 2: API/テスト
**Day 8-10**: API実装（CRUD、getXXXIncremental、Outbox retry）  
**Day 11-13**: 受入テスト（TC1-TC9）  
**Day 14-15**: バグ修正、パフォーマンス確認、リリース準備

---

## ✅ バックエンド実装チェックリスト

### DB設計
- [ ] schema.sql作成（全6テーブル）
- [ ] インデックス作成（org_id, client_id, updated_at, created_at）
- [ ] updated_atトリガー作成

### RLS実装
- [ ] clients RLS（org_id / client_id）
- [ ] tasks RLS（org_id / client_id）
- [ ] approvals RLS（org_id / client_id）
- [ ] comments RLS（org_id / client_id）
- [ ] contracts RLS（org_id / client_id）
- [ ] notifications RLS（user_id）

### Auth実装
- [ ] Supabase Auth設定
- [ ] JWT Custom Claims（org_id, client_id, role）
- [ ] ログイン/ログアウトAPI

### API実装
- [ ] CRUD（全6テーブル）
- [ ] getXXXIncremental（全6テーブル）
- [ ] Outbox retry UI

### テスト
- [ ] TC1: ログイン→ロール別ホーム
- [ ] TC2: クライアント選択→KPI切替
- [ ] TC3: タスク追加→連鎖反映
- [ ] TC4: 承認操作→通知/KPI反映
- [ ] TC5: コメント→noReply増減
- [ ] TC6: 契約追加→KPI変化
- [ ] TC7: RLS動作確認
- [ ] TC8: SSOT信頼性
- [ ] TC9: Incremental Pull

---

## 🎯 リリース判定（全てチェックでリリース可）

- [ ] **DoD完了**: 全8カテゴリ
- [ ] **RBAC実装**: 全ロール×全リソース
- [ ] **画面状態**: 主要7画面×6状態
- [ ] **受入テスト**: TC1-TC9全てPass
- [ ] **未決項目**: 意思決定完了（またはPhase 2送り）
- [ ] **パフォーマンス**: Incremental Pull 97-98%短縮確認
- [ ] **SSOT**: Outbox retry成功率95%以上

---

## 📊 想定効果

| 指標 | Full Pull | Incremental Pull | 改善率 |
|------|-----------|------------------|--------|
| 実行時間 | 1500-4500ms | **50-300ms** | **97-98%短縮** |
| 取得件数 | 37,500件 | **10-50件** | **99.9%削減** |
| ネットワーク負荷 | 高 | **極小** | **99.9%削減** |

---

## 📚 関連ドキュメント

- `/PALSS_SYSTEM_SSOT.md` - 仕様SSOT本体（詳細版）
- `/PALSS_SYSTEM_SSOT_GUIDE.md` - 使い方ガイド
- `/PHASE8.5_IMPLEMENTATION_REPORT.md` - Incremental Pull実装レポート
- `/PHASE8.5_TEST_GUIDE.md` - 受入テストガイド

---

**Next Action**: バックエンドチームへ共有 → 未決項目協議 → Phase 10実装開始

**End of FigJam Summary**
