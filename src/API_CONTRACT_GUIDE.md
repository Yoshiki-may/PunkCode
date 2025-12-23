# PALSS SYSTEM API契約 — 使い方ガイド

**ドキュメント**: `/API_CONTRACT.md`, `/openapi.yaml`  
**対象読者**: バックエンドエンジニア、フロントエンドエンジニア、QA  
**目的**: API契約の使い方、実装方針、テスト方法を理解する

---

## 📖 ドキュメント構成

### 1. `/API_CONTRACT.md` — 人間向け契約書

**内容**:
- 概要（基本方針、リソース一覧）
- 認証・認可（JWT、RLS）
- 共通仕様（エラーフォーマット、ページング、検索）
- エンドポイント詳細（全6リソース）
- スキーマ定義（Request/Response）
- RBAC・認可（ロール別権限表）
- ユースケース別APIシーケンス（3本）
- Realtime/Webhook方針
- 未決事項（6項目）

**用途**: 実装の設計書、レビュー資料、意思決定資料

---

### 2. `/openapi.yaml` — 機械可読仕様

**内容**:
- OpenAPI 3.0.3準拠
- 全エンドポイント定義
- 全スキーマ定義
- 認証（Bearer Auth）
- エラーレスポンス

**用途**: コード生成、APIドキュメント生成、テストツール連携

---

## 🚀 バックエンド実装の流れ

### ステップ1: OpenAPI仕様の確認（1日）

1. `/openapi.yaml`を開く
2. Swagger EditorまたはVS Code拡張でプレビュー
3. エンドポイント・スキーマを確認

**ツール**:
- [Swagger Editor](https://editor.swagger.io/)
- [VS Code拡張: OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)

---

### ステップ2: コード生成（推奨、1日）

**OpenAPI Generatorでサーバースタブ生成**:

```bash
# Node.js/Express
openapi-generator-cli generate \
  -i openapi.yaml \
  -g nodejs-express-server \
  -o ./backend

# Python/FastAPI
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python-fastapi \
  -o ./backend

# Go/Gin
openapi-generator-cli generate \
  -i openapi.yaml \
  -g go-gin-server \
  -o ./backend
```

**手動実装の場合**:
- `/API_CONTRACT.md`のエンドポイント詳細を参照
- ルーティング・ハンドラーを実装

---

### ステップ3: 認証・認可実装（2-3日）

#### Supabase Auth統合

**JWT検証**:
```javascript
// Node.js/Express例
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing authorization token'
      }
    })
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token'
      }
    })
  }
  
  // JWT Custom Claimsから取得
  req.user = {
    id: user.id,
    email: user.email,
    role: user.app_metadata.role,
    org_id: user.app_metadata.org_id,
    client_id: user.app_metadata.client_id
  }
  
  next()
}
```

#### RLS実装

**Supabase RLSポリシー**:
```sql
-- tasks テーブル（社内ロール）
CREATE POLICY "tasks_org_access" ON tasks
  FOR ALL
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

#### ロール別権限チェック

**Middleware例**:
```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You don\'t have permission to access this resource',
          details: {
            required_role: allowedRoles,
            your_role: req.user.role
          }
        }
      })
    }
    next()
  }
}

// 使用例
app.post('/clients', authenticateJWT, requireRole('sales', 'control'), createClient)
```

---

### ステップ4: エンドポイント実装（3-5日）

#### GET /tasks（例）

```javascript
app.get('/tasks', authenticateJWT, async (req, res) => {
  try {
    const { limit = 50, cursor, since, client_id, status } = req.query
    
    let query = supabase
      .from('tasks')
      .select('*')
      .limit(parseInt(limit))
    
    // RLS自動適用（org_id or client_id）
    
    // フィルタ
    if (since) {
      query = query.gt('updated_at', since)
    }
    if (client_id) {
      query = query.eq('client_id', client_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
    
    // ページング（cursorがあれば適用）
    if (cursor) {
      const decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString())
      query = query.gt('id', decodedCursor.id)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // 次ページのカーソル生成
    const nextCursor = data.length === parseInt(limit)
      ? Buffer.from(JSON.stringify({ id: data[data.length - 1].id })).toString('base64')
      : null
    
    res.json({
      data,
      meta: {
        total: data.length,
        next_cursor: nextCursor,
        has_more: !!nextCursor,
        latest_timestamp: data.length > 0
          ? data.reduce((max, item) => item.updated_at > max ? item.updated_at : max, data[0].updated_at)
          : null
      }
    })
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    })
  }
})
```

#### POST /tasks（例）

```javascript
app.post('/tasks', authenticateJWT, requireRole('sales', 'direction', 'editor', 'creator', 'support'), async (req, res) => {
  try {
    const { title, description, client_id, status = 'not_started', assignee_id, due_date, post_date } = req.body
    
    // バリデーション
    if (!title || !client_id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'title and client_id are required'
        }
      })
    }
    
    // タスク作成
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        client_id,
        status,
        assignee_id,
        due_date,
        post_date,
        org_id: req.user.org_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (taskError) throw taskError
    
    // 通知作成（担当者宛）
    if (assignee_id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: assignee_id,
          type: 'task_due',
          title: 'タスク割り当て',
          message: `タスク「${title}」が割り当てられました`,
          read: false,
          related_client_id: client_id,
          related_item_id: task.id,
          related_item_type: 'task',
          created_at: new Date().toISOString()
        })
    }
    
    res.status(201).json({ data: task })
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    })
  }
})
```

---

### ステップ5: テスト（3-5日）

#### APIテスト（Postman/Insomnia）

1. OpenAPI仕様をインポート
2. 認証トークン設定
3. 各エンドポイントをテスト

**Postman Collection生成**:
```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g postman-collection \
  -o ./tests
