import { notFound } from "next/navigation";

import { ArtifactContent } from "@/features/artifact/components/ArtifactContent";
import { ContractChecklistPanel } from "@/features/artifact/components/ContractChecklistPanel";
import { displayStageName } from "@/lib/labels/stageNames";
import { ja } from "@/lib/labels/ja";
import { artifactService } from "@/services/artifactService";

interface ArtifactPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtifactPreviewPage({
  params,
}: ArtifactPreviewPageProps) {
  const { id } = await params;
  const artifact = await artifactService.getById(id);
  if (!artifact) notFound();

  const project = artifact.task.stage.workflow.project;
  const stageName = displayStageName(artifact.task.stage.name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:px-0">
      <header className="border-b border-neutral-200 pb-6 print:border-black">
        <p className="text-sm text-neutral-500">{project.name}</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">
          {artifact.name}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {stageName} · {artifact.type}
        </p>
      </header>

      <main className="mt-8">
        {artifact.type === "contract_checklist" ? (
          <ContractChecklistPanel
            artifactId={artifact.id}
            initialContent={artifact.content}
            returnTo={`/artifacts/${artifact.id}`}
            readOnly
          />
        ) : (
          <div className="prose-neutral text-base leading-relaxed text-neutral-900">
            <ArtifactContent
              content={artifact.content}
              contentKind={artifact.content_kind}
              externalUrl={artifact.external_url}
              filePath={artifact.file_path}
              mimeType={artifact.mime_type}
            />
          </div>
        )}
      </main>

      <footer className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500 print:hidden">
        <p>{ja.artifacts.sharePreviewFooter}</p>
      </footer>
    </div>
  );
}
