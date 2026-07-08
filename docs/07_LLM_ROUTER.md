---
Document: LLM ROUTER ARCHITECTURE
File: docs/07_LLM_ROUTER.md
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

# LLM Router

## Purpose

LLM RouterはAI Workforce OSにおいて最適なLLMを選択するコンポーネントである。

AI AgentはLLMを直接呼び出さない。

すべてのリクエストはRouterを経由し、

タスク内容・品質・コスト・速度・トークン数を考慮して最適なモデルへ振り分ける。

---

# Design Principles

Routerは以下を最優先とする。

- Cost First
- Cache First
- Skill First
- Memory Optimization
- Model Independence
- Fail Safe
- Provider Agnostic

---

# Responsibilities

Routerは以下を担当する。

- Provider選択
- Model選択
- Prompt Cache管理
- Token削減
- Retry
- Fallback
- Batch振り分け
- Streaming管理
- Cost集計

---

# Routing Pipeline

```
Task

↓

Prompt Builder

↓

Prompt Cache

↓

Skill Loader

↓

Memory Loader

↓

Token Estimator

↓

Router

↓

Provider

↓

Model

↓

Response
```

---

# Provider Layer

Providerは抽象化する。

対応Provider

- OpenAI
- Anthropic

将来対応

- Google
- xAI
- Mistral
- Ollama
- OpenRouter
- Azure OpenAI

Router以外はProviderを意識しない。

---

# Model Tier

モデルを性能別に分類する。

Tier 1

Nano

用途

- 分類
- 要約
- タグ付け
- JSON変換
- ログ整理

---

Tier 2

Mini

用途

- Task生成
- Prompt生成
- 軽いレビュー
- Markdown生成
- 簡単なコード生成

---

Tier 3

Standard

用途

- UI設計
- コードレビュー
- 中規模実装
- リファクタリング

---

Tier 4

Reasoning

用途

- アーキテクチャ設計
- 難しいバグ解析
- 複雑なアルゴリズム
- 長文分析

---

Tier 5

Claude

用途

- 大規模コード生成
- 長文編集
- 高品質レビュー
- ドキュメント生成

Claudeは必要時のみ利用する。

---

# Routing Rules

Routerは以下を評価する。

Task Type

↓

Prompt Size

↓

Expected Output

↓

Required Quality

↓

Expected Cost

↓

Expected Tokens

↓

Cache Hit

↓

Model決定

---

# Prompt Cache

Prompt Cacheを最優先する。

対象

System Prompt

Skills

Global Memory

共通Instructions

Cache Hit時は同一Providerを優先する。

---

# Token Optimization

送信前に実施する。

- Context Compression
- Memory Filtering
- Skill Filtering
- Prompt Shortening
- 重複除去
- Artifact参照化
- Summary利用

---

# Memory Strategy

Memory送信順

Session

↓

Project

↓

Client

↓

Global

必要になった時点で追加する。

---

# Skill Strategy

Taskごとに必要なSkillのみ送信する。

例

Frontend Task

↓

React

Next.js

TypeScript

Tailwind

不要Skillは送信しない。

---

# Batch Strategy

リアルタイム不要なTaskはBatchへ送る。

例

- Daily Summary
- Token集計
- Log分析
- Tag生成
- Memory整理
- コスト集計

リアルタイム処理と分離する。

---

# Retry Strategy

失敗時

Retry

↓

同モデル

↓

Fallback Model

↓

別Provider

↓

Secretary通知

---

# Fallback Strategy

例

Mini失敗

↓

Standard

↓

Reasoning

↓

Claude

必要最低限の昇格を行う。

---

# Cost Strategy

優先順位

Prompt Cache

↓

Batch

↓

Nano

↓

Mini

↓

Standard

↓

Reasoning

↓

Claude

Routerは常に最安構成を試みる。

---

# Streaming

Streaming対応Task

- Chat
- AI Secretary
- Code Generation
- Long Document

短いTaskでは無効化する。

---

# Structured Output

可能な限り構造化出力を利用する。

形式

- JSON
- Markdown
- YAML

自由形式の文章は最小限とする。

---

# Metrics

収集する。

Provider

Model

Latency

Input Tokens

Output Tokens

Cache Hit率

Batch率

Retry率

Failure率

Cost

---

# Cost Dashboard

表示項目

Today

This Week

This Month

Provider別

Model別

Agent別

Project別

Workflow別

---

# Rate Limit

Providerごとに管理する。

- Requests / Minute
- Tokens / Minute
- Daily Limit

超過時は自動で他Providerへ切り替える。

---

# Error Handling

分類

Network Error

Rate Limit

Timeout

Provider Error

Model Error

Validation Error

Unexpected Error

必要に応じて自動復旧する。

---

# Security

Routerは保持しない。

- API Key
- Prompt履歴
- Secret情報

必要最小限のみ扱う。

API KeyはInfrastructure Layerで管理する。

---

# Future Extension

Phase2

- AIによるRouter最適化
- Providerベンチマーク
- 動的価格比較
- ローカルLLM対応
- GPU Router
- Agentごとの専用Router
- マルチLLM投票
- 推論時間予測

---

# Success Criteria

Routerは常に

- 最小コスト
- 最小トークン
- 必要十分な品質
- 最短レスポンス

を満たすLLMを自動選択する。

ユーザーはProviderやModelを意識することなく、

AI Workforce OSを利用できる。
