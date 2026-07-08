---
Document: PROJECT README
File: README.md
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

# AI Workforce OS

## Personal AI Business Operating System

AI Workforce OSは、

「一人で10人分の仕事ができる環境」

を実現するためのAI業務管理プラットフォームである。

---

# Vision

人間がすべての作業を行う時代から、

```
Human

↓

Goal Setting

↓

AI Workforce

↓

Execution

↓

Human Approval

↓

Delivery
```

という働き方へ移行する。

---

# Project Information

## Code Name

```
Project Maestro
```

---

## Product Name

```
AI Workforce OS
```

---

## Current Version

Application:

```
v0.1.0
```

Documentation:

```
0.1.0
```

---

# Main Concept

AI Workforce OSは、

複数の専門AI Agentを管理し、

仕事を最後まで進めるためのOSである。

---

# AI Team Concept

将来的なAI Team:

```
Secretary AI

↓

Project Manager AI

↓

Designer AI

↓

Frontend AI

↓

Backend AI

↓

QA AI

↓

Legal AI

↓

Release AI
```

---

# Technology Stack

## Frontend

```
Next.js

TypeScript

Tailwind CSS

shadcn/ui
```

---

## Backend

```
Node.js

REST API
```

---

## Database

```
PostgreSQL

Prisma
```

---

## AI

```
OpenAI API

Anthropic API

Vercel AI SDK

LLM Router
```

---

# Project Structure

```
ai-workforce-os/

├── .cursor/

├── docs/

├── prisma/

├── public/

├── src/

└── README.md
```

---

# Development Start

## 1. Install

```
npm install
```

---

## 2. Environment Setup

Create:

```
.env
```

---

Example:

```
DATABASE_URL=

OPENAI_API_KEY=

ANTHROPIC_API_KEY=
```

---

# 3. Database Setup

ローカル開発用 PostgreSQL の用意方法は3つです。

| Option | 向いている環境 |
|---|---|
| A: Docker Compose | Docker 利用可・README どおりに再現したい |
| B: Homebrew | **Mac 個人開発（Docker なし）— おすすめ** |
| C: 既存 / クラウド DB | すでに PostgreSQL がある、または Neon 等を使う |

---

## Option A: Docker Compose

