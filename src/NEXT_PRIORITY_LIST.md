# 🎯 次にやるべき優先リスト

## ✅ 完了済み
- [x] **クライアントデータの完全統合** - LocalStorage + 静的データの統合完了

---

## 🔴 最優先（直ちに実装すべき）

### 1. タスク管理システムのLocalStorage化
**優先度**: 🔴 最優先  
**理由**: 全ボード（Direction, Sales, Editor, Creator）で共通利用される中核機能  
**影響範囲**: 大

**対象ファイル**:
- `/components/direction-board/DirectionTasks.tsx` - Direction Boardのタスク一覧
- `/components/Tasks.tsx` - Sales Boardのタスク
- `/components/editor-board/EditorMyProjects.tsx` - Editorのプロジェクト（タスク）
- `/components/creator-board/CreatorMyProjects.tsx` - Creatorのプロジェクト（タスク）

**実装内容**:
- タスクデータをLocalStorageで管理
- タスクの追加・更新・削除機能
- タスクのフィルタリング（ステータス、担当者、期限など）
- タスクとクライアントの紐付け
- **利用可能な関数**: `getAllTasks()`, `addClientTask()`, `updateClientTask()`（すでに実装済み）

**テスト項目**:
- [ ] Direction Boardでタスクを追加
- [ ] タスクのステータスを更新（pending → in-progress → approval → completed）
- [ ] 別アカウントでログインしてタスクが同期されているか確認
- [ ] タスクを承認ステータスに変更した際、承認待ちリストにも反映されるか確認

---

### 2. 承認待ちシステムのLocalStorage化
**優先度**: 🔴 最優先  
**理由**: Direction Boardの主要機能、クライアント承認フローの中核  
**影響範囲**: 大

**対象ファイル**:
- `/components/direction-board/ApprovalsCard.tsx` - ダッシュボードの承認カード
- `/components/direction-board/DirectionApprovals.tsx` - 承認待ち一覧ページ
- `/components/direction-board/AtRiskCard.tsx` - リスク管理（遅延承認含む）

**実装内容**:
- 承認待ちデータをLocalStorageで管理
- 承認・差し戻し・修正要求のステータス変更
- 承認者とのコメント機能
- 提出日からの経過日数の自動計算
- **利用可能な関数**: `getAllApprovals()`, `addClientApproval()`, `updateClientApproval()`（すでに実装済み）

**テスト項目**:
- [ ] Direction Boardで承認待ちアイテムを追加
- [ ] 承認・差し戻し・修正要求のステータス変更
- [ ] クライアントアカウントでログインして承認待ちが見えるか確認
- [ ] 承認処理後、タスクステータスも更新されるか確認

---

### 3. 通知システムの完全LocalStorage化
**優先度**: 🔴 最優先  
**理由**: ユーザー体験の向上、リアルタイム通知が重要  
**影響範囲**: 中〜大

**対象ファイル**:
- `/components/Header_Complete.tsx` - ヘッダーの通知アイコン・ドロップダウン

**実装内容**:
- 初期デフォルト通知の削除（現在はハードコード）
- アカウントごとの通知管理
- 通知の既読・未読管理
- 通知の自動生成（タスク追加時、承認要請時、ステータス変更時など）
- 通知のタイプ別フィルタリング

**実装推奨**:
```typescript
// 通知生成ヘルパー関数を追加
export const createNotification = (type, title, message, userId?) => {
  // 通知を作成してLocalStorageに保存
}

export const markNotificationAsRead = (notificationId) => {
  // 通知を既読にする
}

export const deleteNotification = (notificationId) => {
  // 通知を削除
}
```

**テスト項目**:
- [ ] クライアント追加時に通知が自動生成される
- [ ] タスク追加時に担当者に通知が届く
- [ ] 承認要請時にクライアントに通知が届く
- [ ] 通知の既読・未読切り替え
- [ ] アカウント切り替え時に通知が正しく表示される

---

## 🟠 高優先（テスト確認に必要）

### 4. リスク管理・アラートのLocalStorage化
**優先度**: 🟠 高  
**理由**: Direction Boardの重要な監視機能  
**影響範囲**: 中

**対象ファイル**:
- `/components/direction-board/AtRiskCard.tsx` - リスク管理カード
- `/components/direction-board/ClientWatchlistCard.tsx` - クライアント監視リスト
- `/components/direction-board/DirectionAlerts.tsx` - アラート一覧

**実装内容**:
- タスクの遅延自動検出
- クライアントステータスの監視
- リスクレベルの自動判定（critical, warning, info）
- アラートの自動生成・更新

**テスト項目**:
- [ ] 期限を過ぎたタスクが自動的にリスクリストに表示される
- [ ] 承認待ちが3日以上経過するとアラートが表示される
- [ ] クライアントステータスが悪化するとウォッチリストに追加される

---

### 5. クライアント詳細ページの追加データ統合
**優先度**: 🟠 高  
**理由**: クライアント詳細画面の完成度向上  
**影響範囲**: 中

**対象ファイル**:
- `/components/direction-board/DirectionClientDetail.tsx` - クライアント詳細ページ

