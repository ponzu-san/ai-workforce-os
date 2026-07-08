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
};