前提: [Docker Desktop](https://www.docker.com/products/docker-desktop/) がインストール済みであること。

```bash
cp .env.example .env
docker compose up -d
```

`.env` の `DATABASE_URL` は `.env.example` のままで問題ありません。

---

## Option B: Homebrew（Mac・Docker なし — おすすめ）

PostgreSQL を Mac に直接インストールします。個人開発では Docker より軽量で手早いです。

### B-1. PostgreSQL インストール・起動

```bash
brew install postgresql@16
brew services start postgresql@16
```

`psql` コマンドを使う場合（任意）:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Intel Mac の場合は `/opt/homebrew/` を `/usr/local/` に読み替えてください。

### B-2. データベース作成

```bash
createdb ai_workforce_os
```

### B-3. `.env` 設定

```bash
cp .env.example .env
```

`.env` の `DATABASE_URL` を Homebrew 用に変更します（OS ユーザー名・パスワードなし）:

```bash
DATABASE_URL="postgresql://$(whoami)@localhost:5432/ai_workforce_os?schema=public"
```

手動で書く場合の例（ユーザー名を自分の Mac ユーザー名に置き換え）:

```
DATABASE_URL="postgresql://masahiro.katayama@localhost:5432/ai_workforce_os?schema=public"
```

---

## Option C: 既存 PostgreSQL / クラウド（Neon 等）

すでに PostgreSQL がある、または [Neon](https://neon.tech) / [Supabase](https://supabase.com) 等の接続 URL がある場合:

```bash
cp .env.example .env
```

`.env` の `DATABASE_URL` にその接続文字列を設定してください。

---

## Migration と Seed（全 Option 共通）

PostgreSQL が起動していることを確認してから実行します。

初回セットアップ（リポジトリ clone 後）:

```bash
npx prisma migrate deploy
npx prisma db seed
```

スキーマを変更して新しい Migration を作る場合のみ:

```bash
npx prisma migrate dev --name your_migration_name
```

接続確認:

```bash
curl http://localhost:3000/api/health/db
```

成功例:

```json
{"success":true,"data":{"status":"ok","database":"connected","workspaceCount":1}}
```

---

# 4. Development Server

Run:

```bash
npm run dev
```

500 エラーや `Cannot read properties of undefined (reading 'call')` が出た場合は `.next` キャッシュ破損の可能性があります:

```bash
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000)

---

# 5. Validation

## Static checks

```bash
npm run type-check
npm run lint
npm run build
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/db
```

## AI-driven validation（QA Agent）

DB 接続・Agent Seed・Demo Project・LLM Router を自動チェックし、QA AI が Markdown レポートを生成します。

```bash
# 読み取り専用（DB 更新なし）
npm run validate

# Workflow 実行テストを含む（Demo Project で Execute Next Task を実行）
npm run validate -- --execute
```

UI からも実行可能: [http://localhost:3000/validation](http://localhost:3000/validation)

---

# Cursor Development Rules

Cursorを利用する場合:

最初に以下を読み込む。

```
.cursor/rules/
```

---

重要:

Cursorは勝手に大量実装しない。

必ず:

```
Understand

↓

Plan

↓

Confirm

↓

Implement

↓

Validate
```

の順番で進める。

---

# Development Documents

## Architecture

```
docs/architecture/
```

---

## Database

```
docs/database/
```

---

## API

```
docs/api/
```

---

## Project

```
docs/project/
```

---

# MVP Development

## Version Policy（ADR-001）

| Phase | App Version | 内容 |
|---|---|---|
| Phase 0 | v0.1.0 | Foundation（開発基盤） |
| Phase 1 | v0.2.0 | Personal AI Workspace MVP |

---

## Phase 0（v0.1.0）— Foundation

- Next.js / TypeScript / Tailwind / shadcn/ui セットアップ
- ディレクトリ構成 / Prisma / PostgreSQL
- 初期 Database Schema / 基本 Layout

---

## Phase 1（v0.2.0）— Personal AI Workspace MVP

実装:

## Dashboard

- Task表示
- Workflow状態
- AI Activity

## Project Management

- Project作成
- Status管理

## Task Management

- Task管理

## Workflow / Approval

- Workflow 基本構造
- Approval 基本構造

## Secretary AI（Phase 1 で唯一の Agent）

- Task整理
- Planning補助

## LLM Router

- Model選択
- Cost管理

## Memory（Phase 1）

- Short Term Memory
- Project Memory

---

# Version Rule

## Application Version

機能変更。

例:

```
v0.1.0

↓

v0.2.0
```

---

## Documentation Version

設計変更。

例:

```
0.1.0

↓

0.2.0
```

---

# Development Philosophy

禁止:

```
最初から完璧なシステムを作る
```

---

推奨:

```
Small Feature

↓

Use

↓

Improve

↓

Expand
```

---

# Quality Rules

必ず守る:

- TypeScript Strict
- Clean Code
- Security First
- Test Before Release
- Document Important Decisions

---

# AI Development Rules

AI利用時:

必ず考慮:

- Prompt Cache
- Token Optimization
- Model Routing
- Context Reduction
- Batch Processing

---

# Future Roadmap

## Phase1

Personal AI Workspace

---

## Phase2

AI Workflow System

---

## Phase3

AI Development Team

---

## Phase4

AI Business Workflow

---

## Phase5

AI Workforce OS

---

# Success Definition

AI Workforce OSの成功とは、

AIが人間の代わりに勝手に働くことではない。

---

人間が、

```
目的を決める

↓

AIに任せる

↓

確認する

↓

価値判断する
```

ことで、

一人でも大きな成果を出せる環境を作ることである。

---

# Final Goal

AI Workforce OSは、

個人の能力を拡張する

「Personal AI Business Operating System」

になる。
