# PALSS SYSTEM — Migration Notes（マイグレーション戦略）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（バックエンド実装用）

---

## 📋 目的

**既存LocalStorageデータをSupabaseへ移行する戦略を定義**:
- データ投入手順
- ID採番の統一
- タイムスタンプの扱い
- スキーマ変更時の互換性

---

## 🚀 マイグレーション手順（初回セットアップ）

### ステップ1: Supabase プロジェクト作成（15分）

1. **Supabaseアカウント作成**
   - https://supabase.com/
   - 新規プロジェクト作成

2. **プロジェクト情報取得**
   - Project URL: `https://xxx.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（管理用、フロントで使用禁止）

3. **環境変数設定**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（バックエンドのみ）
   ```

---

### ステップ2: スキーマ適用（10分）

1. **Supabase SQL Editorを開く**
   - Dashboard → SQL Editor

2. **schema_final.sql を実行**
   ```sql
   -- schema_final.sql の内容をコピー&ペースト
   -- 実行ボタンをクリック
   ```

3. **エラー確認**
   - エラーがなければ成功
   - テーブル一覧で8テーブルが作成されていることを確認

---

### ステップ3: RLS適用（10分）

1. **rls_final.sql を実行**
   ```sql
   -- rls_final.sql の内容をコピー&ペースト
   -- 実行ボタンをクリック
   ```

2. **RLS有効化確認**
   - Dashboard → Table Editor → 各テーブル → RLS有効化確認

---

### ステップ4: Seed データ投入（5分）

1. **seed_minimal.sql を実行**
   ```sql
   -- seed_minimal.sql の内容をコピー&ペースト
   -- 実行ボタンをクリック
   ```

2. **データ確認**
   - Dashboard → Table Editor → 各テーブルでデータ確認
   - organizations: 1件
   - clients: 5件
   - users: 9件
   - tasks: 4件
   - approvals: 3件
   - comments: 4件
   - contracts: 4件
   - notifications: 5件

---

### ステップ5: Auth設定（10分）

1. **Supabase Auth設定**
   - Dashboard → Authentication → Settings
   - Email Auth有効化

2. **JWT Custom Claims設定**

**方法1: Supabase Auth Hooks（推奨、Supabase 2.0以降）**:

```sql
-- auth.users にトリガーを設定
-- ログイン時に users テーブルから role/org_id/client_id を取得してJWT Claimsに追加
-- 詳細はSupabase Docsを参照: https://supabase.com/docs/guides/auth/auth-hooks
```

**方法2: アプリケーション層で設定**:

```typescript
// サーバーサイド（API）
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service_roleキー使用
)

// ログイン後にusersテーブルから取得してJWTに追加
const { data: user } = await supabaseAdmin
  .from('users')
  .select('id, role, org_id, client_id')
  .eq('auth_uid', authUid)
  .single()

// JWT Custom Claims更新（Supabase Admin API使用）
await supabaseAdmin.auth.admin.updateUserById(authUid, {
  app_metadata: {
    role: user.role,
    org_id: user.org_id,
    client_id: user.client_id
  }
})
```

3. **テストユーザー作成**
   - Dashboard → Authentication → Users → Add User
   - Email: `sales@palss.com`
   - Password: `password123`（テスト用）
   - auth_uid をコピー → users テーブルの auth_uid に反映

---

## 📊 LocalStorage → Supabase データ移行

### 方針

**初回リリース時（Phase 10）**:
- LocalStorageはキャッシュとして継続使用
- Supabaseがマスターデータ（SSOT）
- Syncタブで手動同期（Full Pull）
- Outboxで書き込み同期

**Phase 11以降**:
- 段階的にSupabaseへ移行
- LocalStorageは一時キャッシュのみ

---

### LocalStorage データ構造（現状）

