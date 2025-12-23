# Phase 8.5: Incremental Pull 受入テスト実施ガイド

**テスト実施者向け**: このガイドに従ってTC1-TC6を実施し、結果を記録してください。

---

## 📋 テスト環境セットアップ

### 前提条件チェックリスト

- [ ] Supabase接続済み（schema/RLS/seed/indexes適用済み）
- [ ] Authログイン可能（社内ロール: Sales/Direction、Clientロール）
- [ ] dataMode=supabase で運用中
- [ ] QAパネル（Ctrl+Shift+D）でIncrementalタブ表示可能
- [ ] QAパネルでPerformanceタブ表示可能
- [ ] ブラウザ2-3個準備（Chrome/Firefox/Edge等）

### テスト用ブラウザ

| ブラウザ | ロール | 用途 |
|----------|--------|------|
| ブラウザA | Sales（社内） | データ変更・追加 |
| ブラウザB | Direction（社内） | 同期確認 |
| ブラウザC | Client（顧客） | RLS確認 |

---

## 🧪 TC1: 初回Full Pull

### 目的
lastPulledAt=nullの場合、全件取得（Full Pull）されることを確認

### 手順

1. **ブラウザAでログイン**（Sales）
2. **QAパネルを開く**（Ctrl+Shift+D）
3. **Incrementalタブに移動**
4. **状態リセット**:
   - "Reset State（全テーブル）"ボタンをクリック
   - 確認ダイアログでOK
5. **Performanceタブに移動**
6. **autoPull実行を待つ**（60秒以内、または"Full Pull Now"で即時実行）
7. **結果記録**:

#### 記録項目（TC1）

**IncrementalTab（実行後）**:
```
テーブル | Pull種別 | lastPulledAt | lastFullPulledAt
---------|----------|--------------|------------------
clients  | [      ] | [          ] | [              ]
tasks    | [      ] | [          ] | [              ]
approvals| [      ] | [          ] | [              ]
comments | [      ] | [          ] | [              ]
contracts| [      ] | [          ] | [              ]
notifications| [  ] | [          ] | [              ]
```

**PerformanceTab（Last Pull）**:
```
Total Duration: [     ] ms
Breakdown:
- clients: [   ] ms, [   ] 件
- tasks: [   ] ms, [   ] 件
- approvals: [   ] ms, [   ] 件
- comments: [   ] ms, [   ] 件
- contracts: [   ] ms, [   ] 件
- notifications: [   ] ms, [   ] 件
```

**期待結果**:
- [ ] 全テーブルでPull種別が"Full Pull"
- [ ] lastFullPulledAtが設定されている（ISO 8601形式）
- [ ] lastPulledAtが設定されている
- [ ] Total Durationが1500-4500ms程度（環境による）
- [ ] 各テーブルで件数 > 0

**実測結果**: Pass / Fail / 備考:

---

## 🧪 TC2: 2回目以降Incremental Pull（差分0）

### 目的
lastPulledAt!=nullで差分がない場合、Incremental Pullで高速化されることを確認

### 手順

1. **TC1実行直後**（データ変更なし）
2. **Incrementalタブで"Full Pull Now（全テーブル）"の横の"状態を再読み込み"をクリック**（現在の状態確認）
3. **60秒待つ**（または手動でPerformanceタブから次回Pull実行）
4. **結果記録**:

#### 記録項目（TC2）

**IncrementalTab（実行後）**:
```
テーブル | Pull種別 | 経過時間
---------|----------|----------
clients  | [      ] | [      ]
tasks    | [      ] | [      ]
approvals| [      ] | [      ]
comments | [      ] | [      ]
contracts| [      ] | [      ]
notifications| [  ] | [      ]
```

**PerformanceTab（Last Pull）**:
```
Total Duration: [     ] ms
Breakdown:
- clients: [   ] ms, [   ] 件
- tasks: [   ] ms, [   ] 件
- approvals: [   ] ms, [   ] 件
- comments: [   ] ms, [   ] 件
- contracts: [   ] ms, [   ] 件
- notifications: [   ] ms, [   ] 件
```

**改善率計算**:
```
TC1 Total Duration: [     ] ms
TC2 Total Duration: [     ] ms
改善率: [(TC1-TC2)/TC1 * 100] = [   ]%
```

**期待結果**:
- [ ] 全テーブルでPull種別が"Incremental Pull"
- [ ] Total Durationが50-300ms程度（環境による）
- [ ] 各テーブルで件数 = 0（差分なし）
- [ ] 改善率が90%以上

