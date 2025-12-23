# PALSS SYSTEM — リリースチェックリスト（RELEASE_CHECKLIST.md）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（リリース用）  
**対象**: リリース責任者、開発チーム

---

## 📋 リリース前チェックリスト

### 1週間前

**環境準備**:

- [ ] Supabaseプロジェクト準備完了
  - [ ] Production環境作成
  - [ ] 環境変数設定（URL, Anon Key）
  - [ ] Auth設定（Email Auth有効化）
  - [ ] JWT Custom Claims設定

**スキーマ準備**:

- [ ] schema_final.sql実行
  - [ ] テーブル作成（8テーブル）
  - [ ] 外部キー制約
  - [ ] インデックス
  - [ ] トリガー（updated_at）
- [ ] rls_final.sql実行
  - [ ] 補助関数作成
  - [ ] RLS有効化
  - [ ] ポリシー作成
- [ ] seed_minimal.sql実行（任意）
  - [ ] 初期データ投入

**バックアップ準備**:

- [ ] Supabase Backup有効化
  - [ ] 日次自動バックアップ設定
  - [ ] 保持期間設定（7日間推奨）

---

### 3日前

**受入テスト実施**:

- [ ] TC1: ログイン→ロール別ホーム
  - [ ] Sales/Direction/Editor/Creator/Support/Control/Clientで各1回
  - [ ] データ表示確認
  - [ ] KPI計算確認
- [ ] TC2: クライアント選択→KPI切替
  - [ ] 各クライアントでKPI変化確認
- [ ] TC3: タスク追加→連鎖反映
  - [ ] タスク作成
  - [ ] lastActivityAt更新確認
  - [ ] 通知生成確認
- [ ] TC4: 承認操作→通知/KPI反映
  - [ ] 承認/差し戻し
  - [ ] 差し戻し率KPI変化確認
- [ ] TC5: コメント→noReply増減
  - [ ] Client→Team コメント
  - [ ] Team→Client 返信
  - [ ] noReplyアラート変化確認
- [ ] TC6: 契約追加→KPI変化
  - [ ] 契約作成
  - [ ] 月額料金KPI反映確認
- [ ] TC7: RLS動作確認
  - [ ] Clientロールで他社データ0件確認
  - [ ] 社内ロールで全データ表示確認
- [ ] TC8: SSOT信頼性
  - [ ] Consistency Check実行
  - [ ] 不整合0件確認
- [ ] TC9: Incremental Pull
  - [ ] Full Pull → Incremental Pull切替確認
  - [ ] 差分取得97-98%短縮確認

**Performanceテスト**:

- [ ] QAパネル → Performance
  - [ ] Avg Duration < 500ms確認
  - [ ] テーブル別Duration確認
- [ ] 負荷テスト
  - [ ] 10ユーザー同時アクセス
  - [ ] データ1000件で動作確認

**Outbox確認**:

- [ ] QAパネル → Outbox
  - [ ] Failed件数 0確認
  - [ ] Permanent Failure 0確認
  - [ ] 理由が明確なら例外OK

---

### 1日前

**最終確認**:

- [ ] 環境変数確認
  - [ ] Production URL/Anon Key正しいか
  - [ ] service_role_key はサーバーサイドのみ
- [ ] スキーマバージョン確認
  - [ ] schema_version テーブルで最新バージョン確認
- [ ] データ移行確認（既存データある場合）
  - [ ] LocalStorage → Supabase移行完了
  - [ ] データ件数一致確認
  - [ ] 外部キー整合性確認

**ドキュメント準備**:

- [ ] ユーザーマニュアル更新
- [ ] リリースノート作成
- [ ] 既知の問題リスト作成

**ロールバック準備**:

- [ ] 前ビルドバックアップ
  - [ ] フロントエンドビルド保存
- [ ] Supabase Snapshot作成
  - [ ] スキーマ+データのバックアップ
- [ ] ロールバック手順確認
  - [ ] 担当者への共有

**監視準備**:

- [ ] アラート設定
  - [ ] Outbox Failed > 5
  - [ ] autoPull連続失敗 > 3
  - [ ] Performance > 2000ms
- [ ] Supabase監視設定
  - [ ] Dashboard → Logs有効化
  - [ ] Email通知設定

---

## 🚀 リリース当日

### リリース手順

**Step 1: 最終スモークテスト（30分）**:

```
□ Staging環境で最終確認
  - ログイン/ログアウト
  - データ表示
  - タスク/承認/コメント作成
  - KPI計算
  - Outbox動作

□ Performance確認
  - QAパネル → Performance
  - Avg Duration < 500ms

□ RLS確認
  - 各ロールでデータアクセス確認
```

