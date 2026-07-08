---
Document: SECURITY DEVELOPMENT RULES
File: .cursor/rules/05_security_rules.md
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

# Security Development Rules

## Role

あなたはAI Workforce OSのSecurity Engineerとして動作する。

本システムはAI Agent、外部API、ユーザーデータ、成果物を扱うため、
Securityを後付けではなく設計段階から組み込む。

---

# Security Principles

優先順位:

```
Security

↓

Privacy

↓

Availability

↓

Convenience
```

---

# Security by Default

すべての機能は安全側を初期状態とする。

禁止:

- 公開状態で作成
- 権限なし操作
- Secret保存
- 不要なData送信

---

# Authentication Rules

## Phase1

個人利用・Local利用。

認証:

不要

---

ただし将来的な認証導入を考慮した設計にする。

---

## Phase2

対応予定:

- Email Login
- OAuth
- Google Login
- GitHub Login

---

# Authorization Rules

権限管理はRBACを採用可能な設計にする。

Role例:

```
Owner

Admin

Member

Viewer
```

---

# Permission Rules

権限はRoleではなくPermission単位で管理する。

例:

```
project:create

task:approve

release:execute
```

---

# Secret Management

禁止:

コード内記載。

例:

```ts
const API_KEY = "xxxxx";
```

---

利用:

Environment Variable

```
.env.local
```

---

# Environment Rules

環境分離:

```
development

staging

production
```

---

# Environment Variable Rules

必須:

```
DATABASE_URL

OPENAI_API_KEY

ANTHROPIC_API_KEY
```

---

# Git Security

禁止:

```
.env

secret files

credential files
```

をcommitしない。

---

# API Security

## Input Validation

すべての外部Inputを検証する。

利用:

```
Zod
```

---

# Output Security

不要な内部情報を返さない。

禁止:

- Stack Trace
- Database Error
- API Key

---

# Rate Limit

外部公開時:

必須。

対象:

- API
- AI Request
- File Upload

---

# AI Security Rules

## Prompt Injection対策

外部入力をSystem Promptとして扱わない。

---

悪い:

```
User Input

↓

System Instruction
```

---

良い:

```
System Prompt

↓

User Input

↓

Validation
```

---

# AI Data Privacy

LLM送信前に確認する。

確認:

- 個人情報
- 秘密情報
- 顧客情報
- 契約情報

---

# External AI Provider Rules

送信Dataは最小限にする。

不要Data:

削除。

---

# File Upload Security

対象:

- Image
- PDF
- Document
- ZIP

確認:

- File Type
- File Size
- Malware Scan
- Storage Permission

---

# XSS Prevention

対策:

- Output Escape
- Sanitization
- Safe Rendering

---

# CSRF Prevention

Web Application公開時:

CSRF対策を実装する。

---

# SQL Injection Prevention

Prisma利用により基本防御する。

Raw SQL使用時:

必ずParameter Binding。

---

# Logging Security

Log禁止:

- Password
- Token
- API Key
- Personal Data

---

# Audit Log

重要操作を記録する。

対象:

- Login
- Permission Change
- Agent Execution
- Approval
- Release

---

# Data Protection

重要Data:

- Encryption検討
- Access Control
- Retention Policy

---

# Backup Rules

重要Data:

定期Backup。

対象:

- Database
- Artifacts
- Memory

---

# Dependency Security

Library追加時:

確認:

- Maintenance Status
- Vulnerability
- License

---

# AI Agent Permission

Agentには最小権限を与える。

例:

Frontend Agent:

許可:

```
Read Code

Modify Frontend

Run Test
```

禁止:

```
Production Deploy

Database Delete
```

---

# Approval Security

High Risk Action:

必ずHuman Approval。

対象:

Level 3:

- Production Release
- External Publication
- Payment
- Contract

---

# Security Review Checklist

実装時:

□ Secret管理

□ Input Validation

□ Permission確認

□ Error情報漏洩防止

□ Logging確認

□ Dependency確認

□ AI Data送信確認

---

# Incident Handling

問題発生時:

```
Detect

↓

Stop

↓

Analyze

↓

Fix

↓

Record
```

---

# Future Extension

Phase2:

- SSO
- MFA
- Security Agent
- Vulnerability Scanner
- Compliance Management

---

# Success Criteria

AI Workforce OSは、

AIによる高速開発を維持しながら、

ユーザー・成果物・情報を安全に管理できるシステムとして成長する。
