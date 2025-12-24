# PALSS SYSTEM — Backend Handoff Summary（最終引き渡しサマリー）

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: Phase 1-9.3 + Phase 10-13 完了、バックエンド引き渡し準備完了  
**対象**: バックエンド実装チーム、プロダクトオーナー

---

## 🎯 引き渡し判定

### ✅ バックエンドが今すぐ実装を開始できる状態か？

**答え: YES（条件付き）**

以下の条件で実装開始可能：
1. ✅ **仕様SSOT確定済み**: DoD/RBAC/API契約/ERD/RLS全て定義完了
2. ✅ **SQL即実行可能**: schema_final.sql/rls_final.sql/seed_minimal.sqlが準備済み
3. ✅ **運用設計完了**: 監視/障害対応/リリース/バックアップ手順が明文化
4. ⚠️ **未決事項6件**: 実装に影響する項目あり（後述）
5. ✅ **フロントエンド実装済み**: UIは完成、バックエンド待ち

**推奨実装順序**:
1. Day 1-3: Supabaseセットアップ + スキーマ適用
2. Day 4-6: Auth設定 + RLS適用 + 動作確認
3. Day 7-14: API実装（全22エンドポイント）
4. Day 15-17: テスト（受入テストTC1-TC9）
5. Day 18-20: 運用準備（監視/アラート設定）

---

## 📁 Phase 10-13 成果物一覧

### Phase 10: DoD（完成定義）+ RBAC + 受入テスト

| ファイル | 内容 | ページ数 | 状態 |
|---------|------|---------|------|
| [PALSS_SYSTEM_SSOT.md](./PALSS_SYSTEM_SSOT.md) | DoD（40項目）、RBAC（7ロール×6リソース）、受入テスト（TC1-TC9） | 150+ | ✅ 完了 |
| [PALSS_SYSTEM_GUIDE.md](./PALSS_SYSTEM_GUIDE.md) | 実装ガイド、バックエンド協働フロー | 80+ | ✅ 完了 |

**主要内容**:
- **DoD**: 本番運用可能条件（Auth/SSOT/機能/アラート/KPI/監視/画面/テスト）
- **RBAC**: 7ロール（Sales/Direction/Editor/Creator/Support/Control/Client）× 6リソース × 4操作
- **受入テスト**: Given/When/Then形式で9シナリオ

---

### Phase 11: API契約（OpenAPI）

| ファイル | 内容 | ページ数 | 状態 |
|---------|------|---------|------|
| [API_CONTRACT.md](./API_CONTRACT.md) | API仕様書（全22エンドポイント、共通仕様、RBAC、ユースケース） | 200+ | ✅ 完了 |
| [openapi.yaml](./openapi.yaml) | OpenAPI 3.0.3仕様（機械可読） | 800行 | ✅ 完了 |
| [API_CONTRACT_GUIDE.md](./API_CONTRACT_GUIDE.md) | 実装手順、FAQ | 50+ | ✅ 完了 |

**主要内容**:
- **認証**: Supabase Auth（JWT Bearer Token）
- **エンドポイント**: 22個（Auth 1、Clients 4、Tasks 4、Approvals 6、Comments 2、Contracts 4、Notifications 6）
- **共通仕様**: エラーフォーマット、ページング（Cursor方式）、Incremental Pull（since）
- **RBAC統合**: ロール別権限がAPI仕様に明記

---

### Phase 12: ERD + RLS最終版（SQL）

| ファイル | 内容 | ページ数/行数 | 状態 |
|---------|------|-------------|------|
| [ERD.md](./ERD.md) | テーブル定義（8テーブル）、リレーション、インデックス、削除戦略 | 150+ | ✅ 完了 |
| [RLS_POLICY.md](./RLS_POLICY.md) | RLSポリシー詳細（7補助関数、全ポリシー） | 120+ | ✅ 完了 |
| [schema_final.sql](./schema_final.sql) | CREATE TABLE、FK、INDEX、TRIGGER | 500行 | ✅ 完了 |
| [rls_final.sql](./rls_final.sql) | RLS有効化、補助関数、ポリシー | 600行 | ✅ 完了 |
| [seed_minimal.sql](./seed_minimal.sql) | 初期データ（org 1件、users 9件、clients 5件等） | 300行 | ✅ 完了 |
| [migration_notes.md](./migration_notes.md) | データ移行手順、互換性戦略 | 80+ | ✅ 完了 |

