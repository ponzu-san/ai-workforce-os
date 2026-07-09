import Link from "next/link";

import { displayStageName } from "@/lib/labels/stageNames";
import { ja } from "@/lib/labels/ja";
import type { StageArtifactSummary } from "@/services/projectPipelineService";

interface DeliveryArtifactHubProps {
  artifacts: StageArtifactSummary[];
  releaseArtifactId?: string | null;
}

export function DeliveryArtifactHub({
  artifacts,
  releaseArtifactId,
}: DeliveryArtifactHubProps) {
  const deliverables = artifacts.filter(
    (artifact) =>
      artifact.type !== "handoff_skip" && artifact.id !== releaseArtifactId,
  );

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-neutral-900">
        {ja.project.deliveryHubTitle}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{ja.project.deliveryHubDesc}</p>

      {deliverables.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          {ja.project.deliveryHubEmpty}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-100">
          {deliverables.map((artifact) => (
            <li
              key={artifact.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium text-neutral-900">{artifact.name}</p>
                <p className="text-xs text-neutral-500">
                  {artifact.taskTitle} · {artifact.type}
                </p>
              </div>
              <Link
                href={`/artifacts/${artifact.id}`}
                className="text-sm font-medium text-amber-800 underline underline-offset-4"
              >
                {ja.artifacts.viewDetail}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {releaseArtifactId ? (
        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-4">
          <p className="text-sm font-semibold text-neutral-900">
            {ja.project.deliverySignoffTitle}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {ja.project.deliverySignoffDesc}
          </p>
          <Link
            href={`/artifacts/${releaseArtifactId}`}
            className="mt-3 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            {displayStageName("Release")} {ja.artifacts.viewDetail}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
