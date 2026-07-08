import { prisma } from "@/database/client";

export const artifactRepository = {
  async findAll() {
    return prisma.artifact.findMany({
      orderBy: { created_at: "desc" },
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
            assigned_agent: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.artifact.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
            assigned_agent: true,
          },
        },
      },
    });
  },

  async findByProjectId(projectId: string) {
    return prisma.artifact.findMany({
      where: {
        task: { stage: { workflow: { project_id: projectId } } },
      },
      orderBy: { created_at: "desc" },
      include: {
        task: { include: { assigned_agent: true } },
      },
    });
  },

  async findByWorkflowId(workflowId: string) {
    return prisma.artifact.findMany({
      where: {
        task: { stage: { workflow_id: workflowId } },
      },
      orderBy: { created_at: "asc" },
      include: {
        task: {
          include: {
            assigned_agent: true,
            stage: true,
          },
        },
      },
    });
  },
};

export const notificationRepository = {
  async findRecent(limit = 20) {
    return prisma.notification.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
    });
  },

  async findUnreadCount() {
    return prisma.notification.count({ where: { read: false } });
  },

  async create(data: {
    title: string;
    message: string;
    type:
      | "information"
      | "success"
      | "warning"
      | "error"
      | "approval"
      | "reminder"
      | "recommendation"
      | "system";
    priority?: "critical" | "high" | "medium" | "low";
    link?: string;
  }) {
    return prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority ?? "medium",
        link: data.link ?? "",
      },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
  },
};
