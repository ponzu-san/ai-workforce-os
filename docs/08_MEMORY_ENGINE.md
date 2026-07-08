---
Document: MEMORY ENGINE ARCHITECTURE
File: docs/08_MEMORY_ENGINE.md
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

# Memory Engine

## Purpose

Memory EngineはAI Workforce OSにおける知識管理基盤である。

AI Agentは長いチャット履歴を利用せず、
必要な知識だけをMemory Engineから取得する。

Memoryはトークン削減と回答品質の両立を目的とする。

---

# Design Principles

Memory Engineは以下を原則とする。

- Memory First
- Retrieval First
- Context Minimal
- Layered Memory
- Version Controlled
- Provider Independent
- Read Optimized

---

# Responsibilities

Memory Engineは以下を担当する。

- Memory保存
- Memory検索
- Memory更新
- Memory圧縮
- Memory要約
- Version管理
- Retrieval
- Garbage Collection

---

# Memory Layers

> **Phase 1 スコープ（ADR-001）**: Short Term Memory + Project Memory の2層のみ実装する。

## Phase 1（App v0.2.0）

```
Short Term Memory
Project Memory
```

下位レイヤーほど優先度が高い（取得時は Short Term → Project の順）。

---

## 将来拡張（Phase 2 以降）

以下は設計として保持するが、Phase 1 では実装しない。

```
Global Knowledge
User Memory
Skill Memory
Client Memory
```

---

# Short Term Memory（Phase 1）

現在の作業専用。旧 Session Memory に相当。

例

- 今回のTask
- 一時的な変数
- 作業中のContext
- 実行中の状態

Session終了時に削除する。

---

# Project Memory（Phase 1）

Project専用の知識。

例

- 要件
- UI仕様
- API仕様
- DB仕様
- 過去の意思決定
- レビュー履歴

Project終了後も保持する。

---

# Global Memory（将来拡張）

Workspace全体で共有する知識。

例

- Coding Rules
- Design Rules
- 命名規則
- 開発方針
- 共通Skill
- システムルール

更新頻度は低い。

---

# Client Memory（将来拡張）

クライアント単位の知識。

例

- ブランドガイドライン
- デザインルール
- コーディング規約
- 業務ルール
- 契約条件

Phase1では1クライアントのみ対応。

---

# Project Memory（将来拡張・旧4層定義）

旧4層定義との対応用。Phase 1 実装は上記「Project Memory（Phase 1）」を正とする。

---

# Session Memory（将来拡張）

旧 Session Memory。Phase 1 では Short Term Memory を使用する。

---

# Memory Structure

Memoryは以下を保持する。

- Memory ID
- Layer
- Title
- Content
- Summary
- Tags
- Version
- Created At
- Updated At

---

# Memory Retrieval

## Phase 1 取得順

```
Short Term Memory
↓
Project Memory
```

## 将来拡張 取得順

```
Short Term Memory
↓
Project Memory
↓
Client Memory
↓
Global Knowledge
```

必要なLayerのみ取得する。

---

# Retrieval Strategy

検索条件

- Task Type
- Agent
- Workflow
- Tags
- Project
- Similarity Score

必要最小限のMemoryのみ返す。

---

# Context Builder Integration

Prompt生成前にMemoryを取得する。

```
Task

↓

Memory Search

↓

Relevant Memories

↓

Prompt Builder
```

不要MemoryはPromptへ含めない。

---

# Memory Compression

長いMemoryは圧縮する。

保持する内容

- Summary
- Key Decisions
- Important Rules
- Links

元データは削除しない。

---

# Memory Version

すべてのMemoryはVersion管理する。

例

0.1.0

↓

0.2.0

↓

1.0.0

履歴は保持する。

---

# Memory Tags

タグ例

React

Next.js

Legal

Client

API

Requirement

Bug

Workflow

UI

QA

検索速度向上に利用する。

---

# Memory Update Policy

更新できる対象

Project

Client

Global

Session

重要Memory更新時はApprovalを要求する。

---

# Memory Expiration

Session Memoryのみ期限を持つ。

デフォルト

Session終了時削除

他Layerは保持する。

---

# Memory Cache

取得したMemoryは一時キャッシュする。

対象

Project

Client

Global

キャッシュTTLは設定可能。

---

# Search Optimization

検索前に以下を利用する。

Tags

Summary

Embedding（Phase2）

Keyword

Metadata

---

# AI Responsibilities

AIはMemoryを更新できる。

更新時は

Summary

Tags

Version

History

を生成する。

---

# User Actions

ユーザーは以下を実行できる。

作成

編集

検索

比較

Archive

Restore

Export

Import

---

# Logging

保存する。

取得回数

更新回数

利用Agent

利用Task

Version

Latency

---

# Metrics

計測

Retrieval Time

Hit Rate

Miss Rate

Memory Size

Compression Rate

Reuse Rate

---

# Security

Memoryは論理削除する。

履歴は保持する。

重要MemoryはApprovalを要求する。

API Keyなどの機密情報はMemoryへ保存しない。

---

# Future Extension

Phase2

- Vector Search
- Embedding
- Semantic Search
- AI自動整理
- AI自動タグ付け
- Memory Recommendation
- Cross Project Search
- Knowledge Graph

---

# Success Criteria

AIは長いチャット履歴ではなく、

必要最小限のMemoryだけを取得し、

高速・低コスト・高品質な回答を実現する。

Memory EngineはAI Workforce OSの知識基盤として機能する。
