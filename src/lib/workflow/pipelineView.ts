import { displayStageName } from "@/lib/labels/stageNames";
import type {
  PipelineStep,
  PipelineStepStatus,
  ProjectNextAction,
  ProjectNextActionType,
  ProjectPipelineView,
  ProjectStatus,
  WorkflowStatus,
} from "@/types/domain";

export interface PipelineTaskInput {
  id: string;
  title: string;
  status: string;
}

export interface PipelineStageInput {
  id: string;
  name: string;
  order: number;
  status: string;
  tasks: PipelineTaskInput[];
}

export interface PipelineWorkflowInput {
  id: string;
  name: string;
  status: WorkflowStatus;
  current_stage_id: string | null;
  stages: PipelineStageInput[];
}

export interface PipelineProjectInput {
  id: string;
  name: string;
  status: ProjectStatus;
  workflows: PipelineWorkflowInput[];
}

export interface PendingApprovalInput {
  id: string;
  projectId: string;
  workflowId: string;
  taskId: string;
  taskTitle: string;
  artifactId: string | null;
  stageOrder: number;
}

function stagePath(projectId: string, stageOrder: number): string {
  return `/p/${projectId}/stages/${stageOrder}`;
}

function formatStepNumber(order: number): string {
  return String(order + 1).padStart(2, "0");
}

function isStageCompleted(stage: PipelineStageInput): boolean {
  const allTasksDone =
    stage.tasks.length > 0 &&
    stage.tasks.every((task) => task.status === "done");

  return stage.status === "completed" || allTasksDone;
}

function findActiveTask(stage: PipelineStageInput): PipelineTaskInput | undefined {
  return (
    stage.tasks.find((task) => task.status === "waiting_external") ??
    stage.tasks.find(
      (task) => task.status === "running" || task.status === "review",
    )
  );
}

function buildSteps(stages: PipelineStageInput[]): PipelineStep[] {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  const runIndex = sorted.findIndex((stage) => !isStageCompleted(stage));

  return sorted.map((stage, index) => {
    const activeTask = findActiveTask(stage);
    const previewTaskTitle =
      activeTask?.title ?? stage.tasks[0]?.title ?? null;

    let status: PipelineStepStatus;
    if (isStageCompleted(stage)) {
      status = "done";
    } else if (index === runIndex) {
      status = "run";
    } else {
      status = "wait";
    }

    return {
      order: stage.order,
      stepNumber: formatStepNumber(stage.order),
      name: displayStageName(stage.name),
      status,
      previewTaskTitle,
    };
  });
}

function findCurrentStage(
  stages: PipelineStageInput[],
  steps: PipelineStep[],
): ProjectPipelineView["currentStage"] {
  const runningStep = steps.find((step) => step.status === "run");
  if (runningStep) {
    const stage = stages.find((item) => item.order === runningStep.order);
    const activeTask = stage ? findActiveTask(stage) : undefined;
    return {
      order: runningStep.order,
      stepNumber: runningStep.stepNumber,
      name: runningStep.name,
      taskTitle: activeTask?.title ?? stage?.tasks[0]?.title ?? "",
    };
  }

  const nextWaitStep = steps.find((step) => step.status === "wait");
  if (nextWaitStep) {
    const stage = stages.find((item) => item.order === nextWaitStep.order);
    return {
      order: nextWaitStep.order,
      stepNumber: nextWaitStep.stepNumber,
      name: nextWaitStep.name,
      taskTitle: stage?.tasks[0]?.title ?? "",
    };
  }

  const lastStep = steps[steps.length - 1];
  if (lastStep) {
    const stage = stages.find((item) => item.order === lastStep.order);
    return {
      order: lastStep.order,
      stepNumber: lastStep.stepNumber,
      name: lastStep.name,
      taskTitle: stage?.tasks[0]?.title ?? "",
    };
  }

  return null;
}

