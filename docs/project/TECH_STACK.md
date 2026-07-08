---
Document: TECHNOLOGY STACK DECISION
File: docs/project/TECH_STACK.md
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

# AI Workforce OS Technology Stack

## Purpose

このドキュメントはAI Workforce OSで採用する技術スタックと選定理由を定義する。

目的:

- 長期保守性
- AI開発との相性
- 拡張性
- 開発速度
- コスト最適化

を両立する。

---

# Core Technology Philosophy

採用基準:

```
Modern

↓

Stable

↓

AI Friendly

↓

Scalable
```

---

# Frontend

## Framework

採用:

```
Next.js
```

---

理由:

- Reactベース
- Server Component対応
- SEO対応
- Full Stack開発可能
- AIツールとの相性が良い

---

## Language

採用:

```
TypeScript
```

---

理由:

- 型安全
- AI生成コード品質向上
- 大規模化対応

---

# UI Framework

採用:

```
Tailwind CSS
```

---

理由:

- 高速開発
- AI生成との相性
- Design System構築容易

---

# Component Library

採用予定:

```
shadcn/ui
```

---

理由:

- Copy Based Architecture
- 完全カスタマイズ可能
- SaaS UI向き

---

# Animation

採用予定:

```
Framer Motion
```

用途:

- UI Animation
- Workflow Visualization
- AI Activity表示

---

# State Management

## Server State

採用:

```
TanStack Query
```

用途:

- API Data
- AI Result
- Async Data

---

## Client State

採用:

```
Zustand
```

用途:

- UI State
- Temporary State

---

# Backend

## Runtime

採用:

```
Node.js
```

---

理由:

- Next.js統合
- TypeScript統一
- AI SDK利用容易

---

# API Architecture

採用:

```
REST API First
```

---

理由:

- シンプル
- AI Agent連携容易
- Debug容易

---

将来:

GraphQL検討可能。

---

# Database

## Main Database

採用:

```
PostgreSQL
```

---

理由:

- 信頼性
- JSON対応
- 拡張性
- pgvector対応可能

---

## ORM

採用:

```
Prisma
```

---

理由:

- TypeScript相性
- Migration管理
- AI生成コード品質

---

# AI Layer

## AI SDK

採用:

```
Vercel AI SDK
```

---

用途:

- Streaming Response
- Chat Interface
- Model Integration

---

# LLM Provider

Phase1:

```
OpenAI API

Anthropic API
```

---

Architecture:

```
Agent

↓

LLM Router

↓

Provider
```

---

# Model Strategy

基本:

Low Cost Model

↓

必要時High Model

---

用途別:

## Simple Task

- Summary
- Classification

Low Cost Model

---

## Complex Task

- Architecture
- Debug
- Code Review

High Capability Model

---

# Vector Search

Phase1:

PostgreSQL Extension

```
pgvector
```

を検討。

---

理由:

- Database統合
- 管理コスト削減

---

Phase2:

必要なら:

- Dedicated Vector DB

を検討。

---

# Authentication

Phase1:

```
Local Only

No Authentication
```

---

理由:

個人利用開始時は不要。

---

ただし将来対応:

- Auth.js
- OAuth
- Google Login

を考慮。

---

# File Storage

Phase1:

Local Storage

---

Phase2:

Object Storageへ移行。

候補:

- Amazon S3
- Cloudflare R2
- Vercel Blob

---

# Hosting

推奨:

```
Vercel
```

---

理由:

- Next.js最適化
- Deploy容易
- Preview環境

---

# Development Environment

推奨:

```
Cursor

↓

GitHub

↓

Vercel
```

---

# Testing

## Unit Test

候補:

```
Vitest
```

---

## Component Test

候補:

```
React Testing Library
```

---

## E2E

候補:

```
Playwright
```

---

# Code Quality

採用:

```
ESLint

Prettier

TypeScript Strict
```

---

# Monitoring

Phase2:

候補:

```
Sentry
```

用途:

- Error Tracking
- Performance Monitoring

---

# Analytics

Phase2:

候補:

```
PostHog
```

用途:

- Usage Analysis
- Product Improvement

---

# External Integration

将来:

## Communication

- Slack
- Discord
- Email

---

## Project Management

- Linear
- Notion
- GitHub

---

## Accounting

- freee
- Money Forward

---

# Cost Optimization Rules

常に:

- 無料枠優先
- 必要時のみ有料
- API利用量監視
- Cache利用

---

# Architecture Summary

最終構成:

```
Frontend

Next.js
TypeScript
Tailwind
shadcn/ui


Backend

Node.js
REST API


Database

PostgreSQL
Prisma


AI

Agent System
LLM Router
OpenAI
Anthropic


Infrastructure

GitHub
Vercel
```

---

# Decision Rule

新技術採用時:

以下を確認する。

```
必要性

↓

既存技術で代替可能か

↓

維持コスト

↓

将来拡張性
```

---

# Success Criteria

このTechnology Stackは、

個人開発から始め、

将来的にSaaS化・販売可能な規模まで成長できる基盤として設計する。