**実測結果**: Pass / Fail / 備考:

---

## 🧪 TC3: 差分データマージ

### 目的
差分データが正しく取得・マージされ、画面に反映されることを確認

### 手順

1. **ブラウザAでタスクを1件追加**:
   - 任意のクライアントを選択
   - タスクを追加（QAパネルのテストデータ生成でもOK）
   - タスクIDとタイトルを記録
2. **60秒待つ**（autoPull自動実行）
3. **Incrementalタブで確認**:
   - tasksの取得件数を確認
4. **Performanceタブで確認**:
   - tasksのcountsを確認
5. **タスク一覧画面で確認**:
   - 追加したタスクが表示されているか

#### 記録項目（TC3）

**追加データ**:
```
タスクID: [          ]
タスクタイトル: [                    ]
クライアント: [                      ]
追加日時: [                          ]
```

**IncrementalTab（実行後）**:
```
テーブル | Pull種別 | 取得件数
---------|----------|----------
tasks    | [      ] | [   ] 件
```

**PerformanceTab（Last Pull）**:
```
Total Duration: [     ] ms
tasks: [   ] ms, [   ] 件
```

**画面表示確認**:
- [ ] タスク一覧に追加したタスクが表示されている
- [ ] タスク詳細が正しい（タイトル、クライアント、ステータス等）

**期待結果**:
- [ ] Pull種別が"Incremental Pull"
- [ ] tasksの取得件数が1件以上
- [ ] Total Durationが50-300ms程度
- [ ] 画面に追加タスクが表示される

**実測結果**: Pass / Fail / 備考:

---

## 🧪 TC4: エラー時lastPulledAt据え置き

### 目的
Pull失敗時にlastPulledAtが更新されず、次回再試行できることを確認

### 手順

1. **ブラウザAで開発者ツールを開く**（F12）
2. **NetworkタブでOfflineモードにする**:
   - Chrome: Network → Throttling → Offline
   - Firefox: Network → Throttling → Offline
3. **Incrementalタブで現在のlastPulledAtを記録**
4. **60秒待つ**（autoPull実行されるがエラー）
5. **Incrementalタブでエラー表示を確認**
6. **lastPulledAtが変わっていないことを確認**
7. **ネットワークを復旧**（Offlineモード解除）
8. **60秒待つ**（autoPull再実行）
9. **Incrementalタブで正常復旧を確認**

#### 記録項目（TC4）

**エラー前**:
```
clients lastPulledAt: [                    ]
tasks lastPulledAt: [                      ]
```

**エラー時**:
```
エラーメッセージ（IncrementalTab）: [                    ]
clients lastPulledAt: [                    ]
tasks lastPulledAt: [                      ]
```

**復旧後**:
```
clients lastPulledAt: [                    ]
tasks lastPulledAt: [                      ]
Pull成功: Yes / No
```

**期待結果**:
- [ ] エラー時にlastErrorが表示される
- [ ] エラー時にlastPulledAtが据え置かれる（変わらない）
- [ ] 復旧後に正常にPullが実行される
- [ ] 復旧後にlastPulledAtが更新される

**実測結果**: Pass / Fail / 備考:

---

## 🧪 TC5: RLS動作確認（Clientロール）

### 目的
Clientロールで自社データのみ取得されることを確認

### 手順

1. **ブラウザCでClientログイン**:
   - ログアウト → Clientロール（例: client_a_user）でログイン
2. **QAパネルを開く**（Ctrl+Shift+D）
3. **Incrementalタブで"Reset State（全テーブル）"**
4. **"Full Pull Now（全テーブル）"を実行**
5. **PerformanceTabで取得件数を確認**
6. **画面でデータ確認**:
   - クライアント一覧: 自社のみ
   - タスク一覧: 自社のみ
   - 契約一覧: 自社のみ

#### 記録項目（TC5）

**ログインユーザー**:
```
ロール: Client
ユーザーID: [          ]
client_id: [           ]
```

**PerformanceTab（Full Pull）**:
```
Total Duration: [     ] ms
Breakdown:
- clients: [   ] ms, [   ] 件
- tasks: [   ] ms, [   ] 件
- approvals: [   ] ms, [   ] 件
- comments: [   ] ms, [   ] 件
- contracts: [   ] ms, [   ] 件
- notifications: [   ] ms, [   ] 件
```

