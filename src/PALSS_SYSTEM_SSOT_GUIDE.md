# PALSS SYSTEM SSOT — 使い方ガイド

**ドキュメント**: `/PALSS_SYSTEM_SSOT.md`  
**対象読者**: バックエンド実装チーム、QA、プロダクトマネージャー  
**目的**: 仕様の唯一の真実（SSOT）として、実装・検証・意思決定に使用

---

## 📖 ドキュメント構成

### A) Definition of Done（完成定義）

**目的**: 本番運用可能な状態を明確化

**使い方**:
- チェックリストとして進捗管理に使用
- スプリントゴールの判定基準として使用
- リリース判断の最終確認として使用

**カテゴリ**:
1. 認証・権限（Auth/RLS）
2. データ整合（SSOT、Outbox、Sync、Incremental Pull）
3. 主要機能（タスク/承認/コメント/契約/通知）
4. アラート（5種）
5. KPI（Direction/Sales）
6. 監視・パフォーマンス
7. 画面品質
8. テスト

---

### B) RBAC（ロール×操作権限表）

**目的**: 誰が何をできるかを明確化

**使い方**:
- RLS実装の設計書として使用
- 権限エラーのデバッグに使用
- 新機能追加時の権限設計の参照として使用

**重要ポイント**:
- **承認操作**: Direction/Controlのみ
- **契約管理**: Sales/Controlのみ
- **通知**: 既読操作のみ、作成はシステム自動
- **Client**: 全て自社client_idのみ、書き込みはコメントのみ

**RLS実装方針**:
```sql
-- 社内ロール
WHERE org_id = auth.jwt() ->> 'org_id'

-- Clientロール
WHERE client_id = auth.jwt() ->> 'client_id'

-- 通知（自分宛のみ）
WHERE user_id = auth.uid()
```

---

### C) 画面状態（State仕様）

**目的**: 全画面で一貫した状態管理

**使い方**:
- フロントエンド実装の設計書として使用
- エラーハンドリングの網羅性確認に使用
- UXレビュー時の参照として使用

**共通状態**:
- Loading: データ取得中
- Empty: データ0件
- Error: 取得失敗
- Forbidden (403): 権限なし
- NotFound (404): リソースなし
- Success: データ取得成功

**主要画面**:
- Login/Landing
- 各Board Home
- Client Detail
- Task List/Detail
- Approvals Center
- Messages（コメント）
- Contracts（契約）

---

### D) 受入テスト（Given/When/Then）

**目的**: 実装完了の判定基準を明確化

**使い方**:
- QAテストケースとして使用
- 自動テストのシナリオとして使用
- バグ再現手順の参照として使用

**テストケース**:
1. **TC1**: ログイン→ロール別ホーム
2. **TC2**: クライアント選択→カード/KPI/アラートが切替
3. **TC3**: タスク追加→期限/アラート/KPI/通知へ連鎖反映
4. **TC4**: 承認（承認/差し戻し）→通知/アラート/KPI反映
5. **TC5**: コメント（Client→Team）→noReply増、返信で減
6. **TC6**: 契約追加/更新期限→contractRenewal/KPI変化
7. **TC7**: RLS（Clientは自社のみ、他社は0件）
8. **TC8**: SSOT信頼性（outbox failed可視化、retryで回復）
9. **TC9**: Incremental Pull（初回Full→2回目以降差分、lastPulledAt更新、エラー時据え置き）

---

### E) 未決項目（意思決定ポイント）

**目的**: 実装前に決定が必要な項目を明確化

**使い方**:
- プロダクト会議のアジェンダとして使用
- ステークホルダーへの質問リストとして使用
- Phase 2以降の検討項目として使用

**未決項目**:
1. Clientロールの書き込み権限（契約/タスク）
2. 削除伝搬（deleted_at vs 物理削除）
3. Realtime導入（notifications/comments/tasks）
4. KPI期限基準（納期遵守率の計算方法）
5. 承認操作の範囲（EditorやCreatorも可能にするか）
6. autoPull間隔（固定 vs 動的）

