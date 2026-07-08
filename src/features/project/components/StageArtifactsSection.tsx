import Link from "next/link";

import { ja } from "@/lib/labels/ja";
import type { StageArtifactSummary } from "@/services/projectPipelineService";

interface StageArtifactsSectionProps {
  artifacts: StageArtifactSummary[];
}

export function StageArtifactsSection({
  artifacts,
}: StageArtifactsSectionProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.project.stageArtifacts}
      </h2>
      {artifacts.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">
          {ja.project.stageArtifactsEmpty}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {artifacts.map((artifact) => (
            <li
              key={artifact.id}
              className="rounded-lg border border-neutral-100 bg-neutral-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-neutral-900">{artifact.name}</p>
                  <p className="text-xs text-neutral-500">
                    {artifact.type} · {artifact.taskTitle}
                  </p>
                </div>
                <Link
                  href={`/artifacts/${artifact.id}`}
                  className="text-sm font-medium text-amber-700 underline underline-offset-4"
                >
                  {ja.artifacts.viewDetail}
                </Link>
              </div>
              <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-neutral-600">
                {artifact.preview}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
