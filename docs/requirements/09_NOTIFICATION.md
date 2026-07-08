---
Document: REQUIREMENT - NOTIFICATION
File: docs/requirements/09_NOTIFICATION.md
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

# Notification

## Purpose

NotificationはAI Workforce OSにおける通知管理機能である。

AIがユーザーへ伝えるべき情報を整理し、
必要なタイミングで、
必要な内容だけを通知する。

通知は仕事を中断させるものではなく、
仕事を円滑に進めるためのサポート機能とする。

---

# Primary Goals

Notificationは以下を実現する。

- 必要な情報を即座に伝える
- 承認漏れを防ぐ
- 納期遅延を防ぐ
- AI Agentの状態を共有する
- エラーを素早く知らせる
- Dashboardとの連携

---

# Design Principles

Notificationは以下の原則に従う。

- 必要最小限
- 優先順位を持つ
- 重複通知しない
- AIが要約する
- 通知から直接行動できる

---

# Notification Types

通知は以下の種類を持つ。

Information

Success

Warning

Error

Approval

Reminder

Recommendation

System

---

# Priority

通知優先度

Critical

High

Medium

Low

Criticalは常に画面上部へ表示する。

---

# Notification Sources

通知元

AI Secretary

Workflow

Task

Project

Approval

Artifact

Agent

Router

System

---

# Notification Structure

通知は以下を保持する。

- Notification ID
- Title
- Summary
- Type
- Priority
- Source
- Project
- Workflow
- Task
- Created At
- Read At
- Status

---

# Status

通知状態

Unread

Read

Archived

Dismissed

---

# Dashboard Integration

Dashboardへ表示する。

最新通知

未読件数

重要通知

AIからの提案

承認待ち

---

# Notification Center

通知一覧画面を提供する。

表示項目

Title

Summary

Priority

Source

Time

Status

Action

---

# Notification Detail

表示内容

Title

Summary

Reason

Related Project

Related Workflow

Related Task

Related Artifact

Recommended Action

History

---

# Recommended Action

通知には必ず推奨アクションを表示する。

例

「承認してください」

「レビューしてください」

「Taskを開始してください」

「Deadlineを変更してください」

ユーザーが迷わないことを目的とする。

---

# User Actions

ユーザーは以下を実行できる。

Open

Mark as Read

Archive

Delete（論理削除）

Snooze

Approve

Reject

Open Related Item

---

# AI Responsibilities

AI Secretaryは通知を生成する。

通知には必ず

- 要約
- 理由
- 優先度
- 推奨アクション

を含める。

---

# Trigger Events

以下で通知を生成する。

Project Created

Workflow Started

Workflow Completed

Task Assigned

Task Completed

Approval Requested

Approval Completed

Artifact Created

Risk Detected

Deadline Warning

Agent Error

Deployment Completed

System Error

---

# Reminder

Reminder通知

Deadline前

24時間

12時間

3時間

1時間

Reminder回数は設定可能。

---

# Risk Notifications

以下はWarning以上とする。

Workflow Blocked

Agent Error

Missing Artifact

Deadline Risk

LLM Error

API Error

Review Missing

---

# Search

検索対象

Title

Summary

Project

Workflow

Task

Type

Priority

Date

---

# Filters

絞り込み

Unread

Priority

Type

Project

Workflow

Date

---

# Security

システム通知は削除できない。

ユーザー通知のみArchive可能。

履歴は保持する。

---

# Future Extension

Phase2

Slack通知

Teams通知

Discord通知

LINE通知

メール通知

プッシュ通知

スマホ通知

Webhook通知

---

# Success Criteria

ユーザーはNotificationを見るだけで

- 今何が起きたのか
- なぜ通知されたのか
- 何をすればよいのか

を数秒で理解できる。

通知は情報ではなく、
次の行動へつながるガイドとして機能する。
