---
Document: PROJECT
File: docs/00-PROJECT.md
Version: 0.1.0
Status: Draft
Author: Masahiro Katayama
Created: 2026-07-08
Last Updated: 2026-07-08
---

# PROJECT

Project Name

AI Workforce OS（仮称）

---

# Mission

AIエージェントと協働し、一人でも制作会社以上の生産性を実現できる仕事環境を構築する。

---

# Vision

このシステムはAIチャットツールではない。

AI社員と共に仕事を進めるための「AI Workforce Operating System」である。

ユーザーはAIに質問するのではなく、仕事を依頼し、承認し、管理する。

AIは自律的に仕事を進め、人は重要な意思決定だけを行う。

---

# Goal

受注から納品までをAIエージェントが支援する。

最終目標は

**「一人で10人分の仕事ができる環境」**

を実現することである。

---

# Target User

## Phase1

自分だけ

## Phase2

デザイナーの友人

## Phase3

少人数制作チーム

## Phase4

SaaS化（将来的な選択肢）

---

# Philosophy

- シンプル
- 速い
- 迷わない
- AIが先回りする
- プロンプトを書かない
- GUI中心
- チャットは補助

---

# Core Concept

ユーザーは

**「今何をすれば良いか」**

だけ分かれば良い。

AI秘書（オーケストレーター）が、

- 現在の状況
- 次にやること
- 誰が担当か
- 止まっている理由

を管理する。

---

# Product Principles

## 1. GUI First

すべての操作はGUIから行える。

プロンプト入力は最小限にする。

---

## 2. AI First

まずAIに仕事を任せる。

人はレビューと承認を担当する。

---

## 3. Human Approval

重要な工程だけ人が判断する。

AIが勝手に契約・支払い・本番公開を行わない。

承認レベルは案件ごとに

- 手動
- 半自動
- 自動

を選択できる。

---

## 4. Context Optimization

LLMコストを最小化するため、

- Prompt Cache
- Router
- Skills
- Memory

を最大限活用する。

---

## 5. Artifact Driven

AI同士はチャット履歴を受け渡さない。

承認済みの成果物（Artifact）のみを受け渡す。

例

営業AI
↓

要件定義書
↓

PM
↓

タスク一覧
↓

開発AI
↓

コード
↓

QA

---

## 6. Human + AI

AIは人の代わりではない。

**AIは人の能力を最大化するパートナーである。**

人は意思決定・創造・最終責任を担い、

AIは分析・実装・レビュー・自動化を担当する。

---

# Long Term Vision

このシステムは制作会社向けツールでは終わらない。

将来的には

- 営業
- PM
- デザイン
- フロントエンド
- バックエンド
- QA
- 法務
- 経理
- マーケティング

など、あらゆるAI社員を管理できる

**AI Workforce Operating System**

へ進化する。

---

# Success Criteria

このプロジェクトで最も重要なのは

**「自分が毎日使いたくなること」**

である。

販売しやすいことより、

毎日使いたくなることを優先する。

その結果として、

他の人にも価値のあるプロダクトになることを目指す。
