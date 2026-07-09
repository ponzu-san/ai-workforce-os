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
import { PRODUCTION_STAGE_NAMES } from "@/ai/workflow/productionWorkflowTemplate";
import {
  splitContractOutput,
  splitSalesOutput,
} from "@/lib/artifact/parseOutput";
import {
  createDefaultChecklistData,
  parseContractChecklist,
} from "@/lib/contract/checklist";
import { executeRouterRequest } from "@/ai/router/executeRequest";
import { resolveMaxOutputTokens } from "@/ai/router/tokenBudget";
import { logger } from "@/lib/logger";
import type { ArtifactContentKind, StageExecutionMode } from "@/types/domain";

export interface AgentArtifactOutput {
  type: string;
  name: string;
  content: string;
  contentKind?: ArtifactContentKind;
}

export interface AgentRunResult {
  content: string;
  model: string;
  provider: string;
  artifactType: string;
  artifactName: string;
  artifacts?: AgentArtifactOutput[];
  sourceArtifactIds: string[];
}

export interface RunAgentOptions {
  revisionComment?: string;
}

export async function runAgentForTask(
  task: {
    id: string;
    title: string;
    description: string;
    assigned_agent: { id: string; role: string; name: string } | null;
    stage: {
      id: string;
      name: string;
      order: number;
      execution_mode: StageExecutionMode;
      workflow: {
        id: string;
        project: {
          id: string;
          name: string;
          description: string;
          template?: string;
          client?: {
            name: string;
            company: string;
            email: string;
            status: string;
            notes: string;
          } | null;
        };
        stages?: Array<{
          name: string;
          execution_mode: StageExecutionMode;
        }>;
      };
    };
  },
  options: RunAgentOptions = {},
): Promise<AgentRunResult> {
  const agent =
    task.assigned_agent ?? (await agentRepository.findSecretary());
  if (!agent) {
    throw new Error("No agent available for task execution");
  }

  const definition = getAgentDefinition(agent.role);
  const project = task.stage.workflow.project;
  const workflowId = task.stage.workflow.id;
  const executionMode = task.stage.execution_mode;
  const workflowStages = task.stage.workflow.stages ?? [];
  const skippedStageNames = workflowStages
    .filter((stage) => stage.execution_mode === "skip")
    .map((stage) => stage.name);
  const designOnly =
    project.template === "design_only" ||
    skippedStageNames.includes(PRODUCTION_STAGE_NAMES.FRONTEND);

  const [memories, priorArtifacts, userMemories, stageInstructions] =
    await Promise.all([
      memoryRepository.findByProject(project.id),
      artifactRepository.findByWorkflowId(workflowId),
      memoryRepository.findUserMemories(3),
      memoryRepository.findInstructionsForStage(project.id, task.stage.id),
    ]);

  const filtered = filterPriorArtifacts(priorArtifacts, {
    currentTaskId: task.id,
    currentStageName: task.stage.name,
    currentStageOrder: task.stage.order,
    skippedStageNames,
    designOnly,
  });
  const priorContext = formatPriorArtifacts(filtered);
  const sourceArtifactIds = filtered.map((artifact) => artifact.id);

  if (process.env.NODE_ENV === "development") {
    logger.info("Prior artifact context filtered", {
      stage: task.stage.name,
      before: priorArtifacts.length,
      after: filtered.length,
      chars: priorContext.length,
      designOnly,
      skippedStageNames,
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
    { designOnly, skippedStages: skippedStageNames },
  );

  const handoffNote =
    executionMode === "external_handoff" || executionMode === "human_handoff"
      ? "\n\nThis is a handoff task. Produce a complete handoff document. The user will register external deliverables (URL or files) after your output."
      : "";

  const projectInstructions = memories
    .filter((m) => m.source === "user_instruction" && !m.stage_id)
    .slice(0, 5)
    .map((m) => `- ${m.content}`)
    .join("\n");

  const stageInstructionText = stageInstructions
    .map((m) => `- ${m.content}`)
    .join("\n");

  const contractChecklistArtifact = priorArtifacts.find(
    (a) => a.type === "contract_checklist",
  );
  const contractChecklistContext = contractChecklistArtifact
    ? parseContractChecklist(contractChecklistArtifact.content)
    : null;

  const context = [
    `Project: ${project.name}`,
    `Description: ${project.description}`,
    clientContext,
    `Stage: ${task.stage.name}`,
    `Execution Mode: ${executionMode}`,
    designOnly ? "Project Mode: design_only (development stages may be skipped)" : "",
    skippedStageNames.length > 0
      ? `Skipped Stages: ${skippedStageNames.join(", ")}`
      : "",
    `Task: ${task.title}`,
    `Objective: ${task.description}`,
    options.revisionComment
      ? `Revision Request (must address):\n${options.revisionComment}`
      : "",
    projectInstructions
      ? `Project Instructions:\n${projectInstructions}`
      : "",
    stageInstructionText
      ? `Stage Instructions:\n${stageInstructionText}`
      : "",
    contractChecklistContext
      ? `Confirmed Contract Checklist:\n${contractChecklistContext.items
          .filter((item) => item.checked || item.provider !== "undecided")
          .map(
            (item) =>
              `- ${item.label}: ${item.provider ?? "undecided"}${item.notes ? ` (${item.notes})` : ""}`,
          )
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

  let artifacts: AgentArtifactOutput[] | undefined;

  if (
    task.stage.name === PRODUCTION_STAGE_NAMES.SALES &&
    agent.role === "sales"
  ) {
    artifacts = splitSalesOutput(result.content).map((item) => ({
      ...item,
      contentKind: "markdown" as const,
    }));
  }

  if (
    task.stage.name === PRODUCTION_STAGE_NAMES.CONTRACT &&
    agent.role === "pm"
  ) {
    const split = splitContractOutput(result.content);
    artifacts = split.map((item) => {
      if (item.type === "contract_checklist") {
        const parsed = parseContractChecklist(item.content);
        const hasItems = parsed.items.length > 0;
        return {
          ...item,
          content: JSON.stringify(
            hasItems ? parsed : createDefaultChecklistData(),
            null,
            2,
          ),
          contentKind: "markdown" as const,
        };
      }
      return { ...item, contentKind: "markdown" as const };
    });
  }

  return {
    content: result.content,
    model: result.model,
    provider: result.provider,
    artifactType,
    artifactName: `${task.title} - ${agent.name}`,
    artifacts,
    sourceArtifactIds,
  };
}
