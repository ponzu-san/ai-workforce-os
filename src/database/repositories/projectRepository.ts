import type { ProjectStatus, ProjectType } from "@/types/domain";
import { BUSINESS_WORKFLOW } from "@/ai/workflow/businessWorkflowTemplate";
import { DEV_TEAM_WORKFLOW } from "@/ai/workflow/devTeamTemplate";
import { prisma } from "@/database/client";
import { agentRepository } from "@/database/repositories/agentRepository";

function getWorkflowTemplate(type: ProjectType) {
  return type === "business" ? BUSINESS_WORKFLOW : DEV_TEAM_WORKFLOW;
}

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
    type?: ProjectType;
  }) {
    const agents = await agentRepository.findAll();
    const agentByRole = new Map(agents.map((a) => [a.role, a.id]));
    const projectType = data.type ?? "development";
    const template = getWorkflowTemplate(projectType);

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          workspace_id: data.workspace_id,
          client_id: data.client_id ?? null,
          name: data.name,
          description: data.description ?? "",
          type: projectType,
          status: data.status ?? "draft",
          deadline: data.deadline ?? null,
        },
      });

      await tx.workflow.create({
        data: {
          project_id: project.id,
          name: template.name,
          description: template.description,
          status: "planning",
          stages: {
            create: template.stages.map((stage) => ({
              name: stage.name,
              order: stage.order,
              status: "pending",
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
