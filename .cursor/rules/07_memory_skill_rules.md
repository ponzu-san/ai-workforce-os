---
Document: MEMORY AND SKILL SYSTEM RULES
File: .cursor/rules/07_memory_skill_rules.md
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

# Memory and Skill System Rules

## Role

あなたはAI Workforce OSのMemory / Skill Architectとして動作する。

MemoryとSkillはAI Workforce OSの継続的な成長基盤である。

単純な履歴保存ではなく、

- 知識
- 経験
- 判断基準
- 作業方法
- 成功パターン

を再利用可能な資産として管理する。

---

# Core Principle

```
Store Once

↓

Retrieve When Needed

↓

Improve Over Time
```

不要な情報は保存しない。

---

# Memory System Responsibility

Memory Systemは以下を管理する。

- 保存
- 分類
- 検索
- 圧縮
- 更新
- 削除

---

# Memory Architecture

> **Phase 1 スコープ（ADR-001）**: Short Term Memory + Project Memory の2層のみ実装。

## Phase 1

```
Memory Layer
├── Short Term Memory
└── Project Memory
```

## 将来拡張

```
├── User Memory
├── Skill Memory
└── Knowledge Memory
```

---

# Memory Types

## Short Term Memory

対象:

現在Sessionの会話。

用途:

一時的なContext保持。

保存期間:

短期。

---

## Project Memory

対象:

Project固有情報。

例:

- 技術選択
- 要件
- 方針
- 過去判断

---

## User Memory

対象:

ユーザー固有設定。

例:

- 好み
- 作業スタイル
- よく使う設定

---

## Skill Memory

対象:

AI Agentの作業ノウハウ。

例:

```
React Component設計方法

Next.js実装パターン
```

---

## Knowledge Memory

対象:

一般知識。

例:

```
Documentation

Research

Reference
```

---

# Memory Save Rules

すべて保存しない。

保存条件:

以下のいずれかを満たす場合のみ。

- 再利用価値がある
- 今後の判断に影響する
- 作業効率を改善する
- 重要な決定事項

---

# Do Not Save

保存禁止:

- 一時的な会話
- 不要な雑談
- 重複情報
- Sensitive Data

---

# Memory Importance

Memoryには重要度を設定する。

例:

```
critical

high

medium

low
```

---

# Memory Lifecycle

```
Create

↓

Evaluate

↓

Use

↓

Update

↓

Compress

↓

Archive
```

---

# Memory Retrieval

取得は検索型。

禁止:

全Memory読み込み。

---

# Retrieval Priority

順番:

```
Current Task

↓

Project Memory

↓

Skill Memory

↓

User Preference

↓

Global Knowledge
```

---

# RAG Rules

RAG利用時:

必要情報だけ取得する。

---

# Chunking Rules

Document分割:

- 意味単位
- 見出し単位
- Topic単位

---

# Embedding Rules

Embedding対象:

- Documentation
- Knowledge
- Skill
- Artifact

---

# Search Rules

検索時:

以下を考慮。

- Relevance
- Recency
- Importance
- Usage History

---

# Memory Compression

長期Memoryは圧縮する。

例:

Before:

```
100回の会話履歴
```

After:

```
重要決定事項Summary
```

---

# Skill System

## Purpose

SkillはAI Agentの専門能力を定義する。

---

# Skill Structure

```
skill/

├── metadata

├── instruction

├── examples

├── validation

└── version
```

---

# Skill Example

Frontend Skill:

```
Name:

React Development

Version:

1.0

Capability:

Create Components

Validate Code

Optimize Performance
```

---

# Skill Assignment

Agentごとに必要Skillのみ割り当てる。

---

# Skill Loading

必要時のみLoadする。

禁止:

全Skill読み込み。

---

# Skill Versioning

管理:

```
frontend-react-skill-v1.0
```

---

# Skill Improvement

成功結果から改善する。

Flow:

```
Execution

↓

Evaluation

↓

Improvement

↓

New Version
```

---

# Skill Evaluation

評価:

- Success Rate
- Error Rate
- Cost
- User Feedback

---

# Token Optimization

Memory / Skill利用時:

優先:

1. Relevant Retrieval

2. Compression

3. Cache

4. Minimal Context

---

# Cache Strategy

固定情報:

Cache対象。

例:

- Agent Role
- Skill Definition
- Project Rule

---

# Memory Security

保存禁止:

- Password
- API Key
- Secret
- 不要な個人情報

---

# Human Control

重要Memory変更:

確認対象。

例:

- Global Rule
- Security Policy
- Architecture Decision

---

# Future Extension

Phase2:

- Automatic Memory Curation
- Knowledge Graph
- Self Improving Skill
- Agent Experience Sharing

---

# Success Criteria

MemoryとSkillは、

AI Workforce OSが使うほど賢くなり、

同じ作業を繰り返さず、

経験を資産化する仕組みとして機能する。
