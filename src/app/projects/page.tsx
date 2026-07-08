import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProjectAction } from "@/features/project/actions";
import { ja } from "@/lib/labels/ja";
import { projectService } from "@/services/projectService";

export default async function ProjectsPage() {
  const projects = await projectService.list();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.project.title}</h1>
        <p className="text-muted-foreground">{ja.project.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.project.new}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProjectAction} className="space-y-3">
            <input
              name="name"
              placeholder={ja.project.namePlaceholder}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder={ja.project.descPlaceholder}
              className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <SubmitButton label={ja.common.create} />
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
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
                  <StatusBadge value={project.status} />
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
