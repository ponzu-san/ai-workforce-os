"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearActiveProjectId,
  setActiveProjectId,
} from "@/lib/project/activeProject.server";
import { resolveOpenStageOrder } from "@/lib/workflow/pipelineView";
import { parseStageModesFromForm } from "@/lib/workflow/stageModeConfig";
import { buildProjectEntryPath } from "@/services/navigationRedirectService";
import { projectService } from "@/services/projectService";
import { stageService } from "@/services/stageService";
import { projectPipelineService } from "@/services/projectPipelineService";
import type { ProjectTemplate } from "@/types/domain";

export async function createProjectAction(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const description = formData.get("description");
  const template = formData.get("template");
  const clientId = formData.get("client_id");

  if (typeof name !== "string" || name.trim().length === 0) {
    return;
  }

  const validTemplates: ProjectTemplate[] = [
    "lp_static",
    "corporate",
    "design_only",
    "custom_blank",
  ];

  const templateValue =
    typeof template === "string" &&
    validTemplates.includes(template as ProjectTemplate)
      ? (template as ProjectTemplate)
      : "lp_static";

  const clientIdValue =
    typeof clientId === "string" && clientId.length > 0 ? clientId : null;

  let projectId: string | null = null;
  let errorMessage: string | null = null;

  try {
    const stageModeOverrides = parseStageModesFromForm(formData);

    const project = await projectService.create({
      name: name.trim(),
      description: typeof description === "string" ? description : "",
      status: "active",
      template: templateValue,
      client_id: clientIdValue,
      stageModeOverrides,
    });
    projectId = project.id;

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/workflows");
    if (clientIdValue) {
      revalidatePath("/clients");
      revalidatePath(`/clients/${clientIdValue}`);
    }
    revalidatePath(`/projects/${project.id}`);
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "プロジェクトの作成に失敗しました";
  }

  if (errorMessage || !projectId) {
    const base = clientIdValue ? `/clients/${clientIdValue}` : "/projects";
    redirect(
      `${base}?error=${encodeURIComponent(errorMessage ?? "Workflow not found")}`,
    );
  }

  redirect(buildProjectEntryPath(projectId));
}

export async function updateProjectStageModesAction(
  formData: FormData,
): Promise<void> {
  const projectId = formData.get("projectId");
  if (typeof projectId !== "string") return;

  const stageModeOverrides = parseStageModesFromForm(formData);

  try {
    await stageService.updateProjectStageModes(projectId, stageModeOverrides);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/p/${projectId}`);
    revalidatePath("/", "layout");
    redirect(`/projects/${projectId}?stageModesSaved=1`);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "工程モードの保存に失敗しました";
    redirect(`/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }
}

export async function selectProjectAction(formData: FormData): Promise<void> {
  const projectId = formData.get("projectId");
  if (typeof projectId !== "string") return;

  const pipeline = await projectPipelineService.getPipelineView(projectId);
  if (!pipeline) return;

  await setActiveProjectId(projectId);

  const stageOrder = resolveOpenStageOrder(pipeline);
  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath(`/p/${projectId}`);
  revalidatePath(`/p/${projectId}/stages/${stageOrder}`);
  redirect(`/p/${projectId}/stages/${stageOrder}`);
}

export async function clearActiveProjectAction(): Promise<void> {
  await clearActiveProjectId();
  revalidatePath("/");
  revalidatePath("/", "layout");
  redirect("/");
}
