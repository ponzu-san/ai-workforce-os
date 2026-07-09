"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { approvalRepository } from "@/database/repositories/approvalRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { isProjectReadyToComplete } from "@/lib/workflow/projectCompletion";
import { approvalService } from "@/services/approvalService";

export async function reviewApprovalAction(
  approvalId: string,
  action: "approve" | "return" | "reject",
  comment?: string,
): Promise<string | null> {
  try {
    if (action === "approve") {
      await approvalService.approve(approvalId, { comment });
    } else {
      await approvalService.returnForRevision(approvalId, { comment });
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
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
  if (action !== "approve" && action !== "return" && action !== "reject") {
    return;
  }

  const normalizedAction =
    action === "reject" ? "return" : (action as "approve" | "return");

  try {
    const workflowDoneQuery = await reviewApprovalAction(
      approvalId,
      normalizedAction,
      typeof comment === "string" ? comment : undefined,
    );

    let resultQuery =
      normalizedAction === "approve" ? "approved=1" : "returned=1";

    if (normalizedAction === "approve" && workflowDoneQuery) {
      resultQuery = workflowDoneQuery;
    }

    if (typeof returnTo === "string" && returnTo.startsWith("/")) {
      const separator = returnTo.includes("?") ? "&" : "?";
      redirect(`${returnTo}${separator}${resultQuery}`);
    }

    redirect(
      normalizedAction === "approve" ? `/?${resultQuery}` : `/?returned=1`,
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "承認処理に失敗しました";
    const path =
      typeof returnTo === "string" && returnTo.startsWith("/")
        ? returnTo
        : "/";
    const separator = path.includes("?") ? "&" : "?";
    redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
  }
}