**主要内容**:
- **8テーブル**: organizations, users, clients, tasks, approvals, comments, contracts, notifications
- **論理削除**: 全テーブルに deleted_at（Phase 8.6で実装予定）
- **Incremental Pull対応**: 全テーブルに updated_at/created_at + インデックス
- **RLS完全統合**: RBAC表と100%一致

---

### Phase 13: 運用Runbook（監査/復旧/監視/リリース）

| ファイル | 内容 | ページ数 | 状態 |
|---------|------|---------|------|
| [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) | 日常運用、緊急時5分手順、トラブルシューティング | 200+ | ✅ 完了 |
| [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) | 障害対応（P0-P3レベル別） | 100+ | ✅ 完了 |
| [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) | リリース/ロールバック手順 | 80+ | ✅ 完了 |
| [SECURITY_BASELINE.md](./SECURITY_BASELINE.md) | セキュリティ基準（最低限） | 100+ | ✅ 完了 |
| [AUDIT_LOG_SPEC.md](./AUDIT_LOG_SPEC.md) | 監査ログ仕様（activity_log設計） | 80+ | ✅ 完了 |
| [MONITORING_SPEC.md](./MONITORING_SPEC.md) | 監視項目、閾値、アラート | 70+ | ✅ 完了 |
| [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) | バックアップ/復元手順（3層戦略） | 90+ | ✅ 完了 |

**主要内容**:
- **緊急時5分手順**: 症状別クイックリンク（深夜対応可能）
- **障害レベル**: P0（即時）、P1（1時間以内）、P2（4時間以内）、P3（24時間以内）
- **監視指標**: autoPull、Outbox、Auth/RLS、Performance（閾値明記）
- **バックアップ**: 3層（Supabase自動、手動Snapshot、アプリSnapshot）

---

## 📊 整合性チェック結果

### 1. RBAC整合性（✅ 完全一致）

**確認箇所**:
- PALSS_SYSTEM_SSOT.md の RBAC表
- RLS_POLICY.md の RBAC表
- rls_final.sql のポリシー実装

**結果**:
- ✅ 7ロール定義が完全一致
- ✅ 6リソース（clients/tasks/approvals/comments/contracts/notifications）が一致
- ✅ 操作権限（R/C/U/D）が一致
- ✅ 特記事項（Direction/Controlのみ承認操作、Sales/Controlのみ契約管理）が一致

---

### 2. API ↔ ERD整合性（✅ 完全一致）

**確認箇所**:
- API_CONTRACT.md のスキーマ定義
- openapi.yaml のスキーマ定義
- ERD.md のテーブル定義
- schema_final.sql のCREATE TABLE

**結果**:
- ✅ 8テーブル（organizations含む）が一致
- ✅ カラム名・型が一致
- ✅ 外部キー関係が一致
- ✅ ステータスEnum値が一致
  - tasks.status: not_started/in_progress/completed
  - approvals.status: pending/approved/rejected
  - contracts.status: negotiation/active/expired

---

### 3. Incremental Pull整合性（✅ 完全一致）

**確認箇所**:
- API_CONTRACT.md の since パラメータ
- ERD.md の updated_at/created_at カラム
- schema_final.sql のインデックス定義

**結果**:
- ✅ 全6リソース（clients/tasks/approvals/comments/contracts/notifications）に since パラメータ
- ✅ 全テーブルに updated_at/created_at カラム
- ✅ 全テーブルに (org_id, updated_at) インデックス
- ✅ API_CONTRACT.mdのレスポンスに latest_timestamp 含まれる

---

### 4. 受入テスト ↔ 主要フロー整合性（✅ 一致）

**確認箇所**:
- PALSS_SYSTEM_SSOT.md のTC1-TC9
- API_CONTRACT.md のユースケース別APIシーケンス

**結果**:
- ✅ TC1（ログイン→ロール別ホーム）↔ ユースケース1が一致
- ✅ TC3（タスク追加→連鎖反映）↔ ユースケース2が一致
- ✅ TC5（コメント→noReply増減）↔ ユースケース3が一致

---

### 5. SSOT ↔ 運用Runbook整合性（✅ 一致）

**確認箇所**:
- PALSS_SYSTEM_SSOT.md のOutbox/autoPull/Sync
- OPS_RUNBOOK.md のトラブルシューティング

