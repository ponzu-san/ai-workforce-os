import { prisma } from "@/database/client";

export const workspaceRepository = {
  async findDefault() {
    return prisma.workspace.findFirst({
      orderBy: { created_at: "asc" },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async count() {
    return prisma.workspace.count();
  },
};
