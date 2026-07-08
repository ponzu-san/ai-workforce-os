import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { getActiveProjectId } from "@/lib/project/activeProject.server";
import { resolveOpenStageOrder } from "@/lib/workflow/pipelineView";
import { projectPipelineService } from "@/services/projectPipelineService";
import { workflowService } from "@/services/workflowService";

export function buildStagePath(projectId: string, stageOrder: number): string {
  return `/p/${projectId}/stages/${stageOrder}`;
}

export function buildProjectEntryPath(projectId: string): string {
  return `/p/${projectId}`;
}

export const navigationRedirectService = {
  async resolveActiveProjectStagePath(): Promise<string> {
    const activeProjectId = await getActiveProjectId();
    if (!activeProjectId) return "/";

    const pipeline =
      await projectPipelineService.getPipelineView(activeProjectId);
    if (!pipeline) return "/";

    return buildStagePath(
      activeProjectId,
      resolveOpenStageOrder(pipeline),
    );
  },

  async resolveWorkflowStagePath(workflowId: string): Promise<string | null> {
    const workflow = await workflowService.getById(workflowId);
    if (!workflow) return null;

    const pipeline = await projectPipelineService.getPipelineView(
      workflow.project.id,
    );
    if (!pipeline) return buildProjectEntryPath(workflow.project.id);

    return buildStagePath(
      workflow.project.id,
      resolveOpenStageOrder(pipeline),
    );
  },

  async resolveArtifactStagePath(artifactId: string): Promise<string | null> {
    const artifact = await artifactRepository.findById(artifactId);
    if (!artifact) return null;

    const projectId = artifact.task.stage.workflow.project.id;
    const stageOrder = artifact.task.stage.order;

    return buildStagePath(projectId, stageOrder);
  },

  async resolveApprovalEntryPath(): Promise<string> {
    const activeProjectId = await getActiveProjectId();

    if (activeProjectId) {
      const pipeline =
        await projectPipelineService.getPipelineView(activeProjectId);
      if (
        pipeline?.nextAction.type === "review_artifact" &&
        pipeline.currentStage
      ) {
        return buildStagePath(
          activeProjectId,
          pipeline.currentStage.order,
        );
      }
    }

    const pending = await approvalRepository.findPending();
    const firstPending = pending[0];
    if (firstPending) {
      const projectId = firstPending.task.stage.workflow.project.id;
      const stageOrder = firstPending.task.stage.order;
      return buildStagePath(projectId, stageOrder);
    }

    return this.resolveActiveProjectStagePath();
  },

  async resolveArtifactsEntryPath(): Promise<string> {
    const activeProjectId = await getActiveProjectId();
    if (!activeProjectId) return "/";

    const pipeline =
      await projectPipelineService.getPipelineView(activeProjectId);
    if (!pipeline) return "/";

    const runStep = pipeline.steps.find((step) => step.status === "run");
    if (runStep) {
      return buildStagePath(activeProjectId, runStep.order);
    }

    return buildStagePath(
      activeProjectId,
      resolveOpenStageOrder(pipeline),
    );
  },
};
