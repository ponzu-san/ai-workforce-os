---
Document: REQUIREMENTS OVERVIEW
File: docs/requirements/00_OVERVIEW.md
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

# Requirements Overview

## Purpose

本ドキュメントは AI Workforce OS の機能要件を定義する。

すべての実装は、本ドキュメントおよび各機能要件書を唯一の仕様として実装する。

仕様と実装が異なる場合は、仕様を正とする。

---

# Requirement Structure

requirements/

- 00_OVERVIEW.md
- 01_DASHBOARD.md
- 02_PROJECT.md
- 03_WORKFLOW.md
- 04_TASK.md
- 05_AI_SECRETARY.md
- 06_AI_AGENTS.md
- 07_APPROVAL.md
- 08_ARTIFACT.md
- 09_NOTIFICATION.md
- 10_SETTINGS.md

---

# MVP Scope

> **ADR-001**: Phase 0 = App v0.1.0（Foundation）/ Phase 1 = App v0.2.0（MVP）

## Phase 0（App v0.1.0）— Foundation

開発基盤のみ。機能要件は Phase 1 以降。

---

## Phase 1（App v0.2.0）— 実装対象

- Dashboard
- Project
- Workflow（基本構造）
- Task
- AI Secretary（唯一の Agent）
- Approval（基本構造）
- LLM Router（基盤）
- Memory（Short Term + Project の2層）
- Artifact（基本）
- Notification
- Settings

Phase 1 以外は実装しない。

---

# Requirement Priority

## P0

プロダクトとして成立するために必須。

- Dashboard
- Project
- Workflow
- Task
- AI Secretary

---

## P1

運用効率向上。

- Approval
- Artifact
- LLM Router
- Memory（Short Term + Project）

---

## P2（Phase 2 以降）

- AI Agents（Secretary 以外）
- Notification
- Settings

---

# Functional Requirements

各Requirementには以下を定義する。

- Purpose
- Responsibilities
- UI
- Data
- Workflow
- User Actions
- AI Actions
- Validation
- Future Extension

---

# Design Rules

すべてのRequirementは以下に従う。

GUI First

Workflow First

AI First

Human Approval

Artifact Driven

---

# AI Responsibilities

AIは

- 提案
- 分析
- 実装
- レビュー
- 通知

を担当する。

ユーザーは

- 判断
- 承認
- 修正

を担当する。

---

# Human Responsibilities

ユーザーのみ実施できる操作。

- 契約承認
- 見積承認
- 本番公開
- 削除
- AI設定変更

---

# Non Functional Requirements

本システムは以下を満たす。

- 高速
- 保守しやすい
- AIが理解しやすい
- トークン効率が良い
- 拡張しやすい

---

# Development Policy

Requirementsは必ず先に完成させる。

ArchitectureはRequirementsを元に設計する。

DatabaseはRequirementsを元に設計する。

APIはRequirementsを元に設計する。

実装はRequirements完成後に開始する。

---

# Completion Criteria

Requirementsが完成した状態とは、

すべての画面・機能・AIの振る舞いが定義され、

Cursorが質問せず実装できる状態を指す。
