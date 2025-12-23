# PALSS SYSTEM — ERD（Entity Relationship Diagram）最終版

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（バックエンド実装用）

---

## 📋 テーブル一覧

| # | テーブル | 説明 | 主キー | 外部キー |
|---|---------|------|--------|---------|
| 1 | organizations | 組織（マルチテナント） | id | - |
| 2 | users | ユーザー（Supabase Auth連携） | id | org_id, client_id |
| 3 | clients | クライアント | id | org_id |
| 4 | tasks | タスク | id | org_id, client_id, assignee_id |
| 5 | approvals | 承認 | id | org_id, client_id, submitter_id, approver_id |
| 6 | comments | コメント | id | org_id, client_id, task_id, approval_id, author_id |
| 7 | contracts | 契約 | id | org_id, client_id |
| 8 | notifications | 通知 | id | org_id, user_id, related_client_id |

---

## 📊 テーブル定義

### 1. organizations（組織）

**目的**: マルチテナント分離の基本単位

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | 組織ID（主キー） |
| name | TEXT | NOT NULL | - | 組織名 |
| slug | TEXT | NOT NULL | - | URLスラグ（一意） |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- UNIQUE (slug)

**インデックス**:
- CREATE INDEX idx_organizations_slug ON organizations(slug)
- CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at) WHERE deleted_at IS NULL

---

### 2. users（ユーザー）

**目的**: Supabase Authと連携したユーザー情報

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | ユーザーID（主キー） |
| auth_uid | UUID | NOT NULL | - | Supabase Auth UID（一意） |
| email | TEXT | NOT NULL | - | メールアドレス |
| name | TEXT | NOT NULL | - | 氏名 |
| role | TEXT | NOT NULL | - | ロール（sales/direction/editor/creator/support/control/client） |
| org_id | UUID | NULL | - | 組織ID（社内ロールのみ） |
| client_id | UUID | NULL | - | クライアントID（Clientロールのみ） |
| avatar_url | TEXT | NULL | - | アバターURL |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- UNIQUE (auth_uid)
- UNIQUE (email)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
- CHECK (role IN ('sales', 'direction', 'editor', 'creator', 'support', 'control', 'client'))
- CHECK ((role = 'client' AND client_id IS NOT NULL AND org_id IS NULL) OR (role != 'client' AND org_id IS NOT NULL AND client_id IS NULL))

**インデックス**:
- CREATE INDEX idx_users_auth_uid ON users(auth_uid)
- CREATE INDEX idx_users_org_id ON users(org_id)
- CREATE INDEX idx_users_client_id ON users(client_id)
- CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL

---

### 3. clients（クライアント）

**目的**: 顧客企業情報

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | クライアントID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| name | TEXT | NOT NULL | - | クライアント名 |
| industry | TEXT | NULL | - | 業種 |
| contact_email | TEXT | NULL | - | 連絡先メールアドレス |
| contact_phone | TEXT | NULL | - | 連絡先電話番号 |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE

**インデックス**:
- CREATE INDEX idx_clients_org_id ON clients(org_id)
- CREATE INDEX idx_clients_org_id_updated_at ON clients(org_id, updated_at)
- CREATE INDEX idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL

---

### 4. tasks（タスク）

**目的**: タスク管理

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | タスクID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| client_id | UUID | NOT NULL | - | クライアントID |
| title | TEXT | NOT NULL | - | タスク名 |
| description | TEXT | NULL | - | タスク説明 |
| status | TEXT | NOT NULL | 'not_started' | ステータス（not_started/in_progress/completed） |
| assignee_id | UUID | NULL | - | 担当者ID |
| due_date | DATE | NULL | - | 期限 |
| post_date | DATE | NULL | - | 投稿日 |
| completed_at | TIMESTAMPTZ | NULL | - | 完了日時 |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| last_activity_at | TIMESTAMPTZ | NOT NULL | now() | 最終活動日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
- FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
- CHECK (status IN ('not_started', 'in_progress', 'completed'))

