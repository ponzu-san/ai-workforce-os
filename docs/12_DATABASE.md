---
Document: DATABASE ARCHITECTURE
File: docs/12_DATABASE.md
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

# Database Architecture

## Purpose

DatabaseはAI Workforce OSの唯一の永続データストアである。

システムで扱うすべての情報はDatabaseへ保存し、
状態管理・履歴管理・監査・分析を可能にする。

DatabaseはInfrastructure Layerに属し、
業務ロジックを持たない。

---

# Design Principles

Databaseは以下を原則とする。

- Single Source of Truth
- Normalization First
- Immutable History
- Soft Delete
- Audit Friendly
- UUID First
- Provider Independent

---

# Technology Stack

Database

- PostgreSQL

ORM

- Prisma ORM

Migration

- Prisma Migrate

ID

- UUID

Timestamp

- UTC

---

# Core Entities

Phase1で管理するエンティティ

- Workspace
- User
- Project
- Workflow
- Stage
- Task
- Agent
- Artifact
- Approval
- Notification
- Memory
- Skill
- Prompt
- Event
- Log
- Setting

---

# Entity Relationship

```
Workspace

└── User

└── Project
      │
      ├── Workflow
      │      │
      │      ├── Stage
      │      │      │
      │      │      └── Task
      │      │              │
      │      │              ├── Artifact
      │      │              ├── Approval
      │      │              ├── Event
      │      │              └── Notification
      │
      ├── Memory
      ├── Prompt
      └── Log

Agent

↓

Task
```

---

# Common Columns

すべての主要テーブルは以下を持つ。

- id
- createdAt
- updatedAt
- archivedAt
- version

UUIDをPrimary Keyとする。

削除は行わず、
`archivedAt`で論理削除する。

---

# Workspace

保持する情報

- Name
- Description
- Settings

Phase1ではWorkspaceは1件のみ。

---

# User

保持する情報

- Name
- Email
- Role
- Locale
- Timezone

Phase1ではSingle User。

認証は導入しない。

---

# Project

保持する情報

- Name
- Description
- Status
- Priority
- Deadline
- Tags

Projectは複数Workflowを持つ。

---

# Workflow

保持する情報

- Name
- Status
- Progress
- Current Stage
- Started At
- Completed At

WorkflowはProjectへ属する。

---

# Stage

保持する情報

- Name
- Order
- Status
- Progress

StageはWorkflowへ属する。

---

# Task

保持する情報

- Title
- Description
- Status
- Priority
- Assignee Agent
- Due Date
- Estimate
- Result

TaskはStageへ属する。

---

# Agent

保持する情報

- Name
- Role
- Version
- Status
- Default Model
- Required Skills

AgentはTaskへ割り当てられる。

---

# Artifact

保持する情報

- Name
- Type
- Version
- Status
- Path
- Summary
- Metadata

ArtifactはTaskへ属する。

---

# Approval

保持する情報

- Status
- Requested By
- Approved By
- Comment
- Approved At

ApprovalはTaskまたはArtifactへ紐付く。

---

# Notification

保持する情報

- Title
- Type
- Priority
- Status
- Summary
- Read At

NotificationはProjectへ紐付く。

---

# Memory

保持する情報

- Layer
- Title
- Content
- Summary
- Tags
- Version

Memory Layer

- Global
- Client
- Project
- Session

---

# Skill

保持する情報

- Name
- Category
- Version
- Description
- Dependencies
- Tags

Markdownファイルと同期する。

---

# Prompt

保持する情報

- Template
- Version
- Variables
- Output Format
- Metadata

Prompt履歴を保持する。

---

# Event

保持する情報

- Type
- Payload
- Source
- Target
- Timestamp

すべての状態変更はEventとして保存する。

---

# Log

保持する情報

- Level
- Category
- Message
- Metadata
- Execution Time

削除しない。

---

# Setting

保持する情報

- Key
- Value
- Category
- Updated At

Workspace単位で管理する。

---

# Index Strategy

Indexを付与する。

- Project Status
- Workflow Status
- Task Status
- Task Priority
- Agent
- Event Type
- Memory Tags
- Skill Category
- Notification Status

検索性能を向上させる。

---

# Transactions

以下はTransactionで実行する。

- Workflow更新
- Task完了
- Approval
- Artifact保存
- Event生成

途中失敗時はRollbackする。

---

# Constraints

制約

- UUID一意
- Version必須
- Status列挙型
- Foreign Key整合性
- Null最小化

---

# Backup

Phase1

- PostgreSQL Dump

Phase2

- 自動バックアップ
- 差分バックアップ
- クラウドバックアップ

---

# Audit

保存する。

- 作成
- 更新
- 承認
- 実行
- エラー
- Version変更

監査ログは削除しない。

---

# Performance

最適化

- Index
- Pagination
- Lazy Loading
- Select最適化
- N+1回避

PrismaのIncludeは必要最小限とする。

---

# Security

- SQL Injection対策
- Prisma利用
- Soft Delete
- Audit Log
- Validation
- UUID利用

機密情報は暗号化して保存する。

---

# Future Extension

Phase2

- Multi Workspace
- Team
- Organization
- RBAC
- SaaS対応
- Tenant分離
- Database Partition
- Read Replica

---

# Success Criteria

DatabaseはAI Workforce OSの全データを一元管理し、

履歴・監査・拡張性・パフォーマンス・保守性を両立する。

すべてのデータは正規化され、

CursorがPrisma Schemaへ直接落とし込める設計となっている。
