import Link from "next/link";

import { PageNotice } from "@/components/common/PageNotice";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectCreateForm } from "@/features/project/components/ProjectCreateForm";
import { ja } from "@/lib/labels/ja";
import { clientService } from "@/services/clientService";
import { projectService } from "@/services/projectService";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const [projects, clients, completedCount] = await Promise.all([
    projectService.listActive(),
    clientService.list(),
    projectService.countCompleted(),
  ]);

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: `${client.name}${client.company ? ` (${client.company})` : ""}`,
  }));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.project.title}</h1>
        <p className="text-muted-foreground">{ja.project.subtitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {ja.project.devWorkflowNote}
        </p>
        {completedCount > 0 ? (
          <Link
            href="/completed"
            className="mt-2 inline-block text-sm font-medium text-neutral-700 hover:underline"
          >
            {ja.project.viewCompletedProjects}（{completedCount}
            {ja.common.projects}）
          </Link>
        ) : null}
      </div>

      <PageNotice error={query.error} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.project.new}</CardTitle>
          <CardDescription>{ja.project.templateHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectCreateForm clients={clientOptions} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">{ja.project.noProjects}</p>
        ) : null}
        {projects.map((project) => {
          const taskCount = project.workflows.reduce(
            (sum, w) =>
              sum + w.stages.reduce((s, st) => s + st._count.tasks, 0),
            0,
          );

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={project.template} />
                    <StatusBadge value={project.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {taskCount} {ja.common.tasks} · {ja.common.updated}{" "}
                    {project.updated_at.toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