**インデックス**:
- CREATE INDEX idx_tasks_org_id ON tasks(org_id)
- CREATE INDEX idx_tasks_client_id ON tasks(client_id)
- CREATE INDEX idx_tasks_org_id_client_id ON tasks(org_id, client_id)
- CREATE INDEX idx_tasks_org_id_client_id_status ON tasks(org_id, client_id, status)
- CREATE INDEX idx_tasks_org_id_updated_at ON tasks(org_id, updated_at)
- CREATE INDEX idx_tasks_org_id_due_date ON tasks(org_id, due_date)
- CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id)
- CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL

---

### 5. approvals（承認）

**目的**: 承認管理

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | 承認ID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| client_id | UUID | NOT NULL | - | クライアントID |
| title | TEXT | NOT NULL | - | 承認件名 |
| description | TEXT | NULL | - | 承認説明 |
| status | TEXT | NOT NULL | 'pending' | ステータス（pending/approved/rejected） |
| submitter_id | UUID | NOT NULL | - | 申請者ID |
| approver_id | UUID | NULL | - | 承認者ID |
| due_date | DATE | NULL | - | 承認期限 |
| approved_at | TIMESTAMPTZ | NULL | - | 承認日時 |
| rejected_at | TIMESTAMPTZ | NULL | - | 差し戻し日時 |
| rejection_reason | TEXT | NULL | - | 差し戻し理由 |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| completed_at | TIMESTAMPTZ | NULL | - | 完了日時（approved_at or rejected_at） |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
- FOREIGN KEY (submitter_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
- CHECK (status IN ('pending', 'approved', 'rejected'))

**インデックス**:
- CREATE INDEX idx_approvals_org_id ON approvals(org_id)
- CREATE INDEX idx_approvals_client_id ON approvals(client_id)
- CREATE INDEX idx_approvals_org_id_client_id ON approvals(org_id, client_id)
- CREATE INDEX idx_approvals_org_id_client_id_status ON approvals(org_id, client_id, status)
- CREATE INDEX idx_approvals_org_id_updated_at ON approvals(org_id, updated_at)
- CREATE INDEX idx_approvals_submitter_id ON approvals(submitter_id)
- CREATE INDEX idx_approvals_approver_id ON approvals(approver_id)
- CREATE INDEX idx_approvals_deleted_at ON approvals(deleted_at) WHERE deleted_at IS NULL

---

### 6. comments（コメント）

**目的**: タスク/承認へのコメント

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | コメントID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| client_id | UUID | NOT NULL | - | クライアントID |
| content | TEXT | NOT NULL | - | コメント本文 |
| author_id | UUID | NOT NULL | - | 投稿者ID |
| task_id | UUID | NULL | - | タスクID |
| approval_id | UUID | NULL | - | 承認ID |
| direction | TEXT | NOT NULL | - | コメント方向（client_to_team/team_to_client） |
| is_from_client | BOOLEAN | NOT NULL | - | Clientからのコメントか |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
- FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
- FOREIGN KEY (approval_id) REFERENCES approvals(id) ON DELETE CASCADE
- CHECK (direction IN ('client_to_team', 'team_to_client'))
- CHECK ((task_id IS NOT NULL AND approval_id IS NULL) OR (task_id IS NULL AND approval_id IS NOT NULL))

**インデックス**:
- CREATE INDEX idx_comments_org_id ON comments(org_id)
- CREATE INDEX idx_comments_client_id ON comments(client_id)
- CREATE INDEX idx_comments_task_id ON comments(task_id)
- CREATE INDEX idx_comments_approval_id ON comments(approval_id)
- CREATE INDEX idx_comments_author_id ON comments(author_id)
- CREATE INDEX idx_comments_org_id_created_at ON comments(org_id, created_at)
- CREATE INDEX idx_comments_deleted_at ON comments(deleted_at) WHERE deleted_at IS NULL

---

### 7. contracts（契約）

**目的**: 契約管理

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | 契約ID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| client_id | UUID | NOT NULL | - | クライアントID |
| name | TEXT | NOT NULL | - | 契約名 |
| status | TEXT | NOT NULL | 'negotiation' | ステータス（negotiation/active/expired） |
| monthly_fee | INTEGER | NULL | - | 月額料金 |
| start_date | DATE | NULL | - | 開始日 |
| end_date | DATE | NULL | - | 終了日 |
| renewal_date | DATE | NULL | - | 更新期限 |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
- CHECK (status IN ('negotiation', 'active', 'expired'))

**インデックス**:
- CREATE INDEX idx_contracts_org_id ON contracts(org_id)
- CREATE INDEX idx_contracts_client_id ON contracts(client_id)
- CREATE INDEX idx_contracts_org_id_client_id ON contracts(org_id, client_id)
- CREATE INDEX idx_contracts_org_id_updated_at ON contracts(org_id, updated_at)
- CREATE INDEX idx_contracts_org_id_renewal_date ON contracts(org_id, renewal_date)
- CREATE INDEX idx_contracts_deleted_at ON contracts(deleted_at) WHERE deleted_at IS NULL

---

### 8. notifications（通知）

**目的**: ユーザー通知

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | NOT NULL | uuid_generate_v4() | 通知ID（主キー） |
| org_id | UUID | NOT NULL | - | 組織ID |
| user_id | UUID | NOT NULL | - | 宛先ユーザーID |
| type | TEXT | NOT NULL | - | 通知タイプ（task_due/approval_due/comment/contract_renewal/approval_action） |
| title | TEXT | NOT NULL | - | 通知タイトル |
| message | TEXT | NOT NULL | - | 通知メッセージ |
| read | BOOLEAN | NOT NULL | false | 既読フラグ |
| related_client_id | UUID | NULL | - | 関連クライアントID |
| related_item_id | UUID | NULL | - | 関連アイテムID |
| related_item_type | TEXT | NULL | - | 関連アイテム種別（task/approval/comment/contract） |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| deleted_at | TIMESTAMPTZ | NULL | NULL | 削除日時（論理削除） |

**制約**:
- PRIMARY KEY (id)
- FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (related_client_id) REFERENCES clients(id) ON DELETE SET NULL
- CHECK (type IN ('task_due', 'approval_due', 'comment', 'contract_renewal', 'approval_action'))
- CHECK (related_item_type IN ('task', 'approval', 'comment', 'contract') OR related_item_type IS NULL)

**インデックス**:
- CREATE INDEX idx_notifications_org_id ON notifications(org_id)
- CREATE INDEX idx_notifications_user_id ON notifications(user_id)
- CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read)
- CREATE INDEX idx_notifications_user_id_created_at ON notifications(user_id, created_at)
- CREATE INDEX idx_notifications_org_id_created_at ON notifications(org_id, created_at)
- CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at) WHERE deleted_at IS NULL

