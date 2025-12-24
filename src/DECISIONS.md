# PALSS SYSTEM — 未決事項の最終決定ログ（DECISIONS.md）

**Date**: 2024-12-23  
**Status**: 確定（全6件決定完了）  
**決定方針**: 最短実装、本番運用可能、Phase 11以降で拡張可能

---

## 📋 決定サマリー

| # | 項目 | 決定 | Phase 10採用 | 影響工数 |
|---|------|------|-------------|---------|
| 1 | activity_log テーブル | ✅ 採用 | Phase 12で追加 | +1日 |
| 2 | Realtime導入 | ❌ 非採用 | autoPull継続 | 0日 |
| 3 | KPI計算場所 | ✅ サーバー計算 | API追加 | +1.5日 |
| 4 | アラート計算場所 | ✅ サーバー計算 | API追加 | +1日 |
| 5 | Rate Limit | ❌ 非設定 | 監視対応 | 0日 |
| 6 | Webhook通知 | ❌ 非実装 | アプリ内通知のみ | 0日 |

**総工数**: +3.5日  
**リリース目標**: Day 1-20（元計画20日 → 23.5日）

---

## 1️⃣ activity_log（監査ログ）テーブル追加

### 決定: ✅ Phase 12で追加

**理由**:
- セキュリティ要件充足（誰が何をしたか追跡）
- コンプライアンス対応（監査証跡）
- 初回リリースから記録開始で、後から追加する手間を回避
- トラブル調査の基礎データとして必須

**採用基準**:
- AUDIT_LOG_SPEC.md で仕様完成済み
- スキーマ追加コスト低（テーブル1つ、インデックス3つ）
- RLS設定容易（Control/Supportのみ閲覧）

**影響範囲**:
- schema_final.sql: activity_logテーブル追加（+50行）
- rls_final.sql: RLSポリシー追加（+30行）
- ERD.md: テーブル定義追加
- RLS_POLICY.md: 閲覧権限明記
- API実装: 全P0イベント（Auth/Task/Approval/Contract）記録（+1日）

**将来の拡張点**:
- Phase 11: 異常検知アラート（深夜操作、大量削除）
- Phase 12: 監査ログエクスポート（CSV/JSON）
- Phase 13: 長期保存（S3/GCS）

**実装目安**: +1日（テーブル作成、RLS設定、基本実装）

---

## 2️⃣ Realtime（WebSocket）導入範囲

### 決定: ❌ Phase 10では非採用（autoPull継続）

**理由**:
- autoPullで97-98%短縮達成済み（Full Pull 2000ms → Incremental Pull 50-300ms）
- 60秒間隔で十分なユーザー体験（通知表示まで最大60秒）
- Realtime導入のコスト高（実装複雑化、WebSocket接続管理、Supabaseコスト増）
- 初回リリースのスコープ縮小を優先

**採用基準**:
- Phase 8.5でIncremental Pull完成（TC1-TC6 Pass）
- Performance計測で50-300ms達成
- ユーザーフィードバックで「60秒遅延が許容できない」場合のみ再検討

**影響範囲**:
- なし（現状維持）
- API_CONTRACT.md: 「Phase 10はpull方式、Phase 11でRealtime検討」と明記済み
- フロント実装: autoPull継続（変更なし）

**将来の拡張点**:
- Phase 11: notifications/commentsのみRealtime導入
  - Supabase Realtime設定（+0.5日）
  - フロント実装（useEffect + subscribeチャネル）（+1.5日）
  - WebSocket接続管理（reconnect対応）（+1日）
- Phase 12: tasks/approvalsもRealtime化（全リソース）

**実装目安**: Phase 11で導入する場合 +3日

---

## 3️⃣ KPI計算の実装場所

### 決定: ✅ サーバー計算（専用エンドポイント）

**理由**:
- 計算ロジックの正確性保証（単一実装、フロント散在回避）
- キャッシュ可能（計算負荷軽減）
- API経由で他サービスからも利用可能（将来の拡張性）
- デバッグ容易（サーバーログで追跡）

