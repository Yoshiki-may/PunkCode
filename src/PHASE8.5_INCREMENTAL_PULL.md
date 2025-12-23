# Phase 8.5: Incremental Pull（差分取得）実装仕様

## 📋 実装ステータス
**Phase 8.5準備完了** — 設計・インターフェース完成、実装は段階的に投入

---

## 🎯 目的

既存UIを一切変更せず、supabaseモードのautoPullを「全件取得（Full Pull）」から「差分取得（Incremental Pull）」へ移行し、取得量・時間を劇的に削減する。

---

## 📐 設計概要

### 基本方針

1. **初回: Full Pull（全件取得）**
   - `lastPulledAt = null` の場合
   - 全データを取得してLocalStorageに保存
   - 成功時に `lastPulledAt` を更新

2. **2回目以降: Incremental Pull（差分取得）**
   - `updated_at > lastPulledAt` で差分のみ取得
   - 既存データとマージ（id主キーでupsert）
   - 成功時のみ `lastPulledAt` を更新

3. **失敗時**
   - `lastPulledAt` を更新しない
   - 次回autoPullで再試行

### 対象テーブル

| テーブル | 差分キー | 備考 |
|----------|----------|------|
| clients | updated_at | 更新日時 |
| tasks | updated_at | 更新日時 |
| approvals | updated_at | 更新日時 |
| comments | created_at | 作成日時（updated_atなし） |
| contracts | updated_at | 更新日時 |
| notifications | created_at | 作成日時（updated_atなし） |

---

## 🗂️ 状態保存形式

### LocalStorageキー

```
palss_autopull_state_v1
```

### データ構造

```typescript
interface TablePullState {
  lastPulledAt: string | null; // 最後に差分取得した時刻（ISO 8601）
  lastFullPulledAt: string | null; // 最後に全件取得した時刻（ISO 8601）
  lastError?: string; // 最後のエラー
}

interface AutoPullState {
  tables: {
    clients: TablePullState;
    tasks: TablePullState;
    approvals: TablePullState;
    comments: TablePullState;
    contracts: TablePullState;
    notifications: TablePullState;
  };
}
```

### 例

```json
{
  "tables": {
    "clients": {
      "lastPulledAt": "2024-12-22T12:34:56.789Z",
      "lastFullPulledAt": "2024-12-22T10:00:00.000Z"
    },
    "tasks": {
      "lastPulledAt": "2024-12-22T12:34:56.789Z",
      "lastFullPulledAt": "2024-12-22T10:00:00.000Z"
    },
    ...
  }
}
```

---

## 🔧 Repository Interface拡張

### IncrementalPullOptions

```typescript
export interface IncrementalPullOptions {
  since?: string; // updated_at or created_at の境界値（ISO 8601）
  limit?: number; // 1回の取得上限
}

export interface IncrementalPullResult<T> {
  items: T[];
  hasMore: boolean; // まだ取得すべきデータがあるか
  latestTimestamp?: string; // 取得した中で最新のタイムスタンプ
}
```

### Repositoryメソッド追加

各Repositoryインターフェースに以下のメソッドを追加：

```typescript
// ITaskRepository
getTasksIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Task>>;

// IApprovalRepository
getApprovalsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Approval>>;

// ICommentRepository
getCommentsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Comment>>;

// IContractRepository
getContractsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Contract>>;

// INotificationRepository
getNotificationsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Notification>>;

// IClientRepository
getClientsIncremental(options?: IncrementalPullOptions): Promise<IncrementalPullResult<Client>>;
```

---

## 🔄 差分取得クエリ（Supabase）

### tasksテーブル例

```sql
-- Full Pull（初回）
SELECT * FROM tasks
ORDER BY updated_at ASC;

-- Incremental Pull（2回目以降）
SELECT * FROM tasks
WHERE updated_at > '2024-12-22T12:00:00.000Z'
ORDER BY updated_at ASC;
```

### RLS準拠

- Supabase RLSにより、自動的に `org_id` が絞り込まれる
- Clientロールは自社データのみ取得される
- 差分取得でもRLSは適用される

---

## 🔀 マージ処理（LocalStorage）

### id主キーでupsert

```typescript
function mergeData<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const merged = new Map<string, T>();
  
  // 既存データを格納
  existing.forEach(item => merged.set(item.id, item));
  
  // 新規データで上書き（updated_atが新しい方を優先）
  incoming.forEach(item => {
    const existingItem = merged.get(item.id);
    if (!existingItem || isNewer(item, existingItem)) {
      merged.set(item.id, item);
    }
  });
  
  return Array.from(merged.values());
}

function isNewer(a: any, b: any): boolean {
  const aTime = a.updatedAt || a.createdAt;
  const bTime = b.updatedAt || b.createdAt;
  return aTime > bTime;
}
```

