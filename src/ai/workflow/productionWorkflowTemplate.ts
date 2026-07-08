/**
 * Unified Production Workflow — 11 Stage
 * 営業 → 契約 → 要件 → デザイン → FE → BE → 外部開発 → インフラ → QA → 法務 → 納品
 */

export const PRODUCTION_STAGE_NAMES = {
  SALES: "Sales",
  CONTRACT: "Contract",
  REQUIREMENT: "Requirement",
  DESIGN: "Design",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  EXTERNAL_DEV: "External Dev",
  INFRA: "Infra",
  QA: "QA",
  LEGAL: "Legal",
  RELEASE: "Release",
} as const;

export type ProductionStageName =
  (typeof PRODUCTION_STAGE_NAMES)[keyof typeof PRODUCTION_STAGE_NAMES];

export interface ProductionStageTemplate {
  name: ProductionStageName;
  order: number;
  task: {
    title: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    agentRole: string;
  };
}

export const PRODUCTION_WORKFLOW = {
  name: "制作ワークフロー",
  description: "営業 → 契約 → 要件 → デザイン → 開発 → QA → 法務 → 納品",
  stages: [
    {
      name: PRODUCTION_STAGE_NAMES.SALES,
      order: 0,
      task: {
        title: "提案書と見積もりを作成",
        description:
          "クライアント向け提案書、スコープ概要、コスト見積もりを作成する。",
        priority: "high",
        agentRole: "sales",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.CONTRACT,
      order: 1,
      task: {
        title: "契約チェックリストとスコープ確認",
        description:
          "契約条件、スコープ境界、リスクチェックリストをレビューする。",
        priority: "high",
        agentRole: "pm",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.REQUIREMENT,
      order: 2,
      task: {
        title: "要件を整理する",
        description:
          "プロジェクト目標、ユーザーストーリー、受け入れ基準をまとめる。",
        priority: "high",
        agentRole: "pm",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.DESIGN,
      order: 3,
      task: {
        title: "デザインを進める",
        description:
          "UI/UXデザイン、ワイヤーフレーム、デザインシステムを策定する。",
        priority: "high",
        agentRole: "designer",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.FRONTEND,
      order: 4,
      task: {
        title: "UIコンポーネントを実装",
        description:
          "デザインと要件に基づき React/Next.js コンポーネントを構築する。",
        priority: "medium",
        agentRole: "frontend",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.BACKEND,
      order: 5,
      task: {
        title: "APIとデータ層を実装",
        description:
          "APIルート、サービス、データベースロジックを設計・実装する。",
        priority: "medium",
        agentRole: "backend",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.EXTERNAL_DEV,
      order: 6,
      task: {
        title: "外部コーディング成果物の登録",
        description:
          "Cursor/IDE で実装後、GitHub URL・本番 URL・関連ファイルを登録する。",
        priority: "medium",
        agentRole: "frontend",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.INFRA,
      order: 7,
      task: {
        title: "インフラとデプロイ準備",
        description:
          "DNS、SSL、環境変数、デプロイチェックリストを整備する。",
        priority: "medium",
        agentRole: "release",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.QA,
      order: 8,
      task: {
        title: "レビューとテスト",
        description:
          "全成果物に対してQAチェックリストを実行し、問題を報告する。",
        priority: "medium",
        agentRole: "qa",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.LEGAL,
      order: 9,
      task: {
        title: "法務・コンプライアンス確認",
        description:
          "プライバシーポリシー、利用規約、Cookie、フォームの個人情報を確認する。",
        priority: "high",
        agentRole: "legal",
      },
    },
    {
      name: PRODUCTION_STAGE_NAMES.RELEASE,
      order: 10,
      task: {
        title: "最終レビューと納品パッケージ",
        description:
          "納品チェックリスト、引き継ぎ資料、サインオフ概要を準備する。",
        priority: "medium",
        agentRole: "release",
      },
    },
  ] satisfies ProductionStageTemplate[],
} as const;

export const PRODUCTION_STAGE_COUNT = PRODUCTION_WORKFLOW.stages.length;
