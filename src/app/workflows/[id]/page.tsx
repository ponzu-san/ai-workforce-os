import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkflowFeedback } from "@/features/workflow/components/WorkflowFeedback";
import {
  executeNextTaskFormAction,
  startAndExecuteFormAction,
  startWorkflowFormAction,
} from "@/features/workflow/actions";
import { workflowService } from "@/services/workflowService";

interface WorkflowDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    executed?: string;
    task?: string;
    error?: string;
    done?: string;
    started?: string;
  }>;
}

export default async function WorkflowDetailPage({
  params,
  searchParams,
}: WorkflowDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const workflow = await workflowService.getById(id);
  if (!workflow) notFound();

  const totalTasks = workflow.stages.flatMap((s) => s.tasks).length;
  const doneTasks = workflow.stages
    .flatMap((s) => s.tasks)
    .filter((t) => t.status === "done").length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link href="/workflows" className="text-sm text-muted-foreground">
          ← Workflows
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-muted-foreground">{workflow.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Project:{" "}
              <Link
                href={`/projects/${workflow.project.id}`}
                className="underline"
              >
                {workflow.project.name}
              </Link>
              {" · "}
              Progress: {doneTasks}/{totalTasks} tasks done
            </p>
          </div>
          <StatusBadge value={workflow.status} />
        </div>
      </div>

      <WorkflowFeedback query={query} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Controls</CardTitle>
          <CardDescription>
            Secretary AI 経由で Agent を順番に実行（Automation 対応）
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <form action={startAndExecuteFormAction}>
            <input type="hidden" name="workflowId" value={id} />
            <Button type="submit">Start &amp; Execute First Task</Button>
          </form>
          <form action={startWorkflowFormAction}>
            <input type="hidden" name="workflowId" value={id} />
            <Button type="submit" variant="outline">
              Start Workflow
            </Button>
          </form>
          <form action={executeNextTaskFormAction}>
            <input type="hidden" name="workflowId" value={id} />
            <Button type="submit">Execute Next Task</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {workflow.stages.map((stage) => (
          <Card key={stage.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{stage.name}</CardTitle>
              <StatusBadge value={stage.status} />
            </CardHeader>
            <CardContent className="space-y-2">
              {stage.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  タスクがありません
                </p>
              ) : (
                stage.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-muted-foreground">
                        {task.assigned_agent?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <StatusBadge value={task.priority} />
                      <StatusBadge value={task.status} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
