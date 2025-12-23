# PALSS SYSTEM — RLS（Row Level Security）ポリシー最終版

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（バックエンド実装用）

---

## 📋 RLS概要

### 目的

**Row Level Security（行レベルセキュリティ）**:
- PostgreSQLの機能でテーブルの行単位でアクセス制御
- ユーザーのロール・組織・クライアントIDに基づいて参照・更新可能なデータを制限
- アプリケーション層のバグに関係なくDB層でセキュリティ保証

### 基本方針

1. **マルチテナント分離**: org_idで組織境界を厳格に分離
2. **ロール別制御**: 7ロール（sales/direction/editor/creator/support/control/client）ごとに権限を定義
3. **クライアントスコープ**: Clientロールは自社client_idのデータのみアクセス
4. **論理削除対応**: deleted_at IS NULLをポリシーに組み込む
5. **JWT Custom Claims**: Supabase AuthのJWTから org_id/client_id/roleを取得

---

## 🔐 JWT Custom Claims

### Supabase AuthのJWT Payload

```json
{
  "sub": "auth_uid",
  "email": "user@example.com",
  "app_metadata": {
    "role": "sales",
    "org_id": "org_uuid",
    "client_id": null
  }
}
```

### 取得方法（SQL）

```sql
-- auth.uid()
auth.uid() → auth_uid（UUID）

-- app_metadata.role
auth.jwt() ->> 'role' → 'sales'

-- app_metadata.org_id
auth.jwt() ->> 'org_id' → 'org_uuid'

-- app_metadata.client_id
auth.jwt() ->> 'client_id' → 'client_uuid' or NULL
```

---

## 🛠️ 補助関数（Helper Functions）

### 1. current_user_profile()

**目的**: ログイン中のユーザー情報を取得

```sql
CREATE OR REPLACE FUNCTION current_user_profile()
RETURNS SETOF users
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT *
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 2. current_org_id()

**目的**: ログイン中のユーザーの組織IDを取得

```sql
CREATE OR REPLACE FUNCTION current_org_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT org_id
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 3. current_role()

**目的**: ログイン中のユーザーのロールを取得

```sql
CREATE OR REPLACE FUNCTION current_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 4. current_client_id()

**目的**: ログイン中のユーザーのクライアントIDを取得（Clientロールのみ）

```sql
CREATE OR REPLACE FUNCTION current_client_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT client_id
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 5. is_internal_role()

**目的**: 社内ロール（Client以外）かどうか

```sql
CREATE OR REPLACE FUNCTION is_internal_role()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role IN ('sales', 'direction', 'editor', 'creator', 'support', 'control')
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 6. is_approver_role()

**目的**: 承認操作可能なロールかどうか（Direction/Control）

```sql
CREATE OR REPLACE FUNCTION is_approver_role()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role IN ('direction', 'control')
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

### 7. is_contract_manager_role()

**目的**: 契約管理可能なロールかどうか（Sales/Control）

```sql
CREATE OR REPLACE FUNCTION is_contract_manager_role()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role IN ('sales', 'control')
  FROM users
  WHERE auth_uid = auth.uid()
    AND deleted_at IS NULL
  LIMIT 1;
$$;
```

---

## 📊 RBAC最終表（ロール×テーブル×操作）

### 凡例

- **R**: Read（SELECT）
- **C**: Create（INSERT）
- **U**: Update（UPDATE）
- **D**: Delete（DELETE）
- **✅**: 許可
- **❌**: 禁止
- **⚠️**: 条件付き許可

---

### organizations

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織のみ | ❌ | ❌ | ❌ | 閲覧のみ |
| Direction | ✅ 自組織のみ | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ 自組織のみ | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ 自組織のみ | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ 自組織のみ | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ 自組織のみ | ✅ | ✅ 自組織のみ | ⚠️ 自組織のみ | 管理者権限 |
| Client | ❌ | ❌ | ❌ | ❌ | アクセス不可 |

---

### users

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全員 | ❌ | ❌ | ❌ | 閲覧のみ |
| Direction | ✅ 自組織内全員 | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ 自組織内全員 | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ 自組織内全員 | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ 自組織内全員 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ 自組織内全員 | ✅ | ✅ 自組織内全員 | ⚠️ 自組織内全員 | 管理者権限 |
| Client | ✅ 自分のみ | ❌ | ✅ 自分のみ | ❌ | プロファイル更新のみ |

---

### clients

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | クライアント管理 |
| Direction | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社情報のみ閲覧 |

---

### tasks

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | タスク管理 |
| Direction | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | タスク管理 |
| Editor | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | タスク管理 |
| Creator | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | タスク管理 |
| Support | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | タスク管理 |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社タスク閲覧のみ |

---

