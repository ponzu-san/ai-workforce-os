import { agentRepository } from "@/database/repositories/agentRepository";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import {
  buildProjectPipelineView,
  type PendingApprovalInput,
} from "@/lib/workflow/pipelineView";
import type { DashboardSummary, ProjectPipelineView } from "@/types/domain";

async function mapPendingApprovalsByProject(
  approvals: Awaited<ReturnType<typeof approvalRepository.findPending>>,
): Promise<Map<string, PendingApprovalInput>> {
  const map = new Map<string, PendingApprovalInput>();

  for (const approval of approvals) {
    const projectId = approval.task.stage.workflow.project.id;
    if (map.has(projectId)) continue;

    const artifact = await artifactRepository.findByTaskId(approval.task_id);

    map.set(projectId, {
      id: approval.id,
      projectId,
      workflowId: approval.task.stage.workflow.id,
      taskId: approval.task_id,
      taskTitle: approval.task.title,
      artifactId: artifact?.id ?? null,
      stageOrder: approval.task.stage.order,
    });
  }

  return map;
}

function calculateOverallProgress(pipelines: ProjectPipelineView[]): number {
  if (pipelines.length === 0) return 0;

  const totalPercent = pipelines.reduce(
    (sum, pipeline) => sum + pipeline.progressPercent,
    0,
  );
  return Math.round(totalPercent / pipelines.length);
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const workspace = await workspaceRepository.findDefault();
    const workspaceId = workspace?.id;

    const [projects, pendingApprovals, pendingApprovalCount, projectCount] =
      await Promise.all([
        workspaceId
          ? projectRepository.findAllWithPipelineByWorkspace(workspaceId)
          : Promise.resolve([]),
        approvalRepository.findPending(),
        approvalRepository.countPending(),
        workspaceId
          ? projectRepository.countByWorkspace(workspaceId)
          : Promise.resolve(0),
      ]);

    const pendingByProject = await mapPendingApprovalsByProject(pendingApprovals);
    const projectPipelines: ProjectPipelineView[] = [];
    const completedPipelines: ProjectPipelineView[] = [];

    for (const project of projects) {
      const pipeline = buildProjectPipelineView(
        {
          id: project.id,
          name: project.name,
          status: project.status,
          workflows: project.workflows.map((workflow) => ({
            id: workflow.id,
            name: workflow.name,
            status: workflow.status,
            current_stage_id: workflow.current_stage_id,
            stages: workflow.stages.map((stage) => ({
              id: stage.id,
              name: stage.name,
              order: stage.order,
              status: stage.status,
              tasks: stage.tasks.map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
              })),
            })),
          })),
        },
        pendingByProject.get(project.id) ?? null,
      );

      if (!pipeline) continue;

      if (
        project.status === "completed" ||
        pipeline.workflowStatus === "completed"
      ) {
        completedPipelines.push(pipeline);
        continue;
      }

      if (project.status === "active" || project.status === "draft") {
        projectPipelines.push(pipeline);
      }
    }

    const allPipelines = [...projectPipelines, ...completedPipelines];

    const pendingWithArtifacts = await Promise.all(
      pendingApprovals.map(async (approval) => {
        const artifact = await artifactRepository.findByTaskId(approval.task_id);
        return {
          id: approval.id,
          taskTitle: approval.task.title,
          projectName: approval.task.stage.workflow.project.name,
          projectId: approval.task.stage.workflow.project.id,
          workflowId: approval.task.stage.workflow.id,
          taskId: approval.task_id,
          artifactId: artifact?.id ?? null,
          stageOrder: approval.task.stage.order,
          status: approval.status,
          created_at: approval.created_at,
        };
      }),
    );

    return {
      projectPipelines,
      completedPipelines,
      pendingApprovals: pendingWithArtifacts,
      stats: {
        projectCount,
        pendingApprovalCount,
        overallProgressPercent: calculateOverallProgress(allPipelines),
      },
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
