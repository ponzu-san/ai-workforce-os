export type ModelTier = "low" | "mid" | "high";

export type TaskKind =
  | "summary"
  | "classification"
  | "planning"
  | "documentation"
  | "coding"
  | "architecture"
  | "secretary";

export interface RouterRequest {
  agentRole: string;
  taskKind: TaskKind;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  agentId: string;
  taskId?: string | null;
}

export interface RouterResponse {
  content: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  cost: number;
}

export interface ModelConfig {
  provider: "openai" | "anthropic";
  model: string;
  tier: ModelTier;
  inputCostPer1M: number;
  outputCostPer1M: number;
}
