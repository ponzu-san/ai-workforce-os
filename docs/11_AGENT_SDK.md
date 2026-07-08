---
Document: AGENT SDK ARCHITECTURE
File: docs/11_AGENT_SDK.md
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

# Agent SDK

## Purpose

Agent SDKは、AI Workforce OSに新しいAI Agentを容易に追加するための共通実行基盤である。

すべてのAI Agentは同じSDKを利用し、
実装方法・ログ・エラー処理・Prompt生成・Memory取得・Artifact保存を共通化する。

これにより、新しいAgentを追加しても既存コードへ影響を与えない構造を実現する。

---

# Design Principles

Agent SDKは以下を原則とする。

- Convention over Configuration
- Single Responsibility
- Reusable
- Extensible
- Testable
- Stateless
- Event Driven

---

# Responsibilities

Agent SDKは以下を担当する。

- Task取得
- Context生成
- Memory取得
- Skill取得
- Prompt生成
- LLM実行
- Response解析
- Validation
- Self Review
- Artifact保存
- Event発行
- Logging
- Metrics収集

---

# Execution Pipeline

```
Secretary

↓

Agent SDK

↓

Task Loader

↓

Context Builder

↓

Memory Loader

↓

Skill Loader

↓

Prompt Engine

↓

LLM Router

↓

LLM

↓

Response Parser

↓

Validator

↓

Self Review

↓

Artifact Repository

↓

Event Bus

↓

Secretary
```

AgentはSDKだけを呼び出す。

---

# SDK Modules

Agent SDKは以下のモジュールで構成する。

- Task Module
- Context Module
- Memory Module
- Skill Module
- Prompt Module
- Router Module
- Validation Module
- Artifact Module
- Event Module
- Logging Module
- Metrics Module

---

# Base Agent

すべてのAgentはBaseAgentを継承する。

例

```text
BaseAgent

├── FrontendAgent
├── BackendAgent
├── DesignerAgent
├── QAAgent
├── LegalAgent
├── MarketingAgent
├── ProjectManagerAgent
├── SecretaryAgent
```

BaseAgentは共通処理のみ提供する。

---

# Agent Lifecycle

Agentは以下のライフサイクルで実行される。

```
Initialize

↓

Load Task

↓

Load Context

↓

Generate Prompt

↓

Execute

↓

Validate

↓

Review

↓

Generate Artifact

↓

Complete

↓

Dispose
```

Dispose後に状態を保持しない。

---

# Agent Configuration

各Agentは設定ファイルを持つ。

設定例

- Name
- Description
- Role
- Supported Tasks
- Default Model Tier
- Approval Level
- Retry Policy
- Timeout
- Output Format
- Required Skills
- Memory Policy

---

# Hooks

SDKはHookを提供する。

- beforeExecute()
- afterExecute()
- beforeValidation()
- afterValidation()
- beforeArtifactSave()
- afterArtifactSave()
- onError()

Hookで独自処理を追加できる。

---

# Validation

SDKは標準Validationを提供する。

対象

- JSON
- Markdown
- TypeScript
- HTML
- OpenAPI
- Database Schema

Agentは追加Validationのみ実装する。

---

# Retry Policy

SDKがRetryを管理する。

順序

1. 同一Prompt再実行

2. Prompt最適化

3. 上位Modelへ昇格

4. Provider変更

5. Secretary通知

---

# Logging

SDKが自動記録する。

- Execution ID
- Agent
- Prompt Version
- Model
- Tokens
- Cost
- Retry Count
- Duration
- Result

Agent側で実装する必要はない。

---

# Metrics

SDKが自動収集する。

- Success Rate
- Failure Rate
- Average Time
- Average Cost
- Token Usage
- Cache Hit Rate
- Review Pass Rate

---

# Event Integration

SDKは自動でEventを発行する。

例

AgentStarted

↓

AgentCompleted

↓

ArtifactCreated

↓

ValidationFailed

↓

RetryStarted

↓

RetryCompleted

---

# Error Handling

SDKが共通処理する。

分類

- Validation Error
- Prompt Error
- LLM Error
- API Error
- Timeout
- Unexpected Error

重大エラーはSecretaryへ通知する。

---

# Security

SDKは禁止する。

- API Key保持
- Prompt直接生成
- Database直接更新
- Workflow直接変更

すべて専用Engine経由とする。

---

# Testing

SDKは共通テストを提供する。

- Unit Test
- Integration Test
- Mock LLM Test
- Validation Test
- Retry Test

新しいAgentはSDKテストを継承する。

---

# Example

FrontendAgentが実装する内容は最小限とする。

例

- Role
- Supported Tasks
- Required Skills
- Output Format

その他はSDKが処理する。

---

# Future Extension

Phase2

- Agent Marketplace
- Remote Agent
- Multi Agent Collaboration
- MCP対応
- Plugin SDK
- Custom Tool SDK
- Visual Agent Builder

---

# Success Criteria

新しいAI Agentは、

- 設定ファイル
- Role定義
- 必要Skill
- 必要Validation

を追加するだけで動作する。

Agent SDKはAI Workforce OSにおけるAI開発基盤として機能し、

すべてのAgentの品質・保守性・拡張性を統一する。
