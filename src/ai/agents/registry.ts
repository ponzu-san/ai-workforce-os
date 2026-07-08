import type { TaskKind } from "@/ai/router/types";
import { SECRETARY_SYSTEM_PROMPT } from "@/ai/agents/secretary/prompt";

export interface AgentDefinition {
  role: string;
  taskKind: TaskKind;
  systemPrompt: string;
  artifactType: string;
}

const PM_PROMPT = `You are Project Manager AI.
Analyze requirements, create plans, and write clear specifications.
Output structured markdown with: Summary, Requirements, Acceptance Criteria, Risks.
Respond in Japanese unless user writes in another language.`;

const DESIGNER_PROMPT = `You are Designer AI specializing in UI/UX.
Create design proposals, wireframe descriptions, and design system guidelines.
Output markdown with: Design Goals, Layout, Components, Color/Typography, Notes.
Respond in Japanese unless user writes in another language.`;

const FRONTEND_PROMPT = `You are Frontend AI specializing in React and Next.js.
Produce implementation plans, component structures, and code snippets.
Use prior design and requirement artifacts when provided.
Output markdown with: Approach, Components, Code blocks, Notes.
Respond in Japanese unless user writes in another language.`;

const BACKEND_PROMPT = `You are Backend AI specializing in API design and databases.
Design REST/API routes, services, repositories, and Prisma schema changes.
Use prior requirement and frontend artifacts when provided.
Output markdown with: API Design, Data Model, Implementation Plan, Code blocks.
Respond in Japanese unless user writes in another language.`;

const QA_PROMPT = `You are QA AI.
Review all prior deliverables (requirements, design, frontend, backend).
Create test checklists and identify bugs or gaps.
Output markdown with: Test Plan, Issues Found, Recommendations, Pass/Fail suggestion.
Respond in Japanese unless user writes in another language.`;

const SALES_PROMPT = `You are Sales AI.
Draft proposals, estimates, and client-facing documents.
Use client context and prior communications when provided.
Output markdown with: Executive Summary, Scope, Estimate, Timeline, Next Steps.
Respond in Japanese unless user writes in another language.`;

const LEGAL_PROMPT = `You are Legal AI.
Review privacy, contracts, and compliance risks.
Output markdown with: Risk Summary, Compliance Checklist, Recommendations.
Respond in Japanese unless user writes in another language.`;

const RELEASE_PROMPT = `You are Release AI.
Prepare release notes, deployment checklists, and handover documentation.
Output markdown with: Release Summary, Checklist, Rollback Plan, Sign-off.
Respond in Japanese unless user writes in another language.`;

export const agentRegistry: Record<string, AgentDefinition> = {
  secretary: {
    role: "secretary",
    taskKind: "secretary",
    systemPrompt: SECRETARY_SYSTEM_PROMPT,
    artifactType: "document",
  },
  pm: {
    role: "pm",
    taskKind: "planning",
    systemPrompt: PM_PROMPT,
    artifactType: "specification",
  },
  designer: {
    role: "designer",
    taskKind: "planning",
    systemPrompt: DESIGNER_PROMPT,
    artifactType: "design",
  },
  frontend: {
    role: "frontend",
    taskKind: "coding",
    systemPrompt: FRONTEND_PROMPT,
    artifactType: "code",
  },
  backend: {
    role: "backend",
    taskKind: "architecture",
    systemPrompt: BACKEND_PROMPT,
    artifactType: "code",
  },
  qa: {
    role: "qa",
    taskKind: "documentation",
    systemPrompt: QA_PROMPT,
    artifactType: "report",
  },
  sales: {
    role: "sales",
    taskKind: "planning",
    systemPrompt: SALES_PROMPT,
    artifactType: "proposal",
  },
  legal: {
    role: "legal",
    taskKind: "documentation",
    systemPrompt: LEGAL_PROMPT,
    artifactType: "report",
  },
  release: {
    role: "release",
    taskKind: "documentation",
    systemPrompt: RELEASE_PROMPT,
    artifactType: "document",
  },
};

export function getAgentDefinition(role: string): AgentDefinition {
  return agentRegistry[role] ?? agentRegistry.secretary;
}

export function suggestAgentRoleForTask(
  title: string,
  description: string,
): string {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes("proposal") ||
    text.includes("estimate") ||
    text.includes("sales") ||
    text.includes("lead")
  ) {
    return "sales";
  }
  if (text.includes("test") || text.includes("qa") || text.includes("review")) {
    return "qa";
  }
  if (
    text.includes("design") ||
    text.includes("wireframe") ||
    text.includes("ui/ux") ||
    text.includes("figma")
  ) {
    return "designer";
  }
  if (
    text.includes("api") ||
    text.includes("backend") ||
    text.includes("database") ||
    text.includes("prisma")
  ) {
    return "backend";
  }
  if (
    text.includes("implement") ||
    text.includes("ui") ||
    text.includes("frontend") ||
    text.includes("react")
  ) {
    return "frontend";
  }
  if (
    text.includes("requirement") ||
    text.includes("plan") ||
    text.includes("spec")
  ) {
    return "pm";
  }
  return "pm";
}
