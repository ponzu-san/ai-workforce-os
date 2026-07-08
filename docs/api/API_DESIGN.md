---
Document: API DESIGN DOCUMENT
File: docs/api/API_DESIGN.md
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

# AI Workforce OS API Design

## 1. Purpose

このドキュメントはAI Workforce OS内部API設計を定義する。

目的:

- FrontendとBackendの責務分離
- AI Agent連携
- Workflow制御
- 将来的な外部連携

を可能にする。

---

# 2. API Philosophy

基本方針:

```
Simple

↓

Predictable

↓

Extensible
```

---

# 3. API Architecture

構成:

```
Frontend

↓

API Layer

↓

Application Service

↓

Database / AI Layer
```

---

# 4. API Style

Phase1:

```
REST API
```

---

理由:

- 実装容易
- Debug容易
- AI Agent連携容易

---

# 5. Endpoint Structure

Base:

```
/api
```

---

例:

```
/api/projects

/api/tasks

/api/workflows

/api/agents
```

---

# 6. Project API

## Create Project

```
POST

/api/projects
```

Request:

```json
{
  "name": "",
  "description": ""
}
```

Response:

```json
{
  "id": "",
  "status": "created"
}
```

---

## Get Projects

```
GET

/api/projects
```

---

## Get Project Detail

```
GET

/api/projects/{id}
```

---

# 7. Task API

## Create Task

```
POST

/api/tasks
```

---

Request:

```json
{
  "title": "",
  "description": "",
  "priority": "high"
}
```

---

## Update Task

```
PATCH

/api/tasks/{id}
```

---

# 8. Workflow API

## Create Workflow

```
POST

/api/workflows
```

---

Request:

```json
{
  "projectId": "",
  "goal": ""
}
```

---

## Start Workflow

```
POST

/api/workflows/{id}/start
```

---

処理:

```
Workflow

↓

Orchestrator

↓

Agent Assignment
```

---

## Workflow Status

```
GET

/api/workflows/{id}
```

---

Response:

```json
{
  "status": "running",
  "currentStage": "development"
}
```

---

# 9. Agent API

## List Agents

```
GET

/api/agents
```

---

Response:

```json
[
  {
    "name": "Secretary AI",
    "status": "active"
  }
]
```

---

## Execute Agent

```
POST

/api/agents/{id}/execute
```

---

Request:

```json
{
  "taskId": "",
  "context": ""
}
```

---

# 10. LLM Router API

## Generate Request

```
POST

/api/llm/generate
```

---

Request:

```json
{
  "agent": "",
  "task": "",
  "priority": "normal"
}
```

---

内部処理:

```
Request

↓

Cost Check

↓

Model Selection

↓

Provider Call
```

---

# 11. Memory API

## Search Memory

```
POST

/api/memory/search
```

---

Request:

```json
{
  "query": ""
}
```

---

Response:

```json
[
  {
    "content": "",
    "score": 0.9
  }
]
```

---

## Save Memory

```
POST

/api/memory
```

---

# 12. Approval API

## Create Approval

```
POST

/api/approvals
```

---

## Approve

```
POST

/api/approvals/{id}/approve
```

---

## Reject

```
POST

/api/approvals/{id}/reject
```

---

# 13. Artifact API

## Create Artifact

```
POST

/api/artifacts
```

---

## Get Artifact

```
GET

/api/artifacts/{id}
```

---

# 14. Execution Log API

## Get AI Activity

```
GET

/api/executions
```

---

用途:

Dashboard表示。

---

# 15. Error Response

共通形式:

```json
{
  "success": false,
  "error": {
    "code": "",
    "message": ""
  }
}
```

---

# 16. Validation Rules

すべてのAPIで:

- Input Validation
- Permission Check
- Error Handling

を実施。

---

# 17. Authentication

Phase1:

Local Only。

---

将来:

```
Auth.js

↓

OAuth

↓

Multi User
```

---

# 18. Authorization

将来対応:

Role Based Access Control。

例:

```
Owner

Admin

Member

Viewer
```

---

# 19. Streaming API

AI Chatでは対応予定。

方式:

```
Server Sent Events

(SSE)
```

---

用途:

- AI回答表示
- Agent Progress表示

---

# 20. Webhook Future

将来:

外部イベント連携。

例:

```
GitHub

Slack

Email
```

---

# 21. API Versioning

将来:

```
/api/v1
```

形式へ対応。

---

# 22. API Security

禁止:

- Secret Exposure
- Unsafe Input Execution
- Unvalidated AI Output

---

# 23. API Monitoring

記録:

```
Request

Response Time

Error

Cost
```

---

# Success Criteria

API Layerは、

Frontend・AI Agent・Databaseを安全につなぐ中核レイヤーとして機能する。
