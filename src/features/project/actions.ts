"use server";

import { revalidatePath } from "next/cache";

import { projectService } from "@/services/projectService";

export async function createProjectAction(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || name.trim().length === 0) {
    return;
  }

  try {
    await projectService.create({
      name: name.trim(),
      description: typeof description === "string" ? description : "",
      status: "active",
    });
    revalidatePath("/");
    revalidatePath("/projects");
  } catch {
    return;
  }
}
