---
Document: DIRECTORY STRUCTURE
File: docs/16_DIRECTORY_STRUCTURE.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS

App Version: v0.1.0

Created: 2026-07-08
Last Updated: 2026-07-08
---

# Directory Structure

## Purpose

本ドキュメントはAI Workforce OSのソースコード構成を定義する。

目的は以下。

- 責務分離
- CursorによるAI開発効率向上
- 保守性向上
- Agent追加容易化
- 将来拡張対応

すべてのコードは本構成に従う。

---

# Root Structure

```
ai-workforce-os/

├── app/
├── components/
├── features/
├── agents/
├── ai/
├── workflows/
├── artifacts/
├── memory/
├── skills/
├── prompts/
├── database/
├── lib/
├── hooks/
├── types/
├── utils/
├── config/
├── public/
├── docs/
├── specs/
├── tests/
├── prisma/
├── .cursor/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# app/

## Responsibility

Next.js App Router管理。

```
app/

├── layout.tsx
├── page.tsx
├── dashboard/
├── projects/
├── workflows/
├── tasks/
├── agents/
├── artifacts/
├── approvals/
├── settings/
└── api/
```

---

# components/

## Responsibility

共通UI Component。

```
components/

├── ui/
├── layout/
├── navigation/
├── charts/
├── forms/
└── common/
```

Feature固有Componentは禁止。

---

# features/

## Responsibility

業務機能単位。

```
features/

├── project/
├── workflow/
├── task/
├── artifact/
├── approval/
├── notification/
├── memory/
├── skill/
├── prompt/
└── setting/
```

---

## Feature Structure

例

```
features/project/

├── components/
├── hooks/
├── services/
├── schemas/
├── types.ts
└── index.ts
```

---

# agents/

## Responsibility

AI Agent定義。

```
agents/

├── base/
├── secretary/
├── frontend/
├── backend/
├── designer/
├── qa/
├── legal/
├── marketing/
└── project-manager/
```

---

# Agent Structure

例

```
agents/frontend/

├── agent.ts
├── config.ts
├── prompts/
├── validators/
└── skills.ts
```

---

# ai/

## Responsibility

AI基盤。

```
ai/

├── router/
├── prompt-engine/
├── memory-engine/
├── skill-engine/
├── artifact-engine/
├── context-builder/
├── validators/
└── sdk/
```

---

# workflows/

## Responsibility

Workflow Engine。

```
workflows/

├── engine/
├── scheduler/
├── events/
├── states/
├── templates/
└── validators/
```

---

# artifacts/

## Responsibility

成果物管理。

```
artifacts/

├── repository/
├── versioning/
├── preview/
├── export/
└── validators/
```

---

# memory/

## Responsibility

Memory Engine。

```
memory/

├── repository/
├── retrieval/
├── compression/
├── cache/
└── types.ts
```

---

# skills/

## Responsibility

AI Skill管理。

```
skills/

├── frontend/
├── backend/
├── design/
├── qa/
├── legal/
└── marketing/
```

Markdown中心。

---

# prompts/

## Responsibility

Prompt管理。

```
prompts/

├── templates/
├── system/
├── agents/
├── validators/
└── versions/
```

---

# database/

## Responsibility

Database Access Layer。

```
database/

├── client.ts
├── repositories/
├── queries/
└── migrations/
```

---

# prisma/

## Responsibility

Prisma管理。

```
prisma/

├── schema.prisma
└── migrations/
```

---

# lib/

## Responsibility

共通ライブラリ。

```
lib/

├── api/
├── logger/
├── security/
├── constants/
└── errors/
```

---

# hooks/

## Responsibility

共通React Hooks。

例

```
useProject()

useWorkflow()

useAgent()

useNotification()
```

---

# types/

## Responsibility

共有Type定義。

```
types/

├── project.ts
├── workflow.ts
├── task.ts
├── agent.ts
└── api.ts
```

---

# utils/

## Responsibility

Utility関数。

例

```
formatDate

calculateProgress

tokenEstimate

validateInput
```

---

# config/

## Responsibility

設定管理。

```
config/

├── app.ts
├── ai.ts
├── llm.ts
└── feature-flags.ts
```

---

# docs/

## Responsibility

設計書。

```
docs/

├── requirements/
├── architecture/
└── guides/
```

---

# specs/

## Responsibility

実装仕様。

例

```
specs/

├── api/
├── database/
├── ui/
└── workflow/
```

---

# tests/

## Responsibility

テスト。

```
tests/

├── unit/
├── integration/
└── e2e/
```

---

# .cursor/

## Responsibility

Cursor AI設定。

```
.cursor/

├── rules/
├── prompts/
├── commands/
└── context/
```

---

# Cursor Rules

配置例

```
.cursor/rules/

├── architecture.md
├── coding-style.md
├── frontend.md
├── ai-agent.md
└── database.md
```

Cursorは常時参照する。

---

# Import Rules

依存方向を固定する。

```
app

↓

features

↓

ai

↓

database

↓

infrastructure
```

逆方向は禁止。

---

# Forbidden Dependencies

禁止。

```
database

↓

features
```

```
components

↓

database
```

```
agents

↓

UI
```

---

# Naming Rules

File

kebab-case

Component

PascalCase

Function

camelCase

Database

snake_case

---

# Code Location Rules

判断基準。

UI

↓

components

Business Logic

↓

features

AI Logic

↓

ai

Agent Logic

↓

agents

Database

↓

database

---

# Future Extension

Phase2

```
packages/

├── agent-sdk
├── ui-kit
├── workflow-engine
└── ai-core
```

Monorepo化可能。

---

# Success Criteria

開発者またはCursorが、

「このコードはどこへ配置すべきか」

を迷わない構造を実現する。

責務分離されたディレクトリ構造により、
AI Workforce OSを長期的に拡張可能な設計とする。
