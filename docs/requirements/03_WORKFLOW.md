---
Document: REQUIREMENT - WORKFLOW
File: docs/requirements/03_WORKFLOW.md
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

# Workflow

## Purpose

WorkflowはProject内で仕事を進めるための実行フローである。

AI Workforce OSはチャットを中心に動作するのではなく、Workflowを中心に動作する。

すべてのAI AgentはWorkflowに従って仕事を行う。

---

# Primary Goals

Workflowは以下を実現する。

- AI同士が順番に仕事を進める
- 成果物を受け渡す
- 人が必要な場所だけ承認する
- 全体の進捗を可視化する
- 履歴を保存する

---

# Workflow Structure

Workflowは以下の要素で構成する。

Project

↓

Workflow

↓

Stage

↓

Task

↓

Artifact

↓

Approval

↓

Next Stage

---

# Workflow Lifecycle

Workflowは以下の状態を持つ。

Draft

↓

Ready

↓

Running

↓

Waiting Approval

↓

Paused

↓

Completed

↓

Cancelled

Workflowの状態はAI秘書が管理する。

---

# Stage

Workflowは複数のStageで構成される。

標準Stage

Requirement

↓

Design

↓

Development

↓

Review

↓

QA

↓

Release

各Stageは変更可能とする。

---

# Task Flow

各Stageは1つ以上のTaskを持つ。

Taskが完了すると、

AI秘書が次Taskを生成する。

必要に応じて複数Taskへ分割できる。

---

# Artifact Flow

Task完了時には必ずArtifactを作成する。

例

Requirement

↓

Requirement.md

Design

↓

Figma URL

Development

↓

Source Code

QA

↓

QA Report

Release

↓

Release Note

Artifactが存在しないTaskは完了できない。

---

# Approval Flow

承認が必要なStageではWorkflowを停止する。

AI秘書はユーザーへ通知する。

ユーザーが承認後、

次Stageへ進む。

---

# AI Execution

AI Agentは以下を実行する。

Task取得

↓

Artifact生成

↓

自己レビュー

↓

成果物提出

↓

AI秘書へ通知

↓

次Agentへ引き継ぎ

---

# Human Execution

ユーザーが担当する。

- 承認
- 修正指示
- 優先順位変更
- Workflow停止
- Workflow再開

---

# Workflow View

Workflow画面では以下を表示する。

Workflow Name

Status

Current Stage

Current Agent

Progress

Remaining Tasks

Deadline

Risk

---

# Timeline

時系列で表示する。

例

09:00

Sales Started

↓

09:10

Requirement Completed

↓

09:30

Design Started

↓

10:00

Development Started

↓

11:20

QA Started

Timelineは折りたたみ可能。

---

# Stage Detail

各Stageには以下を表示する。

Stage Name

Assigned Agent

Status

Started At

Finished At

Duration

Artifacts

Review

Approval

---

# Progress

ProgressはAI秘書が自動計算する。

表示

0〜100%

ProgressはTask数ではなく、

Workflow全体の重みに応じて算出する。

---

# Risk Analysis

AI秘書はWorkflowを分析する。

例

Deadline Risk

Blocked

Waiting Approval

Large Task

Missing Artifact

Riskが存在する場合はDashboardへ通知する。

---

# Dependency

Task同士の依存関係を保持する。

Task Bは

Task A完了後のみ開始できる。

依存関係をGUIで表示する。

---

# Automation

AI秘書は自動で以下を実行する。

Task生成

Agent割り当て

Status更新

通知送信

Progress更新

履歴保存

---

# User Actions

ユーザーが可能。

Workflow作成

Workflow開始

Workflow停止

Workflow再開

Task追加

Task削除

Priority変更

Deadline変更

承認

差し戻し

---

# AI Actions

AI秘書が可能。

Task生成

Workflow分析

Agent選択

Task再配置

Risk通知

Next Task生成

Summary生成

---

# Validation

Workflowには最低1つのStageが必要。

Stageには最低1つのTaskが必要。

Taskには担当Agentが必要。

Artifactが存在しないTaskはCompletedへ変更できない。

---

# Dashboard Integration

DashboardのWorkflowカードへ表示する。

Current Stage

Current Agent

Progress

Risk

---

# Project Integration

Workflowは必ず1つのProjectへ所属する。

Project削除時はWorkflowも論理削除する。

---

# Notification Integration

以下で通知する。

Workflow Started

Workflow Paused

Approval Required

Workflow Completed

Workflow Failed

Deadline Warning

---

# Future Extension

Phase2以降

- Workflowテンプレート
- Workflow複製
- 条件分岐
- 並列Workflow
- AI自動最適化
- 外部サービス連携
- ノードエディタによるWorkflow作成

Phase1では実装しない。

---

# Success Criteria

Workflow画面だけで、

現在どのAIが何をしているか、

次に誰が何をするか、

どこで止まっているか、

何を承認すれば良いかを把握できる。

ユーザーはWorkflowを監督するだけで仕事が進行する。