---

## 🔗 リレーション（外部キー）

### organizations（1）→ users（N）
- organizations.id ← users.org_id
- 関係: 1組織に複数ユーザー
- ON DELETE: CASCADE

### organizations（1）→ clients（N）
- organizations.id ← clients.org_id
- 関係: 1組織に複数クライアント
- ON DELETE: CASCADE

### clients（1）→ users（N）
- clients.id ← users.client_id
- 関係: 1クライアントに複数ユーザー（Clientロール）
- ON DELETE: CASCADE

### clients（1）→ tasks（N）
- clients.id ← tasks.client_id
- 関係: 1クライアントに複数タスク
- ON DELETE: CASCADE

### clients（1）→ approvals（N）
- clients.id ← approvals.client_id
- 関係: 1クライアントに複数承認
- ON DELETE: CASCADE

### clients（1）→ comments（N）
- clients.id ← comments.client_id
- 関係: 1クライアントに複数コメント
- ON DELETE: CASCADE

### clients（1）→ contracts（N）
- clients.id ← contracts.client_id
- 関係: 1クライアントに複数契約
- ON DELETE: CASCADE

### clients（1）→ notifications（N）（optional）
- clients.id ← notifications.related_client_id
- 関係: 1クライアントに複数通知（関連）
- ON DELETE: SET NULL

