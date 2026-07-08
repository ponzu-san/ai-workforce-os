export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface HealthResponse {
  status: "ok";
  version: string;
}

export interface DatabaseHealthResponse {
  status: "ok" | "error";
  database: "connected" | "disconnected";
  workspaceCount?: number;
}