**採用基準**:
- Direction KPI（納期遵守率、差し戻し率、平均リードタイム）
- Sales KPI（受注金額、受注件数、提案件数、受注率）
- 計算ロジックが複雑（クライアント別、期間別集計）

**影響範囲**:
- API_CONTRACT.md: GET /kpi/direction, GET /kpi/sales 追加
- openapi.yaml: KPIスキーマ定義追加
- バックエンド実装: 集計クエリ、キャッシュ（+1.5日）
- フロント修正: KPI取得APIに切替（+0.5日）
- 既存 `/utils/kpi.ts`: 「暫定実装、Phase 10でサーバー移行」とコメント追加

**将来の拡張点**:
- Phase 11: KPI履歴保存（時系列グラフ）
- Phase 12: KPI目標設定・達成率
- Phase 13: KPIアラート（目標未達時の通知）

**実装目安**: +1.5日（バックエンド1日、フロント0.5日）

---

## 4️⃣ アラート計算の実装場所

### 決定: ✅ サーバー計算（専用エンドポイント）

**理由**:
- 計算ロジックの正確性保証
- 通知トリガー連携可能（Webhook、Email送信）
- アラート閾値の一元管理（フロント散在回避）
- 定期実行可能（Cron、定期バッチ）

**採用基準**:
- 5種のアラート（stagnantTasks、overdueTasks、noReplyComments、contractRenewals、overdueApprovals）
- 閾値設定が必要（X日間停滞、Y日以内更新期限）

**影響範囲**:
- API_CONTRACT.md: GET /alerts 追加
- openapi.yaml: Alertsスキーマ定義追加
- バックエンド実装: 集計クエリ、閾値チェック（+1日）
- フロント修正: アラート取得APIに切替（+0.5日）
- 既存 `/utils/alerts.ts`: 「暫定実装、Phase 10でサーバー移行」とコメント追加

**将来の拡張点**:
- Phase 11: アラート閾値カスタマイズ（クライアント別設定）
- Phase 12: アラート通知（Slack/Email自動送信）
- Phase 13: アラート履歴（過去の推移）

**実装目安**: +1日（バックエンド0.5日、フロント0.5日）

---

## 5️⃣ Rate Limit（レート制限）

### 決定: ❌ Phase 10では非設定（監視で対応）

**理由**:
- 初期ユーザー少数（信頼できるクライアント企業のみ）
- 監視で異常検知可能（QAパネル、Supabase Dashboard）
- Rate Limit設定のコスト（実装工数、正常ユーザーへの影響リスク）
- Phase 11以降で導入すれば十分

**採用基準**:
- Phase 10: ユーザー数 < 50（想定）
- Phase 11: ユーザー数 > 100 または 外部API公開時

**影響範囲**:
- なし（現状維持）
- MONITORING_SPEC.md: 「Rate Limitなし、監視で異常検知」と明記
- INCIDENT_PLAYBOOK.md: 「ブルートフォース攻撃時の対処」を追加済み

**将来の拡張点**:
- Phase 11: 基本Rate Limit設定
  - 1000 req/hour/user（Supabase設定）（+0.5日）
  - エラーレスポンス（429 Too Many Requests）（+0.5日）
- Phase 12: カスタムRate Limit（エンドポイント別、ロール別）
- Phase 13: Rate Limit監視・アラート

**実装目安**: Phase 11で導入する場合 +1日

---

## 6️⃣ Webhook（Slack/Email通知）

### 決定: ❌ Phase 10では非実装（アプリ内通知のみ）

**理由**:
- アプリ内通知で十分（autoPullで60秒以内に表示）
- Webhook設定のコスト（Slack/Email連携、送信ロジック、エラーハンドリング）
- 初期ユーザーはアプリを頻繁に確認する想定
- Phase 11以降で追加すれば十分

**採用基準**:
- Phase 10: アプリ内通知のみ（notificationsテーブル）
- Phase 11: ユーザーフィードバックで「外部通知が必要」の場合のみ導入

