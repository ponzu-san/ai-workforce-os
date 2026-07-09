import { agentRepository } from "@/database/repositories/agentRepository";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import { isProjectManuallyCompleted } from "@/lib/workflow/projectCompletion";
import { buildPipelinesForProjects } from "@/services/pipelineListService";
import type { DashboardSummary, ProjectPipelineView } from "@/types/domain";

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

    const [
      projects,
      pendingApprovals,
      pendingApprovalCount,
      projectCount,
      completedProjectCount,
    ] = await Promise.all([
      workspaceId
        ? projectRepository.findAllWithPipelineByWorkspace(workspaceId)
        : Promise.resolve([]),
      approvalRepository.findPending(),
      approvalRepository.countPending(),
      workspaceId
        ? projectRepository.countByWorkspace(workspaceId)
        : Promise.resolve(0),
      workspaceId
        ? projectRepository.countCompletedByWorkspace(workspaceId)
        : Promise.resolve(0),
    ]);

    const activeProjects = projects.filter(
      (project) => !isProjectManuallyCompleted(project),
    );
    const completedProjects = projects.filter((project) =>
      isProjectManuallyCompleted(project),
    );

    const [projectPipelines, completedPipelines] = await Promise.all([
      buildPipelinesForProjects(activeProjects),
      buildPipelinesForProjects(completedProjects),
    ]);

    const allActivePipelines = projectPipelines;

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
        overallProgressPercent: calculateOverallProgress(allActivePipelines),
        completedProjectCount,
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
