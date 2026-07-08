---
Document: AI AGENT DEVELOPMENT RULES
File: .cursor/rules/02_ai_agent_rules.md
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

# AI Agent Development Rules

## Role

あなたはAI Workforce OSのAI Agent Architectureを理解したSenior AI Engineerとして動作する。

AI Agentは単なるLLM呼び出しではない。

以下を備えた業務実行単位として設計する。

- Role
- Goal
- Skill
- Memory
- Tool
- Validation
- Approval
- Output

---

# Core Principle

Agentは「考える存在」ではなく、

```
Taskを受け取る

↓

必要情報を取得する

↓

判断する

↓

実行する

↓

結果を検証する

↓

成果物を返す
```

という業務Unitである。

---

# Agent Architecture

Agentは必ず以下構造を持つ。

```
Agent

├── Config

├── Prompt

├── Skills

├── Memory Policy

├── Tools

├── Validator

├── Executor

└── Output Schema
```

---

# Agent Responsibility

1 Agent 1 Responsibility。

例:

良い:

```
Frontend Agent

React実装担当
```

悪い:

```
Frontend Agent

React
営業
契約
QA
全部担当
```

---

# Agent Communication

Agent同士は直接通信しない。

禁止:

```
Frontend Agent

↓

QA Agent
```

---

正しい:

```
Agent

↓

Workflow Engine

↓

Next Agent
```

---

# Workflow Control

Agent実行順序はWorkflow Engineが管理する。

Agent自身が勝手に次Agentを呼ばない。

---

# Secretary AI Rules

Secretary AIは最重要Agent。

役割:

- User Interface
- Task整理
- Workflow開始
- 状況説明
- Approval取得
- Agent調整

---

# Secretary AIは禁止

禁止:

- 直接コード変更
- 直接Database変更
- 勝手なRelease
- 勝手な外部操作

---

# Agent Execution Flow

必ず:

```
Receive Task

↓

Analyze Requirement

↓

Retrieve Memory

↓

Load Skills

↓

Generate Prompt

↓

LLM Execution

↓

Validate

↓

Create Artifact

↓

Report Result
```

---

# Memory Rules

Agentは必要なMemoryのみ取得する。

禁止:

全Memory取得

---

取得順（Phase 1）:

```
Short Term Memory
↓
Project Memory
```

取得順（将来拡張）:

```
Short Term Memory
↓
Project Memory
↓
Client Memory
↓
Global Memory
```

---

# Skill Rules

AgentはSkillを利用する。

例:

Frontend Agent

必要:

```
React Skill

Next.js Skill

TypeScript Skill
```

不要:

```
Legal Skill
```

---

# Prompt Rules

AgentはPromptを直接作成しない。

必ず:

```
Agent

↓

Prompt Engine

↓

LLM
```

---

# Model Selection

AgentはModelを固定しない。

必ず:

```
Agent

↓

LLM Router

↓

Model
```

---

# Cost Optimization

Agent実行時:

優先:

1. Cache利用

2. Context削減

3. Low Cost Model

4. Retry

5. High Model昇格

---

# Tool Usage

Agentが利用するToolは明示する。

例:

Frontend Agent:

```
Code Search

File Edit

Test Runner
```

---

# Output Rules

Agent結果は構造化する。

形式:

```json
{
  "summary": "",
  "status": "",
  "artifact": "",
  "issues": []
}
```

---

# Artifact Creation

成果物作成時:

必ず保存する。

保存:

- Name
- Version
- Creator Agent
- Timestamp
- Related Task

---

# Validation Rules

Agent完了前にValidationする。

例:

Frontend Agent:

- Type Check
- Lint
- Build

QA Agent:

- Test
- Bug Check

---

# Self Review

重要Agentは自己レビューする。

Flow:

```
Generate

↓

Review

↓

Improve

↓

Final Output
```

---

# Retry Rules

失敗時:

1. 原因分析

2. Prompt改善

3. 再実行

4. Model変更

5. Human確認

---

# Approval Rules

Agentは権限レベルを持つ。

Level 0

自動実行可能

---

Level 1

通知

---

Level 2

承認後実行

---

Level 3

必須承認

---

# High Risk Actions

必ずApproval。

対象:

- Production Release
- Database Migration
- External Publish
- Contract Creation
- Security変更

---

# Agent Logging

必ず記録。

- Agent Name
- Task ID
- Model
- Prompt Version
- Token Usage
- Cost
- Result
- Error

---

# Adding New Agent

新Agent追加時:

必要:

```
Agent Config

↓

Prompt

↓

Skill

↓

Validator

↓

Test
```

---

# Forbidden

禁止:

- Agent直接DB操作
- Agent直接UI操作
- Agent間直接通信
- Memory全取得
- Prompt直接生成
- 勝手なWorkflow変更

---

# Agent Quality Checklist

完成条件:

□ Role明確

□ Skill定義済

□ Memory Policyあり

□ Output Schemaあり

□ Validationあり

□ Loggingあり

□ Approval Level設定済

---

# Objective

AI Workforce OSのAgentは、

人間のチームメンバーのように専門性を持ちながら、

安全・透明・低コストで協調する。

すべてのAgentはこのルールに従って実装する。
