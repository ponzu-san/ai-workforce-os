---
Document: CODING STANDARDS
File: docs/17_CODING_STANDARDS.md
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

# Coding Standards

## Purpose

本ドキュメントはAI Workforce OS開発におけるコード品質基準を定義する。

Cursor AIを含むすべての開発者・AI Agentは、
本ルールに従ってコードを生成・修正する。

目的:

- 可読性向上
- 保守性向上
- AI生成コード品質向上
- バグ削減
- 長期運用可能な設計

---

# Core Principles

以下を最優先する。

```
Simple > Clever

Readable > Short

Maintainable > Fast Implementation

Explicit > Implicit
```

---

# Technology Rules

## Language

TypeScriptを使用する。

JavaScriptのみの新規コードは禁止。

---

## TypeScript Configuration

strict modeを有効化する。

禁止:

```ts
any;
```

例外:

- 外部Library制約
- Legacy移行

使用時は理由をコメントする。

---

# Naming Rules

## Variables

camelCase

例:

```ts
projectStatus;
agentResult;
```

---

## Components

PascalCase

例:

```tsx
AgentCard;

WorkflowTimeline;
```

---

## Functions

camelCase

例:

```ts
createTask();

validatePrompt();
```

---

## Constants

UPPER_SNAKE_CASE

例:

```ts
MAX_RETRY_COUNT;
DEFAULT_TIMEOUT;
```

---

## Files

kebab-case

例:

```
agent-card.tsx

workflow-service.ts
```

---

# React Rules

## Component Design

1 Component 1 Responsibility。

悪い例:

```
Dashboard.tsx
```

すべてを書く。

良い例:

```
Dashboard

├── DashboardHeader

├── AgentStatusCard

├── WorkflowCard
```

---

# Component Size

目安:

100〜200行以内。

超える場合は分割する。

---

# Props Rules

Propsは明確な型を定義する。

例:

```ts
interface AgentCardProps {
  name: string;
  status: AgentStatus;
}
```

---

# State Management

## Server State

TanStack Query

---

## Client State

Zustand

---

## Form State

React Hook Form

---

不要なGlobal Stateは禁止。

---

# Next.js Rules

## Server Component First

基本はServer Component。

Client Componentは必要時のみ。

---

Client Component条件:

- useState
- useEffect
- Browser API
- Interactive UI

---

# API Rules

FrontendからDatabaseを直接操作しない。

必ず:

```
Component

↓

Feature Service

↓

API

↓

Application Layer
```

---

# Validation Rules

入力値は必ずValidationする。

使用:

- Zod
- TypeScript Type

---

# Error Handling

try/catchを適切に利用する。

禁止:

```ts
catch {}
```

エラーを握り潰さない。

---

# Logging

console.logは禁止。

利用:

Logger Service

---

# Async Rules

Promise処理はasync/awaitを使用する。

不要なcallbackは禁止。

---

# AI Generated Code Rules

AIが生成したコードは必ず確認する。

確認項目:

- Architecture適合
- Type安全性
- Error処理
- Performance
- Security

---

# AI Agent Code Rules

Agentは直接UI操作しない。

禁止:

```
Agent

↓

React Component
```

---

正しい流れ:

```
Agent

↓

Application Layer

↓

API

↓

Frontend
```

---

# Database Rules

DatabaseアクセスはRepository経由。

禁止:

```
Component

↓

Prisma
```

---

正しい:

```
Service

↓

Repository

↓

Prisma
```

---

# Prisma Rules

禁止:

- Raw SQL乱用
- 巨大Include
- N+1 Query

---

# Security Rules

禁止保存:

- API Key
- Password
- Secret

---

入力:

必ずSanitizeする。

---

# Performance Rules

意識する。

- 不要なRender削減
- Lazy Loading
- Pagination
- Cache利用

---

# Testing Rules

重要LogicにはTestを書く。

対象:

- AI Router
- Workflow Engine
- Prompt Engine
- Memory Engine
- Validation

---

# Test Naming

形式:

```
should_[expected]_when_[condition]
```

例:

```
should_retry_when_llm_failed
```

---

# Git Rules

## Branch

```
main

develop

feature/*
fix/*
```

---

# Commit Message

形式:

```
type: description
```

例:

```
feat: add workflow engine

fix: resolve task status bug
```

---

# Commit Types

```
feat

fix

docs

refactor

test

chore
```

---

# Pull Request Rules

確認:

- Test Pass
- Type Check Pass
- Lint Pass
- Documentation Updated

---

# Documentation Rules

変更した機能はDocumentation更新する。

対象:

- Architecture
- API
- Database
- UI

---

# Cursor AI Rules

Cursorへ依頼するとき:

必ず確認する。

```
Before coding:

1. Read related docs

2. Confirm architecture

3. Explain plan

4. Implement

5. Run validation
```

---

# Forbidden Actions

Cursorは禁止。

- 勝手なArchitecture変更
- 不要なLibrary追加
- Database Schema変更
- API変更

承認必須。

---

# Code Review Checklist

確認:

□ Type安全

□ 命名適切

□ 責務分離

□ Error処理

□ Security

□ Test

□ Performance

---

# Future Extension

Phase2:

- Automated Code Review Agent
- AI Refactoring Agent
- Security Audit Agent
- Performance Optimization Agent

---

# Success Criteria

AI Workforce OSのコードは、

人間とAIが共同開発しても品質が低下せず、

長期間安全に拡張できる状態を維持する。
