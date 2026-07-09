import { DashboardEmptyGuide } from "@/features/dashboard/components/DashboardEmptyGuide";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardNotice } from "@/features/dashboard/components/DashboardNotice";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { ProjectPipelineCard } from "@/features/dashboard/components/ProjectPipelineCard";
import { CompleteProjectPrompt } from "@/features/project/components/CompleteProjectPrompt";
import { dashboardService } from "@/services/dashboardService";
import { isProjectReadyToComplete } from "@/lib/workflow/projectCompletion";
import { projectRepository } from "@/database/repositories/projectRepository";

interface DashboardPageProps {
  searchParams: Promise<{
    executed?: string;
    approved?: string;
    rejected?: string;
    error?: string;
    done?: string;
    task?: string;
    workflowDone?: string;
    projectId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const query = await searchParams;
  const summary = await dashboardService.getSummary();
  const activeCount = summary.projectPipelines.length;

  let workflowDoneProject: {
    id: string;
    name: string;
  } | null = null;

  if (query.workflowDone === "1" && typeof query.projectId === "string") {
    const project = await projectRepository.findById(query.projectId);
    if (project && isProjectReadyToComplete(project)) {
      workflowDoneProject = { id: project.id, name: project.name };
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <DashboardHero
          projectCount={activeCount}
          overallProgressPercent={summary.stats.overallProgressPercent}
          pendingApprovalCount={summary.stats.pendingApprovalCount}
          completedProjectCount={summary.stats.completedProjectCount}
        />

        <DashboardNotice query={query} />

        {workflowDoneProject ? (
          <CompleteProjectPrompt
            projectId={workflowDoneProject.id}
            projectName={workflowDoneProject.name}
            returnTo="/"
          />
        ) : null}

        {summary.projectPipelines.length === 0 ? (
          <DashboardEmptyGuide />
        ) : (
          <div className="space-y-6 rounded-3xl border border-black p-4">
            {summary.projectPipelines.map((pipeline) => (
              <ProjectPipelineCard key={pipeline.projectId} pipeline={pipeline} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
