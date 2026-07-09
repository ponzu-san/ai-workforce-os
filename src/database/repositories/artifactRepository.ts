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

  async findByTaskId(taskId: string) {
    return prisma.artifact.findFirst({
      where: { task_id: taskId },
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

  async findAllByTaskId(taskId: string) {
    return prisma.artifact.findMany({
      where: { task_id: taskId },
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

  async findPreviousVersion(artifactId: string) {
    const artifact = await prisma.artifact.findUnique({
      where: { id: artifactId },
      select: { previous_artifact_id: true },
    });
    if (!artifact?.previous_artifact_id) return null;
    return prisma.artifact.findUnique({
      where: { id: artifact.previous_artifact_id },
    });
  },

  async create(data: {
    task_id: string;
    type: string;
    name: string;
    content?: string;
    content_kind?: "markdown" | "url" | "file";
    external_url?: string | null;
    file_path?: string | null;
    mime_type?: string | null;
    version?: string;
    source_artifact_ids?: string;
    previous_artifact_id?: string | null;
    edited_by?: string;
  }) {
    return prisma.artifact.create({ data });
  },

  async updateContent(
    id: string,
    data: {
      content: string;
      version?: string;
      edited_by?: string;
    },
  ) {
    return prisma.artifact.update({
      where: { id },
      data,
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
