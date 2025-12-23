# PALSS SYSTEM — セキュリティ基準（SECURITY_BASELINE.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（最低限のセキュリティ基準）  
**対象**: 開発チーム、運用チーム、セキュリティ担当

---

## 🎯 セキュリティ方針

### 基本原則

1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **多層防御**: Auth + RLS + アプリケーション層の3層で防御
3. **SSOT信頼**: Supabaseをマスターデータとして信頼
4. **PIIマスキング**: 個人情報をログに出力しない
5. **監査追跡**: 全重要操作を記録

---

## 🔐 認証・認可

### 1. Supabase Auth設定

**必須設定**:

- [ ] Email Auth有効化
- [ ] パスワード強度設定
  - 最小8文字
  - 大文字・小文字・数字・記号混在推奨
- [ ] JWT有効期限設定
  - アクセストークン: 1時間
  - リフレッシュトークン: 7日間
- [ ] CORS設定
  - 許可ドメインのみ設定
  - `*`（全許可）は禁止

**JWT Custom Claims**:

```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "app_metadata": {
    "role": "sales",
    "org_id": "org_uuid",
    "client_id": null
  }
}
```

**重要**: JWT Claimsは改ざん不可（署名検証）、RLSで最終判定

---

### 2. RLS（Row Level Security）

**必須要件**:

- [ ] 全テーブルでRLS有効化
  ```sql
  ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
  ```
- [ ] 全操作（SELECT/INSERT/UPDATE/DELETE）にポリシー設定
- [ ] org_id/client_id境界の厳格な分離
- [ ] deleted_at IS NULL を全ポリシーに含める

**ポリシー例（clients）**:

```sql
-- 社内ロール: 自組織のみ
CREATE POLICY "clients_select_internal" ON clients
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- Clientロール: 自社のみ
CREATE POLICY "clients_select_client" ON clients
  FOR SELECT
  USING (
    id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

**検証方法**:

```
1. Clientロールでログイン
2. Supabase → Table Editor → clients
3. 自社データのみ表示されるか確認
4. 他社データが0件か確認
```

---

### 3. API Key管理

**必須ルール**:

- [ ] **service_role_key**: サーバーサイドのみ使用、フロントエンドに置かない
- [ ] **anon_key**: フロントエンドで使用、公開OK（RLSで保護）
- [ ] 環境変数管理: `.env.local`（Git管理外）
- [ ] 本番環境: Vercel/Netlify等の環境変数設定機能使用

**環境変数例**:

```bash
# フロントエンド（公開OK）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# バックエンド（秘密）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**禁止事項**:

- ❌ service_role_key をフロントエンドに配置
- ❌ service_role_key をGitコミット
- ❌ anon_key をハードコード

---

## 🛡️ データ保護

### 1. PII（Personal Identifiable Information）

**PII定義**:
- 氏名、メールアドレス、電話番号
- クライアント企業名（センシティブな場合）
- パスワード、APIキー

**保護ルール**:

- [ ] PIIをログに出力しない
  - console.log でPII出力禁止
  - 監査ログでPIIマスキング
- [ ] PIIを暗号化（必要に応じて）
  - PostgreSQL pgcrypto使用
- [ ] PIIの最小保持
  - 不要になったら削除（論理削除 → 物理削除）

**マスキング例**:

```javascript
// 悪い例
console.log('User logged in:', user.email)

// 良い例
console.log('User logged in:', user.id)

// 監査ログ
{
  "action": "user.login",
  "user_id": "user_uuid",
  "email_masked": "u***@example.com", // マスキング
  "timestamp": "2024-12-22T10:00:00Z"
}
```

---

### 2. SQL Injection対策

**必須対策**:

- [ ] Prepared Statements使用（Supabase SDKは自動対応）
- [ ] ユーザー入力を直接SQLに埋め込まない

**安全な例**:

```javascript
// 安全（Supabase SDK）
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('client_id', clientId) // パラメータバインド

// 危険（Raw SQL）❌
const query = `SELECT * FROM tasks WHERE client_id = '${clientId}'`
// clientId = "'; DROP TABLE tasks; --" などの攻撃可能
```

---

### 3. XSS（Cross-Site Scripting）対策

**必須対策**:

- [ ] React自動エスケープに依存
- [ ] dangerouslySetInnerHTML使用禁止
- [ ] ユーザー入力をサニタイズ

**安全な例**:

```jsx
// 安全（Reactが自動エスケープ）
<div>{user.name}</div>

// 危険❌
<div dangerouslySetInnerHTML={{ __html: user.name }} />
```

---

## 🔍 監査ログ

### 1. 監査対象イベント

**必須記録**:

- [ ] Auth: login, logout, password_reset
- [ ] Task: create, update, delete, complete
- [ ] Approval: create, approve, reject
- [ ] Comment: create
- [ ] Contract: create, update, delete
- [ ] Client: create, update, delete
- [ ] User: create, update, delete（Controlのみ）

**ログ項目**:

