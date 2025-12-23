# PALSS SYSTEM — 監査ログ仕様（AUDIT_LOG_SPEC.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（監査ログ設計）  
**対象**: 開発チーム、監査担当者

---

## 🎯 監査ログの目的

### 目標

1. **トレーサビリティ**: 誰が・いつ・何を・どのクライアントに対して行ったか追跡
2. **セキュリティ**: 不正アクセス・権限昇格の検知
3. **コンプライアンス**: 監査要件の充足
4. **デバッグ**: 障害調査・データ復元の手がかり

---

## 📊 監査対象イベント

### 優先度別分類

| 優先度 | イベント | 理由 |
|--------|---------|------|
| **P0（必須）** | Auth: login, logout | セキュリティ基本 |
| **P0（必須）** | Task: create, update, delete, complete | 主要データ |
| **P0（必須）** | Approval: create, approve, reject | 承認フロー |
| **P0（必須）** | Contract: create, update, delete | 契約管理 |
| **P1（推奨）** | Comment: create | コミュニケーション |
| **P1（推奨）** | Client: create, update, delete | クライアント管理 |
| **P1（推奨）** | User: create, update, delete | ユーザー管理 |
| **P2（任意）** | Notification: read, delete | 低リスク |

---

## 🗃️ 監査ログテーブル設計

### スキーマ

```sql
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

-- コメント
COMMENT ON TABLE activity_log IS '監査ログ（誰が何をしたか）';
COMMENT ON COLUMN activity_log.action IS '操作種別（例: task.create, approval.approve）';
COMMENT ON COLUMN activity_log.before IS '変更前の値（UPDATE時のみ）';
COMMENT ON COLUMN activity_log.after IS '変更後の値（CREATE/UPDATE時）';
```

---

### RLSポリシー

```sql
-- Control/Supportのみ閲覧可能
CREATE POLICY "activity_log_select_control_support" ON activity_log
  FOR SELECT
  USING (
    org_id = current_org_id()
    AND current_role() IN ('control', 'support')
  );

-- 書き込みはシステムのみ（service_role）
-- 通常ユーザーはINSERT不可
```

---

## 📝 ログ記録形式

### 共通フォーマット

```json
{
  "id": "log_uuid",
  "timestamp": "2024-12-22T10:00:00Z",
  "actor_user_id": "user_uuid",
  "actor_role": "sales",
  "actor_name": "営業太郎",
  "action": "task.create",
  "entity_type": "task",
  "entity_id": "task_uuid",
  "org_id": "org_uuid",
  "client_id": "client_uuid",
  "client_name": "株式会社A",
  "before": null,
  "after": {
    "title": "デザイン修正",
    "status": "not_started",
    "assignee_id": "user_xyz"
  },
  "request_id": "req_abc123",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-12-22T10:00:00Z"
}
```

---

### アクション別ログ例

#### Auth: login

```json
{
  "action": "auth.login",
  "entity_type": "user",
  "entity_id": "user_uuid",
  "after": {
    "email": "sales@palss.com",
    "role": "sales"
  }
}
```

#### Task: create

```json
{
  "action": "task.create",
  "entity_type": "task",
  "entity_id": "task_uuid",
  "client_id": "client_uuid",
  "before": null,
  "after": {
    "title": "デザイン修正",
    "description": "トップページのデザイン修正",
    "status": "not_started",
    "assignee_id": "user_xyz",
    "due_date": "2024-12-30"
  }
}
```

#### Task: update

```json
{
  "action": "task.update",
  "entity_type": "task",
  "entity_id": "task_uuid",
  "client_id": "client_uuid",
  "before": {
    "status": "not_started",
    "assignee_id": "user_xyz"
  },
  "after": {
    "status": "in_progress",
    "assignee_id": "user_abc"
  }
}
```

#### Approval: approve

```json
{
  "action": "approval.approve",
  "entity_type": "approval",
  "entity_id": "approval_uuid",
  "client_id": "client_uuid",
  "before": {
    "status": "pending",
    "approved_at": null
  },
  "after": {
    "status": "approved",
    "approved_at": "2024-12-22T10:30:00Z"
  }
}
```

#### Contract: create

```json
{
  "action": "contract.create",
  "entity_type": "contract",
  "entity_id": "contract_uuid",
  "client_id": "client_uuid",
  "before": null,
  "after": {
    "name": "SNS運用代行",
    "status": "active",
    "monthly_fee": 1200000,
    "start_date": "2024-01-01"
  }
}
```

---

## 🔧 実装方法

### アプリケーション層での記録

**推奨**: Database Triggerではなく、アプリケーション層で記録

**理由**:
- リクエストコンテキスト（request_id, ip_address, user_agent）取得可能
- ビジネスロジックに応じた柔軟な記録
- before/after差分の制御が容易

---

### Node.js/Express実装例