```javascript
// clients
localStorage.setItem('clients', JSON.stringify([
  { id: 'client_a', name: '株式会社A', ... }
]))

// tasks（client_idでグルーピング）
localStorage.setItem('tasks', JSON.stringify({
  'client_a': [
    { id: 'task_001', title: 'タスク1', ... }
  ]
}))

// approvals（client_idでグルーピング）
localStorage.setItem('approvals', JSON.stringify({
  'client_a': [
    { id: 'approval_001', title: '承認1', ... }
  ]
}))

// comments
localStorage.setItem('comments', JSON.stringify([
  { id: 'comment_001', content: 'コメント1', ... }
]))

// contracts
localStorage.setItem('contracts', JSON.stringify([
  { id: 'contract_001', name: '契約1', ... }
]))

// notifications
localStorage.setItem('notifications', JSON.stringify([
  { id: 'notification_001', title: '通知1', ... }
]))
```

---

### Supabase データ構造（統一）

```javascript
// 全てSupabaseテーブルに格納
// フロントは必要に応じてLocalStorageにキャッシュ

// 取得例
const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .eq('org_id', orgId)

// LocalStorageキャッシュ（autoPull後）
localStorage.setItem('clients', JSON.stringify(clients))
```

---

### ID採番の統一

**LocalStorage（現状）**:
- カスタムID: `client_a`, `task_001`, `approval_001` 等
- 一部UUID、一部連番

**Supabase（統一後）**:
- **全てUUID v4**
- PostgreSQL: `uuid_generate_v4()`
- JavaScript: `crypto.randomUUID()` or `uuid` package

**移行戦略**:
- 既存LocalStorageデータのIDを全てUUID v4に変換
- マッピングテーブル（旧ID → 新UUID）を一時的に保持
- 移行完了後はマッピング不要（新規データは全てUUID）

---

### タイムスタンプの統一

**LocalStorage（現状）**:
- JavaScript Date: `new Date().toISOString()`
- フォーマット: ISO 8601（UTC）

**Supabase（統一後）**:
- PostgreSQL TIMESTAMPTZ: `2024-12-22T10:00:00+00:00`
- フォーマット: ISO 8601（UTC推奨、タイムゾーン対応）

**移行戦略**:
- LocalStorageの日時を全てISO 8601（UTC）に統一
- PostgreSQLに投入時は自動的にTIMESTAMPTZに変換
- フロント表示時はユーザーのタイムゾーンに変換

---

### データ整合性チェック

**移行前**:
1. LocalStorageデータをバックアップ
2. 外部キー整合性チェック（client_id, user_id等）
3. 必須カラムのNULLチェック

**移行中**:
1. トランザクション使用（全テーブル一括投入）
2. エラー時はロールバック

**移行後**:
1. Supabaseデータ件数確認（LocalStorageと一致）
2. RLS動作確認（ロール別アクセス可否）
3. Incremental Pull動作確認

---

## 🔄 スキーマ変更時の互換性戦略

### バージョニング

**スキーマバージョン管理**:
- `schema_version` テーブル作成（現在のバージョンを記録）
- マイグレーションファイル命名: `v1_initial.sql`, `v2_add_deleted_at.sql`

```sql
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT
);

INSERT INTO schema_version (version, description) VALUES
(1, 'Initial schema');
```

---

### マイグレーション方針

**後方互換性**:
- カラム追加: 既存カラムに影響なし（NULLable推奨）
- カラム削除: 廃止予定カラムは残し、新バージョンで削除
- カラム名変更: 新カラム追加 → データコピー → 旧カラム削除

**前方互換性**:
- 新カラム追加時は既存データにデフォルト値設定
- 新テーブル追加は既存テーブルに影響なし

---

### マイグレーション実行手順

1. **マイグレーションファイル作成**
   ```sql
   -- v2_add_deleted_at.sql（例: deleted_at追加）
   ALTER TABLE clients ADD COLUMN deleted_at TIMESTAMPTZ NULL DEFAULT NULL;
   ALTER TABLE tasks ADD COLUMN deleted_at TIMESTAMPTZ NULL DEFAULT NULL;
   -- ...

   -- schema_version更新
   INSERT INTO schema_version (version, description) VALUES
   (2, 'Add deleted_at for soft delete');
   ```

