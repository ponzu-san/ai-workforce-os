"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";
import { workflowExecutionService } from "@/services/workflowExecutionService";

function appendQuery(path: string, query: string | null): string {
  if (!query) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${query}`;
}

function revalidateWorkflowPaths(workflowId: string) {
  revalidatePath("/");
  revalidatePath("/workflows");
  revalidatePath(`/workflows/${workflowId}`);
  revalidatePath("/approvals");
  revalidatePath("/artifacts");
  revalidatePath("/", "layout");
}

async function resolveDefaultRedirectPath(workflowId: string): Promise<string> {
  const stagePath =
    await navigationRedirectService.resolveWorkflowStagePath(workflowId);
  return stagePath ?? "/";
}

async function resolveRedirectPath(
  workflowId: string,
  formData: FormData,
  query: string | null,
): Promise<string> {
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    return appendQuery(returnTo, query);
  }

  return appendQuery(await resolveDefaultRedirectPath(workflowId), query);
}

async function resolveErrorRedirectPath(
  workflowId: string,
  formData: FormData,
  errorMessage: string,
): Promise<string> {
  const returnTo = formData.get("returnTo");
  const errorQuery = `error=${encodeURIComponent(errorMessage)}`;

  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    return appendQuery(returnTo, errorQuery);
  }

  return appendQuery(
    await resolveDefaultRedirectPath(workflowId),
    errorQuery,
  );
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
      await resolveErrorRedirectPath(workflowId, formData, errorMessage),
    );
  }

  redirect(await resolveRedirectPath(workflowId, formData, "started=1"));
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
    } else if ("waitingExternal" in result && result.waitingExternal) {
      const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
      successQuery = `handoff=1&task=${taskTitle}`;
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
      await resolveErrorRedirectPath(workflowId, formData, errorMessage),
    );
  }

  redirect(
    await resolveRedirectPath(workflowId, formData, successQuery ?? "executed=1"),
  );
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
    } else if ("waitingExternal" in result && result.waitingExternal) {
      const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
      successQuery = `handoff=1&task=${taskTitle}`;
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
      await resolveErrorRedirectPath(workflowId, formData, errorMessage),
    );
  }

  redirect(
    await resolveRedirectPath(workflowId, formData, successQuery ?? "executed=1"),
  );
}
