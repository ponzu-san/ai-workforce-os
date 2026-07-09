import { agentRepository } from "@/database/repositories/agentRepository";
import { memoryRepository } from "@/database/repositories/agentRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import {
  getAgentDefinition,
  resolveSystemPrompt,
} from "@/ai/agents/registry";
import {
  filterPriorArtifacts,
  formatPriorArtifacts,
} from "@/ai/context/stageArtifactFilter";
import { executeRouterRequest } from "@/ai/router/executeRequest";
import { resolveMaxOutputTokens } from "@/ai/router/tokenBudget";
import { logger } from "@/lib/logger";
import type { StageExecutionMode } from "@/types/domain";

export interface AgentRunResult {
  content: string;
  model: string;
  provider: string;
  artifactType: string;
  artifactName: string;
}

export async function runAgentForTask(task: {
  id: string;
  title: string;
  description: string;
  assigned_agent: { id: string; role: string; name: string } | null;
  stage: {
    name: string;
    order: number;
    execution_mode: StageExecutionMode;
    workflow: {
      id: string;
      project: {
        id: string;
        name: string;
        description: string;
        client?: {
          name: string;
          company: string;
          email: string;
          status: string;
          notes: string;
        } | null;
      };
    };
  };
}): Promise<AgentRunResult> {
  const agent =
    task.assigned_agent ?? (await agentRepository.findSecretary());
  if (!agent) {
    throw new Error("No agent available for task execution");
  }

  const definition = getAgentDefinition(agent.role);
  const project = task.stage.workflow.project;
  const workflowId = task.stage.workflow.id;
  const executionMode = task.stage.execution_mode;

  const [memories, priorArtifacts, userMemories] = await Promise.all([
    memoryRepository.findByProject(project.id),
    artifactRepository.findByWorkflowId(workflowId),
    memoryRepository.findUserMemories(3),
  ]);

  const filtered = filterPriorArtifacts(priorArtifacts, {
    currentTaskId: task.id,
    currentStageName: task.stage.name,
    currentStageOrder: task.stage.order,
  });
  const priorContext = formatPriorArtifacts(filtered);

  if (process.env.NODE_ENV === "development") {
    logger.info("Prior artifact context filtered", {
      stage: task.stage.name,
      before: priorArtifacts.length,
      after: filtered.length,
      chars: priorContext.length,
    });
  }

  const client = project.client;
  const clientContext = client
    ? [
        `Client: ${client.name}`,
        client.company ? `Company: ${client.company}` : "",
        client.email ? `Email: ${client.email}` : "",
        client.status ? `Status: ${client.status}` : "",
        client.notes ? `Client Notes: ${client.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const systemPrompt = resolveSystemPrompt(
    agent.role,
    task.stage.name,
    executionMode,
  );

  const handoffNote =
    executionMode === "external_handoff" || executionMode === "human_handoff"
      ? "\n\nThis is a handoff task. Produce a complete handoff document. The user will register external deliverables (URL or files) after your output."
      : "";

  const context = [
    `Project: ${project.name}`,
    `Description: ${project.description}`,
    clientContext,
    `Stage: ${task.stage.name}`,
    `Execution Mode: ${executionMode}`,
    `Task: ${task.title}`,
    `Objective: ${task.description}`,
    memories.length > 0
      ? `Project Memory:\n${memories
          .slice(0, 3)
          .map((m) => `- ${m.content}`)
          .join("\n")}`
      : "",
    userMemories.length > 0
      ? `User Memory:\n${userMemories.map((m) => `- ${m.content}`).join("\n")}`
      : "",
    priorContext
      ? `Prior Deliverables (Artifacts from earlier stages — use as input):\n${priorContext}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const maxOutputTokens = resolveMaxOutputTokens(
    definition.taskKind,
    executionMode,
  );

  const result = await executeRouterRequest({
    agentRole: agent.role,
    taskKind: definition.taskKind,
    agentId: agent.id,
    taskId: task.id,
    maxOutputTokens,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Execute the following task and produce a complete deliverable.${handoffNote}\n\n${context}`,
      },
    ],
  });

  const artifactType =
    executionMode === "external_handoff" || executionMode === "human_handoff"
      ? "handoff"
      : definition.artifactType;

  return {
    content: result.content,
    model: result.model,
    provider: result.provider,
    artifactType,
    artifactName: `${task.title} - ${agent.name}`,
  };
}
