import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import { executionLogRepository } from "@/database/repositories/agentRepository";
import { estimateCost, selectModel } from "@/ai/router/modelRouter";
import { resolveMaxOutputTokens } from "@/ai/router/tokenBudget";
import type { RouterRequest, RouterResponse } from "@/ai/router/types";
import { logger } from "@/lib/logger";

function buildFallbackResponse(request: RouterRequest): RouterResponse {
  const summary = request.messages.at(-1)?.content ?? "";
  return {
    content: [
      "Secretary AI（オフライン応答）:",
      "",
      "LLM API キーが未設定のため、ローカル応答モードで動作しています。",
      "",
      "受け取った内容:",
      summary.slice(0, 500),
      "",
      "次のアクション提案:",
      "1. 優先タスクを確認する",
      "2. 必要なら Project / Task を作成する",
      "3. 承認待ちがあれば Dashboard で確認する",
    ].join("\n"),
    model: "offline-fallback",
    provider: "local",
    inputTokens: 0,
    outputTokens: 0,
    durationMs: 0,
    cost: 0,
  };
}

/**
 * AI SDK v7 rejects `role: "system"` inside `messages`.
 * Split them into `instructions` + conversation messages.
 */
function splitSystemMessages(messages: RouterRequest["messages"]): {
  instructions: string | undefined;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
} {
  const systemParts: string[] = [];
  const conversation: Array<{ role: "user" | "assistant"; content: string }> =
    [];

  for (const message of messages) {
    if (message.role === "system") {
      systemParts.push(message.content);
      continue;
    }
    conversation.push({
      role: message.role,
      content: message.content,
    });
  }

  return {
    instructions:
      systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    messages: conversation,
  };
}

export async function executeRouterRequest(
  request: RouterRequest,
): Promise<RouterResponse> {
  const hasApiKey =
    Boolean(process.env.OPENAI_API_KEY) ||
    Boolean(process.env.ANTHROPIC_API_KEY);

  if (!hasApiKey) {
    const fallback = buildFallbackResponse(request);
    await executionLogRepository.create({
      agent_id: request.agentId,
      task_id: request.taskId ?? null,
      model: fallback.model,
      input_tokens: 0,
      output_tokens: 0,
      duration_ms: 0,
      status: "completed",
    });
    return fallback;
  }

  const modelConfig = selectModel(request.taskKind);
  const start = Date.now();

  try {
    const model =
      modelConfig.provider === "openai"
        ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(
            modelConfig.model,
          )
        : createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(
            modelConfig.model,
          );

    const maxOutputTokens =
      request.maxOutputTokens ?? resolveMaxOutputTokens(request.taskKind);

    const { instructions, messages } = splitSystemMessages(request.messages);

    const result = await generateText({
      model,
      ...(instructions ? { instructions } : {}),
      messages,
      maxOutputTokens,
    });

    const durationMs = Date.now() - start;
    const inputTokens = result.usage?.inputTokens ?? 0;
    const outputTokens = result.usage?.outputTokens ?? 0;
    const cost = estimateCost(modelConfig, inputTokens, outputTokens);

    await executionLogRepository.create({
      agent_id: request.agentId,
      task_id: request.taskId ?? null,
      model: modelConfig.model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      duration_ms: durationMs,
      status: "completed",
      cost: {
        provider: modelConfig.provider,
        model: modelConfig.model,
        token_usage: inputTokens + outputTokens,
        cost,
      },
    });

    return {
      content: result.text,
      model: modelConfig.model,
      provider: modelConfig.provider,
      inputTokens,
      outputTokens,
      durationMs,
      cost,
    };
  } catch (error: unknown) {
    logger.error("LLM Router execution failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
