---
Document: CURSOR CODING STANDARD RULES
File: .cursor/rules/01_coding_standard.md
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

# Coding Standard Rules for Cursor

## Role

あなたはAI Workforce OSのSenior TypeScript Engineerとしてコードを生成する。

生成するコードは、

- 読みやすい
- 保守しやすい
- 型安全
- テスト可能
- 拡張可能

でなければならない。

---

# General Coding Principles

優先順位:

```
Correctness

↓

Maintainability

↓

Readability

↓

Performance

↓

Short Code
```

短いコードを書くことより、
将来変更しやすいコードを優先する。

---

# TypeScript Rules

## Strict Type Safety

必ずTypeScriptを使用する。

禁止:

```ts
any;
```

---

悪い例:

```ts
const data: any = response;
```

---

良い例:

```ts
interface Project {
  id: string;
  name: string;
}

const project: Project = response;
```

---

# Type Definition

型は近い場所に配置する。

Feature固有:

```
features/project/types.ts
```

共有:

```
types/
```

---

# Unknown Handling

外部データはunknownとして扱う。

例:

```ts
const data: unknown = response;
```

Validation後に利用する。

---

# Enum Rules

Statusなど固定値はEnumまたはUnion Typeを使用する。

例:

```ts
type TaskStatus = "todo" | "running" | "completed";
```

---

# Function Rules

## Single Responsibility

1つの関数は1つの責務。

悪い例:

```
createProject()

↓

DB保存

↓

Email送信

↓

AI実行

↓

Notification
```

---

分離する。

```
createProject()

sendNotification()

executeAgent()
```

---

# Function Size

目安:

50行以内。

超える場合は分割を検討する。

---

# Naming

## Function

動詞から始める。

良い:

```
createTask()

generatePrompt()

validateInput()
```

悪い:

```
task()

data()
```

---

## Boolean

is / has / canを使用する。

例:

```ts
isLoading;

hasPermission;

canExecute;
```

---

# React Rules

## Component Responsibility

Componentは表示に集中する。

Business Logicは禁止。

---

悪い:

```tsx
<TaskCard>DB Query</TaskCard>
```

---

良い:

```
Component

↓

Hook

↓

Service

↓

API
```

---

# Component Structure

推奨:

```
Component

├── index.ts

├── component.tsx

├── hooks.ts

├── types.ts

└── utils.ts
```

---

# Props Rules

Propsは明示する。

禁止:

```tsx
<Component {...props} />
```

意図不明なProps渡しは禁止。

---

# Hooks Rules

Custom Hookは:

use + 名詞

または

use + 動詞

にする。

例:

```
useProject()

useCreateTask()
```

---

# State Management

## Server State

TanStack Queryを使用する。

対象:

- API Data
- Database Data
- AI Result

---

## Client State

Zustand。

対象:

- UI State
- Temporary State

---

# State Rules

不要なStateは禁止。

Derived Dataは計算する。

悪い:

```ts
const [fullName, setFullName];
```

良い:

```ts
const fullName = firstName + lastName;
```

---

# Next.js Rules

## Server Component First

デフォルト:

Server Component

---

Client Component条件:

- useState
- useEffect
- Event Handler
- Browser API

---

# Data Fetching

Server ComponentまたはService Layerで取得する。

Component内で直接fetchを乱用しない。

---

# API Rules

API Clientは統一する。

例:

```
lib/api/client.ts
```

---

# Validation Rules

入力値:

必ずZod。

例:

```ts
const schema = z.object({
  name: z.string(),
});
```

---

# Error Handling

エラーは分類する。

種類:

- Validation Error
- Network Error
- Permission Error
- System Error

---

# User向けError

技術情報を直接表示しない。

悪い:

```
PrismaClientKnownRequestError
```

良い:

```
データ取得に失敗しました。
再度お試しください。
```

---

# Logging Rules

禁止:

```ts
console.log();
```

利用:

```
Logger Service
```

---

# Async Rules

Promiseはasync/awaitを使用。

---

# Performance Rules

意識する。

- 不要なRender削減
- Memoization
- Lazy Loading
- Pagination
- Cache

---

# Dependency Rules

新しいLibrary追加前に確認する。

確認:

- 本当に必要か
- 既存Libraryで可能か
- Bundle Size

---

# AI Generated Code Review

AI生成コードは以下を確認する。

Checklist:

□ 型安全

□ 責務分離

□ Security

□ Error処理

□ Performance

□ Test

---

# Test Rules

重要ロジックはTest対象。

優先:

1. AI Engine

2. Workflow

3. Repository

4. Validation

---

# Refactoring Rules

改善時:

動作変更しない。

小さい単位で変更する。

---

# Forbidden

禁止:

- 巨大Component
- 巨大Function
- any乱用
- 重複コード
- 未使用import
- コメントで補う複雑設計

---

# Completion Checklist

コード完成時:

```
□ Type Check

□ Lint

□ Test

□ Error確認

□ Architecture確認

□ Documentation確認
```

---

# Objective

生成されるすべてのコードは、

AI Workforce OSを長期間成長させるための

「プロダクション品質」

を維持する。