### 競合解決ルール

1. **updated_atが存在する場合**: 新しい方を優先
2. **updated_atが存在しない場合**: Supabase側（incoming）を優先
3. **削除の伝搬**: Phase 8.5では対応しない（Phase 8.6で対応）

---

## ⚡ 想定効果

### 前提条件

- データ量: clients=500, tasks=10,000, approvals=5,000, comments=20,000, contracts=2,000
- autoPull間隔: 60秒
- 1分間の更新件数: 約10-50件（全体の0.01-0.25%）

### Phase 8（インデックスのみ）

| 操作 | 時間 | 取得件数 |
|------|------|----------|
| autoPull（全件） | 1600-4300ms | 37,500件 |

### Phase 8.5（差分取得）

| 操作 | 時間 | 取得件数 | 改善率 |
|------|------|----------|--------|
| autoPull（初回・全件） | 1600-4300ms | 37,500件 | - |
| autoPull（差分） | 50-200ms | 10-50件 | 95-98% |

**想定改善**:
- 取得件数: 99.9%削減（37,500件 → 10-50件）
- 実行時間: 97-98%短縮（2,000ms → 50-200ms）
- ネットワーク負荷: 99.9%削減

---

## 📝 実装ステップ

### Step 1: autoPull状態管理 ✅ 完了

**ファイル**: `/utils/autoPullState.ts`

**機能**:
- テーブル別lastPulledAt保存・取得
- 状態リセット
- Full Pull判定

### Step 2: Repository Interface拡張 ✅ 完了

**ファイル**: `/repositories/interfaces.ts`

**機能**:
- IncrementalPullOptions型定義
- IncrementalPullResult型定義
- 各Repository interfaceに getXXXIncremental 追加

### Step 3: SupabaseRepository実装 🔧 準備中

**ファイル**: `/repositories/SupabaseRepository.ts`

**実装予定**:
- 各RepositoryクラスにgetXXXIncrementalメソッド実装
- updated_at / created_at 判定
- RLS準拠クエリ
- limit / hasMore 対応

### Step 4: autoPull差分取得対応 🔧 準備中

**ファイル**: `/utils/autoPull.ts`

**実装予定**:
```typescript
// 擬似コード
async function pullTable(tableName, repo) {
  const lastPulledAt = getLastPulledAt(tableName);
  
  if (!lastPulledAt) {
    // Full Pull
    const data = await repo.getAllXXX();
    storage.set(KEY, data);
    setLastFullPulledAt(tableName, new Date().toISOString());
  } else {
    // Incremental Pull
    const result = await repo.getXXXIncremental({ since: lastPulledAt });
    const existing = storage.get(KEY) || [];
    const merged = mergeData(existing, result.items);
    storage.set(KEY, merged);
    
    if (result.latestTimestamp) {
      setLastPulledAt(tableName, result.latestTimestamp);
    }
  }
}
```

### Step 5: QAパネルDEV機能 🔧 準備中

**ファイル**: `/components/dev/PerformanceTab.tsx`

**追加機能**:
- Full Pull / Incremental Pull の種別表示
- テーブル別lastPulledAt表示
- "Full Pull Now"ボタン（全件取得強制）
- "Reset State"ボタン（状態リセット）

### Step 6: テスト・検証 🔧 未実施

**テストケース**:
1. 初回Full Pullが成功する
2. 2回目以降がIncremental Pullになる
3. 差分データが正しくマージされる
4. エラー時にlastPulledAtが進まない
5. RLSが正しく動作する

---

## 🎯 受入基準

### 機能要件

1. ✅ 初回autoPullでFull Pull（全件取得）
2. 🔧 2回目以降autoPullでIncremental Pull（差分取得）
3. 🔧 取得件数と時間が大幅に削減（95-98%）
4. 🔧 LocalStorageキャッシュが正しくマージされる
5. 🔧 エラー時にlastPulledAtが進まない
6. ✅ UI変更ゼロ

### パフォーマンス要件

| 指標 | 目標 | 計測方法 |
|------|------|----------|
| 差分Pull時間 | <200ms | Performanceタブ |
| 差分Pull取得件数 | <100件 | Performanceタブ |
| 初回Pull時間 | <3000ms | Performanceタブ |

### 互換性要件

