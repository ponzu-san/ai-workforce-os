import type { TaskKind } from "@/ai/router/types";
import { SECRETARY_SYSTEM_PROMPT } from "@/ai/agents/secretary/prompt";
import type { StageExecutionMode } from "@/types/domain";
import { PRODUCTION_STAGE_NAMES } from "@/ai/workflow/productionWorkflowTemplate";

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

const DESIGNER_INTERNAL_PROMPT = `You are Designer AI specializing in UI/UX.
Create design proposals, wireframe descriptions, and design system guidelines.
Output markdown with: Design Goals, Layout, Components, Color/Typography, Notes.
Respond in Japanese unless user writes in another language.`;

const DESIGNER_EXTERNAL_TOOL_PROMPT = `You are Designer AI preparing handoff for external design tools (Figma, v0, Cursor AI, ChatGPT, Gemini).
Do NOT produce final visual designs yourself. Instead output:
1. Tool-specific prompts (sections for Figma, v0, Cursor, ChatGPT)
2. Screen inventory with purpose per page
3. Acceptance criteria for design deliverables
4. Checklist of what the user must register back (Figma URL, exports, etc.)
Respond in Japanese unless user writes in another language.`;

const DESIGNER_HUMAN_HANDOFF_PROMPT = `You are Designer AI writing a design brief for a human designer.
Output a professional design specification document including:
1. Project overview and target users
2. Page list with goals per page
3. Required sections (hero, CTA, pricing, etc.)
4. Tone & manner, brand constraints, reference URLs
5. Deliverables expected from the designer (Figma frames, assets)
6. Acceptance criteria for client approval
Respond in Japanese unless user writes in another language.`;

const EXTERNAL_DEV_HANDOFF_PROMPT = `You are Frontend AI preparing handoff for external coding (Cursor, IDE, etc.).
The user will implement code outside this platform. Output:
1. Implementation brief based on prior requirements and design artifacts
2. Tech stack recommendations (Next.js, etc.)
3. File/component structure guidance
4. Cursor/IDE prompts the user can paste
5. Checklist: GitHub URL, production URL, or files to register when done
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

const QA_INTERNAL_PROMPT = `You are QA AI.
Review all prior deliverables (requirements, design, frontend, backend).
Create test checklists and identify bugs or gaps.
Output markdown with: Test Plan, Issues Found, Recommendations, Pass/Fail suggestion.
Respond in Japanese unless user writes in another language.`;

const QA_EXTERNAL_PROMPT = `You are QA AI reviewing externally produced design and code.
Focus on: design consistency, content accuracy, SEO basics, form behavior, accessibility, pre-launch checklist.
Use Figma URLs, GitHub URLs, and prior artifacts when provided.
Output markdown with: Review Summary, Issues, SEO/Content checks, Pass/Fail suggestion.
Respond in Japanese unless user writes in another language.`;

const SALES_PROMPT = `You are Sales AI acting as the client's sales representative.
Draft a client-facing proposal and a separate estimate document.
Use client context and prior communications when provided.
Output TWO sections using exact delimiters:

---ARTIFACT:proposal---
Markdown proposal with: Executive Summary, Scope, Approach, Timeline, Next Steps

---ARTIFACT:estimate---
Markdown estimate with: Line items table, Subtotal, Tax note, Total, Payment terms, Validity period

Respond in Japanese unless user writes in another language.`;

const CONTRACT_PROMPT = `You are Contract PM AI.
Produce a contract preparation package with checklist and draft appendix.
Output TWO sections using exact delimiters:

---ARTIFACT:contract_checklist---
JSON only (no markdown fences) with shape:
{"items":[{"id":"string","label":"string","kind":"fixed|custom","provider":"client|us|undecided","checked":false,"notes":""}]}
Include these fixed items: photos, domain, copy, logo, hosting.
Add 2-4 custom items specific to this project.

---ARTIFACT:contract_draft---
Markdown contract draft appendix with: Parties, Scope, Deliverables, Timeline, Payment, IP, Confidentiality, Change process, Termination

