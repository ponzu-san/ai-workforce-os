import type { ProjectPipelineView, ProjectStatus } from "@/types/domain";

type WorkflowTask = { status: string };

type WorkflowStage = { tasks: WorkflowTask[] };

type WorkflowLike = { status: string; stages: WorkflowStage[] };

type ProjectLike = {
  status: ProjectStatus;
  workflows: WorkflowLike[];
};

export function isProjectWorkflowFinished(project: ProjectLike): boolean {
  const workflow = project.workflows[0];
  if (!workflow) return false;

  const tasks = workflow.stages.flatMap((stage) => stage.tasks);
  return tasks.length > 0 && tasks.every((task) => task.status === "done");
}

export function isProjectReadyToComplete(project: ProjectLike): boolean {
  if (project.status === "completed") return false;
  const workflow = project.workflows[0];
  if (!workflow) return false;

  return (
    workflow.status === "completed" || isProjectWorkflowFinished(project)
  );
}

export function isProjectManuallyCompleted(project: ProjectLike): boolean {
  return project.status === "completed";
}

export function isPipelineReadyToComplete(
  pipeline: ProjectPipelineView,
): boolean {
  if (pipeline.projectStatus === "completed") return false;

  return (
    pipeline.workflowStatus === "completed" ||
    (pipeline.totalTasks > 0 &&
      pipeline.completedTasks === pipeline.totalTasks)
  );
}
