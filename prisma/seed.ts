import { PrismaClient } from "@prisma/client";

import { PRODUCTION_WORKFLOW } from "../src/ai/workflow/productionWorkflowTemplate";
import { resolveStageModes } from "../src/ai/workflow/productionTemplates";

const prisma = new PrismaClient();

const AGENTS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Secretary AI",
    role: "secretary",
    description:
      "Orchestrator. Task organization, workflow management, and user support.",
    version: "1.0.0",
    approval_level: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Project Manager AI",
    role: "pm",
    description: "Requirement analysis, planning, and specification drafting.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Frontend AI",
    role: "frontend",
    description: "React/Next.js implementation and UI development.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "QA AI",
    role: "qa",
    description: "Testing, bug detection, and quality review.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    name: "Designer AI",
    role: "designer",
    description: "UI/UX proposals, wireframes, and design review.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    name: "Backend AI",
    role: "backend",
    description: "API design, database logic, and backend implementation.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    name: "Sales AI",
    role: "sales",
    description: "Proposal drafting, estimates, and lead support.",
    version: "1.0.0",
    approval_level: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000008",
    name: "Legal AI",
    role: "legal",
    description: "Privacy, contract review, and compliance checks.",
    version: "1.0.0",
    approval_level: 3,
  },
  {
    id: "00000000-0000-4000-8000-000000000009",
    name: "Release AI",
    role: "release",
    description: "Release notes, deployment checklists, and handover.",
    version: "1.0.0",
    approval_level: 2,
  },
] as const;

function agentIdByRole(role: string): string | undefined {
  return AGENTS.find((a) => a.role === role)?.id;
}

function buildWorkflowData() {
  const stageModes = resolveStageModes("lp_static");

  return {
    name: PRODUCTION_WORKFLOW.name,
    description: PRODUCTION_WORKFLOW.description,
    status: "planning" as const,
    stages: {
      create: PRODUCTION_WORKFLOW.stages.map((stage) => ({
        name: stage.name,
        order: stage.order,
        status: "pending" as const,
        execution_mode: stageModes[stage.name],
        tasks: {
          create: {
            title: stage.task.title,
            description: stage.task.description,
            priority: stage.task.priority,
            status: "todo" as const,
            assigned_agent_id: agentIdByRole(stage.task.agentRole) ?? null,
          },
        },
      })),
    },
  };
}

async function ensureDemoProject(workspaceId: string) {
  const existingProject = await prisma.project.findFirst({
    where: { workspace_id: workspaceId, name: "Demo Project" },
    include: {
      workflows: { include: { stages: true } },
    },
  });

  if (!existingProject) {
    const project = await prisma.project.create({
      data: {
        workspace_id: workspaceId,
        name: "Demo Project",
        description:
          "AI Workforce OS デモプロジェクト（統合制作ワークフロー / LP静的）",
        type: "production",
        template: "lp_static",
        status: "active",
        workflows: { create: buildWorkflowData() },
      },
    });

    await prisma.memory.create({
      data: {
        project_id: project.id,
        type: "project",
        content: "11ステージの統合制作ワークフロー（lp_static テンプレート）。",
        importance: 8,
        source: "seed",
      },
    });
    return;
  }

  const workflow = existingProject.workflows[0];
  if (
    workflow &&
    workflow.stages.length >= PRODUCTION_WORKFLOW.stages.length
  ) {
    await prisma.project.update({
      where: { id: existingProject.id },
      data: { type: "production", template: "lp_static" },
    });
    return;
  }

  await prisma.workflow.deleteMany({
    where: { project_id: existingProject.id },
  });

  await prisma.workflow.create({
    data: {
      project_id: existingProject.id,
      ...buildWorkflowData(),
    },
  });

  await prisma.project.update({
    where: { id: existingProject.id },
    data: { type: "production", template: "lp_static" },
  });

  await prisma.memory.deleteMany({
    where: { project_id: existingProject.id, source: "seed" },
  });

  await prisma.memory.create({
    data: {
      project_id: existingProject.id,
      type: "project",
      content: "Demo project with unified production workflow (lp_static).",
      importance: 8,
      source: "seed",
    },
  });
}

async function ensureDemoClient(workspaceId: string) {
  const existing = await prisma.client.findFirst({
    where: { workspace_id: workspaceId, name: "Demo Client Corp" },
  });
  if (existing) return;

  const client = await prisma.client.create({
    data: {
      workspace_id: workspaceId,
      name: "Demo Client Corp",
      company: "Demo Client Corp",
      email: "contact@demo-client.example",
      status: "lead",
      notes: "Demo lead for unified production workflow.",
    },
  });

  await prisma.communication.create({
    data: {
      client_id: client.id,
      channel: "email",
      subject: "Initial inquiry",
      content:
        "Interested in AI Workforce OS implementation. Please send proposal.",
    },
  });
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "dev@ai-workforce-os.local" },
    update: {},
    create: {
      email: "dev@ai-workforce-os.local",
      name: "Developer",
      workspaces: { create: { name: "My Workspace" } },
    },
    include: { workspaces: true },
  });

  const workspace = user.workspaces[0];
  if (!workspace) throw new Error("Workspace not found");

  for (const agent of AGENTS) {
    await prisma.agent.upsert({
      where: { id: agent.id },
      update: {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        version: agent.version,
        approval_level: agent.approval_level,
      },
      create: { ...agent },
    });
  }

  await ensureDemoProject(workspace.id);
  await ensureDemoClient(workspace.id);

  await prisma.memory.upsert({
    where: { id: "00000000-0000-4000-8000-000000000088" },
    update: {
      content: "Prefer Japanese responses. Focus on actionable next steps.",
    },
    create: {
      id: "00000000-0000-4000-8000-000000000088",
      type: "user",
      content: "Prefer Japanese responses. Focus on actionable next steps.",
      importance: 9,
      source: "seed",
    },
  });

  console.log("Seed completed:", {
    workspaceId: workspace.id,
    agents: AGENTS.length,
    workflowStages: PRODUCTION_WORKFLOW.stages.length,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
