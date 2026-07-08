import { notFound, redirect } from "next/navigation";

import { resolveOpenStageOrder } from "@/lib/workflow/pipelineView";
import { projectPipelineService } from "@/services/projectPipelineService";

interface ProjectRedirectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectRedirectPage({
  params,
}: ProjectRedirectPageProps) {
  const { projectId } = await params;
  const pipeline = await projectPipelineService.getPipelineView(projectId);
  if (!pipeline) notFound();

  const stageOrder = resolveOpenStageOrder(pipeline);
  redirect(`/p/${projectId}/stages/${stageOrder}`);
}
