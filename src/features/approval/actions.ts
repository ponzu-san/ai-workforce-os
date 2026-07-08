"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    revalidatePath("/artifacts");
    revalidatePath("/tasks");
  } catch {
    return;
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

  await reviewApprovalAction(
    approvalId,
    action,
    typeof comment === "string" ? comment : undefined,
  );

  const resultQuery = action === "approve" ? "approved=1" : "rejected=1";

  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    const separator = returnTo.includes("?") ? "&" : "?";
    redirect(`${returnTo}${separator}${resultQuery}`);
  }

  redirect(action === "approve" ? "/?approved=1" : "/?rejected=1");
}