### users（1）→ tasks（N）（assignee）
- users.id ← tasks.assignee_id
- 関係: 1ユーザーに複数タスク（担当者）
- ON DELETE: SET NULL

### users（1）→ approvals（N）（submitter）
- users.id ← approvals.submitter_id
- 関係: 1ユーザーに複数承認（申請者）
- ON DELETE: CASCADE

### users（1）→ approvals（N）（approver）
- users.id ← approvals.approver_id
- 関係: 1ユーザーに複数承認（承認者）
- ON DELETE: SET NULL

### users（1）→ comments（N）（author）
- users.id ← comments.author_id
- 関係: 1ユーザーに複数コメント（投稿者）
- ON DELETE: CASCADE

### users（1）→ notifications（N）（recipient）
- users.id ← notifications.user_id
- 関係: 1ユーザーに複数通知（宛先）
- ON DELETE: CASCADE

### tasks（1）→ comments（N）（optional）
- tasks.id ← comments.task_id
- 関係: 1タスクに複数コメント
- ON DELETE: CASCADE

### approvals（1）→ comments（N）（optional）
- approvals.id ← comments.approval_id
- 関係: 1承認に複数コメント
- ON DELETE: CASCADE

---

## 🔧 トリガー（自動更新）

### updated_at自動更新

**全テーブル（削除日時以外）に適用**:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- organizations
CREATE TRIGGER trigger_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- users
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- clients
CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- tasks
CREATE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- approvals
CREATE TRIGGER trigger_approvals_updated_at
  BEFORE UPDATE ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- contracts
CREATE TRIGGER trigger_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📐 ERD図（テキスト表現）

```
organizations (1) ──┬── (N) users (social/internal)
                    │
                    └── (N) clients (1) ──┬── (N) users (client role)
                                           │
                                           ├── (N) tasks (1) ──── (N) comments
                                           │      └── assignee: users
                                           │
                                           ├── (N) approvals (1) ──── (N) comments
                                           │      ├── submitter: users
                                           │      └── approver: users
                                           │
                                           └── (N) contracts

users (1) ──── (N) notifications
```

**詳細リレーション**:

