# PALSS SYSTEM — Phase 9.3 統合テスト手順書

## 目的
Supabaseモードで「他ブラウザの更新が自動的に画面に反映される」SSOT（Single Source of Truth）が成立していることを、5〜10分で検証する。

## テスト環境

### 前提条件
- ✅ Supabase Auth統合完了（Phase 9.2）
- ✅ Repository経由のRead→Write統一（Phase 9.3）
- ✅ autoPull（Supabase→LocalStorage自動同期）実装
- ✅ outbox（Write失敗時の未送信キュー）実装
- ✅ QAパネル（Ctrl+Shift+D）で各種設定可能

### 環境変数設定
必要な環境変数が `.env` に設定されていることを確認：
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### テスト用ユーザー準備
以下の3ユーザーをSupabase Authに登録済みであること：

1. **Sales User（営業担当）**
   - Email: `sales@palss-test.com`
   - org_id: `org_001`
   - role: `sales`

2. **Direction User（ディレクター）**
   - Email: `direction@palss-test.com`
   - org_id: `org_001`
   - role: `direction`

3. **Client User（クライアント）**
   - Email: `client1@example.com`
   - org_id: `org_001`
   - role: `client`
   - client_id: `client-1`

### ブラウザ準備
- **ブラウザA**: Chrome（シークレットモード）→ Sales User
- **ブラウザB**: Chrome（通常モード）→ Direction User
- **ブラウザC**: Firefox（プライベートモード）→ Client User

---

## テスト開始前の確認事項（1分）

### 1. QAパネルで設定確認（各ブラウザ）
1. `Ctrl+Shift+D` でQAパネルを開く
2. **Database Modeタブ** で `supabase` モードであることを確認
3. **Syncタブ** で以下を確認：
   - AutoPull: **Enabled**
   - AutoPull Interval: `5000ms` (5秒)
   - Last Pull Status: `success` または `idle`
   - Sync差分: 全て `0` （初期状態）

### 2. ログイン状態確認
1. **Authタブ** で各ブラウザのログインユーザーを確認：
   - ブラウザA: `sales@palss-test.com`
   - ブラウザB: `direction@palss-test.com`
   - ブラウザC: `client1@example.com`

---

## テストケース（5〜10分）

### ✅ テスト1: 契約データの追加・同期（2分）

#### 手順
1. **ブラウザA（Sales）** で操作：
   - Sales Boardを開く
   - 新規契約を追加（例：client-7, 月額: ¥300,000, ステータス: negotiating）
   - 契約更新期限を7日後に設定

2. **待機** （5〜10秒）

3. **ブラウザB（Direction）** で確認：
   - Direction Boardを開く
   - 契約更新アラート（contractRenewal）に新規契約が表示される
   - KPIサマリーの受注金額が更新される

#### 期待結果
- ✅ ブラウザBで新規契約が自動的に表示される
- ✅ contractRenewalカウントが増える
- ✅ Sales KPIの受注金額に反映される

#### 失敗時の切り分け
- ❌ 反映されない → Syncタブで「Last Pull Status」が `error` になっていないか確認
- ❌ Sync差分が増えている → RLSで読み取りが拒否されている可能性（Authタブでorg_id確認）

---

### ✅ テスト2: タスク追加・更新・同期（2分）

#### 手順
1. **ブラウザB（Direction）** で操作：
   - Direction Tasksを開く
   - 新規タスクを追加（client-1, タイトル: "新年キャンペーン Instagram Reels", ステータス: pending）
   - タスクのステータスを `in-progress` に変更

2. **待機** （5〜10秒）

3. **ブラウザA（Sales）** で確認：
   - Sales Board → Clients一覧で client-1 を選択
   - アクティブタスク数が増える
   - タスク詳細で新規タスクが表示される

4. **ブラウザC（Client）** で確認：
   - Client Dashboardでタスク一覧を表示
   - 新規タスクが表示される（自社のタスクのみ）

#### 期待結果
- ✅ ブラウザA・Cで新規タスクが自動的に表示される
- ✅ タスクのステータス変更が反映される
- ✅ ブラウザCでは自社（client-1）のタスクのみ表示される

#### 失敗時の切り分け
- ❌ ブラウザAで反映されない → autoPullが停止していないか確認（Syncタブ）
- ❌ ブラウザCで他社のタスクが見える → RLSでclient_idフィルタが効いていない
- ❌ Outboxタブでfailed状態が残る → Outboxタブで「Retry All」を試す

---

### ✅ テスト3: コメント追加・noReply検出（2分）

#### 手順
1. **ブラウザC（Client）** で操作：
   - Client Messagesを開く
   - 新規コメントを追加（例：「次回の投稿スケジュールについて質問があります」）
   - `isFromClient: true` として送信