### approvals

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Direction | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | **承認操作可能** |
| Editor | ✅ 自組織内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Creator | ✅ 自組織内全件 | ✅ | ❌ | ❌ | 承認申請のみ |
| Support | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限、承認操作可能 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社承認閲覧のみ |

**重要**: 承認操作（status更新）はDirection/Controlのみ可能

---

### comments

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Direction | ✅ 自組織内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Editor | ✅ 自組織内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Creator | ✅ 自組織内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Support | ✅ 自組織内全件 | ✅ | ❌ | ❌ | コメント投稿のみ |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限 |
| Client | ✅ 自社のみ | ✅ 自社のみ | ❌ | ❌ | 自社タスク/承認へのコメント投稿 |

---

### contracts

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ❌ | 契約管理 |
| Direction | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Editor | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Creator | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Support | ✅ 自組織内全件 | ❌ | ❌ | ❌ | 閲覧のみ |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限、契約管理 |
| Client | ✅ 自社のみ | ❌ | ❌ | ❌ | 自社契約閲覧のみ |

**重要**: 契約作成・更新はSales/Controlのみ可能

---

### notifications

| ロール | SELECT | INSERT | UPDATE | DELETE | 備考 |
|--------|--------|--------|--------|--------|------|
| Sales | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |
| Direction | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |
| Editor | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |
| Creator | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |
| Support | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |
| Control | ✅ 自組織内全件 | ✅ | ✅ 自組織内全件 | ⚠️ 自組織内全件 | 管理者権限 |
| Client | ✅ 自分宛のみ | ⚠️ システム | ✅ 自分宛のみ | ⚠️ 自分宛のみ | 既読操作のみ |

**重要**: 通知作成はシステム自動生成（アプリケーション層）、ユーザーは既読操作のみ

---

## 🔒 RLSポリシー詳細

### organizations

#### SELECT

**社内ロール（自組織のみ）**:
```sql
CREATE POLICY "organizations_select_internal" ON organizations
  FOR SELECT
  USING (
    id = current_org_id()
    AND deleted_at IS NULL
  );
```

#### INSERT

**Controlのみ**:
```sql
CREATE POLICY "organizations_insert_control" ON organizations
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );
```

#### UPDATE

