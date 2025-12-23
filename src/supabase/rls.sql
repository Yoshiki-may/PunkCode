-- PALSS SYSTEM - Row Level Security Policies
-- Phase 9: Supabase統合
-- 前提: schema.sql を先に実行してください
-- 実行順序: このファイルをSupabase SQLエディタで実行してください

-- ==============================
-- RLSを有効化
-- ==============================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Organizations ポリシー
-- ==============================

-- 自分の組織を閲覧可能
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id = auth.user_org_id());

-- ==============================
-- Users ポリシー
-- ==============================

-- 同じ組織のユーザーを閲覧可能
CREATE POLICY "Users can view users in same organization"
  ON users FOR SELECT
  USING (org_id = auth.user_org_id());

-- 自分のプロフィールを更新可能
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- ==============================
-- Clients ポリシー
-- ==============================

-- Sales/Direction/Editor/Creator/Support: 同じ組織の全クライアントを閲覧可能
CREATE POLICY "Team members can view all clients in organization"
  ON clients FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
  );

-- Client: 自分に割り当てられたクライアントのみ閲覧可能
CREATE POLICY "Clients can view own client data"
  ON clients FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() = 'client'
    AND id = auth.user_client_id()
  );

-- Sales/Direction/Support: クライアント作成可能
CREATE POLICY "Sales/Direction/Support can create clients"
  ON clients FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'support')
  );

-- Sales/Direction/Support: クライアント更新可能
CREATE POLICY "Sales/Direction/Support can update clients"
  ON clients FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'support')
  );

-- ==============================
-- Tasks ポリシー
-- ==============================

-- Team members: 同じ組織の全タスクを閲覧可能
CREATE POLICY "Team members can view all tasks in organization"
  ON tasks FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
  );

-- Client: 自分のクライアントのタスクのみ閲覧可能
CREATE POLICY "Clients can view own tasks"
  ON tasks FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() = 'client'
    AND client_id = auth.user_client_id()
  );

-- Direction/Editor/Creator: タスク作成可能
CREATE POLICY "Direction/Editor/Creator can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('direction', 'editor', 'creator', 'support')
  );

-- Direction/Editor/Creator/担当者: タスク更新可能
CREATE POLICY "Direction/Editor/Creator/Assignee can update tasks"
  ON tasks FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND (
      auth.user_role() IN ('direction', 'editor', 'creator', 'support')
      OR assignee_id = auth.uid()
    )
  );

-- ==============================
-- Approvals ポリシー
-- ==============================

-- Team members: 同じ組織の全承認を閲覧可能
CREATE POLICY "Team members can view all approvals in organization"
  ON approvals FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
  );

-- Client: 自分のクライアントの承認のみ閲覧可能
CREATE POLICY "Clients can view own approvals"
  ON approvals FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() = 'client'
    AND client_id = auth.user_client_id()
  );

-- Direction/Editor/Creator: 承認作成可能
CREATE POLICY "Direction/Editor/Creator can create approvals"
  ON approvals FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('direction', 'editor', 'creator', 'support')
  );

-- Direction/Client: 承認更新可能（承認/却下）
CREATE POLICY "Direction/Client can update approvals"
  ON approvals FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND (
      auth.user_role() IN ('direction', 'support')
      OR (auth.user_role() = 'client' AND client_id = auth.user_client_id())
    )
  );

-- ==============================
-- Comments ポリシー
-- ==============================

-- Team members: 同じ組織の全コメントを閲覧可能
CREATE POLICY "Team members can view all comments in organization"
  ON comments FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
  );

-- Client: 自分のクライアントのコメントのみ閲覧可能
CREATE POLICY "Clients can view own comments"
  ON comments FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() = 'client'
    AND client_id = auth.user_client_id()
  );

-- 全員: コメント作成可能
CREATE POLICY "All users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
    AND (
      auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
      OR (auth.user_role() = 'client' AND client_id = auth.user_client_id())
    )
  );

-- 自分のコメント: 更新可能
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND user_id = auth.uid()
  );

-- ==============================
-- Contracts ポリシー
-- ==============================

-- Team members: 同じ組織の全契約を閲覧可能
CREATE POLICY "Team members can view all contracts in organization"
  ON contracts FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'editor', 'creator', 'support')
  );

-- Client: 自分のクライアントの契約のみ閲覧可能
CREATE POLICY "Clients can view own contracts"
  ON contracts FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() = 'client'
    AND client_id = auth.user_client_id()
  );

-- Sales/Direction/Support: 契約作成可能
CREATE POLICY "Sales/Direction/Support can create contracts"
  ON contracts FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'support')
  );

-- Sales/Direction/Support: 契約更新可能
CREATE POLICY "Sales/Direction/Support can update contracts"
  ON contracts FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND auth.user_role() IN ('sales', 'direction', 'support')
  );

-- ==============================
-- Notifications ポリシー
-- ==============================

-- 自分宛の通知を閲覧可能
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (
    org_id = auth.user_org_id()
    AND target_user_id = auth.uid()
  );

-- 全員: 通知作成可能（システムから送信）
CREATE POLICY "All users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    org_id = auth.user_org_id()
  );

-- 自分宛の通知: 更新可能（既読化）
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (
    org_id = auth.user_org_id()
    AND target_user_id = auth.uid()
  );

-- ==============================
-- 完了
-- ==============================
-- RLS設定が完了しました。
-- 次に seed.sql を実行して初期データを投入してください。
