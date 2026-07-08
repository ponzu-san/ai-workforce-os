import { approvalRepository } from "@/database/repositories/approvalRepository";
import {
  agentRepository,
  executionLogRepository,
} from "@/database/repositories/agentRepository";
import { clientRepository } from "@/database/repositories/clientRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { taskRepository } from "@/database/repositories/taskRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import type { DashboardSummary } from "@/types/domain";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const workspace = await workspaceRepository.findDefault();
    const workspaceId = workspace?.id;

    const [todayTasks, activeProjects, pendingApprovals, recentExecutions, stats] =
      await Promise.all([
        taskRepository.findTodayTasks(8),
        workspaceId
          ? projectRepository.findAllByWorkspace(workspaceId)
          : Promise.resolve([]),
        approvalRepository.findPending(),
        executionLogRepository.findRecent(5),
        Promise.all([
          workspaceId
            ? projectRepository.countByWorkspace(workspaceId)
            : Promise.resolve(0),
          taskRepository.count(),
          approvalRepository.countPending(),
          workspaceId
            ? clientRepository.countByWorkspace(workspaceId)
            : Promise.resolve(0),
          workspaceId
            ? clientRepository.countLeads(workspaceId)
            : Promise.resolve(0),
        ]),
      ]);

    const [projectCount, taskCount, pendingApprovalCount, clientCount, leadCount] =
      stats;

    return {
      todayTasks: todayTasks.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        projectName: task.stage.workflow.project.name,
        projectId: task.stage.workflow.project.id,
        agentName: task.assigned_agent?.name ?? null,
      })),
      activeProjects: activeProjects
        .filter((p) => p.status === "active" || p.status === "draft")
        .slice(0, 6)
        .map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          taskCount: project.workflows.reduce(
            (sum, w) =>
              sum + w.stages.reduce((s, st) => s + st._count.tasks, 0),
            0,
          ),
          updated_at: project.updated_at,
        })),
      pendingApprovals: pendingApprovals.map((approval) => ({
        id: approval.id,
        taskTitle: approval.task.title,
        projectName: approval.task.stage.workflow.project.name,
        status: approval.status,
        created_at: approval.created_at,
      })),
      recentExecutions: recentExecutions.map((log) => ({
        id: log.id,
        agentName: log.agent.name,
        model: log.model,
        status: log.status,
        created_at: log.created_at,
      })),
      stats: { projectCount, taskCount, pendingApprovalCount, clientCount, leadCount },
    };
  },
};

export const agentService = {
  async getSecretary() {
    return agentRepository.findSecretary();
  },

  async listAgents() {
    return agentRepository.findAll();
  },
};
