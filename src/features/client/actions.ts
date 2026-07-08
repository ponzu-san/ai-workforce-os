"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { workflowRepository } from "@/database/repositories/workflowRepository";
import { clientService } from "@/services/clientService";
import { buildProjectEntryPath } from "@/services/navigationRedirectService";

export async function createClientAction(formData: FormData): Promise<void> {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim().length === 0) return;

  try {
    await clientService.create({
      name: name.trim(),
      company:
        typeof formData.get("company") === "string"
          ? String(formData.get("company"))
          : "",
      email:
        typeof formData.get("email") === "string"
          ? String(formData.get("email"))
          : "",
      status: "lead",
    });
    revalidatePath("/clients");
    revalidatePath("/");
  } catch {
    return;
  }
}

export async function addCommunicationAction(formData: FormData): Promise<void> {
  const clientId = formData.get("client_id");
  const content = formData.get("content");
  if (typeof clientId !== "string" || typeof content !== "string") return;

  try {
    await clientService.addCommunication({
      client_id: clientId,
      channel:
        formData.get("channel") === "meeting"
          ? "meeting"
          : formData.get("channel") === "phone"
            ? "phone"
            : "email",
      subject:
        typeof formData.get("subject") === "string"
          ? String(formData.get("subject"))
          : "",
      content: content.trim(),
    });
    revalidatePath(`/clients/${clientId}`);
  } catch {
    return;
  }
}

export async function createBusinessProjectAction(
  formData: FormData,
): Promise<void> {
  const clientId = formData.get("client_id");
  const name = formData.get("name");
  if (typeof clientId !== "string" || typeof name !== "string") return;

  let projectId: string | null = null;
  let errorMessage: string | null = null;

  try {
    const project = await clientService.createBusinessProject({
      client_id: clientId,
      name: name.trim(),
      description:
        typeof formData.get("description") === "string"
          ? String(formData.get("description"))
          : "",
    });
    const workflows = await workflowRepository.findByProjectId(project.id);
    projectId = workflows[0] ? project.id : null;

    revalidatePath("/clients");
    revalidatePath("/projects");
    revalidatePath("/workflows");
    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/projects/${project.id}`);
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Project creation failed";
  }

  if (errorMessage || !projectId) {
    redirect(
      `/clients/${clientId}?error=${encodeURIComponent(errorMessage ?? "Workflow not found")}`,
    );
  }

  redirect(buildProjectEntryPath(projectId));
}

export async function activateClientAction(formData: FormData): Promise<void> {
  const clientId = formData.get("client_id");
  if (typeof clientId !== "string") return;

  const { clientRepository } = await import(
    "@/database/repositories/clientRepository"
  );
  await clientRepository.updateStatus(clientId, "active");
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}
