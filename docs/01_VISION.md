---
Document: VISION
File: docs/01_VISION.md
Version: 0.1.0
Status: Draft
Author: Masahiro Katayama

Project Code Name: Project Maestro
Repository: ai-workforce-os
Product Name: AI Workforce OS (Temporary)

App Version: v0.1.0

Created: 2026-07-08
Last Updated: 2026-07-08
---

# Vision

## Vision Statement

AI Workforce OS は、AIエージェントと協働し、一人でも制作会社以上の生産性を実現するための仕事環境を提供する。

本システムは AI チャットツールではなく、AI社員と共に仕事を進めるための Operating System である。

---

# Why

現在のAIツールには以下の課題がある。

- AIごとにチャットが分散する
- プロンプト管理が難しい
- ワークフローが存在しない
- 成果物の受け渡しが管理できない
- AI同士が連携できない
- 次に何をすれば良いか分からない

その結果、人がAIを管理することに時間を使ってしまう。

---

# Our Vision

AIが仕事を管理する。

人は意思決定だけを行う。

ユーザーは

「今やるべき仕事」

だけ分かれば良い。

AI秘書（オーケストレーター）が全体を管理し、各AIエージェントへ適切な仕事を割り振る。

---

# Product Vision

AI Workforce OS は

- AI社員
- Workflow
- Memory
- Skills
- Artifact

を統合した仕事環境を提供する。

チャットではなく、Workflowを中心としたUIを採用する。

---

# Design Principles

## GUI First

GUIを最優先とする。

チャット入力は補助機能である。

---

## Workflow First

プロンプトではなく、Workflowを設計する。

---

## AI First

AIへ最初に仕事を依頼する。

人はレビューと承認を担当する。

---

## Human Approval

重要な判断は必ず人が行う。

契約、支払い、本番公開などはAIが自動実行しない。

---

## Artifact Driven

AI同士はチャット履歴ではなく成果物を受け渡す。

成果物は必ず保存される。

---

## Context Optimization

LLMコストを削減するため

- Prompt Cache
- Router
- Skills
- Memory

を標準採用する。

---

## Long-term Memory

Phase 1（App v0.2.0）では2層から開始する。

- Short Term Memory（セッション単位）
- Project Memory（案件単位）

将来拡張:

- Global Knowledge
- User Memory
- Skill Memory
- Client Memory

---

# UX Principles

画面を開いた瞬間に状況が分かること。

次にやる仕事が明確であること。

プロンプトを書かなくても仕事が進められること。

AIが先回りして仕事を提案すること。

3クリック以内で主要な操作が完了すること。

---

# Non Goals

このシステムは以下を目的としない。

- AIチャットサービス
- GitHubの代替
- Figmaの代替
- Notionの代替
- Slackの代替
- ノーコード開発ツール

それらを連携・統合するOSを目指す。

---

# Success Metrics

Phase1では以下を成功条件とする。

- 毎日このアプリを起動して仕事を開始できる
- AI秘書が仕事を整理できる
- 受注から納品まで管理できる
- AIエージェントがWorkflowで連携できる
- GUIだけで主要操作が完結する

---

# Future Vision

将来的には

- AI Marketplace
- Plugin System
- SaaS化
- チーム開発
- 複数会社管理

へ拡張可能な設計とする。

現在はMVPの完成を最優先とする。
