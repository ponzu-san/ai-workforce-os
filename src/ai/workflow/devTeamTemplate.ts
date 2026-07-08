/**
 * @deprecated Use productionWorkflowTemplate.ts — kept for reference only.
 * 要件定義 → デザイン → フロントエンド → バックエンド → 品質保証
 */

export interface DevTeamStageTemplate {
  name: string;
  order: number;
  task: {
    title: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    agentRole: string;
  };
}

export const DEV_TEAM_WORKFLOW = {
  name: "開発チームワークフロー",
  description: "要件定義 → デザイン → フロントエンド → バックエンド → 品質保証",
  stages: [
    {
      name: "要件定義",
      order: 0,
      task: {
        title: "要件を整理する",
        description:
          "プロジェクト目標、ユーザーストーリー、受け入れ基準をまとめる。",
        priority: "high",
        agentRole: "pm",
      },
    },
    {
      name: "デザイン",
      order: 1,
      task: {
        title: "UI/UXデザイン案を作成",
        description:
          "要件に基づきワイヤーフレーム、レイアウト、デザインシステムを提案する。",
        priority: "high",
        agentRole: "designer",
      },
    },
    {
      name: "フロントエンド",
      order: 2,
      task: {
        title: "UIコンポーネントを実装",
        description:
          "デザインと要件に基づき React/Next.js コンポーネントを構築する。",
        priority: "medium",
        agentRole: "frontend",
      },
    },
    {
      name: "バックエンド",
      order: 3,
      task: {
        title: "APIとデータ層を実装",
        description:
          "APIルート、サービス、データベースロジックを設計・実装する。",
        priority: "medium",
        agentRole: "backend",
      },
    },
    {
      name: "品質保証",
      order: 4,
      task: {
        title: "レビューとテスト",
        description:
          "全成果物に対してQAチェックリストを実行し、問題を報告する。",
        priority: "medium",
        agentRole: "qa",
      },
    },
  ] satisfies DevTeamStageTemplate[],
} as const;

export const DEV_TEAM_STAGE_COUNT = DEV_TEAM_WORKFLOW.stages.length;
