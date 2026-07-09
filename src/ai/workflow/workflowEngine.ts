import { prisma } from "@/database/client";
import { runAgentForTask } from "@/ai/agents/runner";
import { suggestAgentRoleForTask } from "@/ai/agents/registry";
import { agentRepository } from "@/database/repositories/agentRepository";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { notificationRepository } from "@/database/repositories/artifactRepository";
import { taskRepository } from "@/database/repositories/taskRepository";
import { workflowRepository } from "@/database/repositories/workflowRepository";
import { buildStagePath } from "@/services/navigationRedirectService";
import type { StageExecutionMode } from "@/types/domain";

async function createArtifactsFromResult(
  taskId: string,
  result: Awaited<ReturnType<typeof runAgentForTask>>,
) {
  const sourceIds = JSON.stringify(result.sourceArtifactIds);
  const outputs =
    result.artifacts && result.artifacts.length > 0
      ? result.artifacts
      : [
          {
            type: result.artifactType,
            name: result.artifactName,
            content: result.content,
            contentKind: "markdown" as const,
          },
        ];

  for (const output of outputs) {
    await prisma.artifact.create({
      data: {
        task_id: taskId,
        type: output.type,
        name: output.name,
        content: output.content,
        content_kind: output.contentKind ?? "markdown",
        version: "1.0.0",
        source_artifact_ids: sourceIds,
      },
    });
  }
}

async function advanceStageAfterTaskDone(
  workflowId: string,
  taskId: string,
): Promise<void> {
  const task = await taskRepository.findById(taskId);
  if (!task) return;

  const workflow = await workflowRepository.findById(workflowId);
  if (!workflow) return;

  const stage = workflow.stages.find((s) =>
    s.tasks.some((t) => t.id === taskId),
  );
  if (!stage) return;

  const stageTasksDone = stage.tasks.every(
    (t) => t.id === taskId || t.status === "done",
  );

  if (stageTasksDone) {
    await prisma.stage.update({
      where: { id: stage.id },
      data: { status: "completed" },
    });

    const nextStage = workflow.stages.find((s) => s.order === stage.order + 1);
    if (nextStage) {
      await prisma.stage.update({
        where: { id: nextStage.id },
        data: { status: "running" },
      });
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { status: "running", current_stage_id: nextStage.id },
      });
    }
  }

  await prisma.workflow.update({
    where: { id: workflowId },
    data: { status: "running" },
  });
}

async function executeSkipTask(
  workflowId: string,
  taskId: string,
  taskTitle: string,
  stageOrder: number,
  projectId: string,
): Promise<{ completed: false; task: { id: string; title: string }; skipped: true }> {
  await taskRepository.updateStatus(taskId, "done");

  await prisma.artifact.create({
    data: {
      task_id: taskId,
      type: "handoff_skip",
      name: `${taskTitle} - Skipped`,
      content: "この工程はテンプレート設定によりスキップされました。",
      content_kind: "markdown",
      version: "1.0.0",
    },
  });

  await advanceStageAfterTaskDone(workflowId, taskId);

  await notificationRepository.create({
    title: "Stage skipped",
    message: `Task "${taskTitle}" was skipped.`,
    type: "system",
    priority: "low",
    link: buildStagePath(projectId, stageOrder),
  });

  return {
    completed: false,
    task: { id: taskId, title: taskTitle },
    skipped: true,
  };
}

function needsHandoffRegistration(mode: StageExecutionMode): boolean {
  return mode === "external_handoff" || mode === "human_handoff";
}

