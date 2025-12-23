# Phase 8.5: Incremental Pull テスト実施クイックリファレンス

**目的**: Phase 8.5受入テスト（TC1-TC6）を素早く実施するためのチェックリスト

---

## ⚡ クイックスタート

### 前提条件（5分）

- [ ] Supabase接続完了
- [ ] dataMode=supabase
- [ ] ブラウザ2-3個準備（Chrome/Firefox/Edge）
- [ ] 各ブラウザでログイン
  - ブラウザA: Sales
  - ブラウザB: Direction
  - ブラウザC: Client
- [ ] QAパネル（Ctrl+Shift+D）動作確認

---

## 🧪 TC1: 初回Full Pull（5分）

**ブラウザA（Sales）**:

1. Ctrl+Shift+D → QAパネル
2. Incrementalタブ
3. "Reset State（全テーブル）"
4. "Full Pull Now（全テーブル）"
5. 待機（実行完了）
6. **記録**:
   - IncrementalTab: 各テーブルのPull種別が"Full Pull"
   - PerformanceTab: Total Duration [    ] ms
   - PerformanceTab: Total Count [    ] 件

**✅ Pass条件**:
- Pull種別 = "Full Pull"
- lastFullPulledAtが設定されている
- Total Duration: 1500-4500ms
- Total Count > 0

---

## 🧪 TC2: Incremental Pull差分0（5分）

**ブラウザA（Sales）**:

1. TC1実行直後（データ変更なし）
2. 60秒待機（または手動Pull）
3. **記録**:
   - IncrementalTab: 各テーブルのPull種別が"Incremental Pull"
   - PerformanceTab: Total Duration [    ] ms
   - PerformanceTab: Total Count [    ] 件
4. **計算**:
   - 改善率 = (TC1時間 - TC2時間) / TC1時間 × 100 = [  ]%

**✅ Pass条件**:
- Pull種別 = "Incremental Pull"
- Total Duration: 50-300ms
- Total Count = 0
- 改善率 > 90%

---

## 🧪 TC3: 差分データマージ（10分）

**ブラウザA（Sales）**:

1. クライアント選択
2. タスクを1件追加（またはQAパネル → テストデータで生成）
3. タスクID/タイトルを記録: [          ]
4. 60秒待機（autoPull自動実行）
5. **記録**:
   - IncrementalTab: tasksの取得件数 [  ] 件
   - PerformanceTab: tasks [  ] ms, [  ] 件
6. タスク一覧画面で追加タスク表示確認

**✅ Pass条件**:
- Pull種別 = "Incremental Pull"
- tasksの取得件数 ≥ 1
- 画面に追加タスクが表示される

---

## 🧪 TC4: エラー時据え置き（10分）

**ブラウザA（Sales）**:

1. F12 → Networkタブ → Throttling → Offline
2. IncrementalTab: 現在のlastPulledAtを記録
   - clients: [                    ]
   - tasks: [                      ]
3. 60秒待機（autoPull失敗）
4. IncrementalTab: lastPulledAtが据え置き確認
   - clients: [                    ] ← 変わらない
   - tasks: [                      ] ← 変わらない
5. IncrementalTab: エラーメッセージ表示確認
6. Network → Throttling → No throttling（復旧）
7. 60秒待機（autoPull再実行）
8. IncrementalTab: lastPulledAtが更新されたことを確認

**✅ Pass条件**:
- エラー時にlastErrorが表示される
- エラー時にlastPulledAtが据え置かれる
- 復旧後に正常Pull成功
- 復旧後にlastPulledAtが更新される

---

## 🧪 TC5: RLS動作確認（10分）

**ブラウザC（Client）**:

1. Clientでログイン（例: client_a_user）
2. Ctrl+Shift+D → QAパネル
3. Incrementalタブ → "Reset State（全テーブル）"
4. "Full Pull Now（全テーブル）"
5. **記録**:
   - PerformanceTab: clients [  ] 件（期待: 1件）
   - PerformanceTab: tasks [  ] 件
   - PerformanceTab: contracts [  ] 件
6. 画面でデータ確認:
   - クライアント一覧: 自社のみ表示
   - タスク一覧: 自社のみ表示
   - 契約一覧: 自社のみ表示

**✅ Pass条件**:
- clientsの取得件数 = 1（自社のみ）
- 画面に他社データが表示されない
- RLSが正しく機能している

---

## 🧪 TC6: ブラウザ間同期（15分）

**ブラウザA（Sales）とブラウザB（Direction）を並べて表示**:

1. 両ブラウザで同じクライアントを選択
2. **ブラウザA**: タスクにコメントを1件追加
   - コメント内容: [                    ]
   - タスクID: [          ]
   - 投稿日時: [          ]
3. **ブラウザB**: 60秒待機（autoPull自動実行）
4. **ブラウザB**: IncrementalTab確認
   - comments取得件数: [  ] 件
5. **ブラウザB**: タスク詳細画面で追加コメント表示確認

**✅ Pass条件**:
- ブラウザBでIncremental Pull実行
- commentsの取得件数 ≥ 1
- ブラウザBの画面に追加コメント表示
- 所要時間 ≤ 60秒

---

## 📊 結果記録（5分）

### テスト結果サマリー

| TC | 結果 | 備考 |
|----|------|------|
| TC1 | [ ] Pass / [ ] Fail | |
| TC2 | [ ] Pass / [ ] Fail | |
| TC3 | [ ] Pass / [ ] Fail | |
| TC4 | [ ] Pass / [ ] Fail | |
| TC5 | [ ] Pass / [ ] Fail | |
| TC6 | [ ] Pass / [ ] Fail | |

### パフォーマンス改善

```
TC1（Full Pull）:
- Total Duration: [     ] ms
- Total Count: [     ] 件

TC2（Incremental Pull）:
- Total Duration: [     ] ms
- Total Count: [     ] 件

改善率:
- 実行時間: [   ]% 短縮
- 取得件数: [   ]% 削減
```

### 問題（あれば）

```
[問題があれば記載]
```

---

## ✅ 完了後のアクション

1. [ ] `/PHASE8.5_IMPLEMENTATION_REPORT.md` に結果を転記
2. [ ] ステータスを「受入テスト完了」に更新
3. [ ] Phase 8.5完了を宣言

---

## 💡 Tips

**IncrementalTabが見つからない場合**:
- QAパネル → タブ一覧 → 一番右の「インクリメンタル」

**autoPullが実行されない場合**:
- QAパネル → 同期タブ → autoPull有効化確認
- dataMode=supabaseになっているか確認

**差分が取得されない場合**:
- IncrementalタブでlastPulledAtを確認
- データ追加のタイムスタンプがlastPulledAtより新しいか確認

**RLSで他社データが表示される場合**:
- Supabase RLSポリシー確認
- ログインユーザーのclient_id確認

---

**所要時間**: 合計60分（TC1-TC6 + 記録）

**完了後、Phase 8.5は100%完成です！🎉**
