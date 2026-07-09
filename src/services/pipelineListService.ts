import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import {
  buildProjectPipelineView,
  type PendingApprovalInput,
} from "@/lib/workflow/pipelineView";
import type { ProjectPipelineView } from "@/types/domain";

type ProjectWithPipeline = Awaited<
  ReturnType<typeof projectRepository.findAllWithPipelineByWorkspace>
>[number];

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

function toPipelineInput(project: ProjectWithPipeline) {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    updated_at: project.updated_at,
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
  };
}

export async function buildPipelinesForProjects(
  projects: ProjectWithPipeline[],
): Promise<ProjectPipelineView[]> {
  const pendingApprovals = await approvalRepository.findPending();
  const pendingByProject = await mapPendingApprovalsByProject(pendingApprovals);
  const pipelines: ProjectPipelineView[] = [];

  for (const project of projects) {
    const pipeline = buildProjectPipelineView(
      toPipelineInput(project),
      pendingByProject.get(project.id) ?? null,
    );
    if (pipeline) pipelines.push(pipeline);
  }

  return pipelines;
}

export const pipelineListService = {
  async listCompletedPipelines(): Promise<ProjectPipelineView[]> {
    const { workspaceRepository } = await import(
      "@/database/repositories/workspaceRepository"
    );
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return [];

    const projects = await projectRepository.findAllWithPipelineByWorkspace(
      workspace.id,
    );
    const completedProjects = projects.filter(
      (project) => project.status === "completed",
    );

    return buildPipelinesForProjects(completedProjects);
  },
};
