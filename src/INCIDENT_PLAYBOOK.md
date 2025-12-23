# PALSS SYSTEM — 障害対応Playbook（INCIDENT_PLAYBOOK.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（障害対応用）  
**対象**: SRE、運用担当者、サポート

---

## 🚨 緊急連絡先

| 役割 | 担当者 | 連絡先 | 対応範囲 |
|------|--------|--------|---------|
| **SRE Primary** | - | - | インフラ・DB・Auth |
| **SRE Secondary** | - | - | バックアップ対応 |
| **開発リード** | - | - | コード・ロジック |
| **Supabase Support** | support@supabase.com | - | Supabase障害 |

---

## 📋 障害レベル定義

| レベル | 影響範囲 | 対応時間 | 例 |
|--------|---------|---------|-----|
| **P0（緊急）** | 全ユーザー、業務停止 | 即時 | ログイン不可、全データ0件 |
| **P1（高）** | 一部ユーザー、機能停止 | 1時間以内 | 特定クライアントデータ0件、書き込み不可 |
| **P2（中）** | 軽微な機能障害 | 4時間以内 | Performance劣化、一部データ遅延 |
| **P3（低）** | 個別の不具合 | 24時間以内 | 個別ユーザーのログイン問題 |

---

## 🔥 P0: 緊急障害対応

### P0-1: 全ユーザーログイン不可

**症状**:
- 全ユーザーがログインできない
- QAパネル → Auth → Session Status: "Not authenticated"

**初動（5分）**:

```
□ Supabase Status確認
  → https://status.supabase.com/
  → Supabase障害なら待機（Statusページで復旧見込み確認）

□ Supabase Dashboard → Auth → Settings
  → Email Auth有効か確認
  → 無効化されていれば有効化

□ 環境変数確認（フロントエンド）
  → NEXT_PUBLIC_SUPABASE_URL 正しいか
  → NEXT_PUBLIC_SUPABASE_ANON_KEY 正しいか
```

**調査（15分）**:

```
□ ブラウザコンソール確認
  → Supabase API呼び出しエラー確認
  → 401 Unauthorized → JWT期限切れ（一時的）
  → 403 Forbidden → Anon Key不正
  → 500 Internal Error → Supabase側エラー

□ Supabase Logs確認
  → Dashboard → Logs → Auth Logs
  → エラーメッセージ確認

□ JWT Custom Claims確認
  → ログイン成功ユーザーのJWT Payload確認
  → app_metadata に role/org_id/client_id 含まれるか
```

**対処（30分）**:

```
□ Anon Key再生成（Supabase側問題の場合）
  → Dashboard → Settings → API
  → Anon Key再生成
  → フロントエンド環境変数更新
  → デプロイ

□ Auth Hooks確認（JWT Custom Claims問題の場合）
  → Dashboard → Database → Functions
  → Auth Hook関数実行確認
  → エラーあれば修正・再デプロイ

□ 緊急Mockモード切替（最終手段）
  → QAパネル → Navigator → "Mock Mode"
  → 一時的にLocalStorageのみで運用
  → ユーザーに通知「一時的にオフラインモード」
```

**復旧確認**:

```
□ テストユーザーでログイン試行
□ QAパネル → Auth → Session Status: "Authenticated"
□ 全ロールでログイン確認（sales/direction/client）
□ データ表示確認
□ インシデントレポート作成
```

---

### P0-2: 全データ0件（RLS障害）

**症状**:
- 全ユーザーのデータが0件
- ログインは成功するがデータ表示されない

**初動（5分）**:

```
□ QAパネル → Auth → User Profile確認
  → role/org_id/client_id 表示されているか
  → 空なら JWT Custom Claims問題

□ Supabase → Table Editor → clients（service_roleで）
  → データが存在するか確認
  → 存在しない → データ削除事故
  → 存在する → RLSポリシー問題
```

**調査（15分）**:

```
□ RLS有効化確認
  SELECT tablename, rowsecurity FROM pg_tables 
  WHERE schemaname = 'public';
  → rowsecurity = true か確認

□ RLSポリシー確認
  SELECT * FROM pg_policies WHERE tablename = 'clients';
  → ポリシーが存在するか確認

□ JWT Custom Claims確認
  → ログインユーザーのJWT Payload
  → auth.jwt() ->> 'org_id' で取得できるか
```

