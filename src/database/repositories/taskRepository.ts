import type { TaskPriority, TaskStatus } from "@/types/domain";
import { prisma } from "@/database/client";

const taskInclude = {
  stage: {
    include: {
      workflow: {
        include: {
          project: {
            include: { client: true },
          },
        },
      },
    },
  },
  assigned_agent: true,
  approvals: {
    orderBy: { created_at: "desc" as const },
    take: 1,
  },
};

export const taskRepository = {
  async findAll() {
    return prisma.task.findMany({
      orderBy: [{ priority: "asc" }, { created_at: "desc" }],
      include: taskInclude,
    });
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        approvals: { orderBy: { created_at: "desc" } },
        artifacts: { orderBy: { created_at: "desc" } },
      },
    });
  },

  async findByProjectId(projectId: string) {
    return prisma.task.findMany({
      where: {
        stage: { workflow: { project_id: projectId } },
      },
      orderBy: [{ priority: "asc" }, { created_at: "desc" }],
      include: taskInclude,
    });
  },

  async create(data: {
    stage_id: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigned_agent_id?: string | null;
  }) {
    return prisma.task.create({
      data: {
        stage_id: data.stage_id,
        title: data.title,
        description: data.description ?? "",
        priority: data.priority ?? "medium",
        assigned_agent_id: data.assigned_agent_id ?? null,
        status: "todo",
      },
      include: taskInclude,
    });
  },

  async updateStatus(id: string, status: TaskStatus) {
    return prisma.task.update({
      where: { id },
      data: { status },
      include: taskInclude,
    });
  },

  async count() {
    return prisma.task.count();
  },

  async findTodayTasks(limit = 10) {
    return prisma.task.findMany({
      where: { status: { in: ["todo", "running", "review", "blocked"] } },
      orderBy: [{ priority: "asc" }, { created_at: "asc" }],
      take: limit,
      include: taskInclude,
    });
  },
};
