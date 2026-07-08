---
Document: ROADMAP
File: docs/02_ROADMAP.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS (Temporary)

App Version: v0.1.0

Created: 2026-07-08
Last Updated: 2026-07-08
Document Version: 0.1.1
---

# Roadmap

> **Version Policy（ADR-001）**
>
> - Phase 0 = App **v0.1.0**（Foundation）
> - Phase 1 = App **v0.2.0**（Personal AI Workspace MVP）
> - Phase 1 Memory = Short Term + Project（2層）
> - Phase 1 Agent = Secretary AI のみ

## Purpose

本ドキュメントは、AI Workforce OS の開発フェーズを定義する。

各フェーズは独立して実装可能とし、Cursorには現在のフェーズのみを実装対象として指示する。

将来の構想は考慮するが、現在のフェーズ以外は実装しない。

---

# Development Strategy

開発はMVP（Minimum Viable Product）を採用する。

常に

「動くもの」

を優先する。

機能を作り過ぎない。

完成度よりも改善しやすい設計を優先する。

---

# Phase 0

## Foundation

App Version:

```
v0.1.0
```

目的

AI Workforce OS の開発基盤を構築する。

対象ユーザー

自分一人（Local Only）

---

## 実装する内容

- Next.js セットアップ
- TypeScript 設定
- Tailwind CSS / shadcn/ui
- ディレクトリ構成（`src/`）
- Prisma / PostgreSQL
- 初期 Database Schema
- 基本 Layout（Header / Sidebar / Main）
- 開発ルール適用（ESLint / Prettier / TypeScript strict）

---

## Phase 0 完了条件

- アプリケーションが起動する
- Database に接続できる
- 基本 Layout が表示される
- Type Check / Lint が通る

---

# Phase 1

## Personal AI Workspace MVP

App Version:

```
v0.2.0
```

目的

自分自身が毎日使える最低限の AI 管理ツールを完成させる。

対象ユーザー

自分一人

---

## 実装する機能

### Dashboard

- 今日やること
- AI秘書からの通知
- 承認待ち
- プロジェクト一覧

---

### Project Management

- プロジェクト作成
- プロジェクト一覧・詳細
- ステータス管理

---

### Task Management

- タスク作成
- ステータス更新
- 優先度管理

---

### Workflow（基本構造）

- Workflow 作成
- Stage / Task の基本管理
- ステータス可視化

---

### Approval（基本構造）

- 承認依頼
- Approve / Reject
- 承認履歴

---

### Secretary AI

- Task整理
- Planning 補助
- Workflow 開始
- ユーザーとの対話

Phase 1 で実装する **唯一の Agent**。

---

### LLM Router（基盤）

- Provider 接続（OpenAI / Anthropic）
- Model 選択
- Token 記録
- Cost 記録

---

### Memory（Phase 1 スコープ）

2層構造のみ実装する。

- Short Term Memory
- Project Memory

将来拡張: Global Knowledge, User Memory, Skill Memory, Client Memory

---

### Prompt / Skills

Phase 1 では Secretary AI 用の最小構成のみ。

- Prompt Template（Secretary 用）
- Skill は将来 Phase で本格導入

---

## Phase 1 で実装しない Agent

以下は Phase 2 以降で追加する。

- Project Manager AI
- Frontend AI
- Backend AI
- QA AI
- Sales AI
- Legal AI

---

## Phase 1 完了条件

- Dashboard が動作する
- プロジェクト・タスク管理ができる
- Secretary AI が Task 整理・Workflow 開始できる
- Workflow 基本構造が動作する
- 承認フローが動作する
- LLM Router が Token / Cost を記録する

---

# Phase 2

App Version:

```
v0.3.0
```

対象

実案件で毎日利用する。AI Workflow System を本格化する。

追加機能

- Workflow Engine 拡張
- Artifact 管理
- Memory 拡張（Global / User / Skill / Client）
- GitHub連携
- Figma連携
- Claude Code連携
- Cursor連携
- Vercel連携

AIエージェント追加

- Project Manager AI
- Frontend AI
- Backend AI
- QA AI
- Designer
- SEO
- Marketing

---

# Phase 3

チーム利用

追加機能

- ログイン
- 権限管理
- 通知
- コメント
- 複数ユーザー

---

# Phase 4

Marketplace

追加機能

- AI追加
- Skills追加
- Plugin追加

Marketplace対応

---

# Phase 5

SaaS

必要になった場合のみ実装する。

追加候補

- 課金
- 組織管理
- テナント管理
- 管理画面
- ライセンス

現時点では対象外。

---

# Priority

優先順位

P0

AI秘書

Dashboard

Workflow

Project

---

P1

AI Agents

Prompt

Skills

Memory

---

P2

GitHub

Figma

Claude Code

Cursor

---

P3

Marketplace

SaaS

---

# Out of Scope

以下は現在のフェーズでは実装しない。

- スマホアプリ
- SaaS機能
- 課金
- チーム管理
- Marketplace
- プラグイン配布

---

# Release Policy

Phaseが完了したらApp Versionを更新する。

例

v0.1.0

↓

v0.2.0

↓

v0.3.0

↓

v1.0.0

設計書は必要なドキュメントのみVersionを更新する。
