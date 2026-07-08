"use server";

import { revalidatePath } from "next/cache";

import { approvalService } from "@/services/approvalService";

export async function reviewApprovalAction(
  approvalId: string,
  action: "approve" | "reject",
  comment?: string,
): Promise<void> {
  try {
    if (action === "approve") {
      await approvalService.approve(approvalId, { comment });
    } else {
      await approvalService.reject(approvalId, { comment });
    }
    revalidatePath("/");
    revalidatePath("/approvals");
    revalidatePath("/tasks");
  } catch {
    return;
  }
}
