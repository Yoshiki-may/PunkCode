# PALSS SYSTEM — 監視仕様（MONITORING_SPEC.md)

**Version**: 1.0  
**Date**: 2024-12-22  
**Status**: 確定版（監視設計）  
**対象**: SRE、運用チーム

---

## 🎯 監視方針

### 目標

1. **可用性**: システムが正常動作していることを保証
2. **パフォーマンス**: レスポンスタイム劣化の早期検知
3. **データ整合性**: Sync障害・Outbox障害の検知
4. **セキュリティ**: 不正アクセスの検知

---

## 📊 監視項目一覧

### 優先度別分類

| 優先度 | 監視項目 | 閾値 | アラート |
|--------|---------|------|---------|
| **P0** | autoPull Last Pull | >300秒 | 即時 |
| **P0** | Outbox Failed | >5件 | 即時 |
| **P0** | Auth 401/403率 | >10% | 即時 |
| **P1** | Performance Avg Duration | >2000ms | 15分以内 |
| **P1** | Outbox Permanent Failure | >3件 | 1時間以内 |
| **P1** | Incremental Ratio | <70% | 1時間以内 |
| **P2** | Outbox Pending | >50件 | 4時間以内 |
| **P2** | Full Pull Count | >10回/日 | 4時間以内 |

---

## 🔍 監視項目詳細

### 1. autoPull監視

#### Last Pull（最終Pull日時）

**指標**: 現在時刻 - lastPulledAt

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <60秒 | 正常動作 |
| 🟡 警告 | 60-300秒 | 遅延発生 |
| 🔴 異常 | >300秒 | autoPull停止疑い |

**取得方法**:

```javascript
// QAパネル → Incremental Tab
const lastPulledAt = localStorage.getItem('lastPulledAt_tasks')
const now = new Date()
const diffMs = now - new Date(lastPulledAt)
const diffSec = Math.floor(diffMs / 1000)

console.log('Last Pull:', diffSec, 'seconds ago')
```

**アラート条件**:

```
IF diffSec > 300 THEN
  ALERT "autoPull停止疑い"
```

---

#### Avg Duration（平均取得時間）

**指標**: 直近20回のautoPull平均時間

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <500ms | 快適 |
| 🟡 警告 | 500-2000ms | 遅延発生 |
| 🔴 異常 | >2000ms | Performance劣化 |

**取得方法**:

```javascript
// QAパネル → Performance Tab
const durations = JSON.parse(localStorage.getItem('autoPullDurations') || '[]')
const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length

console.log('Avg Duration:', avg, 'ms')
```

**アラート条件**:

```
IF avg > 2000 AND COUNT(avg > 2000) > 3 THEN
  ALERT "Performance劣化"
```

---

#### Incremental Ratio（Incremental Pull比率）

**指標**: Incremental Pull / Total Pull × 100

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | >90% | 効率的 |
| 🟡 警告 | 70-90% | Full Pull増加 |
| 🔴 異常 | <70% | Incremental失敗多発 |

**取得方法**:

```javascript
// QAパネル → Incremental Tab
const incrementalCount = parseInt(localStorage.getItem('incrementalPullCount') || '0')
const fullCount = parseInt(localStorage.getItem('fullPullCount') || '0')
const total = incrementalCount + fullCount
const ratio = total > 0 ? (incrementalCount / total) * 100 : 0

console.log('Incremental Ratio:', ratio.toFixed(1), '%')
```

**アラート条件**:

```
IF ratio < 70 THEN
  ALERT "Incremental Pull失敗多発"
```

---

### 2. Outbox監視

#### Failed件数

**指標**: Outboxで送信失敗したリクエスト数

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | 0件 | 正常 |
| 🟡 警告 | 1-5件 | 一時的エラー |
| 🔴 異常 | >5件 | 書き込み障害 |

**取得方法**:

```javascript
// QAパネル → Outbox Tab
const outboxQueue = JSON.parse(localStorage.getItem('outboxQueue') || '[]')
const failedCount = outboxQueue.filter(item => item.status === 'failed').length

console.log('Failed Count:', failedCount)
```

**アラート条件**:

```
IF failedCount > 5 THEN
  ALERT "Outbox Failed急増"
```

---

#### Pending件数

**指標**: Outboxで送信待ちリクエスト数

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <10件 | 正常 |
| 🟡 警告 | 10-50件 | 処理遅延 |
| 🔴 異常 | >50件 | Outbox停滞 |

**取得方法**:

```javascript
const pendingCount = outboxQueue.filter(item => item.status === 'pending').length

console.log('Pending Count:', pendingCount)
```

**アラート条件**:

```
IF pendingCount > 50 THEN
  ALERT "Outbox Pending溜まり"
```

---

#### Permanent Failure件数

**指標**: 修正不可能な失敗件数

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | 0件 | 正常 |
| 🟡 警告 | 1-3件 | 軽微な問題 |
| 🔴 異常 | >3件 | データ不正多発 |

**取得方法**:

```javascript
const permanentFailureCount = outboxQueue.filter(item => item.status === 'permanent_failure').length

console.log('Permanent Failure Count:', permanentFailureCount)
```

**アラート条件**:

```
IF permanentFailureCount > 3 THEN
  ALERT "Permanent Failure多発"
```

---

### 3. Auth/RLS監視

#### 401/403エラー率

**指標**: 401/403エラー / 総リクエスト × 100

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <1% | 正常 |
| 🟡 警告 | 1-10% | 認証/権限エラー増加 |
| 🔴 異常 | >10% | Auth/RLS障害 |

**取得方法**:

