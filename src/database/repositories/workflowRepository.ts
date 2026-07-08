import { prisma } from "@/database/client";

export const workflowRepository = {
  async findByProjectId(projectId: string) {
    return prisma.workflow.findMany({
      where: { project_id: projectId },
      include: {
        stages: {
          include: {
            tasks: {
              include: { assigned_agent: true },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { created_at: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
      include: {
        project: true,
        stages: {
          include: {
            tasks: { include: { assigned_agent: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  },

  async getDefaultStageForProject(projectId: string) {
    return prisma.stage.findFirst({
      where: { workflow: { project_id: projectId } },
      orderBy: { order: "asc" },
    });
  },

  async findStageByIdForProject(stageId: string, projectId: string) {
    return prisma.stage.findFirst({
      where: {
        id: stageId,
        workflow: { project_id: projectId },
      },
    });
  },
};
