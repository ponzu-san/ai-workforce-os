---
Document: PROJECT FOLDER STRUCTURE
File: docs/project/FOLDER_STRUCTURE.md
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

# AI Workforce OS Folder Structure

## Purpose

このドキュメントはAI Workforce OSのソースコード構成を定義する。

目的:

- Cursorが配置場所を迷わない
- AI Agent追加を容易にする
- 機能拡張しやすくする
- 責務分離を維持する

---

# Root Structure

推奨構成:

```
ai-workforce-os/

├── .cursor/

├── docs/

├── prisma/

├── public/

├── src/

├── tests/

├── .env

├── package.json

├── README.md

└── next.config.ts
```

---

# .cursor

Cursor AI設定。

```
.cursor/

├── rules/

└── prompts/
```

---

## rules

AI開発ルール。

```
.cursor/rules/

00_core_architecture.md

01_coding_standard.md

02_ai_agent_rules.md

03_database_rules.md

04_llm_rules.md

05_security_rules.md

06_workflow_rules.md

07_memory_skill_rules.md

08_project_management_rules.md
```

---

## prompts

Reusable Prompt。

例:

```
.cursor/prompts/

00_initial_project_bootstrap.md

agent_creation_prompt.md

feature_development_prompt.md
```

---

# docs

設計ドキュメント。

```
docs/

├── project/

├── architecture/

├── api/

├── database/

└── decisions/
```

---

## project

プロジェクト全体。

```
docs/project/

MVP_ROADMAP.md

TECH_STACK.md

FOLDER_STRUCTURE.md
```

---

## architecture

システム設計。

例:

```
architecture/

system_design.md

agent_architecture.md

workflow_design.md
```

---

## api

API仕様。

例:

```
api/

agent_api.md

workflow_api.md
```

---

## database

DB設計。

例:

```
database/

schema.md

entity_relationship.md
```

---

## decisions

Architecture Decision Record。

例:

```
decisions/

ADR-001-nextjs.md

ADR-002-agent-system.md
```

---

# prisma

Database管理。

```
prisma/

├── schema.prisma

├── migrations/

└── seed.ts
```

---

# src

アプリケーションコード。

```
src/

├── app/

├── components/

├── features/

├── services/

├── ai/

├── database/

├── lib/

├── hooks/

├── types/

└── utils/
```

---

# app

Next.js App Router。

責務:

- Page
- Layout
- Route Handler

---

例:

```
app/

dashboard/

projects/

tasks/

api/
```

---

# components

共有UI Component。

配置:

```
components/

ui/

common/

layout/
```

---

禁止:

Business Logicを入れない。

---

# features

Feature Based Architecture。

基本単位。

例:

```
features/

project/

task/

workflow/

agent/

approval/
```

---

Feature内部:

```
feature/

├── components/

├── hooks/

├── services/

├── types.ts

└── utils.ts
```

---

# services

Application Logic。

例:

```
services/

projectService.ts

workflowService.ts

notificationService.ts
```

---

# ai

AI関連。

重要ディレクトリ。

```
ai/

├── agents/

├── router/

├── prompts/

├── skills/

├── memory/

├── tools/

└── validators/
```

---

# ai/agents

Agent定義。

例:

```
agents/

secretary/

frontend/

designer/

qa/

legal/
```

---

Agent構造:

```
agent/

├── config.ts

├── prompt.ts

├── tools.ts

├── validator.ts

└── index.ts
```

---

# ai/router

LLM Router。

責務:

- Model選択
- Cost管理
- Provider切替

---

構成:

```
router/

modelRouter.ts

provider.ts

costTracker.ts
```

---

# ai/prompts

Prompt管理。

```
prompts/

system/

agents/

tasks/
```

---

# ai/skills

Skill管理。

例:

```
skills/

react/

nextjs/

seo/

qa/
```

---

# ai/memory

Memory管理。

```
memory/

retriever.ts

compressor.ts

manager.ts
```

---

# ai/tools

Agent Tool。

例:

```
tools/

github/

browser/

filesystem/

database/
```

---

# ai/validators

AI Output検証。

例:

```
schemaValidator.ts

responseValidator.ts
```

---

# database

Database Layer。

```
database/

├── repositories/

├── queries/

└── migrations/
```

---

# lib

共通Library。

例:

```
lib/

auth/

logger/

config/

constants/
```

---

# hooks

共有React Hooks。

例:

```
useWorkflow.ts

useAgent.ts
```

---

# types

Global Type。

例:

```
types/

agent.ts

workflow.ts

project.ts
```

---

# utils

Utility。

例:

```
date.ts

format.ts
```

---

# tests

テスト。

```
tests/

├── unit/

├── integration/

└── e2e/
```

---

# Naming Rules

## Folder

小文字。

例:

```
workflow
```

---

## Component

PascalCase。

例:

```
AgentCard.tsx
```

---

## Function

camelCase。

例:

```
createAgent()
```

---

## Database

snake_case。

例:

```
workflow_tasks
```

---

# Development Rule

新Feature追加時:

必ず:

```
Feature Folder

↓

Service

↓

API

↓

UI
```

の順番を検討する。

---

# Forbidden Structure

禁止:

```
src/

├── components

├── everything.ts
```

巨大ファイル化。

---

# Future Extension

将来追加:

```
src/

├── billing/

├── crm/

├── analytics/

└── integrations/
```

---

# Success Criteria

この構造により、

AI Workforce OSは、

小規模個人開発から、

複数Agent・複数ユーザー対応可能な

AI Business Platformへ拡張できる。
