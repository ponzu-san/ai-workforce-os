---
Document: UI UX DESIGN SPECIFICATION
File: docs/15_UI_UX.md
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

# UI UX Design Specification

## Purpose

本ドキュメントはAI Workforce OSのユーザー体験設計を定義する。

目標は、

「毎日開きたくなる、自分専用のAIチーム管理OS」

を実現することである。

UIはLinearの情報設計、
CursorのAI操作性、
業務管理ツールの透明性を融合した設計とする。

---

# Design Philosophy

## Core Concept

```
Human controls direction

AI executes work

System visualizes progress
```

ユーザーは細かい作業を管理するのではなく、
意思決定と承認に集中する。

---

# UX Principles

## 1. Zero Confusion

画面を開いた瞬間に、

- 現在何が進んでいるか
- 問題はあるか
- 次に何をすべきか

が理解できる。

---

## 2. AI Transparency

AIが勝手に動くブラックボックスにしない。

常に表示する。

- AIが何をしているか
- なぜ実行しているか
- 何を参考にしたか
- 次の処理

---

## 3. Human Approval

重要判断は人間が行う。

AI:

「実行できます」

↓

Human:

「承認」

↓

AI:

「実行」

---

# Overall Layout

```
┌──────────────────────────────┐
│ Header                       │
├────────┬─────────────────────┤
│        │                     │
│ Side   │ Main Area           │
│ bar    │                     │
│        │                     │
│        │                     │
├────────┴─────────────────────┤
│ AI Command Bar               │
└──────────────────────────────┘
```

---

# Sidebar Design

## Purpose

すべての重要機能へ即アクセスする。

---

# Sidebar Items

```
Dashboard

Projects

Workflows

Tasks

AI Agents

Artifacts

Approvals

Memory

Skills

Prompts

Notifications

Settings
```

---

# Sidebar Features

対応

- Pin
- Collapse
- Search
- Recent Items
- Favorite

---

# Command Palette

Cursor風操作。

ショートカット

```
Cmd + K
```

機能

- AI呼び出し
- Project検索
- Task作成
- Workflow開始
- Settings変更

---

# Dashboard Design

## Goal

3秒以内に状況把握。

---

# Dashboard Cards

## Current Focus

表示

- 今最重要のTask
- 次のAction
- Deadline

---

## AI Team Status

表示

Agent状態

例

```
Frontend AI

Working

React Component生成中
```

---

## Approval Required

表示

承認待ち一覧。

例

```
Landing Page Design

Approve?
```

---

## Workflow Progress

表示

Timeline形式。

例

```
Requirement
   ✓

Design
   ✓

Development
   ●

QA
   -
```

---

# Project UI

## Layout

```
Project Name

Progress

Workflow

Tasks

Artifacts

Memory

AI Activity
```

---

# Workflow UI

Phase1

Timeline View

Phase2

Visual Node Graph

---

# Workflow Node

表示

- Stage Name
- Status
- Agent
- Duration
- Artifact

---

# Task UI

Task Card

```
Title

Assigned AI

Status

Progress

Artifact

Action
```

---

# AI Agent UI

Agent Dashboard

表示

- Agent Name
- Role
- Current Work
- Model
- Cost
- Success Rate

---

# AI Chat Interface

単純なチャットUIにしない。

AI Command Interfaceとして設計する。

---

# AI Message Structure

AI回答は以下で表示。

```
Summary

↓

Reason

↓

Action

↓

Approval
```

---

# Prompt Button System

重要機能。

ユーザーが毎回Promptを書く必要をなくす。

---

# Example

Task画面

```
[詳細分析]

[改善案を作成]

[コードレビュー]

[QA実行]

[リスク確認]

[リリース準備]
```

クリックすると最適Promptが生成される。

---

# Approval UI

## Approval Level

4段階。

---

## Level 0

完全自動。

対象

- Summary
- Tag生成
- 整理

---

## Level 1

通知のみ。

対象

- Task完了
- Artifact生成

---

## Level 2

確認後実行。

対象

- コード変更
- 外部API利用

---

## Level 3

必須承認。

対象

- Release
- 契約
- Legal
- 公開操作

---

# Artifact UI

表示

```
Artifact

Version

Created By

AI Agent

Diff

Approval Status
```

---

# Diff View

対応

Markdown Diff

Code Diff

Prompt Diff

---

# Notification UX

通知は単なる一覧ではなく、

Action Centerとして設計する。

---

# Action Center

表示

```
あなたが確認すべき3件

1. Design Approval

2. QA Issue

3. Release Decision
```

---

# Memory UI

表示

- Stored Knowledge
- Usage Count
- Related Project

---

# Skill UI

表示

- Skill Name
- Version
- Used Agent
- Update History

---

# Cost Dashboard

表示

- 今日の利用料金
- Model別
- Agent別
- Project別

---

# Empty State

何もない場合でも、

次に何をすればいいか提示する。

例

```
新しいProjectを開始しますか？

[LP制作を開始]
[アプリ開発を開始]
```

---

# Error UX

エラー表示

悪い例:

```
Error 500
```

良い例:

```
Frontend AIが停止しました。

原因:
API Rate Limit

対応:
5分後に自動再実行します。
```

---

# Visual Style

方向性

- Professional
- Clean
- Developer Tool
- Minimal

参考

Linear

Cursor

VS Code

---

# Keyboard First

対応

- Command Palette
- Shortcut
- Quick Action

マウス操作を減らす。

---

# Future Extension

Phase2

- Voice Command
- Mobile App
- Multi Agent Visualization
- AI Activity Replay
- Workflow Canvas
- Custom Dashboard

---

# Success Criteria

ユーザーはAI Workforce OSを開くだけで、

「AIチームが今何をしていて、自分が何を判断すべきか」

を即座に理解できる。

操作量を減らし、
意思決定に集中できるUIを実現する。
