import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projectService } from "@/services/projectService";
import { workflowService } from "@/services/workflowService";

export default async function WorkflowsPage() {
  const projects = await projectService.list();
  const workflowsByProject = await Promise.all(
    projects.map(async (project) => ({
      project,
      workflows: await workflowService.listByProject(project.id),
    })),
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Workflows</h1>
        <p className="text-muted-foreground">Workflow 基本構造の可視化</p>
      </div>

      {workflowsByProject.map(({ project, workflows }) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="text-base">
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.name}
              </Link>
            </CardTitle>
            <CardDescription>{workflows.length} workflow(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflows.map((workflow) => (
              <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                <div className="rounded-md border p-4 transition-colors hover:bg-accent/50">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">{workflow.name}</p>
                    <StatusBadge value={workflow.status} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workflow.stages.map((stage) => (
                      <div
                        key={stage.id}
                        className="rounded-md bg-muted px-3 py-2 text-sm"
                      >
                        {stage.name}
                        <span className="ml-2 text-muted-foreground">
                          ({stage.tasks.length})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