Respond in Japanese unless user writes in another language.`;

const QA_DESIGN_ONLY_PROMPT = `You are QA AI reviewing a design-only project.
Focus ONLY on: design consistency, handoff completeness, accessibility basics, content accuracy in available artifacts.
Do NOT flag missing frontend, backend, API, or deployment artifacts — those stages are intentionally skipped.
Output markdown with: Test Plan, Issues Found (only design-relevant), Recommendations, Pass/Fail suggestion.
Respond in Japanese unless user writes in another language.`;

const LEGAL_PROMPT = `You are Legal AI.
Review privacy policy needs, terms of use, cookie consent, form PII handling, and compliance risks.
Output markdown with: Risk Summary, Required Documents, Compliance Checklist, Recommendations.
Respond in Japanese unless user writes in another language.`;

const RELEASE_PROMPT = `You are Release AI.
Prepare delivery package: artifact index, client handover doc, deployment checklist, sign-off template.
Output markdown with: Delivery Summary, Artifact Index, Handover Notes, Sign-off Request.
Respond in Japanese unless user writes in another language.`;

const INFRA_PROMPT = `You are Release AI focusing on infrastructure.
Prepare DNS, SSL, environment variables, and deployment checklists.
Output markdown with: Infra Checklist, Environment Setup, Deployment Steps, Rollback Plan.
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
    systemPrompt: DESIGNER_INTERNAL_PROMPT,
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
    systemPrompt: QA_INTERNAL_PROMPT,
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

export function getDesignerPrompt(mode: StageExecutionMode): string {
  if (mode === "human_handoff") return DESIGNER_HUMAN_HANDOFF_PROMPT;
  if (mode === "external_handoff") return DESIGNER_EXTERNAL_TOOL_PROMPT;
  return DESIGNER_INTERNAL_PROMPT;
}

export function resolveSystemPrompt(
  role: string,
  stageName: string,
  executionMode: StageExecutionMode,
  options?: { designOnly?: boolean; skippedStages?: string[] },
): string {
  if (role === "designer") {
    return getDesignerPrompt(executionMode);
  }

  if (stageName === PRODUCTION_STAGE_NAMES.CONTRACT && role === "pm") {
    return CONTRACT_PROMPT;
  }

  if (
    stageName === PRODUCTION_STAGE_NAMES.EXTERNAL_DEV &&
    executionMode === "external_handoff"
  ) {
    return EXTERNAL_DEV_HANDOFF_PROMPT;
  }

  if (role === "qa") {
    if (options?.designOnly) {
      return QA_DESIGN_ONLY_PROMPT;
    }
    if (executionMode === "external_handoff") {
      return QA_EXTERNAL_PROMPT;
    }
  }

  if (stageName === PRODUCTION_STAGE_NAMES.INFRA) {
    return INFRA_PROMPT;
  }

  return getAgentDefinition(role).systemPrompt;
}

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
    text.includes("lead") ||
    text.includes("提案")
  ) {
    return "sales";
  }
  if (
    text.includes("legal") ||
    text.includes("compliance") ||
    text.includes("法務")
  ) {
    return "legal";
  }
  if (
    text.includes("delivery") ||
    text.includes("release") ||
    text.includes("納品")
  ) {
    return "release";
  }
  if (text.includes("test") || text.includes("qa") || text.includes("review")) {
    return "qa";
  }
  if (
    text.includes("design") ||
    text.includes("wireframe") ||
    text.includes("ui/ux") ||
    text.includes("figma") ||
    text.includes("デザイン")
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
    text.includes("react") ||
    text.includes("外部コーディング") ||
    text.includes("cursor")
  ) {
    return "frontend";
  }
  if (
    text.includes("requirement") ||
    text.includes("plan") ||
    text.includes("spec") ||
    text.includes("契約")
  ) {
    return "pm";
  }
  if (text.includes("infra") || text.includes("インフラ")) {
    return "release";
  }
  return "pm";
}
