import { executeRouterRequest } from "@/ai/router/executeRequest";
import { resolveMaxOutputTokens } from "@/ai/router/tokenBudget";
import { getAgentDefinition } from "@/ai/agents/registry";
import { agentRepository } from "@/database/repositories/agentRepository";

import type { ValidationCheckResult } from "./types";

function buildFallbackReport(checks: ValidationCheckResult[]): string {
  const failed = checks.filter((c) => c.status === "fail");
  const warnings = checks.filter((c) => c.status === "warn");
  const passed = checks.filter((c) => c.status === "pass");

  return [
    "# QA Validation Report（オフライン）",
    "",
    "## Summary",
    `- Passed: ${passed.length}`,
    `- Failed: ${failed.length}`,
    `- Warnings: ${warnings.length}`,
    "",
    "## Test Plan",
    ...checks.map(
      (c) =>
        `- [${c.status.toUpperCase()}] ${c.name}: ${c.message}`,
    ),
    "",
    "## Recommendations",
    ...(failed.length > 0
      ? failed.map((c) => `- **Fix:** ${c.name} — ${c.message}`)
      : ["- すべての必須チェックが通過しました。"]),
    "",
    `## Pass/Fail: ${failed.length === 0 ? "PASS" : "FAIL"}`,
  ].join("\n");
}

export async function generateQaReport(
  checks: ValidationCheckResult[],
): Promise<string> {
  const hasApiKey =
    Boolean(process.env.OPENAI_API_KEY) ||
    Boolean(process.env.ANTHROPIC_API_KEY);

  if (!hasApiKey) {
    return buildFallbackReport(checks);
  }

  const qa = await agentRepository.findByRole("qa");
  if (!qa) {
    return buildFallbackReport(checks);
  }

  const definition = getAgentDefinition("qa");
  const checkSummary = checks
    .map(
      (c) =>
        `[${c.status}] ${c.name} (${c.durationMs}ms): ${c.message}`,
    )
    .join("\n");

  try {
    const result = await executeRouterRequest({
      agentRole: "qa",
      taskKind: definition.taskKind,
      agentId: qa.id,
      maxOutputTokens: resolveMaxOutputTokens(definition.taskKind),
      messages: [
        { role: "system", content: definition.systemPrompt },
        {
          role: "user",
          content: [
            "以下は AI Workforce OS の自動検証結果です。",
            "QA レポート（Test Plan / Issues Found / Recommendations / Pass-Fail）を Markdown で作成してください。",
            "",
            "## Validation Results",
            checkSummary,
          ].join("\n"),
        },
      ],
    });

    return result.content;
  } catch {
    return buildFallbackReport(checks);
  }
}
