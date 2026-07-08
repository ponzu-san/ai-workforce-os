---
Document: AI MEMORY SYSTEM DESIGN
File: docs/architecture/AI_MEMORY_DESIGN.md
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

# AI Workforce OS Memory System Design

## 1. Purpose

AI Memory Systemは、

AI Agentが過去の経験・知識・判断を再利用するための基盤である。

目的:

```
Remember

↓

Retrieve

↓

Apply

↓

Improve
```

を実現する。

---

# 2. Memory Philosophy

AI Workforce OSでは、

すべての会話を保存するのではなく、

価値のある情報だけを資産化する。

---

# 3. Memory Architecture

> **Phase 1 スコープ（ADR-001）**: Short Term Memory + Project Memory の2層のみ実装。

## Phase 1（App v0.2.0）

```
Memory System
├── Short Term Memory
└── Project Memory
```

## 将来拡張（Phase 2 以降）

```
├── Global Knowledge
├── User Memory
├── Skill Memory
└── Client Memory
```

---

# 4. Short Term Memory

## Purpose

現在実行中のTask Context。

---

保存対象:

- Current Conversation
- Current Task
- Temporary Result

---

特徴:

短期間のみ保持。

---

# 5. Project Memory

## Purpose

Project固有の知識。

---

保存例:

```
Architecture Decision

Technology Choice

Requirement

Past Issue

Client Preference
```

---

例:

```
This Project uses PostgreSQL

Reason:
Scalability and JSON support
```

---

# 6. User Memory

## Purpose

ユーザー作業スタイルを理解する。

---

保存例:

```
Preferred Workflow

Coding Style

Communication Preference
```

---

禁止:

不要な個人情報。

---

# 7. Skill Memory

## Purpose

AI Agentの経験を蓄積する。

---

例:

Frontend Agent:

```
React Component Pattern

Common Bug Fix

Optimization Method
```

---

# 8. Knowledge Memory

## Purpose

外部知識を利用する。

---

対象:

```
Documentation

Technical Articles

Specifications

Reference Data
```

---

# 9. Memory Flow

```
Input

↓

Memory Evaluation

↓

Save Decision

↓

Embedding

↓

Storage

↓

Retrieval
```

---

# 10. Memory Save Decision

保存条件:

以下を満たす場合のみ。

```
Reusable

OR

Important Decision

OR

Improves Future Work
```

---

保存しない:

```
Temporary Chat

Duplicate Information

Low Value Data
```

---

# 11. Memory Storage

Phase1:

PostgreSQL

---

Extension:

```
pgvector
```

を利用予定。

---

構造:

```
Memory Record

├── Content

├── Type

├── Importance

├── Embedding

├── Source

└── Created Date
```

---

# 12. RAG Architecture

基本構成:

```
User Request

↓

Query Analysis

↓

Vector Search

↓

Relevant Memory Retrieval

↓

Context Injection

↓

LLM
```

---

# 13. Retrieval Strategy

検索基準:

```
Similarity

+

Importance

+

Recency

+

Project Relation
```

---

# 14. Context Optimization

目的:

Token削減。

---

Rules:

- 必要情報だけ取得
- 古い情報は圧縮
- 重複削除
- Summary利用

---

# 15. Memory Compression

長期間利用するとMemoryは増加する。

対策:

```
Raw Memory

↓

Summary

↓

Compressed Memory
```

---

例:

Before:

```
50回の設計議論
```

After:

```
Architecture Decision Summary
```

---

# 16. Prompt Cache Strategy

固定Context:

Cache対象。

例:

```
Agent Role

System Rules

Project Rules

Skill Definition
```

---

# 17. Token Optimization Strategy

優先順位:

```
1. Retrieval Accuracy

2. Context Compression

3. Prompt Cache

4. Low Cost Model

5. Batch Processing
```

---

# 18. Memory Access Control

Agentごとにアクセス範囲を制御。

---

例:

Frontend Agent:

Access:

```
Frontend Skill

Project Code

UI Decision
```

---

No Access:

```
Contract

Financial Data
```

---

# 19. Memory Quality Evaluation

評価:

```
Usage Frequency

Retrieval Accuracy

User Feedback

Success Improvement
```

---

# 20. Memory Lifecycle

```
Create

↓

Evaluate

↓

Store

↓

Retrieve

↓

Update

↓

Compress

↓

Archive
```

---

# 21. Skill Relationship

Memory:

「経験」

Skill:

「再利用可能な能力」

---

関係:

```
Execution Result

↓

Memory

↓

Skill Improvement

↓

Better Agent
```

---

# 22. Future Extension

追加予定:

- Knowledge Graph
- Automatic Memory Curation
- Self Improving Agent
- Cross Agent Learning

---

# Success Criteria

Memory Systemにより、

AI Workforce OSは使用するほど知識を蓄積し、

同じ問題を繰り返さず、

個人専属AIチームとして成長する。
