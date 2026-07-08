---
Document: ARCHITECTURE
File: docs/04_ARCHITECTURE.md
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

# Architecture

## Purpose

本ドキュメントはAI Workforce OSのシステム全体の構成を定義する。

すべての実装は本アーキテクチャに従う。

Requirementsを満たすことを最優先とし、実装の都合でArchitectureを変更してはならない。

---

# Architecture Principles

本システムは以下を設計原則とする。

- AI First
- Workflow First
- Artifact Driven
- Event Driven
- Human in the Loop
- Single Source of Truth
- Modular Architecture
- Offline First
- Local First

---

# System Overview

システムは以下のレイヤーで構成する。

```
Presentation Layer
        │
Application Layer
        │
AI Layer
        │
Infrastructure Layer
```

各レイヤーは責務を明確に分離する。

---

# Layer 1

## Presentation Layer

役割

ユーザーインターフェース。

使用技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

責務

- 画面表示
- 入力受付
- 状態表示
- Dashboard
- Project画面
- Workflow画面
- Settings画面

ここでは業務ロジックを書かない。

---

# Layer 2

## Application Layer

役割

業務ロジック。

責務

- Project管理
- Workflow管理
- Task管理
- Approval管理
- Notification管理
- Artifact管理

このレイヤーがRequirementsを実装する。

---

# Layer 3

## AI Layer

AI Workforce OSの中核。

構成

- AI Secretary
- AI Agents
- Router
- Prompt Engine
- Memory Engine
- Skill Engine

AIに関する処理はすべてここへ集約する。

---

## AI Secretary

責務

- Workflow制御
- Agent管理
- Task生成
- Summary生成
- Recommendation生成

唯一のオーケストレーター。

---

## AI Agents

責務

専門業務。

例

- Frontend
- Backend
- Designer
- QA
- Legal
- Marketing

Agent同士は通信しない。

Secretary経由のみ。

---

## Router

責務

最適なLLMを選択する。

判断基準

- Prompt Cache
- Cost
- Model性能
- Token数
- Task種類

---

## Prompt Engine

責務

Prompt生成。

入力

Task

Workflow

Skill

Memory

出力

完成Prompt

---

## Skill Engine

責務

Markdown Skillsを管理する。

例

React.md

NextJS.md

QA.md

Legal.md

Promptには必要Skillのみ読み込む。

---

## Memory Engine

責務

Memory管理。

## Phase 1（App v0.2.0）

2層構造

```
Short Term Memory
Project Memory
```

## 将来拡張

Global Knowledge / User Memory / Skill Memory / Client Memory

不要Memoryは送信しない。

---

# Layer 4

## Infrastructure Layer

役割

データ保存・外部連携。

構成

PostgreSQL

Prisma

Filesystem

LLM Providers

GitHub

Figma

Vercel

将来

S3

Cloud Storage

Notion

Linear

---

# Event Driven

システムはイベント駆動で動作する。

例

Task Created

↓

Secretary

↓

Agent Assigned

↓

Artifact Generated

↓

Approval Requested

↓

Workflow Continued

イベントを中心に状態を更新する。

---

# Artifact Driven

AI同士はArtifactのみ受け渡す。

チャット履歴は共有しない。

Artifactが唯一の成果物となる。

---

# Directory Structure

```
app/

components/

features/

lib/

agents/

skills/

prompts/

memory/

artifacts/

workflows/

database/

types/

hooks/

utils/

docs/

specs/

.cursor/
```

各ディレクトリは責務を分離する。

---

# State Management

状態管理

Server State

TanStack Query

Client State

Zustand

Form

React Hook Form

Validation

Zod

---

# API Architecture

Frontend

↓

Application

↓

AI Layer

↓

Infrastructure

APIは責務ごとに分離する。

---

# Database

ORM

Prisma

Database

PostgreSQL

Migration

Prisma Migration

UUIDをPrimary Keyとする。

---

# Authentication

Phase1

Single User

Local Only

認証不要

Phase2

Authentication追加

---

# Logging

保存する。

Application Log

AI Log

Workflow Log

Approval Log

System Log

Error Log

ログは削除しない。

---

# Error Handling

すべてのエラーは分類する。

Validation Error

Business Error

LLM Error

API Error

Database Error

Unexpected Error

AI Secretaryへ通知する。

---

# Performance

最優先

Prompt Cache

↓

Skills

↓

Memory

↓

Mini Model

↓

Large Model

不要Contextを送信しない。

---

# Token Optimization

以下を採用する。

Prompt Cache

Markdown Skills

Artifact参照

Memory分離

短いPrompt

Router

Batch API

Context Compression

長いチャットは禁止。

---

# Security

API Key暗号化

Environment Variables

入力Validation

Role Separation

Approval必須

監査ログ保存

---

# Scalability

将来対応

Multi User

Multi Workspace

Marketplace

Plugin

Cloud

Billing

Team

SaaS

現在は考慮のみ。

---

# Architecture Rules

PresentationはAIを知らない。

ApplicationはLLMを知らない。

AI LayerのみLLMを知る。

Infrastructureは業務ロジックを持たない。

責務を越えて実装してはならない。

---

# Success Criteria

Requirementsをすべて満たし、

責務が明確に分離され、

Cursorが迷わず実装できる構造になっていること。

AIの変更がUIへ影響せず、

UI変更がAIへ影響しない構造を実現する。
