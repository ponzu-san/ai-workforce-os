import { prisma } from "@/database/client";

export const agentRepository = {
  async findSecretary() {
    return prisma.agent.findFirst({
      where: { role: "secretary", status: "active" },
    });
  },

  async findAll() {
    return prisma.agent.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.agent.findUnique({ where: { id } });
  },

  async findByRole(role: string) {
    return prisma.agent.findFirst({
      where: { role, status: "active" },
    });
  },
};

export const executionLogRepository = {
  async findRecent(limit = 10) {
    return prisma.executionLog.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      include: { agent: true },
    });
  },

  async create(data: {
    agent_id: string;
    task_id?: string | null;
    model: string;
    input_tokens: number;
    output_tokens: number;
    duration_ms: number;
    status?: "pending" | "running" | "completed" | "failed";
    cost?: {
      provider: string;
      model: string;
      token_usage: number;
      cost: number;
    };
  }) {
    return prisma.executionLog.create({
      data: {
        agent_id: data.agent_id,
        task_id: data.task_id ?? null,
        model: data.model,
        input_tokens: data.input_tokens,
        output_tokens: data.output_tokens,
        duration_ms: data.duration_ms,
        status: data.status ?? "completed",
        cost_records: data.cost
          ? {
              create: {
                provider: data.cost.provider,
                model: data.cost.model,
                token_usage: data.cost.token_usage,
                cost: data.cost.cost,
              },
            }
          : undefined,
      },
      include: { cost_records: true, agent: true },
    });
  },
};

export const memoryRepository = {
  async findByProject(projectId: string) {
    return prisma.memory.findMany({
      where: { project_id: projectId },
      orderBy: { importance: "desc" },
    });
  },

  async findUserInstructionsByProject(projectId: string) {
    return prisma.memory.findMany({
      where: { project_id: projectId, source: "user_instruction" },
      orderBy: { created_at: "desc" },
    });
  },

  async findInstructionsForStage(projectId: string, stageId: string) {
    return prisma.memory.findMany({
      where: {
        project_id: projectId,
        source: "user_instruction",
        OR: [{ stage_id: stageId }, { stage_id: null }],
      },
      orderBy: { created_at: "desc" },
      take: 10,
    });
  },

  async findInstructionsByProject(projectId: string, stageId?: string | null) {
    return prisma.memory.findMany({
      where: {
        project_id: projectId,
        source: "user_instruction",
        ...(stageId
          ? { OR: [{ stage_id: stageId }, { stage_id: null }] }
          : {}),
      },
      orderBy: { created_at: "desc" },
    });
  },

  async findUserMemories(limit = 5) {
    return prisma.memory.findMany({
      where: { type: "user", project_id: null },
      orderBy: { importance: "desc" },
      take: limit,
    });
  },

  async create(data: {
    project_id?: string | null;
    stage_id?: string | null;
    type: "short_term" | "project" | "user";
    content: string;
    importance?: number;
    source?: string;
  }) {
    return prisma.memory.create({ data });
  },
};