function deriveNextAction(
  projectId: string,
  workflow: PipelineWorkflowInput,
  pendingApproval: PendingApprovalInput | null,
  openStageOrder: number,
): ProjectNextAction {
  if (pendingApproval) {
    const artifactHref = pendingApproval.artifactId
      ? `/artifacts/${pendingApproval.artifactId}`
      : stagePath(projectId, pendingApproval.stageOrder);

    return {
      type: "review_artifact",
      labelKey: "reviewContent",
      workflowId: workflow.id,
      approvalId: pendingApproval.id,
      artifactId: pendingApproval.artifactId ?? undefined,
      taskId: pendingApproval.taskId,
      taskTitle: pendingApproval.taskTitle,
      href: artifactHref,
    };
  }

  const allTasks = workflow.stages.flatMap((stage) => stage.tasks);
  const hasTodoTask = allTasks.some((task) => task.status === "todo");
  const hasWaitingExternal = allTasks.some(
    (task) => task.status === "waiting_external",
  );
  const allTodo =
    allTasks.length > 0 && allTasks.every((task) => task.status === "todo");
  const allDone =
    allTasks.length > 0 && allTasks.every((task) => task.status === "done");

  if (workflow.status === "completed") {
    if (allTasks.length === 0 || !allDone) {
      if (allTodo || allTasks.length === 0) {
        return {
          type: "start_and_execute",
          labelKey: "startFirstStep",
          workflowId: workflow.id,
        };
      }

      return {
        type: "execute_next",
        labelKey: "advanceStep",
        workflowId: workflow.id,
      };
    }

    return {
      type: "view_artifacts",
      labelKey: "viewArtifacts",
      workflowId: workflow.id,
      href: stagePath(projectId, openStageOrder),
    };
  }

  if (
    workflow.status === "planning" ||
    workflow.status === "draft" ||
    allTodo
  ) {
    return {
      type: "start_and_execute",
      labelKey: "startFirstStep",
      workflowId: workflow.id,
    };
  }

  if (
    (workflow.status === "running" || workflow.status === "waiting_approval") &&
    hasTodoTask &&
    !hasWaitingExternal
  ) {
    return {
      type: "execute_next",
      labelKey: "advanceStep",
      workflowId: workflow.id,
    };
  }

  return {
    type: "view_workflow",
    labelKey: "viewWorkflow",
    workflowId: workflow.id,
    href: stagePath(projectId, openStageOrder),
  };
}

