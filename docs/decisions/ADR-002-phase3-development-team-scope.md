---
Document: ADR-002 PHASE 3 DEVELOPMENT TEAM SCOPE
File: docs/decisions/ADR-002-phase3-development-team-scope.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS

App Version: v0.5.0 (Phase 3 target)

Created: 2026-07-08
Last Updated: 2026-07-08
---

# ADR-002: Phase 3 AI Development Team スコープ

## Status

Approved

## Context

Phase 2（v0.3.0）で Workflow Engine と PM / Frontend / QA Agent が動作した。
Phase 3 では開発業務を AI チームとして完結させる必要がある。

## Decision

### 1. バージョン

| Phase | App Version | 名称 |
|---|---|---|
| Phase 3 | v0.5.0 | AI Development Team |

### 2. 追加 Agent

- **Designer AI** — UI 案・Design Review
- **Backend AI** — API / Database / Logic

Phase 2 既存 Agent（Secretary / PM / Frontend / QA）は維持。

### 3. Development Team Workflow（5 Stage）

```
Requirement (PM)
  ↓ Artifact
Design (Designer)
  ↓ Artifact
Frontend (Frontend AI)
  ↓ Artifact
Backend (Backend AI)
  ↓ Artifact
QA (QA AI)
```

Agent 間通信は Artifact 経由のみ。Workflow Engine が順次実行する。

### 4. Phase 3 で実装しないもの

- ログイン / 権限管理（Phase 4 以降）
- GitHub / Figma 外部連携
- Memory 4層拡張（Global / User / Skill）
- Legal / Marketing Agent

## Consequences

- 新規 Project 作成時に 5 Stage + 5 Task を自動生成
- Demo Project は seed で Phase 3 構成にアップグレード
- Agent Runner は同一 Workflow 内の先行 Artifact をコンテキストに注入

## References

- `docs/project/MVP_ROADMAP.md` Phase 3
- `docs/decisions/ADR-001-phase-version-memory-agent-scope.md`