**結果**:
- ✅ Outbox障害対応が現実的（QAパネル → Outbox → Retry）
- ✅ autoPull障害対応が現実的（Incremental State Reset → Full Pull）
- ✅ Sync障害対応が現実的（Consistency Check → Resolve Conflicts）
- ✅ Snapshot復元手順が明確

---

## ⚠️ 未決事項（6件、優先度順）

### 🔴 Priority 1（実装に影響、即決必要）

#### 1. activity_log（監査ログ）テーブル追加

**現状**: AUDIT_LOG_SPEC.mdで仕様は定義済み、schema_final.sqlには未追加

**質問**:
- activity_log テーブルを**Phase 12のスキーマに含めるか**？
- または**Phase 13以降で追加するか**？

**選択肢**:
- **A案**: Phase 12で追加（推奨）
  - メリット: 初回リリースから監査ログ記録可能、セキュリティ要件充足
  - デメリット: スキーマ変更、マイグレーション追加
- **B案**: Phase 13以降で追加
  - メリット: 初回リリースのスコープを縮小
  - デメリット: 監査ログなし期間発生、後からの追加が複雑

**推奨**: **A案（Phase 12で追加）**

**影響範囲**:
- schema_final.sql に activity_log テーブル追加
- rls_final.sql に activity_log RLSポリシー追加
- seed_minimal.sql に初期ログ追加（任意）
- API実装で全P0イベント（Auth/Task/Approval/Contract）記録

**実装目安**: +1日（テーブル作成、RLS設定、基本実装）

---

#### 2. Realtime導入範囲

**現状**: API_CONTRACT.mdで「Phase 10はpull、Phase 11でRealtime検討」と記載

**質問**:
- **初回リリース（Phase 10）でRealtimeを導入するか**？
- 導入する場合、**どのリソースを対象にするか**？

**選択肢**:
- **A案**: Phase 10では非採用（autoPull継続）
  - メリット: シンプル、autoPullで97-98%短縮済み、コスト低
  - デメリット: 60秒間隔の遅延
- **B案**: notifications/comments のみRealtime導入
  - メリット: リアルタイム通知、チャットUX向上
  - デメリット: 実装複雑化、WebSocket接続管理、コスト増
- **C案**: 全リソース（tasks/approvals含む）Realtime導入
  - メリット: 完全リアルタイム
  - デメリット: 大幅な実装変更、コスト大幅増

**推奨**: **A案（Phase 10では非採用）**

**理由**:
- autoPullで十分なパフォーマンス（50-300ms）
- 60秒間隔でもユーザー体感上問題なし
- Phase 11以降で notifications/comments のみRealtime導入検討

**影響範囲**: なし（A案の場合）

---

### 🟡 Priority 2（運用に影響、リリース前決定推奨）

#### 3. KPI計算の実装場所

**現状**: PALSS_SYSTEM_SSOT.mdでKPI定義あり、API_CONTRACT.mdでは未決事項

**質問**:
- KPI計算を**フロントで行うか**、**サーバーで行うか**？

**選択肢**:
- **A案**: フロント計算（現状の実装）
  - メリット: サーバー負荷なし、実装済み
  - デメリット: 計算ロジックがフロントに散在、正確性保証困難
- **B案**: サーバー計算（専用エンドポイント）
  - メリット: 計算ロジック集中、正確性保証、キャッシュ可能
  - デメリット: サーバー負荷増、実装工数増

**推奨**: **B案（サーバー計算）**

**エンドポイント例**:
```
GET /kpi/direction?client_id=client_a
GET /kpi/sales?client_id=client_a
```

**影響範囲**:
- API実装: +1-2日
- フロント修正: KPI取得APIに切替（+0.5日）

---

#### 4. アラート取得の実装場所

**現状**: アラート（5種）はフロントで計算中

**質問**:
- アラート集計を**フロントで行うか**、**サーバーで行うか**？

**選択肢**:
- **A案**: フロント計算（現状の実装）
  - メリット: サーバー負荷なし、実装済み
  - デメリット: 計算ロジックがフロントに散在
- **B案**: サーバー計算（専用エンドポイント）
  - メリット: 計算ロジック集中、通知トリガー可能
  - デメリット: サーバー負荷増

**推奨**: **B案（サーバー計算）**

**エンドポイント例**:
```
GET /alerts?client_id=client_a
```

**影響範囲**:
- API実装: +1日
- フロント修正: アラート取得APIに切替（+0.5日）

---

### 🟢 Priority 3（運用最適化、リリース後対応可）

#### 5. レート制限（Rate Limit）

