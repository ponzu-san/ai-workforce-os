import type { StageExecutionMode } from "@/types/domain";
import { prisma } from "@/database/client";

export const stageRepository = {
  async findById(id: string) {
    return prisma.stage.findUnique({
      where: { id },
      include: {
        tasks: true,
        workflow: { include: { project: true } },
      },
    });
  },

  async updateExecutionMode(id: string, executionMode: StageExecutionMode) {
    return prisma.stage.update({
      where: { id },
      data: { execution_mode: executionMode },
    });
  },

  async findByProjectId(projectId: string) {
    return prisma.stage.findMany({
      where: { workflow: { project_id: projectId } },
      include: {
        tasks: { orderBy: { created_at: "asc" } },
        workflow: true,
      },
      orderBy: { order: "asc" },
    });
  },
};
