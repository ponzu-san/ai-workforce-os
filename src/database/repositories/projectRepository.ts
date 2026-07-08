import type {
  ProjectStatus,
  ProjectTemplate,
  StageExecutionMode,
} from "@/types/domain";
import { PRODUCTION_WORKFLOW } from "@/ai/workflow/productionWorkflowTemplate";
import type { ProductionStageName } from "@/ai/workflow/productionWorkflowTemplate";
import { resolveStageModes } from "@/ai/workflow/productionTemplates";
import { prisma } from "@/database/client";
import { agentRepository } from "@/database/repositories/agentRepository";

export const projectRepository = {
  async findAllByWorkspace(workspaceId: string) {
    return prisma.project.findMany({
      where: { workspace_id: workspaceId },
      orderBy: { updated_at: "desc" },
      include: {
        client: true,
        workflows: {
          include: {
            stages: {
              include: {
                _count: { select: { tasks: true } },
              },
            },
          },
        },
      },
    });
  },

  async findAllWithPipelineByWorkspace(workspaceId: string) {
    return prisma.project.findMany({
      where: { workspace_id: workspaceId },
      orderBy: { updated_at: "desc" },
      include: {
        client: true,
        workflows: {
          include: {
            stages: {
              include: {
                tasks: {
                  include: { assigned_agent: true },
                  orderBy: { created_at: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { created_at: "asc" },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        workflows: {
          include: {
            stages: {
              include: {
                tasks: {
                  include: { assigned_agent: true },
                  orderBy: { created_at: "desc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
        memories: {
          where: { type: "project" },
          orderBy: { created_at: "desc" },
          take: 10,
        },
      },
    });
  },

  async create(data: {
    workspace_id: string;
    name: string;
    description?: string;
    status?: ProjectStatus;
    deadline?: Date | null;
    client_id?: string | null;
    template?: ProjectTemplate;
    stageModeOverrides?: Partial<Record<ProductionStageName, StageExecutionMode>>;
  }) {
    const agents = await agentRepository.findAll();
    const agentByRole = new Map(agents.map((a) => [a.role, a.id]));
    const template = data.template ?? "lp_static";
    const stageModes = resolveStageModes(template, data.stageModeOverrides);
    const workflowTemplate = PRODUCTION_WORKFLOW;

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          workspace_id: data.workspace_id,
          client_id: data.client_id ?? null,
          name: data.name,
          description: data.description ?? "",
          type: "production",
          template,
          status: data.status ?? "draft",
          deadline: data.deadline ?? null,
        },
      });

      await tx.workflow.create({
        data: {
          project_id: project.id,
          name: workflowTemplate.name,
          description: workflowTemplate.description,
          status: "planning",
          stages: {
            create: workflowTemplate.stages.map((stage) => ({
              name: stage.name,
              order: stage.order,
              status: "pending",
              execution_mode: stageModes[stage.name] ?? "internal_ai",
              tasks: {
                create: {
                  title: stage.task.title,
                  description: stage.task.description,
                  priority: stage.task.priority,
                  status: "todo",
                  assigned_agent_id:
                    agentByRole.get(stage.task.agentRole) ?? null,
                },
              },
            })),
          },
        },
      });

      return project;
    });
  },

  async updateStatus(id: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id },
      data: { status },
    });
  },

  async countByWorkspace(workspaceId: string) {
    return prisma.project.count({ where: { workspace_id: workspaceId } });
  },
};