**現状**: API_CONTRACT.mdで「Phase 11で導入」と記載

**質問**:
- 初回リリースで**レート制限を設けるか**？

**選択肢**:
- **A案**: Phase 10では非設定
  - メリット: 実装不要
  - デメリット: DDoS/abuse対策なし
- **B案**: Phase 10で基本設定（1000 req/hour/user）
  - メリット: 基本的な保護
  - デメリット: 実装工数増

**推奨**: **A案（Phase 10では非設定）**

**理由**: 初期ユーザー少数、監視で対応可能

**影響範囲**: なし（A案の場合）

---

#### 6. Webhook（Slack/Email通知）

**現状**: API_CONTRACT.mdで「Phase 11以降で検討」と記載

**質問**:
- 初回リリースで**Webhook（Slack/Email通知）を実装するか**？

**選択肢**:
- **A案**: Phase 10では非実装
  - メリット: スコープ縮小
  - デメリット: 外部通知なし
- **B案**: Phase 10で基本実装（タスク期限、承認期限）
  - メリット: ユーザー体験向上
  - デメリット: 実装工数増

**推奨**: **A案（Phase 10では非実装）**

**理由**: アプリ内通知で十分、Phase 11以降で追加

**影響範囲**: なし（A案の場合）

---

## 📋 次のアクション（最短順）

### Week 1: Supabaseセットアップ + スキーマ適用（3日）

**担当**: Backend Engineer

```
Day 1:
□ Supabaseプロジェクト作成
□ 環境変数設定
□ schema_final.sql実行
  ⚠️ activity_log追加要否決定（未決事項1）
□ データ確認（8テーブル作成済み）

Day 2:
□ rls_final.sql実行
□ 補助関数作成（7個）
□ RLSポリシー作成（全テーブル）
□ RLS動作確認（service_roleとanon_keyで比較）

Day 3:
□ seed_minimal.sql実行
□ Auth設定（Email Auth有効化）
□ JWT Custom Claims設定（Auth Hooks or アプリ層）
□ テストユーザー作成（各ロール）
```

---

### Week 2: API実装（7日、並行可能）

**担当**: Backend Engineer × 2-3名（並行実装推奨）

```
Day 4-5: 基盤実装
□ Node.js/Express or Python/FastAPI セットアップ
□ Supabase SDKセットアップ
□ 認証ミドルウェア実装（JWT検証）
□ RBAC権限チェックミドルウェア実装
□ 共通エラーハンドリング実装
□ ページング（Cursor方式）実装

Day 6-8: エンドポイント実装（並行）
□ Auth: /auth/me
□ Clients: 4エンドポイント（list/create/get/update）
□ Tasks: 4エンドポイント（list/create/get/update）
□ Approvals: 6エンドポイント（list/get/approve/reject含む）

Day 9-10: エンドポイント実装（並行）
□ Comments: 2エンドポイント（list/create）
□ Contracts: 4エンドポイント（list/create/get/update）
□ Notifications: 6エンドポイント（list/read/delete/mark-all/clear-all）
□ ⚠️ KPI/アラートAPI追加要否決定（未決事項3-4）
```

---

### Week 3: テスト + 運用準備（3日）

**担当**: Backend Engineer + QA

```
Day 11-12: 受入テスト
□ TC1: ログイン→ロール別ホーム
□ TC2: クライアント選択→KPI切替
□ TC3: タスク追加→連鎖反映
□ TC4: 承認操作→通知/KPI反映
□ TC5: コメント→noReply増減
□ TC6: 契約追加→KPI変化
□ TC7: RLS動作確認（Clientロールで他社データ0件）
□ TC8: SSOT信頼性（Consistency Check）
□ TC9: Incremental Pull（Full→Incremental切替）

Day 13: 運用準備
□ 監視設定（Supabase Dashboard）
□ アラート設定（Slack Webhook or Email）
  - Outbox Failed > 5件
  - autoPull連続失敗 > 3回
  - Performance > 2000ms
□ バックアップ設定（日次自動バックアップ有効化）
□ 運用ドキュメント確認（OPS_RUNBOOK.md読み合わせ）
```

---

### Week 4: リリース準備（2日）

**担当**: Backend Engineer + Frontend Engineer + PM