**対処（30分）**:

```
□ RLSポリシー再適用
  → rls_final.sql を再実行
  → Supabase SQL Editor

□ JWT Custom Claims修正
  → Auth Hooks or アプリケーション層で設定
  → users テーブルの紐付け確認
  → ユーザー再ログインで反映

□ 一時的RLS無効化（緊急措置のみ）
  ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
  → ユーザーに一時アクセス許可
  → セキュリティリスクあり、早急に有効化
```

**復旧確認**:

```
□ QAパネル → Sync → "Full Pull Now"
□ データ表示確認（各ロール）
□ Consistency Check実行
□ RLS有効化確認（無効化した場合）
□ インシデントレポート作成
```

---

## ⚠️ P1: 高優先度障害対応

### P1-1: 特定クライアントデータ0件

**症状**:
- 特定のクライアントのデータのみ0件
- 他のクライアントは正常

**初動（10分）**:

```
□ 対象クライアントID確認
  → ユーザーから報告されたクライアント名
  → Supabase → Table Editor → clients で検索

□ データ存在確認
  SELECT * FROM tasks WHERE client_id = '<client_id>' AND deleted_at IS NULL;
  → データが存在するか（service_roleで実行）

□ ユーザーロール確認
  → QAパネル → Auth → User Profile
  → client_id が正しく紐付いているか
```

**調査（20分）**:

```
□ RLS権限確認
  → 該当ユーザーでログイン
  → QAパネル → Sync → "Full Pull Now"
  → ブラウザコンソールで403エラー確認

□ users テーブル確認
  SELECT * FROM users WHERE client_id = '<client_id>';
  → client_id紐付け正しいか
  → role = 'client' か確認

□ deleted_at確認
  SELECT COUNT(*) FROM tasks WHERE client_id = '<client_id>';
  → deleted_at IS NULL 条件で再確認
  → 論理削除されている可能性
```

**対処（30分）**:

```
□ users テーブル修正
  UPDATE users SET client_id = '<correct_client_id>' WHERE id = '<user_id>';
  → 紐付け修正

□ deleted_at復元（誤削除の場合）
  UPDATE tasks SET deleted_at = NULL WHERE client_id = '<client_id>' AND deleted_at IS NOT NULL;
  → 慎重に実行（バックアップ確認後）

□ ユーザー再ログイン
  → JWT Custom Claims更新のため
```

**復旧確認**:

```
□ 該当ユーザーでログイン
□ QAパネル → Sync → "Full Pull Now"
□ データ表示確認
□ KPI/アラート計算確認
□ ユーザーに復旧通知
```

---

### P1-2: 書き込み不可（Outbox障害）

**症状**:
- タスク/承認/コメント等の書き込みができない
- Outbox Failed急増

**初動（10分）**:

```
□ QAパネル → Outbox → Failed件数確認
  → 5件以上なら異常

□ "Show Failed"でエラー内容確認
  → Network Error / 403 Forbidden / 422 Validation

□ ネットワーク確認
  → Supabase Status確認
  → ブラウザ開発ツール → Network
```

**調査（20分）**:

```
□ エラー分類：

  【Network Error】
  → Supabase接続問題
  → 一時的な可能性高い

  【403 Forbidden】
  → RLS権限エラー
  → JWT Custom Claims or RLSポリシー問題

  【422 Validation】
  → データ不正
  → 必須カラム不足、外部キー制約違反
```

**対処（30分）**:

```
□ Network Error対処
  → "Retry All Failed"
  → Supabase Status確認（障害なら待機）

□ 403 Forbidden対処
  → RLSポリシー確認
  → ロール権限確認（RBAC表）
  → 権限不足なら修正

□ 422 Validation対処
  → "Show Details"でリクエスト確認
  → 不正データ特定（必須カラムNULL等）
  → データ修正 or "Mark as Permanent Failure"
```

**復旧確認**:

```
□ QAパネル → Outbox → Failed件数 0
□ テスト書き込み（タスク作成等）
□ Supabaseで反映確認
□ ユーザーに通知
```

---

## 🔧 P2: 中優先度障害対応

### P2-1: Performance劣化（>2000ms）

**症状**:
- QAパネル → Performance → Avg Duration が赤色
- 画面の読み込みが遅い

**初動（15分）**:

