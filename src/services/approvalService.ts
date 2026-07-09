import { z } from "zod";

import { approvalRepository } from "@/database/repositories/approvalRepository";
import { prisma } from "@/database/client";
import { taskRepository } from "@/database/repositories/taskRepository";
import { workflowEngine } from "@/ai/workflow/workflowEngine";

const reviewSchema = z.object({
  comment: z.string().optional(),
});

export const approvalService = {
  async listPending() {
    return approvalRepository.findPending();
  },

  async listHistory() {
    return approvalRepository.findAll();
  },

  async approve(id: string, input: z.infer<typeof reviewSchema>) {
    const data = reviewSchema.parse(input);
    const approval = await approvalRepository.updateStatus(
      id,
      "approved",
      data.comment ?? "",
      "user",
    );
    await taskRepository.updateStatus(approval.task_id, "done");
    await workflowEngine.continueAfterApproval(approval.task_id);
    return approvalRepository.findById(id);
  },

  async returnForRevision(id: string, input: z.infer<typeof reviewSchema>) {
    const data = reviewSchema.parse(input);
    const comment = data.comment?.trim() ?? "";
    if (!comment) {
      throw new Error("差し戻しにはコメントが必要です");
    }

    const approval = await approvalRepository.updateStatus(
      id,
      "rejected",
      comment,
      "user",
    );

    await taskRepository.updateStatus(approval.task_id, "todo");

    const task = await taskRepository.findById(approval.task_id);
    if (task) {
      await prisma.workflow.update({
        where: { id: task.stage.workflow.id },
        data: { status: "running" },
      });
    }

    return approvalRepository.findById(id);
  },

  async reject(id: string, input: z.infer<typeof reviewSchema>) {
    return this.returnForRevision(id, input);
  },

  reviewSchema,
};