**Controlのみ（自組織のみ）**:
```sql
CREATE POLICY "organizations_update_control" ON organizations
  FOR UPDATE
  USING (
    id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織のみ）**:
```sql
CREATE POLICY "organizations_delete_control" ON organizations
  FOR DELETE
  USING (
    id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### users

#### SELECT

**社内ロール（自組織内全員）**:
```sql
CREATE POLICY "users_select_internal" ON users
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自分のみ）**:
```sql
CREATE POLICY "users_select_client" ON users
  FOR SELECT
  USING (
    id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**Controlのみ**:
```sql
CREATE POLICY "users_insert_control" ON users
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );
```

#### UPDATE

**Controlのみ（自組織内全員）**:
```sql
CREATE POLICY "users_update_control" ON users
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

**Clientロール（自分のみ）**:
```sql
CREATE POLICY "users_update_client" ON users
  FOR UPDATE
  USING (
    id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全員）**:
```sql
CREATE POLICY "users_delete_control" ON users
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### clients

#### SELECT

**社内ロール（自組織内全件）**:
```sql
CREATE POLICY "clients_select_internal" ON clients
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "clients_select_client" ON clients
  FOR SELECT
  USING (
    id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**Sales/Controlのみ**:
```sql
CREATE POLICY "clients_insert_sales_control" ON clients
  FOR INSERT
  WITH CHECK (
    current_role() IN ('sales', 'control')
  );
```

#### UPDATE

**Sales/Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "clients_update_sales_control" ON clients
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() IN ('sales', 'control')
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "clients_delete_control" ON clients
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### tasks

#### SELECT

**社内ロール（自組織内全件）**:
```sql
CREATE POLICY "tasks_select_internal" ON tasks
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "tasks_select_client" ON tasks
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**社内ロール全て**:
```sql
CREATE POLICY "tasks_insert_internal" ON tasks
  FOR INSERT
  WITH CHECK (
    is_internal_role()
  );
```

#### UPDATE

**社内ロール全て（自組織内全件）**:
```sql
CREATE POLICY "tasks_update_internal" ON tasks
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "tasks_delete_control" ON tasks
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### approvals

#### SELECT

**社内ロール（自組織内全件）**:
```sql
CREATE POLICY "approvals_select_internal" ON approvals
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "approvals_select_client" ON approvals
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**承認申請可能ロール（Sales/Direction/Editor/Creator）**:
```sql
CREATE POLICY "approvals_insert_requesters" ON approvals
  FOR INSERT
  WITH CHECK (
    current_role() IN ('sales', 'direction', 'editor', 'creator', 'control')
  );
```

#### UPDATE

**Direction/Controlのみ（承認操作）**:
```sql
CREATE POLICY "approvals_update_approvers" ON approvals
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_approver_role()
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "approvals_delete_control" ON approvals
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### comments

#### SELECT

**社内ロール（自組織内全件）**:
```sql
CREATE POLICY "comments_select_internal" ON comments
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "comments_select_client" ON comments
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**社内ロール全て**:
```sql
CREATE POLICY "comments_insert_internal" ON comments
  FOR INSERT
  WITH CHECK (
    is_internal_role()
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "comments_insert_client" ON comments
  FOR INSERT
  WITH CHECK (
    client_id = current_client_id()
    AND current_role() = 'client'
  );
```

#### UPDATE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "comments_update_control" ON comments
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "comments_delete_control" ON comments
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### contracts

#### SELECT

**社内ロール（自組織内全件）**:
```sql
CREATE POLICY "contracts_select_internal" ON contracts
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );
```

**Clientロール（自社のみ）**:
```sql
CREATE POLICY "contracts_select_client" ON contracts
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );
```

#### INSERT

**Sales/Controlのみ**:
```sql
CREATE POLICY "contracts_insert_sales_control" ON contracts
  FOR INSERT
  WITH CHECK (
    is_contract_manager_role()
  );
```

#### UPDATE

**Sales/Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "contracts_update_sales_control" ON contracts
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_contract_manager_role()
    AND deleted_at IS NULL
  );
```

#### DELETE

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "contracts_delete_control" ON contracts
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

### notifications

#### SELECT

**自分宛のみ（全ロール）**:
```sql
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );
```

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "notifications_select_control" ON notifications
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

#### INSERT

**Controlのみ（システム自動生成はアプリケーション層）**:
```sql
CREATE POLICY "notifications_insert_control" ON notifications
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );
```

#### UPDATE

**自分宛のみ（既読操作）**:
```sql
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );
```

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "notifications_update_control" ON notifications
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

#### DELETE

**自分宛のみ（全ロール）**:
```sql
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );
```

**Controlのみ（自組織内全件）**:
```sql
CREATE POLICY "notifications_delete_control" ON notifications
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );
```

---

## ⚠️ セキュリティ注意事項

### 1. SECURITY DEFINER関数

**リスク**: SECURITY DEFINER関数は作成者権限で実行されるため、悪用されるとセキュリティホール

**対策**:
- `SET search_path = public` を設定
- 最小権限の原則に従う
- 定期的にレビュー

### 2. JWT Custom Claims

**リスク**: JWT Claimsが改ざんされるとRLS突破

**対策**:
- Supabase AuthのJWT署名検証に依存
- フロントエンドでservice_roleキーを使わない
- anon/authenticatedキーのみ使用

### 3. 論理削除

**リスク**: deleted_at IS NULL を忘れるとデータ漏洩

**対策**:
- 全ポリシーに `deleted_at IS NULL` を組み込む
- 定期的なレビュー

### 4. Controlロールの権限

**リスク**: Controlロールは全権限を持つため、悪用されると危険

**対策**:
- Controlロールの付与は最小限に
- 監査ログ（Phase 13）でControl操作を記録

---

## 📋 実装チェックリスト

### 補助関数

- [ ] current_user_profile()
- [ ] current_org_id()
- [ ] current_role()
- [ ] current_client_id()
- [ ] is_internal_role()
- [ ] is_approver_role()
- [ ] is_contract_manager_role()

### RLS有効化

- [ ] organizations RLS有効化
- [ ] users RLS有効化
- [ ] clients RLS有効化
- [ ] tasks RLS有効化
- [ ] approvals RLS有効化
- [ ] comments RLS有効化
- [ ] contracts RLS有効化
- [ ] notifications RLS有効化

### ポリシー作成

- [ ] organizations（SELECT/INSERT/UPDATE/DELETE）
- [ ] users（SELECT/INSERT/UPDATE/DELETE）
- [ ] clients（SELECT/INSERT/UPDATE/DELETE）
- [ ] tasks（SELECT/INSERT/UPDATE/DELETE）
- [ ] approvals（SELECT/INSERT/UPDATE/DELETE）
- [ ] comments（SELECT/INSERT/UPDATE/DELETE）
- [ ] contracts（SELECT/INSERT/UPDATE/DELETE）
- [ ] notifications（SELECT/INSERT/UPDATE/DELETE）

### テスト

- [ ] 社内ロールで自組織データのみアクセス可能
- [ ] Clientロールで自社データのみアクセス可能
- [ ] Direction/Controlのみ承認操作可能
- [ ] Sales/Controlのみ契約管理可能
- [ ] 通知は自分宛のみアクセス可能
- [ ] 削除データは表示されない

---

**End of RLS Policy Document**  
**Next Action**: schema_final.sql、rls_final.sql作成
