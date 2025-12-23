-- ============================================================================
-- PALSS SYSTEM — RLS Policies (rls_final.sql)
-- Version: 1.0
-- Date: 2024-12-22
-- Purpose: Row Level Security ポリシー定義
-- ============================================================================

-- ============================================================================
-- 1. RLS補助関数
-- ============================================================================

-- current_user_profile(): ログイン中のユーザー情報を取得
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

-- current_org_id(): ログイン中のユーザーの組織IDを取得
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

-- current_role(): ログイン中のユーザーのロールを取得
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

-- current_client_id(): ログイン中のユーザーのクライアントIDを取得（Clientロールのみ）
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

-- is_internal_role(): 社内ロール（Client以外）かどうか
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

-- is_approver_role(): 承認操作可能なロールかどうか（Direction/Control）
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

-- is_contract_manager_role(): 契約管理可能なロールかどうか（Sales/Control）
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

-- ============================================================================
-- 2. RLS有効化
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. organizations ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織のみ）
CREATE POLICY "organizations_select_internal" ON organizations
  FOR SELECT
  USING (
    id = current_org_id()
    AND deleted_at IS NULL
  );

-- INSERT: Controlのみ
CREATE POLICY "organizations_insert_control" ON organizations
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );

-- UPDATE: Controlのみ（自組織のみ）
CREATE POLICY "organizations_update_control" ON organizations
  FOR UPDATE
  USING (
    id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織のみ）
CREATE POLICY "organizations_delete_control" ON organizations
  FOR DELETE
  USING (
    id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 4. users ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全員）
CREATE POLICY "users_select_internal" ON users
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自分のみ）
CREATE POLICY "users_select_client" ON users
  FOR SELECT
  USING (
    id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: Controlのみ
CREATE POLICY "users_insert_control" ON users
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );

-- UPDATE: Controlのみ（自組織内全員）
CREATE POLICY "users_update_control" ON users
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- UPDATE: Clientロール（自分のみ）
CREATE POLICY "users_update_client" ON users
  FOR UPDATE
  USING (
    id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全員）
CREATE POLICY "users_delete_control" ON users
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 5. clients ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全件）
CREATE POLICY "clients_select_internal" ON clients
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自社のみ）
CREATE POLICY "clients_select_client" ON clients
  FOR SELECT
  USING (
    id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: Sales/Controlのみ
CREATE POLICY "clients_insert_sales_control" ON clients
  FOR INSERT
  WITH CHECK (
    current_role() IN ('sales', 'control')
  );

-- UPDATE: Sales/Controlのみ（自組織内全件）
CREATE POLICY "clients_update_sales_control" ON clients
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() IN ('sales', 'control')
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "clients_delete_control" ON clients
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 6. tasks ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全件）
CREATE POLICY "tasks_select_internal" ON tasks
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自社のみ）
CREATE POLICY "tasks_select_client" ON tasks
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: 社内ロール全て
CREATE POLICY "tasks_insert_internal" ON tasks
  FOR INSERT
  WITH CHECK (
    is_internal_role()
  );

-- UPDATE: 社内ロール全て（自組織内全件）
CREATE POLICY "tasks_update_internal" ON tasks
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "tasks_delete_control" ON tasks
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 7. approvals ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全件）
CREATE POLICY "approvals_select_internal" ON approvals
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自社のみ）
CREATE POLICY "approvals_select_client" ON approvals
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: 承認申請可能ロール（Sales/Direction/Editor/Creator/Control）
CREATE POLICY "approvals_insert_requesters" ON approvals
  FOR INSERT
  WITH CHECK (
    current_role() IN ('sales', 'direction', 'editor', 'creator', 'control')
  );

-- UPDATE: Direction/Controlのみ（承認操作）
CREATE POLICY "approvals_update_approvers" ON approvals
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_approver_role()
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "approvals_delete_control" ON approvals
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 8. comments ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全件）
CREATE POLICY "comments_select_internal" ON comments
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自社のみ）
CREATE POLICY "comments_select_client" ON comments
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: 社内ロール全て
CREATE POLICY "comments_insert_internal" ON comments
  FOR INSERT
  WITH CHECK (
    is_internal_role()
  );

-- INSERT: Clientロール（自社のみ）
CREATE POLICY "comments_insert_client" ON comments
  FOR INSERT
  WITH CHECK (
    client_id = current_client_id()
    AND current_role() = 'client'
  );

-- UPDATE: Controlのみ（自組織内全件）
CREATE POLICY "comments_update_control" ON comments
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "comments_delete_control" ON comments
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 9. contracts ポリシー
-- ============================================================================

-- SELECT: 社内ロール（自組織内全件）
CREATE POLICY "contracts_select_internal" ON contracts
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND is_internal_role()
    AND deleted_at IS NULL
  );

-- SELECT: Clientロール（自社のみ）
CREATE POLICY "contracts_select_client" ON contracts
  FOR SELECT
  USING (
    client_id = current_client_id()
    AND current_role() = 'client'
    AND deleted_at IS NULL
  );

-- INSERT: Sales/Controlのみ
CREATE POLICY "contracts_insert_sales_control" ON contracts
  FOR INSERT
  WITH CHECK (
    is_contract_manager_role()
  );

-- UPDATE: Sales/Controlのみ（自組織内全件）
CREATE POLICY "contracts_update_sales_control" ON contracts
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND is_contract_manager_role()
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "contracts_delete_control" ON contracts
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- 10. notifications ポリシー
-- ============================================================================

-- SELECT: 自分宛のみ（全ロール）
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );

-- SELECT: Controlのみ（自組織内全件）
CREATE POLICY "notifications_select_control" ON notifications
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- INSERT: Controlのみ（システム自動生成はアプリケーション層）
CREATE POLICY "notifications_insert_control" ON notifications
  FOR INSERT
  WITH CHECK (
    current_role() = 'control'
  );

-- UPDATE: 自分宛のみ（既読操作）
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );

-- UPDATE: Controlのみ（自組織内全件）
CREATE POLICY "notifications_update_control" ON notifications
  FOR UPDATE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- DELETE: 自分宛のみ（全ロール）
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE
  USING (
    user_id = (SELECT id FROM users WHERE auth_uid = auth.uid())
    AND deleted_at IS NULL
  );

-- DELETE: Controlのみ（自組織内全件）
CREATE POLICY "notifications_delete_control" ON notifications
  FOR DELETE
  USING (
    org_id = current_org_id()
    AND current_role() = 'control'
    AND deleted_at IS NULL
  );

-- ============================================================================
-- End of rls_final.sql
-- ============================================================================
