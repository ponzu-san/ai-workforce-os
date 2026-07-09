"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectRepository } from "@/database/repositories/projectRepository";
import { workflowRepository } from "@/database/repositories/workflowRepository";
import { isProjectReadyToComplete } from "@/lib/workflow/projectCompletion";
import { navigationRedirectService } from "@/services/navigationRedirectService";
import { workflowExecutionService } from "@/services/workflowExecutionService";

function appendQuery(path: string, query: string | null): string {
  if (!query) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${query}`;
}

function revalidateWorkflowPaths(workflowId: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/completed");
  revalidatePath("/workflows");
  revalidatePath(`/workflows/${workflowId}`);
  revalidatePath("/approvals");
  revalidatePath("/artifacts");
  revalidatePath("/", "layout");
}

async function buildWorkflowDoneQuery(
  workflowId: string,
): Promise<string | null> {
  const workflow = await workflowRepository.findById(workflowId);
  if (!workflow) return null;

  const project = await projectRepository.findById(workflow.project_id);
  if (!project || !isProjectReadyToComplete(project)) return null;

  return `workflowDone=1&projectId=${project.id}`;
}

async function buildExecutionSuccessQuery(
  workflowId: string,
  result: Awaited<ReturnType<typeof workflowExecutionService.executeNext>>,
): Promise<string> {
  if (result.completed) {
    const workflowDoneQuery = await buildWorkflowDoneQuery(workflowId);
    if (workflowDoneQuery) return workflowDoneQuery;
    return "done=1";
  }

  if ("waitingExternal" in result && result.waitingExternal) {
    const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
    return `handoff=1&task=${taskTitle}`;
  }

  const taskTitle = encodeURIComponent(result.task?.title ?? "Task");
  return `executed=1&task=${taskTitle}`;
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
    successQuery = await buildExecutionSuccessQuery(workflowId, result);
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
    successQuery = await buildExecutionSuccessQuery(workflowId, result);
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