```javascript
// ブラウザ開発ツール → Network
// または Supabase Dashboard → Logs
const totalRequests = 1000
const authErrors = 50 // 401/403の数
const errorRate = (authErrors / totalRequests) * 100

console.log('Auth Error Rate:', errorRate.toFixed(1), '%')
```

**アラート条件**:

```
IF errorRate > 10 THEN
  ALERT "Auth/RLS障害疑い"
```

---

### 4. Sync整合性監視

#### Consistency Check失敗数

**指標**: Consistency Checkで検出された不整合件数

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | 0件 | 整合性OK |
| 🟡 警告 | 1-10件 | 軽微な不整合 |
| 🔴 異常 | >10件 | Sync障害 |

**取得方法**:

```javascript
// QAパネル → Sync Tab → "Run Consistency Check"
const inconsistencies = JSON.parse(localStorage.getItem('consistencyCheckResults') || '[]')
const count = inconsistencies.length

console.log('Inconsistency Count:', count)
```

**アラート条件**:

```
IF count > 10 THEN
  ALERT "Sync障害疑い"
```

---

## 📈 Supabase Dashboard監視

### 1. Database監視

#### Storage使用率

**指標**: Storage使用量 / 最大容量 × 100

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <70% | 正常 |
| 🟡 警告 | 70-90% | 要監視 |
| 🔴 異常 | >90% | 容量不足 |

**確認方法**:

```
Supabase Dashboard → Database → Storage
```

**対処**:
- 論理削除データの物理削除
- Notification古いデータ削除
- プラン変更検討

---

#### Connection数

**指標**: 現在の接続数 / 最大接続数 × 100

**閾値**:

| 状態 | 閾値 | 意味 |
|------|------|------|
| 🟢 正常 | <50% | 正常 |
| 🟡 警告 | 50-80% | 要監視 |
| 🔴 異常 | >80% | 接続逼迫 |

**確認方法**:

```
Supabase Dashboard → Database → Connections
```

**対処**:
- Connection Pooling最適化
- 不要な接続終了

---

### 2. Auth監視

#### Active Users

**指標**: 現在のアクティブユーザー数

**確認方法**:

```
Supabase Dashboard → Auth → Active Users
```

**異常検知**:
- 急激な増加 → DDoS疑い
- 急激な減少 → Auth障害疑い

---

#### Auth Logs

**指標**: ログイン失敗数

**確認方法**:

```
Supabase Dashboard → Logs → Auth Logs
→ Filter: "failed"
```

**異常検知**:
- 短時間に大量失敗 → ブルートフォース疑い

---

## 🚨 アラート設定

### アラート方法

**推奨**:
1. Slack/Discord Webhook
2. メール通知
3. PagerDuty/Opsgenie等

### Slack Webhook例

```javascript
// alert.js
async function sendAlert(level, title, message) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  
  const color = {
    'P0': 'danger', // 赤
    'P1': 'warning', // 黄
    'P2': 'good' // 緑
  }[level]
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: `[${level}] ${title}`,
        text: message,
        footer: 'PALSS SYSTEM',
        ts: Math.floor(Date.now() / 1000)
      }]
    })
  })
}

// 使用例
if (failedCount > 5) {
  await sendAlert('P0', 'Outbox Failed急増', `Failed件数: ${failedCount}件`)
}
```

---

## 📊 監視ダッシュボード（推奨）

### Grafana/Datadog構成例

**メトリクス収集**:

```javascript
// metrics.js
import { Gauge, Counter } from 'prom-client'

// Gauge（現在値）
const autoPullLastPullGauge = new Gauge({
  name: 'palss_autopull_last_pull_seconds',
  help: '最終Pull経過秒数'
})

const outboxFailedGauge = new Gauge({
  name: 'palss_outbox_failed_count',
  help: 'Outbox Failed件数'
})

// Counter（累積）
const autoPullTotalCounter = new Counter({
  name: 'palss_autopull_total',
  help: 'autoPull総実行回数',
  labelNames: ['type'] // incremental or full
})

// メトリクス更新（60秒ごと）
setInterval(() => {
  const lastPulledAt = localStorage.getItem('lastPulledAt_tasks')
  const diffSec = Math.floor((Date.now() - new Date(lastPulledAt)) / 1000)
  autoPullLastPullGauge.set(diffSec)
  
  const failedCount = JSON.parse(localStorage.getItem('outboxQueue') || '[]')
    .filter(item => item.status === 'failed').length
  outboxFailedGauge.set(failedCount)
}, 60000)
```

**ダッシュボード項目**:
- autoPull Last Pull（折れ線グラフ）
- Outbox Failed（折れ線グラフ）
- Performance Avg Duration（折れ線グラフ）
- Incremental Ratio（折れ線グラフ）
- Auth Error Rate（折れ線グラフ）

---

## 📋 監視チェックリスト

### 日次

- [ ] QAパネル → Performance → Avg Duration確認
- [ ] QAパネル → Outbox → Failed件数確認
- [ ] QAパネル → Incremental → Last Pull確認
- [ ] Supabase Dashboard → Auth → Active Users確認

### 週次

- [ ] Consistency Check実行（不整合0件確認）
- [ ] Supabase Dashboard → Database → Storage確認
- [ ] 監査ログレビュー（異常操作なし確認）

### 月次

- [ ] Performanceレビュー（劣化傾向確認）
- [ ] アラート頻度レビュー（閾値調整）
- [ ] 監視項目追加検討

---

## 🔗 関連ドキュメント

- [OPS_RUNBOOK.md](./OPS_RUNBOOK.md) - 日常運用手順
- [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) - 障害対応
- [AUDIT_LOG_SPEC.md](./AUDIT_LOG_SPEC.md) - 監査ログ仕様

---

**End of MONITORING_SPEC.md**