**推奨**:
- 初期リリースは保守的に（Clientは閲覧のみ、物理削除、autoPull 60秒固定）
- Phase 2以降で段階的に拡張

---

## 🚀 バックエンド実装の流れ

### ステップ1: DB設計（1-2日）

1. `/PALSS_SYSTEM_SSOT.md` → 「データモデル（最終確認）」を参照
2. Supabase schema.sqlを作成
3. インデックス・トリガーを定義
4. ローカル環境でマイグレーション実行

**チェックポイント**:
- [ ] 全6テーブル作成完了
- [ ] インデックス作成完了（org_id, client_id, updated_at, created_at）
- [ ] updated_atトリガー作成完了

---

### ステップ2: RLS実装（2-3日）

1. `/PALSS_SYSTEM_SSOT.md` → 「RBAC（ロール×操作権限表）」を参照
2. テーブル別にRLSポリシーを作成
3. JWT Custom Claimsに org_id / client_id / role を追加
4. ローカル環境でRLS動作確認

**チェックポイント**:
- [ ] clients RLS完了（org_id / client_id分離）
- [ ] tasks RLS完了（org_id / client_id分離）
- [ ] approvals RLS完了（org_id / client_id分離）
- [ ] comments RLS完了（org_id / client_id分離）
- [ ] contracts RLS完了（org_id / client_id分離）
- [ ] notifications RLS完了（user_id分離）

---

### ステップ3: Auth実装（1-2日）

1. Supabase Auth設定（Email/Password）
2. ログイン/ログアウトAPI実装
3. JWT Custom Claims設定
4. ロール別リダイレクト実装

**チェックポイント**:
- [ ] ログイン機能完了
- [ ] ログアウト機能完了
- [ ] JWT発行確認（org_id / client_id / role含む）
- [ ] ロール別ホームリダイレクト確認

---

### ステップ4: API実装（3-5日）

1. CRUD API実装（または Supabase Client直接利用）
2. getXXXIncremental（差分取得）実装
3. Outbox retry機能実装

**チェックポイント**:
- [ ] 全6テーブルのCRUD完了
- [ ] getXXXIncremental完了（全6テーブル）
- [ ] Outbox retry UI完了

---

### ステップ5: 受入テスト（3-5日）

1. `/PALSS_SYSTEM_SSOT.md` → 「受入テスト（Given/When/Then）」を参照
2. TC1-TC9を順番に実施
3. 結果を記録（Pass/Fail）
4. 不具合があれば修正→再テスト

**チェックポイント**:
- [ ] TC1: ログイン→ロール別ホーム Pass
- [ ] TC2: クライアント選択→KPI切替 Pass
- [ ] TC3: タスク追加→連鎖反映 Pass
- [ ] TC4: 承認操作→通知/KPI反映 Pass
- [ ] TC5: コメント→noReply増減 Pass
- [ ] TC6: 契約追加→KPI変化 Pass
- [ ] TC7: RLS動作確認 Pass
- [ ] TC8: SSOT信頼性 Pass
- [ ] TC9: Incremental Pull Pass

---

## 📋 よくある質問（FAQ）

### Q1: Clientロールで契約を作成できますか？

**A**: 現状の仕様では**できません**。契約作成はSales/Controlのみです。  
Phase 2でClient主導の契約提案機能を検討予定。

### Q2: 承認操作はどのロールができますか？

**A**: **Direction/Controlのみ**です。  
Sales/Editor/Creator等は承認申請のみ可能です。

### Q3: 削除操作はどうなりますか？

**A**: 現状は**物理削除（DELETE）**です。  
Phase 8.6で論理削除（deleted_at）導入を検討中。

### Q4: Realtimeはどこで使いますか？

