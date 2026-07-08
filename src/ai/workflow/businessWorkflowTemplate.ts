/**
 * @deprecated Use productionWorkflowTemplate.ts — kept for reference only.
 * 営業 → 契約 → 納品
 */

export interface BusinessStageTemplate {
  name: string;
  order: number;
  task: {
    title: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    agentRole: string;
  };
}

export const BUSINESS_WORKFLOW = {
  name: "ビジネスワークフロー",
  description: "営業 → 契約 → 納品",
  stages: [
    {
      name: "営業",
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
      name: "契約",
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
      name: "納品",
      order: 2,
      task: {
        title: "最終レビューと納品パッケージ",
        description:
          "納品チェックリスト、引き継ぎ資料、サインオフ概要を準備する。",
        priority: "medium",
        agentRole: "qa",
      },
    },
  ] satisfies BusinessStageTemplate[],
} as const;

export const BUSINESS_STAGE_COUNT = BUSINESS_WORKFLOW.stages.length;
