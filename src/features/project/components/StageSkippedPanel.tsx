import Link from "next/link";

import { getSkipStageDescription } from "@/lib/workflow/stageBrief";
import { ja } from "@/lib/labels/ja";
import { getStepByOrder } from "@/lib/workflow/pipelineView";
import type { ProjectPipelineView } from "@/types/domain";

interface StageSkippedPanelProps {
  pipeline: ProjectPipelineView;
  stageOrder: number;
  stageName: string;
}

export function StageSkippedPanel({
  pipeline,
  stageOrder,
  stageName,
}: StageSkippedPanelProps) {
  const step = getStepByOrder(pipeline, stageOrder);
  const previousStep = pipeline.steps
    .filter((item) => item.order < stageOrder && item.status !== "skip")
    .sort((a, b) => b.order - a.order)[0];
  const nextStep = pipeline.steps
    .filter((item) => item.order > stageOrder && item.status === "run")
    .sort((a, b) => a.order - b.order)[0];

  return (
    <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
      <p className="text-sm font-semibold text-neutral-600">
        {ja.project.stageSkippedTitle}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">
        {step?.stepNumber} {step?.name}
      </h2>
      <p className="mt-2 text-sm text-neutral-700">
        {getSkipStageDescription(stageName)}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {previousStep ? (
          <Link
            href={`/p/${pipeline.projectId}/stages/${previousStep.order}`}
            className="text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            {ja.project.goPreviousStage}
          </Link>
        ) : null}
        {nextStep ? (
          <Link
            href={`/p/${pipeline.projectId}/stages/${nextStep.order}`}
            className="text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            {ja.dashboard.goNextStage}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
