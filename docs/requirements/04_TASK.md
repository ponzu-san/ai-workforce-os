---
Document: REQUIREMENT - TASK
File: docs/requirements/04_TASK.md
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

# Task

## Purpose

TaskはAI Workforce OSにおける最小実行単位である。

AI AgentはTaskを受け取り、成果物（Artifact）を作成し、次のTaskへ引き継ぐ。

すべてのTaskはWorkflowに属し、Workflowを構成する。

---

# Primary Goals

Taskは以下を実現する。

- AIへ仕事を依頼する
- 進捗を管理する
- 成果物を管理する
- レビューを管理する
- 承認を管理する
- 履歴を保存する

---

# Task Lifecycle

Taskは以下の状態を持つ。

Draft

↓

Ready

↓

Assigned

↓

Working

↓

Self Review

↓

Waiting Approval

↓

Completed

↓

Archived

必要に応じて

Blocked

Cancelled

へ変更できる。

---

# Task Structure

Taskは以下を保持する。

- Task ID
- Title
- Description
- Objective
- Workflow
- Stage
- Project
- Assigned Agent
- Priority
- Deadline
- Estimated Time
- Actual Time
- Status

---

# Required Information

Task作成時に最低限必要な情報。

- Title
- Objective
- Assigned Agent
- Workflow
- Stage

それ以外はAI秘書が補完する。

---

# Description

Taskには実施内容を記載する。

DescriptionはAIが理解しやすい文章で保存する。

Markdownを使用する。

---

# Objective

Taskには必ず目的を持たせる。

例

「LPを実装する」

ではなく

「FigmaデザインをNext.jsへ実装し、レスポンシブ対応まで完了する」

のように成果基準まで記載する。

---

# Acceptance Criteria

Taskには完了条件を定義する。

例

- TypeScriptエラーがない
- ESLintエラーがない
- デザインとの差異がない
- モバイル対応済み
- レビュー完了

Acceptance Criteriaを満たさないTaskはCompletedにならない。

---

# Assigned Agent

Taskには必ず担当Agentを設定する。

例

Secretary

Sales

Project Manager

Designer

Frontend Engineer

Backend Engineer

QA

Legal

Marketing

---

# Priority

以下を採用する。

Critical

High

Medium

Low

AI秘書はPriority変更を提案できる。

最終決定はユーザーが行う。

---

# Deadline

TaskにはDeadlineを設定できる。

Deadlineが近付くとAI秘書が通知する。

---

# Time Tracking

記録する。

Estimated Time

Actual Time

Started At

Finished At

Duration

将来AIによる見積精度向上へ利用する。

---

# Task Detail Screen

表示項目

Task Title

Status

Assigned Agent

Description

Objective

Acceptance Criteria

Artifact

Comments

History

Review

Approval

Related Tasks

---

# Comments

Taskごとにコメントを保持する。

コメントは

User

AI

両方が投稿できる。

---

# Attachments

添付可能。

- Markdown
- PDF
- PNG
- JPG
- Figma URL
- GitHub URL
- ZIP

---

# Related Tasks

関連Taskを保持する。

例

Design

↓

Frontend

↓

QA

依存関係を可視化する。

---

# Review

Task完了後、

AIは自己レビューを実施する。

自己レビュー完了後のみ承認依頼できる。

---

# Approval

承認が必要なTaskは

Waiting Approval

へ移動する。

承認後Completedになる。

差し戻し時はWorkingへ戻る。

---

# Artifact Integration

Task完了時には最低1つのArtifactを登録する。

Artifactが存在しないTaskはCompletedになれない。

---

# Workflow Integration

WorkflowはTask順に進行する。

Task完了後、

AI秘書が次Taskを開始する。

---

# Dashboard Integration

Todayカードへ表示する。

Priorityが高いTaskを優先表示する。

---

# AI Actions

AI秘書は以下を実行する。

- Task生成
- Task分割
- Task統合
- Priority提案
- Deadline調整提案
- Agent変更提案
- Summary生成
- 次Task開始

---

# User Actions

ユーザーは以下を実行できる。

- 作成
- 編集
- 完了
- 承認
- 差し戻し
- 削除
- 担当変更
- 優先順位変更
- 期限変更

---

# Notifications

通知対象

Task Assigned

Task Started

Task Waiting Approval

Task Completed

Task Overdue

Task Blocked

---

# Search

検索対象

Title

Description

Agent

Status

Workflow

Project

Artifact

---

# Filters

以下で絞り込み可能。

Status

Priority

Agent

Deadline

Project

Workflow

Stage

---

# Validation

Taskには必ず

- Project
- Workflow
- Stage
- Assigned Agent

が必要。

Objectiveが未設定の場合は保存できない。

Acceptance Criteriaが空の場合はCompletedにできない。

---

# Future Extension

Phase2以降

- AIによるTask自動生成
- AI工数予測
- AI難易度分析
- テンプレートTask
- 繰り返しTask
- 音声入力
- カレンダー同期
- GitHub Issue同期
- Linear同期

Phase1では実装しない。

---

# Success Criteria

Task画面だけで

何を作るか

誰が担当か

何をもって完了とするか

どの成果物が必要か

次に何が始まるか

が明確に分かること。

TaskはAI・ユーザー双方にとって迷いなく実行できる最小単位である。
