import { z } from "zod";

import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";

const createProjectSchema = z.object({
  name: z.string().min(1, "プロジェクト名は必須です"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).optional(),
  deadline: z.string().optional().nullable(),
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
      type: "development",
    });
  },

  createProjectSchema,
};
