-- PALSS SYSTEM - Database Indexes
-- Phase 8: パフォーマンス最適化
-- 
-- このSQLファイルは、Supabase運用でのパフォーマンスを向上させるためのインデックス定義です。
-- RLS絞り込み、差分取得（updated_at）、頻繁な検索条件に対してインデックスを作成します。
--
-- 実行方法:
-- 1. Supabase Dashboard → SQL Editor
-- 2. このファイルの内容を貼り付けて実行
-- 3. "IF NOT EXISTS"により、繰り返し実行しても安全
--
-- 注意:
-- - インデックス作成は本番環境への影響を最小化するため、CONCURRENTLYオプション推奨
-- - データ量が少ない開発環境では効果が見えにくいが、本番環境で効果を発揮

-- ========================================
-- Clients Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_clients_org_id 
ON clients(org_id);

-- 差分取得用（org_id, updated_at）
CREATE INDEX IF NOT EXISTS idx_clients_org_updated 
ON clients(org_id, updated_at);

-- ステータス検索用
CREATE INDEX IF NOT EXISTS idx_clients_status 
ON clients(status);

-- 担当者検索用
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to 
ON clients(assigned_to);

-- ========================================
-- Tasks Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_tasks_org_id 
ON tasks(org_id);

-- 差分取得用（org_id, updated_at）
CREATE INDEX IF NOT EXISTS idx_tasks_org_updated 
ON tasks(org_id, updated_at);

-- クライアント別タスク取得（org_id, client_id）
CREATE INDEX IF NOT EXISTS idx_tasks_org_client 
ON tasks(org_id, client_id);

-- クライアント別ステータス検索（org_id, client_id, status）
CREATE INDEX IF NOT EXISTS idx_tasks_org_client_status 
ON tasks(org_id, client_id, status);

-- クライアント別期限順（org_id, client_id, due_date）
CREATE INDEX IF NOT EXISTS idx_tasks_org_client_due 
ON tasks(org_id, client_id, due_date);

-- ステータス検索用
CREATE INDEX IF NOT EXISTS idx_tasks_status 
ON tasks(status);

-- 担当者検索用
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to 
ON tasks(assigned_to);

-- ========================================
-- Approvals Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_approvals_org_id 
ON approvals(org_id);

-- 差分取得用（org_id, updated_at）
CREATE INDEX IF NOT EXISTS idx_approvals_org_updated 
ON approvals(org_id, updated_at);

-- クライアント別承認取得（org_id, client_id）
CREATE INDEX IF NOT EXISTS idx_approvals_org_client 
ON approvals(org_id, client_id);

-- クライアント別ステータス検索（org_id, client_id, status）
CREATE INDEX IF NOT EXISTS idx_approvals_org_client_status 
ON approvals(org_id, client_id, status);

-- ステータス検索用
CREATE INDEX IF NOT EXISTS idx_approvals_status 
ON approvals(status);

-- ========================================
-- Comments Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_comments_org_id 
ON comments(org_id);

-- 差分取得用（org_id, created_at）
-- ※commentsはupdated_atがない場合、created_atを使用
CREATE INDEX IF NOT EXISTS idx_comments_org_created 
ON comments(org_id, created_at);

-- クライアント別コメント取得（org_id, client_id）
CREATE INDEX IF NOT EXISTS idx_comments_org_client 
ON comments(org_id, client_id);

-- クライアント別作成日順（org_id, client_id, created_at）
CREATE INDEX IF NOT EXISTS idx_comments_org_client_created 
ON comments(org_id, client_id, created_at);

-- ========================================
-- Contracts Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_contracts_org_id 
ON contracts(org_id);

-- 差分取得用（org_id, updated_at）
CREATE INDEX IF NOT EXISTS idx_contracts_org_updated 
ON contracts(org_id, updated_at);

-- クライアント別契約取得（org_id, client_id）
CREATE INDEX IF NOT EXISTS idx_contracts_org_client 
ON contracts(org_id, client_id);

-- ステータス検索用（org_id, status）
CREATE INDEX IF NOT EXISTS idx_contracts_org_status 
ON contracts(org_id, status);

-- 更新期限検索用（org_id, renewal_date）
CREATE INDEX IF NOT EXISTS idx_contracts_org_renewal 
ON contracts(org_id, renewal_date);

-- 開始日検索用（org_id, start_date）
CREATE INDEX IF NOT EXISTS idx_contracts_org_start 
ON contracts(org_id, start_date);

-- ========================================
-- Notifications Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_notifications_org_id 
ON notifications(org_id);

-- 差分取得用（org_id, created_at）
CREATE INDEX IF NOT EXISTS idx_notifications_org_created 
ON notifications(org_id, created_at);

-- ユーザー別通知取得（org_id, target_user_id, created_at）
CREATE INDEX IF NOT EXISTS idx_notifications_org_user_created 
ON notifications(org_id, target_user_id, created_at);

-- 未読通知検索用（org_id, read, created_at）
CREATE INDEX IF NOT EXISTS idx_notifications_org_read_created 
ON notifications(org_id, read, created_at) WHERE read = false;

-- ========================================
-- Users Table Indexes
-- ========================================

-- RLS絞り込み用（org_id）
CREATE INDEX IF NOT EXISTS idx_users_org_id 
ON users(org_id);

-- ロール検索用（org_id, role）
CREATE INDEX IF NOT EXISTS idx_users_org_role 
ON users(org_id, role);

-- メール検索用（email）
-- ※emailはUNIQUE制約があるため、自動的にインデックスが作成されるが、明示的に確認
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ========================================
-- 実行結果確認
-- ========================================

-- 以下のクエリで作成されたインデックスを確認できます:
-- 
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('clients', 'tasks', 'approvals', 'comments', 'contracts', 'notifications', 'users')
-- ORDER BY tablename, indexname;

-- ========================================
-- パフォーマンス確認
-- ========================================

-- クエリプランを確認する例:
-- 
-- EXPLAIN ANALYZE
-- SELECT * FROM tasks
-- WHERE org_id = 'org_12345'
--   AND updated_at > '2024-12-01T00:00:00Z'
-- ORDER BY updated_at DESC
-- LIMIT 100;
-- 
-- → "Index Scan using idx_tasks_org_updated" と表示されればインデックスが使われている

-- ========================================
-- インデックスメンテナンス
-- ========================================

-- インデックスのサイズ確認:
-- 
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   pg_size_pretty(pg_relation_size(indexrelid)) as index_size
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('clients', 'tasks', 'approvals', 'comments', 'contracts', 'notifications', 'users')
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ========================================
-- 注意事項
-- ========================================

-- 1. インデックスはストレージ容量を消費します
-- 2. 書き込み時にインデックス更新のオーバーヘッドが発生します
-- 3. データ量が少ない場合、インデックスの効果は限定的です
-- 4. 本番環境でのインデックス作成はCONCURRENTLYオプション推奨:
--    CREATE INDEX CONCURRENTLY IF NOT EXISTS ...
-- 5. 定期的にVACUUM ANALYZEを実行して統計情報を更新

-- ========================================
-- 完了
-- ========================================

-- インデックス作成が完了しました。
-- QAパネル → Performanceタブで効果を確認できます。
