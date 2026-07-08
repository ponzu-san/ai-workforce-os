import { z } from "zod";

import { approvalRepository } from "@/database/repositories/approvalRepository";
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

  async reject(id: string, input: z.infer<typeof reviewSchema>) {
    const data = reviewSchema.parse(input);
    const approval = await approvalRepository.updateStatus(
      id,
      "rejected",
      data.comment ?? "",
      "user",
    );
    await taskRepository.updateStatus(approval.task_id, "blocked");
    return approvalRepository.findById(id);
  },

  reviewSchema,
};