**画面表示確認**:
- [ ] クライアント一覧に自社のみ表示（他社なし）
- [ ] タスク一覧に自社のみ表示
- [ ] 契約一覧に自社のみ表示

**期待結果**:
- [ ] clientsの取得件数が1件（自社のみ）
- [ ] tasksの取得件数が自社のもののみ
- [ ] 画面に他社データが表示されない
- [ ] RLSが正しく機能している

**実測結果**: Pass / Fail / 備考:

---

## 🧪 TC6: ブラウザ間同期

### 目的
ブラウザAの変更がブラウザBで差分取得により反映されることを確認

### 手順

1. **ブラウザAとBを並べて表示**（両方ともSalesまたはDirectionでログイン）
2. **両ブラウザで同じクライアントを選択**
3. **ブラウザAでコメントを1件追加**:
   - 任意のタスクにコメント投稿
   - コメント内容を記録
4. **ブラウザBで60秒待つ**（autoPull自動実行）
5. **ブラウザBのIncrementalタブで確認**:
   - commentsの取得件数を確認
6. **ブラウザBの画面で確認**:
   - 追加したコメントが表示されているか

#### 記録項目（TC6）

**ブラウザA操作**:
```
追加コメント: [                          ]
タスクID: [          ]
投稿日時: [          ]
```

**ブラウザB（autoPull前）**:
```
コメント表示: なし
```

**ブラウザB（autoPull後）**:
```
IncrementalTab commentsカウント: [   ] 件
PerformanceTab comments: [   ] ms, [   ] 件
画面表示: あり / なし
```

**期待結果**:
- [ ] ブラウザBでIncremental Pullが実行される
- [ ] commentsの取得件数が1件以上
- [ ] ブラウザBの画面に追加コメントが表示される
- [ ] 所要時間が60秒以内（autoPull間隔）

**実測結果**: Pass / Fail / 備考:

---

## 📊 テスト結果サマリー

### テスト実施情報

```
実施日: [YYYY-MM-DD]
実施者: [          ]
環境:
- Supabaseプロジェクト: [          ]
- ブラウザA: [          ]
- ブラウザB: [          ]
- ブラウザC: [          ]
```

### テストケース結果

| TC | テスト項目 | 結果 | 備考 |
|----|-----------|------|------|
| TC1 | 初回Full Pull | [ ] Pass / [ ] Fail | |
| TC2 | Incremental Pull（差分0） | [ ] Pass / [ ] Fail | |
| TC3 | 差分データマージ | [ ] Pass / [ ] Fail | |
| TC4 | エラー時据え置き | [ ] Pass / [ ] Fail | |
| TC5 | RLS動作確認 | [ ] Pass / [ ] Fail | |
| TC6 | ブラウザ間同期 | [ ] Pass / [ ] Fail | |

### パフォーマンス改善実測

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

### 発生した問題と対処

```
[問題があれば記載]
```

### UI変更確認

- [ ] 既存UIの見た目変更なし（レイアウト/色/余白/フォント/テキスト）
- [ ] DEVパネル（IncrementalTab）のみ追加
- [ ] 既存機能への影響なし

---

## 🎯 次のアクション

テスト完了後、この結果を `/PHASE8.5_IMPLEMENTATION_REPORT.md` に転記してください。

### レポート更新手順

1. `/PHASE8.5_IMPLEMENTATION_REPORT.md` を開く
2. 「受入テスト結果」セクションに結果を記載
3. パフォーマンス改善実測値を更新
4. 問題があれば「既知の問題」セクションに追記
5. ステータスを「受入テスト完了」に更新

---

## 📝 補足

### トラブルシューティング

**Q: autoPullが実行されない**
- A: QAパネル → 同期タブでautoPull有効化を確認
- A: dataMode=supabaseになっているか確認

**Q: IncrementalタブでlastPulledAtが更新されない**
- A: ブラウザのコンソールでエラー確認
- A: Supabase接続確認（認証タブ）

**Q: 差分が取得されない**
- A: データ追加後、updated_at/created_atが更新されているか確認
- A: IncrementalタブでlastPulledAtを確認（追加データのタイムスタンプより古いか）

**Q: RLSで他社データが表示される**
- A: Supabase RLSポリシー確認
- A: ログインユーザーのclient_id確認

---

**このガイドを使ってTC1-TC6を実施し、結果を記録してください。**
**全テスト完了後、レポートを更新して Phase 8.5 を完了させてください。**
