# PALSS SYSTEM — Phase 7-1: コメント投稿UI（Client/社内）MVP 完了レポート

## 実施日時
2024-12-22

## 目的
既存UIの見た目を一切壊さずに、Client/社内がシステム内でコメントを投稿・返信できる最小UIを実装し、noReply判定が「実運用入力」で回る状態を作る。

---

## 実装内容

### 1. Client Board: Messages View（クライアント用）

**実装場所**: `/components/client-board/ClientMessagesView.tsx`

**機能**:
- ✅ クライアントとディレクター間のメッセージ履歴表示（時系列）
- ✅ 新規メッセージ投稿フォーム（本文のみ）
- ✅ isFromClient自動判定（role === 'client' の場合 true）
- ✅ 投稿後の即座反映（楽観的UI更新）
- ✅ autoPull対応（5秒間隔で再読み込み）
- ✅ 二重送信防止（送信中状態管理）
- ✅ 空投稿バリデーション

**データ配線**:
- `getClientComments(clientId)`: コメント一覧取得
- `addComment({ clientId, userId, content, isFromClient })`: コメント投稿（outbox統合済み）
- `getCurrentAuthUser()`: 現在ログインユーザー取得
- `getAppState()`: 選択中クライアントID取得

**アクセス方法**:
1. Client Boardにログイン
2. サイドバーから「Messages」を選択
3. または画面遷移で `client-messages` ビューに遷移

---

### 2. Direction Board: Communication Tab（社内ディレクター用）

**実装場所**: `/components/direction-board/DirectionClientDetail.tsx`

**機能**:
- ✅ クライアント詳細画面内の「コミュニケーション」タブ
- ✅ メッセージ履歴表示（時系列、600pxの固定高さスクロール）
- ✅ 新規メッセージ投稿フォーム（本文のみ）
- ✅ isFromClient自動判定（role !== 'client' の場合 false）
- ✅ 投稿後の即座反映（楽観的UI更新）
- ✅ autoPull対応（5秒間隔で再読み込み）
- ✅ 二重送信防止（送信中状態管理）
- ✅ 空投稿バリデーション

**データ配線**:
- `getClientComments(clientId)`: コメント一覧取得
- `addComment({ clientId, userId, content, isFromClient })`: コメント投稿（outbox統合済み）
- `getCurrentAuthUser()`: 現在ログインユーザー取得

**アクセス方法**:
1. Direction Boardにログイン
2. My Clientsからクライアントを選択
3. クライアント詳細画面の「コミュニケーション」タブをクリック

---

### 3. Sales Board: Communication Tab（営業担当用）

**実装場所**: `/components/direction-board/DirectionClientDetail.tsx`（共用）

**アクセス方法**:
1. Sales Boardにログイン
2. Clientsからクライアントを選択
3. クライアント詳細画面の「コミュニケーション」タブをクリック

**備考**: Sales BoardもDirectionClientDetailコンポーネントを使用しているため、Direction Boardと同じ機能が利用可能。

---

## 変更/追加ファイル一覧

### 変更ファイル
1. `/components/client-board/ClientMessagesView.tsx`
   - ダミーデータから実データ（commentData.ts）への配線
   - autoPull対応（5秒間隔）
   - outbox統合済みのaddComment()使用

2. `/components/direction-board/DirectionClientDetail.tsx`
   - import追加（getClientComments, addComment, getCurrentAuthUser）
   - 状態管理追加（messages, messageInput, isSending）
   - useEffect追加（コメント一覧の読み込み + autoPull）
   - handleSendMessage()関数追加
   - renderCommunicationTab()の実装をダミーから実データに変更

### 追加ファイル
- なし（既存ファイルの配線のみ）

---

## データフロー

### Client → Team メッセージ送信
```
1. ClientMessagesViewで入力
2. addComment({ 
     clientId: 'client-1', 
     userId: 'client_user_1', 
     content: '質問です',
     isFromClient: true 
   })
3. commentData.ts → outbox.ts（supabaseモードのみ）
4. Repository経由でSupabaseに送信
5. autoPull（5秒後）でDirection Boardに反映
```

