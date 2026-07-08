---
Document: FRONTEND ARCHITECTURE
File: docs/14_FRONTEND.md
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

# Frontend Architecture

## Purpose

FrontendはAI Workforce OSのユーザー操作・状態可視化・AI操作インターフェースを担当する。

ユーザーが現在の状況を一目で理解し、
必要なAIへ指示を出し、
承認・修正・管理できるUIを提供する。

---

# Design Principles

Frontendは以下を原則とする。

- User First
- AI Assisted
- Information Dense
- Simple Operation
- Component Driven
- Type Safe
- Scalable

---

# Technology Stack

## Framework

Next.js

App Router採用。

---

## Language

TypeScript

strict modeを有効化する。

---

## Styling

Tailwind CSS

---

## UI Component

shadcn/ui

カスタマイズ可能なComponent Libraryとして利用する。

---

## State Management

Server State

TanStack Query

Client State

Zustand

Form

React Hook Form

Validation

Zod

---

## Icons

Lucide Icons

---

## Animation

必要箇所のみ利用する。

目的

- 状態変化表示
- Loading
- Transition

過剰なAnimationは禁止する。

---

# Application Layout

基本Layout

```
------------------------------------------------

Sidebar

------------------------------------------------

Header

------------------------------------------------

Main Content

------------------------------------------------

AI Assistant Panel

------------------------------------------------
```

---

# Main Navigation

Sidebar項目

```
Dashboard

Projects

Workflows

Tasks

Agents

Artifacts

Approvals

Memory

Skills

Prompts

Notifications

Settings
```

---

# Dashboard

最重要画面。

目的

現在状況を数秒で理解できること。

表示項目

- Active Projects
- Running Workflows
- Pending Approval
- AI Status
- Recent Artifacts
- Notifications
- Cost Summary

---

# Project Page

表示

Project Overview

Workflow

Tasks

Artifacts

Memory

Logs

AI Actions

---

# Workflow View

Workflowを可視化する。

表示形式

Phase1

List View

Phase2

Node Graph View

---

# Task View

表示

Task Name

Status

Agent

Progress

Artifact

History

Approval

AI Result

---

# Agent View

表示

Agent List

Agent Status

Current Task

Performance

Cost

History

---

# Artifact View

表示

Artifact Name

Type

Version

Preview

History

Compare

Approval

---

# AI Assistant Panel

常時アクセス可能。

目的

AI Secretaryとの対話。

機能

- Task作成
- 状況確認
- AI操作
- Prompt生成
- Workflow操作

---

# AI Command UX

入力例

「LP制作を開始して」

↓

AI Secretary

↓

Workflow生成

↓

確認

↓

開始

---

# Approval UX

重要操作では承認UIを表示する。

例

```
AI Proposal

↓

Approve

↓

Execute
```

---

# Status Design

状態は色だけに依存しない。

表示

Icon

Text

Badge

Tooltip

---

# Loading State

すべての非同期処理に対応する。

種類

Skeleton

Progress

Streaming

Background Processing

---

# Error UX

エラー時

表示

- 原因
- 影響範囲
- 推奨対応

AI Secretaryへ相談可能にする。

---

# Component Architecture

構成

```
components/

ui/

features/

layouts/

common/
```

---

# Feature Based Structure

機能単位で管理する。

例

```
features/

project/

workflow/

task/

agent/

artifact/

approval/
```

---

# Component Rules

Componentは以下を守る。

- Single Responsibility
- Small Component
- Props明確化
- Business Logic分離

---

# Data Fetching

Server Component優先。

Client Componentは必要箇所のみ。

---

# Form Handling

React Hook Form

↓

Zod Validation

↓

API

の流れとする。

---

# Error Boundary

各Feature単位で配置する。

Unexpected Errorでも全体停止させない。

---

# Accessibility

対応

- Keyboard操作
- Screen Reader
- Focus管理
- Contrast

---

# Responsive Design

Phase1

Desktop First

Phase2

Tablet

Mobile

---

# Performance

対策

- Code Splitting
- Lazy Loading
- Memoization
- Server Component活用
- Image Optimization

---

# AI Integration

FrontendはAI Layerを直接呼ばない。

```
UI

↓

API

↓

Application

↓

AI Layer
```

の流れを守る。

---

# Real Time Updates

Phase1

Polling

Phase2

SSE

WebSocket

---

# Theme

対応

- Light
- Dark

---

# Future Extension

Phase2

- Command Palette
- Keyboard Shortcut
- Drag & Drop Workflow
- AI Copilot UI
- Visual Workflow Builder
- Multi User UI

---

# Success Criteria

Frontendを見るだけで、

- 今何が起きているか
- 次に何をするべきか
- AIが何をしているか
- どこで承認が必要か

を理解できる。

AI Workforce OSの操作体験は、
Linearのような高い情報設計と、
CursorのようなAI操作性を融合したUIを目指す。
