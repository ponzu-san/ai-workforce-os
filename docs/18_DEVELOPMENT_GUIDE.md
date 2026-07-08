---
Document: DEVELOPMENT GUIDE
File: docs/18_DEVELOPMENT_GUIDE.md
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

# Development Guide

## Purpose

本ドキュメントはAI Workforce OSを実装するための開発手順を定義する。

Cursor AIを開発パートナーとして利用し、
設計書を基準に段階的に実装する。

目的:

- Architectureを維持する
- MVPを早期完成させる
- 不要な実装を避ける
- AI開発効率を最大化する

---

# Development Philosophy

開発方針:

```
Design First

↓

Small Implementation

↓

Validation

↓

Iteration
```

一度に巨大な機能を作らない。

---

# Development Environment

## Required

- Node.js
- npm
- Git
- Cursor
- PostgreSQL

---

# Initial Setup

## Step 1

Repository作成

```
ai-workforce-os
```

---

## Step 2

Next.js作成

設定:

```
TypeScript

App Router

ESLint

Tailwind CSS
```

---

## Step 3

Dependencies追加

Core:

```
prisma

zod

zustand

@tanstack/react-query

react-hook-form
```

UI:

```
shadcn/ui

lucide-react
```

---

## Step 4

Database設定

PostgreSQL接続。

Prisma初期化。

---

## Step 5

Directory作成

`16_DIRECTORY_STRUCTURE.md`

に従う。

---

# Cursor Setup

## Cursor Rules

配置:

```
.cursor/rules/
```

作成:

```
architecture.md

coding-style.md

frontend.md

ai-agent.md

database.md
```

---

# Development Order

実装順序は以下とする。

---

# Phase 0

## Foundation（App v0.1.0）

目的:

開発基盤構築。

実装:

- Project setup（Next.js / TypeScript / Tailwind / shadcn/ui）
- Directory structure
- Database connection（Prisma / PostgreSQL）
- 初期 Database Schema
- 基本 Layout
- Error handling / Logger
- ESLint / Prettier

完成条件:

- アプリケーション起動可能
- Database 接続可能
- 基本 Layout 表示
- Type Check / Lint 通過

---

# Phase 1

## Personal AI Workspace MVP（App v0.2.0）

最初に作る機能。Secretary AI のみ実装。

---

## 1. Dashboard

機能:

- Current Tasks
- AI Status
- Approval
- Notifications

目的:

毎日見る画面を完成させる。

---

## 2. Project Management

機能:

- Project作成
- Project一覧
- Project詳細

---

## 3. Task Management

機能:

- Task作成
- Status管理
- Priority
- Assignment

---

## 4. Secretary AI

最初のAI Agent。

役割:

- Task整理
- Workflow開始
- 状況説明
- User補助

---

## 5. LLM Router

最低限実装。

機能:

- Model選択
- API接続
- Token計測
- Cost記録

---

# Phase 2

## AI Workflow System

実装:

- Workflow Engine
- Stage
- Agent Execution
- Approval Flow
- Event System

---

# Phase 3

## Development Team AI

追加Agent:

## Frontend Agent

担当:

- React
- Next.js
- TypeScript
- UI実装

---

## Designer Agent

担当:

- UI案
- Design Review
- Figma補助

---

## QA Agent

担当:

- Test
- Bug検出
- Review

---

## Legal Agent

担当:

- Privacy
- Contract
- Risk Check

---

## Marketing Agent

担当:

- SEO
- Landing Page
- Analytics

---

# Phase 4

## Advanced AI System

追加:

- Memory Engine
- Skill Engine
- Prompt Optimization
- Automatic Improvement

---

# First Cursor Instruction Flow

Cursorには以下順序で指示する。

---

## Step 1

Architecture理解

Prompt:

```
docsフォルダの設計書をすべて読み込み、
AI Workforce OSのArchitectureを理解してください。
理解した内容を要約してください。
まだコードを書かないでください。
```

---

## Step 2

Implementation Plan

Prompt:

```
設計書を基準に、
Phase0の実装計画を作成してください。

変更ファイル、
必要Package、
実装順序、
リスクを提示してください。

まだコードを書かないでください。
```

---

## Step 3

Implementation

Prompt:

```
承認した計画通りに実装してください。

実装後:

- Type Check
- Lint
- Test

を実行してください。

問題があれば修正してください。
```

---

# Daily Development Flow

毎日の流れ。

```
Open Dashboard

↓

Check AI Status

↓

Select Priority

↓

Ask Secretary AI

↓

Approve Plan

↓

Execute

↓

Review Result
```

---

# Feature Development Rule

新機能追加時。

必ず作成:

1. Requirement

2. Architecture Impact

3. Database Change

4. API Change

5. UI Change

6. Test

---

# Release Process

## Before Release

確認:

□ Type Check

□ Lint

□ Test

□ Security Check

□ Database Migration

□ Documentation Update

---

# Version Management

## Application Version

管理:

```
v0.1.0
```

対象:

- Features
- Release

---

## Design Document Version

管理:

```
0.1.0
```

対象:

- Architecture
- Specification

---

# Error Handling During Development

問題発生時。

順序:

1. Log確認

2. Error原因分析

3. Architecture確認

4. 修正

5. Test追加

---

# AI Development Rules

AIに任せる:

- Boilerplate
- Component作成
- Test生成
- Documentation

人間が判断:

- Architecture
- Security
- Business Logic
- Final Approval

---

# MVP Definition

Version 0.1.0完成条件。

必須:

- Dashboard
- Project管理
- Task管理
- Secretary AI
- LLM接続
- Approval Flow
- Artifact保存

---

# Future Development

Version 0.5

- Multiple Agents
- Workflow Automation
- Memory
- Skills

Version 1.0

- Complete AI Workforce OS
- SaaS Ready
- Multi User

---

# Success Criteria

AI Workforce OSは、

「一人で10人分の仕事ができる環境」

を実現するための個人AIチーム基盤として、

段階的に成長可能な設計とする。

開発者は設計書を見るだけで、
Cursorと協力して安全に開発を進められる状態を維持する。