```
Day 14: 統合テスト
□ フロント→バックエンド連携テスト
□ Outbox→バックエンドAPI連携テスト
□ autoPull（Incremental）動作確認
□ Performance計測（Avg Duration < 500ms確認）

Day 15: リリース
□ RELEASE_CHECKLIST.md実施
□ 環境変数確認（Production）
□ フロントエンドデプロイ
□ バックエンドデプロイ
□ リリース後監視（24時間）
```

---

## 🚫 UI変更ゼロ宣言

### 変更対象（DEVパネルのみ）

以下のUI**のみ**変更を許可：
- ✅ QAパネル（Ctrl+Shift+D）
  - Auth Tab
  - Sync Tab
  - Outbox Tab
  - Performance Tab
  - Incremental Tab
  - Navigator Tab

### 変更禁止（既存UI）

以下のUIは**一切変更しない**：
- ❌ ホーム画面（Sales/Direction/Client）
- ❌ クライアント一覧/詳細
- ❌ タスク一覧/詳細
- ❌ 承認一覧/詳細
- ❌ コメント投稿UI
- ❌ 契約一覧/詳細
- ❌ 通知一覧
- ❌ サイドバー（Icon Rail + Context Drawer）
- ❌ テーマ切替UI（PALSS MODE/DARK/FEMINE）

**理由**: 既存UIは完成済み、ユーザー受け入れ済み、変更リスク回避

---

## 📊 成果物サマリー

### ドキュメント総量

- **総ページ数**: 約1,800ページ
- **総行数**: 約15,000行（SQL含む）
- **総ファイル数**: 17ファイル

### Phase別内訳

| Phase | ファイル数 | ページ数 | 主要内容 |
|-------|----------|---------|---------|
| **Phase 10** | 2 | 230 | DoD、RBAC、受入テスト |
| **Phase 11** | 3 | 250 | API契約、OpenAPI、実装ガイド |
| **Phase 12** | 6 | 700 | ERD、RLS、SQL、マイグレーション |
| **Phase 13** | 7 | 620 | 運用、障害対応、リリース、セキュリティ、監査、監視、バックアップ |

---

## 🎯 品質保証

### 整合性チェック（5項目）

- ✅ RBAC整合性: SSOT ↔ RLS ↔ SQL（完全一致）
- ✅ API ↔ ERD整合性（完全一致）
- ✅ Incremental Pull整合性（完全一致）
- ✅ 受入テスト ↔ 主要フロー整合性（一致）
- ✅ SSOT ↔ 運用Runbook整合性（一致）

### レビュー状況

| 項目 | 担当 | 状態 |
|------|------|------|
| 仕様SSOT | Product QA | ✅ 完了 |
| API契約 | Tech Lead | ✅ 完了 |
| ERD/RLS | DB Engineer | ✅ 完了 |
| 運用設計 | SRE | ✅ 完了 |

---

## 📞 連絡先

| 役割 | 担当者 | 対応範囲 |
|------|--------|---------|
| **Product QA** | - | 仕様、受入テスト |
| **Tech Lead** | - | API設計、アーキテクチャ |
| **DB Engineer** | - | ERD、RLS、SQL |
| **SRE** | - | 運用、監視、障害対応 |
| **Frontend Lead** | - | UI実装、Outbox/autoPull |

---

## 🔗 関連リンク

### 内部ドキュメント

- [PALSS_SYSTEM_SSOT.md](./PALSS_SYSTEM_SSOT.md) - 仕様SSOT（Phase 10）
- [API_CONTRACT.md](./API_CONTRACT.md) - API契約（Phase 11）
- [ERD.md](./ERD.md) - ERD仕様（Phase 12）
- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 運用手順（Phase 13）

### 外部リソース

- [Supabase Docs](https://supabase.com/docs)
- [OpenAPI Spec](https://swagger.io/specification/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ✅ 最終チェックリスト

### バックエンド実装開始前

- [x] Phase 10-13 全成果物完成
- [x] 整合性チェック完了（5項目）
- [ ] 未決事項決定（6件）← **要対応**
- [ ] Supabaseプロジェクト作成
- [ ] 開発環境準備

### リリース前

- [ ] 受入テスト完了（TC1-TC9）
- [ ] RLS動作確認（Clientロールで他社データ0件）
- [ ] Performance確認（Avg Duration < 500ms）
- [ ] 運用準備完了（監視/アラート/バックアップ）

---

**End of Backend Handoff Summary**

**Status**: ✅ 引き渡し準備完了（未決事項6件の決定待ち）  
**Next Action**: 未決事項1（activity_log）の即決 → Supabaseセットアップ開始