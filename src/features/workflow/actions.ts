"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { workflowExecutionService } from "@/services/workflowExecutionService";

function revalidateWorkflowPaths(workflowId: string) {
  revalidatePath("/");
  revalidatePath("/workflows");
  revalidatePath(`/workflows/${workflowId}`);
  revalidatePath("/approvals");
  revalidatePath("/artifacts");
}

export async function startWorkflowFormAction(formData: FormData): Promise<void> {
  const workflowId = formData.get("workflowId");
  if (typeof workflowId !== "string") return;

  let errorMessage: string | null = null;
  try {
    await workflowExecutionService.assignAgents(workflowId);
    await workflowExecutionService.start(workflowId);
    revalidateWorkflowPaths(workflowId);
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Start failed";
  }

  if (errorMessage) {
    redirect(
      `/workflows/${workflowId}?error=${encodeURIComponent(errorMessage)}`,
    );
  }

  redirect(`/workflows/${workflowId}?started=1`);
}

export async function startAndExecuteFormAction(
  formData: FormData,
): Promise<void> {
  const workflowId = formData.get("workflowId");
  if (typeof workflowId !== "string") return;

  let errorMessage: string | null = null;
  let successQuery: string | null = null;

  try {
    const result =
      await workflowExecutionService.startAndExecuteFirst(workflowId);
    revalidateWorkflowPaths(workflowId);

    if (result.completed) {
      successQuery = "done=1";
    } else {
      const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
      successQuery = `executed=1&task=${taskTitle}`;
    }
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Automation failed";
  }

  if (errorMessage) {
    redirect(
      `/workflows/${workflowId}?error=${encodeURIComponent(errorMessage)}`,
    );
  }

  redirect(`/workflows/${workflowId}?${successQuery ?? "executed=1"}`);
}

export async function executeNextTaskFormAction(
  formData: FormData,
): Promise<void> {
  const workflowId = formData.get("workflowId");
  if (typeof workflowId !== "string") return;

  let errorMessage: string | null = null;
  let successQuery: string | null = null;

  try {
    const result = await workflowExecutionService.executeNext(workflowId);
    revalidateWorkflowPaths(workflowId);

    if (result.completed) {
      successQuery = "done=1";
    } else {
      const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
      successQuery = `executed=1&task=${taskTitle}`;
    }
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Execution failed";
  }

  if (errorMessage) {
    redirect(
      `/workflows/${workflowId}?error=${encodeURIComponent(errorMessage)}`,
    );
  }

  redirect(`/workflows/${workflowId}?${successQuery ?? "executed=1"}`);
}
