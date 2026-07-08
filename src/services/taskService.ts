import { z } from "zod";

import { approvalRepository } from "@/database/repositories/approvalRepository";
import { agentRepository } from "@/database/repositories/agentRepository";
import { taskRepository } from "@/database/repositories/taskRepository";
import { workflowRepository } from "@/database/repositories/workflowRepository";

const createTaskSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).optional(),
  assigned_agent_id: z.string().uuid().optional().nullable(),
});

const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "running", "review", "done", "blocked"]),
});

export const taskService = {
  async list() {
    return taskRepository.findAll();
  },

  async getById(id: string) {
    return taskRepository.findById(id);
  },

  async listByProject(projectId: string) {
    return taskRepository.findByProjectId(projectId);
  },

  async create(input: z.infer<typeof createTaskSchema>) {
    const data = createTaskSchema.parse(input);
    const stage = await workflowRepository.getDefaultStageForProject(
      data.project_id,
    );
    if (!stage) {
      throw new Error("Default stage not found for project");
    }

    const secretary = await agentRepository.findSecretary();
    const agentId = data.assigned_agent_id ?? secretary?.id ?? null;

    const task = await taskRepository.create({
      stage_id: stage.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assigned_agent_id: agentId,
    });

    if (data.priority === "critical" || data.priority === "high") {
      await approvalRepository.createForTask(task.id);
      await taskRepository.updateStatus(task.id, "review");
    }

    return taskRepository.findById(task.id);
  },

  async updateStatus(id: string, input: z.infer<typeof updateTaskStatusSchema>) {
    const data = updateTaskStatusSchema.parse(input);
    const task = await taskRepository.updateStatus(id, data.status);

    if (data.status === "review") {
      const existing = await approvalRepository.findPending();
      const hasPending = existing.some((a) => a.task_id === id);
      if (!hasPending) {
        await approvalRepository.createForTask(id);
      }
    }

    return task;
  },

  createTaskSchema,
  updateTaskStatusSchema,
};