```
┌─────────────────┐
│ organizations   │
│ - id (PK)       │
│ - name          │
└─────────────────┘
        │
        │ 1:N
        ├────────────────────────────┐
        │                            │
        ▼                            ▼
┌─────────────────┐          ┌─────────────────┐
│ users           │          │ clients         │
│ - id (PK)       │          │ - id (PK)       │
│ - auth_uid      │          │ - org_id (FK)   │
│ - org_id (FK)   │          │ - name          │
│ - client_id (FK)│          └─────────────────┘
│ - role          │                  │
└─────────────────┘                  │ 1:N
        │                            ├────────────────┬────────────────┬────────────────┐
        │ 1:N                        │                │                │                │
        ▼                            ▼                ▼                ▼                ▼
┌─────────────────┐          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ notifications   │          │ tasks           │ │ approvals       │ │ comments        │ │ contracts       │
│ - id (PK)       │          │ - id (PK)       │ │ - id (PK)       │ │ - id (PK)       │ │ - id (PK)       │
│ - user_id (FK)  │          │ - client_id (FK)│ │ - client_id (FK)│ │ - client_id (FK)│ │ - client_id (FK)│
│ - org_id (FK)   │          │ - assignee (FK) │ │ - submitter (FK)│ │ - author_id (FK)│ │ - org_id (FK)   │
└─────────────────┘          │ - org_id (FK)   │ │ - approver (FK) │ │ - task_id (FK)  │ │ - status        │
                             │ - status        │ │ - org_id (FK)   │ │ - approval_id(FK│ │ - renewal_date  │
                             │ - due_date      │ │ - status        │ │ - direction     │ └─────────────────┘
                             └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 📊 データ容量見積もり

### 想定データ量（1組織あたり）

| テーブル | 件数/年 | 総件数（3年） | サイズ/行 | 総サイズ |
|---------|---------|-------------|----------|---------|
| organizations | 1 | 1 | 0.5KB | 0.5KB |
| users | 20 | 20 | 1KB | 20KB |
| clients | 50 | 50 | 1KB | 50KB |
| tasks | 5,000 | 15,000 | 2KB | 30MB |
| approvals | 2,000 | 6,000 | 2KB | 12MB |
| comments | 10,000 | 30,000 | 1KB | 30MB |
| contracts | 100 | 300 | 1KB | 300KB |
| notifications | 20,000 | 60,000 | 1KB | 60MB |

**合計（1組織）**: 約132MB  
**合計（100組織）**: 約13.2GB

---

## 🎯 削除戦略（論理削除）

### 方針

**論理削除（deleted_at）を採用**:
- 全テーブルに`deleted_at TIMESTAMPTZ NULL`カラムを追加
- DELETE操作時は`UPDATE SET deleted_at = now()`を実行
- SELECT時は`WHERE deleted_at IS NULL`を条件に追加
- RLSポリシーに`deleted_at IS NULL`を組み込む

**メリット**:
- データ復元可能
- 履歴追跡
- 監査要件を満たす

**デメリット**:
- クエリ複雑化（WHERE条件追加）
- インデックス追加必要
- ストレージ増加

**Phase 8.6実装予定**:
- Incremental Pullで`deleted_at`変更も差分取得対象
- フロントエンドで削除データを除外
- 定期的な物理削除（アーカイブ）機能（Phase 13以降）

---

## ⚠️ 未決事項

### 1. activity_log / audit_log テーブル

**質問**: 全操作の監査ログを記録するテーブルを追加するか？

**選択肢**:
- **A案**: Phase 12で追加（organizations/users/clients/tasks等の全変更を記録）
- **B案**: Phase 13以降で追加（監査要件が明確になってから）

**推奨**: B案（Phase 13以降）

**理由**: 現状のスコープで十分、監査要件が明確になってから設計

---

### 2. deleted_at以外の soft delete方式

**質問**: deleted_at以外のsoft delete方式を検討するか？

**選択肢**:
- **A案**: deleted_at（現状の推奨）
- **B案**: is_deleted BOOLEAN（シンプル）
- **C案**: status に 'deleted' を追加（既存statusカラムと統合）

**推奨**: A案（deleted_at）

**理由**: 削除日時を記録でき、復元時の判断材料になる

---

### 3. enum型 vs TEXT型

**質問**: status/role等の固定値をenum型にするか？

**選択肢**:
- **A案**: TEXT + CHECK制約（現状の設計）
- **B案**: PostgreSQL ENUM型

**推奨**: A案（TEXT + CHECK制約）

**理由**: enum型は変更が困難、CHECK制約なら柔軟に対応可能

---

## 📋 実装チェックリスト

### スキーマ実装

- [ ] uuid-ossp拡張有効化
- [ ] organizationsテーブル作成
- [ ] usersテーブル作成
- [ ] clientsテーブル作成
- [ ] tasksテーブル作成
- [ ] approvalsテーブル作成
- [ ] commentsテーブル作成
- [ ] contractsテーブル作成
- [ ] notificationsテーブル作成
- [ ] 外部キー制約作成
- [ ] インデックス作成
- [ ] updated_atトリガー作成

### RLS実装

- [ ] RLS有効化（全テーブル）
- [ ] 補助関数作成（current_user_profile等）
- [ ] ポリシー作成（全テーブル × 全ロール × 全操作）

### Seed データ

- [ ] 組織1件作成
- [ ] ユーザー5-10件作成（各ロール）
- [ ] クライアント5-10件作成
- [ ] タスク20-30件作成
- [ ] 承認10-15件作成
- [ ] コメント30-50件作成
- [ ] 契約10-15件作成
- [ ] 通知30-50件作成

---

**End of ERD Document**  
**Next Action**: RLS_POLICY.md、schema_final.sql、rls_final.sql、seed_minimal.sql作成