export const workflowEngine = {
  async startWorkflow(workflowId: string) {
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await prisma.workflow.update({
      where: { id: workflowId },
      data: { status: "running" },
    });

    const firstStage = workflow.stages[0];
    if (firstStage) {
      await prisma.stage.update({
        where: { id: firstStage.id },
        data: { status: "running" },
      });
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { current_stage_id: firstStage.id },
      });
    }

    await notificationRepository.create({
      title: "Workflow started",
      message: `Workflow "${workflow.name}" has started.`,
      type: "system",
      priority: "medium",
      link: buildStagePath(workflow.project.id, firstStage?.order ?? 0),
    });

    return workflowRepository.findById(workflowId);
  },

  async assignAgentsForWorkflow(workflowId: string) {
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    for (const stage of workflow.stages) {
      for (const task of stage.tasks) {
        if (task.assigned_agent_id) continue;

        const role = suggestAgentRoleForTask(task.title, task.description);
        const agents = await agentRepository.findAll();
        const agent = agents.find((a) => a.role === role);
        if (agent) {
          await prisma.task.update({
            where: { id: task.id },
            data: { assigned_agent_id: agent.id },
          });
        }
      }
    }
  },

  async executeNextTask(workflowId: string) {
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const allTasks = workflow.stages.flatMap((stage) =>
      stage.tasks.map((task) => ({ ...task, stage })),
    );

    if (allTasks.length === 0) {
      throw new Error("このワークフローにタスクがありません");
    }

    const waitingExternal = allTasks.find(
      (item) => item.status === "waiting_external",
    );
    if (waitingExternal) {
      throw new Error(
        "外部成果物の登録が必要です。URLまたはファイルを登録してください。",
      );
    }

    const nextItem = allTasks.find(
      (item) =>
        item.status === "todo" ||
        item.status === "running" ||
        item.status === "blocked",
    );

    if (!nextItem) {
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { status: "completed" },
      });
      const lastStage = workflow.stages[workflow.stages.length - 1];
      await notificationRepository.create({
        title: "Workflow completed",
        message: `Workflow "${workflow.name}" is complete.`,
        type: "success",
        priority: "medium",
        link: buildStagePath(
          workflow.project.id,
          lastStage?.order ?? 0,
        ),
      });
      return { completed: true, task: null };
    }

    const { stage, ...nextTask } = nextItem;
    const executionMode = stage.execution_mode;

    if (executionMode === "skip") {
      return executeSkipTask(
        workflowId,
        nextTask.id,
        nextTask.title,
        stage.order,
        workflow.project.id,
      );
    }

    const fullTask = await taskRepository.findById(nextTask.id);
    if (!fullTask?.assigned_agent) {
      throw new Error("Task has no assigned agent");
    }

    await taskRepository.updateStatus(nextTask.id, "running");

    const revisionComment =
      (await approvalRepository.findLatestRevisionComment(nextTask.id)) ??
      undefined;

    const result = await runAgentForTask({
      id: fullTask.id,
      title: fullTask.title,
      description: fullTask.description,
      assigned_agent: fullTask.assigned_agent,
      stage: {
        id: stage.id,
        name: stage.name,
        order: stage.order,
        execution_mode: executionMode,
        workflow: {
          id: workflowId,
          project: {
            ...fullTask.stage.workflow.project,
            template: workflow.project.template,
          },
          stages: workflow.stages.map((s) => ({
            name: s.name,
            execution_mode: s.execution_mode,
          })),
        },
      },
    }, { revisionComment });

    await createArtifactsFromResult(nextTask.id, result);

    if (needsHandoffRegistration(executionMode)) {
      await taskRepository.updateStatus(nextTask.id, "waiting_external");

      await notificationRepository.create({
        title: "External deliverable required",
        message: `Task "${nextTask.title}" needs an external URL or file.`,
        type: "reminder",
        priority: "high",
        link: buildStagePath(workflow.project.id, stage.order),
      });

      return {
        completed: false,
        task: nextTask,
        artifact: result,
        waitingExternal: true,
      };
    }

    await taskRepository.updateStatus(nextTask.id, "review");
    await approvalRepository.createForTask(nextTask.id);

    await prisma.workflow.update({
      where: { id: workflowId },
      data: { status: "waiting_approval" },
    });

    await notificationRepository.create({
      title: "Approval required",
      message: `Task "${nextTask.title}" needs your approval.`,
      type: "approval",
      priority: "high",
      link: buildStagePath(workflow.project.id, stage.order),
    });

    return {
      completed: false,
      task: nextTask,
      artifact: result,
    };
  },

  async registerExternalDeliverable(
    taskId: string,
    input: {
      externalUrl?: string | null;
      filePath?: string | null;
      mimeType?: string | null;
      note?: string;
    },
  ) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new Error("Task not found");
    if (task.status !== "waiting_external") {
      throw new Error("このタスクは外部成果物登録を待っていません");
    }

    const hasUrl = Boolean(input.externalUrl?.trim());
    const hasFile = Boolean(input.filePath?.trim());
    if (!hasUrl && !hasFile) {
      throw new Error("URLまたはファイルのいずれかが必要です");
    }

    const workflowId = task.stage.workflow.id;
    const projectId = task.stage.workflow.project.id;
    const stageOrder = task.stage.order;

    if (hasUrl) {
      await prisma.artifact.create({
        data: {
          task_id: taskId,
          type: "external_link",
          name: `${task.title} - External URL`,
          content: input.note?.trim() ?? "",
          content_kind: "url",
          external_url: input.externalUrl!.trim(),
          version: "1.0.0",
        },
      });
    }

    if (hasFile) {
      await prisma.artifact.create({
        data: {
          task_id: taskId,
          type: "external_file",
          name: `${task.title} - External File`,
          content: input.note?.trim() ?? "",
          content_kind: "file",
          file_path: input.filePath!.trim(),
          mime_type: input.mimeType ?? null,
          version: "1.0.0",
        },
      });
    }

    await taskRepository.updateStatus(taskId, "review");
    await approvalRepository.createForTask(taskId);

    await prisma.workflow.update({
      where: { id: workflowId },
      data: { status: "waiting_approval" },
    });

    await notificationRepository.create({
      title: "Approval required",
      message: `Task "${task.title}" external deliverable registered — approval needed.`,
      type: "approval",
      priority: "high",
      link: buildStagePath(projectId, stageOrder),
    });

    return taskRepository.findById(taskId);
  },

  async startAndExecuteFirst(workflowId: string) {
    await workflowEngine.assignAgentsForWorkflow(workflowId);
    await workflowEngine.startWorkflow(workflowId);
    return workflowEngine.executeNextTask(workflowId);
  },

  async continueAfterApproval(taskId: string) {
    const task = await taskRepository.findById(taskId);
    if (!task) return;

    const workflowId = task.stage.workflow.id;
    await taskRepository.updateStatus(taskId, "done");
    await advanceStageAfterTaskDone(workflowId, taskId);
  },
};
