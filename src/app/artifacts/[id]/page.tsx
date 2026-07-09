import { notFound } from "next/navigation";

import { ContextLink } from "@/components/common/ContextLink";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { approvalRepository } from "@/database/repositories/approvalRepository";
import { artifactRepository } from "@/database/repositories/artifactRepository";
import { ArtifactContent } from "@/features/artifact/components/ArtifactContent";
import { ArtifactEditForm } from "@/features/artifact/components/ArtifactEditForm";
import { ArtifactReviewPanel } from "@/features/artifact/components/ArtifactReviewPanel";
import { ArtifactSourceList } from "@/features/artifact/components/ArtifactSourceList";
import { ContractChecklistPanel } from "@/features/artifact/components/ContractChecklistPanel";
import { ApprovalHistoryPanel } from "@/features/project/components/ApprovalHistoryPanel";
import { displayStageName } from "@/lib/labels/stageNames";
import { ja } from "@/lib/labels/ja";
import { artifactService } from "@/services/artifactService";
import { buildStagePath } from "@/services/navigationRedirectService";
import type { StageArtifactSummary } from "@/services/projectPipelineService";

interface ArtifactDetailPageProps {
  params: Promise<{ id: string }>;
}

function parseSourceIds(value: string): string[] {
  try {
    return JSON.parse(value || "[]") as string[];
  } catch {
    return [];
  }
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
  const approvalHistory = await approvalRepository.findByTaskId(artifact.task_id);
  const previousVersion = await artifactRepository.findPreviousVersion(id);
  const workflowArtifacts = await artifactRepository.findByWorkflowId(
    artifact.task.stage.workflow.id,
  );

  const allArtifacts: StageArtifactSummary[] = workflowArtifacts.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    taskTitle: item.task.title,
    preview: item.content.slice(0, 200),
    sourceArtifactIds: parseSourceIds(item.source_artifact_ids),
  }));

  const project = artifact.task.stage.workflow.project;
  const stageName = displayStageName(artifact.task.stage.name);
  const stageReturnTo = buildStagePath(
    project.id,
    artifact.task.stage.order,
  );
  const sourceIds = parseSourceIds(artifact.source_artifact_ids);
  const shareableTypes = new Set([
    "proposal",
    "estimate",
    "contract_draft",
    "contract_checklist",
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <ContextLink href={stageReturnTo} className="text-sm">
          {ja.artifacts.backToStage}
        </ContextLink>
        <h1 className="mt-2 text-2xl font-bold">{artifact.name}</h1>
        <p className="text-muted-foreground">
          {artifact.type} · v{artifact.version}
          {artifact.edited_by === "human" ? ` · ${ja.artifacts.editedByHuman}` : ""}
        </p>
        {shareableTypes.has(artifact.type) ? (
          <a
            href={`/artifacts/${artifact.id}/preview`}
            className="mt-2 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            {ja.artifacts.openSharePreview}
          </a>
        ) : null}
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

      <ArtifactSourceList
        sourceIds={sourceIds}
        allArtifacts={allArtifacts}
      />

      {artifact.type === "contract_checklist" ? (
        <ContractChecklistPanel
          artifactId={artifact.id}
          initialContent={artifact.content}
          returnTo={stageReturnTo}
          readOnly={!pendingApproval}
        />
      ) : (
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
            {pendingApproval && artifact.content_kind === "markdown" ? (
              <div className="mt-4">
                <ArtifactEditForm
                  artifactId={artifact.id}
                  initialContent={artifact.content}
                  returnTo={stageReturnTo}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {previousVersion ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.artifacts.previousVersion}</CardTitle>
          </CardHeader>
          <CardContent>
            <ArtifactContent
              content={previousVersion.content}
              contentKind={previousVersion.content_kind}
            />
          </CardContent>
        </Card>
      ) : null}

      <ApprovalHistoryPanel
        history={approvalHistory
          .filter((entry) => entry.status !== "pending")
          .map((entry) => ({
            id: entry.id,
            status: entry.status,
            comment: entry.comment,
            approvedBy: entry.approved_by,
            approvedAt: entry.approved_at,
            createdAt: entry.created_at,
          }))}
      />

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
