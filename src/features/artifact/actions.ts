"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { prisma } from "@/database/client";
import { taskRepository } from "@/database/repositories/taskRepository";
import { parseContractChecklist } from "@/lib/contract/checklist";
import { buildStagePath } from "@/services/navigationRedirectService";
import { workflowExecutionService } from "@/services/workflowExecutionService";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function registerExternalArtifactAction(
  formData: FormData,
): Promise<void> {
  const taskId = formData.get("taskId");
  const externalUrl = formData.get("externalUrl");
  const note = formData.get("note");
  const returnTo = formData.get("returnTo");
  const file = formData.get("file");

  if (typeof taskId !== "string") return;

  let filePath: string | null = null;
  let mimeType: string | null = null;

  if (file instanceof File && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/artifacts",
      taskId,
    );
    await mkdir(uploadDir, { recursive: true });
    const safeName = sanitizeFilename(file.name);
    const dest = path.join(uploadDir, safeName);
    await writeFile(dest, buffer);
    filePath = `/uploads/artifacts/${taskId}/${safeName}`;
    mimeType = file.type || null;
  }

  const urlValue =
    typeof externalUrl === "string" && externalUrl.trim().length > 0
      ? externalUrl.trim()
      : null;

  let redirectPath =
    typeof returnTo === "string" && returnTo.startsWith("/")
      ? returnTo
      : "/";

  try {
    await workflowExecutionService.registerExternalDeliverable(taskId, {
      externalUrl: urlValue,
      filePath,
      mimeType,
      note: typeof note === "string" ? note : undefined,
    });

    const task = await taskRepository.findById(taskId);
    if (task) {
      redirectPath = buildStagePath(
        task.stage.workflow.project.id,
        task.stage.order,
      );
    }

    revalidatePath("/");
    revalidatePath("/approvals");
    revalidatePath("/artifacts");
    revalidatePath("/", "layout");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    const separator = redirectPath.includes("?") ? "&" : "?";
    redirect(`${redirectPath}${separator}error=${encodeURIComponent(message)}`);
    return;
  }

  const separator = redirectPath.includes("?") ? "&" : "?";
  redirect(`${redirectPath}${separator}registered=1`);
}

export async function editArtifactAction(
  artifactId: string,
  content: string,
  returnTo: string,
): Promise<void> {
  const artifact = await artifactRepository.findById(artifactId);
  if (!artifact) {
    redirect(returnTo);
  }

  const pending = await approvalRepository.findPendingByTaskId(artifact.task_id);
  if (!pending) {
    redirect(
      `${returnTo}${returnTo.includes("?") ? "&" : "?"}error=${encodeURIComponent("承認待ちの成果物のみ編集できます")}`,
    );
  }

  const trimmed = content.trim();
  if (!trimmed || artifact.content === trimmed) {
    redirect(returnTo);
  }

  const existingVersions = await artifactRepository.findAllByTaskId(
    artifact.task_id,
  );
  const hasArchivedAi = existingVersions.some(
    (item) => item.id !== artifact.id && item.edited_by !== "human",
  );

  if (!hasArchivedAi && artifact.edited_by !== "human") {
    const archived = await artifactRepository.create({
      task_id: artifact.task_id,
      type: artifact.type,
      name: `${artifact.name} (AI版)`,
      content: artifact.content,
      content_kind: artifact.content_kind,
      external_url: artifact.external_url,
      file_path: artifact.file_path,
      mime_type: artifact.mime_type,
      version: "1.0.0",
      source_artifact_ids: artifact.source_artifact_ids,
      edited_by: "",
    });

    await artifactRepository.updateContent(artifactId, {
      content: trimmed,
      version: "1.1.0",
      edited_by: "human",
    });

    await prisma.artifact.update({
      where: { id: artifactId },
      data: { previous_artifact_id: archived.id },
    });
  } else {
    await artifactRepository.updateContent(artifactId, {
      content: trimmed,
      version: "1.1.0",
      edited_by: "human",
    });
  }

  revalidatePath(returnTo);
  revalidatePath(`/artifacts/${artifactId}`);
  revalidatePath("/artifacts");

  const separator = returnTo.includes("?") ? "&" : "?";
  redirect(`${returnTo}${separator}edited=1`);
}

export async function editArtifactFormAction(formData: FormData): Promise<void> {
  const artifactId = formData.get("artifactId");
  const content = formData.get("content");
  const returnTo = formData.get("returnTo");

  if (typeof artifactId !== "string" || typeof content !== "string") return;

  const path =
    typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/";

  await editArtifactAction(artifactId, content, path);
}

export async function saveContractChecklistAction(
  artifactId: string,
  content: string,
  returnTo: string,
): Promise<void> {
  parseContractChecklist(content);

  const artifact = await artifactRepository.findById(artifactId);
  if (!artifact || artifact.type !== "contract_checklist") {
    redirect(returnTo);
  }

  await artifactRepository.updateContent(artifactId, {
    content,
    version: "1.1.0",
    edited_by: "human",
  });

  revalidatePath(returnTo);
  revalidatePath(`/artifacts/${artifactId}`);

  const separator = returnTo.includes("?") ? "&" : "?";
  redirect(`${returnTo}${separator}checklistSaved=1`);
}

export async function saveContractChecklistFormAction(
  formData: FormData,
): Promise<void> {
  const artifactId = formData.get("artifactId");
  const content = formData.get("content");
  const returnTo = formData.get("returnTo");

  if (typeof artifactId !== "string" || typeof content !== "string") return;

  const path =
    typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/";

  await saveContractChecklistAction(artifactId, content, path);
}
