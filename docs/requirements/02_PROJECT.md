---
Document: REQUIREMENT - PROJECT
File: docs/requirements/02_PROJECT.md
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

# Project

## Purpose

Projectは仕事を管理する最上位単位である。

すべてのWorkflow・Task・Artifact・AI Agentは必ず1つのProjectに所属する。

ユーザーはProjectを開くだけで、その案件の現在地・進捗・成果物・AIの稼働状況を把握できる。

---

# Primary Goals

Projectは以下を実現する。

- 案件を一元管理する
- AIが案件全体を理解できる
- Workflowを整理する
- 成果物を集約する
- クライアント情報を保持する
- 履歴を残す

---

# Project Lifecycle

Projectは以下の状態を持つ。

Draft

↓

Planning

↓

In Progress

↓

Review

↓

Completed

↓

Archived

状態はWorkflowに応じて自動更新される。

重要な状態変更はユーザー承認を必要とする。

---

# Layout

画面構成

Header

↓

Overview

↓

Workflow Timeline

↓

Tasks

↓

Artifacts

↓

AI Activity

↓

Project Information

↓

History

---

# Header

表示項目

- Project Name
- Status
- Progress
- Client
- Deadline
- Priority

操作

- Edit
- Archive
- Delete
- Open Workflow

---

# Overview

表示内容

- 現在の進捗
- 次に実施する作業
- AI秘書からの提案
- リスク
- 納期までの日数

OverviewはProject全体の要約を表示する。

---

# Workflow Timeline

Workflowを時系列で表示する。

例

Sales

↓

Requirement

↓

Design

↓

Frontend

↓

Backend

↓

QA

↓

Release

現在位置を強調表示する。

---

# Tasks

Task一覧。

表示項目

- Title
- Agent
- Status
- Priority
- Deadline
- Assignee
- Updated At

操作

- Open
- Complete
- Reassign
- Duplicate

---

# Artifacts

Projectに紐づく成果物一覧。

例

- 要件定義
- Figma
- ソースコード
- API仕様
- DB設計
- QAレポート
- リリースノート

操作

- Open
- Download
- Version History
- Compare

---

# AI Activity

AI Agentの活動履歴。

表示

- Agent
- Action
- Started At
- Finished At
- Result

例

Secretary assigned Frontend Engineer

QA completed review

Legal approved contract

---

# Project Information

表示

Project Name

Description

Client

Tags

Priority

Created At

Updated At

Deadline

Repository

Environment

Version

---

# History

Projectの履歴。

例

Project Created

Requirement Updated

Frontend Completed

QA Started

Release Approved

すべて時系列で記録する。

---

# Search

検索対象

Task

Artifact

Workflow

History

Agent

---

# Filters

以下で絞り込み可能。

Status

Priority

Agent

Artifact Type

Date

---

# User Actions

ユーザーが実行可能。

- Project作成
- 編集
- Archive
- Delete
- Workflow開始
- Workflow停止
- Task追加
- AIへ依頼
- 承認

---

# AI Actions

AI秘書が実行。

- Workflow生成
- Task分割
- Priority提案
- Deadline警告
- Agent割り当て
- リスク分析
- Progress更新

---

# Validation

必須項目

Project Name

Status

Priority

Client（任意）

Workflow

Project Nameは重複可能。

Project IDは一意とする。

---

# Dashboard Integration

DashboardのProjectsカードと同期する。

Project更新時はDashboardへ反映する。

---

# Workflow Integration

Projectは複数Workflowを保持できる。

Phase1では1つを標準とする。

将来複数Workflowへ対応する。

---

# Artifact Integration

Artifactは必ずProjectへ紐付ける。

Projectに属さないArtifactは存在しない。

---

# Notification Integration

以下で通知する。

Project Created

Status Changed

Deadline Warning

Completed

Archived

---

# AI Summary

AI秘書はProjectを常に要約する。

表示内容

- 現在の状態
- 問題点
- 次にやること
- リスク
- 推奨アクション

この要約はDashboardでも利用する。

---

# Security

Project削除は論理削除とする。

完全削除は将来対応。

削除時は必ず承認ダイアログを表示する。

---

# Future Extension

Phase2以降

- 複数Workflow
- GitHub連携
- Figma同期
- Slack通知
- Vercel連携
- Claude Code連携
- Cursor連携
- 顧客ごとのダッシュボード
- AIによる進捗予測
- コスト予測
- 工数予測

Phase1では実装しない。

---

# Success Criteria

Project画面だけで案件全体を理解できる。

Workflow・Task・Artifact・AI Activityが一元管理されている。

AI秘書がProjectの現状を正確に要約し、次に実施すべき内容を提案できる。