```json
{
  "id": "log_uuid",
  "timestamp": "2024-12-22T10:00:00Z",
  "actor_user_id": "user_uuid",
  "actor_role": "sales",
  "action": "task.create",
  "entity_type": "task",
  "entity_id": "task_uuid",
  "org_id": "org_uuid",
  "client_id": "client_uuid",
  "before": null,
  "after": {
    "title": "タスク作成",
    "status": "not_started"
  },
  "request_id": "req_abc123"
}
```

---

### 2. 監査ログテーブル

**スキーマ**:

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_user_id UUID NOT NULL REFERENCES users(id),
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NULL,
  org_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID NULL REFERENCES clients(id),
  before JSONB NULL,
  after JSONB NULL,
  request_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_org_id_timestamp ON activity_log(org_id, timestamp);
CREATE INDEX idx_activity_log_actor_user_id ON activity_log(actor_user_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
```

---

### 3. 監査ログ閲覧権限

**アクセス権限**:

- **Control**: 自組織の全ログ閲覧可能
- **Support**: 自組織の全ログ閲覧可能（調査用）
- **その他**: 閲覧不可

**RLSポリシー**:

```sql
CREATE POLICY "activity_log_select_control_support" ON activity_log
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND current_role() IN ('control', 'support')
  );
```

---

## 🚨 セキュリティインシデント対応

### インシデント分類

| レベル | 定義 | 例 |
|--------|------|-----|
| **Critical** | データ漏洩、権限昇格 | RLS突破、他社データ閲覧 |
| **High** | 不正アクセス | ブルートフォース成功 |
| **Medium** | セキュリティ設定ミス | RLS無効化、CORS設定ミス |
| **Low** | 軽微な脆弱性 | XSS（非エスケープ） |

---

### Critical: データ漏洩対応

**初動（15分）**:

```
□ 影響範囲確認
  - どのデータが漏洩したか
  - 何件のレコードか
  - PIIが含まれるか

□ 緊急遮断
  - 該当ユーザーのセッション無効化
  - RLS再確認・修正
  - 必要なら一時サービス停止

□ 通知
  - 経営層へ報告
  - 影響を受けたユーザーへ通知
  - 監督官庁へ報告（法的義務）
```

**調査（1時間）**:

```
□ 監査ログ確認
  SELECT * FROM activity_log 
  WHERE actor_user_id = '<suspected_user_id>'
    AND timestamp > '<incident_start_time>';

□ Supabase Logs確認
  - Dashboard → Logs → Auth/API Logs
  - 不正アクセスパターン確認

□ RLSポリシー確認
  SELECT * FROM pg_policies;
  - ポリシー不備の特定
```

**対処（2時間）**:

```
□ RLS修正
  - ポリシー修正
  - rls_final.sql再実行

□ セッション無効化
  - Supabase → Auth → Users
  - "Sign Out User"

□ パスワードリセット強制（必要に応じて）
```

---

### High: ブルートフォース攻撃

**検知**:

```
- 短時間に大量のログイン失敗
- Supabase → Auth → Logs で確認
```

**対処**:

```
□ Rate Limit設定
  - Supabase → Auth → Settings → Rate Limits
  - 1分間に5回まで等

□ IP制限（必要に応じて）
  - Cloudflare等でIP制限

□ 該当IPブロック
```

---

## 🔒 定期セキュリティレビュー

### 月次レビュー

**チェック項目**:

- [ ] 監査ログレビュー（Control権限）
  - 不審な操作がないか
  - 深夜のデータ変更
  - 大量削除操作
- [ ] RLSポリシーレビュー
  - ポリシー変更履歴確認
  - 不要なポリシー削除
- [ ] ユーザー権限レビュー
  - 不要なユーザー削除
  - ロール適切性確認
- [ ] APIキーローテーション検討
  - 6ヶ月ごとにanon_key再生成推奨

---

### 四半期レビュー

**チェック項目**:

- [ ] 脆弱性スキャン
  - npm audit実行
  - 依存パッケージ更新
- [ ] ペネトレーションテスト（任意）
  - 外部業者委託
- [ ] セキュリティポリシー更新
  - 新脅威への対応
- [ ] インシデント訓練
  - 模擬インシデント対応

---

## 📋 セキュリティチェックリスト

### 開発時

- [ ] service_role_key をフロントエンドに配置していない
- [ ] PIIをログに出力していない
- [ ] ユーザー入力をサニタイズしている
- [ ] RLSポリシーを全テーブルに設定している
- [ ] JWT Custom Claimsを正しく設定している

### リリース前

- [ ] RLS動作確認（Clientロールで他社データ0件）
- [ ] 監査ログ動作確認
- [ ] 環境変数確認（本番用設定）
- [ ] CORS設定確認（許可ドメインのみ）

### 運用時

- [ ] 月次監査ログレビュー
- [ ] 月次RLSポリシーレビュー
- [ ] 月次ユーザー権限レビュー
- [ ] 四半期脆弱性スキャン

---

## 🔗 関連ドキュメント

- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順
- [AUDIT_LOG_SPEC.md](./AUDIT_LOG_SPEC.md) - 監査ログ仕様
- [RLS_POLICY.md](./RLS_POLICY.md) - RLSポリシー詳細

---

**End of SECURITY_BASELINE.md**
