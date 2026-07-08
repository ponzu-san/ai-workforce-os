import { PRODUCTION_STAGE_COUNT } from "@/ai/workflow/productionWorkflowTemplate";
import { executeRouterRequest } from "@/ai/router/executeRequest";
import { workflowEngine } from "@/ai/workflow/workflowEngine";
import { prisma } from "@/database/client";
import { agentRepository } from "@/database/repositories/agentRepository";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { workflowRepository } from "@/database/repositories/workflowRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";

import type { ValidationCheckResult } from "./types";

const DEMO_PROJECT_NAME = "Demo Project";

function result(
  id: string,
  name: string,
  status: ValidationCheckResult["status"],
  message: string,
  start: number,
): ValidationCheckResult {
  return {
    id,
    name,
    status,
    message,
    durationMs: Date.now() - start,
  };
}

export async function checkDatabaseConnection(): Promise<ValidationCheckResult> {
  const start = Date.now();
  try {
    const count = await workspaceRepository.count();
    return result(
      "database_connection",
      "Database Connection",
      "pass",
      `PostgreSQL 接続 OK（Workspace: ${count}）`,
      start,
    );
  } catch (error: unknown) {
    return result(
      "database_connection",
      "Database Connection",
      "fail",
      error instanceof Error ? error.message : "DB 接続失敗",
      start,
    );
  }
}

export async function checkAgentsSeeded(): Promise<ValidationCheckResult> {
  const start = Date.now();
  const agents = await agentRepository.findAll();
  const roles = new Set(agents.map((a) => a.role));
  const required = [
    "secretary",
    "pm",
    "designer",
    "frontend",
    "backend",
    "qa",
    "sales",
  ];
  const missing = required.filter((r) => !roles.has(r));

  if (missing.length > 0) {
    return result(
      "agents_seeded",
      "Agents Seeded",
      "fail",
      `不足 Agent: ${missing.join(", ")}。npm run db:seed を実行してください。`,
      start,
    );
  }

  return result(
    "agents_seeded",
    "Agents Seeded",
    "pass",
    `${agents.length} Agent 登録済み（Secretary / PM / Designer / Frontend / Backend / QA / Sales）`,
    start,
  );
}

export async function checkDemoProjectStructure(): Promise<ValidationCheckResult> {
  const start = Date.now();
  const project = await prisma.project.findFirst({
    where: { name: DEMO_PROJECT_NAME },
    include: {
      workflows: {
        include: {
          stages: { include: { tasks: { include: { assigned_agent: true } } } },
        },
      },
    },
  });

  if (!project) {
    return result(
      "demo_project",
      "Demo Project Structure",
      "warn",
      `「${DEMO_PROJECT_NAME}」が見つかりません。npm run db:seed を実行してください。`,
      start,
    );
  }

  const workflow = project.workflows[0];
  if (!workflow) {
    return result(
      "demo_project",
      "Demo Project Structure",
      "fail",
      "Demo Project に Workflow がありません。",
      start,
    );
  }

  const stages = workflow.stages;
  const tasks = stages.flatMap((s) => s.tasks);
  const unassigned = tasks.filter((t) => !t.assigned_agent_id);

  if (stages.length < PRODUCTION_STAGE_COUNT) {
    return result(
      "demo_project",
      "Demo Project Structure",
      "warn",
      `Stage が ${stages.length} 件（統合ワークフロー想定は ${PRODUCTION_STAGE_COUNT}）。npm run db:seed を実行してください。`,
      start,
    );
  }

  if (tasks.length === 0) {
    return result(
      "demo_project",
      "Demo Project Structure",
      "fail",
      "Demo Workflow に Task がありません。Execute Next Task の検証ができません。",
      start,
    );
  }

  if (unassigned.length > 0) {
    return result(
      "demo_project",
      "Demo Project Structure",
      "warn",
      `${unassigned.length} 件の Task が未割当。Start Workflow で割当可能です。`,
      start,
    );
  }

  return result(
    "demo_project",
    "Demo Project Structure",
    "pass",
    `Demo Project OK（Stage ${stages.length} / Task ${tasks.length}）`,
    start,
  );
}

export async function checkLlmRouter(): Promise<ValidationCheckResult> {
  const start = Date.now();
  try {
    const secretary = await agentRepository.findSecretary();
    if (!secretary) {
      return result(
        "llm_router",
        "LLM Router",
        "fail",
        "Secretary AI が見つかりません。",
        start,
      );
    }

    const response = await executeRouterRequest({
      agentRole: "secretary",
      taskKind: "secretary",
      agentId: secretary.id,
      messages: [
        { role: "user", content: "Validation ping: respond with OK" },
      ],
    });

    const mode = response.provider === "local" ? "オフライン" : "API";
    return result(
      "llm_router",
      "LLM Router",
      "pass",
      `LLM Router 応答 OK（${mode} / ${response.model}）`,
      start,
    );
  } catch (error: unknown) {
    return result(
      "llm_router",
      "LLM Router",
      "fail",
      error instanceof Error ? error.message : "LLM Router 失敗",
      start,
    );
  }
}

