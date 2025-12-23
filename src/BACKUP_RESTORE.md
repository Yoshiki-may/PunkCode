# PALSS SYSTEM — バックアップ/復元手順（BACKUP_RESTORE.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（バックアップ/復元）  
**対象**: SRE、運用チーム

---

## 🎯 バックアップ戦略

### 目的

1. **災害復旧**: データ損失時の復元
2. **データ保護**: 誤削除・破損からの保護
3. **コンプライアンス**: 監査要件の充足
4. **テスト環境**: 本番データコピー

---

## 📊 バックアップ方針

### 3層バックアップ

| 層 | 方法 | 頻度 | 保持期間 | 優先度 |
|-----|------|------|---------|--------|
| **Supabase自動** | Supabase Backup | 日次 | 7日間 | P0 |
| **手動Snapshot** | pg_dump | 週次 | 30日間 | P1 |
| **アプリSnapshot** | QAパネル | 日次 | 5個まで | P2 |

---

## 🔄 Supabase自動バックアップ

### 設定

**Supabase Dashboard**:

```
Settings → Backups → Enable Daily Backups
→ Retention: 7 days
```

**対象**:
- 全テーブルデータ
- スキーマ（テーブル定義、インデックス、RLS）
- 認証データ（Supabase Auth）

**除外**:
- ストレージファイル（別途バックアップ必要）

---

### 復元手順（Supabase Dashboard）

**Step 1: バックアップ選択（5分）**:

```
□ Supabase Dashboard → Database → Backups
□ 復元ポイント選択
  - 日時確認
  - データサイズ確認
□ "Restore"ボタンクリック
```

**Step 2: 復元確認（10分）**:

```
□ 復元完了通知を待つ（メール）
□ Table Editorでデータ確認
  - clients: 件数確認
  - tasks: 件数確認
  - users: 件数確認
□ RLS有効化確認
  - 各テーブルのRLS設定確認
```

**Step 3: 動作確認（15分）**:

```
□ ログイン確認（全ロール）
□ データ表示確認
□ Consistency Check実行
□ KPI計算確認
```

**⚠️ 注意**:
- 復元後のデータは**復元ポイント以降が失われる**
- ユーザーに事前通知推奨
- 復元前に現在のスナップショット取得推奨

---

## 💾 手動Snapshot（pg_dump）

### バックアップ実行

**週次実行（日曜深夜）**:

```bash
# pg_dumpでエクスポート
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f backup_$(date +%Y%m%d).dump

# 圧縮
gzip backup_$(date +%Y%m%d).dump

# S3/GCS等へアップロード（推奨）
aws s3 cp backup_$(date +%Y%m%d).dump.gz s3://palss-backups/
```

**対象**:
- 全テーブルデータ
- スキーマ（CREATE TABLE, INDEX, RLS）
- シーケンス

**除外**:
- Supabase内部テーブル（auth.users等）

---

### 復元手順（pg_restore）

**Step 1: ダウンロード（5分）**:

```bash
# S3/GCS等からダウンロード
aws s3 cp s3://palss-backups/backup_20241222.dump.gz .

# 解凍
gunzip backup_20241222.dump.gz
```

**Step 2: 復元（15分）**:

```bash
# 既存データ削除（慎重に）
# ⚠️ 実行前に現在のスナップショット取得推奨
psql -h db.xxx.supabase.co -U postgres -d postgres -c "
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
"

# 復元
pg_restore -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  --no-owner \
  --no-acl \
  backup_20241222.dump

# RLS再有効化
psql -h db.xxx.supabase.co -U postgres -d postgres -f rls_final.sql
```

**Step 3: 動作確認（15分）**:

```
□ Table Editorでデータ確認
□ RLS有効化確認
□ インデックス確認
□ ログイン確認
□ Consistency Check実行
```

---

## 📱 アプリSnapshot（QAパネル）

### Snapshot作成

**手動作成**:

```
1. QAパネル（Ctrl+Shift+D）→ Sync Tab
2. "Create Snapshot"ボタン
3. Name入力: "daily_2024-12-22" or "pre_release_v1.2.0"
4. "Save"クリック
```

**自動作成（推奨）**:

```javascript
// 終業時に自動実行（18:00）
setInterval(() => {
  const now = new Date()
  if (now.getHours() === 18 && now.getMinutes() === 0) {
    createSnapshot(`daily_${now.toISOString().split('T')[0]}`)
  }
}, 60000) // 1分ごとチェック
```

**保存先**: LocalStorage（最大5個まで、古いものは自動削除）

**対象**:
- LocalStorageの全データ
  - clients
  - tasks
  - approvals
  - comments
  - contracts
  - notifications

---

### Snapshot復元

**手順**:

```
1. QAパネル → Sync Tab → "Snapshots"
2. 復元したいSnapshot選択
   - Name: daily_2024-12-22
   - Created: 2024-12-22 18:00:00
   - Size: 1.2 MB
3. "Restore"ボタンクリック
4. 確認ダイアログ → "Restore"
5. 復元完了通知
6. "Full Pull Now"で最新状態に同期
```

**⚠️ 注意**:
- LocalStorageが上書きされる
- Supabase側は影響なし
- 復元後、Full Pullで最新状態に同期推奨

---

## 🚨 緊急復元シナリオ

