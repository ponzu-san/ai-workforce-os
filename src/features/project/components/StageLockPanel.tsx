import Link from "next/link";

import { ja } from "@/lib/labels/ja";
import { getStepByOrder } from "@/lib/workflow/pipelineView";
import type { ProjectPipelineView } from "@/types/domain";

interface StageLockPanelProps {
  pipeline: ProjectPipelineView;
  stageOrder: number;
}

export function StageLockPanel({ pipeline, stageOrder }: StageLockPanelProps) {
  const step = getStepByOrder(pipeline, stageOrder);
  const previousStep = pipeline.steps
    .filter((item) => item.order < stageOrder)
    .sort((a, b) => b.order - a.order)[0];

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
      <p className="text-sm font-semibold text-amber-800">
        {ja.project.stageLockedTitle}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">
        {step?.stepNumber} {step?.name}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        {ja.project.stageLockedDescription}
      </p>
      {step?.previewTaskTitle ? (
        <p className="mt-4 rounded-lg border border-amber-100 bg-white p-4 text-sm text-neutral-700">
          <span className="font-medium text-neutral-900">
            {ja.project.stagePreviewLabel}:
          </span>{" "}
          {step.previewTaskTitle}
        </p>
      ) : null}
      {previousStep ? (
        <Link
          href={`/p/${pipeline.projectId}/stages/${previousStep.order}`}
          className="mt-4 inline-flex text-sm font-medium text-amber-800 underline underline-offset-4"
        >
          {ja.project.goPreviousStage}
        </Link>
      ) : null}
    </section>
  );
}
