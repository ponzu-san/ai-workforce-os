import { agentRepository } from "@/database/repositories/agentRepository";
import { memoryRepository } from "@/database/repositories/agentRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import {
  getAgentDefinition,
  resolveSystemPrompt,
} from "@/ai/agents/registry";
import { executeRouterRequest } from "@/ai/router/executeRequest";
import type { StageExecutionMode } from "@/types/domain";

export interface AgentRunResult {
  content: string;
  model: string;
  provider: string;
  artifactType: string;
  artifactName: string;
}

function formatPriorArtifacts(
  artifacts: Awaited<ReturnType<typeof artifactRepository.findByWorkflowId>>,
  currentTaskId: string,
): string {
  const prior = artifacts.filter((a) => a.task_id !== currentTaskId);
  if (prior.length === 0) return "";

  return prior
    .map((a) => {
      const header = `### ${a.name} (${a.task.stage.name} / ${a.task.assigned_agent?.name ?? "Agent"})`;
      if (a.content_kind === "url" && a.external_url) {
        return `${header}\nURL: ${a.external_url}${a.content ? `\n${a.content}` : ""}`;
      }
      if (a.content_kind === "file" && a.file_path) {
        return `${header}\nFile: ${a.file_path}${a.content ? `\n${a.content}` : ""}`;
      }
      const body = a.content.slice(0, 1500);
      const truncated = a.content.length > 1500 ? "\n...(truncated)" : "";
      return `${header}\n${body}${truncated}`;
    })
    .join("\n\n");
}

export async function runAgentForTask(task: {
  id: string;
  title: string;
  description: string;
  assigned_agent: { id: string; role: string; name: string } | null;
  stage: {
    name: string;
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

  const priorContext = formatPriorArtifacts(priorArtifacts, task.id);

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

  const result = await executeRouterRequest({
    agentRole: agent.role,
    taskKind: definition.taskKind,
    agentId: agent.id,
    taskId: task.id,
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