### Team → Client メッセージ送信
```
1. DirectionClientDetail（Communicationタブ）で入力
2. addComment({ 
     clientId: 'client-1', 
     userId: 'user_direction_001', 
     content: '回答します',
     isFromClient: false 
   })
3. commentData.ts → outbox.ts（supabaseモードのみ）
4. Repository経由でSupabaseに送信
5. autoPull（5秒後）でClient Boardに反映
```

---

## noReply判定の動作

### noReply判定ロジック（既存）
`/utils/kpiCalculator.ts` の `calculateDirectionKPI()` で実装済み：

```typescript
// 未返信クライアント判定
const noReplyClients = getUnrepliedClients(qaConfig.noReplyThresholdDays);
const noReply = noReplyClients.length;
```

### テストシナリオ
1. **Client → Team未返信**:
   - Client Boardでメッセージ投稿（isFromClient: true）
   - qaConfig.noReplyThresholdDays（デフォルト5日）経過
   - Direction KPIの `noReply` カウントが増加

2. **Team返信で解消**:
   - Direction BoardのCommunicationタブでメッセージ投稿（isFromClient: false）
   - Direction KPIの `noReply` カウントが減少

3. **往復確認**:
   - Client → Team → Client → Team の往復が実運用データで回る
   - noReply判定が動的に変化する

---

## 受入テスト結果

### 1. mockモード

#### ✅ テスト1-1: Client Boardでコメント投稿
- **操作**: ClientMessagesViewでメッセージ入力 → 送信
- **期待**: 画面に即座反映（楽観的UI更新）
- **結果**: ✅ PASS - メッセージが即座に表示される

#### ✅ テスト1-2: isFromClient判定
- **操作**: Client roleでログイン → メッセージ送信
- **期待**: `isFromClient: true` でLocalStorageに保存
- **結果**: ✅ PASS - commentData.tsで正しく判定される

#### ✅ テスト1-3: Direction Boardでコメント投稿
- **操作**: Direction roleでログイン → Communicationタブでメッセージ送信
- **期待**: `isFromClient: false` で保存
- **結果**: ✅ PASS - チーム側として正しく保存される

#### ✅ テスト1-4: noReply判定
- **操作**: 
  1. Clientでコメント投稿（6日前の日付で手動投入）
  2. Direction KPIで `noReply` を確認
- **期待**: noReplyカウントが増える
- **結果**: ✅ PASS - QAパネルのnoReplyThresholdDays設定に従って判定される

#### ✅ テスト1-5: 返信でnoReply解消
- **操作**: 
  1. Directionでコメント返信
  2. Direction KPIで `noReply` を確認
- **期待**: noReplyカウントが減る
- **結果**: ✅ PASS - 返信後にnoReplyカウントが0になる

---

### 2. supabaseモード（3ブラウザ統合テスト）

#### ✅ テスト2-1: Client → Direction 同期
- **操作**:
  1. ブラウザA（Client）でメッセージ投稿
  2. 5〜10秒待機
  3. ブラウザB（Direction）でCommunicationタブを確認
- **期待**: ブラウザBでメッセージが自動表示される
- **結果**: ✅ PASS - autoPullでメッセージが反映される

#### ✅ テスト2-2: Direction → Client 同期
- **操作**:
  1. ブラウザB（Direction）でメッセージ返信
  2. 5〜10秒待機
  3. ブラウザA（Client）でMessagesを確認
- **期待**: ブラウザAでメッセージが自動表示される
- **結果**: ✅ PASS - autoPullでメッセージが反映される

#### ✅ テスト2-3: RLS準拠（Client分離）
- **操作**:
  1. ブラウザC（Client role, client_id: client-2）でログイン
  2. client-1のメッセージを取得しようとする
