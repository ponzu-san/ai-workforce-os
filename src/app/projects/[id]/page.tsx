import Link from "next/link";
import { notFound } from "next/navigation";

import { PageNotice } from "@/components/common/PageNotice";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ProjectStageModeSettings,
  type ProjectStageModeItem,
} from "@/features/project/components/ProjectStageModeSettings";
import { createTaskAction } from "@/features/task/actions";
import { EXECUTION_MODE_LABELS } from "@/lib/workflow/stageModeConfig";
import { isStageModeEditable } from "@/lib/workflow/stageModeConfig";
import { ja, tStatus } from "@/lib/labels/ja";
import { displayStageName } from "@/lib/labels/stageNames";
import { projectService } from "@/services/projectService";
import { stageService } from "@/services/stageService";
import { taskService } from "@/services/taskService";
import type { ProductionStageName } from "@/ai/workflow/productionWorkflowTemplate";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; stageModesSaved?: string }>;
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const [project, tasks, stages] = await Promise.all([
    projectService.getById(id),
    taskService.listByProject(id),
    stageService.listByProject(id),
  ]);

  if (!project) notFound();

  const workflow = project.workflows[0];
  const stageOptions = stages.map((stage) => ({
    id: stage.id,
    label: `${workflow?.name ?? ja.common.workflow} / ${displayStageName(stage.name)}`,
  }));
  const defaultStageId = stageOptions[0]?.id ?? "";

  const stageModeItems: ProjectStageModeItem[] = stages.map((stage) => ({
    id: stage.id,
    name: stage.name as ProductionStageName,
    order: stage.order,
    executionMode: stage.execution_mode,
    editable: isStageModeEditable(stage.tasks.map((t) => t.status)),
  }));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageNotice
        error={query.error}
        success={query.stageModesSaved === "1" ? ja.project.stageModeSaved : undefined}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/projects" className="text-sm text-muted-foreground">
            ← {ja.nav.projects}
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="mt-2 flex gap-2">
            <StatusBadge value={project.template} />
            <StatusBadge value={project.status} />
          </div>
        </div>
        <Link
          href={`/p/${project.id}`}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          {ja.project.openProject}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.project.stageModeSettings}</CardTitle>
          <CardDescription>{ja.project.stageModeSettingsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectStageModeSettings
            projectId={project.id}
            stages={stageModeItems}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.common.workflow}</CardTitle>
          <CardDescription>{ja.project.workflowStructure}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.workflows.map((wf) => (
            <div key={wf.id} className="rounded-md border p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{wf.name}</p>
                <StatusBadge value={wf.status} />
              </div>
              {wf.stages.map((stage) => {
                const modeItem = stageModeItems.find((s) => s.id === stage.id);
                return (
                  <div key={stage.id} className="ml-2 border-l pl-4 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {displayStageName(stage.name)}
                      </p>
                      {modeItem ? (
                        <StatusBadge
                          value={modeItem.executionMode}
                          className="text-[10px]"
                        />
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stage.tasks.length} {ja.common.tasks}
                      {modeItem
                        ? ` · ${EXECUTION_MODE_LABELS[modeItem.executionMode]}`
                        : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.project.addTask}</CardTitle>
          <CardDescription>{ja.project.addTaskDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTaskAction} className="space-y-3">
            <input type="hidden" name="project_id" value={project.id} />
            {stageOptions.length > 0 ? (
              <div className="space-y-1">
                <label
                  htmlFor="stage_id"
                  className="text-sm font-medium text-neutral-900"
                >
                  {ja.project.addTaskStage}
                </label>
                <select
                  id="stage_id"
                  name="stage_id"
                  required
                  defaultValue={defaultStageId}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                >
                  {stageOptions.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
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
