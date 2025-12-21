# PALSS SYSTEM - バックエンド仕様書

**バージョン:** 1.0  
**最終更新日:** 2024年12月20日  
**対象:** バックエンドエンジニア

---

## 目次

1. [システム概要](#1-システム概要)
2. [アーキテクチャ](#2-アーキテクチャ)
3. [認証・認可](#3-認証認可)
4. [データモデル](#4-データモデル)
5. [API仕様](#5-api仕様)
6. [リアルタイム通信](#6-リアルタイム通信)
7. [ファイルストレージ](#7-ファイルストレージ)
8. [通知システム](#8-通知システム)
9. [セキュリティ要件](#9-セキュリティ要件)
10. [パフォーマンス要件](#10-パフォーマンス要件)

---

## 1. システム概要

### 1.1 プロジェクト概要

**PALSS SYSTEM**は、SNS代行会社向けのSaaSダッシュボードシステムです。営業からコンテンツ制作、クライアント管理まで、SNS代行業務の全工程を一元管理します。

### 1.2 主要機能

- **Sales Board**: 営業管理（商談、パイプライン、KPI）
- **Direction Board**: ディレクション管理（プロジェクト進行、承認フロー）
- **Editor Board**: 編集者向け作業管理（編集タスク、レビューキュー）
- **Creator Board**: クリエイター向け撮影・制作管理
- **Control Board**: 経営管理（財務、チームパフォーマンス、リスク管理）
- **Client Board**: クライアント専用ポータル
- **PALSS CHAT**: 全社統合チャットシステム
- **PALSS AI SYSTEM**: AI支援機能（提案、レポート生成、分析）

### 1.3 ユーザーロール

| ロール | 説明 | アクセス権限 |
|--------|------|-------------|
| **Admin** | システム管理者 | 全ボード・全機能アクセス |
| **Sales** | 営業担当者 | Sales Board、Direction Board（My Clients経由） |
| **Director** | ディレクター | Direction Board、Client管理、制作フロー管理 |
| **Editor** | 編集者 | Editor Board、レビューキュー、アセット管理 |
| **Creator** | クリエイター | Creator Board、撮影スケジュール、アセットアップロード |
| **Manager** | 経営陣 | Control Board、全ボード閲覧権限 |
| **Client** | クライアント | Client Board（自社データのみ） |

---

## 2. アーキテクチャ

### 2.1 システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - PALSS SYSTEM Dashboard                                │
│  - Apple Design System準拠                                │
│  - Tailwind CSS v4.0                                     │
└─────────────────────────────────────────────────────────┘
                            ↓ HTTPS/REST API
┌─────────────────────────────────────────────────────────┐
│                  API Gateway / Load Balancer             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend Application Server              │
│  - RESTful API                                           │
│  - WebSocket Server（リアルタイム通信）                    │
│  - Business Logic Layer                                  │
└─────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Database   │    │ File Storage │    │ Redis Cache  │
│  PostgreSQL  │    │    S3/GCS    │    │   Session    │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 2.2 推奨技術スタック

| レイヤー | 推奨技術 |
|---------|---------|
| **言語** | Node.js (TypeScript) / Python / Go |
| **フレームワーク** | Express.js / Fastify / NestJS / Django / Gin |
| **データベース** | PostgreSQL 14+ |
| **キャッシュ** | Redis 7+ |
| **ファイルストレージ** | AWS S3 / Google Cloud Storage |
| **リアルタイム通信** | Socket.IO / WebSocket |
| **認証** | JWT + Refresh Token |
| **検索** | Elasticsearch（オプション） |
| **メール送信** | SendGrid / AWS SES |

---

## 3. 認証・認可

### 3.1 認証フロー

#### 招待ベース登録フロー

```
1. 管理者がメールアドレスで招待を送信
   POST /api/auth/invite
   
2. ユーザーが招待リンクをクリック
   GET /api/auth/verify-invite?token={invite_token}
   
3. 新規ユーザー: パスワード設定
   POST /api/auth/register
   
4. 既存ユーザー: パスワードでログイン
   POST /api/auth/login
   
5. JWTトークン発行
   Response: { accessToken, refreshToken, user }
```

#### クライアント招待フロー

```
1. ディレクターがクライアント招待
   POST /api/clients/invite
   
2. クライアントがメールから初回ログイン
   POST /api/auth/client-register
   
3. Client Board専用トークン発行
   Response: { accessToken, refreshToken, clientData }
```

### 3.2 認証エンドポイント

#### POST `/api/auth/invite`
**説明**: チームメンバーを招待

**リクエスト:**
```json
{
  "email": "tanaka@example.com",
  "role": "director",
  "firstName": "太郎",
  "lastName": "田中"
}
```

**レスポンス:**
```json
{
  "success": true,
  "inviteId": "inv_abc123",
  "expiresAt": "2024-12-27T00:00:00Z"
}
```

#### POST `/api/auth/register`
**説明**: 招待を受けた新規ユーザーの登録

**リクエスト:**
```json
{
  "inviteToken": "inv_abc123",
  "password": "SecurePass123!",
  "firstName": "太郎",
  "lastName": "田中"
}
```

**レスポンス:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_xyz789",
  "user": {
    "id": "usr_001",
    "email": "tanaka@example.com",
    "role": "director",
    "firstName": "太郎",
    "lastName": "田中"
  }
}
```

#### POST `/api/auth/login`
**説明**: ログイン

**リクエスト:**
```json
{
  "email": "tanaka@example.com",
  "password": "SecurePass123!"
}
```

**レスポンス:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_xyz789",
  "user": {
    "id": "usr_001",
    "email": "tanaka@example.com",
    "role": "director",
    "firstName": "太郎",
    "lastName": "田中",
    "avatarUrl": "https://cdn.palss.com/avatars/usr_001.jpg"
  }
}
```

#### POST `/api/auth/refresh`
**説明**: トークンリフレッシュ

**リクエスト:**
```json
{
  "refreshToken": "refresh_xyz789"
}
```

**レスポンス:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_new456"
}
```

### 3.3 認可（ロールベースアクセス制御）

各APIエンドポイントは、ユーザーロールに基づいてアクセス制御を行います。

**実装例:**
```typescript
// Middleware example
function requireRole(roles: UserRole[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/control/financial', requireRole(['admin', 'manager']), getFinancialData);
```

---

## 4. データモデル

### 4.1 User（ユーザー）

```typescript
interface User {
  id: string;                    // Primary Key (usr_xxx)
  email: string;                 // Unique
  passwordHash: string;
  role: 'admin' | 'sales' | 'director' | 'editor' | 'creator' | 'manager';
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  department?: string;
  status: 'active' | 'inactive' | 'invited';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

**インデックス:**
- `email` (UNIQUE)
- `role`
- `status`

### 4.2 Client（クライアント）

```typescript
interface Client {
  id: string;                           // Primary Key (cli_xxx)
  name: string;                         // 会社名
  instagramHandle?: string;             // @username
  industry?: string;                    // 業種
  contactPerson: string;                // 担当者名（必須）
  email: string;                        // メールアドレス（必須）
  phone?: string;                       // 電話番号
  location?: string;                    // 所在地
  contractStatus: 'active' | 'pending' | 'paused';
  monthlyFee: number;                   // 月額契約金額
  followers?: number;                   // Instagramフォロワー数
  engagement?: number;                  // エンゲージメント率
  startDate?: Date;                     // 契約開始日
  assignedTo: string;                   // User ID（担当者）
  teamScope: 'mine' | 'team';          // スコープ
  avatarUrl?: string;
  lastActivity?: Date;
  nextMeeting?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `assignedTo`
- `contractStatus`
- `teamScope`
- `email` (UNIQUE)

### 4.3 Project（プロジェクト）

```typescript
interface Project {
  id: string;                           // Primary Key (prj_xxx)
  clientId: string;                     // Foreign Key → Client
  name: string;                         // プロジェクト名
  description?: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  assignedDirector: string;             // User ID
  assignedEditor?: string;              // User ID
  assignedCreator?: string;             // User ID
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  progress: number;                     // 0-100
  tags: string[];                       // ['instagram', 'reels', 'photo']
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `clientId`
- `assignedDirector`
- `status`
- `dueDate`

### 4.4 Task（タスク）

```typescript
interface Task {
  id: string;                           // Primary Key (tsk_xxx)
  projectId?: string;                   // Foreign Key → Project (nullable)
  clientId?: string;                    // Foreign Key → Client (nullable)
  title: string;
  description?: string;
  type: 'shoot' | 'edit' | 'review' | 'approval' | 'meeting' | 'other';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;                   // User ID
  createdBy: string;                    // User ID
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  attachments: string[];                // File URLs
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `projectId`
- `clientId`
- `assignedTo`
- `status`
- `dueDate`

### 4.5 Asset（アセット）

```typescript
interface Asset {
  id: string;                           // Primary Key (ast_xxx)
  projectId?: string;                   // Foreign Key → Project
  clientId?: string;                    // Foreign Key → Client
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  fileUrl: string;                      // S3/GCS URL
  thumbnailUrl?: string;
  fileSize: number;                     // Bytes
  mimeType: string;
  width?: number;                       // 画像/動画の幅
  height?: number;                      // 画像/動画の高さ
  duration?: number;                    // 動画の長さ（秒）
  uploadedBy: string;                   // User ID
  status: 'pending' | 'approved' | 'rejected';
  version: number;                      // バージョン管理
  tags: string[];
  metadata: Record<string, any>;        // 追加メタデータ
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `projectId`
- `clientId`
- `uploadedBy`
- `type`
- `status`

### 4.6 Review（レビュー）

```typescript
interface Review {
  id: string;                           // Primary Key (rev_xxx)
  assetId: string;                      // Foreign Key → Asset
  projectId: string;                    // Foreign Key → Project
  reviewerId: string;                   // User ID
  status: 'pending' | 'approved' | 'revision-requested' | 'rejected';
  rating?: number;                      // 1-5
  comment?: string;
  revisionNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `assetId`
- `projectId`
- `reviewerId`
- `status`

### 4.7 Schedule（スケジュール）

```typescript
interface Schedule {
  id: string;                           // Primary Key (sch_xxx)
  title: string;
  description?: string;
  type: 'shoot' | 'meeting' | 'review' | 'deadline' | 'other';
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  location?: string;
  attendees: string[];                  // User IDs
  clientId?: string;                    // Foreign Key → Client
  projectId?: string;                   // Foreign Key → Project
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reminderBefore?: number;              // 分単位
  createdBy: string;                    // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `startTime`
- `clientId`
- `projectId`
- `attendees` (配列インデックス)
- `status`

### 4.8 Message（メッセージ - PALSS CHAT）

```typescript
interface Message {
  id: string;                           // Primary Key (msg_xxx)
  conversationId: string;               // Foreign Key → Conversation
  senderId: string;                     // User ID
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachments: string[];                // File URLs
  isEdited: boolean;
  readBy: string[];                     // User IDs
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `conversationId`
- `senderId`
- `createdAt` (DESC)

### 4.9 Conversation（会話）

```typescript
interface Conversation {
  id: string;                           // Primary Key (cnv_xxx)
  type: 'direct' | 'group' | 'client';
  name?: string;                        // グループ名（type=groupの場合）
  participants: string[];               // User IDs
  clientId?: string;                    // Foreign Key → Client (type=clientの場合)
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  unreadCount: Record<string, number>;  // { userId: count }
  createdBy: string;                    // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `participants` (配列インデックス)
- `clientId`
- `lastMessageAt` (DESC)

### 4.10 Notification（通知）

```typescript
interface Notification {
  id: string;                           // Primary Key (ntf_xxx)
  userId: string;                       // User ID
  type: 'task' | 'approval' | 'message' | 'deadline' | 'mention' | 'system';
  title: string;
  message: string;
  actionUrl?: string;                   // クリック時のリンク先
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  metadata: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}
```

**インデックス:**
- `userId`
- `isRead`
- `createdAt` (DESC)

### 4.11 KPI（KPI指標）

```typescript
interface KPI {
  id: string;                           // Primary Key (kpi_xxx)
  userId?: string;                      // User ID (個人KPI)
  clientId?: string;                    // Client ID (クライアントKPI)
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  date: Date;
  metrics: {
    revenue?: number;                   // 売上
    newClients?: number;                // 新規クライアント数
    activeProjects?: number;            // アクティブプロジェクト数
    completedProjects?: number;         // 完了プロジェクト数
    customerSatisfaction?: number;      // 顧客満足度 (1-5)
    onTimeDelivery?: number;            // 期限内納品率 (%)
    utilization?: number;               // 稼働率 (%)
    engagement?: number;                // エンゲージメント率 (%)
    followers?: number;                 // フォロワー数
    customMetrics?: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**インデックス:**
- `userId`
- `clientId`
- `period`
- `date` (DESC)

---

## 5. API仕様

### 5.1 クライアント管理API

#### GET `/api/clients`
**説明**: クライアント一覧取得

**クエリパラメータ:**
- `scope`: 'mine' | 'team'（デフォルト: 'mine'）
- `status`: 'active' | 'pending' | 'paused' | 'all'（デフォルト: 'all'）
- `search`: 検索クエリ（会社名、担当者名で検索）
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20）

**レスポンス:**
```json
{
  "clients": [
    {
      "id": "cli_001",
      "name": "株式会社サンプル",
      "instagramHandle": "@sample_company",
      "industry": "Beauty & Cosmetics",
      "contactPerson": "山田 太郎",
      "email": "yamada@sample.com",
      "phone": "03-1234-5678",
      "location": "東京都渋谷区",
      "contractStatus": "active",
      "monthlyFee": 280000,
      "followers": 12500,
      "engagement": 4.8,
      "startDate": "2024-01-15T00:00:00Z",
      "assignedTo": "usr_001",
      "teamScope": "mine",
      "avatarUrl": "https://cdn.palss.com/clients/cli_001.jpg",
      "lastActivity": "2024-12-19T10:30:00Z",
      "nextMeeting": "2024-12-22T14:00:00Z",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-12-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### POST `/api/clients`
**説明**: 新規クライアント追加

**リクエスト:**
```json
{
  "name": "株式会社サンプル",
  "instagramHandle": "@sample_company",
  "industry": "Beauty & Cosmetics",
  "contactPerson": "山田 太郎",
  "email": "yamada@sample.com",
  "phone": "03-1234-5678",
  "location": "東京都渋谷区",
  "contractStatus": "pending",
  "monthlyFee": 280000
}
```

**レスポンス:**
```json
{
  "client": {
    "id": "cli_002",
    "name": "株式会社サンプル",
    "contactPerson": "山田 太郎",
    "email": "yamada@sample.com",
    "contractStatus": "pending",
    "monthlyFee": 280000,
    "assignedTo": "usr_001",
    "teamScope": "mine",
    "createdAt": "2024-12-20T12:00:00Z",
    "updatedAt": "2024-12-20T12:00:00Z"
  }
}
```

#### GET `/api/clients/:clientId`
**説明**: クライアント詳細取得

**レスポンス:**
```json
{
  "client": {
    "id": "cli_001",
    "name": "株式会社サンプル",
    "instagramHandle": "@sample_company",
    "industry": "Beauty & Cosmetics",
    "contactPerson": "山田 太郎",
    "email": "yamada@sample.com",
    "phone": "03-1234-5678",
    "location": "東京都渋谷区",
    "contractStatus": "active",
    "monthlyFee": 280000,
    "followers": 12500,
    "engagement": 4.8,
    "startDate": "2024-01-15T00:00:00Z",
    "assignedTo": "usr_001",
    "teamScope": "mine",
    "avatarUrl": "https://cdn.palss.com/clients/cli_001.jpg",
    "lastActivity": "2024-12-19T10:30:00Z",
    "nextMeeting": "2024-12-22T14:00:00Z",
    "createdAt": "2024-01-10T09:00:00Z",
    "updatedAt": "2024-12-19T10:30:00Z"
  },
  "projects": [
    {
      "id": "prj_001",
      "name": "2024年末キャンペーン",
      "status": "in-progress",
      "progress": 65,
      "dueDate": "2024-12-31T23:59:59Z"
    }
  ],
  "tasks": [
    {
      "id": "tsk_001",
      "title": "商品撮影",
      "status": "pending",
      "dueDate": "2024-12-22T18:00:00Z"
    }
  ],
  "kpi": {
    "period": "monthly",
    "date": "2024-12-01T00:00:00Z",
    "metrics": {
      "followers": 12500,
      "engagement": 4.8,
      "postsPublished": 24,
      "averageLikes": 450
    }
  }
}
```

#### PUT `/api/clients/:clientId`
**説明**: クライアント情報更新

**リクエスト:**
```json
{
  "contactPerson": "佐藤 花子",
  "phone": "03-9876-5432",
  "monthlyFee": 320000
}
```

**レスポンス:**
```json
{
  "client": {
    "id": "cli_001",
    "name": "株式会社サンプル",
    "contactPerson": "佐藤 花子",
    "phone": "03-9876-5432",
    "monthlyFee": 320000,
    "updatedAt": "2024-12-20T13:00:00Z"
  }
}
```

#### DELETE `/api/clients/:clientId`
**説明**: クライアント削除（論理削除）

**レスポンス:**
```json
{
  "success": true,
  "message": "Client archived successfully"
}
```

#### POST `/api/clients/:clientId/invite`
**説明**: クライアントポータルへ招待

**リクエスト:**
```json
{
  "email": "client@sample.com",
  "firstName": "太郎",
  "lastName": "山田"
}
```

**レスポンス:**
```json
{
  "success": true,
  "inviteId": "inv_cli_abc123",
  "expiresAt": "2024-12-27T00:00:00Z"
}
```

### 5.2 プロジェクト管理API

#### GET `/api/projects`
**説明**: プロジェクト一覧取得

**クエリパラメータ:**
- `clientId`: クライアントIDでフィルタ
- `status`: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold' | 'all'
- `assignedTo`: 担当者IDでフィルタ
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "projects": [
    {
      "id": "prj_001",
      "clientId": "cli_001",
      "clientName": "株式会社サンプル",
      "name": "2024年末キャンペーン",
      "description": "Instagram Reels 5本 + フィード投稿 10本",
      "status": "in-progress",
      "priority": "high",
      "assignedDirector": "usr_001",
      "assignedEditor": "usr_005",
      "assignedCreator": "usr_008",
      "startDate": "2024-12-01T00:00:00Z",
      "dueDate": "2024-12-31T23:59:59Z",
      "progress": 65,
      "tags": ["instagram", "reels", "campaign"],
      "createdAt": "2024-11-25T10:00:00Z",
      "updatedAt": "2024-12-19T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "totalPages": 2
  }
}
```

#### POST `/api/projects`
**説明**: 新規プロジェクト作成

**リクエスト:**
```json
{
  "clientId": "cli_001",
  "name": "2025新春キャンペーン",
  "description": "Instagram Stories + Reels",
  "status": "planning",
  "priority": "medium",
  "assignedDirector": "usr_001",
  "assignedEditor": "usr_005",
  "assignedCreator": "usr_008",
  "startDate": "2025-01-05T00:00:00Z",
  "dueDate": "2025-01-31T23:59:59Z",
  "tags": ["instagram", "stories", "campaign"]
}
```

**レスポンス:**
```json
{
  "project": {
    "id": "prj_002",
    "clientId": "cli_001",
    "name": "2025新春キャンペーン",
    "status": "planning",
    "priority": "medium",
    "progress": 0,
    "createdAt": "2024-12-20T14:00:00Z",
    "updatedAt": "2024-12-20T14:00:00Z"
  }
}
```

#### GET `/api/projects/:projectId`
**説明**: プロジェクト詳細取得

**レスポンス:**
```json
{
  "project": {
    "id": "prj_001",
    "clientId": "cli_001",
    "clientName": "株式会社サンプル",
    "name": "2024年末キャンペーン",
    "description": "Instagram Reels 5本 + フィード投稿 10本",
    "status": "in-progress",
    "priority": "high",
    "assignedDirector": "usr_001",
    "assignedEditor": "usr_005",
    "assignedCreator": "usr_008",
    "startDate": "2024-12-01T00:00:00Z",
    "dueDate": "2024-12-31T23:59:59Z",
    "progress": 65,
    "tags": ["instagram", "reels", "campaign"],
    "createdAt": "2024-11-25T10:00:00Z",
    "updatedAt": "2024-12-19T15:30:00Z"
  },
  "tasks": [
    {
      "id": "tsk_001",
      "title": "商品撮影",
      "type": "shoot",
      "status": "completed",
      "assignedTo": "usr_008",
      "completedAt": "2024-12-10T18:00:00Z"
    },
    {
      "id": "tsk_002",
      "title": "Reels編集",
      "type": "edit",
      "status": "in-progress",
      "assignedTo": "usr_005",
      "dueDate": "2024-12-23T18:00:00Z"
    }
  ],
  "assets": [
    {
      "id": "ast_001",
      "name": "product_photo_001.jpg",
      "type": "image",
      "fileUrl": "https://cdn.palss.com/assets/ast_001.jpg",
      "status": "approved",
      "uploadedBy": "usr_008",
      "createdAt": "2024-12-10T17:30:00Z"
    }
  ]
}
```

#### PUT `/api/projects/:projectId`
**説明**: プロジェクト更新

**リクエスト:**
```json
{
  "status": "review",
  "progress": 85
}
```

**レスポンス:**
```json
{
  "project": {
    "id": "prj_001",
    "status": "review",
    "progress": 85,
    "updatedAt": "2024-12-20T15:00:00Z"
  }
}
```

### 5.3 タスク管理API

#### GET `/api/tasks`
**説明**: タスク一覧取得

**クエリパラメータ:**
- `assignedTo`: 担当者IDでフィルタ
- `projectId`: プロジェクトIDでフィルタ
- `status`: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'all'
- `type`: 'shoot' | 'edit' | 'review' | 'approval' | 'meeting' | 'other' | 'all'
- `dueDate`: 期限日でフィルタ（YYYY-MM-DD）
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "tasks": [
    {
      "id": "tsk_001",
      "projectId": "prj_001",
      "clientId": "cli_001",
      "title": "商品撮影",
      "description": "新商品5点の撮影",
      "type": "shoot",
      "status": "pending",
      "priority": "high",
      "assignedTo": "usr_008",
      "createdBy": "usr_001",
      "dueDate": "2024-12-22T18:00:00Z",
      "estimatedHours": 4,
      "attachments": [],
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2024-12-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

#### POST `/api/tasks`
**説明**: 新規タスク作成

**リクエスト:**
```json
{
  "projectId": "prj_001",
  "title": "Reels編集",
  "description": "クリスマスキャンペーンReels 5本",
  "type": "edit",
  "status": "pending",
  "priority": "high",
  "assignedTo": "usr_005",
  "dueDate": "2024-12-23T18:00:00Z",
  "estimatedHours": 8
}
```

**レスポンス:**
```json
{
  "task": {
    "id": "tsk_002",
    "projectId": "prj_001",
    "title": "Reels編集",
    "type": "edit",
    "status": "pending",
    "priority": "high",
    "assignedTo": "usr_005",
    "createdBy": "usr_001",
    "dueDate": "2024-12-23T18:00:00Z",
    "createdAt": "2024-12-20T16:00:00Z",
    "updatedAt": "2024-12-20T16:00:00Z"
  }
}
```

#### PUT `/api/tasks/:taskId`
**説明**: タスク更新

**リクエスト:**
```json
{
  "status": "in-progress",
  "actualHours": 2
}
```

**レスポンス:**
```json
{
  "task": {
    "id": "tsk_002",
    "status": "in-progress",
    "actualHours": 2,
    "updatedAt": "2024-12-20T17:00:00Z"
  }
}
```

### 5.4 アセット管理API

#### POST `/api/assets/upload`
**説明**: アセットアップロード

**リクエスト（multipart/form-data）:**
```
file: [ファイルデータ]
projectId: "prj_001"
name: "product_photo_001.jpg"
type: "image"
tags: ["product", "christmas"]
```

**レスポンス:**
```json
{
  "asset": {
    "id": "ast_002",
    "projectId": "prj_001",
    "name": "product_photo_001.jpg",
    "type": "image",
    "fileUrl": "https://cdn.palss.com/assets/ast_002.jpg",
    "thumbnailUrl": "https://cdn.palss.com/thumbnails/ast_002.jpg",
    "fileSize": 2458960,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedBy": "usr_008",
    "status": "pending",
    "version": 1,
    "tags": ["product", "christmas"],
    "createdAt": "2024-12-20T18:00:00Z",
    "updatedAt": "2024-12-20T18:00:00Z"
  }
}
```

#### GET `/api/assets`
**説明**: アセット一覧取得

**クエリパラメータ:**
- `projectId`: プロジェクトIDでフィルタ
- `clientId`: クライアントIDでフィルタ
- `type`: 'image' | 'video' | 'document' | 'other' | 'all'
- `status`: 'pending' | 'approved' | 'rejected' | 'all'
- `uploadedBy`: アップロード者IDでフィルタ
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "assets": [
    {
      "id": "ast_002",
      "projectId": "prj_001",
      "name": "product_photo_001.jpg",
      "type": "image",
      "fileUrl": "https://cdn.palss.com/assets/ast_002.jpg",
      "thumbnailUrl": "https://cdn.palss.com/thumbnails/ast_002.jpg",
      "fileSize": 2458960,
      "mimeType": "image/jpeg",
      "width": 1920,
      "height": 1080,
      "uploadedBy": "usr_008",
      "status": "pending",
      "version": 1,
      "tags": ["product", "christmas"],
      "createdAt": "2024-12-20T18:00:00Z",
      "updatedAt": "2024-12-20T18:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

#### GET `/api/assets/:assetId`
**説明**: アセット詳細取得

**レスポンス:**
```json
{
  "asset": {
    "id": "ast_002",
    "projectId": "prj_001",
    "clientId": "cli_001",
    "name": "product_photo_001.jpg",
    "type": "image",
    "fileUrl": "https://cdn.palss.com/assets/ast_002.jpg",
    "thumbnailUrl": "https://cdn.palss.com/thumbnails/ast_002.jpg",
    "fileSize": 2458960,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedBy": "usr_008",
    "status": "pending",
    "version": 1,
    "tags": ["product", "christmas"],
    "metadata": {},
    "createdAt": "2024-12-20T18:00:00Z",
    "updatedAt": "2024-12-20T18:00:00Z"
  },
  "reviews": [
    {
      "id": "rev_001",
      "reviewerId": "usr_001",
      "status": "pending",
      "createdAt": "2024-12-20T19:00:00Z"
    }
  ]
}
```

#### DELETE `/api/assets/:assetId`
**説明**: アセット削除

**レスポンス:**
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

### 5.5 レビュー管理API

#### POST `/api/reviews`
**説明**: レビュー作成・更新

**リクエスト:**
```json
{
  "assetId": "ast_002",
  "projectId": "prj_001",
  "status": "approved",
  "rating": 5,
  "comment": "素晴らしい仕上がりです！"
}
```

**レスポンス:**
```json
{
  "review": {
    "id": "rev_001",
    "assetId": "ast_002",
    "projectId": "prj_001",
    "reviewerId": "usr_001",
    "status": "approved",
    "rating": 5,
    "comment": "素晴らしい仕上がりです！",
    "reviewedAt": "2024-12-20T20:00:00Z",
    "createdAt": "2024-12-20T19:00:00Z",
    "updatedAt": "2024-12-20T20:00:00Z"
  }
}
```

#### GET `/api/reviews/pending`
**説明**: レビュー待ちアセット一覧

**クエリパラメータ:**
- `reviewerId`: レビュアーID（省略時は自分のレビュー待ち）
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "reviews": [
    {
      "id": "rev_001",
      "assetId": "ast_002",
      "assetName": "product_photo_001.jpg",
      "assetUrl": "https://cdn.palss.com/assets/ast_002.jpg",
      "projectId": "prj_001",
      "projectName": "2024年末キャンペーン",
      "clientName": "株式会社サンプル",
      "reviewerId": "usr_001",
      "status": "pending",
      "createdAt": "2024-12-20T19:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

### 5.6 スケジュール管理API

#### GET `/api/schedules`
**説明**: スケジュール一覧取得

**クエリパラメータ:**
- `startDate`: 開始日時（YYYY-MM-DD）
- `endDate`: 終了日時（YYYY-MM-DD）
- `attendees`: 参加者IDでフィルタ（カンマ区切り）
- `type`: 'shoot' | 'meeting' | 'review' | 'deadline' | 'other' | 'all'

**レスポンス:**
```json
{
  "schedules": [
    {
      "id": "sch_001",
      "title": "商品撮影",
      "description": "新商品5点の撮影",
      "type": "shoot",
      "startTime": "2024-12-22T10:00:00Z",
      "endTime": "2024-12-22T14:00:00Z",
      "allDay": false,
      "location": "スタジオA",
      "attendees": ["usr_008", "usr_001"],
      "clientId": "cli_001",
      "projectId": "prj_001",
      "status": "scheduled",
      "reminderBefore": 60,
      "createdBy": "usr_001",
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2024-12-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/schedules`
**説明**: スケジュール作成

**リクエスト:**
```json
{
  "title": "クライアントミーティング",
  "description": "月次報告",
  "type": "meeting",
  "startTime": "2024-12-25T14:00:00Z",
  "endTime": "2024-12-25T15:00:00Z",
  "allDay": false,
  "location": "オンライン（Zoom）",
  "attendees": ["usr_001", "usr_005"],
  "clientId": "cli_001",
  "reminderBefore": 30
}
```

**レスポンス:**
```json
{
  "schedule": {
    "id": "sch_002",
    "title": "クライアントミーティング",
    "type": "meeting",
    "startTime": "2024-12-25T14:00:00Z",
    "endTime": "2024-12-25T15:00:00Z",
    "status": "scheduled",
    "createdAt": "2024-12-20T21:00:00Z",
    "updatedAt": "2024-12-20T21:00:00Z"
  }
}
```

### 5.7 チャット管理API（PALSS CHAT）

#### GET `/api/conversations`
**説明**: 会話一覧取得

**クエリパラメータ:**
- `type`: 'direct' | 'group' | 'client' | 'all'
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "conversations": [
    {
      "id": "cnv_001",
      "type": "direct",
      "participants": ["usr_001", "usr_005"],
      "lastMessageAt": "2024-12-20T15:30:00Z",
      "lastMessagePreview": "明日の撮影、よろしくお願いします",
      "unreadCount": 2,
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2024-12-20T15:30:00Z"
    },
    {
      "id": "cnv_002",
      "type": "group",
      "name": "2024年末キャンペーンチーム",
      "participants": ["usr_001", "usr_005", "usr_008"],
      "lastMessageAt": "2024-12-20T16:45:00Z",
      "lastMessagePreview": "編集完了しました！",
      "unreadCount": 0,
      "createdAt": "2024-11-25T12:00:00Z",
      "updatedAt": "2024-12-20T16:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

#### GET `/api/conversations/:conversationId/messages`
**説明**: メッセージ一覧取得

**クエリパラメータ:**
- `before`: 指定ID以前のメッセージを取得（ページネーション）
- `limit`: 取得件数（デフォルト: 50）

**レスポンス:**
```json
{
  "messages": [
    {
      "id": "msg_001",
      "conversationId": "cnv_001",
      "senderId": "usr_005",
      "content": "明日の撮影、よろしくお願いします",
      "messageType": "text",
      "attachments": [],
      "isEdited": false,
      "readBy": ["usr_001"],
      "createdAt": "2024-12-20T15:30:00Z",
      "updatedAt": "2024-12-20T15:30:00Z"
    },
    {
      "id": "msg_002",
      "conversationId": "cnv_001",
      "senderId": "usr_001",
      "content": "承知しました！10時にスタジオで",
      "messageType": "text",
      "attachments": [],
      "isEdited": false,
      "readBy": ["usr_005"],
      "createdAt": "2024-12-20T15:32:00Z",
      "updatedAt": "2024-12-20T15:32:00Z"
    }
  ],
  "hasMore": false
}
```

#### POST `/api/conversations/:conversationId/messages`
**説明**: メッセージ送信

**リクエスト:**
```json
{
  "content": "編集完了しました！確認お願いします",
  "messageType": "text",
  "attachments": []
}
```

**レスポンス:**
```json
{
  "message": {
    "id": "msg_003",
    "conversationId": "cnv_002",
    "senderId": "usr_005",
    "content": "編集完了しました！確認お願いします",
    "messageType": "text",
    "attachments": [],
    "isEdited": false,
    "readBy": ["usr_005"],
    "createdAt": "2024-12-20T16:45:00Z",
    "updatedAt": "2024-12-20T16:45:00Z"
  }
}
```

#### POST `/api/conversations`
**説明**: 新規会話作成

**リクエスト:**
```json
{
  "type": "group",
  "name": "新春キャンペーンチーム",
  "participants": ["usr_001", "usr_005", "usr_008", "usr_010"]
}
```

**レスポンス:**
```json
{
  "conversation": {
    "id": "cnv_003",
    "type": "group",
    "name": "新春キャンペーンチーム",
    "participants": ["usr_001", "usr_005", "usr_008", "usr_010"],
    "createdBy": "usr_001",
    "createdAt": "2024-12-20T17:00:00Z",
    "updatedAt": "2024-12-20T17:00:00Z"
  }
}
```

### 5.8 通知API

#### GET `/api/notifications`
**説明**: 通知一覧取得

**クエリパラメータ:**
- `isRead`: true | false（未読/既読フィルタ）
- `type`: 'task' | 'approval' | 'message' | 'deadline' | 'mention' | 'system' | 'all'
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス:**
```json
{
  "notifications": [
    {
      "id": "ntf_001",
      "userId": "usr_001",
      "type": "approval",
      "title": "承認リクエスト",
      "message": "新しいアセットの承認が必要です",
      "actionUrl": "/direction/approvals",
      "isRead": false,
      "priority": "high",
      "metadata": {
        "assetId": "ast_002",
        "projectId": "prj_001"
      },
      "createdAt": "2024-12-20T19:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  },
  "unreadCount": 3
}
```

#### PUT `/api/notifications/:notificationId/read`
**説明**: 通知を既読にする

**レスポンス:**
```json
{
  "notification": {
    "id": "ntf_001",
    "isRead": true,
    "readAt": "2024-12-20T22:00:00Z"
  }
}
```

#### PUT `/api/notifications/read-all`
**説明**: すべての通知を既読にする

**レスポンス:**
```json
{
  "success": true,
  "updatedCount": 3
}
```

### 5.9 KPI・レポートAPI

#### GET `/api/kpi/user/:userId`
**説明**: ユーザーKPI取得

**クエリパラメータ:**
- `period`: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）

**レスポンス:**
```json
{
  "kpi": [
    {
      "id": "kpi_001",
      "userId": "usr_001",
      "period": "monthly",
      "date": "2024-12-01T00:00:00Z",
      "metrics": {
        "activeProjects": 8,
        "completedProjects": 3,
        "onTimeDelivery": 95.5,
        "utilization": 87.2,
        "customerSatisfaction": 4.7
      },
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2024-12-20T23:59:59Z"
    }
  ]
}
```

#### GET `/api/kpi/client/:clientId`
**説明**: クライアントKPI取得

**クエリパラメータ:**
- `period`: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）

**レスポンス:**
```json
{
  "kpi": [
    {
      "id": "kpi_002",
      "clientId": "cli_001",
      "period": "monthly",
      "date": "2024-12-01T00:00:00Z",
      "metrics": {
        "followers": 12500,
        "engagement": 4.8,
        "postsPublished": 24,
        "averageLikes": 450,
        "averageComments": 28,
        "reach": 35000,
        "impressions": 52000
      },
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2024-12-31T23:59:59Z"
    }
  ]
}
```

#### GET `/api/reports/sales-pipeline`
**説明**: セールスパイプラインレポート

**クエリパラメータ:**
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）

**レスポンス:**
```json
{
  "report": {
    "period": {
      "startDate": "2024-12-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z"
    },
    "summary": {
      "totalLeads": 45,
      "activeNegotiations": 12,
      "contractedClients": 8,
      "totalRevenue": 2240000,
      "conversionRate": 17.8
    },
    "pipelineStages": [
      {
        "stage": "lead",
        "count": 15,
        "value": 420000
      },
      {
        "stage": "negotiation",
        "count": 12,
        "value": 840000
      },
      {
        "stage": "contracted",
        "count": 8,
        "value": 2240000
      }
    ]
  }
}
```

### 5.10 PALSS AI SYSTEM API

#### POST `/api/ai/proposal`
**説明**: AI提案生成

**リクエスト:**
```json
{
  "clientId": "cli_001",
  "projectType": "instagram-campaign",
  "budget": 500000,
  "duration": 30,
  "goals": ["increase-followers", "boost-engagement"]
}
```

**レスポンス:**
```json
{
  "proposal": {
    "id": "prop_001",
    "clientId": "cli_001",
    "title": "Instagram成長キャンペーン提案",
    "summary": "30日間でフォロワー20%増、エンゲージメント率35%向上を目指す総合キャンペーン",
    "strategy": "...",
    "deliverables": [
      "Instagram Reels: 15本",
      "フィード投稿: 20本",
      "Stories: 毎日1-2本"
    ],
    "timeline": "...",
    "estimatedResults": {
      "followerGrowth": 2500,
      "engagementIncrease": 35,
      "reach": 100000
    },
    "budget": 500000,
    "createdAt": "2024-12-20T23:00:00Z"
  }
}
```

#### POST `/api/ai/research`
**説明**: AI市場調査

**リクエスト:**
```json
{
  "industry": "Beauty & Cosmetics",
  "competitor": "@competitor_account",
  "analysisType": "trend-analysis"
}
```

**レスポンス:**
```json
{
  "research": {
    "id": "res_001",
    "industry": "Beauty & Cosmetics",
    "summary": "...",
    "trends": [
      {
        "name": "スキンケアルーティン動画",
        "growth": 145,
        "popularity": "high"
      }
    ],
    "recommendations": [
      "朝・夜のルーティン動画を週2回投稿",
      "ビフォーアフター写真の活用"
    ],
    "createdAt": "2024-12-20T23:30:00Z"
  }
}
```

#### POST `/api/ai/client-report`
**説明**: AIクライアントレポート生成

**リクエスト:**
```json
{
  "clientId": "cli_001",
  "period": "monthly",
  "date": "2024-12-01"
}
```

**レスポンス:**
```json
{
  "report": {
    "id": "rep_001",
    "clientId": "cli_001",
    "period": "monthly",
    "date": "2024-12-01T00:00:00Z",
    "summary": "12月は素晴らしい成長を遂げました...",
    "kpi": {
      "followers": 12500,
      "followerGrowth": 8.5,
      "engagement": 4.8,
      "topPosts": [
        {
          "url": "https://instagram.com/p/abc123",
          "likes": 850,
          "comments": 45
        }
      ]
    },
    "insights": [
      "Reels投稿のパフォーマンスが特に高い",
      "午後8時の投稿が最もエンゲージメントが高い"
    ],
    "recommendations": [
      "Reels投稿を週3回→週5回に増加",
      "投稿時間を午後8-9時に最適化"
    ],
    "createdAt": "2024-12-20T23:45:00Z"
  }
}
```

---

## 6. リアルタイム通信

### 6.1 WebSocket接続

**接続エンドポイント:**
```
wss://api.palss.com/ws
```

**認証:**
```javascript
// クライアント側
const socket = io('wss://api.palss.com', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### 6.2 イベント一覧

#### クライアント → サーバー

| イベント | 説明 | ペイロード |
|---------|------|-----------|
| `join_conversation` | 会話ルームに参加 | `{ conversationId: string }` |
| `leave_conversation` | 会話ルームから退出 | `{ conversationId: string }` |
| `send_message` | メッセージ送信 | `{ conversationId: string, content: string }` |
| `typing_start` | 入力開始通知 | `{ conversationId: string }` |
| `typing_stop` | 入力停止通知 | `{ conversationId: string }` |
| `mark_as_read` | メッセージ既読 | `{ messageId: string }` |

#### サーバー → クライアント

| イベント | 説明 | ペイロード |
|---------|------|-----------|
| `new_message` | 新規メッセージ | `{ message: Message }` |
| `message_updated` | メッセージ更新 | `{ message: Message }` |
| `message_deleted` | メッセージ削除 | `{ messageId: string }` |
| `user_typing` | ユーザー入力中 | `{ userId: string, conversationId: string }` |
| `notification` | 新規通知 | `{ notification: Notification }` |
| `task_updated` | タスク更新 | `{ task: Task }` |
| `project_updated` | プロジェクト更新 | `{ project: Project }` |
| `asset_uploaded` | アセットアップロード完了 | `{ asset: Asset }` |
| `review_completed` | レビュー完了 | `{ review: Review }` |

### 6.3 実装例

**サーバー側（Node.js + Socket.IO）:**
```typescript
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // ユーザーの個人ルームに参加
  socket.join(`user:${userId}`);
  
  // メッセージ送信
  socket.on('send_message', async (data) => {
    const message = await createMessage(data);
    
    // 会話の参加者全員に送信
    io.to(`conversation:${data.conversationId}`).emit('new_message', { message });
  });
  
  // 通知送信
  function sendNotification(userId: string, notification: Notification) {
    io.to(`user:${userId}`).emit('notification', { notification });
  }
});
```

---

## 7. ファイルストレージ

### 7.1 ストレージ構成

```
s3://palss-storage/
├── avatars/          # ユーザー・クライアントアバター
├── assets/           # プロジェクトアセット（画像・動画）
│   ├── images/
│   ├── videos/
│   └── documents/
├── thumbnails/       # サムネイル画像
├── temp/             # 一時ファイル（24時間で自動削除）
└── exports/          # エクスポートファイル（レポートなど）
```

### 7.2 アップロードフロー

```
1. クライアントが署名付きURLをリクエスト
   POST /api/upload/presigned-url
   Request: { fileName: string, fileType: string, fileSize: number }
   Response: { uploadUrl: string, fileUrl: string, expiresIn: number }

2. クライアントが直接S3にアップロード
   PUT {uploadUrl}
   Body: [ファイルデータ]

3. アップロード完了後、サーバーに通知
   POST /api/upload/confirm
   Request: { fileUrl: string, metadata: {...} }
   Response: { asset: Asset }
```

### 7.3 ファイルサイズ制限

| ファイルタイプ | 最大サイズ |
|---------------|-----------|
| 画像 | 10 MB |
| 動画 | 500 MB |
| ドキュメント | 20 MB |
| アバター | 2 MB |

### 7.4 対応ファイル形式

**画像:**
- JPEG, PNG, GIF, WebP, HEIC

**動画:**
- MP4, MOV, AVI, WebM

**ドキュメント:**
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX

---

## 8. 通知システム

### 8.1 通知トリガー

| イベント | 通知対象 | 通知タイプ |
|---------|---------|-----------|
| タスク割り当て | 担当者 | `task` |
| タスク期限接近（24時間前） | 担当者 | `deadline` |
| レビューリクエスト | レビュアー | `approval` |
| レビュー完了 | プロジェクトオーナー | `approval` |
| メンション | メンションされたユーザー | `mention` |
| 新規メッセージ | 会話参加者 | `message` |
| プロジェクト完了 | クライアント、チームメンバー | `system` |
| 契約更新リマインダー | 営業担当者 | `system` |

### 8.2 通知配信チャネル

1. **アプリ内通知**: すべての通知
2. **メール通知**: 高優先度通知のみ（設定可能）
3. **プッシュ通知**: モバイルアプリ（将来実装）

### 8.3 通知設定API

#### GET `/api/settings/notifications`
**説明**: 通知設定取得

**レスポンス:**
```json
{
  "settings": {
    "email": {
      "tasks": true,
      "approvals": true,
      "messages": false,
      "deadlines": true,
      "mentions": true
    },
    "inApp": {
      "tasks": true,
      "approvals": true,
      "messages": true,
      "deadlines": true,
      "mentions": true
    }
  }
}
```

#### PUT `/api/settings/notifications`
**説明**: 通知設定更新

**リクエスト:**
```json
{
  "email": {
    "messages": false
  }
}
```

**レスポンス:**
```json
{
  "settings": {
    "email": {
      "tasks": true,
      "approvals": true,
      "messages": false,
      "deadlines": true,
      "mentions": true
    }
  }
}
```

---

## 9. セキュリティ要件

### 9.1 認証セキュリティ

- **パスワードポリシー:**
  - 最小8文字
  - 大文字・小文字・数字・記号を含む
  - bcrypt（cost factor: 12）でハッシュ化

- **JWTトークン:**
  - Access Token有効期限: 15分
  - Refresh Token有効期限: 7日
  - HS256またはRS256アルゴリズム

- **セッション管理:**
  - Redisにセッション保存
  - 同時ログイン制限: 5デバイス

### 9.2 APIセキュリティ

- **HTTPS必須**: すべてのAPI通信はHTTPS
- **CORS設定**: 許可されたオリジンのみ
- **Rate Limiting:**
  - 認証エンドポイント: 5リクエスト/分
  - 一般API: 100リクエスト/分
  - アップロード: 10リクエスト/分

- **入力バリデーション:**
  - すべての入力をサニタイズ
  - SQLインジェクション対策
  - XSS対策

### 9.3 データセキュリティ

- **データ暗号化:**
  - 保存時: AES-256暗号化
  - 転送時: TLS 1.3

- **個人情報保護:**
  - メールアドレス、電話番号は暗号化保存
  - パスワードは絶対に平文保存しない
  - 削除リクエストから30日以内に完全削除

- **アクセスログ:**
  - すべてのAPI呼び出しをログ記録
  - ログ保持期間: 90日

### 9.4 ロールベースアクセス制御（RBAC）

| リソース | Admin | Manager | Director | Sales | Editor | Creator | Client |
|---------|-------|---------|----------|-------|--------|---------|--------|
| **Users** | CRUD | R | R | R | R | R | - |
| **Clients** | CRUD | CRUD | CRUD | CRUD | R | R | R（自分のみ） |
| **Projects** | CRUD | CRUD | CRUD | R | CRUD | R | R（自分のみ） |
| **Tasks** | CRUD | CRUD | CRUD | R | CRUD | CRUD | R（自分のみ） |
| **Assets** | CRUD | R | CRUD | R | CRUD | CRUD | R（自分のみ） |
| **Reviews** | CRUD | R | CRUD | - | CRUD | R | R（自分のみ） |
| **KPI** | CRUD | CRUD | R（自分のみ） | R（自分のみ） | R（自分のみ） | R（自分のみ） | R（自分のみ） |
| **Financial** | CRUD | CRUD | - | - | - | - | - |

---

## 10. パフォーマンス要件

### 10.1 レスポンスタイム

| エンドポイントタイプ | 目標レスポンスタイム |
|---------------------|---------------------|
| 認証API | < 200ms |
| 一覧取得API | < 300ms |
| 詳細取得API | < 200ms |
| 作成・更新API | < 500ms |
| ファイルアップロード | < 5秒（10MB） |
| レポート生成 | < 3秒 |

### 10.2 スケーラビリティ

- **同時接続数:** 1,000ユーザー
- **データベース接続プール:** 20-50接続
- **WebSocket接続:** 1,000同時接続

### 10.3 キャッシュ戦略

**Redis キャッシュ:**
- ユーザーセッション: 7日間
- API レスポンス（一覧系）: 5分間
- KPIデータ: 1時間

**CDN キャッシュ:**
- 静的アセット: 1年間
- サムネイル画像: 30日間

### 10.4 データベース最適化

- **インデックス:** すべての外部キーとフィルタ対象カラムにインデックス
- **パーティショニング:** ログテーブルは月次パーティション
- **定期メンテナンス:** 週次でVACUUM ANALYZE実行

---

## 11. エラーハンドリング

### 11.1 標準エラーレスポンス

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-12-20T23:59:59Z"
  }
}
```

### 11.2 エラーコード一覧

| HTTPステータス | エラーコード | 説明 |
|---------------|-------------|------|
| 400 | `VALIDATION_ERROR` | 入力バリデーションエラー |
| 401 | `UNAUTHORIZED` | 認証エラー |
| 403 | `FORBIDDEN` | 権限エラー |
| 404 | `NOT_FOUND` | リソースが見つからない |
| 409 | `CONFLICT` | リソース競合（重複など） |
| 429 | `RATE_LIMIT_EXCEEDED` | レート制限超過 |
| 500 | `INTERNAL_ERROR` | サーバー内部エラー |
| 503 | `SERVICE_UNAVAILABLE` | サービス一時停止 |

---

## 12. 開発環境セットアップ

### 12.1 必要な環境変数

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/palss_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# File Storage
S3_BUCKET=palss-storage
S3_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@palss.com

# App
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 12.2 データベースマイグレーション

```bash
# マイグレーション作成
npm run migration:create -- add_clients_table

# マイグレーション実行
npm run migration:run

# ロールバック
npm run migration:revert
```

### 12.3 シードデータ

```bash
# 開発用サンプルデータ投入
npm run seed:dev
```

---

## 13. テスト要件

### 13.1 テストカバレッジ

- **ユニットテスト:** 80%以上
- **統合テスト:** 主要エンドポイント全て
- **E2Eテスト:** クリティカルパス

### 13.2 テスト実行

```bash
# ユニットテスト
npm run test:unit

# 統合テスト
npm run test:integration

# E2Eテスト
npm run test:e2e

# カバレッジレポート
npm run test:coverage
```

---

## 14. デプロイメント

### 14.1 推奨インフラ構成

```
┌─────────────────┐
│  CloudFlare CDN │
└─────────────────┘
         ↓
┌─────────────────┐
│  Load Balancer  │
└─────────────────┘
         ↓
┌─────────────────┬─────────────────┐
│   App Server 1  │   App Server 2  │
└─────────────────┴─────────────────┘
         ↓                  ↓
┌────────────────────────────────────┐
│      PostgreSQL (Primary)          │
│      + Read Replica                │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│           Redis Cluster            │
└────────────────────────────────────┘
```

### 14.2 CI/CDパイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    - Run tests
    - Check coverage
  
  build:
    - Build Docker image
    - Push to registry
  
  deploy:
    - Deploy to staging
    - Run smoke tests
    - Deploy to production
```

---

## 15. モニタリング・ログ

### 15.1 メトリクス

- **APM:** New Relic / Datadog
- **エラートラッキング:** Sentry
- **ログ集約:** CloudWatch Logs / Elasticsearch

### 15.2 アラート設定

| メトリクス | 閾値 | アクション |
|-----------|------|----------|
| エラーレート | > 5% | Slack通知 |
| レスポンスタイム | > 1秒 | Slack通知 |
| CPU使用率 | > 80% | オートスケール |
| メモリ使用率 | > 85% | オートスケール |
| データベース接続数 | > 90% | Pagerアラート |

---

## 16. APIドキュメント

### 16.1 OpenAPI / Swagger

APIドキュメントはOpenAPI 3.0形式で提供されます。

**アクセス:**
- 開発環境: `http://localhost:3000/api-docs`
- 本番環境: `https://api.palss.com/docs`

### 16.2 Postmanコレクション

Postmanコレクションを提供し、すべてのエンドポイントをテスト可能にします。

**ダウンロード:**
`https://api.palss.com/postman-collection.json`

---

## 17. サポート・連絡先

### 17.1 技術サポート

- **Slackチャンネル:** #palss-backend-dev
- **メール:** dev-support@palss.com
- **ドキュメント:** https://docs.palss.com

### 17.2 定例ミーティング

- **スプリント計画:** 毎週月曜 10:00
- **デイリースタンドアップ:** 毎日 9:30
- **レトロスペクティブ:** 隔週金曜 16:00

---

## 付録A: データベーススキーマ図

```sql
-- Users Table
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  avatar_url VARCHAR(500),
  phone_number VARCHAR(20),
  department VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Clients Table
CREATE TABLE clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  instagram_handle VARCHAR(100),
  industry VARCHAR(100),
  contact_person VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  location VARCHAR(255),
  contract_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  monthly_fee INTEGER NOT NULL DEFAULT 0,
  followers INTEGER,
  engagement DECIMAL(5,2),
  start_date TIMESTAMP,
  assigned_to VARCHAR(50) NOT NULL,
  team_scope VARCHAR(10) NOT NULL DEFAULT 'mine',
  avatar_url VARCHAR(500),
  last_activity TIMESTAMP,
  next_meeting TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE INDEX idx_clients_assigned_to ON clients(assigned_to);
CREATE INDEX idx_clients_contract_status ON clients(contract_status);
CREATE INDEX idx_clients_team_scope ON clients(team_scope);
CREATE INDEX idx_clients_email ON clients(email);

-- Projects Table
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'planning',
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  assigned_director VARCHAR(50) NOT NULL,
  assigned_editor VARCHAR(50),
  assigned_creator VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  due_date TIMESTAMP NOT NULL,
  completed_date TIMESTAMP,
  progress INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (assigned_director) REFERENCES users(id),
  FOREIGN KEY (assigned_editor) REFERENCES users(id),
  FOREIGN KEY (assigned_creator) REFERENCES users(id)
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_assigned_director ON projects(assigned_director);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_due_date ON projects(due_date);

-- Tasks Table
CREATE TABLE tasks (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50),
  client_id VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  assigned_to VARCHAR(50) NOT NULL,
  created_by VARCHAR(50) NOT NULL,
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  attachments TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- 他のテーブルも同様に定義...
```

---

## 付録B: 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0 | 2024-12-20 | 初版作成 |

---

**以上でPALSS SYSTEMバックエンド仕様書は終了です。**

ご質問やフィードバックがございましたら、開発チームまでお気軽にお問い合わせください。