```

#### 受入テスト（TC1-TC9）

`/PALSS_SYSTEM_SSOT.md`の受入テストを参照して実施

---

## 🔧 フロントエンド実装の流れ

### ステップ1: APIクライアント生成（推奨、1日）

**TypeScript/Axios Client生成**:
```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./frontend/src/api
```

**手動実装の場合**:
```typescript
// api/client.ts
import axios from 'axios'
import { supabase } from './supabase'

const apiClient = axios.create({
  baseURL: 'https://api.palss.example.com/v1',
  timeout: 10000
})

// リクエストインターセプター（認証トークン自動付与）
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ログアウト処理
      supabase.auth.signOut()
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

---

### ステップ2: API関数実装（2-3日）

```typescript
// api/tasks.ts
import apiClient from './client'
import { Task, TaskCreateRequest, TaskUpdateRequest } from './types'

export const tasksApi = {
  // タスク一覧取得
  async getTasks(params?: {
    limit?: number
    cursor?: string
    since?: string
    client_id?: string
    status?: 'not_started' | 'in_progress' | 'completed'
  }) {
    const { data } = await apiClient.get<{
      data: Task[]
      meta: { total: number; next_cursor?: string; has_more: boolean }
    }>('/tasks', { params })
    return data
  },

  // タスク作成
  async createTask(task: TaskCreateRequest) {
    const { data } = await apiClient.post<{ data: Task }>('/tasks', task)
    return data.data
  },

  // タスク更新
  async updateTask(taskId: string, updates: TaskUpdateRequest) {
    const { data } = await apiClient.patch<{ data: Task }>(`/tasks/${taskId}`, updates)
    return data.data
  }
}
```

---

### ステップ3: Incremental Pull統合（1-2日）

```typescript
// utils/autoPull.ts（既存）を更新
import { tasksApi } from '../api/tasks'
import { getLastPulledAt, setLastPulledAt } from './autoPullState'

async function pullTasksIncremental() {
  const since = getLastPulledAt('tasks')
  
  if (!since) {
    // Full Pull
    const { data, meta } = await tasksApi.getTasks({ limit: 500 })
    localStorage.setItem('tasks', JSON.stringify(data))
    
    if (meta.latest_timestamp) {
      setLastPulledAt('tasks', meta.latest_timestamp)
    }
    
    return data.length
  } else {
    // Incremental Pull
    const { data, meta } = await tasksApi.getTasks({ since, limit: 500 })
    
    if (data.length > 0) {
      // マージ
      const existing = JSON.parse(localStorage.getItem('tasks') || '[]')
      const merged = mergeByIdWithUpdatedAt(existing, data)
      localStorage.setItem('tasks', JSON.stringify(merged))
      
      if (meta.latest_timestamp) {
        setLastPulledAt('tasks', meta.latest_timestamp)
      }
    }
    
    return data.length
  }
}
```

---

## 📊 よくある質問（FAQ）

### Q1: 認証トークンの取得方法は？

**A**: Supabase Auth使用:
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const token = data.session.access_token
```

---

### Q2: Incremental Pullの`since`パラメータは必須ですか？

**A**: いいえ、省略可能です。省略時はFull Pull（全件取得）になります。

---

### Q3: ページングのカーソルはどう扱いますか？

**A**: レスポンスの`meta.next_cursor`を次回リクエストの`cursor`パラメータに渡します。

---

### Q4: エラーハンドリングのベストプラクティスは？

**A**:
- 401: ログアウト処理
- 403: 権限エラーメッセージ表示
- 404: リソースなしメッセージ表示
- 500: 汎用エラーメッセージ表示、リトライ

---

### Q5: RLSで他社データが見える場合は？

**A**: JWT Custom Claimsの`org_id`/`client_id`が正しく設定されているか確認してください。

---

### Q6: KPIとアラートはAPIで取得しますか？

**A**: 未決事項です。現状はフロント計算、Phase 11でサーバー計算API追加を検討中。

---

## ✅ 実装チェックリスト

### バックエンド

- [ ] OpenAPI仕様確認
- [ ] コード生成（推奨）
- [ ] 認証・認可実装（JWT検証、RLS）
- [ ] 全エンドポイント実装（6リソース × CRUD）
- [ ] Incremental Pull対応（`since`パラメータ）
- [ ] ページング実装（Cursor方式）
- [ ] エラーハンドリング（共通フォーマット）
- [ ] 通知自動生成（タスク/承認/コメント作成時）
- [ ] APIテスト（Postman/Insomnia）
- [ ] 受入テスト（TC1-TC9）

### フロントエンド

- [ ] APIクライアント生成（推奨）
- [ ] 認証トークン自動付与（Interceptor）
- [ ] API関数実装（全6リソース）
- [ ] Incremental Pull統合（autoPull.ts更新）
- [ ] エラーハンドリング（401/403/404/500）
- [ ] ローディング状態管理
- [ ] 受入テスト（TC1-TC9）

---

## 🎯 次のアクション

1. **バックエンド**: `/openapi.yaml`でコード生成 → 実装開始
2. **フロントエンド**: APIクライアント生成 → Incremental Pull統合
3. **QA**: 受入テスト（TC1-TC9）実施

---

**Happy Coding! 🚀**