2. **ローカル環境でテスト**
   - Docker等でローカルPostgreSQLを起動
   - マイグレーション実行
   - データ整合性確認

3. **本番環境で実行**
   - Supabase SQL Editorでマイグレーション実行
   - schema_versionテーブルで現在のバージョン確認

4. **ロールバック準備**
   - マイグレーション前のバックアップ取得
   - ロールバックSQLを用意（ALTER TABLE DROP COLUMN等）

---

## 📦 データバックアップ戦略

### 自動バックアップ（Supabase）

**Supabaseの機能**:
- 日次自動バックアップ（Pro Planで7日間保持）
- ポイントインタイムリカバリ（PITR）対応

### 手動バックアップ

**pg_dumpでエクスポート**:
```bash
# 全データエクスポート
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# 特定テーブルのみ
pg_dump -h db.xxx.supabase.co -U postgres -d postgres -t clients -t tasks > backup_clients_tasks.sql
```

**CSVエクスポート**:
```sql
-- Supabase SQL Editor
COPY clients TO '/tmp/clients.csv' WITH CSV HEADER;
```

---

## 🔍 データ移行検証チェックリスト

### 移行前

- [ ] LocalStorageデータをバックアップ（JSON export）
- [ ] 外部キー整合性チェック
- [ ] 必須カラムのNULLチェック
- [ ] ID重複チェック

### 移行中

- [ ] トランザクション使用
- [ ] エラーログ記録
- [ ] 進捗表示（テーブル別件数）

### 移行後

- [ ] Supabaseデータ件数確認（LocalStorageと一致）
- [ ] RLS動作確認（ロール別アクセス可否）
- [ ] Incremental Pull動作確認（差分取得）
- [ ] KPI計算確認（Direction/Sales KPI）
- [ ] アラート確認（5種）
- [ ] 通知確認（5種）

---

## 🛠️ トラブルシューティング

### 問題1: RLSでデータが見えない

**原因**:
- JWT Custom Claimsに org_id/client_id/role がない
- RLSポリシーが正しく設定されていない

**対処**:
1. JWT Payloadを確認（フロントのコンソールで）
2. users テーブルで auth_uid が正しく設定されているか確認
3. RLSポリシーを再確認（rls_final.sql）

---

### 問題2: Incremental Pullで差分が取得されない

**原因**:
- lastPulledAt が最新すぎる
- updated_at/created_at が更新されていない

**対処**:
1. IncrementalタブでlastPulledAtをリセット
2. データ更新時にupdated_atトリガーが動作しているか確認
3. Supabase SQL EditorでDEBUG（SELECT * FROM tasks WHERE updated_at > 'xxx'）

---

### 問題3: 外部キー制約違反

**原因**:
- client_id/user_id等が存在しない

**対処**:
1. 親テーブル（clients/users）を先に投入
2. 子テーブル（tasks/approvals等）を後から投入
3. トランザクション使用で一括投入

---

## 📋 実装チェックリスト

### Supabaseセットアップ

- [ ] プロジェクト作成
- [ ] 環境変数設定
- [ ] schema_final.sql実行
- [ ] rls_final.sql実行
- [ ] seed_minimal.sql実行
- [ ] Auth設定（Email Auth）
- [ ] JWT Custom Claims設定
- [ ] テストユーザー作成

### データ移行

- [ ] LocalStorageバックアップ
- [ ] ID採番統一（UUID v4）
- [ ] タイムスタンプ統一（ISO 8601 UTC）
- [ ] 外部キー整合性確認
- [ ] トランザクション投入
- [ ] データ件数確認

### 動作確認

- [ ] RLS動作確認（ロール別）
- [ ] Incremental Pull動作確認
- [ ] KPI計算確認
- [ ] アラート確認
- [ ] 通知確認
- [ ] 受入テスト（TC1-TC9）

---

## 📚 参考資料

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**End of Migration Notes**  
**Next Action**: Supabaseセットアップ → スキーマ適用 → RLS適用 → データ移行
