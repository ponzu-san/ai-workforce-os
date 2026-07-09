import { notFound } from "next/navigation";

import { DashboardNotice } from "@/features/dashboard/components/DashboardNotice";
import { StageWorkspace } from "@/features/project/components/StageWorkspace";
import { projectPipelineService } from "@/services/projectPipelineService";

interface StagePageProps {
  params: Promise<{ projectId: string; order: string }>;
  searchParams: Promise<{
    executed?: string;
    approved?: string;
    rejected?: string;
    error?: string;
    done?: string;
    handoff?: string;
    registered?: string;
    task?: string;
    workflowDone?: string;
    projectId?: string;
  }>;
}

export default async function StagePage({
  params,
  searchParams,
}: StagePageProps) {
  const { projectId, order: orderParam } = await params;
  const order = Number(orderParam);
  if (Number.isNaN(order)) notFound();

  const stageContext = await projectPipelineService.getStagePageContext(
    projectId,
    order,
  );
  if (!stageContext) notFound();

  const query = await searchParams;
  const returnTo = `/p/${projectId}/stages/${order}`;

  return (
    <div className="flex flex-col gap-6">
      <DashboardNotice query={query} />
      <StageWorkspace
        pipeline={stageContext.pipeline}
        stageOrder={order}
        returnTo={returnTo}
        artifacts={stageContext.artifacts}
        pendingApprovalId={stageContext.pendingApprovalId}
        stageNextAction={stageContext.stageNextAction}
        completionQuery={query}
      />
    </div>
  );
}