1. ✅ mockモード: 従来通り動作（Full Pullのみ）
2. 🔧 supabaseモード: Incremental Pull対応
3. ✅ RLS: Clientロールで自社データのみ取得
4. ✅ 既存LocalStorage構造: 維持

---

## 🔍 トラブルシューティング

### Q1: 差分取得で取りこぼしが発生する

**原因**: 
- lastPulledAtの更新タイミングが早すぎる
- ネットワーク遅延により、一部データが取得できていない

**解決**:
- lastPulledAtを「取得結果の最大updated_at」に設定
- エラー時はlastPulledAtを更新しない
- リトライロジック追加

### Q2: マージ処理で古いデータが残る

**原因**:
- updated_atが存在しない
- 競合解決ルールが不適切

**解決**:
- updated_atがないテーブルはcreated_atを使用
- Supabase側（新規データ）を優先

### Q3: パフォーマンスが改善しない

**原因**:
- データ更新頻度が高すぎる
- インデックスが未作成
- RLSが重い

**解決**:
- Phase 8のインデックス適用確認
- autoPull間隔を調整（60秒 → 120秒）
- RLSポリシー見直し

### Q4: Incremental Pullが動作しない

**原因**:
- SupabaseRepositoryにgetXXXIncrementalが未実装
- mockモードで動作している

**解決**:
- dataMode = supabase確認
- SupabaseRepository実装確認
- エラーログ確認

---

## 📊 計測項目

### Performanceタブ追加項目

| 項目 | 説明 |
|------|------|
| Pull Type | Full / Incremental |
| Last Pulled At | テーブル別最終取得時刻 |
| Incremental Count | 差分取得件数 |
| Full Count | 全件取得件数 |
| Time Saved | 短縮時間（推定） |

---

## 🚀 実装優先度

### ⭐⭐⭐ High（必須）

1. ✅ autoPullState.ts（状態管理）
2. ✅ Repository Interfaceビット（getXXXIncremental）
3. 🔧 SupabaseRepository実装（getXXXIncremental）
4. 🔧 autoPull.ts差分取得対応
5. 🔧 マージ処理実装

### ⭐⭐ Medium（推奨）

6. 🔧 QAパネル可視化（Full/Incremental表示）
7. 🔧 テスト・検証
8. 🔧 エラーハンドリング強化

### ⭐ Low（オプション）

9. 削除の伝搬（deleted_at方式）
10. リトライロジック
11. バックグラウンド同期

---

## 📁 関連ファイル

### ✅ 作成済み

```
/utils/autoPullState.ts
/repositories/interfaces.ts（拡張）
```

### 🔧 変更予定

```
/utils/autoPull.ts
/repositories/SupabaseRepository.ts
/components/dev/PerformanceTab.tsx
```

### 📖 ドキュメント

```
/PHASE8.5_INCREMENTAL_PULL.md
```

---

## 🎉 まとめ

Phase 8.5の**設計・インターフェース**が完成しました。

**達成したこと**:
1. ✅ Incremental Pull設計完成
2. ✅ 状態管理実装（autoPullState.ts）
3. ✅ Repository Interface拡張
4. ✅ 仕様ドキュメント完成

**次のアクション**:
1. SupabaseRepository実装（getXXXIncremental）
2. autoPull.ts差分取得対応
3. マージ処理実装
4. テスト・検証
5. QAパネル可視化

**想定効果**:
- 取得件数: 99.9%削減
- 実行時間: 97-98%短縮
- ネットワーク負荷: 99.9%削減

---

**実装完了**: 設計・インターフェース (2024-12-22)  
**Phase**: 8.5 (Incremental Pull - Design)  
**Status**: 🔧 **READY FOR IMPLEMENTATION**

---

## 📖 実装ガイド

### 段階的実装推奨順序

1. **Phase 8.5.1**: SupabaseRepository実装
   - 各getXXXIncrementalメソッド実装
   - テーブル別差分キー判定（updated_at / created_at）

2. **Phase 8.5.2**: autoPull差分取得対応
   - shouldFullPull判定
   - Full Pull / Incremental Pull分岐
   - lastPulledAt更新

3. **Phase 8.5.3**: マージ処理
   - id主キーupsert
   - updated_at競合解決
   - 既存LocalStorage構造維持

4. **Phase 8.5.4**: QAパネル可視化
   - Full/Incremental種別表示
   - テーブル別状態表示
   - DEV専用ボタン追加

5. **Phase 8.5.5**: テスト・検証
   - 受入テスト実施
   - パフォーマンス計測
   - RLS動作確認

---

**以上でPhase 8.5設計ドキュメントは終了です。**
