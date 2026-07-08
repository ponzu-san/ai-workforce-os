"use server";

import { revalidatePath } from "next/cache";

import { taskService } from "@/services/taskService";

export async function createTaskAction(formData: FormData): Promise<void> {
  const title = formData.get("title");
  const description = formData.get("description");
  const projectId = formData.get("project_id");
  const priority = formData.get("priority");

  if (typeof title !== "string" || title.trim().length === 0) {
    return;
  }
  if (typeof projectId !== "string") {
    return;
  }

  try {
    await taskService.create({
      project_id: projectId,
      title: title.trim(),
      description: typeof description === "string" ? description : "",
      priority:
        priority === "critical" ||
        priority === "high" ||
        priority === "medium" ||
        priority === "low"
          ? priority
          : "medium",
    });
    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/approvals");
  } catch {
    return;
  }
}

export async function updateTaskStatusAction(
  taskId: string,
  status: string,
): Promise<void> {
  if (
    status !== "todo" &&
    status !== "running" &&
    status !== "review" &&
    status !== "done" &&
    status !== "blocked"
  ) {
    return;
  }

  try {
    await taskService.updateStatus(taskId, { status });
    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath("/approvals");
  } catch {
    return;
  }
}