```javascript
// middleware/auditLog.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function logActivity({
  actorUserId,
  actorRole,
  actorName,
  action,
  entityType,
  entityId,
  orgId,
  clientId,
  clientName,
  before = null,
  after = null,
  requestId,
  ipAddress,
  userAgent
}) {
  try {
    await supabaseAdmin
      .from('activity_log')
      .insert({
        actor_user_id: actorUserId,
        actor_role: actorRole,
        actor_name: actorName,
        action,
        entity_type: entityType,
        entity_id: entityId,
        org_id: orgId,
        client_id: clientId,
        client_name: clientName,
        before,
        after,
        request_id: requestId,
        ip_address: ipAddress,
        user_agent: userAgent
      })
  } catch (error) {
    // ログ記録失敗は主操作に影響させない
    console.error('Failed to log activity:', error)
  }
}

// 使用例：Task作成時
app.post('/tasks', authenticateJWT, async (req, res) => {
  const { title, description, client_id, assignee_id, due_date } = req.body
  
  // Task作成
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description,
      client_id,
      assignee_id,
      due_date,
      org_id: req.user.org_id,
      status: 'not_started'
    })
    .select()
    .single()
  
  if (error) return res.status(500).json({ error })
  
  // 監査ログ記録
  await logActivity({
    actorUserId: req.user.id,
    actorRole: req.user.role,
    actorName: req.user.name,
    action: 'task.create',
    entityType: 'task',
    entityId: task.id,
    orgId: req.user.org_id,
    clientId: client_id,
    clientName: req.client_name, // 事前取得
    before: null,
    after: {
      title,
      description,
      status: 'not_started',
      assignee_id,
      due_date
    },
    requestId: req.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  })
  
  res.status(201).json({ data: task })
})
```

---

## 📊 監査ログ閲覧

### Control権限での閲覧

**Supabase SQL Editor**:

```sql
-- 直近30日のログ
SELECT 
  timestamp,
  actor_name,
  actor_role,
  action,
  entity_type,
  client_name,
  after->>'title' AS title
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND timestamp > now() - interval '30 days'
ORDER BY timestamp DESC
LIMIT 100;
```

**特定ユーザーの操作履歴**:

```sql
SELECT 
  timestamp,
  action,
  entity_type,
  entity_id,
  client_name,
  after
FROM activity_log
WHERE actor_user_id = '<user_uuid>'
  AND timestamp > now() - interval '7 days'
ORDER BY timestamp DESC;
```

**不審な操作検知（深夜のデータ変更）**:

```sql
SELECT 
  timestamp,
  actor_name,
  action,
  entity_type,
  client_name
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND EXTRACT(HOUR FROM timestamp) BETWEEN 0 AND 5 -- 深夜0-5時
  AND action IN ('task.delete', 'approval.reject', 'contract.delete')
ORDER BY timestamp DESC;
```

**大量削除操作検知**:

```sql
SELECT 
  actor_name,
  action,
  COUNT(*) AS count
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND action LIKE '%.delete'
  AND timestamp > now() - interval '1 hour'
GROUP BY actor_name, action
HAVING COUNT(*) > 10
ORDER BY count DESC;
```

---

## 🔍 監査ログ分析

### 月次レポート

**集計クエリ**:

```sql
-- アクション別集計
SELECT 
  action,
  COUNT(*) AS count
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND timestamp > now() - interval '30 days'
GROUP BY action
ORDER BY count DESC;

-- ユーザー別集計
SELECT 
  actor_name,
  actor_role,
  COUNT(*) AS count
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND timestamp > now() - interval '30 days'
GROUP BY actor_name, actor_role
ORDER BY count DESC
LIMIT 20;

-- クライアント別集計
SELECT 
  client_name,
  COUNT(*) AS count
FROM activity_log
WHERE org_id = '<org_uuid>'
  AND timestamp > now() - interval '30 days'
  AND client_name IS NOT NULL
GROUP BY client_name
ORDER BY count DESC
LIMIT 10;
```

---

### 異常検知パターン

| パターン | クエリ条件 | 対応 |
|---------|-----------|------|
| **深夜操作** | HOUR BETWEEN 0 AND 5 | 正当性確認 |
| **大量削除** | COUNT(delete) > 10/hour | 誤操作確認 |
| **権限外操作** | Clientロールで他社データ | RLS確認 |
| **連続失敗** | auth.login失敗 > 5/min | ブルートフォース疑い |

---

## 🗑️ ログ保持・削除

### 保持期間

| ログ種別 | 保持期間 | 理由 |
|---------|---------|------|
| **Auth** | 180日 | セキュリティ監査 |
| **Task/Approval/Contract** | 365日 | ビジネス監査 |
| **Comment/Notification** | 90日 | 低リスク |

### 自動削除（月次）

```sql
-- 90日以前のNotificationログ削除
DELETE FROM activity_log
WHERE action IN ('notification.read', 'notification.delete')
  AND timestamp < now() - interval '90 days';

-- 180日以前のAuthログ削除
DELETE FROM activity_log
WHERE action IN ('auth.login', 'auth.logout')
  AND timestamp < now() - interval '180 days';

-- 365日以前のその他ログ削除
DELETE FROM activity_log
WHERE action NOT IN ('auth.login', 'auth.logout', 'notification.read', 'notification.delete')
  AND timestamp < now() - interval '365 days';
```

---

## 📋 監査ログチェックリスト

### 実装時

- [ ] activity_log テーブル作成
- [ ] RLSポリシー設定（Control/Supportのみ）
- [ ] 全P0イベントで記録実装
- [ ] before/after差分記録
- [ ] PIIマスキング確認

### 運用時

- [ ] 月次レポート作成
- [ ] 異常検知確認
- [ ] ログ保持期間確認
- [ ] 自動削除実行

---

## 🔗 関連ドキュメント

- [SECURITY_BASELINE.md](./SECURITY_BASELINE.md) - セキュリティ基準
- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順

---

**End of AUDIT_LOG_SPEC.md**
