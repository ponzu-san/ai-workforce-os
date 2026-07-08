---
Document: API ARCHITECTURE
File: docs/13_API.md
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

# API Architecture

## Purpose

APIはPresentation LayerとApplication Layerを接続するインターフェースである。

APIはビジネスロジックを公開する唯一の入口とし、
Frontend・AI Agent・外部サービスが共通の契約で利用できるようにする。

Phase1ではREST APIを採用し、
将来的にServer Actions・gRPC・GraphQLへ拡張可能な設計とする。

---

# Design Principles

APIは以下を原則とする。

- Resource Oriented
- Stateless
- Versioned
- Idempotent
- Secure by Default
- Consistent Response
- OpenAPI Ready

---

# API Version

```
/api/v1/
```

破壊的変更はVersionを更新する。

例

```
/api/v2/
```

---

# API Categories

Phase1

- Projects
- Workflows
- Stages
- Tasks
- Agents
- Artifacts
- Approvals
- Notifications
- Memory
- Skills
- Prompts
- Events
- Settings
- Logs

---

# Standard Response

成功時

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "error": null
}
```

失敗時

```json
{
  "success": false,
  "data": null,
  "meta": {},
  "error": {
    "code": "",
    "message": ""
  }
}
```

全APIで統一する。

---

# HTTP Methods

利用する。

GET

POST

PUT

PATCH

DELETE（論理削除）

---

# Projects API

```
GET    /api/v1/projects

GET    /api/v1/projects/:id

POST   /api/v1/projects

PATCH  /api/v1/projects/:id

DELETE /api/v1/projects/:id
```

---

# Workflow API

```
GET    /workflows

POST   /workflows

PATCH  /workflows/:id

POST   /workflows/:id/start

POST   /workflows/:id/pause

POST   /workflows/:id/resume

POST   /workflows/:id/cancel
```

---

# Task API

```
GET    /tasks

POST   /tasks

PATCH  /tasks/:id

POST   /tasks/:id/start

POST   /tasks/:id/review

POST   /tasks/:id/approve

POST   /tasks/:id/retry

POST   /tasks/:id/archive
```

---

# Agent API

```
GET /agents

GET /agents/:id

POST /agents/:id/execute

POST /agents/:id/validate

GET /agents/:id/logs
```

---

# Artifact API

```
GET /artifacts

GET /artifacts/:id

POST /artifacts

PATCH /artifacts/:id

POST /artifacts/:id/version

POST /artifacts/:id/compare
```

---

# Approval API

```
GET /approvals

POST /approvals

POST /approvals/:id/approve

POST /approvals/:id/reject
```

---

# Notification API

```
GET /notifications

PATCH /notifications/:id/read

PATCH /notifications/:id/archive
```

---

# Memory API

```
GET /memory

POST /memory

PATCH /memory/:id

GET /memory/search
```

---

# Skill API

```
GET /skills

GET /skills/:id

POST /skills

PATCH /skills/:id

POST /skills/validate
```

---

# Prompt API

```
GET /prompts

POST /prompts/generate

POST /prompts/validate

GET /prompts/history
```

---

# Settings API

```
GET /settings

PATCH /settings
```

---

# Event API

```
GET /events

GET /events/:id
```

イベントは読み取り専用とする。

---

# Log API

```
GET /logs

GET /logs/system

GET /logs/agent

GET /logs/workflow
```

---

# Pagination

一覧APIは共通仕様を採用する。

```
?page=1

&pageSize=20

&sort=createdAt

&order=desc
```

---

# Filtering

例

```
?status=running

?priority=high

?agent=frontend

?workflow=design
```

---

# Search

全文検索

```
?q=react
```

---

# Streaming API

Streaming対応

- Chat
- Secretary
- Code Generation
- Long Document

Server Sent Eventsを採用する。

---

# File Upload

対象

- Markdown
- PDF
- PNG
- JPG
- ZIP

将来

Figma Import

OpenAPI Import

CSV Import

---

# Validation

API受信時

- Zod
- Type Validation
- Enum Validation
- Business Validation

Validation失敗時は400を返す。

---

# Status Codes

```
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error
```

---

# Error Format

```json
{
  "code": "TASK_NOT_FOUND",
  "message": "Task does not exist.",
  "details": {}
}
```

---

# Rate Limit

Phase1

無効

Phase2

User単位

API単位

Provider単位

---

# Authentication

Phase1

認証なし

Single User

Local Only

Phase2

JWT

OAuth

GitHub Login

Google Login

---

# Authorization

Phase1

不要

Phase2

RBAC

Role

Permission

Workspace

---

# OpenAPI

すべてのAPIはOpenAPI対応を前提とする。

Swagger生成可能な設計とする。

---

# Security

- HTTPS前提
- Input Validation
- Output Validation
- CSRF対策
- XSS対策
- SQL Injection対策

機密情報は返却しない。

---

# Future Extension

Phase2

- GraphQL
- gRPC
- WebSocket
- MCP API
- Plugin API
- Public API
- Webhook
- API Gateway

---

# Success Criteria

APIは一貫性・拡張性・保守性を持ち、

Presentation Layer・AI Layer・外部サービスが同じ契約で利用できる。

Cursorはこの仕様からAPI実装を直接開始できる。
