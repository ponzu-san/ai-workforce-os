import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import { getActiveProjectId } from "@/lib/project/activeProject.server";
import {
  buildProjectPipelineView,
  deriveStageNextAction,
  getStepByOrder,
  type PendingApprovalInput,
} from "@/lib/workflow/pipelineView";
import type {
  PipelineStep,
  ProjectNextAction,
  ProjectPipelineView,
} from "@/types/domain";

async function mapPendingApprovalForProject(
  projectId: string,
): Promise<PendingApprovalInput | null> {
  const pending = await approvalRepository.findPending();
  const approval = pending.find(
    (item) => item.task.stage.workflow.project.id === projectId,
  );
  if (!approval) return null;

  const artifact = await artifactRepository.findByTaskId(approval.task_id);

  return {
    id: approval.id,
    projectId,
    workflowId: approval.task.stage.workflow.id,
    taskId: approval.task_id,
    taskTitle: approval.task.title,
    artifactId: artifact?.id ?? null,
    stageOrder: approval.task.stage.order,
  };
}

function mapProjectToPipelineInput(
  project: Awaited<
    ReturnType<typeof projectRepository.findAllWithPipelineByWorkspace>
  >[number],
) {
  return {
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
  };
}

export interface ProjectOption {
  id: string;
  name: string;
  progressPercent: number;
  currentStageLabel: string | null;
}

export interface ActiveProjectSummary {
  id: string;
  name: string;
  progressPercent: number;
  currentStageLabel: string | null;
  currentStageOrder: number | null;
}

export interface StageArtifactSummary {
  id: string;
  name: string;
  type: string;
  taskTitle: string;
  preview: string;
}

export interface StagePageContext {
  pipeline: ProjectPipelineView;
  artifacts: StageArtifactSummary[];
  pendingApprovalId: string | null;
  pendingArtifactId: string | null;
  stageNextAction: ProjectNextAction | null;
}

export const projectPipelineService = {
  async listPipelineViews(): Promise<ProjectPipelineView[]> {
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return [];

    const projects = await projectRepository.findAllWithPipelineByWorkspace(
      workspace.id,
    );
    const pending = await approvalRepository.findPending();
    const pendingByProject = new Map<string, PendingApprovalInput>();

    for (const approval of pending) {
      const projectId = approval.task.stage.workflow.project.id;
      if (pendingByProject.has(projectId)) continue;

      const artifact = await artifactRepository.findByTaskId(approval.task_id);
      pendingByProject.set(projectId, {
        id: approval.id,
        projectId,
        workflowId: approval.task.stage.workflow.id,
        taskId: approval.task_id,
        taskTitle: approval.task.title,
        artifactId: artifact?.id ?? null,
        stageOrder: approval.task.stage.order,
      });
    }

    const pipelines: ProjectPipelineView[] = [];

    for (const project of projects) {
      const pipeline = buildProjectPipelineView(
        mapProjectToPipelineInput(project),
        pendingByProject.get(project.id) ?? null,
      );
      if (pipeline) pipelines.push(pipeline);
    }

    return pipelines;
  },

  async getPipelineView(projectId: string): Promise<ProjectPipelineView | null> {
    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return null;

    const projects = await projectRepository.findAllWithPipelineByWorkspace(
      workspace.id,
    );
    const project = projects.find((item) => item.id === projectId);
    if (!project) return null;

    const pendingApproval = await mapPendingApprovalForProject(projectId);

    return buildProjectPipelineView(
      mapProjectToPipelineInput(project),
      pendingApproval,
    );
  },

  async getStagePageContext(
    projectId: string,
    stageOrder: number,
  ): Promise<StagePageContext | null> {
    const pipeline = await this.getPipelineView(projectId);
    if (!pipeline) return null;

    const workspace = await workspaceRepository.findDefault();
    if (!workspace) return null;

    const projects = await projectRepository.findAllWithPipelineByWorkspace(
      workspace.id,
    );
    const project = projects.find((item) => item.id === projectId);
    if (!project) return null;

    const workflow = project.workflows[0];
    if (!workflow) return null;

    const stage = workflow.stages.find((item) => item.order === stageOrder);
    if (!stage) return null;

    const allArtifacts = await artifactRepository.findByWorkflowId(workflow.id);
    const artifacts: StageArtifactSummary[] = allArtifacts
      .filter((artifact) => artifact.task.stage.order === stageOrder)
      .map((artifact) => ({
        id: artifact.id,
        name: artifact.name,
        type: artifact.type,
        taskTitle: artifact.task.title,
        preview:
          artifact.content_kind === "url" && artifact.external_url
            ? artifact.external_url
            : artifact.content_kind === "file" && artifact.file_path
              ? artifact.file_path
              : artifact.content.length > 200
                ? `${artifact.content.slice(0, 200)}...`
                : artifact.content,
      }));

    const workflowInput = mapProjectToPipelineInput(project).workflows[0];
    if (!workflowInput) return null;

    const pendingApproval = await mapPendingApprovalForProject(projectId);
    const step = getStepByOrder(pipeline, stageOrder);
    if (!step) return null;

    const stagePendingApproval =
      pendingApproval &&
      stage.tasks.some((task) => task.id === pendingApproval.taskId)
        ? pendingApproval
        : null;

    const stageNextAction = deriveStageNextAction(
      projectId,
      workflowInput,
      stageOrder,
      step.status,
      stagePendingApproval,
      artifacts.length,
      artifacts[0]?.id ?? null,
    );

    let pendingApprovalId: string | null = null;
    let pendingArtifactId: string | null = null;

    if (
      stageNextAction?.type === "review_artifact" &&
      stageNextAction.approvalId
    ) {
      pendingApprovalId = stageNextAction.approvalId;
      pendingArtifactId = stageNextAction.artifactId ?? null;
    }

    return {
      pipeline,
      artifacts,
      pendingApprovalId,
      pendingArtifactId,
      stageNextAction,
    };
  },

  async getShellProjectContext(): Promise<{
    projectOptions: ProjectOption[];
    activeProject: ActiveProjectSummary | null;
    activeProjectSteps: PipelineStep[];
  }> {
    const pipelines = await this.listPipelineViews();
    const activeProjectId = await getActiveProjectId();

    const projectOptions: ProjectOption[] = pipelines
      .filter(
        (pipeline) =>
          pipeline.projectStatus === "active" ||
          pipeline.projectStatus === "draft" ||
          pipeline.workflowStatus !== "completed",
      )
      .map((pipeline) => ({
        id: pipeline.projectId,
        name: pipeline.projectName,
        progressPercent: pipeline.progressPercent,
        currentStageLabel: pipeline.currentStage?.name ?? null,
      }));

    const activePipeline = activeProjectId
      ? pipelines.find((pipeline) => pipeline.projectId === activeProjectId)
      : null;

    const activeProject = activePipeline
      ? {
          id: activePipeline.projectId,
          name: activePipeline.projectName,
          progressPercent: activePipeline.progressPercent,
          currentStageLabel: activePipeline.currentStage?.name ?? null,
          currentStageOrder: activePipeline.currentStage?.order ?? null,
        }
      : null;

    return {
      projectOptions,
      activeProject,
      activeProjectSteps: activePipeline?.steps ?? [],
    };
  },
};
