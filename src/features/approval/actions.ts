"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { approvalRepository } from "@/database/repositories/approvalRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { isProjectReadyToComplete } from "@/lib/workflow/projectCompletion";
import { approvalService } from "@/services/approvalService";

export async function reviewApprovalAction(
  approvalId: string,
  action: "approve" | "reject",
  comment?: string,
): Promise<string | null> {
  try {
    if (action === "approve") {
      await approvalService.approve(approvalId, { comment });
    } else {
      await approvalService.reject(approvalId, { comment });
      return null;
    }

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/completed");
    revalidatePath("/approvals");
    revalidatePath("/artifacts");
    revalidatePath("/tasks");
    revalidatePath("/", "layout");

    const approval = await approvalRepository.findById(approvalId);
    if (!approval) return null;

    const projectId = approval.task.stage.workflow.project.id;
    const project = await projectRepository.findById(projectId);
    if (!project || !isProjectReadyToComplete(project)) return null;

    return `workflowDone=1&projectId=${projectId}`;
  } catch {
    return null;
  }
}

export async function reviewApprovalFormAction(
  formData: FormData,
): Promise<void> {
  const approvalId = formData.get("approvalId");
  const action = formData.get("action");
  const comment = formData.get("comment");
  const returnTo = formData.get("returnTo");

  if (typeof approvalId !== "string") return;
  if (action !== "approve" && action !== "reject") return;

  const workflowDoneQuery = await reviewApprovalAction(
    approvalId,
    action,
    typeof comment === "string" ? comment : undefined,
  );

  let resultQuery =
    action === "approve" ? "approved=1" : "rejected=1";

  if (action === "approve" && workflowDoneQuery) {
    resultQuery = workflowDoneQuery;
  }

  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    const separator = returnTo.includes("?") ? "&" : "?";
    redirect(`${returnTo}${separator}${resultQuery}`);
  }

  redirect(action === "approve" ? `/?${resultQuery}` : `/?rejected=1`);
}
