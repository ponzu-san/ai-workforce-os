"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { workflowExecutionService } from "@/services/workflowExecutionService";
import { taskRepository } from "@/database/repositories/taskRepository";
import { buildStagePath } from "@/services/navigationRedirectService";

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
      const stagePath = buildStagePath(
        task.stage.workflow.project.id,
        task.stage.order,
      );
      redirectPath = stagePath;
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
