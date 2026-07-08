import { prisma } from "@/database/client";

export const analyticsRepository = {
  async getCostSummary() {
    const records = await prisma.costRecord.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
    });

    const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
    const totalTokens = records.reduce((sum, r) => sum + r.token_usage, 0);

    return { totalCost, totalTokens, recordCount: records.length };
  },

  async getProductivityStats() {
    const [tasksDone, tasksTotal, executions, artifacts] = await Promise.all([
      prisma.task.count({ where: { status: "done" } }),
      prisma.task.count(),
      prisma.executionLog.count(),
      prisma.artifact.count(),
    ]);

    const completionRate =
      tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

    return { tasksDone, tasksTotal, completionRate, executions, artifacts };
  },

  async getAgentActivity() {
    return prisma.executionLog.groupBy({
      by: ["agent_id"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
  },

  async getRecentCosts(limit = 10) {
    return prisma.costRecord.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      include: {
        execution: { include: { agent: true } },
      },
    });
  },
};
