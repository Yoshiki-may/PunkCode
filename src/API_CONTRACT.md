# PALSS SYSTEM — API契約（API Contract）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（バックエンド実装用）  
**Base URL**: `https://api.palss.example.com/v1`

---

## 📋 目次

1. [概要](#概要)
2. [認証・認可](#認証認可)
3. [共通仕様](#共通仕様)
4. [リソース一覧](#リソース一覧)
5. [エンドポイント詳細](#エンドポイント詳細)
6. [スキーマ定義](#スキーマ定義)
7. [RBAC・認可](#rbac認可)
8. [ユースケース別APIシーケンス](#ユースケース別apiシーケンス)
9. [Realtime/Webhook方針](#realtimewebhook方針)
10. [未決事項](#未決事項)

---

## 🎯 概要

### 基本方針

- **SaaS型マルチテナント**: `org_id`で組織分離、RLS/サーバー側認可
- **7ロール**: Sales, Direction, Editor, Creator, Support, Control, Client
- **Clientスコープ**: `client_id`で自社データのみアクセス
- **ID形式**: UUID v4
- **日時形式**: ISO 8601（UTC推奨）
- **API設計**: RESTful、リソース指向
- **認証**: Supabase Auth（JWT Bearer Token）

### リソース（6種）

| リソース | 説明 | 主要エンドポイント |
|---------|------|-------------------|
| **clients** | クライアント情報 | GET/POST/PATCH |
| **tasks** | タスク管理 | GET/POST/PATCH |
| **approvals** | 承認管理 | GET/POST/PATCH |
| **comments** | コメント | GET/POST |
| **contracts** | 契約管理 | GET/POST/PATCH |
| **notifications** | 通知 | GET/PATCH/DELETE |

---

## 🔐 認証・認可

### 認証方式

**Supabase Auth（JWT Bearer Token）**

```http
Authorization: Bearer <supabase_jwt_token>
```

**JWT Payload（Custom Claims）**:
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "role": "sales",
  "org_id": "org_palss_001",
  "client_id": null,  // Clientロールの場合のみ設定
  "iat": 1234567890,
  "exp": 1234571490
}
```

### 認証エンドポイント

#### 1. ログイン

**Supabase Auth委譲**（推奨）:
```javascript
// フロントエンド
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

#### 2. プロファイル取得

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "name": "山田太郎",
  "role": "sales",
  "org_id": "org_palss_001",
  "client_id": null,
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### 3. ログアウト

**Supabase Auth委譲**（推奨）:
```javascript
// フロントエンド
await supabase.auth.signOut()
```

### 認可方針

- **サーバー側で最終判定**: フロントは表示制御のみ
- **RLS強制**: Supabase RLSでDB層でも権限制御
- **org_id/client_id**: JWT ClaimsからサーバーサイドでWHERE句に自動注入
- **ロール別権限**: 後述のRBAC表に従う

---

## 📐 共通仕様

### 1. 共通レスポンス形式

#### 成功（200/201）

```json
{
  "data": { ... },  // 単一リソース
  "data": [ ... ],  // 複数リソース（配列）
  "meta": {
    "total": 100,
    "nextCursor": "cursor_string"
  }
}
```

#### エラー（4xx/5xx）

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have access to this resource",
    "details": {
      "resource": "tasks",
      "action": "update",
      "required_role": "sales"
    },
    "request_id": "req_abc123xyz"
  }
}
```

### 2. HTTPステータスコード

| コード | 意味 | 使用例 |
|--------|------|--------|
| **200** | OK | GET/PATCH成功 |
| **201** | Created | POST成功 |
| **204** | No Content | DELETE成功 |
| **400** | Bad Request | バリデーションエラー |
| **401** | Unauthorized | 認証トークンなし/無効 |
| **403** | Forbidden | 権限なし（RBAC違反） |
| **404** | Not Found | リソースなし |
| **409** | Conflict | 競合（楽観ロック） |
| **422** | Unprocessable Entity | ビジネスロジックエラー |
| **429** | Too Many Requests | レート制限 |
| **500** | Internal Server Error | サーバーエラー |

### 3. エラーコード一覧

| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| `UNAUTHORIZED` | 認証トークンなし/無効 | 401 |
| `FORBIDDEN` | 権限なし | 403 |
| `NOT_FOUND` | リソースなし | 404 |
| `VALIDATION_ERROR` | バリデーションエラー | 400 |
| `CONFLICT` | 競合（updated_at不一致等） | 409 |
| `RATE_LIMIT` | レート制限超過 | 429 |
| `INTERNAL_ERROR` | サーバーエラー | 500 |

### 4. ページング（Cursor方式）

**Request**:
```http
GET /tasks?limit=50&cursor=eyJpZCI6IjEyMyIsInRzIjoiMjAyNC0wMS0wMVQwMDowMDowMFoifQ==
```

**Query Parameters**:
- `limit`: 取得件数（デフォルト: 50、最大: 100）
- `cursor`: 次ページのカーソル（Base64エンコード）

**Response**:
```json
{
  "data": [ ... ],
  "meta": {
    "total": 250,
    "next_cursor": "eyJpZCI6IjE3MyIsInRzIjoiMjAyNC0wMS0wMlQwMDowMDowMFoifQ==",
    "has_more": true
  }
}
```

### 5. 検索・フィルタ（共通Query Parameters）

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `q` | 全文検索 | `?q=デザイン修正` |
| `client_id` | クライアントID | `?client_id=client_a` |
| `status` | ステータス | `?status=in_progress` |
| `assignee_id` | 担当者ID | `?assignee_id=user_123` |
| `date_from` | 日付範囲（開始） | `?date_from=2024-01-01` |
| `date_to` | 日付範囲（終了） | `?date_to=2024-12-31` |
| `sort_by` | ソートキー | `?sort_by=due_date` |
| `sort_order` | ソート順序 | `?sort_order=asc` |

### 6. Incremental Pull（差分取得）

**全リソースで `updated_at` / `created_at` ベースの差分取得をサポート**:

```http
GET /tasks?since=2024-12-22T10:00:00Z&limit=500
```

**Query Parameters**:
- `since`: この日時以降の差分のみ取得（ISO 8601）

**Response**:
```json
{
  "data": [ ... ],
  "meta": {
    "latest_timestamp": "2024-12-22T10:30:45Z",
    "has_more": false
  }
}
```

**使用例**:
1. 初回: `GET /tasks` → 全件取得 → `latest_timestamp`を保存
2. 2回目以降: `GET /tasks?since=<latest_timestamp>` → 差分のみ取得

---

## 📁 リソース一覧

### A) Clients（クライアント）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/clients` | GET | クライアント一覧取得 | 全ロール（org内 or 自社のみ） |
| `/clients` | POST | クライアント作成 | Sales, Control |
| `/clients/{clientId}` | GET | クライアント詳細取得 | 全ロール（org内 or 自社のみ） |
| `/clients/{clientId}` | PATCH | クライアント更新 | Sales, Control |

### B) Tasks（タスク）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/tasks` | GET | タスク一覧取得 | 全ロール（org内 or 自社のみ） |
| `/tasks` | POST | タスク作成 | 社内ロール全て |
| `/tasks/{taskId}` | GET | タスク詳細取得 | 全ロール（org内 or 自社のみ） |
| `/tasks/{taskId}` | PATCH | タスク更新 | 社内ロール全て |

### C) Approvals（承認）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/approvals` | GET | 承認一覧取得 | 全ロール（org内 or 自社のみ） |
| `/approvals` | POST | 承認申請作成 | Sales, Direction, Editor, Creator |
| `/approvals/{approvalId}` | GET | 承認詳細取得 | 全ロール（org内 or 自社のみ） |
| `/approvals/{approvalId}` | PATCH | 承認更新 | Direction, Control（承認/差し戻し） |
| `/approvals/{approvalId}/approve` | POST | 承認 | Direction, Control |
| `/approvals/{approvalId}/reject` | POST | 差し戻し | Direction, Control |

### D) Comments（コメント）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/comments` | GET | コメント一覧取得 | 全ロール（org内 or 自社のみ） |
| `/comments` | POST | コメント投稿 | 全ロール |

### E) Contracts（契約）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/contracts` | GET | 契約一覧取得 | 全ロール（org内 or 自社のみ） |
| `/contracts` | POST | 契約作成 | Sales, Control |
| `/contracts/{contractId}` | GET | 契約詳細取得 | 全ロール（org内 or 自社のみ） |
| `/contracts/{contractId}` | PATCH | 契約更新 | Sales, Control |

### F) Notifications（通知）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/notifications` | GET | 通知一覧取得 | 全ロール（自分宛のみ） |
| `/notifications/{notificationId}` | PATCH | 通知既読 | 全ロール（自分宛のみ） |
| `/notifications/{notificationId}` | DELETE | 通知削除 | 全ロール（自分宛のみ） |
| `/notifications/mark-all-read` | POST | 全既読 | 全ロール |
| `/notifications/clear-all` | DELETE | 全削除 | 全ロール |

### G) KPI（KPI集計）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/kpi/direction` | GET | Direction KPI取得 | Direction, Control, Support |
| `/kpi/sales` | GET | Sales KPI取得 | Sales, Control, Support |

### H) Alerts（アラート集計）

| エンドポイント | メソッド | 説明 | 認可 |
|---------------|---------|------|------|
| `/alerts` | GET | アラート集計取得 | 全ロール（org内 or 自社のみ） |

---

## 🔧 エンドポイント詳細

### A) Clients

#### GET /clients

**説明**: クライアント一覧取得

**Query Parameters**:
- `limit`: 取得件数（デフォルト: 50）
- `cursor`: ページングカーソル
- `q`: 検索キーワード
- `sort_by`: ソートキー（`name`, `created_at`）
- `sort_order`: ソート順序（`asc`, `desc`）
- `since`: 差分取得（ISO 8601）

**Response** (200):
```json
{
  "data": [
    {
      "id": "client_a",
      "name": "株式会社A",
      "org_id": "org_palss_001",
      "industry": "製造業",
      "contact_email": "contact@a.com",
      "contact_phone": "03-1234-5678",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-06-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "next_cursor": "...",
    "has_more": false
  }
}
```

#### POST /clients

**説明**: クライアント作成

**権限**: Sales, Control

**Request Body**:
```json
{
  "name": "株式会社B",
  "industry": "IT",
  "contact_email": "contact@b.com",
  "contact_phone": "03-9876-5432"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "client_b",
    "name": "株式会社B",
    "org_id": "org_palss_001",
    "industry": "IT",
    "contact_email": "contact@b.com",
    "contact_phone": "03-9876-5432",
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  }
}
```

#### GET /clients/{clientId}

**説明**: クライアント詳細取得

**Response** (200):
```json
{
  "data": {
    "id": "client_a",
    "name": "株式会社A",
    "org_id": "org_palss_001",
    "industry": "製造業",
    "contact_email": "contact@a.com",
    "contact_phone": "03-1234-5678",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-06-01T00:00:00Z"
  }
}
```

#### PATCH /clients/{clientId}

**説明**: クライアント更新

**権限**: Sales, Control

**Request Body**:
```json
{
  "name": "株式会社A（更新）",
  "contact_email": "new-contact@a.com",
  "updated_at": "2024-06-01T00:00:00Z"  // 楽観ロック用
}
```

**Response** (200):
```json
{
  "data": {
    "id": "client_a",
    "name": "株式会社A（更新）",
    "org_id": "org_palss_001",
    "industry": "製造業",
    "contact_email": "new-contact@a.com",
    "contact_phone": "03-1234-5678",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-12-22T10:05:00Z"
  }
}
```

---

### B) Tasks

#### GET /tasks

**説明**: タスク一覧取得

**Query Parameters**:
- `limit`, `cursor`, `q`, `since`: 共通仕様参照
- `client_id`: クライアントID
- `status`: ステータス（`not_started`, `in_progress`, `completed`）
- `assignee_id`: 担当者ID
- `date_from`, `date_to`: 期限範囲
- `sort_by`: ソートキー（`due_date`, `created_at`, `updated_at`）
- `sort_order`: ソート順序

**Response** (200):
```json
{
  "data": [
    {
      "id": "task_001",
      "title": "デザイン修正",
      "description": "トップページのデザイン修正",
      "client_id": "client_a",
      "status": "in_progress",
      "assignee_id": "user_123",
      "due_date": "2024-12-25",
      "post_date": "2024-12-20",
      "completed_at": null,
      "created_at": "2024-12-15T00:00:00Z",
      "updated_at": "2024-12-20T10:00:00Z",
      "last_activity_at": "2024-12-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 120,
    "next_cursor": "...",
    "has_more": true
  }
}
```

#### POST /tasks

**説明**: タスク作成

**権限**: 社内ロール全て

**Request Body**:
```json
{
  "title": "デザイン修正",
  "description": "トップページのデザイン修正",
  "client_id": "client_a",
  "status": "not_started",
  "assignee_id": "user_123",
  "due_date": "2024-12-25",
  "post_date": "2024-12-20"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "task_001",
    "title": "デザイン修正",
    "description": "トップページのデザイン修正",
    "client_id": "client_a",
    "status": "not_started",
    "assignee_id": "user_123",
    "due_date": "2024-12-25",
    "post_date": "2024-12-20",
    "completed_at": null,
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z",
    "last_activity_at": "2024-12-22T10:00:00Z"
  }
}
```

#### PATCH /tasks/{taskId}

**説明**: タスク更新

**権限**: 社内ロール全て

**Request Body**:
```json
{
  "status": "completed",
  "completed_at": "2024-12-22T10:30:00Z",
  "updated_at": "2024-12-20T10:00:00Z"  // 楽観ロック用
}
```

**Response** (200):
```json
{
  "data": {
    "id": "task_001",
    "title": "デザイン修正",
    "description": "トップページのデザイン修正",
    "client_id": "client_a",
    "status": "completed",
    "assignee_id": "user_123",
    "due_date": "2024-12-25",
    "post_date": "2024-12-20",
    "completed_at": "2024-12-22T10:30:00Z",
    "created_at": "2024-12-15T00:00:00Z",
    "updated_at": "2024-12-22T10:30:00Z",
    "last_activity_at": "2024-12-22T10:30:00Z"
  }
}
```

---

### C) Approvals

#### GET /approvals

**説明**: 承認一覧取得

**Query Parameters**:
- `limit`, `cursor`, `q`, `since`: 共通仕様参照
- `client_id`: クライアントID
- `status`: ステータス（`pending`, `approved`, `rejected`）
- `approver_id`: 承認者ID
- `submitter_id`: 申請者ID
- `date_from`, `date_to`: 承認期限範囲

**Response** (200):
```json
{
  "data": [
    {
      "id": "approval_001",
      "title": "広告デザイン承認",
      "description": "広告デザインの最終承認",
      "client_id": "client_a",
      "status": "pending",
      "approver_id": "user_direction_001",
      "submitter_id": "user_sales_001",
      "due_date": "2024-12-23",
      "approved_at": null,
      "rejected_at": null,
      "rejection_reason": null,
      "created_at": "2024-12-15T00:00:00Z",
      "updated_at": "2024-12-15T00:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "next_cursor": "...",
    "has_more": false
  }
}
```

#### POST /approvals

**説明**: 承認申請作成

**権限**: Sales, Direction, Editor, Creator

**Request Body**:
```json
{
  "title": "広告デザイン承認",
  "description": "広告デザインの最終承認",
  "client_id": "client_a",
  "approver_id": "user_direction_001",
  "due_date": "2024-12-23"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "approval_001",
    "title": "広告デザイン承認",
    "description": "広告デザインの最終承認",
    "client_id": "client_a",
    "status": "pending",
    "approver_id": "user_direction_001",
    "submitter_id": "user_sales_001",
    "due_date": "2024-12-23",
    "approved_at": null,
    "rejected_at": null,
    "rejection_reason": null,
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  }
}
```

#### POST /approvals/{approvalId}/approve

**説明**: 承認

**権限**: Direction, Control

**Request Body**:
```json
{
  "comment": "承認しました"
}
```

**Response** (200):
```json
{
  "data": {
    "id": "approval_001",
    "title": "広告デザイン承認",
    "description": "広告デザインの最終承認",
    "client_id": "client_a",
    "status": "approved",
    "approver_id": "user_direction_001",
    "submitter_id": "user_sales_001",
    "due_date": "2024-12-23",
    "approved_at": "2024-12-22T10:30:00Z",
    "rejected_at": null,
    "rejection_reason": null,
    "created_at": "2024-12-15T00:00:00Z",
    "updated_at": "2024-12-22T10:30:00Z"
  }
}
```

#### POST /approvals/{approvalId}/reject

**説明**: 差し戻し

**権限**: Direction, Control

**Request Body**:
```json
{
  "reason": "資料不足のため差し戻し"
}
```

**Response** (200):
```json
{
  "data": {
    "id": "approval_001",
    "title": "広告デザイン承認",
    "description": "広告デザインの最終承認",
    "client_id": "client_a",
    "status": "rejected",
    "approver_id": "user_direction_001",
    "submitter_id": "user_sales_001",
    "due_date": "2024-12-23",
    "approved_at": null,
    "rejected_at": "2024-12-22T10:30:00Z",
    "rejection_reason": "資料不足のため差し戻し",
    "created_at": "2024-12-15T00:00:00Z",
    "updated_at": "2024-12-22T10:30:00Z"
  }
}
```

---

### D) Comments

#### GET /comments

**説明**: コメント一覧取得

**Query Parameters**:
- `limit`, `cursor`, `since`: 共通仕様参照
- `client_id`: クライアントID（推奨）
- `task_id`: タスクID
- `approval_id`: 承認ID
- `direction`: コメント方向（`client_to_team`, `team_to_client`）
- `sort_by`: ソートキー（`created_at`）
- `sort_order`: ソート順序

**Response** (200):
```json
{
  "data": [
    {
      "id": "comment_001",
      "content": "修正内容を確認したいです",
      "author_id": "user_client_a_001",
      "author_name": "クライアントA担当者",
      "task_id": "task_001",
      "approval_id": null,
      "client_id": "client_a",
      "direction": "client_to_team",
      "is_from_client": true,
      "created_at": "2024-12-22T09:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "next_cursor": "...",
    "has_more": true
  }
}
```

#### POST /comments

**説明**: コメント投稿

**権限**: 全ロール

**Request Body**:
```json
{
  "content": "修正内容を確認したいです",
  "task_id": "task_001",
  "approval_id": null
}
```

**Response** (201):
```json
{
  "data": {
    "id": "comment_001",
    "content": "修正内容を確認したいです",
    "author_id": "user_client_a_001",
    "author_name": "クライアントA担当者",
    "task_id": "task_001",
    "approval_id": null,
    "client_id": "client_a",
    "direction": "client_to_team",
    "is_from_client": true,
    "created_at": "2024-12-22T09:00:00Z"
  }
}
```

**Note**: `direction`と`is_from_client`はサーバー側でJWT Claimsの`role`から自動判定

---

### E) Contracts

#### GET /contracts

**説明**: 契約一覧取得

**Query Parameters**:
- `limit`, `cursor`, `q`, `since`: 共通仕様参照
- `client_id`: クライアントID
- `status`: ステータス（`negotiation`, `active`, `expired`）
- `renewal_from`, `renewal_to`: 更新期限範囲

**Response** (200):
```json
{
  "data": [
    {
      "id": "contract_001",
      "name": "SNS運用代行",
      "client_id": "client_a",
      "status": "active",
      "monthly_fee": 1200000,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "renewal_date": "2024-11-30",
      "created_at": "2023-12-01T00:00:00Z",
      "updated_at": "2024-11-25T00:00:00Z"
    }
  ],
  "meta": {
    "total": 80,
    "next_cursor": "...",
    "has_more": false
  }
}
```

#### POST /contracts

**説明**: 契約作成

**権限**: Sales, Control

**Request Body**:
```json
{
  "name": "SNS運用代行",
  "client_id": "client_a",
  "status": "active",
  "monthly_fee": 1200000,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "renewal_date": "2024-11-30"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "contract_001",
    "name": "SNS運用代行",
    "client_id": "client_a",
    "status": "active",
    "monthly_fee": 1200000,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "renewal_date": "2024-11-30",
    "created_at": "2024-12-22T10:00:00Z",
    "updated_at": "2024-12-22T10:00:00Z"
  }
}
```

#### PATCH /contracts/{contractId}

**説明**: 契約更新

**権限**: Sales, Control

**Request Body**:
```json
{
  "status": "expired",
  "updated_at": "2024-11-25T00:00:00Z"  // 楽観ロック用
}
```

**Response** (200):
```json
{
  "data": {
    "id": "contract_001",
    "name": "SNS運用代行",
    "client_id": "client_a",
    "status": "expired",
    "monthly_fee": 1200000,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "renewal_date": "2024-11-30",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2024-12-22T10:30:00Z"
  }
}
```

---

### F) Notifications

#### GET /notifications

**説明**: 通知一覧取得（自分宛のみ）

**Query Parameters**:
- `limit`, `cursor`, `since`: 共通仕様参照
- `read`: 既読フィルタ（`true`, `false`）
- `type`: 通知タイプ（`task_due`, `approval_due`, `comment`, `contract_renewal`, `approval_action`）

**Response** (200):
```json
{
  "data": [
    {
      "id": "notification_001",
      "user_id": "user_123",
      "type": "task_due",
      "title": "タスク期限間近",
      "message": "タスク「デザイン修正」の期限が3日後です",
      "read": false,
      "related_client_id": "client_a",
      "related_item_id": "task_001",
      "related_item_type": "task",
      "created_at": "2024-12-22T09:00:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "unread_count": 10,
    "next_cursor": "...",
    "has_more": false
  }
}
```

#### PATCH /notifications/{notificationId}

**説明**: 通知既読

**Request Body**:
```json
{
  "read": true
}
```

**Response** (200):
```json
{
  "data": {
    "id": "notification_001",
    "user_id": "user_123",
    "type": "task_due",
    "title": "タスク期限間近",
    "message": "タスク「デザイン修正」の期限が3日後です",
    "read": true,
    "related_client_id": "client_a",
    "related_item_id": "task_001",
    "related_item_type": "task",
    "created_at": "2024-12-22T09:00:00Z"
  }
}
```

#### POST /notifications/mark-all-read

**説明**: 全通知を既読にする

**Response** (200):
```json
{
  "data": {
    "updated_count": 10
  }
}
```

#### DELETE /notifications/clear-all

**説明**: 全通知を削除（既読のみ）

**Response** (200):
```json
{
  "data": {
    "deleted_count": 15
  }
}
```

---

### G) KPI

#### GET /kpi/direction

**説明**: Direction KPI取得

**権限**: Direction, Control, Support

**Query Parameters**:
- `client_id`: クライアントID（推奨）

**Response** (200):
```json
{
  "data": {
    "client_id": "client_a",
    "direction": {
      "deadline_compliance_rate": 85.5,
      "rejection_rate": 12.3,
      "average_lead_time": 5.2
    }
  }
}
```

#### GET /kpi/sales

**説明**: Sales KPI取得

**権限**: Sales, Control, Support

**Query Parameters**:
- `client_id`: クライアントID（推奨）

**Response** (200):
```json
{
  "data": {
    "client_id": "client_a",
    "sales": {
      "order_amount": 12000000,
      "order_count": 10,
      "proposal_count": 15,
      "order_rate": 66.7
    }
  }
}
```

---

### H) Alerts

#### GET /alerts

**説明**: アラート集計取得

**権限**: 全ロール（org内 or 自社のみ）

**Query Parameters**:
- `client_id`: クライアントID（推奨）

**Response** (200):
```json
{
  "data": {
    "client_id": "client_a",
    "stagnant_tasks": 3,
    "overdue_tasks": 2,
    "no_reply_comments": 5,
    "contract_renewals": 1,
    "overdue_approvals": 4
  }
}
```

---

## 📊 スキーマ定義

### Client

```json
{
  "id": "string (UUID)",
  "name": "string",
  "org_id": "string",
  "industry": "string",
  "contact_email": "string (email)",
  "contact_phone": "string",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

### Task

```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "client_id": "string (UUID)",
  "status": "enum (not_started, in_progress, completed)",
  "assignee_id": "string (UUID)",
  "due_date": "string (YYYY-MM-DD)",
  "post_date": "string (YYYY-MM-DD)",
  "completed_at": "string (ISO 8601) | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)",
  "last_activity_at": "string (ISO 8601)"
}
```

### Approval

```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "client_id": "string (UUID)",
  "status": "enum (pending, approved, rejected)",
  "approver_id": "string (UUID)",
  "submitter_id": "string (UUID)",
  "due_date": "string (YYYY-MM-DD)",
  "approved_at": "string (ISO 8601) | null",
  "rejected_at": "string (ISO 8601) | null",
  "rejection_reason": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

### Comment

```json
{
  "id": "string (UUID)",
  "content": "string",
  "author_id": "string (UUID)",
  "author_name": "string",
  "task_id": "string (UUID) | null",
  "approval_id": "string (UUID) | null",
  "client_id": "string (UUID)",
  "direction": "enum (client_to_team, team_to_client)",
  "is_from_client": "boolean",
  "created_at": "string (ISO 8601)"
}
```

### Contract

```json
{
  "id": "string (UUID)",
  "name": "string",
  "client_id": "string (UUID)",
  "status": "enum (negotiation, active, expired)",
  "monthly_fee": "number (integer)",
  "start_date": "string (YYYY-MM-DD)",
  "end_date": "string (YYYY-MM-DD)",
  "renewal_date": "string (YYYY-MM-DD)",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

### Notification

```json
{
  "id": "string (UUID)",
  "user_id": "string (UUID)",
  "type": "enum (task_due, approval_due, comment, contract_renewal, approval_action)",
  "title": "string",
  "message": "string",
  "read": "boolean",
  "related_client_id": "string (UUID) | null",
  "related_item_id": "string (UUID) | null",
  "related_item_type": "enum (task, approval, comment, contract) | null",
  "created_at": "string (ISO 8601)"
}
```

### UserProfile（/auth/me）

```json
{
  "id": "string (UUID)",
  "email": "string (email)",
  "name": "string",
  "role": "enum (sales, direction, editor, creator, support, control, client)",
  "org_id": "string | null",
  "client_id": "string (UUID) | null",
  "avatar_url": "string (URL) | null",
  "created_at": "string (ISO 8601)"
}
```

---

## 🔐 RBAC・認可

### ロール別権限表

| リソース | Sales | Direction | Editor | Creator | Support | Control | Client |
|---------|-------|-----------|--------|---------|---------|---------|--------|
| **clients** | RCU | R | R | R | R | RCUD | R（自社） |
| **tasks** | RCU | RCU | RCU | RCU | RCU | RCUD | R（自社） |
| **approvals** | RC | **RCU** ✨ | RC | RC | R | RCUD | R（自社） |
| **comments** | RC | RC | RC | RC | RC | RCUD | RC（自社） |
| **contracts** | **RCU** ✨ | R | R | R | R | RCUD | R（自社） |
| **notifications** | R, 既読 | R, 既読 | R, 既読 | R, 既読 | R, 既読 | RCUD | R, 既読 |

**凡例**: R=Read, C=Create, U=Update, D=Delete

**重要ポイント**:
- **承認操作（approve/reject）**: Direction, Controlのみ
- **契約管理**: Sales, Controlのみ
- **Client**: 全て自社`client_id`のみアクセス可能
- **通知**: 全ロールで既読操作可能、作成はシステム自動

### 認可実装方針

**サーバー側で最終判定**:
1. JWT Claimsから`role`, `org_id`, `client_id`を取得
2. RLS（Supabase）でDB層でも権限制御
3. APIレイヤーでロール別権限チェック

**Example（Supabase RLS）**:
```sql
-- tasks テーブル（社内ロール）
CREATE POLICY "tasks_org_access" ON tasks
  FOR SELECT
  USING (org_id = auth.jwt() ->> 'org_id');

-- tasks テーブル（Clientロール）
CREATE POLICY "tasks_client_access" ON tasks
  FOR SELECT
  USING (client_id = auth.jwt() ->> 'client_id');

-- 承認操作（Direction/Controlのみ）
CREATE POLICY "approvals_approve" ON approvals
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' IN ('direction', 'control')
    AND org_id = auth.jwt() ->> 'org_id'
  );
```

---

## 🔄 ユースケース別APIシーケンス

### 1. ログイン→/auth/me→ロール別ホームデータ取得

**シーケンス**:

```
Client                        Supabase Auth                 API Server
  |                                |                              |
  |-- POST /auth/login ----------->|                              |
  |   (email, password)            |                              |
  |                                |                              |
  |<-- 200 OK -------------------- |                              |
  |   { access_token, user }       |                              |
  |                                |                              |
  |-- GET /auth/me ------------------------------------------>   |
  |   Authorization: Bearer <token>                              |
  |                                                               |
  |<-- 200 OK -------------------------------------------------- |
  |   { id, email, name, role, org_id, client_id }              |
  |                                                               |
  |-- GET /clients ------------------------------------------>   |
  |   Authorization: Bearer <token>                              |
  |                                                               |
  |<-- 200 OK -------------------------------------------------- |
  |   { data: [clients...], meta: {...} }                        |
  |                                                               |
  |-- GET /tasks?client_id=client_a ------------------------->   |
  |   Authorization: Bearer <token>                              |
  |                                                               |
  |<-- 200 OK -------------------------------------------------- |
  |   { data: [tasks...], meta: {...} }                          |
  |                                                               |
  |-- GET /notifications ------------------------------------>   |
  |   Authorization: Bearer <token>                              |
  |                                                               |
  |<-- 200 OK -------------------------------------------------- |
  |   { data: [notifications...], meta: { unread_count: 5 } }   |
```

**詳細**:
1. フロント: Supabase Authでログイン
2. フロント: `/auth/me`でプロファイル取得（role確認）
3. フロント: ロール別に必要なデータを取得
   - Sales: `/clients`, `/tasks`, `/contracts`, `/notifications`
   - Direction: `/clients`, `/tasks`, `/approvals`, `/notifications`
   - Client: `/clients?client_id=<自社>`, `/tasks?client_id=<自社>`, `/notifications`

---

### 2. タスク追加→通知生成→他ユーザー反映

**シーケンス**:

```
Client (Sales)                API Server                    Database                 Other Client (Direction)
  |                                |                              |                              |
  |-- POST /tasks --------------->|                              |                              |
  |   { title, client_id, ... }   |                              |                              |
  |                                |-- INSERT tasks ------------->|                              |
  |                                |                              |                              |
  |                                |<-- 201 Created -------------|                              |
  |                                |                              |                              |
  |<-- 201 Created --------------- |                              |                              |
  |   { data: { id, ... } }        |                              |                              |
  |                                |                              |                              |
  |                                |-- INSERT notifications ----->|                              |
  |                                |   (user_id=assignee, type=task_due)                        |
  |                                |                              |                              |
  |                                |<-- 201 Created -------------|                              |
  |                                |                              |                              |
  |                                                                |                              |
  |                                                                |<-- GET /tasks?since=... ----|
  |                                                                |   (60秒後のautoPull)          |
  |                                                                |                              |
  |                                                                |-- 200 OK (差分1件) -------->|
  |                                                                |   { data: [new_task] }       |
  |                                                                |                              |
  |                                                                |<-- GET /notifications ------|
  |                                                                |                              |
  |                                                                |-- 200 OK (通知1件) -------->|
  |                                                                |   { data: [notification] }   |
```

**詳細**:
1. Sales: タスク作成API呼び出し
2. Server: タスクをDBに保存
3. Server: 通知を自動生成（担当者宛に`task_due`通知）
4. Direction: 60秒後のautoPull（Incremental Pull）で差分取得
   - `GET /tasks?since=<lastPulledAt>`
   - `GET /notifications?since=<lastPulledAt>`
5. Direction: 画面に新規タスクと通知が表示される

**Note**: Realtimeを導入する場合、4-5のステップがWebSocket経由でリアルタイム反映

---

### 3. Clientコメント→未返信検知→返信→アラート変化

**シーケンス**:

```
Client (Client)               API Server                    Database                 Client (Sales)
  |                                |                              |                              |
  |-- POST /comments ------------>|                              |                              |
  |   { content, task_id }        |                              |                              |
  |                                |-- INSERT comments ---------->|                              |
  |                                |   (direction=client_to_team) |                              |
  |                                |                              |                              |
  |<-- 201 Created --------------- |                              |                              |
  |   { data: { id, ... } }        |                              |                              |
  |                                |                              |                              |
  |                                |-- INSERT notifications ----->|                              |
  |                                |   (user_id=team, type=comment)                             |
  |                                |                              |                              |
  |                                |                              |<-- GET /comments?since=... -|
  |                                |                              |   (60秒後のautoPull)          |
  |                                |                              |                              |
  |                                |                              |-- 200 OK (差分1件) -------->|
  |                                |                              |   { data: [client_comment] } |
  |                                |                              |                              |
  |                                |                              |   （noReplyアラート増加）      |
  |                                |                              |                              |
  |                                |                              |<-- POST /comments ----------|
  |                                |                              |   { content, task_id }       |
  |                                |                              |   (Team返信)                  |
  |                                |                              |                              |
  |                                |<-- INSERT comments -----------|                              |
  |                                |   (direction=team_to_client) |                              |
  |                                |                              |                              |
  |                                |-- 201 Created -------------->|                              |
  |                                |                              |                              |
  |<-- GET /comments?since=... ---|                              |                              |
  |   (60秒後のautoPull)            |                              |                              |
  |                                |                              |                              |
  |-- 200 OK (差分1件) ---------->|                              |                              |
  |   { data: [team_comment] }     |                              |                              |
  |                                |                              |                              |
  |   （noReplyアラート減少）        |                              |                              |
```

**詳細**:
1. Client: タスクにコメント投稿（`direction=client_to_team`）
2. Server: コメントをDBに保存
3. Server: 通知を自動生成（Team担当者宛に`comment`通知）
4. Sales: 60秒後のautoPullでコメント取得
5. Sales: noReplyアラートが増加（Client→Teamで未返信）
6. Sales: 返信コメント投稿（`direction=team_to_client`）
7. Client: 60秒後のautoPullで返信取得
8. Sales: noReplyアラートが減少（返信済み）

**Note**: コメント方向（`direction`）とnoReply判定はサーバー側で自動計算

---

## 🔔 Realtime/Webhook方針

### 現状（Phase 8.5）

**autoPull（Incremental Pull）のみ**:
- 60秒間隔でポーリング
- `since`パラメータで差分のみ取得
- 97-98%の時間短縮達成

### Phase 10（本番リリース）

**方針A（推奨）**: autoPull継続、Realtimeは非採用

**理由**:
- autoPullで十分なパフォーマンス（50-300ms）
- WebSocket接続のコスト増を避ける
- 実装がシンプル

### Phase 11（本番後の改善）

**方針B**: notifications/commentsのみRealtime導入

**採用対象**:
- `notifications`: リアルタイム通知表示
- `comments`: チャットのようなUX

**非採用対象**:
- `tasks`: autoPullで十分
- `approvals`: autoPullで十分
- `contracts`: autoPullで十分

**実装方針（Supabase Realtime）**:
```javascript
// フロントエンド
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // リアルタイム通知を画面に表示
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

### Webhook

**Phase 11以降で検討**:
- Slack通知（タスク期限、承認期限）
- メール通知（重要アラート）

**エンドポイント例**:
```
POST /webhooks/slack
POST /webhooks/email
```

---

## ⚠️ 未決事項

### ✅ 解決済み（DECISIONS.mdに記録）

以下の未決事項は全て **2024-12-23に確定**しました。詳細は`DECISIONS.md`を参照してください。

1. **KPI計算**: ✅ B案採用（サーバー計算） - GET /kpi/direction, GET /kpi/sales 追加済み
2. **アラート取得**: ✅ B案採用（サーバー計算） - GET /alerts 追加済み
3. **Realtime導入**: ❌ Phase 10では非採用（autoPull継続）
4. **Webhook**: ❌ Phase 10では非採用（Phase 11以降で検討）
5. **Rate Limit**: ❌ Phase 10では非設定（監視でカバー）

---

### ⏳ 今後検討（Phase 11以降）

#### 1. 削除操作（DELETE）の扱い

**質問**: 削除操作をどう扱うか？

**選択肢**:
- **A案**: 論理削除（`deleted_at`フラグ）
  - メリット: 履歴追跡、復元可能
  - デメリット: クエリ複雑化、RLSに`deleted_at IS NULL`追加
- **B案**: 物理削除（DELETE）
  - メリット: シンプル
  - デ���リット: 復元不可、履歴なし

**推奨**: Phase 8.6でA案（論理削除）導入。現状はB案（物理削除）で進める。

**影響範囲**:
- 全6リソースにDELETEエンドポイント追加が必要
- RLSに`deleted_at IS NULL`条件追加
- Incremental Pullで`deleted_at`変更も差分取得対象

---

#### 2. ページングのデフォルト件数

**質問**: デフォルトの`limit`は？

**選択肢**:
- **A案**: 50件（現状の想定）
- **B案**: 100件

**推奨**: A案（50件）、最大100件

---