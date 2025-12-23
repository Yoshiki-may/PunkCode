# PALSS SYSTEM — 運用手順書（OPS_RUNBOOK.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（本番運用用）  
**対象**: 運用担当者、SRE、サポート

---

## 🚨 緊急時5分手順（深夜対応版）

### 症状別クイックリンク

| 症状 | 確認箇所 | 対処 |
|------|---------|------|
| **ログインできない** | QA → Auth → Session Status | → [Auth障害](#auth障害) |
| **データが0件** | QA → Sync → Consistency Check | → [RLS障害](#rls障害) |
| **データが古い** | QA → Incremental → Last Pull | → [Sync障害](#sync障害) |
| **書き込みが反映されない** | QA → Outbox → Failed | → [Outbox障害](#outbox障害) |
| **画面が重い** | QA → Performance → Avg Duration | → [Performance劣化](#performance劣化) |

### 最速復旧手順（3ステップ）

```
1. QAパネル（Ctrl+Shift+D）を開く
2. Syncタブ → "Full Pull Now" をクリック
3. 改善しない場合 → "Snapshot Restore"（最新）を選択
```

---

## 📋 目次

1. [日常運用](#日常運用)
2. [定期メンテナンス](#定期メンテナンス)
3. [監視項目](#監視項目)
4. [アラート対応](#アラート対応)
5. [データ整合性確認](#データ整合性確認)
6. [ユーザーサポート](#ユーザーサポート)
7. [トラブルシューティング](#トラブルシューティング)

---

## 📅 日常運用

### 始業時チェック（5分）

**毎朝9:00実施**:

- [ ] QAパネル → Auth → Session Status確認（緑色＝正常）
- [ ] QAパネル → Outbox → Failed件数確認（0件が理想）
- [ ] QAパネル → Performance → Avg Duration確認（<500msが理想）
- [ ] QAパネル → Incremental → Last Pull確認（直近60秒以内）
- [ ] Supabase Dashboard → Auth → Active Users確認

**異常検知時**:
- Failed > 0: Outbox Retryを実行 → [Outbox障害](#outbox障害)
- Avg Duration > 2000ms: Performance Tabで詳細確認 → [Performance劣化](#performance劣化)

---

### 終業時チェック（3分）

**毎日18:00実施**:

- [ ] Outbox Failed件数確認（0件にする）
- [ ] Permanent Failure確認（理由記録、必要なら手動修正）
- [ ] Syncタブ → Snapshot作成（日次バックアップ）

---

## 🔄 定期メンテナンス

### 週次（月曜10:00）

**データ整合性チェック**:

```
1. QAパネル → Sync → Consistency Check実行
2. 不整合があれば：
   - "Show Details"で詳細確認
   - LocalStorage/Supabaseどちらが正か判断
   - "Resolve Conflicts"で解決
```

**Outboxクリーンアップ**:

```
1. QAパネル → Outbox
2. Permanent Failure確認
   - 理由が妥当なら "Clear Permanent Failures"
   - 不明な場合は調査後に対処
```

---

### 月次（第1営業日）

**パフォーマンスレビュー**:

```
1. QAパネル → Performance
2. 各テーブルのAvg Duration確認
3. 2000ms超が増えていれば：
   - データ量増大が原因か確認
   - インデックス追加検討
   - Incremental Pullの最適化検討
```

**ストレージ確認**:

```
1. Supabase Dashboard → Database → Storage
2. 80%超えていれば：
   - 論理削除データの物理削除検討（deleted_at < 90日前）
   - Notification古いデータ削除（created_at < 90日前）
```

**監査ログレビュー（Control権限必要）**:

```
1. Supabase → SQL Editor
2. SELECT * FROM activity_log WHERE created_at > now() - interval '30 days'
3. 不審な操作がないか確認：
   - 深夜のデータ変更
   - Clientロールでの異常アクセス
   - 大量削除操作
```

---

## 📊 監視項目

### リアルタイム監視（QAパネル）

**Performance Tab**:

| 項目 | 正常 | 警告 | 危険 |
|------|------|------|------|
| Avg Duration | <500ms | 500-2000ms | >2000ms |
| Last Pull | <60秒前 | 60-300秒前 | >300秒前 |

**Outbox Tab**:

| 項目 | 正常 | 警告 | 危険 |
|------|------|------|------|
| Failed | 0件 | 1-5件 | >5件 |
| Pending | <10件 | 10-50件 | >50件 |
| Permanent Failure | 0件 | 1-3件 | >3件 |

**Incremental Tab**:

| 項目 | 正常 | 警告 | 危険 |
|------|------|------|------|
| Incremental Ratio | >90% | 70-90% | <70% |
| Full Pull Count | <5回/日 | 5-10回/日 | >10回/日 |

---

### Supabase Dashboard監視

**Auth（毎日確認）**:

- Active Users: 予想ユーザー数と一致しているか
- 401/403エラー: 急増していないか

**Database（週次確認）**:

- Storage: 80%以下か
- Connections: 最大接続数の50%以下か
- Query Performance: Slow Queryがないか

---

## 🚨 アラート対応

### アラート1: Outbox Failed急増（>5件）

**症状**: QAパネル → Outbox → Failed件数が5件以上

**対応手順**:

```
1. QAパネル → Outbox → "Show Failed"
2. エラー内容確認：
   - Network Error → 一時的、Retryで解決
   - 403 Forbidden → RLS権限エラー、要調査
   - 422 Validation → データ不正、要修正
3. "Retry All Failed"実行
4. 再度Failedなら個別調査：
   - "Show Details"でリクエスト内容確認
   - Supabase Logsで詳細エラー確認
5. 修正不可なら "Mark as Permanent Failure"
```

---

### アラート2: autoPull連続失敗（3回以上）

**症状**: QAパネル → Incremental → Error Countが3以上

**対応手順**:

```
1. QAパネル → Incremental → "Show Errors"
2. エラー内容確認：
   - Network Error → Supabase接続確認
   - 401 Unauthorized → Session切れ、再ログイン
   - 500 Internal Error → Supabase Status確認
3. "Reset Incremental State"実行
4. "Full Pull Now"実行
5. 改善しない場合 → [Sync障害](#sync障害)
```

---

### アラート3: Performance劣化（Avg Duration > 2000ms）

**症状**: QAパネル → Performance → Avg Durationが赤色

**対応手順**:

```
1. QAパネル → Performance → テーブル別Duration確認
2. 最も遅いテーブル特定
3. データ量確認：
   - 1000件超 → Incremental Pull推奨
   - 5000件超 → ページング検討
4. Supabase Dashboard → Database → Query Performance
5. Slow Queryがあれば：
   - インデックス追加検討
   - WHERE句最適化検討
6. 一時対処：
   - QAパネル → Incremental → "Force Incremental"
   - Full Pullを減らす
```

---

## ✅ データ整合性確認

### Consistency Check（週次）

**手順**:

```
1. QAパネル → Sync → "Run Consistency Check"
2. 結果確認：
   - ✅ All tables consistent → 正常
   - ⚠️ Conflicts detected → 以下へ進む
3. "Show Details"で詳細確認：
   - LocalStorage only: Supabaseにない（未送信 or 削除済み）
   - Supabase only: LocalStorageにない（未Pull）
   - Mismatch: updated_atが異なる
4. 解決方針：
   - 原則：Supabaseが正
   - LocalStorage側を上書き推奨
5. "Resolve Conflicts" → "Pull from Supabase"選択
```

---

### Snapshot管理

**作成タイミング**:
- 日次（終業時）
- リリース前
- 大量データ変更前

**手順**:

```
1. QAパネル → Sync → "Create Snapshot"
2. Name: "daily_2024-12-22" or "pre_release_v1.2.0"
3. 保存先: LocalStorage（制限: 5個まで、古いものは自動削除）
```

**復元手順**:

```
1. QAパネル → Sync → "Snapshots"
2. 復元したいスナップショット選択
3. "Restore"クリック
4. 確認ダイアログ → "Restore"
5. 完了後、Full Pullで最新状態に同期
```

---

## 🙋 ユーザーサポート

### よくある問い合わせ

#### Q1: データが表示されない

**確認手順**:

```
1. ロールとクライアントID確認：
   - QAパネル → Auth → User Profile
   - role=client → client_id が正しいか
2. RLS確認：
   - Supabase → Table Editor → 該当テーブル
   - 直接データが見えるか（service_roleで）
3. LocalStorageキャッシュクリア：
   - QAパネル → Sync → "Clear Cache"
   - "Full Pull Now"
4. 改善しない場合 → [RLS障害](#rls障害)
```

---

#### Q2: 書き込みが反映されない

**確認手順**:

```
1. Outbox確認：
   - QAパネル → Outbox → Failed/Pending
   - Failedあれば "Retry"
2. ネットワーク確認：
   - ブラウザ開発ツール → Network
   - Supabase APIリクエストのステータス
3. RLS権限確認：
   - 403エラーなら権限不足
   - ロール/クライアントID確認
4. 一時対処：
   - "Full Pull Now"で最新状態確認
   - 再度書き込み試行
```

---

#### Q3: ログインできない

**確認手順**:

```
1. Auth確認：
   - QAパネル → Auth → Session Status
   - "Not authenticated"なら再ログイン
2. users テーブル確認：
   - Supabase → Table Editor → users
   - auth_uid が正しく紐付いているか
3. Email/Password確認：
   - Supabase → Auth → Users
   - ユーザーが存在するか
4. 復旧手順：
   - パスワードリセットメール送信
   - ユーザー再作成（最終手段）
```

---

## 🔧 トラブルシューティング

### Auth障害

**症状**: ログインできない、Session Statusが"Not authenticated"

**原因**:
- Supabase Auth設定ミス
- JWT Custom Claims未設定
- users テーブル紐付け不整合

**対処手順**:

```
1. Supabase Dashboard → Auth → Settings
   - Email Auth有効か確認
2. Supabase → Auth → Users
   - ユーザーが存在するか確認
   - auth_uid をコピー
3. Supabase → Table Editor → users
   - auth_uid で検索
   - 存在しない場合 → ユーザー作成
   - 存在する場合 → role/org_id/client_id確認
4. JWT Custom Claims確認：
   - ログイン後のJWT Payload確認
   - app_metadata に role/org_id/client_id が含まれるか
5. 復旧確認：
   - 再ログイン試行
   - QAパネル → Auth → User Profile確認
```

---

### RLS障害

**症状**: データが0件、403エラー多発

**原因**:
- RLSポリシー設定ミス
- JWT Custom Claims不足
- org_id/client_id紐付け不整合

**対処手順**:

```
1. QAパネル → Auth → User Profile確認：
   - role/org_id/client_id が正しいか
2. Supabase → SQL Editor → RLS確認：
   SELECT * FROM tasks WHERE deleted_at IS NULL;
   -- service_roleで実行してデータ存在確認
3. RLSポリシー確認：
   SELECT * FROM pg_policies WHERE tablename = 'tasks';
   -- ポリシーが有効化されているか確認
4. 修正方針：
   - JWT Custom Claims修正（Auth Hooks or アプリ層）
   - users テーブルの紐付け修正
   - RLSポリシー修正（rls_final.sql再実行）
5. 復旧確認：
   - QAパネル → Sync → "Full Pull Now"
   - データが表示されるか確認
```

---

### Sync障害

**症状**: 重複、整合性チェック失敗、データが古い

**原因**:
- Incremental Pull失敗
- LocalStorageキャッシュ破損
- Supabase側データ欠損

**対処手順**:

```
1. QAパネル → Sync → "Consistency Check"実行
2. 不整合があれば "Show Details"
3. 解決方針決定：
   - Supabase側が正 → "Pull from Supabase"
   - LocalStorage側が正 → "Push to Supabase"（慎重に）
4. "Resolve Conflicts"実行
5. 改善しない場合：
   - "Clear Cache"
   - "Full Pull Now"
   - それでもダメなら "Snapshot Restore"
6. 復旧確認：
   - データ件数確認（Supabaseと一致）
   - KPI/アラート計算確認
```

---

### Outbox障害

**症状**: pendingが溜まる、failed多発、permanent failure

**原因**:
- ネットワークエラー
- RLS権限エラー
- データ不正

**対処手順**:

```
1. QAパネル → Outbox → "Show Failed"
2. エラー内容確認：
   - Network Error:
     - Supabase Status確認（https://status.supabase.com/）
     - ネットワーク接続確認
     - "Retry All Failed"
   - 403 Forbidden:
     - RLS権限確認
     - ロール/クライアントID確認
     - 修正後 "Retry"
   - 422 Validation:
     - "Show Details"でリクエスト確認
     - データ不正修正
     - "Retry" or "Mark as Permanent Failure"
3. Pending溜まり対処：
   - 50件超なら "Process Now"（一括処理）
   - ネットワーク安定確認
4. Permanent Failure対処：
   - 理由記録（監査用）
   - 手動でSupabaseに直接修正
   - "Clear Permanent Failures"
```

---

### autoPull障害

**症状**: 差分が反映されない、lastPulledAt進まない

**原因**:
- Incremental Pull失敗
- since パラメータ不正
- lastPulledAt破損

**対処手順**:

```
1. QAパネル → Incremental → Last Pull確認
   - 60秒以上前なら異常
2. "Show Errors"でエラー内容確認
3. "Reset Incremental State"実行
   - lastPulledAt を null にリセット
   - 次回は Full Pull になる
4. "Full Pull Now"手動実行
5. 60秒後、Last Pull更新されるか確認
6. 改善しない場合：
   - ブラウザコンソールでエラー確認
   - Supabase Logs確認
   - autoPull.ts デバッグログ有効化
```

---

### Performance劣化

**症状**: >2000ms増加、件数増大、画面が重い

**原因**:
- データ量増大
- インデックス不足
- Full Pull多発

**対処手順**:

```
1. QAパネル → Performance → テーブル別確認
2. 最も遅いテーブル特定
3. データ量確認：
   - Supabase → Table Editor → 件数確認
   - 1000件超 → Incremental Pull推奨
4. Incremental比率確認：
   - QAパネル → Incremental → Ratio
   - <70%なら Full Pull多発
   - "Reset Incremental State"で改善可能性
5. インデックス確認：
   - Supabase → SQL Editor
   SELECT * FROM pg_indexes WHERE tablename = 'tasks';
   - org_id, updated_at にインデックスあるか
6. 最適化実施：
   - インデックス追加（indexes.sql）
   - Incremental Pull強制（"Force Incremental"）
   - ページング導入検討
```

---

### データ破損

**症状**: LocalStorageキャッシュ異常、Supabase側データ欠損

**原因**:
- ブラウザストレージ制限
- 同時書き込み競合
- Supabase RLS誤削除

**対処手順**:

```
1. 影響範囲確認：
   - QAパネル → Sync → "Consistency Check"
   - 不整合件数確認
2. Supabase側確認：
   - Table Editor → 該当テーブル
   - deleted_at IS NULL でデータ存在確認
3. LocalStorage側確認：
   - ブラウザ開発ツール → Application → LocalStorage
   - キー/値確認
4. 復旧方針：
   - Supabase側が正常 → "Clear Cache" + "Full Pull Now"
   - Supabase側も異常 → "Snapshot Restore"（最新）
5. 最終手段：
   - Supabase Backup復元（BACKUP_RESTORE.md参照）
   - ユーザーに一時的にデータ再入力依頼
```

---

## 📋 運用チェックリスト

### 日次

- [ ] 始業時チェック（Auth/Outbox/Performance）
- [ ] 終業時チェック（Outbox Failed 0、Snapshot作成）

### 週次

- [ ] Consistency Check実行
- [ ] Outbox Cleanup（Permanent Failure処理）

### 月次

- [ ] Performanceレビュー
- [ ] Storageレビュー
- [ ] 監査ログレビュー（Control権限）

---

## 🔗 関連ドキュメント

- [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) - 障害対応詳細
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) - リリース手順
- [SECURITY_BASELINE.md](./SECURITY_BASELINE.md) - セキュリティ基準
- [MONITORING_SPEC.md](./MONITORING_SPEC.md) - 監視仕様
- [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) - バックアップ/復元

---

**End of OPS_RUNBOOK.md**
