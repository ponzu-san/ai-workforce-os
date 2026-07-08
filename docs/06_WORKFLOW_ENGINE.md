---
Document: WORKFLOW ENGINE ARCHITECTURE
File: docs/06_WORKFLOW_ENGINE.md
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

# Workflow Engine

## Purpose

Workflow EngineはAI Workforce OS全体を動かす実行エンジンである。

Workflowを解析し、
現在の状態を管理し、
Taskを順番に実行し、
AI Secretaryへ状態を通知する。

Workflow Engineはビジネスロジックを持たず、
Workflowの状態管理だけを担当する。

---

# Design Principles

Workflow Engineは以下を原則とする。

- Event Driven
- Stateless
- Deterministic
- Restart Safe
- Artifact Driven
- Approval Driven

---

# Responsibilities

Workflow Engineは以下を担当する。

- Workflow開始
- Workflow停止
- Workflow再開
- Task開始
- Task終了
- Stage変更
- Event発行
- 状態保存
- Progress更新

---

# Workflow Structure

```
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
```

Workflow Engineはこの構造のみを管理する。

---

# Workflow State

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

↓

Archived

---

# Stage State

Stageは以下の状態を持つ。

Pending

↓

Running

↓

Completed

↓

Skipped

↓

Failed

---

# Task State

Taskは以下の状態を持つ。

Ready

↓

Assigned

↓

Working

↓

Review

↓

Waiting Approval

↓

Completed

↓

Blocked

↓

Failed

---

# Event Flow

Workflowはイベントによって進行する。

例

Workflow Started

↓

Task Assigned

↓

Task Started

↓

Artifact Generated

↓

Self Review Passed

↓

Approval Requested

↓

Approval Granted

↓

Task Completed

↓

Stage Completed

↓

Workflow Completed

---

# Event Bus

すべての状態変更はEvent Busを経由する。

Workflow Engineは直接状態を書き換えない。

例

```
TaskCompleted

↓

Event Bus

↓

Workflow Engine

↓

StageCompleted

↓

Event Bus

↓

Dashboard
```

---

# Event Types

Workflow Events

Task Events

Stage Events

Approval Events

Artifact Events

Agent Events

Notification Events

System Events

---

# Event Payload

すべてのイベントは以下を持つ。

- Event ID
- Event Type
- Timestamp
- Project ID
- Workflow ID
- Stage ID
- Task ID
- Agent ID
- Payload

---

# Task Scheduler

Task Schedulerは実行可能なTaskを判定する。

判定条件

- Dependency完了
- Approval不要
- Agent利用可能
- Workflow状態がRunning

条件を満たしたTaskのみ開始する。

---

# Dependency Engine

Task同士の依存関係を管理する。

例

Task A

↓

Task B

↓

Task C

Task Aが未完了の場合、

Task Bは開始できない。

---

# Parallel Execution

依存関係がないTaskは並列実行する。

例

Frontend

Backend

Marketing

Legal

QA

Workflow Engineが同時実行を管理する。

---

# Approval Integration

Approvalが必要なTaskは停止する。

```
Task

↓

Waiting Approval

↓

User Approval

↓

Continue
```

Workflow全体は停止せず、
対象Taskのみ停止する。

---

# Retry Strategy

Task失敗時

Retry 1

↓

Retry 2

↓

Retry 3

↓

Fallback Model

↓

Secretary通知

↓

Human Decision

---

# Timeout

TaskごとにTimeoutを持つ。

Default

60秒

Timeout後

Retry

または

Failed

---

# Progress Calculation

ProgressはTask数ではなく重みで計算する。

例

Requirement

10%

Design

15%

Development

45%

QA

20%

Release

10%

---

# Persistence

Workflow状態は永続化する。

保存内容

Workflow

Stage

Task

Artifact

Approval

History

Event

---

# Recovery

アプリ再起動時

Workflow Engineは状態を復元する。

Running中だったTaskは

再評価して再開する。

---

# Logging

記録する。

Workflow開始

Task開始

Task終了

Approval

Retry

Failure

Resume

Completion

---

# Metrics

収集する。

Workflow Time

Stage Time

Task Time

Retry Count

Failure Count

Approval Count

LLM Cost

Token Usage

---

# Error Handling

分類

Validation Error

Workflow Error

Agent Error

LLM Error

Infrastructure Error

Unexpected Error

重大エラーはAI Secretaryへ通知する。

---

# Security

Workflow Engineは禁止する。

- Task直接変更
- Approvalスキップ
- Artifact削除
- 強制Completed

必ずEvent経由で変更する。

---

# Future Extension

Phase2

- Workflowテンプレート
- BPMN対応
- ノードベースWorkflow
- 条件分岐
- AI自動Workflow生成
- Workflow最適化AI
- 外部Workflow連携

---

# Success Criteria

Workflow Engineは

Workflowを正確に実行し、

途中停止・再開・障害復旧・並列処理・承認待ちを安全に管理できる。

すべての状態変更はEventとして記録され、

完全に再現可能なWorkflowを実現する。
