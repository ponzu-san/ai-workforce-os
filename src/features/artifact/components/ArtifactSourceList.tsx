import Link from "next/link";

import { ja } from "@/lib/labels/ja";
import type { StageArtifactSummary } from "@/services/projectPipelineService";

interface ArtifactSourceListProps {
  sourceIds: string[];
  allArtifacts: StageArtifactSummary[];
}

export function ArtifactSourceList({
  sourceIds,
  allArtifacts,
}: ArtifactSourceListProps) {
  if (sourceIds.length === 0) return null;

  const sources = sourceIds
    .map((id) => allArtifacts.find((artifact) => artifact.id === id))
    .filter((artifact): artifact is StageArtifactSummary => Boolean(artifact));

  if (sources.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.artifacts.sourceTitle}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{ja.artifacts.sourceDesc}</p>
      <ul className="mt-3 space-y-2">
        {sources.map((artifact) => (
          <li key={artifact.id}>
            <Link
              href={`/artifacts/${artifact.id}`}
              className="text-sm font-medium text-amber-800 underline underline-offset-4"
            >
              {artifact.name}
            </Link>
            <span className="ml-2 text-xs text-neutral-500">
              {artifact.taskTitle}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