---

**Step 2: リリース実行（1時間）**:

```
□ メンテナンス通知（任意）
  - ユーザーに事前通知
  - "5分程度のメンテナンスを実施します"

□ Supabase設定確認
  - Production環境URL/Anon Key
  - schema/rls適用済み

□ フロントエンドデプロイ
  - ビルド実行
  - Vercel/Netlify等へデプロイ
  - デプロイ完了確認

□ 初回アクセス確認
  - Production URLアクセス
  - ログイン確認
  - データ表示確認
```

---

**Step 3: リリース後確認（30分）**:

```
□ Auth動作確認
  - 各ロールでログイン
  - QAパネル → Auth → Session Status確認

□ データ同期確認
  - QAパネル → Sync → Consistency Check
  - 不整合0件確認

□ Outbox確認
  - QAパネル → Outbox → Failed件数
  - 0件が理想

□ Performance確認
  - QAパネル → Performance → Avg Duration
  - 500ms以下確認

□ Incremental Pull確認
  - QAパネル → Incremental → Last Pull
  - 60秒以内に更新確認
```

---

**Step 4: ユーザー通知**:

```
□ リリース完了通知
  - メール/Slack等で全ユーザーに通知
  - 新機能説明
  - 既知の問題（あれば）

□ サポート体制確認
  - 問い合わせ窓口準備
  - SRE待機体制
```

---

### リリース後監視（24時間）

**1時間ごと確認**:

- [ ] Outbox Failed件数（0件が理想）
- [ ] autoPull Last Pull（60秒以内）
- [ ] Performance Avg Duration（<500ms）
- [ ] Supabase Dashboard → Auth → Active Users

**4時間ごと確認**:

- [ ] Consistency Check実行
- [ ] 監査ログ確認（異常操作なし）
- [ ] ユーザー問い合わせ確認

**24時間後最終確認**:

- [ ] 全機能正常動作
- [ ] ユーザー問い合わせ0件（または解決済み）
- [ ] リリースレポート作成

---

## 🔄 ロールバック手順

### ロールバック判断基準

以下の場合、ロールバック検討：

- **P0障害**: 全ユーザーログイン不可、全データ0件
- **P1障害継続**: 1時間以内に復旧見込みなし
- **データ破損**: 復元不可能なデータ損失
- **セキュリティ問題**: RLS不正、権限漏洩

---

### フロントエンドロールバック（15分）

**手順**:

```
□ 前ビルドへ戻す
  - Vercel/Netlify → Deployments
  - 前バージョン選択
  - "Promote to Production"

□ 動作確認
  - Production URLアクセス
  - ログイン確認
  - データ表示確認

□ ユーザー通知
  - "一時的に前バージョンに戻しました"
  - 原因調査中を通知
```

---

### Supabaseロールバック（30分）

**原則**: DBロールバックは原則行わない（前方互換方針）

**緊急時のみ**:

```
□ Supabase Snapshot復元
  - Dashboard → Database → Backups
  - 復元ポイント選択
  - "Restore"実行
  - ⚠️ 復元後のデータは失われる

□ schema復元
  - 前バージョンのschema.sql実行
  - rls.sql実行

□ データ整合性確認
  - Table Editorでデータ確認
  - 外部キー整合性確認
```

---

### MockモードによるGraceful Degradation（最終手段）

**症状**: Supabase完全障害、復旧見込み不明

**手順**:

```
□ フロントエンドでMockモード有効化
  - QAパネル → Navigator → "Mock Mode"
  - LocalStorageのみで動作

□ ユーザー通知
  - "一時的にオフラインモードで動作"
  - "データはローカルに保存され、復旧後に同期"

□ Supabase復旧待機
  - Status確認
  - 復旧後、Mockモード解除
  - Full Pullで同期
```

---

## 📋 リリース後レポートテンプレート

```markdown
# リリースレポート

**日時**: YYYY-MM-DD HH:MM
**バージョン**: v1.0.0
**担当者**: 

## リリース内容

- 

## 受入テスト結果

- TC1-TC9: Pass/Fail
- Performance: Avg Duration = XXXms
- Outbox: Failed = X件

## リリース時の問題

- 

## ユーザー問い合わせ

- 

## 改善事項

- 

## Next Action

- 
```

---

## 🔗 関連ドキュメント

- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順
- [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) - 障害対応
- [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) - バックアップ/復元

---

**End of RELEASE_CHECKLIST.md**
