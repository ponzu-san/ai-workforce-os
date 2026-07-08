---
Document: GLOSSARY
File: docs/99_GLOSSARY.md
Version: 0.1.0
Status: Approved
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS (Temporary)

App Version: v0.1.0

Created: 2026-07-08
Last Updated: 2026-07-08
---

# Glossary

本ドキュメントは AI Workforce OS で使用する共通用語を定義する。

すべての設計書・実装・Cursor Rules・AI Agent・Prompt は本ドキュメントを基準とする。

---

# Agent

仕事を担当するAI。

Agentは人格ではなく「役割」である。

例

- Secretary
- Sales
- Project Manager
- Frontend Engineer
- Backend Engineer
- QA
- Legal

---

# Secretary

全体を管理するAI。

オーケストレーターとして

- Workflow管理
- Agent管理
- Router管理
- Task管理
- 承認管理

を担当する。

---

# Workflow

仕事の流れ。

Workflowは

Task

↓

Artifact

↓

承認

↓

次Agent

で構成される。

チャットではなくWorkflowが中心となる。

---

# Task

Agentへ依頼する最小単位の仕事。

例

- LPを実装する
- バナーを作成する
- コードレビューする

Taskには

- 担当Agent
- Status
- Priority
- Deadline

を持つ。

---

# Artifact

Workflowの成果物。

例

- 要件定義
- UI設計
- Figma
- ソースコード
- テスト結果
- レビュー結果

AI同士はチャットではなくArtifactを受け渡す。

---

# Prompt

LLMへ送信する命令。

PromptはMarkdownテンプレートとして管理する。

GUIから生成される。

ユーザーは可能な限り直接入力しない。

---

# Skill

Agentが参照する専門知識。

Markdownファイルで管理する。

例

- React
- Next.js
- TypeScript
- SEO
- QA
- Legal

---

# Memory

AIが利用する記憶。

## Phase 1（App v0.2.0）

2層構造を採用する。

```
Short Term Memory
Project Memory
```

## 将来拡張（Phase 2 以降）

```
Global Knowledge
User Memory
Skill Memory
Client Memory
```

> 旧4層定義（Global / Client / Project / Session）は将来拡張時に再マッピングする。

---

# Router

利用するLLMを選択する仕組み。

優先順位

1. Prompt Cache
2. 最安モデル
3. 高性能モデル

Routerはコスト最適化を目的とする。

---

# Context

LLMへ送信する情報。

Contextは必要最小限とする。

不要なチャット履歴は送らない。

---

# Approval

人による承認。

重要な処理はApprovalが必要。

例

- 契約
- 見積送信
- 本番公開

---

# Dashboard

最初に表示される画面。

現在の状況を一目で確認できる。

例

- 今日やること
- 承認待ち
- AI通知
- Workflow
- Project

---

# Project

仕事を管理する単位。

Projectは

- Client
- Workflow
- Task
- Artifact

を持つ。

---

# Client

顧客。

ClientごとにMemoryを保持する。

---

# Workspace

作業環境。

将来的に複数Workspaceへ対応する。

Phase1では単一Workspaceとする。

---

# Status

各オブジェクトの状態。

基本状態

- Draft
- In Progress
- Review
- Waiting Approval
- Completed
- Archived

---

# Priority

優先度。

以下を採用する。

- Critical
- High
- Medium
- Low

---

# Notification

AI秘書からユーザーへの通知。

例

- 承認依頼
- 作業開始可能
- レビュー依頼

---

# AI Workforce OS

本プロジェクトの製品名称。

AI社員と協働するためのOperating System。

チャットツールではなく、

Workflow Platformである。

---

# Project Maestro

本プロジェクトのコードネーム。

設計書・開発・Git管理で利用する。

販売名とは独立している。

---

# Definition Rule

本Glossaryは

AI Workforce OS における唯一の用語定義とする。

意味を変更する場合は

本ドキュメントを更新し、

Versionを変更すること。

他ドキュメントで独自定義をしてはならない。