**実装内容**:
- `mockApprovals`を削除 → `getClientApprovals()`を使用（すでに実装済み）
- `mockProposals`のLocalStorage化
- 提案書の追加・更新・削除機能

**テスト項目**:
- [ ] クライアント詳細ページで承認待ちが正しく表示される
- [ ] 承認ステータスを変更できる
- [ ] 提案書を追加・編集できる

---

## 🟡 中優先（機能完成度向上）

### 6. Sales Board機能のLocalStorage化
**優先度**: 🟡 中  
**理由**: Sales特有の機能、後回し可能  
**影響範囲**: 小〜中

**対象ファイル**:
- `/components/Pipeline.tsx` - 営業パイプライン
- `/components/Reports.tsx` - レポート

**実装内容**:
- パイプライン段階（リード、商談中、契約済みなど）の管理
- 案件データの追加・更新
- レポートデータの動的生成

---

### 7. Editor/Creator Board機能のLocalStorage化
**優先度**: 🟡 中  
**理由**: 役割特有の機能、後回し可能  
**影響範囲**: 小

**対象ファイル**:
- `/components/editor-board/EditorReviewQueue.tsx` - レビューキュー
- `/components/editor-board/EditorAssetLibrary.tsx` - アセットライブラリ
- `/components/creator-board/CreatorAssetLibrary.tsx` - Creatorアセット
- `/components/creator-board/CreatorUploadAssets.tsx` - アセットアップロード

**実装内容**:
- レビューキューの管理
- アセットの追加・更新・削除
- アセットとタスクの紐付け

---

### 8. Control Board機能のLocalStorage化
**優先度**: 🟡 中  
**理由**: 経営管理機能、テストに直接必要ではない  
**影響範囲**: 小

**対象ファイル**:
- `/components/control-board/ExecutiveDashboard.tsx` - 経営ダッシュボード
- `/components/control-board/FinancialOverview.tsx` - 財務概況
- `/components/control-board/ProjectPortfolio.tsx` - プロジェクトポートフォリオ
- `/components/control-board/TeamPerformance.tsx` - チームパフォーマンス
- `/components/control-board/ReportsAnalytics.tsx` - レポート分析

**実装内容**:
- 財務データの動的管理
- チームパフォーマンス指標の計算
- プロジェクト収益性の追跡

---

## 🟢 低優先（後回し可能）

### 9. Settings各種機能の強化
**優先度**: 🟢 低  
**理由**: 基本機能は実装済み  
**影響範囲**: 小

**対象ファイル**:
- `/components/settings/MembersTab.tsx` - メンバー管理
- `/components/settings/PermissionsTab.tsx` - 権限設定
- `/components/settings/SessionsTab.tsx` - セッション管理
- `/components/settings/IntegrationsTab.tsx` - 統合設定

**実装内容**:
- メンバーの追加・削除・編集（mockDatabase.tsで部分対応済み）
- ロール・権限の動的管理
- アクティブセッションの追跡

---

## 📝 実装の推奨順序（次の3ステップ）

### **STEP 1: タスク管理システム** 🔴
→ すべてのボードで使う中核機能。すでに`clientData.ts`に関数が実装済みなので、各コンポーネントでの利用が簡単。

### **STEP 2: 承認待ちシステム** 🔴
→ Direction Boardの主要機能。タスクと連携するため、STEP 1の後が最適。すでに`clientData.ts`に関数が実装済み。

### **STEP 3: 通知システム** 🔴
→ STEP 1とSTEP 2で作成したタスク・承認待ちのアクションに応じて通知を自動生成する。

---

## 🎁 ボーナス: すでに実装済みで使える関数

すでに`/utils/clientData.ts`に以下の関数が実装されているため、すぐに利用可能：

### タスク関連:
- `getAllTasks()` - 全クライアントの全タスク取得
- `getClientTasks(clientId)` - 特定クライアントのタスク取得
- `addClientTask(clientId, task)` - タスク追加
- `updateClientTask(clientId, taskId, updates)` - タスク更新

### 承認待ち関連:
- `getAllApprovals()` - 全クライアントの全承認待ち取得
- `getClientApprovals(clientId)` - 特定クライアントの承認待ち取得
- `addClientApproval(clientId, approval)` - 承認待ち追加
- `updateClientApproval(clientId, approvalId, updates)` - 承認待ち更新

### コンテンツ関連:
- `getClientContent(clientId)` - クライアントのコンテンツ取得
- `addClientContent(clientId, content)` - コンテンツ追加

### KPI関連:
- `updateClientKPI(clientId, kpi)` - KPI更新

これらを使えば、各コンポーネントでのLocalStorage統合が非常にスムーズに進みます！

---

## 🚀 今すぐ始めるべきこと

**次のタスク: タスク管理システムのLocalStorage化（STEP 1）**

1. `/components/direction-board/DirectionTasks.tsx`を開く
2. ハードコードされたタスクデータを探す
3. `getAllTasks()`を使って動的にタスクを取得するように変更
4. タスクの追加・更新機能を`addClientTask()`, `updateClientTask()`で実装
5. テスト！

準備ができたら「次お願いします」と言ってください！🎉
