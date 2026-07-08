---
Document: REQUIREMENT - SETTINGS
File: docs/requirements/10_SETTINGS.md
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

# Settings

## Purpose

SettingsはAI Workforce OS全体の設定を管理する画面である。

ユーザー、AI、LLM、Workflow、通知などの設定を一元管理し、
アプリ全体の動作を制御する。

設定はProject単位ではなくWorkspace全体へ適用される。

---

# Primary Goals

Settingsは以下を実現する。

- システム設定を一元管理する
- AIの動作を変更する
- LLM利用コストを最適化する
- API接続を管理する
- ユーザー体験を最適化する

---

# Layout

左メニュー

↓

設定カテゴリ

↓

設定内容

↓

保存ボタン

---

# Categories

以下のカテゴリを持つ。

General

AI

LLM

Router

Workflow

Approval

Notification

Memory

Skills

Prompts

API

Storage

Appearance

Advanced

About

---

# General

管理項目

Workspace Name

Language

Timezone

Date Format

Theme

Auto Save

Application Version

---

# AI

設定

AI Secretary ON/OFF

Agent Auto Start

Self Review ON/OFF

Automatic Retry

Automatic Summary

Automatic Task Generation

Maximum Concurrent Agents

---

# LLM

管理項目

Default Provider

Default Model

Fallback Model

Temperature

Max Output Tokens

Reasoning Level

Streaming

---

# Router

設定

Auto Routing

Cost Optimization

Performance Priority

Balanced Mode

Prompt Cache

Batch Processing

Preferred Provider

Preferred Model

---

# Workflow

設定

Default Workflow

Auto Continue

Auto Pause

Auto Create Tasks

Auto Generate Artifacts

Parallel Execution

Approval Level

---

# Approval

設定

Default Approval Level

Auto Approval

Approval Timeout

Approval Reminder

Require Comment On Reject

Critical Approval Lock

---

# Notification

設定

Desktop Notification

Sound

Reminder

Daily Summary

Risk Notification

Agent Completion Notification

Workflow Completion Notification

---

# Memory

設定

Global Memory

Project Memory

Client Memory

Session Memory

Memory Size

Memory Cleanup

Memory Retention Period

---

# Skills

設定

Skill Directory

Auto Reload

Skill Validation

Skill Version Check

---

# Prompts

設定

Prompt Directory

Prompt Version

Prompt Cache

Prompt Validation

Auto Generate Prompt

---

# API

管理項目

OpenAI

Anthropic

GitHub

Figma

Vercel

Linear

Notion

Google Drive

API Keyは暗号化して保存する。

画面上ではマスク表示する。

---

# Storage

設定

Local Storage

Database

Backup Directory

Export Directory

Artifact Directory

Auto Backup

Backup Interval

---

# Appearance

設定

Theme

Accent Color

Sidebar Width

Compact Mode

Animation

Font Size

Language

---

# Advanced

設定

Debug Mode

Developer Mode

Log Level

Experimental Features

Reset Cache

Clear Memory

Rebuild Index

---

# About

表示

App Version

Document Version

Build Number

Database Version

License

Repository

Support

---

# User Actions

ユーザーは以下を実行できる。

変更

保存

リセット

バックアップ

インポート

エクスポート

接続テスト

---

# AI Responsibilities

AI Secretaryは設定変更時に

影響範囲を分析する。

危険な変更は警告を表示する。

---

# Validation

設定保存前に検証する。

例

API Key

Model

Directory

Version

Router

Memory

異常があれば保存しない。

---

# Backup

設定はJSON形式でエクスポートできる。

将来

Workspace単位のバックアップへ対応する。

---

# Security

以下は再認証を要求する。

API Key変更

Repository変更

Database変更

Storage変更

Critical Approval変更

---

# Future Extension

Phase2

複数Workspace

クラウド同期

チーム設定

ロール管理

SSO

組織管理

Marketplace

Plugin管理

Remote Config

---

# Success Criteria

Settingsだけで

- AIの動作
- LLMの利用方法
- Workflowの挙動
- 通知
- API
- 保存先
- セキュリティ

をすべて管理できる。

設定変更後は即時反映され、
AI Secretaryが影響範囲を通知する。
