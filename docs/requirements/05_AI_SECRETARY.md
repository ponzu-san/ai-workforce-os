---
Document: REQUIREMENT - AI SECRETARY
File: docs/requirements/05_AI_SECRETARY.md
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

# AI Secretary

## Purpose

AI SecretaryはAI Workforce OS全体を統括するオーケストレーターである。

ユーザーと各AI Agentの間に立ち、状況を分析し、最適なAgentへ仕事を割り振り、Workflow全体を管理する。

AI Workforce OSにおいて唯一の司令塔とする。

---

# Primary Goals

AI Secretaryは以下を実現する。

- Workflow管理
- Agent管理
- Task管理
- 承認管理
- 状況分析
- 次にやるべき仕事の提案
- リスク検知
- LLMコスト最適化
- ユーザー負荷の最小化

---

# Core Responsibilities

AI Secretaryは以下の責務を持つ。

- Project監視
- Workflow実行
- Task生成
- Agent選択
- Artifact確認
- Progress更新
- 通知送信
- Summary生成
- Router制御
- Memory利用
- Prompt生成

AI Secretary自身は専門作業を実施しない。

専門作業は各AI Agentへ委任する。

---

# Dashboard Role

DashboardではAI Secretary専用カードを表示する。

表示内容

- 現在の状況
- 優先順位
- 今日やるべきこと
- リスク
- 推奨アクション
- 承認待ち件数

Dashboardを開けばAI Secretaryの判断をすぐ確認できる。

---

# Daily Briefing

ログイン時に毎回実行する。

内容

Good Morning

↓

今日やること

↓

昨日からの変更

↓

進行中Workflow

↓

承認待ち

↓

注意事項

↓

おすすめアクション

文章は簡潔に要約する。

---

# Project Analysis

Project単位で分析する。

表示

Current Status

Completion Rate

Current Stage

Risk

Deadline

Missing Artifact

Blocked Task

AIは常に最新状態を維持する。

---

# Workflow Management

Workflow開始

Workflow停止

Workflow再開

Task生成

Task分割

Task統合

Agent割り当て

Status更新

すべてAI Secretaryが管理する。

---

# Task Management

Task作成時に以下を設定する。

Title

Objective

Acceptance Criteria

Priority

Deadline

Assigned Agent

Workflow

Stage

不足情報はAIが補完案を提示する。

---

# Agent Management

各Agentの状態を監視する。

Status

Idle

Working

Waiting

Blocked

Offline

Error

Agentが停止した場合は代替案を提案する。

---

# Router Management

AI Secretaryは直接LLMを選択しない。

Routerへ要求を送信する。

Routerが最適なモデルを返す。

---

# Memory Management

以下を参照する。

Global Memory

Client Memory

Project Memory

Session Memory

不要な情報はContextへ含めない。

---

# Prompt Management

PromptはGUIから自動生成する。

AI Secretaryが

Task

Workflow

Agent

Project

に応じてPromptを組み立てる。

ユーザーはPromptを書かないことを基本とする。

---

# Cost Optimization

AI SecretaryはLLMコストを常に最適化する。

優先順位

Prompt Cache

↓

Skills

↓

Memory

↓

Mini Model

↓

High Performance Model

不要なトークンは送信しない。

---

# Approval Management

承認が必要な場合

Workflow停止

↓

通知

↓

ユーザー承認

↓

Workflow再開

を実施する。

承認なしで重要処理を実行してはならない。

---

# Risk Detection

以下を常時監視する。

Deadline Risk

Blocked Workflow

Long Running Task

Missing Artifact

LLM Error

API Error

Review Missing

QA Missing

RiskはDashboardへ通知する。

---

# Recommendations

AI Secretaryは常に提案を行う。

例

- このTaskから開始してください
- Deadlineが近付いています
- Frontend Agentへ依頼してください
- QAを開始できます
- Promptを更新してください

提案には理由を表示する。

---

# Summary Generation

以下を要約する。

Project

Workflow

Task

Artifact

Meeting

Review

Summaryは短く分かりやすく生成する。

---

# Notification Management

通知対象

Task Assigned

Task Completed

Workflow Completed

Approval Required

Risk Detected

Deadline Warning

Agent Error

Deployment Completed

---

# User Commands

ユーザーは自然言語またはGUIから指示できる。

例

「LP案件を開始」

「QAを始めて」

「今何を優先すべき？」

「レビューを依頼」

「進捗を教えて」

AI Secretaryは適切なWorkflowへ変換する。

---

# Learning

AI Secretaryは以下を学習対象とする。

ユーザーの承認傾向

優先順位

よく使うWorkflow

Agent利用履歴

Project履歴

学習結果はMemoryへ保存する。

---

# Limitations

AI Secretaryは以下を実行してはならない。

契約締結

支払い

本番公開

Project削除

重要設定変更

これらは必ずユーザー承認を必要とする。

---

# Future Extension

Phase2以降

- スケジュール最適化
- AI同士の自動相談
- 工数予測
- 売上予測
- 顧客対応支援
- 音声秘書
- Slack連携
- Google Calendar連携
- Teams連携

Phase1では実装しない。

---

# Success Criteria

AI Secretaryが仕事全体を把握し、

ユーザーは

「何をすればいいか」

だけを判断すれば仕事が進む状態を実現する。

AI Secretaryは単なるチャットAIではなく、

AI Workforce OS全体を管理するオーケストレーターとして機能する。
