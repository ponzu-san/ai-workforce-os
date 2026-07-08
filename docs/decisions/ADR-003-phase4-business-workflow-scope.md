---
Document: ADR-003 PHASE 4 BUSINESS WORKFLOW SCOPE
File: docs/decisions/ADR-003-phase4-business-workflow-scope.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

App Version: v0.8.0 (Phase 4 target)

Created: 2026-07-08
---

# ADR-003: Phase 4 AI Business Workflow スコープ

## Decision

### 1. バージョン

| Phase | App Version | 名称 |
|---|---|---|
| Phase 4 | v0.8.0 | AI Business Workflow |

### 2. 追加機能（MVP）

- **Client / Lead 管理** — Client DB、status=lead でリード管理
- **Communication History** — クライアントごとの連絡履歴
- **Project ↔ Client 紐付け**
- **Business Workflow** — Sales → Contract → Delivery（3 Stage）
- **Sales AI** Agent

### 3. Phase 4 で実装しないもの

- ログイン / 権限管理
- Legal AI / Marketing AI
- 外部 CRM 連携
- 請求・会計

## References

- `docs/project/MVP_ROADMAP.md` Phase 4
