import type { ClientStatus, CommunicationChannel } from "@/types/domain";
import { prisma } from "@/database/client";

export const clientRepository = {
  async findAllByWorkspace(workspaceId: string) {
    return prisma.client.findMany({
      where: { workspace_id: workspaceId },
      orderBy: { updated_at: "desc" },
      include: {
        _count: { select: { communications: true, projects: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        communications: { orderBy: { occurred_at: "desc" }, take: 20 },
        projects: {
          orderBy: { updated_at: "desc" },
          include: {
            workflows: {
              include: { stages: { include: { _count: { select: { tasks: true } } } } },
            },
          },
        },
      },
    });
  },

  async create(data: {
    workspace_id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    status?: ClientStatus;
    notes?: string;
  }) {
    return prisma.client.create({
      data: {
        workspace_id: data.workspace_id,
        name: data.name,
        company: data.company ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        status: data.status ?? "lead",
        notes: data.notes ?? "",
      },
    });
  },

  async updateStatus(id: string, status: ClientStatus) {
    return prisma.client.update({ where: { id }, data: { status } });
  },

  async countByWorkspace(workspaceId: string) {
    return prisma.client.count({ where: { workspace_id: workspaceId } });
  },

  async countLeads(workspaceId: string) {
    return prisma.client.count({
      where: { workspace_id: workspaceId, status: "lead" },
    });
  },
};

export const communicationRepository = {
  async create(data: {
    client_id: string;
    channel?: CommunicationChannel;
    subject?: string;
    content?: string;
    occurred_at?: Date;
  }) {
    return prisma.communication.create({
      data: {
        client_id: data.client_id,
        channel: data.channel ?? "email",
        subject: data.subject ?? "",
        content: data.content ?? "",
        occurred_at: data.occurred_at ?? new Date(),
      },
    });
  },

  async findByClientId(clientId: string) {
    return prisma.communication.findMany({
      where: { client_id: clientId },
      orderBy: { occurred_at: "desc" },
    });
  },
};
