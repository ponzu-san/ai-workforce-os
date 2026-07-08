import { notFound } from "next/navigation";

import { ContextLink } from "@/components/common/ContextLink";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArtifactContent } from "@/features/artifact/components/ArtifactContent";
import { ArtifactReviewPanel } from "@/features/artifact/components/ArtifactReviewPanel";
import { displayStageName } from "@/lib/labels/stageNames";
import { ja } from "@/lib/labels/ja";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactService } from "@/services/artifactService";
import { buildStagePath } from "@/services/navigationRedirectService";

interface ArtifactDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtifactDetailPage({
  params,
}: ArtifactDetailPageProps) {
  const { id } = await params;
  const artifact = await artifactService.getById(id);
  if (!artifact) notFound();

  const pendingApproval = await approvalRepository.findPendingByTaskId(
    artifact.task_id,
  );

  const project = artifact.task.stage.workflow.project;
  const stageName = displayStageName(artifact.task.stage.name);
  const stageReturnTo = buildStagePath(
    project.id,
    artifact.task.stage.order,
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <ContextLink href={stageReturnTo} className="text-sm">
          ← {ja.artifacts.backToStage}
        </ContextLink>
        <h1 className="mt-2 text-2xl font-bold">{artifact.name}</h1>
        <p className="text-muted-foreground">
          {artifact.type} · v{artifact.version}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.artifacts.detailMeta}</CardTitle>
          <CardDescription>
            {ja.common.project}: {project.name} · {stageName} ·{" "}
            {artifact.task.assigned_agent?.name ?? ja.common.unassigned}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">{ja.common.task}:</span>{" "}
            {artifact.task.title}
          </p>
          <p className="text-muted-foreground">
            {ja.artifacts.createdAt}:{" "}
            {artifact.created_at.toLocaleString("ja-JP")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.artifacts.detailContent}</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtifactContent
            content={artifact.content}
            contentKind={artifact.content_kind}
            externalUrl={artifact.external_url}
            filePath={artifact.file_path}
            mimeType={artifact.mime_type}
          />
        </CardContent>
      </Card>

      {pendingApproval ? (
        <ArtifactReviewPanel
          approvalId={pendingApproval.id}
          returnTo={stageReturnTo}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{ja.artifacts.noPendingApproval}</p>
      )}
    </div>
  );
}
