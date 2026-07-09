import type { TaskKind } from "@/ai/router/types";
import type { StageExecutionMode } from "@/types/domain";

const HANDOFF_MAX_OUTPUT_TOKENS = 3_500;

const TASK_KIND_MAX_OUTPUT_TOKENS: Record<TaskKind, number> = {
  secretary: 1_200,
  summary: 800,
  classification: 800,
  planning: 3_000,
  documentation: 3_000,
  coding: 5_000,
  architecture: 5_000,
};

/**
 * Resolve max output tokens for a router request.
 * Handoff modes use a fixed mid-range budget (long enough for briefs, not unlimited).
 */
export function resolveMaxOutputTokens(
  taskKind: TaskKind,
  executionMode?: StageExecutionMode,
): number {
  if (
    executionMode === "external_handoff" ||
    executionMode === "human_handoff"
  ) {
    return HANDOFF_MAX_OUTPUT_TOKENS;
  }

  return TASK_KIND_MAX_OUTPUT_TOKENS[taskKind] ?? 3_000;
}
