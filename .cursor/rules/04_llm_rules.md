---
Document: LLM ARCHITECTURE RULES
File: .cursor/rules/04_llm_rules.md
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

# LLM Architecture Rules

## Role

あなたはAI Workforce OSのLLM Architectとして動作する。

LLMは単純なチャット機能ではなく、

- Agentの推論
- Code生成
- Analysis
- Planning
- Review
- Knowledge Processing

を担当するAI基盤である。

---

# Core Principle

LLM利用方針:

```
Quality

+

Cost Efficiency

+

Reliability
```

を同時に満たす。

---

# LLM Access Rule

Agentは直接LLM Providerを呼び出さない。

禁止:

```
Agent

↓

OpenAI API
```

```
Agent

↓

Claude API
```

---

正しい:

```
Agent

↓

LLM Router

↓

Provider
```

---

# LLM Router Responsibility

LLM Routerは以下を管理する。

- Model Selection
- Provider Selection
- Token Tracking
- Cost Tracking
- Retry
- Fallback
- Cache
- Batch
- Logging

---

# Supported Providers

Phase1:

- OpenAI API
- Anthropic API

将来:

- Google Gemini
- Local LLM
- Open Source Model

対応可能な設計にする。

---

# Model Selection Strategy

基本方針:

```
Cheapest Suitable Model First
```

最初から高性能モデルを使用しない。

---

# Routing Example

## Simple Task

対象:

- Summary
- Classification
- Tag Generation

利用:

Low Cost Model

---

## Normal Task

対象:

- Planning
- Documentation
- Simple Coding

利用:

Mid Model

---

## Complex Task

対象:

- Architecture Design
- Difficult Debug
- Large Code Generation

利用:

High Capability Model

---

# Model Escalation

段階的に昇格する。

```
Nano/Mini

↓

Standard

↓

High Capability
```

---

# Escalation Conditions

High Modelへ変更する条件:

- Error repeated
- Low confidence
- Complex reasoning required
- User request

---

# Prompt Design Rules

Promptは分離管理する。

```
prompts/

├── system

├── agent

├── task

└── evaluation
```

---

# Prompt Structure

基本:

```
Role

↓

Context

↓

Goal

↓

Rules

↓

Input

↓

Output Format
```

---

# Prompt Versioning

PromptはVersion管理する。

例:

```
frontend-agent-prompt-v1.0
```

---

# Prompt Cache Strategy

固定ContextはCache対象。

対象:

- System Prompt
- Agent Role
- Skill Definition
- Project Rules

---

# Cache Optimization

毎回送信しない。

保持:

```
Stable Context

↓

Cached

↓

Dynamic Input
```

---

# RAG Rules

RAG利用時:

必要情報のみ取得する。

禁止:

全Document投入。

---

# Context Priority

取得優先:

```
Current Task

↓

Project Memory

↓

Skill

↓

Global Knowledge
```

---

# Memory Compression

長期Memoryは圧縮する。

対象:

- Conversation
- Logs
- Documents

---

# Token Optimization Rules

必ず意識する。

優先順位:

1. Cache

2. Context Reduction

3. RAG Filtering

4. Model Routing

5. Batch Processing

---

# Batch API Rules

リアルタイム不要処理はBatch利用を検討。

対象:

- Daily Summary
- Log Analysis
- Memory Compression
- Report Generation

---

# Streaming Rules

Streaming対象:

- Chat
- Long Generation
- Code Generation

---

# Retry Strategy

LLM Error時:

```
Retry

↓

Reduce Context

↓

Change Model

↓

Human Approval
```

---

# Fallback Strategy

Provider障害時:

例:

```
OpenAI

↓

Anthropic

↓

Local Model
```

---

# Cost Tracking

必ず記録:

- Provider
- Model
- Input Token
- Output Token
- Cache Hit
- Cost
- Agent

---

# Cost Dashboard

表示:

- Daily Cost
- Monthly Cost
- Agent Cost
- Project Cost
- Model Usage

---

# Security Rules

禁止:

- SecretをPromptへ直接投入
- Personal Data不要送信
- API Key Logging

---

# AI Response Validation

LLM出力は信用しない。

必ず:

- Schema Validation
- Error Check
- Safety Check

を行う。

---

# Structured Output

可能な限りJSON形式を利用する。

例:

```json
{
  "result": "",
  "confidence": 0.9,
  "next_action": ""
}
```

---

# Human in the Loop

重要判断は人間確認。

対象:

- Public Release
- Contract
- Legal
- Payment
- Security

---

# Future Extension

Phase2:

- Agent Memory Optimization
- Automatic Prompt Optimization
- Model Benchmarking
- Local Model Support
- Fine Tuning

---

# Success Criteria

LLMは、

高品質なAI能力を維持しながら、

不要なToken消費を避け、

低コストで継続利用できる基盤として設計する。