**影響範囲**:
- なし（現状維持）
- API_CONTRACT.md: 「Phase 10はアプリ内通知のみ、Phase 11でWebhook検討」と明記済み
- notifications テーブルで全通知記録（変更なし）

**将来の拡張点**:
- Phase 11: Slack Webhook統合
  - タスク期限、承認期限の通知（+1日）
  - Slack Webhook設定UI（+0.5日）
- Phase 12: Email通知
  - SendGrid/AWS SES統合（+1日）
  - Email テンプレート（+0.5日）
- Phase 13: 通知設定カスタマイズ（ユーザー別ON/OFF）

**実装目安**: Phase 11で導入する場合 +2日（Slack）、+1.5日（Email）

---

## 📊 決定の影響サマリー

### Phase 10実装スコープ（確定）

**採用項目**:
1. ✅ activity_log テーブル（+1日）
2. ✅ KPI計算API（+1.5日）
3. ✅ アラート計算API（+1日）

**非採用項目**:
1. ❌ Realtime（autoPull継続）
2. ❌ Rate Limit（監視対応）
3. ❌ Webhook（アプリ内通知のみ）

### 総工数

- 元計画: 20日
- 追加工数: +3.5日
- **新計画: 23.5日**（約24日）

### リリーススケジュール（更新）

```
Week 1 (Day 1-5): Supabaseセットアップ + スキーマ適用 + activity_log追加
Week 2 (Day 6-12): API実装（基盤 + 全22エンドポイント）
Week 3 (Day 13-17): KPI/AlertsAPI実装 + 受入テスト
Week 4 (Day 18-20): 統合テスト + リリース準備
Week 5 (Day 21-24): リリース + 監視
```

---

## 🔗 反映先ファイル

### Phase 11（API契約）

- [x] API_CONTRACT.md: KPI/Alerts API追加
- [x] openapi.yaml: KPI/Alerts スキーマ追加

### Phase 12（ERD/RLS）

- [x] ERD.md: activity_log テーブル追加
- [x] RLS_POLICY.md: activity_log RLSポリシー追加
- [x] schema_final.sql: activity_log CREATE TABLE追加
- [x] rls_final.sql: activity_log RLSポリシー追加

### Phase 13（運用Runbook）

- [x] OPS_RUNBOOK.md: Rate Limit監視、Webhook非採用を明記
- [x] INCIDENT_PLAYBOOK.md: ブルートフォース対応追記
- [x] MONITORING_SPEC.md: Rate Limit監視項目追加
- [x] AUDIT_LOG_SPEC.md: activity_log運用追記

### 最終サマリー

- [x] BACKEND_HANDOFF_SUMMARY.md: 未決事項0件に更新

---

## ✅ 決定の妥当性チェック

| 項目 | チェック | 結果 |
|------|---------|------|
| セキュリティ要件 | activity_log で監査証跡 | ✅ |
| パフォーマンス | autoPull 50-300ms | ✅ |
| 正確性 | KPI/Alerts サーバー計算 | ✅ |
| 運用負荷 | Rate Limit監視、Webhook非採用 | ✅ |
| 拡張性 | Phase 11以降で追加可能 | ✅ |
| スコープ | 最短実装（+3.5日） | ✅ |

---

## 🎯 Phase 11以降の拡張ロードマップ

### Phase 11（+8日）

- Realtime導入（notifications/comments）: +3日
- Slack Webhook統合: +2日
- Rate Limit基本設定: +1日
- KPI履歴保存: +1日
- アラート閾値カスタマイズ: +1日

### Phase 12（+6日）

- Realtime全リソース化: +2日
- Email通知統合: +1.5日
- KPI目標設定・達成率: +1.5日
- アラート通知自動送信: +1日

### Phase 13（+4日）

- 監査ログ異常検知アラート: +1日
- KPIアラート: +1日
- 通知設定カスタマイズ: +1日
- Rate Limit監視・アラート: +1日

---

**End of DECISIONS.md**
