/**
 * Phase 3 — AI Development Team の標準 Workflow テンプレート
 * Requirement → Design → Frontend → Backend → QA
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
  name: "Development Team Workflow",
  description: "Requirement → Design → Frontend → Backend → QA",
  stages: [
    {
      name: "Requirement",
      order: 0,
      task: {
        title: "Define requirements",
        description:
          "Summarize project goals, user stories, and acceptance criteria.",
        priority: "high",
        agentRole: "pm",
      },
    },
    {
      name: "Design",
      order: 1,
      task: {
        title: "Create UI/UX design proposal",
        description:
          "Propose wireframes, layout, and design system based on requirements.",
        priority: "high",
        agentRole: "designer",
      },
    },
    {
      name: "Frontend",
      order: 2,
      task: {
        title: "Implement UI components",
        description:
          "Build React/Next.js components based on design and requirements.",
        priority: "medium",
        agentRole: "frontend",
      },
    },
    {
      name: "Backend",
      order: 3,
      task: {
        title: "Implement API and data layer",
        description:
          "Design and implement API routes, services, and database logic.",
        priority: "medium",
        agentRole: "backend",
      },
    },
    {
      name: "QA",
      order: 4,
      task: {
        title: "Review and test",
        description:
          "Run QA checklist against all deliverables and report issues.",
        priority: "medium",
        agentRole: "qa",
      },
    },
  ] satisfies DevTeamStageTemplate[],
} as const;

export const DEV_TEAM_STAGE_COUNT = DEV_TEAM_WORKFLOW.stages.length;
