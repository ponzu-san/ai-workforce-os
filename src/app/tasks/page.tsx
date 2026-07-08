import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskStatusActions } from "@/features/task/components/TaskStatusActions";
import { createTaskAction } from "@/features/task/actions";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([
    taskService.list(),
    projectService.list(),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">タスク管理</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">新規タスク</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTaskAction} className="space-y-3">
            <select
              name="project_id"
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue={projects[0]?.id ?? ""}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <input
              name="title"
              placeholder="タスク名"
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="説明"
              className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <select
              name="priority"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue="medium"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              作成
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  {task.stage.workflow.project.name} ·{" "}
                  {task.assigned_agent?.name ?? "Unassigned"}
                </p>
                <div className="mt-2 flex gap-1">
                  <StatusBadge value={task.priority} />
                  <StatusBadge value={task.status} />
                </div>
              </div>
              <TaskStatusActions taskId={task.id} currentStatus={task.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
