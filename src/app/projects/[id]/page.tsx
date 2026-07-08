import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createTaskAction } from "@/features/task/actions";
import { ja, tStatus } from "@/lib/labels/ja";
import { displayStageName } from "@/lib/labels/stageNames";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";
import { workflowService } from "@/services/workflowService";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, tasks, workflows] = await Promise.all([
    projectService.getById(id),
    taskService.listByProject(id),
    workflowService.listByProject(id),
  ]);

  if (!project) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/projects" className="text-sm text-muted-foreground">
            ← {ja.nav.projects}
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <StatusBadge value={project.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.common.workflow}</CardTitle>
          <CardDescription>{ja.project.workflowStructure}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="rounded-md border p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{workflow.name}</p>
                <StatusBadge value={workflow.status} />
              </div>
              {workflow.stages.map((stage) => (
                <div key={stage.id} className="ml-2 border-l pl-4">
                  <p className="text-sm font-medium">
                    {displayStageName(stage.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage.tasks.length} {ja.common.tasks}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.project.addTask}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTaskAction} className="space-y-3">
            <input type="hidden" name="project_id" value={project.id} />
            <input
              name="title"
              placeholder={ja.project.taskName}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder={ja.project.descLabel}
              className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <select
              name="priority"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue="medium"
            >
              <option value="critical">{tStatus("critical")}</option>
              <option value="high">{tStatus("high")}</option>
              <option value="medium">{tStatus("medium")}</option>
              <option value="low">{tStatus("low")}</option>
            </select>
            <SubmitButton label={ja.project.taskCreate} />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.nav.tasks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {task.assigned_agent?.name ?? ja.common.unassigned}
                </p>
              </div>
              <div className="flex gap-1">
                <StatusBadge value={task.priority} />
                <StatusBadge value={task.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
