---
Document: SKILL ENGINE ARCHITECTURE
File: docs/09_SKILL_ENGINE.md
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

# Skill Engine

## Purpose

Skill EngineはAI Workforce OSにおける再利用可能な専門知識管理システムである。

SkillはAI Agentへ専門知識・開発ルール・ベストプラクティスを提供し、
Promptを短く保ちながら品質を向上させる。

SkillはProject固有の情報を持たず、
複数Projectから再利用できることを前提とする。

---

# Design Principles

Skill Engineは以下を原則とする。

- Reusable
- Modular
- Version Controlled
- Provider Independent
- Prompt Optimized
- Cache Friendly
- Read Optimized

---

# Responsibilities

Skill Engineは以下を担当する。

- Skill管理
- Skill検索
- Skill読込
- Version管理
- Validation
- キャッシュ管理
- Dependency管理

---

# Skill Structure

SkillはMarkdownファイルとして保存する。

例

```
skills/

frontend/
    react.md
    nextjs.md
    typescript.md
    tailwind.md

backend/
    nodejs.md
    prisma.md

design/
    figma.md
    uiux.md

qa/
    testing.md

legal/
    privacy-policy.md

marketing/
    seo.md
```

---

# Skill Metadata

各Skillは以下を保持する。

- Skill ID
- Name
- Category
- Version
- Description
- Tags
- Dependencies
- Created At
- Updated At

---

# Skill Content

Skillは以下で構成する。

- Purpose
- Scope
- Rules
- Best Practices
- Common Mistakes
- Examples
- References

Markdown形式で記述する。

---

# Skill Categories

Phase1

- Frontend
- Backend
- Design
- QA
- Legal
- Marketing
- Project Management
- DevOps
- Database
- Security

---

# Skill Loading

Taskに応じて必要なSkillのみ読み込む。

例

Frontend Task

↓

React

↓

Next.js

↓

TypeScript

↓

Tailwind CSS

不要なSkillは読み込まない。

---

# Dependency Management

Skillは他のSkillへ依存できる。

例

Next.js

↓

React

↓

TypeScript

Skill Engineが依存関係を解決する。

---

# Skill Version

すべてのSkillはSemantic Versioningを採用する。

例

0.1.0

↓

0.2.0

↓

1.0.0

履歴は保持する。

---

# Skill Validation

Skill追加時に検証する。

確認項目

- Markdown形式
- Metadata
- Version
- Dependency
- 重複

Validation失敗時は登録しない。

---

# Prompt Integration

Prompt BuilderはSkill EngineからSkillを取得する。

```
Task

↓

Skill Loader

↓

Skill Engine

↓

Prompt Builder

↓

LLM
```

Promptへ全文を送らず、
必要部分のみ抽出できる設計とする。

---

# Cache Strategy

頻繁に利用するSkillはキャッシュする。

対象

- React
- Next.js
- TypeScript
- Tailwind CSS

TTLは設定可能。

---

# Search

検索条件

- Name
- Category
- Tags
- Dependency
- Version
- Keyword

---

# Skill Editor

Phase2でGUIを提供する。

機能

- 作成
- 編集
- 比較
- バージョン更新
- プレビュー
- Import
- Export

Phase1ではMarkdown編集を採用する。

---

# AI Responsibilities

AIはSkillを利用する。

新しいSkill候補を提案できる。

既存Skillを自動更新してはならない。

更新はApprovalを必要とする。

---

# User Actions

ユーザーは以下を実行できる。

- 作成
- 編集
- 削除（Archive）
- 比較
- Export
- Import
- Version更新

---

# Logging

保存する。

- 利用回数
- 利用Agent
- 利用Task
- Prompt反映回数
- Cache Hit率

---

# Metrics

計測する。

- Skill利用率
- Cache Hit率
- Prompt削減率
- Token削減率
- Validation成功率

---

# Security

Skillは論理削除する。

履歴は保持する。

重要Skill更新時はApprovalを要求する。

---

# Future Extension

Phase2

- Skill Marketplace
- AI自動Skill生成
- Skill推薦
- Skillランキング
- GitHub同期
- Skill共有
- Skillパッケージ
- Community Skill

---

# Success Criteria

AIはTaskごとに必要最小限のSkillだけを読み込み、

Promptを短く保ちながら高品質な成果物を生成する。

Skill EngineはAI Workforce OSにおける専門知識の再利用基盤として機能する。