```
□ QAパネル → Performance → テーブル別Duration確認
  → 最も遅いテーブル特定

□ データ量確認
  → Supabase → Table Editor → 件数確認
  → 1000件超か

□ Incremental比率確認
  → QAパネル → Incremental → Ratio
  → 70%以下なら Full Pull多発
```

**調査（30分）**:

```
□ Supabase Query Performance確認
  → Dashboard → Database → Query Performance
  → Slow Query特定

□ インデックス確認
  SELECT * FROM pg_indexes WHERE tablename = '<table>';
  → org_id, updated_at にインデックスあるか

□ Full Pull頻度確認
  → QAパネル → Incremental → Full Pull Count
  → 10回/日超なら異常
```

**対処（1時間）**:

```
□ インデックス追加
  CREATE INDEX idx_<table>_org_id_updated_at ON <table>(org_id, updated_at);
  → Performance改善

□ Incremental Pull強制
  → QAパネル → Incremental → "Force Incremental"
  → Full Pullを減らす

□ ページング導入（根本対策）
  → API側でlimit/cursor実装
  → フロント側で段階的ロード
```

**復旧確認**:

```
□ QAパネル → Performance → Avg Duration < 500ms
□ 画面読み込み速度確認
□ ユーザー体感確認
```

---

### P2-2: データ同期遅延（autoPull障害）

**症状**:
- 他ユーザーの変更が反映されない
- QAパネル → Incremental → Last Pull が古い（>5分）

**初動（15分）**:

```
□ QAパネル → Incremental → Last Pull確認
  → 5分以上前なら異常

□ "Show Errors"でエラー確認
  → エラーメッセージ確認

□ ブラウザコンソール確認
  → autoPull関連エラー確認
```

**調査（30分）**:

```
□ lastPulledAt確認
  → LocalStorage → autoPullState
  → 正常な値か（ISO 8601形式）

□ since パラメータ確認
  → ブラウザ開発ツール → Network
  → /tasks?since=... のリクエスト確認

□ Supabase Logs確認
  → Dashboard → Logs → API Logs
  → エラーメッセージ確認
```

**対処（30分）**:

```
□ Incremental State Reset
  → QAパネル → Incremental → "Reset Incremental State"
  → lastPulledAt を null にリセット

□ Full Pull実行
  → "Full Pull Now"
  → 最新状態に同期

□ autoPull再起動
  → ページリロード
  → 60秒後、Last Pull更新確認
```

**復旧確認**:

```
□ Last Pull が60秒以内に更新
□ 他ユーザーの変更が反映されるか確認
□ Incremental Ratio > 70%確認
```

---

## 🛠️ P3: 低優先度障害対応

### P3-1: 個別ユーザーログイン問題

**症状**:
- 特定ユーザーのみログインできない
- 他ユーザーは正常

**調査（30分）**:

```
□ Supabase → Auth → Users
  → 該当ユーザー存在確認
  → Email確認

□ users テーブル確認
  SELECT * FROM users WHERE email = '<email>';
  → auth_uid紐付け確認
  → role/org_id/client_id確認

□ パスワードリセット試行
  → Supabase Dashboard → Send Password Reset
```

**対処（1時間）**:

```
□ auth_uid紐付け修正
  UPDATE users SET auth_uid = '<correct_auth_uid>' WHERE email = '<email>';

□ ユーザー再作成（最終手段）
  → Supabase → Auth → Users → Delete
  → 再作成
  → users テーブルにレコード作成
```

**復旧確認**:

```
□ 該当ユーザーでログイン
□ QAパネル → Auth → User Profile確認
□ データ表示確認
```

---

## 📋 インシデント報告テンプレート

### 報告項目

```markdown
# インシデント報告

**日時**: YYYY-MM-DD HH:MM - HH:MM
**レベル**: P0 / P1 / P2 / P3
**影響範囲**: 全ユーザー / 特定クライアント / 個別ユーザー
**担当者**: 

## 症状

- 

## 原因

- 

## 対処内容

- 

## 復旧確認

- [ ] 
- [ ] 

## 再発防止策

- 

## 関連リンク

- 
```

---

## 🔗 関連ドキュメント

- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順
- [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) - バックアップ/復元
- [SECURITY_BASELINE.md](./SECURITY_BASELINE.md) - セキュリティ基準

---

**End of INCIDENT_PLAYBOOK.md**
