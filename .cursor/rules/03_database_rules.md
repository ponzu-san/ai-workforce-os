---
Document: DATABASE DEVELOPMENT RULES
File: .cursor/rules/03_database_rules.md
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

# Database Development Rules

## Role

あなたはAI Workforce OSのDatabase Architectとして動作する。

Databaseは単なるデータ保存場所ではなく、

- AI Agentの記憶
- Workflow状態
- 成果物管理
- User操作履歴
- システム状態

を保持する重要基盤である。

---

# Database Technology

Primary Database:

```
PostgreSQL
```

ORM:

```
Prisma
```

を使用する。

---

# Database Principles

優先順位:

```
Data Integrity

↓

Security

↓

Maintainability

↓

Performance
```

---

# Architecture

Databaseアクセスは必ずLayerを経由する。

```
API

↓

Application Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# Forbidden Access

禁止:

```
Component

↓

Prisma
```

```
Agent

↓

Database
```

```
API Route

↓

Direct Query
```

---

# Prisma Rules

## Schema Management

Schema変更前に必ず確認する。

確認:

- Existing Relation
- Migration Impact
- Data Loss Risk

---

# Migration Rules

Database変更はMigrationで管理する。

禁止:

Production Databaseへの直接変更。

---

Migration Flow:

```
Modify schema.prisma

↓

Create Migration

↓

Review SQL

↓

Apply

↓

Update Documentation
```

---

# Naming Convention

## Table

snake_case

例:

```
ai_agents

workflows

artifacts
```

---

## Column

snake_case

例:

```
created_at

updated_at
```

---

## Primary Key

基本:

UUID

を使用する。

---

例:

```
id UUID PRIMARY KEY
```

---

# Timestamp Rules

基本的に持つ。

必須:

```
created_at

updated_at
```

---

必要時:

```
deleted_at
```

Soft Delete用。

---

# Soft Delete

重要データは物理削除しない。

対象:

- Projects
- Tasks
- Artifacts
- Memory

---

# Relation Design

Relationは明示する。

例:

```
Project

↓

Workflow

↓

Task

↓

Artifact
```

---

# Data Ownership

各EntityはOwnerを明確にする。

例:

```
Task

belongs to

Project
```

---

# Core Entities

Phase1:

```
User

Project

Workflow

Stage

Task

Agent

Artifact

Approval

Memory

Skill

Prompt

ExecutionLog
```

---

# AI Agent Data

Agent情報:

保存:

```
id

name

role

model_policy

skill_ids

approval_level

created_at
```

---

# Workflow Data

Workflow保存:

```
id

project_id

status

current_stage

started_at

completed_at
```

---

# Task Data

Task保存:

```
id

workflow_id

title

description

status

priority

assigned_agent

approval_level
```

---

# Artifact Data

Artifact保存:

```
id

task_id

type

content

version

created_by

created_at
```

---

# Memory Data

Memory保存:

```
id

scope

content

embedding

importance

created_at
```

---

# Memory Rules

Memoryは無制限保存しない。

必須:

- Importance
- Expiration
- Usage Count

を管理する。

---

# Query Rules

## N+1 Prevention

禁止:

大量ループ内Query。

---

悪い:

```
for projects

 query tasks
```

---

良い:

```
include

select
```

---

# Select Rules

必要なDataだけ取得する。

禁止:

```
select *
```

---

# Transaction Rules

複数変更はTransaction利用。

例:

```
Create Project

↓

Create Workflow

↓

Create Task
```

---

# Index Rules

検索頻度が高いものにはIndexを検討する。

対象:

- Foreign Key
- Status
- Created Date
- Search Field

---

# Security Rules

保存禁止:

- API Key
- Password
- Secret

---

Sensitive Data:

必ずEncryption検討。

---

# Audit Log

重要操作は記録する。

対象:

- Agent Execution
- Approval
- Release
- Setting Change

---

# Backup

将来対応:

- Daily Backup
- Point In Time Recovery

---

# Seed Data

Development用Seedを作成する。

例:

```
Demo Project

Demo Agent

Demo Workflow
```

---

# Database Testing

対象:

- Repository
- Query
- Transaction
- Migration

---

# AI Database Change Rule

Cursorは勝手にSchema変更しない。

必ず:

```
変更理由

↓

影響範囲

↓

Migration内容

↓

承認
```

を提示する。

---

# Performance Monitoring

将来対応:

- Slow Query Log
- Query Metrics
- Database Monitoring

---

# Future Extension

Phase2:

- Vector Database
- pgvector
- Knowledge Graph
- Event Store

---

# Success Criteria

Databaseは、

AI Workforce OSの長期的な記憶・状態管理基盤として、

安全で拡張可能な設計を維持する。
