import type { ApprovalStatus } from "@/types/domain";
import { prisma } from "@/database/client";

export const approvalRepository = {
  async findPending() {
    return prisma.approval.findMany({
      where: { status: "pending" },
      orderBy: { created_at: "asc" },
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
          },
        },
      },
    });
  },

  async findPendingByTaskId(taskId: string) {
    return prisma.approval.findFirst({
      where: { task_id: taskId, status: "pending" },
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.approval.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
          },
        },
      },
    });
  },

  async createForTask(taskId: string) {
    return prisma.approval.create({
      data: { task_id: taskId, status: "pending" },
    });
  },

  async updateStatus(
    id: string,
    status: ApprovalStatus,
    comment: string,
    approvedBy: string,
  ) {
    return prisma.approval.update({
      where: { id },
      data: {
        status,
        comment,
        approved_by: approvedBy,
        approved_at: new Date(),
      },
    });
  },

  async countPending() {
    return prisma.approval.count({ where: { status: "pending" } });
  },

  async findAll(limit = 50) {
    return prisma.approval.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      include: {
        task: {
          include: {
            stage: {
              include: {
                workflow: { include: { project: true } },
              },
            },
          },
        },
      },
    });
  },

  async findByTaskId(taskId: string) {
    return prisma.approval.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: "desc" },
    });
  },

  async findLatestRevisionComment(taskId: string): Promise<string | null> {
    const rejected = await prisma.approval.findFirst({
      where: { task_id: taskId, status: "rejected" },
      orderBy: { created_at: "desc" },
    });
    return rejected?.comment?.trim() ? rejected.comment : null;
  },
};
