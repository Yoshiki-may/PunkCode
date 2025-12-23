# PALSS SYSTEM - Phase 9.3: Repository経由への段階移行

## 目的
既存UIの見た目を一切変えずに、既存のutils直呼び（LocalStorage）を Repository 経由に段階移行し、supabaseモード時に本当にSupabase（Auth+RLS+DB）がSSOTとして動く状態を完成させる。

## 進捗状況

### ✅ Step 1: MockRepository循環参照回避（完了）

**変更ファイル:**
- `/repositories/MockRepository.ts`
- `/utils/storage.ts`

**変更内容:**
1. MockRepositoryがutils/clientData.tsに依存しないよう修正
2. LocalStorageから直接読み込むhelper関数を追加
   - `flattenTasks()`: CLIENT_TASKSのRecord構造から配列に変換
   - `flattenApprovals()`: CLIENT_APPROVALSのRecord構造から配列に変換
3. STORAGE_KEYS.COMMENTSを追加（comments用）
4. MockCommentRepository, MockContractRepository, MockNotificationRepository が直接STORAGE_KEYSから読むように変更

**影響範囲:**
- mockモードの動作は維持
- 循環参照を解消し、Repository層が独立

### ✅ Step 2: utils/clientData.ts のRepository対応準備（完了）

**変更ファイル:**
- `/utils/clientData.ts`

**変更内容:**
1. Repository経由でデータ取得できるようにimport追加:
   ```typescript
   import { getTaskRepository, getApprovalRepository, getNotificationRepository } from '../repositories';
   ```
2. getAllTasks/getAllApprovalsは同期版を維持（既存コードとの互換性）
3. Phase 9.3コメントを追加して変更意図を明示

**影響範囲:**
- 既存の呼び出し元（KPI計算等）は変更不要
- 今後、内部実装をRepository経由に段階的に変更可能

### 🔄 Step 3: commentData.ts / contractData.ts の同様対応（準備中）

**対象ファイル:**
- `/utils/commentData.ts`
- `/utils/contractData.ts`

**予定変更:**
1. Repository経由でデータ取得できるようにimport追加
2. 既存のgetAllComments(), getAllContracts()の内部実装は維持
3. 将来的にRepository経由に変更しやすい準備

### ⏳ Step 4: Write系関数の Repository経由化（未着手）

**対象関数:**
- `addClientTask()` → TaskRepository.createTask()
- `updateClientTask()` → TaskRepository.updateTask()
- `addClientApproval()` → ApprovalRepository.createApproval()
- `updateClientApproval()` → ApprovalRepository.updateApproval()
- `addNotification()` → NotificationRepository.createNotification()
- `markNotificationAsRead()` → NotificationRepository.markAsRead()
- `addComment()` → CommentRepository.createComment()
- `addContract()` → ContractRepository.createContract()
- `updateContract()` → ContractRepository.updateContract()

**方針:**
- 既存のutils関数を互換ラッパーとして残す
- 内部でRepository経由で処理
- supabaseモード時に自動でorg_id/client_idを解決

### ⏳ Step 5: Supabase Repository の RLS + Auth 対応（未着手）

**対象ファイル:**
- `/repositories/SupabaseRepository.ts`

**予定変更:**
1. userProfileからorg_id/client_idを自動解決
2. RLSでフィルタリングされたデータのみ取得
3. エラーハンドリング（RLS弾かれた場合の通知）

## 絶対ルール（厳守）

1. ✅ **既存UIの見た目を変更しない**（レイアウト/色/余白/フォント/テキスト/構造）
2. ✅ **既存挙動を壊さない**（mockモードで動いていること）
3. ✅ **小さく・安全に変更**（変更範囲を明確にする）
4. ✅ **dataMode=mock/supabase の両方で動作**

## 次のアクション

1. commentData.ts / contractData.ts にRepository import追加
2. Write系関数を順次Repository経由に変更（Task → Approval → Comment → Contract → Notification）
3. supabaseモードでの動作検証
4. RLS権限制御の検証（Clientロールで自社データのみ閲覧）

## 検証チェックリスト（未実施）

- [ ] mockモード: タスク追加→期限カード→アラート→通知→KPI連鎖更新
- [ ] mockモード: 承認→通知→アラート→KPI更新
- [ ] mockモード: コメント追加（未返信の増減）→アラート更新
- [ ] mockモード: 契約追加（更新期限）→アラート/KPI更新
- [ ] supabaseモード: Sync→Login→表示→更新の一連動作
- [ ] supabaseモード: Clientロールで自社client_idだけ閲覧可能（RLS）
