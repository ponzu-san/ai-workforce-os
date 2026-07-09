import type { ModelConfig, ModelTier, TaskKind } from "@/ai/router/types";

const MODELS: ModelConfig[] = [
  {
    provider: "openai",
    model: "gpt-4o-mini",
    tier: "low",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
  },
  {
    provider: "openai",
    model: "gpt-4o",
    tier: "high",
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  },
  {
    provider: "anthropic",
    // Active Haiku (claude-3-5-haiku-20241022 retired 2026-02-19)
    // Docs: https://platform.claude.com/docs/en/about-claude/models/overview
    model: "claude-haiku-4-5-20251001",
    tier: "mid",
    inputCostPer1M: 1.0,
    outputCostPer1M: 5.0,
  },
];

export function selectModel(taskKind: TaskKind): ModelConfig {
  const tier: ModelTier =
    taskKind === "architecture" || taskKind === "coding"
      ? "high"
      : taskKind === "planning" || taskKind === "documentation"
        ? "mid"
        : "low";

  const preferred = MODELS.find((m) => m.tier === tier) ?? MODELS[0];

  if (preferred.provider === "openai" && process.env.OPENAI_API_KEY) {
    return preferred;
  }
  if (preferred.provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return preferred;
  }
  if (process.env.OPENAI_API_KEY) {
    return MODELS.find((m) => m.provider === "openai") ?? MODELS[0];
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return MODELS.find((m) => m.provider === "anthropic") ?? MODELS[0];
  }

  return preferred;
}

export function estimateCost(
  model: ModelConfig,
  inputTokens: number,
  outputTokens: number,
): number {
  const inputCost = (inputTokens / 1_000_000) * model.inputCostPer1M;
  const outputCost = (outputTokens / 1_000_000) * model.outputCostPer1M;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}
