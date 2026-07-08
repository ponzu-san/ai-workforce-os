---
Document: AI AGENTS ARCHITECTURE
File: docs/05_AI_AGENTS.md
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

# AI Agents Architecture

## Purpose

本ドキュメントはAI Agentの内部構造と実行方法を定義する。

Requirementsで定義した役割を、どのような設計で実現するかを定義する。

---

# Design Principles

AI Agentは以下の原則を守る。

- Single Responsibility
- Stateless
- Reproducible
- Deterministic Workflow
- Artifact Driven
- Prompt Driven
- Skill Driven
- Memory Driven

---

# Common Architecture

すべてのAgentは同一構造とする。

```
Secretary

↓

Task

↓

Context Builder

↓

Memory Loader

↓

Skill Loader

↓

Prompt Builder

↓

Router

↓

LLM

↓

Response Parser

↓

Validator

↓

Self Review

↓

Artifact Generator

↓

Secretary
```

すべてのAgentはこのPipelineを通過する。

---

# Agent Runtime

Agentは状態を保持しない。

毎回

Task

Artifact

Memory

Skills

Prompt

から再構築する。

チャット履歴は保持しない。

---

# Context Builder

責務

LLMへ送信するContextを生成する。

取得対象

- Project
- Workflow
- Task
- Acceptance Criteria
- Related Artifact

不要情報は除外する。

---

# Memory Loader

責務

Memory取得。

取得順

Session

↓

Project

↓

Client

↓

Global

必要になった段階で読み込む。

---

# Skill Loader

責務

Taskに必要なSkillだけ取得する。

例

Frontend

↓

React

Next.js

TypeScript

Tailwind

不要Skillは読み込まない。

---

# Prompt Builder

責務

Prompt生成。

構成

System

↓

Task

↓

Context

↓

Skill

↓

Memory

↓

Output Format

Promptは毎回生成する。

---

# Router

責務

LLM選択。

評価

Promptサイズ

Task難易度

Expected Output

Reasoning

Token Cost

Cache Hit

---

# LLM Execution

LLMへ送信。

Streaming対応。

Timeout設定。

Retry対応。

JSON Modeを優先する。

---

# Response Parser

責務

LLM出力解析。

Markdown

JSON

Code

Table

Text

必要形式へ変換する。

---

# Validator

責務

成果物を検証する。

例

JSON Schema

Markdown

TypeScript

OpenAPI

Validation失敗時は再生成する。

---

# Self Review

Agent自身がレビューする。

確認

Requirement

Acceptance Criteria

Coding Rules

Skill

Prompt

Artifact

問題があれば再実行する。

---

# Artifact Generator

責務

成果物生成。

保存

Version

Metadata

Summary

History

Artifact Repositoryへ登録する。

---

# Agent Configuration

各Agentは以下を持つ。

ID

Name

Description

Role

Skills

Prompt Template

Memory Policy

Retry Policy

Approval Level

LLM Strategy

Output Format

---

# Retry Policy

失敗時

1

Self Retry

2

Prompt Improvement

3

Model Upgrade

4

Secretaryへ報告

---

# Timeout

Default

60秒

変更可能。

長時間処理はBackground Jobへ移行する。

---

# LLM Strategy

標準

Nano

↓

Mini

↓

Standard

↓

Reasoning

↓

Claude

必要時のみ上位モデルを利用する。

---

# Prompt Cache

Prompt Cacheを利用する。

対象

System Prompt

Skill

Global Memory

固定部分を最大限キャッシュする。

---

# Batch Processing

リアルタイム不要なTask

例

要約

ログ分析

タグ生成

履歴整理

はBatch処理する。

---

# Parallel Execution

依存関係がないTaskは並列実行する。

例

QA

Marketing

Legal

同時実行可能。

Secretaryが制御する。

---

# Resource Limits

設定

Max Context

Max Tokens

Timeout

Retry Count

Parallel Count

Rate Limit

---

# Error Recovery

LLM Error

↓

Retry

↓

Fallback Model

↓

Secretary

↓

Human Approval

---

# Agent Registry

Agent情報を登録する。

保存

Role

Version

Prompt

Skill

Supported Tasks

LLM Policy

Status

---

# Agent SDK

すべてのAgentは同一SDKを利用する。

提供機能

Task取得

Prompt生成

Artifact保存

Memory取得

Review

Logging

Metrics

これによりAgent追加時の実装量を最小化する。

---

# Logging

保存

Prompt Version

Model

Execution Time

Input Tokens

Output Tokens

Cost

Retry Count

Artifact Version

Review Result

---

# Metrics

計測

Success Rate

Failure Rate

Average Time

Average Cost

Average Tokens

Review Pass Rate

---

# Security

Prompt Injection対策

Schema Validation

Tool制限

API権限制御

Secret Masking

監査ログ

---

# Future Extension

Phase2

- MCP対応
- Agent Marketplace
- Remote Agent
- Multi LLM Execution
- Agent Voting
- AI Debate
- Self Improvement

---

# Success Criteria

すべてのAgentが同一Pipelineで動作し、

追加・変更・削除が容易であり、

LLMが変わってもAgentの実装を変更する必要がない構造を実現する。

AI Agentはビジネスロジックではなく「実行エンジン」として機能する。
