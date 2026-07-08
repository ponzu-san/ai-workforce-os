export type {
  ApiError,
  ApiResponse,
  DatabaseHealthResponse,
  HealthResponse,
} from "@/types";

export type ProjectStatus = "draft" | "active" | "completed" | "archived";
export type TaskStatus = "todo" | "running" | "review" | "done" | "blocked";
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
export type ProjectType = "development" | "business";

export interface DashboardSummary {
  todayTasks: TaskSummary[];
  activeProjects: ProjectSummary[];
  pendingApprovals: ApprovalSummary[];
  recentExecutions: ExecutionSummary[];
  stats: {
    projectCount: number;
    taskCount: number;
    pendingApprovalCount: number;
    clientCount: number;
    leadCount: number;
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
