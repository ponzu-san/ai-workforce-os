---
Document: ADR-005 UNIFIED PRODUCTION WORKFLOW
File: docs/decisions/ADR-005-unified-production-workflow.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

App Version: v1.0.0 (target)

Created: 2026-07-09
---

# ADR-005: 統合制作ワークフロー

## Decision

### 1. プロジェクト統合

- `business` / `development` を **`production`** に統合
- 営業〜納品を **1つの制作プロジェクト** で管理

### 2. プロジェクトテンプレート（5種）

| Template | 用途 |
|----------|------|
| `lp_static` | LP（静的）— デフォルト |
| `lp_form` | LP（問い合わせフォームあり） |
| `corporate` | コーポレート / サービスサイト |
| `design_only` | デザインのみ |
| `custom_blank` | 全工程手動設定 |

### 3. 統合 Stage（11）

営業 → 契約 → 要件定義 → デザイン → フロントエンド → バックエンド → **外部開発** → インフラ → 品質保証 → 法務 → 納品

### 4. Stage 実行モード

| Mode | 動作 |
|------|------|
| `internal_ai` | LLM 実行 → Markdown Artifact → 承認 |
| `external_handoff` | handoff 生成 → URL/ファイル登録 → 承認 |
| `human_handoff` | 人間向け設計書 → 成果物登録 → 承認 |
| `skip` | 自動完了（記録のみ） |

### 5. 確定ルール

- デザイン既定: `external_handoff`（Figma / v0 / Cursor / ChatGPT 等）
- FE/BE（lp_static）: `skip`、**外部開発** Stage で GitHub URL 登録
- 法務: **全テンプレート必須**
- クライアント: **任意**
- Artifact MVP: **Markdown + URL + ファイルアップロード**
- `TaskStatus.waiting_external` を追加

## References

- Unified Production Workflow Plan (2026-07-09)
