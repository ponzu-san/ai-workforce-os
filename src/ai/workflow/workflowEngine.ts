import { prisma } from "@/database/client";
import { runAgentForTask } from "@/ai/agents/runner";
import { suggestAgentRoleForTask } from "@/ai/agents/registry";
import { agentRepository } from "@/database/repositories/agentRepository";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { notificationRepository } from "@/database/repositories/artifactRepository";
import { taskRepository } from "@/database/repositories/taskRepository";
import { workflowRepository } from "@/database/repositories/workflowRepository";

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
      link: `/workflows/${workflowId}`,
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

    const nextTask = workflow.stages
      .flatMap((s) => s.tasks)
      .find((t) => t.status === "todo" || t.status === "running");

    if (!nextTask) {
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { status: "completed" },
      });
      await notificationRepository.create({
        title: "Workflow completed",
        message: `Workflow "${workflow.name}" is complete.`,
        type: "success",
        priority: "medium",
        link: `/workflows/${workflowId}`,
      });
      return { completed: true, task: null };
    }

    const fullTask = await taskRepository.findById(nextTask.id);
    if (!fullTask?.assigned_agent) {
      throw new Error("Task has no assigned agent");
    }

    await taskRepository.updateStatus(nextTask.id, "running");

    const result = await runAgentForTask(fullTask);

    await prisma.artifact.create({
      data: {
        task_id: nextTask.id,
        type: result.artifactType,
        name: result.artifactName,
        content: result.content,
        version: "1.0.0",
      },
    });

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
      link: "/approvals",
    });

    return {
      completed: false,
      task: nextTask,
      artifact: result,
    };
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
  },
};