async function findDemoWorkflowId(): Promise<string | null> {
  const project = await prisma.project.findFirst({
    where: { name: DEMO_PROJECT_NAME },
    include: { workflows: true },
  });
  return project?.workflows[0]?.id ?? null;
}

async function prepareDemoWorkflowForExecution(workflowId: string) {
  const workflow = await workflowRepository.findById(workflowId);
  if (!workflow) return;

  const tasks = workflow.stages.flatMap((s) => s.tasks);
  const hasExecutable = tasks.some(
    (t) => t.status === "todo" || t.status === "running",
  );
  if (hasExecutable) return;

  const firstTask = tasks[0];
  if (!firstTask) return;

  await prisma.task.update({
    where: { id: firstTask.id },
    data: { status: "todo" },
  });
  await prisma.workflow.update({
    where: { id: workflowId },
    data: { status: "planning", current_stage_id: workflow.stages[0]?.id ?? null },
  });
  await prisma.stage.updateMany({
    where: { workflow_id: workflowId },
    data: { status: "pending" },
  });
  if (workflow.stages[0]) {
    await prisma.stage.update({
      where: { id: workflow.stages[0].id },
      data: { status: "pending" },
    });
  }
}

export async function checkWorkflowExecution(): Promise<ValidationCheckResult> {
  const start = Date.now();

  const workflowId = await findDemoWorkflowId();
  if (!workflowId) {
    return result(
      "workflow_execution",
      "Workflow Execution",
      "skip",
      "Demo Project がないためスキップしました。",
      start,
    );
  }

  try {
    await prepareDemoWorkflowForExecution(workflowId);

    const artifactsBefore = (await artifactRepository.findAll()).length;
    const approvalsBefore = await approvalRepository.countPending();

    await workflowEngine.assignAgentsForWorkflow(workflowId);
    await workflowEngine.startWorkflow(workflowId);
    const execResult = await workflowEngine.executeNextTask(workflowId);

    if (execResult.completed) {
      return result(
        "workflow_execution",
        "Workflow Execution",
        "fail",
        "実行可能な Task がなく Workflow が完了しました。Demo Project の Task を確認してください。",
        start,
      );
    }

    const workflow = await workflowRepository.findById(workflowId);
    const task = workflow?.stages
      .flatMap((s) => s.tasks)
      .find((t) => t.id === execResult.task?.id);

    const artifactsAfter = (await artifactRepository.findAll()).length;
    const approvalsAfter = await approvalRepository.countPending();

    const artifactCreated = artifactsAfter > artifactsBefore;
    const approvalCreated = approvalsAfter > approvalsBefore;
    const taskInReview = task?.status === "review";
    const workflowWaiting =
      workflow?.status === "waiting_approval";

    if (
      artifactCreated &&
      approvalCreated &&
      taskInReview &&
      workflowWaiting
    ) {
      return result(
        "workflow_execution",
        "Workflow Execution",
        "pass",
        `Execute Next Task 成功（Task: "${execResult.task?.title}" → review, Artifact + Approval 作成）`,
        start,
      );
    }

    const issues: string[] = [];
    if (!artifactCreated) issues.push("Artifact 未作成");
    if (!approvalCreated) issues.push("Approval 未作成");
    if (!taskInReview) issues.push(`Task status: ${task?.status ?? "unknown"}`);
    if (!workflowWaiting) issues.push(`Workflow status: ${workflow?.status ?? "unknown"}`);

    return result(
      "workflow_execution",
      "Workflow Execution",
      "fail",
      issues.join(" / "),
      start,
    );
  } catch (error: unknown) {
    return result(
      "workflow_execution",
      "Workflow Execution",
      "fail",
      error instanceof Error ? error.message : "Workflow 実行失敗",
      start,
    );
  }
}

export async function runAllChecks(
  execute: boolean,
): Promise<ValidationCheckResult[]> {
  const checks: ValidationCheckResult[] = [];

  checks.push(await checkDatabaseConnection());
  if (checks[0]?.status === "fail") {
    return checks;
  }

  checks.push(await checkAgentsSeeded());
  checks.push(await checkDemoProjectStructure());
  checks.push(await checkLlmRouter());

  if (execute) {
    checks.push(await checkWorkflowExecution());
  } else {
    checks.push(
      result(
        "workflow_execution",
        "Workflow Execution",
        "skip",
        "読み取り専用モード。実行テストは npm run validate -- --execute または UI の「Workflow 実行テストを含める」を使用。",
        Date.now(),
      ),
    );
  }

  return checks;
}
