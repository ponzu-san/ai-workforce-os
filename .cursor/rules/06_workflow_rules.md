---
Document: WORKFLOW ENGINE RULES
File: .cursor/rules/06_workflow_rules.md
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

# Workflow Engine Rules

## Role

あなたはAI Workforce OSのWorkflow Architectとして動作する。

Workflow Engineは、

「人間の仕事の流れをAIチームへ割り当てる実行基盤」

である。

Agent単体ではなく、
複数Agent・Human Approval・成果物管理を統合する。

---

# Core Principle

Workflowは以下を管理する。

```
What

↓

Who

↓

When

↓

How

↓

Result
```

---

# Workflow Responsibility

Workflow Engineの責務:

- Task分解
- Agent割当
- 実行順序管理
- 状態管理
- Approval管理
- Error Recovery
- Logging

---

# Workflow Architecture

構造:

```
Workflow

├── Stage

│    └── Task

│          └── Agent Execution

↓

Artifact

↓

Approval
```

---

# Workflow Lifecycle

Status:

```
draft

↓

planning

↓

running

↓

waiting_approval

↓

completed

↓

failed

↓

cancelled
```

---

# Stage Rules

Stageは工程単位。

例:

```
Requirement

↓

Design

↓

Development

↓

QA

↓

Release
```

---

# Task Rules

Taskは実行単位。

例:

Stage:

Development

Task:

```
Create Header Component
```

---

# Agent Assignment

Taskには担当Agentを設定する。

例:

```
Frontend Task

↓

Frontend Agent
```

---

# Agent Selection

Workflow Engineが判断する。

考慮:

- Skill
- Availability
- Cost
- Previous Result

---

# Agent Communication

Agent間の直接通信は禁止。

必ず:

```
Agent

↓

Workflow Engine

↓

Next Agent
```

---

# Execution Flow

標準:

```
Create Workflow

↓

Generate Tasks

↓

Assign Agent

↓

Execute

↓

Validate

↓

Create Artifact

↓

Approval

↓

Next Stage
```

---

# Automatic Execution

自動化可能:

Level 0

対象:

- Data整理
- Summary
- Formatting
- Classification

---

# Human Approval Required

Level 2以上:

対象:

- Code変更
- Design確定
- External Communication

---

Level 3:

必須:

- Release
- Contract
- Payment
- Public Publish

---

# Approval Flow

```
Agent Result

↓

Approval Request

↓

Human Review

↓

Approve / Reject

↓

Continue
```

---

# Approval Data

保存:

```
approver

status

comment

timestamp

related_task
```

---

# Retry Rules

失敗時:

```
Error Detection

↓

Analyze

↓

Retry

↓

Alternative Strategy

↓

Human Escalation
```

---

# Retry Limit

Default:

3回

超過時:

Human確認。

---

# Error Recovery

エラー種類:

## Temporary Error

例:

API Timeout

対応:

Retry

---

## Logic Error

例:

Validation Failed

対応:

Prompt改善

---

## Critical Error

例:

Data破損

対応:

停止 + Human確認

---

# Workflow Pause

可能。

理由:

- Approval待ち
- External依存
- Investigation

---

# Workflow Resume

再開時:

保存済みContextを利用する。

最初から実行しない。

---

# Context Management

Workflowでは必要なContextだけ渡す。

禁止:

全Project情報送信。

---

# Artifact Management

各Stage結果はArtifactとして保存。

保存:

- Version
- Creator
- Related Task
- Timestamp

---

# Workflow Template

再利用可能にする。

例:

```
LP制作 Workflow

Web Application Workflow

Bug Fix Workflow

Content Creation Workflow
```

---

# Workflow Event

重要イベント:

```
workflow.started

task.created

agent.started

artifact.created

approval.requested

workflow.completed
```

---

# Logging

記録:

- Workflow ID
- Task ID
- Agent
- Model
- Duration
- Cost
- Result

---

# Cost Control

Workflow開始前:

推定Costを表示する。

例:

```
Estimated Cost

$0.25
```

---

# Token Optimization

Workflow単位で:

- Context Cache
- Memory Retrieval
- Model Routing

を利用する。

---

# Workflow Security

禁止:

Agentによる勝手なWorkflow変更。

---

変更:

Human Approval必須。

---

# Workflow UI Requirements

表示:

- Current Stage
- Progress
- Running Agent
- Waiting Approval
- Next Action

---

# Future Extension

Phase2:

- Visual Workflow Builder
- Drag & Drop Flow
- Parallel Agent Execution
- Autonomous Workflow Optimization

---

# Success Criteria

Workflow Engineは、

人間が管理者として判断し、

AI Agentが実行者として動く、

安全で拡張可能な仕事管理基盤になる。
