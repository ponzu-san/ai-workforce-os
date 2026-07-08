"use server";

import { revalidatePath } from "next/cache";

import { memoryRepository } from "@/database/repositories/agentRepository";

export async function saveProjectInstructionAction(
  formData: FormData,
): Promise<void> {
  const projectId = formData.get("projectId");
  const instruction = formData.get("instruction");

  if (typeof projectId !== "string" || typeof instruction !== "string") return;

  const trimmed = instruction.trim();
  if (!trimmed) return;

  await memoryRepository.create({
    project_id: projectId,
    type: "project",
    content: trimmed,
    importance: 8,
    source: "user_instruction",
  });

  revalidatePath("/");
}
