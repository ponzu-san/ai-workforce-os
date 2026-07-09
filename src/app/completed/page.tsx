import Link from "next/link";

import { ProjectPipelineCard } from "@/features/dashboard/components/ProjectPipelineCard";
import { PageNotice } from "@/components/common/PageNotice";
import { ja } from "@/lib/labels/ja";
import { pipelineListService } from "@/services/pipelineListService";

interface CompletedPageProps {
  searchParams: Promise<{ completed?: string; error?: string }>;
}

export default async function CompletedProjectsPage({
  searchParams,
}: CompletedPageProps) {
  const query = await searchParams;
  const pipelines = await pipelineListService.listCompletedPipelines();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          {ja.completed.title}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">{ja.completed.subtitle}</p>
      </div>

      <PageNotice
        error={query.error}
        success={query.completed === "1" ? ja.completed.markedComplete : undefined}
      />

      {pipelines.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">{ja.completed.empty}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline"
          >
            {ja.dashboard.title}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pipelines.map((pipeline) => (
            <div key={pipeline.projectId} className="space-y-1">
              {pipeline.projectUpdatedAt ? (
                <p className="px-1 text-xs text-neutral-500">
                  {ja.completed.completedAt}:{" "}
                  {pipeline.projectUpdatedAt.toLocaleDateString("ja-JP")}
                </p>
              ) : null}
              <ProjectPipelineCard pipeline={pipeline} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
