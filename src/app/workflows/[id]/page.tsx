import { notFound, redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";

interface WorkflowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowDetailPage({
  params,
}: WorkflowDetailPageProps) {
  const { id } = await params;
  const destination =
    await navigationRedirectService.resolveWorkflowStagePath(id);
  if (!destination) notFound();

  redirect(destination);
}