**A**: 現状は**autoPull（60秒間隔）**のみです。  
Phase 10でnotifications/commentsのみRealtime試験導入を検討中。

### Q5: autoPullの実行間隔は変更できますか？

**A**: 現状は**60秒固定**です。  
Phase 10で動的調整（環境やトラフィックに応じて）を検討中。

### Q6: Incremental Pullはどのくらい速いですか？

**A**: **97-98%の時間短縮**が期待されます。  
- Full Pull: 1500-4500ms、37,500件
- Incremental Pull: 50-300ms、10-50件

### Q7: RLSで他社データが見えてしまう場合は？

**A**: RLSポリシーの不具合です。以下を確認してください：
- JWT Custom Claimsに正しいorg_id/client_idが含まれているか
- RLSポリシーで`WHERE org_id = auth.jwt() ->> 'org_id'`が正しく設定されているか
- TC7（RLS動作確認）を実施してください

### Q8: Outboxが失敗し続ける場合は？

**A**: QAパネル → Outboxタブで以下を確認：
- エラーメッセージ（ネットワーク/権限/スキーマエラー等）
- "Retry All Failed"で手動リトライ
- それでも失敗する場合はログを確認してバグ修正

---

## 🎯 実装優先度

### Phase 10（本番リリース準備） — 必須

1. **Auth/RLS完全実装**: TC1, TC7でPass
2. **Outbox retry UI**: TC8でPass
3. **Incremental Pull検証**: TC9でPass
4. **受入テスト完了**: TC1-TC9全てPass

### Phase 11（本番後の改善） — 推奨

1. **削除伝搬（deleted_at）**: 論理削除導入
2. **Realtime通知**: notifications/commentsのみ
3. **Client書き込み権限**: 契約提案・タスク作成
4. **パフォーマンス最適化**: autoPull間隔動的調整

---

## ✅ リリース判定チェックリスト

### 本番リリース可否判定

- [ ] **DoD完了**: 全8カテゴリのチェック完了
- [ ] **RBAC実装**: 全ロール×全リソースのRLS実装完了
- [ ] **画面状態**: 主要7画面で全6状態の対応完了
- [ ] **受入テスト**: TC1-TC9全てPass
- [ ] **未決項目**: 全6項目の意思決定完了（またはPhase 2送り）
- [ ] **パフォーマンス**: Incremental Pull効果確認（97-98%短縮）
- [ ] **SSOT**: Outbox retry成功率95%以上

**全てチェックできたら本番リリース可能！**

---

## 📊 成果物一覧

### 仕様ドキュメント

- `/PALSS_SYSTEM_SSOT.md` - 仕様SSOT（本体）
- `/PALSS_SYSTEM_SSOT_GUIDE.md` - 使い方ガイド（本ドキュメント）

### 実装ドキュメント

- `/PHASE8.5_IMPLEMENTATION_REPORT.md` - Incremental Pull実装レポート
- `/PHASE8.5_TEST_GUIDE.md` - 受入テストガイド
- `/PALSS_SYSTEM_SPECIFICATION.md` - システム仕様書

### テストドキュメント

- `/PHASE8.5_TEST_QUICKREF.md` - テストクイックリファレンス

---

## 🎉 まとめ

**PALSS SYSTEM SSOT**は、バックエンド実装に必要な全ての仕様を1枚にまとめた「唯一の真実」です。

**使い方**:
1. **DB設計**: データモデルを参照
2. **RLS実装**: RBAC表を参照
3. **API実装**: 受入テストを参照
4. **QA**: 受入テストを実施
5. **意思決定**: 未決項目を協議

このドキュメントを基に、**迷いなく実装・検証**が進むことを目指しています。

**次のアクション**:
1. バックエンドチームへSSOU共有
2. 未決項目（E）の意思決定ミーティング設定
3. Phase 10実装開始（DoD チェックリストで進捗管理）

---

**Happy Coding! 🚀**
