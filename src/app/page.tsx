import { DashboardEmptyGuide } from "@/features/dashboard/components/DashboardEmptyGuide";
import { DashboardHero } from "@/features/dashboard/components/DashboardHero";
import { DashboardNotice } from "@/features/dashboard/components/DashboardNotice";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { ProjectPipelineCard } from "@/features/dashboard/components/ProjectPipelineCard";
import { ja } from "@/lib/labels/ja";
import { dashboardService } from "@/services/dashboardService";

interface DashboardPageProps {
  searchParams: Promise<{
    executed?: string;
    approved?: string;
    rejected?: string;
    error?: string;
    done?: string;
    task?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const query = await searchParams;
  const summary = await dashboardService.getSummary();
  const activeCount = summary.projectPipelines.length;

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <DashboardHero
          projectCount={activeCount}
          overallProgressPercent={summary.stats.overallProgressPercent}
          pendingApprovalCount={summary.stats.pendingApprovalCount}
        />

        <DashboardNotice query={query} />

        {summary.projectPipelines.length === 0 ? (
          <DashboardEmptyGuide />
        ) : (
          <div className="space-y-6 rounded-3xl border border-black p-4">
            {summary.projectPipelines.map((pipeline) => (
              <ProjectPipelineCard key={pipeline.projectId} pipeline={pipeline} />
            ))}
          </div>
        )}

        {summary.completedPipelines.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-black text-neutral-900">
              {ja.dashboard.completedProjects}
            </h2>
            {summary.completedPipelines.map((pipeline) => (
              <ProjectPipelineCard
                key={pipeline.projectId}
                pipeline={pipeline}
                compact
              />
            ))}
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}