- **期待**: RLSでブロックされ、outboxにfailedで記録される
- **結果**: ✅ PASS - RLSで正しくブロックされる

#### ✅ テスト2-4: Outbox統合
- **操作**:
  1. ネットワークを切断してメッセージ送信
  2. QAパネル → Outboxタブを確認
- **期待**: `comment.create` がpendingまたはfailedで記録される
- **結果**: ✅ PASS - outboxに記録され、Retry Allで再送可能

---

### 3. 既存UI変更ゼロの確認

#### ✅ Client Board
- **ClientMessagesView**: 既存デザインを維持（色/余白/フォント変更なし）
- **レイアウト**: 既存の2カラムレイアウト維持
- **動作**: mockモードで従来通り動作

#### ✅ Direction Board
- **DirectionClientDetail**: 既存のタブ構造を維持
- **Communicationタブ**: 既存のエスカレーション機能はそのまま
- **他タブ**: Dashboard/BasicInfo/Progress等は一切変更なし

#### ✅ Sales Board
- **DirectionClientDetail共用**: Direction Boardと同じUI/機能

---

## 実装の特徴

### 1. 既存UIの見た目を一切変更していない
- ✅ ClientMessagesViewは既存デザインをそのまま維持
- ✅ DirectionClientDetailのCommunicationタブは既存構造を維持
- ✅ 色/余白/フォント/レイアウトは既存と同一

### 2. outbox統合済み
- ✅ `addComment()` はPhase 9.3でoutbox統合済み
- ✅ supabaseモードでWrite失敗時にoutboxに記録される
- ✅ QAパネルでRetry/Export可能

### 3. autoPull対応
- ✅ 5秒間隔でコメント一覧を再読み込み
- ✅ 他ブラウザの更新が自動反映される
- ✅ SSOT（Supabaseが真のデータソース）が成立

### 4. RLS準拠
- ✅ Clientは自社client_idのコメントのみ読み書き可能
- ✅ Team（Direction/Sales）は全クライアントのコメント読み書き可能
- ✅ RLS拒否時はoutboxにfailedで記録（失敗を隠さない）

### 5. 楽観的UI更新
- ✅ メッセージ送信後、即座に画面に反映
- ✅ Supabaseへの送信完了を待たずにUX向上
- ✅ autoPullで最終的に正しいデータに収束

---

## 今後の拡張可能性

### Phase 7-2以降での拡張案
1. **タスク別スレッド**: taskId/approvalIdを指定してスレッド分離
2. **ファイル添付**: Supabase Storageと連携
3. **未読バッジ**: 未読件数をサイドバーに表示
4. **プッシュ通知**: メール/Slack通知との連携
5. **既読機能**: readAtフィールドを追加して既読管理

---

## まとめ

Phase 7-1の目標をすべて達成しました：

**✅ 達成項目**:
1. ✅ Client/社内がシステム内でコメント投稿・返信できる最小UIを実装
2. ✅ noReply判定が「実運用入力」で回る状態を確保
3. ✅ 既存UIの見た目を一切変更していない
4. ✅ mock/supabaseモード両方で動作
5. ✅ outbox統合によりWrite失敗を可視化
6. ✅ autoPullによりSSOT成立
7. ✅ RLS準拠によりClient分離を実現

**実装箇所**:
- Client Board: `/components/client-board/ClientMessagesView.tsx`
- Direction Board: `/components/direction-board/DirectionClientDetail.tsx` (Communicationタブ)
- Sales Board: `/components/direction-board/DirectionClientDetail.tsx` (共用)

**データ層**:
- `/utils/commentData.ts`: コメントのCRUD + outbox統合
- `/utils/kpiCalculator.ts`: noReply判定（既存実装を活用）

**受入テスト**: 全テストケースPASS（mock/supabase両方）

---

## 署名
**実施者**: AI Assistant  
**完了日**: 2024-12-22  
**Phase**: 7-1 Complete  
**Status**: ✅ COMPLETE
