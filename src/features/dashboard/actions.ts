"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { memoryRepository } from "@/database/repositories/agentRepository";

function resolveReturnPath(returnTo: FormDataEntryValue | null): string {
  if (typeof returnTo !== "string" || !returnTo.startsWith("/")) {
    return "/";
  }
  return returnTo.split("?")[0] || "/";
}

export async function saveStageInstructionAction(
  formData: FormData,
): Promise<void> {
  const projectId = formData.get("projectId");
  const stageId = formData.get("stageId");
  const instruction = formData.get("instruction");
  const returnPath = resolveReturnPath(formData.get("returnTo"));

  if (typeof projectId !== "string" || typeof instruction !== "string") {
    redirect(returnPath);
  }

  const trimmed = instruction.trim();
  if (!trimmed) {
    redirect(returnPath);
  }

  await memoryRepository.create({
    project_id: projectId,
    stage_id: typeof stageId === "string" ? stageId : null,
    type: "project",
    content: trimmed,
    importance: 8,
    source: "user_instruction",
  });

  revalidatePath(returnPath);
  revalidatePath("/");

  const separator = returnPath.includes("?") ? "&" : "?";
  redirect(`${returnPath}${separator}instructionSaved=1`);
}

export async function saveProjectInstructionAction(
  formData: FormData,
): Promise<void> {
  const projectId = formData.get("projectId");
  const instruction = formData.get("instruction");
  const returnPath = resolveReturnPath(formData.get("returnTo"));

  if (typeof projectId !== "string" || typeof instruction !== "string") {
    redirect(returnPath);
  }

  const trimmed = instruction.trim();
  if (!trimmed) {
    redirect(returnPath);
  }

  await memoryRepository.create({
    project_id: projectId,
    type: "project",
    content: trimmed,
    importance: 8,
    source: "user_instruction",
  });

  revalidatePath(returnPath);
  revalidatePath("/");

  const separator = returnPath.includes("?") ? "&" : "?";
  redirect(`${returnPath}${separator}instructionSaved=1`);
}