2. **待機** （5〜10秒）

3. **ブラウザB（Direction）** で確認：
   - Direction AlertsまたはKPIスナップショットを開く
   - **noReplyカウント**が増える（クライアントからの未返信コメント）

4. **ブラウザB（Direction）** で操作：
   - コメントに返信（`isFromClient: false`）

5. **待機** （5〜10秒）

6. **ブラウザB（Direction）** で確認：
   - **noReplyカウント**が減る

#### 期待結果
- ✅ ブラウザBでクライアントからのコメントが自動的に表示される
- ✅ noReplyカウントが増加・減少する
- ✅ ブラウザCで返信が表示される

#### 失敗時の切り分け
- ❌ noReplyカウントが変わらない → KPI計算ロジック（kpiCalculator.ts）の問題
- ❌ コメントが反映されない → commentData.tsのoutbox統合を確認

---

### ✅ テスト4: 承認ワークフロー・同期（2分）

#### 手順
1. **ブラウザB（Direction）** で操作：
   - Direction Approvalsを開く
   - 新規承認リクエストを作成（client-1, タイトル: "新年キャンペーン動画", ステータス: pending）

2. **待機** （5〜10秒）

3. **ブラウザC（Client）** で確認：
   - Client Approvalsを開く
   - 新規承認リクエストが表示される

4. **ブラウザC（Client）** で操作：
   - 承認リクエストを **approved** に変更

5. **待機** （5〜10秒）

6. **ブラウザB（Direction）** で確認：
   - 承認ステータスが **approved** に更新される
   - 承認KPI（rejectionRate）が変化する

#### 期待結果
- ✅ ブラウザCで承認リクエストが自動的に表示される
- ✅ 承認ステータスの変更が双方向で反映される
- ✅ Direction KPIの差し戻し率（rejectionRate）が更新される

#### 失敗時の切り分け
- ❌ 承認ステータスが反映されない → clientData.tsのupdateClientApprovalでoutbox統合を確認
- ❌ KPIが更新されない → kpiCalculator.tsのDirection KPI計算ロジックを確認

---

### ✅ テスト5: RLS拒否とOutbox可視化（2分）

#### 手順
1. **意図的にRLS拒否を発生させる**：
   - ブラウザAで、org_idが異なるクライアント（`org_002`）のタスクを追加しようとする
   - または、client roleで他クライアントのデータを更新しようとする

2. **待機** （5〜10秒）

3. **QAパネル → Outboxタブ** で確認：
   - **Failed** カウントが増える
   - 失敗したアイテムの `lastError` に `RLS` または `permission` が含まれる
   - ステータスが `failed` （permanent failure）

4. **Console（DevTools）** で確認：
   - `[clientData] PERMANENT FAILURE: Task creation blocked by RLS/permission` などのエラーログが出力される

#### 期待結果
- ✅ RLS拒否が発生した場合、outboxに `failed` として記録される
- ✅ フォールバック（LocalStorage直書き）が**実行されない**（失敗を隠さない）
- ✅ QAパネルでpermanent failureが可視化される

#### 失敗時の切り分け
- ❌ failedが記録されない → outbox統合が正しく実装されていない
- ❌ LocalStorageに書き込まれている → フォールバックが permanent failure時にスキップされていない
- ❌ Retry Allで成功してしまう → RLS設定が甘い（`org_id` または `client_id` フィルタが不足）

---

## テスト完了後の確認（1分）

### 1. Outbox状態確認
- **QAパネル → Outboxタブ** で以下を確認：
  - **Pending**: `0` （全て送信完了）
  - **Failed**: `0〜数件` （RLS拒否があれば残る）
  - **Sent**: 増加している（成功した操作の履歴）

### 2. Sync差分確認
- **QAパネル → Syncタブ** で以下を確認：
  - **Supabase vs LocalStorage差分**: 全て `0` または軽微な差分のみ
  - **Last Pull Status**: `success`

### 3. KPI確認
- **Direction KPI** で以下を確認：
  - **納期遵守率**: タスク完了データに基づいて計算されている
  - **差し戻し率**: 承認データに基づいて計算されている
  - **平均リードタイム**: タスクのcreatedAt/completedAtに基づいて計算されている

- **Sales KPI** で以下を確認：
  - **受注金額**: 契約データに基づいて計算されている
  - **受注率**: 契約ステータスに基づいて計算されている

---

## トラブルシューティング

### ❌ autoPullが動作しない
**症状**: 他ブラウザの更新が反映されない

**確認事項**:
1. QAパネル → Syncタブで「AutoPull」が `Enabled` か確認
2. 「Last Pull Status」が `error` の場合、エラーメッセージを確認
3. Console（DevTools）で `[autoPull]` ログを確認

