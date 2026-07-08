import { z } from "zod";

import {
  clientRepository,
  communicationRepository,
} from "@/database/repositories/clientRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";

const createClientSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["lead", "active", "inactive", "archived"]).optional(),
  notes: z.string().optional(),
});

const createCommunicationSchema = z.object({
  client_id: z.string().uuid(),
  channel: z.enum(["email", "meeting", "chat", "phone", "other"]).optional(),
  subject: z.string().optional(),
  content: z.string().min(1, "内容は必須です"),
});

const createBusinessProjectSchema = z.object({
  client_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  template: z
    .enum(["lp_static", "lp_form", "corporate", "design_only", "custom_blank"])
    .optional(),
});

export const clientService = {
  async list() {
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return [];
    return clientRepository.findAllByWorkspace(workspace.id);
  },

  async getById(id: string) {
    return clientRepository.findById(id);
  },

  async create(input: z.infer<typeof createClientSchema>) {
    const data = createClientSchema.parse(input);
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) throw new Error("Workspace not found");

    return clientRepository.create({
      workspace_id: workspace.id,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      status: data.status,
      notes: data.notes,
    });
  },

  async addCommunication(input: z.infer<typeof createCommunicationSchema>) {
    const data = createCommunicationSchema.parse(input);
    return communicationRepository.create(data);
  },

  async createBusinessProject(
    input: z.infer<typeof createBusinessProjectSchema>,
  ) {
    const data = createBusinessProjectSchema.parse(input);
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) throw new Error("Workspace not found");

    const client = await clientRepository.findById(data.client_id);
    if (!client) throw new Error("Client not found");

    return projectRepository.create({
      workspace_id: workspace.id,
      name: data.name,
      description: data.description ?? `制作プロジェクト: ${client.name}`,
      status: "active",
      client_id: data.client_id,
      template: data.template ?? "lp_static",
    });
  },

  async getStats() {
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) {
      return { clientCount: 0, leadCount: 0 };
    }
    const [clientCount, leadCount] = await Promise.all([
      clientRepository.countByWorkspace(workspace.id),
      clientRepository.countLeads(workspace.id),
    ]);
    return { clientCount, leadCount };
  },

  createClientSchema,
  createCommunicationSchema,
  createBusinessProjectSchema,
};
