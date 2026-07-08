import { analyticsRepository } from "@/database/repositories/analyticsRepository";
import { agentRepository } from "@/database/repositories/agentRepository";

export const analyticsService = {
  async getBusinessDashboard() {
    const [cost, productivity, agentGroups, recentCosts, agents] =
      await Promise.all([
        analyticsRepository.getCostSummary(),
        analyticsRepository.getProductivityStats(),
        analyticsRepository.getAgentActivity(),
        analyticsRepository.getRecentCosts(8),
        agentRepository.findAll(),
      ]);

    const agentMap = new Map(agents.map((a) => [a.id, a.name]));

    const agentActivity = agentGroups.map((g) => ({
      agentName: agentMap.get(g.agent_id) ?? "Unknown",
      executionCount: g._count.id,
    }));

    return {
      cost,
      productivity,
      agentActivity,
      recentCosts: recentCosts.map((r) => ({
        id: r.id,
        agentName: r.execution.agent.name,
        model: r.model,
        cost: r.cost,
        tokenUsage: r.token_usage,
        created_at: r.created_at,
      })),
    };
  },
};
