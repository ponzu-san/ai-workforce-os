---
Document: ADR-001 PHASE VERSION MEMORY AGENT SCOPE
File: docs/decisions/ADR-001-phase-version-memory-agent-scope.md
Version: 0.1.1
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS

App Version: v0.1.0 (Phase 0 target)

Created: 2026-07-08
Last Updated: 2026-07-08
---

# ADR-001: Phase 0/1 分離、Memory簡素化、Agentスコープ

## Status

Approved

## Context

設計ドキュメント間で以下の不整合が存在した。

- MVPバージョン: `v0.1.0` を Personal AI Workspace とする記述と、Phase 0 = `v0.1.0` / Phase 1 = `v0.2.0` の記述
- Memory構造: 4層（Global/Client/Project/Session）と5層（Short Term/Project/User/Skill/Knowledge）の混在
- Phase1 Agent: Secretary のみと複数 Agent 実装の混在

## Decision

### 1. バージョンとフェーズ

| Phase | App Version | 名称 | 目的 |
|---|---|---|---|
| Phase 0 | v0.1.0 | Foundation | 開発基盤構築 |
| Phase 1 | v0.2.0 | Personal AI Workspace MVP | 毎日使える最小機能 |

#### Phase 0（Foundation）実装範囲

- Next.js セットアップ
- TypeScript 設定
- Tailwind / shadcn/ui
- ディレクトリ構成
- Prisma / PostgreSQL
- 初期 Database Schema
- 基本 Layout
- 開発ルール適用

#### Phase 1（Personal AI Workspace MVP）実装範囲

- Dashboard
- Project Management
- Task Management
- Workflow 基本構造
- Approval 基本構造
- Secretary AI
- LLM Router 基盤

### 2. Memory（Phase 1）

Phase 1 では **2層** のみ実装する。

```
Short Term Memory
Project Memory
```

将来拡張（Phase 2 以降）:

- Global Knowledge
- User Memory
- Skill Memory
- Client Memory

### 3. Agent（Phase 1）

Phase 1 で実装する Agent は **Secretary AI のみ**。

他 Agent（Project Manager, Frontend, Backend, QA, Sales, Legal 等）は Secretary AI + Workflow Engine 完成後に追加する。

## Consequences

- 全ドキュメントは本 ADR の定義を正とする
- Phase 0 完了条件: アプリケーション起動、DB接続、基本 Layout 表示
- Phase 1 完了条件: 上記 MVP 機能が動作し、Secretary AI が Orchestrator として機能する
- Memory / Agent の将来拡張は設計に含めるが Phase 1 では実装しない

## References

- `docs/02_ROADMAP.md`
- `docs/project/MVP_ROADMAP.md`
- `docs/08_MEMORY_ENGINE.md`
- `docs/architecture/AGENT_ARCHITECTURE.md`
