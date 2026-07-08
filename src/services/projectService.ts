import { z } from "zod";

import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import type { ProjectTemplate } from "@/types/domain";

const projectTemplateSchema = z.enum([
  "lp_static",
  "lp_form",
  "corporate",
  "design_only",
  "custom_blank",
]);

const createProjectSchema = z.object({
  name: z.string().min(1, "プロジェクト名は必須です"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).optional(),
  deadline: z.string().optional().nullable(),
  template: projectTemplateSchema.optional(),
  client_id: z.string().uuid().optional().nullable(),
  stageModeOverrides: z
    .record(
      z.string(),
      z.enum(["internal_ai", "external_handoff", "human_handoff", "skip"]),
    )
    .optional(),
});

export const projectService = {
  async list() {
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return [];
    return projectRepository.findAllByWorkspace(workspace.id);
  },

  async getById(id: string) {
    return projectRepository.findById(id);
  },

  async create(input: z.infer<typeof createProjectSchema>) {
    const data = createProjectSchema.parse(input);
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return projectRepository.create({
      workspace_id: workspace.id,
      name: data.name,
      description: data.description,
      status: data.status,
      deadline: data.deadline ? new Date(data.deadline) : null,
      client_id: data.client_id ?? null,
      template: (data.template ?? "lp_static") as ProjectTemplate,
      stageModeOverrides: data.stageModeOverrides,
    });
  },

  createProjectSchema,
  projectTemplateSchema,
};
