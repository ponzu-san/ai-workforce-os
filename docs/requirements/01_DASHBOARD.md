---
Document: REQUIREMENT - DASHBOARD
File: docs/requirements/01_DASHBOARD.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS (Temporary)

App Version: v0.1.0

Created: 2026-07-08
Last Updated: 2026-07-08
---

# Dashboard

## Purpose

DashboardはAI Workforce OSのホーム画面である。

ユーザーがアプリを開いた瞬間に、

- 現在の状況
- 今日やること
- AIからの提案
- 承認待ち
- 進行中の案件

を5秒以内に把握できることを目的とする。

Dashboardはすべての仕事の起点となる。

---

# Primary Goals

Dashboardは以下を実現する。

- 今日やるべき仕事が分かる
- AI秘書からの提案が確認できる
- 進行中案件が分かる
- 承認待ちが分かる
- AIの状態が分かる
- 最近の成果物へすぐアクセスできる

---

# Layout

画面は以下のレイアウトとする。

Top Header

↓

Left Sidebar

↓

Main Dashboard

↓

Right AI Panel

---

# Header

表示項目

- Logo
- Workspace Name
- Search
- Notification
- User Menu

---

# Left Sidebar

表示項目

Dashboard

Projects

Workflow

Tasks

Artifacts

AI Agents

Approvals

Settings

---

# Main Area

Main Areaはカード形式で構成する。

表示順は固定。

---

## Card 01

Today

表示内容

- 今日やること
- 優先順位
- 締切
- AI推奨タスク

操作

クリックでTaskを開く。

---

## Card 02

Secretary

AI秘書からの提案。

例

- 次にレビューしてください
- この案件は進行できます
- QA待ちです
- 要件が不足しています

操作

クリックでWorkflowを開く。

---

## Card 03

Projects

進行中案件一覧。

表示

- Project名
- Status
- Progress
- Deadline

操作

クリックでProject画面。

---

## Card 04

Workflow

現在動いているWorkflow。

表示

- Current Agent
- Current Task
- Next Agent

操作

クリックでWorkflow画面。

---

## Card 05

Approvals

承認待ち一覧。

例

- 要件承認
- デザイン承認
- リリース承認

操作

Approve

Reject

Open

---

## Card 06

AI Agents

現在稼働中Agent。

表示

- Agent Name
- Status
- Current Task
- Model

Status

Idle

Working

Waiting

Error

Offline

---

## Card 07

Artifacts

最近作成された成果物。

例

- Requirement
- Design
- Code
- QA Report

操作

クリックで開く。

---

## Card 08

Notifications

通知一覧。

例

- Agent Finished
- Review Required
- Error
- Release Complete

---

## Card 09

Activity

時系列ログ。

例

09:10

Secretary assigned Frontend Agent

09:15

Frontend completed

09:16

QA started

---

# Right Panel

AI秘書専用エリア。

表示

Current Recommendation

Current Workflow

Risk

Suggestions

Pending Approval

---

# Search

検索対象

Project

Workflow

Task

Artifact

Agent

Client

Prompt

Skill

---

# Refresh

Dashboardは自動更新する。

初期値

30秒

将来変更可能。

---

# Empty State

データが存在しない場合。

例

"最初のProjectを作成してください"

Create Projectボタンを表示。

---

# Loading

Skeleton UIを使用する。

レイアウトは変化させない。

---

# Error

エラー時。

再読み込みボタンを表示。

詳細は折りたたむ。

---

# User Actions

ユーザーが実行可能。

- Projectを開く
- Taskを開く
- 承認
- 却下
- AIへ依頼
- 通知確認
- 検索

---

# AI Actions

AI秘書が実行。

- 次タスク提案
- Workflow分析
- リスク通知
- Priority変更提案
- Deadline警告
- 承認依頼

---

# Dashboard Rules

Dashboardでは編集しない。

Dashboardは状況確認専用。

編集は各画面で行う。

---

# Success Criteria

Dashboardだけ見れば、

現在の状況を理解できる。

次に何をするか迷わない。

AI秘書の提案だけ見れば仕事を進められる。

---

# Future Extension

将来的に追加予定。

- Token Usage
- Cost Analysis
- Calendar
- GitHub Activity
- Figma Updates
- Vercel Deploy
- Claude Code Status
- Cursor Status
- Team Members
- Marketplace Widgets

Phase1では実装しない。