### シナリオ1: 誤削除（1時間以内）

**症状**: ユーザーがタスク/承認を誤って削除

**復元手順（10分）**:

```
□ QAパネル → Sync → "Snapshots"
□ 直近のSnapshot（例: daily_2024-12-22）選択
□ "Restore"実行
□ 該当データが復元されているか確認
□ "Full Pull Now"で最新状態に同期
```

**データ損失**: Snapshot作成後の変更は失われる（最小限）

---

### シナリオ2: データ破損（RLS誤設定）

**症状**: RLS設定ミスで全データ0件

**復元手順（30分）**:

```
□ Supabase Dashboard → Database → Backups
□ RLS設定前のバックアップ選択
□ "Restore"実行（10分）
□ Table Editorでデータ確認
□ rls_final.sql再実行（正しい設定）
□ 動作確認（全ロール）
□ QAパネル → "Full Pull Now"
```

**データ損失**: バックアップ以降の変更は失われる

---

### シナリオ3: Supabase障害（長期）

**症状**: Supabase完全障害、復旧見込み不明

**復元手順（1時間）**:

```
□ 手動Snapshotから新規Supabaseプロジェクト作成
  - 新規プロジェクト作成
  - pg_restore実行
  - rls_final.sql実行
  
□ 環境変数更新
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  
□ フロントエンドデプロイ
  - 新しいSupabase URLに向ける
  
□ 動作確認
  - ログイン確認
  - データ表示確認
```

**データ損失**: 手動Snapshot作成後の変更は失われる（最大1週間）

---

### シナリオ4: 完全災害（全データ損失）

**症状**: Supabase完全データ損失、バックアップも消失

**復元手順（最終手段）**:

```
□ ユーザーのLocalStorageから復元
  1. 各ユーザーにSnapshot提供依頼
  2. 最新のSnapshotを集約
  3. データマージ（手動 or スクリプト）
  4. Supabaseへ投入
  
□ データ整合性確認
  - 重複排除
  - 外部キー整合性確認
  - Consistency Check実行
```

**データ損失**: 一部データ欠損の可能性あり

---

## 📋 バックアップ検証

### 月次検証（第1営業日）

**手順**:

```
□ Supabase Backupから復元テスト（Staging環境）
  1. Staging Supabaseプロジェクト作成
  2. Production Backupから復元
  3. データ件数確認（Productionと一致）
  4. RLS動作確認
  5. ログイン確認
  
□ 手動Snapshotから復元テスト
  1. 直近の手動Snapshotダウンロード
  2. Staging環境へpg_restore
  3. データ件数確認
  
□ アプリSnapshotから復元テスト
  1. QAパネル → "Snapshots"
  2. 復元テスト（ローカル環境）
  3. データ表示確認
```

**記録**:
- 復元時間（目標: 15分以内）
- データ整合性（目標: 100%）
- 発見された問題

---

## 🗓️ バックアップスケジュール

### 日次

- [ ] Supabase自動バックアップ（深夜2:00）
- [ ] アプリSnapshot作成（終業時18:00）

### 週次

- [ ] 手動Snapshot（pg_dump）（日曜深夜0:00）
- [ ] S3/GCS等へアップロード

### 月次

- [ ] バックアップ検証（第1営業日）
- [ ] 古いバックアップ削除（>30日）

---

## 📊 バックアップ状況確認

### 確認項目

```
□ Supabase Backupステータス
  - Dashboard → Database → Backups
  - 最新バックアップ日時確認
  - 7日分存在確認

□ 手動Snapshotステータス
  - S3/GCS バケット確認
  - 週次バックアップ存在確認
  - 30日分存在確認

□ アプリSnapshotステータス
  - QAパネル → Sync → "Snapshots"
  - 最新5個存在確認
```

---

## ⚠️ バックアップ注意事項

### セキュリティ

- [ ] バックアップファイルは暗号化（AES-256）
- [ ] アクセス権限は最小限（SREのみ）
- [ ] パスワード/APIキーは含めない

### データサイズ

- [ ] バックアップサイズ監視（月次増加率確認）
- [ ] 1GBを超える場合、差分バックアップ検討

### 保持期間

| バックアップ種別 | 保持期間 | 削除方針 |
|----------------|---------|---------|
| Supabase自動 | 7日間 | 自動削除 |
| 手動Snapshot | 30日間 | 手動削除 |
| アプリSnapshot | 5個まで | 古い順に自動削除 |

---

## 📋 復元チェックリスト

### 復元前

- [ ] 影響範囲確認（全ユーザー or 一部ユーザー）
- [ ] ユーザーに通知（メンテナンス予告）
- [ ] 現在のスナップショット取得（ロールバック用）

### 復元中

- [ ] バックアップ選択（日時確認）
- [ ] 復元実行
- [ ] 進捗監視

### 復元後

- [ ] データ件数確認（期待値と一致）
- [ ] RLS有効化確認
- [ ] ログイン確認（全ロール）
- [ ] Consistency Check実行
- [ ] KPI計算確認
- [ ] ユーザーに通知（復旧完了）

---

## 🔗 関連ドキュメント

- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順
- [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) - 障害対応
- [migration_notes.md](./migration_notes.md) - データ移行手順

---

**End of BACKUP_RESTORE.md**
