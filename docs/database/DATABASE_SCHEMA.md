---
Document: DATABASE SCHEMA DESIGN
File: docs/database/DATABASE_SCHEMA.md
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

# AI Workforce OS Database Schema Design

## 1. Purpose

このドキュメントはAI Workforce OSのデータモデルを定義する。

設計方針:

- 個人利用から開始
- 将来的なMulti User対応
- AI Agent管理
- Workflow管理
- Memory管理
- Cost管理

を考慮する。

---

# 2. Database Technology

採用:

```
PostgreSQL
```

ORM:

```
Prisma
```

---

# 3. Data Architecture

```
User

↓

Workspace

↓

Project

↓

Workflow

↓

Task

↓

Agent Execution

↓

Artifact
```

---

# 4. Main Entities

主要Entity:

```
User

Workspace

Project

Workflow

Stage

Task

Agent

Skill

Prompt

Memory

Artifact

Approval

ExecutionLog

CostRecord
```

---

# 5. User

## Purpose

利用者管理。

Phase1では1ユーザー。

将来Multi User対応。

---

Fields:

```
id

email

name

created_at

updated_at
```

---

# 6. Workspace

## Purpose

ユーザーの作業環境。

将来的なチーム単位。

---

Fields:

```
id

name

owner_id

created_at
```

---

# 7. Project

## Purpose

仕事単位。

例:

- Web制作
- アプリ開発
- 業務改善

---

Fields:

```
id

workspace_id

name

description

status

deadline

created_at

updated_at
```

---

Status:

```
draft

active

completed

archived
```

---

# 8. Workflow

## Purpose

仕事の流れ。

---

Fields:

```
id

project_id

name

description

status

current_stage_id

created_at
```

---

# 9. Stage

## Purpose

Workflow内の工程。

---

Fields:

```
id

workflow_id

name

order

status
```

---

Example:

```
Requirement

Design

Development

QA
```

---

# 10. Task

## Purpose

実行単位。

---

Fields:

```
id

stage_id

title

description

priority

status

assigned_agent_id

approval_level

created_at
```

---

Status:

```
todo

running

review

done

blocked
```

---

# 11. Agent

## Purpose

AI Worker管理。

---

Fields:

```
id

name

role

description

version

status

created_at
```

---

Example:

```
Secretary AI

Frontend AI

QA AI
```

---

# 12. Skill

## Purpose

Agent能力管理。

---

Fields:

```
id

name

description

version

created_at
```

---

Relation:

```
Agent

many-to-many

Skill
```

---

# 13. Prompt

## Purpose

AI指示文管理。

---

Fields:

```
id

agent_id

type

content

version

created_at
```

---

Types:

```
system

task

validation
```

---

# 14. Memory

## Purpose

AI記憶管理。

---

Fields:

```
id

type

content

embedding

importance

source

created_at
```

---

Types:

```
short_term
project
```

将来拡張:

```
user
skill
knowledge
client
global
```

---

# 15. Artifact

## Purpose

成果物管理。

---

例:

```
Code

Document

Design

Report
```

---

Fields:

```
id

task_id

type

name

location

version

created_at
```

---

# 16. Approval

## Purpose

Human Approval管理。

---

Fields:

```
id

task_id

status

comment

approved_by

approved_at
```

---

Status:

```
pending

approved

rejected
```

---

# 17. ExecutionLog

## Purpose

AI実行履歴。

---

Fields:

```
id

agent_id

task_id

model

input_tokens

output_tokens

duration

status

created_at
```

---

用途:

- Debug
- Cost分析
- Agent改善

---

# 18. CostRecord

## Purpose

AI利用料金管理。

---

Fields:

```
id

execution_id

provider

model

token_usage

cost

created_at
```

---

# 19. Relationship Overview

```
User

↓

Workspace

↓

Project

↓

Workflow

↓

Stage

↓

Task

↓

ExecutionLog

↓

Agent
```

---

# 20. Agent Relationship

```
Agent

↓

Prompt

↓

Skill

↓

Memory

↓

Execution
```

---

# 21. Index Strategy

検索頻度が高い項目:

Index対象:

```
project_id

workflow_id

task_status

agent_id

created_at
```

---

# 22. Vector Search

Memory:

```
embedding vector
```

を保存。

用途:

RAG検索。

---

# 23. Future SaaS Support

将来追加:

```
organization_id

team_id

permission

billing
```

---

# 24. Migration Rule

DB変更:

必ず:

```
Schema Change

↓

Migration

↓

Test

↓

Apply
```

---

# 25. Data Security

禁止:

- Secret保存
- API Key保存
- 不要な個人情報保存

---

# Success Criteria

このDatabase設計により、

AI Workforce OSは個人ツールから始まり、

将来的に複数ユーザーが利用可能なAI業務プラットフォームへ拡張できる。
