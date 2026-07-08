---
Document: REQUIREMENT - AI AGENTS
File: docs/requirements/06_AI_AGENTS.md
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

# AI Agents

## Purpose

AI Agentは特定の専門分野を担当する実行エンジンである。

AI SecretaryからTaskを受け取り、
成果物（Artifact）を作成し、
レビューを実施し、
次のAgentへ引き継ぐ。

AI Agent同士が直接判断してWorkflowを変更してはならない。

Workflowの制御権限はAI Secretaryのみが持つ。

---

# Design Principles

AI Agentは以下の原則に従う。

- 1Agent = 1専門分野
- 単一責任
- Stateless
- Artifact Driven
- Workflow Driven
- Self Review First
- Human Approval Required

---

# Common Lifecycle

すべてのAgentは同じ流れで動作する。

Task受信

↓

Requirement確認

↓

Memory取得

↓

Skill取得

↓

Prompt生成

↓

LLM実行

↓

Self Review

↓

Artifact生成

↓

Secretaryへ提出

↓

待機

---

# Common Input

Agentが受け取る情報

- Project
- Workflow
- Stage
- Task
- Objective
- Acceptance Criteria
- Related Artifacts
- Skills
- Memory
- Prompt Template

---

# Common Output

Agentは最低1つ以上のArtifactを生成する。

例

- Markdown
- Source Code
- Image
- Figma URL
- Review Report
- QA Report
- Contract
- API Specification

---

# Common Status

Idle

Ready

Working

Reviewing

Waiting Approval

Completed

Blocked

Error

Offline

---

# Secretary

役割

Workflow全体の管理

責務

- Workflow管理
- Agent管理
- Prompt生成
- Router制御
- Task生成
- Summary生成
- 通知

成果物

- Workflow
- Summary
- Recommendation

---

# Sales Agent

役割

営業支援

責務

- 提案書作成
- 見積作成
- 案件整理
- ヒアリング内容整理

成果物

- Proposal
- Estimate
- Meeting Summary

---

# Project Manager Agent

役割

プロジェクト管理

責務

- Task分割
- 工数見積
- リスク分析
- スケジュール管理

成果物

- Schedule
- Task List
- Risk Report

---

# Designer Agent

役割

UI/UX設計

責務

- Wireframe
- UI Design
- Component設計
- Design Review

成果物

- Figma
- Design System
- UI Specification

---

# Frontend Engineer Agent

役割

フロントエンド開発

責務

- React実装
- Next.js実装
- TypeScript実装
- UI実装
- レスポンシブ対応

成果物

- Source Code
- Component
- Storybook（将来）

---

# Backend Engineer Agent

役割

バックエンド開発

責務

- API実装
- Database
- Authentication
- Business Logic

成果物

- Source Code
- API
- Database Migration

---

# QA Agent

役割

品質保証

責務

- Test実施
- Requirement確認
- バグ報告
- 回帰確認

成果物

- QA Report
- Bug Report
- Test Result

---

# Legal Agent

役割

法務確認

責務

- 契約確認
- 利用規約確認
- プライバシーポリシー確認
- ライセンス確認

成果物

- Legal Report
- Compliance Report

---

# Marketing Agent

役割

マーケティング支援

責務

- SEO
- LP改善
- SNS文章作成
- コンテンツ提案

成果物

- SEO Report
- Article
- Marketing Plan

---

# Finance Agent

役割

会計・財務支援

責務

- 売上集計
- 利益分析
- コスト分析
- 請求書作成

成果物

- Invoice
- Cost Report
- Sales Report

---

# Operations Agent

役割

運用管理

責務

- Deploy管理
- Monitoring
- Backup
- Incident対応

成果物

- Deploy Report
- Incident Report

---

# Self Review

すべてのAgentは提出前に自己レビューを行う。

確認項目

- Requirement準拠
- Skill準拠
- Prompt準拠
- エラー確認
- 完了条件確認

Self Reviewを通過しない成果物は提出しない。

---

# Communication Rules

Agent同士は直接チャットしない。

成果物（Artifact）のみ受け渡す。

すべての連携はAI Secretaryを経由する。

---

# Retry Policy

エラー発生時

1回目

Self Retry

↓

2回目

Prompt修正

↓

3回目

Secretaryへ報告

↓

Human Approval

---

# Performance Policy

Agentは

- 必要最小限のContext
- 必要なSkillのみ
- 必要なMemoryのみ

を読み込む。

長いチャット履歴は使用しない。

---

# Security Policy

Agentは禁止事項を持つ。

禁止

- 本番公開
- 契約締結
- 支払い
- Repository削除
- Database削除
- 設定変更

必ずユーザー承認を必要とする。

---

# Future Extension

Phase2

- DevOps Agent
- Security Agent
- Data Analyst Agent
- Customer Support Agent
- Recruiter Agent
- HR Agent
- AI Agent Builder

Phase1では実装しない。

---

# Success Criteria

すべてのAgentが単一責任を守り、

Workflowに従って自律的に作業を進め、

成果物をAI Secretaryへ提出し、

ユーザーは承認と意思決定だけを行えばプロジェクトが進行する状態を実現する。
