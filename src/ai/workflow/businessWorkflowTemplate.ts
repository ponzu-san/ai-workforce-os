/**
 * Phase 4 — Business Workflow テンプレート
 * Sales → Contract → Delivery
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
  name: "Business Workflow",
  description: "Sales → Contract → Delivery",
  stages: [
    {
      name: "Sales",
      order: 0,
      task: {
        title: "Draft proposal and estimate",
        description:
          "Create a client proposal, scope summary, and cost estimate.",
        priority: "high",
        agentRole: "sales",
      },
    },
    {
      name: "Contract",
      order: 1,
      task: {
        title: "Contract checklist and scope",
        description:
          "Review contract terms, scope boundaries, and risk checklist.",
        priority: "high",
        agentRole: "pm",
      },
    },
    {
      name: "Delivery",
      order: 2,
      task: {
        title: "Final review and delivery package",
        description:
          "Prepare delivery checklist, handover docs, and sign-off summary.",
        priority: "medium",
        agentRole: "qa",
      },
    },
  ] satisfies BusinessStageTemplate[],
} as const;

export const BUSINESS_STAGE_COUNT = BUSINESS_WORKFLOW.stages.length;