**対処法**:
- AutoPullを無効化→再度有効化
- ブラウザリロード（Ctrl+R）
- Supabase接続確認（Authタブで認証状態確認）

---

### ❌ Outboxでfailedが溜まる
**症状**: Write操作が失敗し続ける

**確認事項**:
1. QAパネル → Outboxタブで「Latest Failed」の `lastError` を確認
2. RLS拒否（`RLS` / `permission` / `403`）の場合 → Permanent failure（正常動作）
3. ネットワークエラー（`network` / `timeout`）の場合 → 一時的な失敗

**対処法**:
- Permanent failureの場合: RLS設定を見直す（`org_id` / `client_id`フィルタ）
- 一時的な失敗の場合: 「Retry All」をクリック
- 再試行回数が多い場合: 「Clear Failed」で削除（失敗を諦める）

---

### ❌ Sync差分が増え続ける
**症状**: Supabase vs LocalStorageの差分が大きくなる

**確認事項**:
1. QAパネル → Syncタブで差分の詳細を確認
2. 特定のテーブル（contracts / tasks / approvals / comments）で差分が大きいか確認
3. RLSで読み取りが制限されている可能性

**対処法**:
- 「Export Diff as JSON」でSupabaseに存在するがLocalStorageにないデータを確認
- RLS設定を見直す（`org_id` / `client_id`フィルタが厳しすぎないか）
- LocalStorageクリア→再ログインで同期リセット

---

### ❌ クライアントユーザーで他社データが見える
**症状**: Client roleで他クライアントのデータが表示される

**確認事項**:
1. Authタブで `client_id` が正しく設定されているか確認
2. Supabase RLSで `client_id` フィルタが有効か確認（`/supabase/rls.sql`）

**対処法**:
- RLSポリシーを修正して `client_id` フィルタを追加
- Supabaseダッシュボードで手動テスト（SQL Editorで `SELECT` 実行）

---

## 成功判定基準

Phase 9.3 が「本当の完了」と判定できる基準：

✅ **1. SSOT成立**:
- 他ブラウザの更新が5〜10秒以内に自動反映される
- Sync差分が0または軽微（10件以内）

✅ **2. Outbox信頼性**:
- Write失敗時にoutboxに記録される
- Permanent failureが正しく検出される（RLS拒否など）
- Retry機能が動作する

✅ **3. RLS分離**:
- クライアントユーザーは自社データのみ表示される
- 他組織（org_id異なる）のデータは表示されない

✅ **4. KPI動的計算**:
- Direction KPI（納期遵守率/差し戻し率/平均リードタイム）が正しく計算される
- Sales KPI（受注金額/受注件数/受注率）が正しく計算される
- 他ブラウザの更新がKPIに反映される

✅ **5. 既存UI維持**:
- 既存のレイアウト・デザイン・操作フローが一切変わっていない
- mockモードでも従来通り動作する

---

## テスト結果記録フォーマット

```
# Phase 9.3 統合テスト結果

## 実施日時
YYYY-MM-DD HH:MM

## テスト環境
- Browser A: Chrome 120.0.6099.109 (Sales User)
- Browser B: Chrome 120.0.6099.109 (Direction User)
- Browser C: Firefox 121.0 (Client User)

## テスト結果
- [ ] テスト1: 契約データの追加・同期 → ✅ PASS / ❌ FAIL
- [ ] テスト2: タスク追加・更新・同期 → ✅ PASS / ❌ FAIL
- [ ] テスト3: コメント追加・noReply検出 → ✅ PASS / ❌ FAIL
- [ ] テスト4: 承認ワークフロー・同期 → ✅ PASS / ❌ FAIL
- [ ] テスト5: RLS拒否とOutbox可視化 → ✅ PASS / ❌ FAIL

## 成功判定基準
- [ ] SSOT成立
- [ ] Outbox信頼性
- [ ] RLS分離
- [ ] KPI動的計算
- [ ] 既存UI維持

## 備考・問題点
（あれば記載）

## 総合判定
✅ PASS（Phase 9.3完了）/ ❌ FAIL（要修正）
```

---

## まとめ

このテスト手順書を使用することで、毎回5〜10分でPhase 9.3のSSO T化が正しく機能しているかを検証できます。

**重要ポイント**:
1. **autoPull**: Supabase→LocalStorageの自動同期が5秒間隔で動作
2. **outbox**: Write失敗時にpermanent failureを握りつぶさず、QAパネルで可視化
3. **RLS分離**: クライアントユーザーは自社データのみ表示
4. **KPI動的計算**: 他ブラウザの更新がKPIに反映される
5. **既存UI維持**: mockモードでも従来通り動作

これにより、PALSS SYSTEMは「真のSSO T」として機能し、Phase 9.3が「本当の完了」状態になります。
