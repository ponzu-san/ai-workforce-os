export type {
  ApiError,
  ApiResponse,
  DatabaseHealthResponse,
  HealthResponse,
} from "@/types";

export type ProjectStatus = "draft" | "active" | "completed" | "archived";
export type TaskStatus =
  | "todo"
  | "running"
  | "waiting_external"
  | "review"
  | "done"
  | "blocked";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type WorkflowStatus =
  | "draft"
  | "planning"
  | "running"
  | "waiting_approval"
  | "completed"
  | "failed"
  | "cancelled";

export type ClientStatus = "lead" | "active" | "inactive" | "archived";
export type CommunicationChannel =
  | "email"
  | "meeting"
  | "chat"
  | "phone"
  | "other";
export type ProjectType = "production";

export type ProjectTemplate =
  | "lp_static"
  | "lp_form"
  | "corporate"
  | "design_only"
  | "custom_blank";

export type StageExecutionMode =
  | "internal_ai"
  | "external_handoff"
  | "human_handoff"
  | "skip";

export type ArtifactContentKind = "markdown" | "url" | "file";

export type PipelineStepStatus = "done" | "run" | "wait";

export type ProjectNextActionType =
  | "review_artifact"
  | "register_external"
  | "start_and_execute"
  | "execute_next"
  | "view_artifacts"
  | "view_workflow"
  | "create_project";

export interface PipelineStep {
  order: number;
  stepNumber: string;
  name: string;
  status: PipelineStepStatus;
  previewTaskTitle: string | null;
}

export interface ProjectNextAction {
  type: ProjectNextActionType;
  labelKey:
    | "reviewContent"
    | "registerExternal"
    | "startFirstStep"
    | "advanceStep"
    | "viewArtifacts"
    | "viewWorkflow"
    | "createProject";
  workflowId?: string;
  approvalId?: string;
  artifactId?: string;
  taskId?: string;
  taskTitle?: string;
  href?: string;
}

export interface ProjectPipelineView {
  projectId: string;
  projectName: string;
  projectStatus: ProjectStatus;
  workflowId: string;
  workflowName: string;
  workflowStatus: WorkflowStatus;
  progressPercent: number;
  completedTasks: number;
  totalTasks: number;
  currentStage: {
    order: number;
    stepNumber: string;
    name: string;
    taskTitle: string;
  } | null;
  steps: PipelineStep[];
  nextAction: ProjectNextAction;
}

export interface DashboardSummary {
  projectPipelines: ProjectPipelineView[];
  completedPipelines: ProjectPipelineView[];
  pendingApprovals: ApprovalSummary[];
  stats: {
    projectCount: number;
    pendingApprovalCount: number;
    overallProgressPercent: number;
  };
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  taskCount: number;
  updated_at: Date;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectName: string;
  projectId: string;
  agentName: string | null;
}

export interface ApprovalSummary {
  id: string;
  taskTitle: string;
  projectName: string;
  projectId: string;
  workflowId: string;
  taskId: string;
  artifactId: string | null;
  stageOrder: number;
  status: ApprovalStatus;
  created_at: Date;
}

export interface ExecutionSummary {
  id: string;
  agentName: string;
  model: string;
  status: string;
  created_at: Date;
}