export function deriveStageNextAction(
  projectId: string,
  workflow: PipelineWorkflowInput,
  stageOrder: number,
  stepStatus: PipelineStepStatus,
  pendingApproval: PendingApprovalInput | null,
  stageArtifactCount: number,
  firstStageArtifactId: string | null = null,
): ProjectNextAction | null {
  if (stepStatus === "wait") return null;

  const stage = workflow.stages.find((item) => item.order === stageOrder);
  if (!stage) return null;

  const stageTasks = stage.tasks;
  const allWorkflowTasks = workflow.stages.flatMap((item) => item.tasks);
  const allWorkflowTodo =
    allWorkflowTasks.length > 0 &&
    allWorkflowTasks.every((task) => task.status === "todo");
  const hasReviewInStage = stageTasks.some((task) => task.status === "review");
  const waitingExternalTask = stageTasks.find(
    (task) => task.status === "waiting_external",
  );

  if (stepStatus === "done") {
    if (stageArtifactCount > 0) {
      return {
        type: "view_artifacts",
        labelKey: "viewArtifacts",
        workflowId: workflow.id,
        href: stagePath(projectId, stageOrder),
      };
    }

    return null;
  }

  if (waitingExternalTask) {
    return {
      type: "register_external",
      labelKey: "registerExternal",
      workflowId: workflow.id,
      taskId: waitingExternalTask.id,
      taskTitle: waitingExternalTask.title,
    };
  }

  if (pendingApproval) {
    const approvalInStage = stageTasks.some(
      (task) => task.id === pendingApproval.taskId,
    );
    if (approvalInStage) {
      const artifactHref = pendingApproval.artifactId
        ? `/artifacts/${pendingApproval.artifactId}`
        : stagePath(projectId, pendingApproval.stageOrder);

      return {
        type: "review_artifact",
        labelKey: "reviewContent",
        workflowId: workflow.id,
        approvalId: pendingApproval.id,
        artifactId: pendingApproval.artifactId ?? undefined,
        taskId: pendingApproval.taskId,
        taskTitle: pendingApproval.taskTitle,
        href: artifactHref,
      };
    }
  }

  if (hasReviewInStage) {
    const reviewTask = stageTasks.find((task) => task.status === "review");
    const artifactHref = firstStageArtifactId
      ? `/artifacts/${firstStageArtifactId}`
      : stagePath(projectId, stageOrder);

    return {
      type: "review_artifact",
      labelKey: "reviewContent",
      workflowId: workflow.id,
      taskId: reviewTask?.id,
      taskTitle: reviewTask?.title,
      href: artifactHref,
    };
  }

  if (stageTasks.length === 0) {
    return null;
  }

  const hasExecutableInStage = stageTasks.some(
    (task) => task.status === "todo" || task.status === "running",
  );
  if (!hasExecutableInStage || waitingExternalTask) {
    return null;
  }

  const nextTaskTitle =
    stageTasks.find((task) => task.status === "todo" || task.status === "running")
      ?.title ?? stageTasks[0]?.title;

  const shouldStartFirst =
    workflow.status === "planning" ||
    workflow.status === "draft" ||
    allWorkflowTodo ||
    (workflow.status === "completed" && allWorkflowTodo);

  if (shouldStartFirst) {
    return {
      type: "start_and_execute",
      labelKey: "startFirstStep",
      workflowId: workflow.id,
      taskTitle: nextTaskTitle,
    };
  }

  return {
    type: "execute_next",
    labelKey: "advanceStep",
    workflowId: workflow.id,
    taskTitle: nextTaskTitle,
  };
}

export function buildProjectPipelineView(
  project: PipelineProjectInput,
  pendingApproval: PendingApprovalInput | null,
): ProjectPipelineView | null {
  const workflow = project.workflows[0];
  if (!workflow) return null;

  const stages = [...workflow.stages].sort((a, b) => a.order - b.order);
  const steps = buildSteps(stages);
  const allTasks = stages.flatMap((stage) => stage.tasks);
  const completedTasks = allTasks.filter((task) => task.status === "done").length;
  const totalTasks = allTasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentStage = findCurrentStage(stages, steps);
  const openStageOrder =
    currentStage?.order ?? steps[0]?.order ?? 0;

  return {
    projectId: project.id,
    projectName: project.name,
    projectStatus: project.status,
    workflowId: workflow.id,
    workflowName: workflow.name,
    workflowStatus: workflow.status,
    progressPercent,
    completedTasks,
    totalTasks,
    currentStage,
    steps,
    nextAction: deriveNextAction(
      project.id,
      workflow,
      pendingApproval,
      openStageOrder,
    ),
  };
}

export function resolveOpenStageOrder(pipeline: ProjectPipelineView): number {
  if (pipeline.currentStage) {
    return pipeline.currentStage.order;
  }

  if (pipeline.steps.length > 0) {
    return pipeline.steps[0].order;
  }

  return 0;
}

export function getStepByOrder(
  pipeline: ProjectPipelineView,
  order: number,
): PipelineStep | undefined {
  return pipeline.steps.find((step) => step.order === order);
}

export function buildEmptyPipelineGuideAction(): ProjectNextAction {
  return {
    type: "create_project",
    labelKey: "createProject",
    href: "/projects",
  };
}

export const STEP_COLOR_CLASSES = [
  "bg-yellow-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-pink-300",
  "bg-purple-300",
] as const;

export function getStepColorClass(order: number): string {
  return STEP_COLOR_CLASSES[order % STEP_COLOR_CLASSES.length];
}

export function isActionableType(type: ProjectNextActionType): boolean {
  return (
    type === "start_and_execute" ||
    type === "execute_next" ||
    type === "register_external"
  );
}
