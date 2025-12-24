-- ============================================================================
-- PALSS SYSTEM — Final Schema (schema_final.sql)
-- Version: 1.0
-- Date: 2024-12-22
-- Purpose: バックエンド実装用の最終スキーマ定義
-- ============================================================================

-- ============================================================================
-- 1. 拡張機能
-- ============================================================================

-- UUID生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. organizations（組織）
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- インデックス
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE organizations IS '組織（マルチテナント）';
COMMENT ON COLUMN organizations.id IS '組織ID（主キー）';
COMMENT ON COLUMN organizations.name IS '組織名';
COMMENT ON COLUMN organizations.slug IS 'URLスラグ（一意）';
COMMENT ON COLUMN organizations.deleted_at IS '削除日時（論理削除）';

-- ============================================================================
-- 3. users（ユーザー）
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sales', 'direction', 'editor', 'creator', 'support', 'control', 'client')),
  org_id UUID NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NULL, -- FKは後で設定（clients作成後）
  avatar_url TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
  CONSTRAINT users_role_scope_check CHECK (
    (role = 'client' AND client_id IS NOT NULL AND org_id IS NULL) OR
    (role != 'client' AND org_id IS NOT NULL AND client_id IS NULL)
  )
);

-- インデックス
CREATE INDEX idx_users_auth_uid ON users(auth_uid);
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_client_id ON users(client_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE users IS 'ユーザー（Supabase Auth連携）';
COMMENT ON COLUMN users.id IS 'ユーザーID（主キー）';
COMMENT ON COLUMN users.auth_uid IS 'Supabase Auth UID（一意）';
COMMENT ON COLUMN users.email IS 'メールアドレス';
COMMENT ON COLUMN users.name IS '氏名';
COMMENT ON COLUMN users.role IS 'ロール（sales/direction/editor/creator/support/control/client）';
COMMENT ON COLUMN users.org_id IS '組織ID（社内ロールのみ）';
COMMENT ON COLUMN users.client_id IS 'クライアントID（Clientロールのみ）';
COMMENT ON COLUMN users.deleted_at IS '削除日時（論理削除）';

-- ============================================================================
-- 4. clients（クライアント）
-- ============================================================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT NULL,
  contact_email TEXT NULL,
  contact_phone TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- インデックス
CREATE INDEX idx_clients_org_id ON clients(org_id);
CREATE INDEX idx_clients_org_id_updated_at ON clients(org_id, updated_at);
CREATE INDEX idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE clients IS 'クライアント';
COMMENT ON COLUMN clients.id IS 'クライアントID（主キー）';
COMMENT ON COLUMN clients.org_id IS '組織ID';
COMMENT ON COLUMN clients.name IS 'クライアント名';
COMMENT ON COLUMN clients.industry IS '業種';
COMMENT ON COLUMN clients.contact_email IS '連絡先メールアドレス';
COMMENT ON COLUMN clients.contact_phone IS '連絡先電話番号';
COMMENT ON COLUMN clients.deleted_at IS '削除日時（論理削除）';

-- users.client_idにFKを追加（clients作成後）
ALTER TABLE users
  ADD CONSTRAINT fk_users_client_id
  FOREIGN KEY (client_id)
  REFERENCES clients(id)
  ON DELETE CASCADE;

-- ============================================================================
-- 5. tasks（タスク）
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  assignee_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE NULL,
  post_date DATE NULL,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- インデックス
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_org_id_client_id ON tasks(org_id, client_id);
CREATE INDEX idx_tasks_org_id_client_id_status ON tasks(org_id, client_id, status);
CREATE INDEX idx_tasks_org_id_updated_at ON tasks(org_id, updated_at);
CREATE INDEX idx_tasks_org_id_due_date ON tasks(org_id, due_date);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE tasks IS 'タスク';
COMMENT ON COLUMN tasks.id IS 'タスクID（主キー）';
COMMENT ON COLUMN tasks.org_id IS '組織ID';
COMMENT ON COLUMN tasks.client_id IS 'クライアントID';
COMMENT ON COLUMN tasks.title IS 'タスク名';
COMMENT ON COLUMN tasks.description IS 'タスク説明';
COMMENT ON COLUMN tasks.status IS 'ステータス（not_started/in_progress/completed）';
COMMENT ON COLUMN tasks.assignee_id IS '担当者ID';
COMMENT ON COLUMN tasks.due_date IS '期限';
COMMENT ON COLUMN tasks.post_date IS '投稿日';
COMMENT ON COLUMN tasks.completed_at IS '完了日時';
COMMENT ON COLUMN tasks.last_activity_at IS '最終活動日時';
COMMENT ON COLUMN tasks.deleted_at IS '削除日時（論理削除）';

-- ============================================================================
-- 6. approvals（承認）
-- ============================================================================

CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approver_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE NULL,
  approved_at TIMESTAMPTZ NULL,
  rejected_at TIMESTAMPTZ NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- インデックス
CREATE INDEX idx_approvals_org_id ON approvals(org_id);
CREATE INDEX idx_approvals_client_id ON approvals(client_id);
CREATE INDEX idx_approvals_org_id_client_id ON approvals(org_id, client_id);
CREATE INDEX idx_approvals_org_id_client_id_status ON approvals(org_id, client_id, status);
CREATE INDEX idx_approvals_org_id_updated_at ON approvals(org_id, updated_at);
CREATE INDEX idx_approvals_submitter_id ON approvals(submitter_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_deleted_at ON approvals(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE approvals IS '承認';
COMMENT ON COLUMN approvals.id IS '承認ID（主キー）';
COMMENT ON COLUMN approvals.org_id IS '組織ID';
COMMENT ON COLUMN approvals.client_id IS 'クライアントID';
COMMENT ON COLUMN approvals.title IS '承認件名';
COMMENT ON COLUMN approvals.description IS '承認説明';
COMMENT ON COLUMN approvals.status IS 'ステータス（pending/approved/rejected）';
COMMENT ON COLUMN approvals.submitter_id IS '申請者ID';
COMMENT ON COLUMN approvals.approver_id IS '承認者ID';
COMMENT ON COLUMN approvals.due_date IS '承認期限';
COMMENT ON COLUMN approvals.approved_at IS '承認日時';
COMMENT ON COLUMN approvals.rejected_at IS '差し戻し日時';
COMMENT ON COLUMN approvals.rejection_reason IS '差し戻し理由';
COMMENT ON COLUMN approvals.completed_at IS '完了日時（approved_at or rejected_at）';
COMMENT ON COLUMN approvals.deleted_at IS '削除日時（論理削除）';

-- ============================================================================
-- 7. comments（コメント）
-- ============================================================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NULL REFERENCES tasks(id) ON DELETE CASCADE,
  approval_id UUID NULL REFERENCES approvals(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('client_to_team', 'team_to_client')),
  is_from_client BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
  CONSTRAINT comments_target_check CHECK (
    (task_id IS NOT NULL AND approval_id IS NULL) OR
    (task_id IS NULL AND approval_id IS NOT NULL)
  )
);

-- インデックス
CREATE INDEX idx_comments_org_id ON comments(org_id);
CREATE INDEX idx_comments_client_id ON comments(client_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_approval_id ON comments(approval_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_org_id_created_at ON comments(org_id, created_at);
CREATE INDEX idx_comments_deleted_at ON comments(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE comments IS 'コメント';
COMMENT ON COLUMN comments.id IS 'コメントID（主キー）';
COMMENT ON COLUMN comments.org_id IS '組織ID';
COMMENT ON COLUMN comments.client_id IS 'クライアントID';
COMMENT ON COLUMN comments.content IS 'コメント本文';
COMMENT ON COLUMN comments.author_id IS '投稿者ID';
COMMENT ON COLUMN comments.task_id IS 'タスクID';
COMMENT ON COLUMN comments.approval_id IS '承認ID';
COMMENT ON COLUMN comments.direction IS 'コメント方向（client_to_team/team_to_client）';
COMMENT ON COLUMN comments.is_from_client IS 'Clientからのコメントか';
COMMENT ON COLUMN comments.deleted_at IS '削除日時（論理削除）';

-- ============================================================================
-- 8. contracts（契約）
-- ============================================================================

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'negotiation' CHECK (status IN ('negotiation', 'active', 'expired')),
  monthly_fee INTEGER NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  renewal_date DATE NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- インデックス
CREATE INDEX idx_contracts_org_id ON contracts(org_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_org_id_client_id ON contracts(org_id, client_id);
CREATE INDEX idx_contracts_org_id_updated_at ON contracts(org_id, updated_at);
CREATE INDEX idx_contracts_org_id_renewal_date ON contracts(org_id, renewal_date);
CREATE INDEX idx_contracts_deleted_at ON contracts(deleted_at) WHERE deleted_at IS NULL;

-- コメント
COMMENT ON TABLE contracts IS '契約';
COMMENT ON COLUMN contracts.id IS '契約ID（主キー）';
COMMENT ON COLUMN contracts.org_id IS '組織ID';
COMMENT ON COLUMN contracts.client_id IS 'クライアントID';
COMMENT ON COLUMN contracts.name IS '契約名';
COMMENT ON COLUMN contracts.status IS 'ステータス（negotiation/active/expired）';
COMMENT ON COLUMN contracts.monthly_fee IS '月額料金';
COMMENT ON COLUMN contracts.start_date IS '開始日';
COMMENT ON COLUMN contracts.end_date IS '終了日';
COMMENT ON COLUMN contracts.renewal_date IS '更新期限';
COMMENT ON COLUMN contracts.deleted_at IS '削除日時（論理削除）';

-- トリガー（updated_at自動更新）
CREATE TRIGGER trigger_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. activity_log（監査ログ）
-- ============================================================================

CREATE TABLE activity_log (
  -- 基本情報
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- 実行者情報
  actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_role TEXT NOT NULL,
  actor_name TEXT NULL, -- スナップショット（users削除時も保持）
  
  -- 操作情報
  action TEXT NOT NULL, -- 例: "task.create", "approval.approve"
  entity_type TEXT NOT NULL, -- 例: "task", "approval"
  entity_id UUID NULL, -- 対象レコードのID
  
  -- 組織・クライアント情報
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NULL REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NULL, -- スナップショット
  
  -- 変更内容（差分）
  before JSONB NULL, -- 変更前の値
  after JSONB NULL, -- 変更後の値
  
  -- リクエスト情報
  request_id TEXT NULL, -- API呼び出しのトレースID
  ip_address TEXT NULL, -- IPアドレス（任意）
  user_agent TEXT NULL, -- User-Agent（任意）
  
  -- 作成日時
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX idx_activity_log_org_id_timestamp ON activity_log(org_id, timestamp DESC);
CREATE INDEX idx_activity_log_actor_user_id ON activity_log(actor_user_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_entity_type_entity_id ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_client_id ON activity_log(client_id);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp DESC);

-- コメント
COMMENT ON TABLE activity_log IS '監査ログ（誰が何をしたか）';
COMMENT ON COLUMN activity_log.id IS 'ログID（主キー）';
COMMENT ON COLUMN activity_log.timestamp IS 'タイムスタンプ（操作日時）';
COMMENT ON COLUMN activity_log.actor_user_id IS '実行者ユーザーID';
COMMENT ON COLUMN activity_log.actor_role IS '実行者ロール';
COMMENT ON COLUMN activity_log.actor_name IS '実行者名（スナップショット）';
COMMENT ON COLUMN activity_log.action IS '操作種別（例: task.create, approval.approve）';
COMMENT ON COLUMN activity_log.entity_type IS 'エンティティ種別（例: task, approval）';
COMMENT ON COLUMN activity_log.entity_id IS '対象レコードのID';
COMMENT ON COLUMN activity_log.org_id IS '組織ID';
COMMENT ON COLUMN activity_log.client_id IS 'クライアントID';
COMMENT ON COLUMN activity_log.client_name IS 'クライアント名（スナップショット）';
COMMENT ON COLUMN activity_log.before IS '変更前の値（UPDATE時のみ）';
COMMENT ON COLUMN activity_log.after IS '変更後の値（CREATE/UPDATE時）';
COMMENT ON COLUMN activity_log.request_id IS 'リクエストID（トレース用）';
COMMENT ON COLUMN activity_log.ip_address IS 'IPアドレス';
COMMENT ON COLUMN activity_log.user_agent IS 'User-Agent';

-- ============================================================================
-- End of schema_final.sql
-- ============================================================================