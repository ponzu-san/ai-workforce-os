import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import { PipelineProgressRail } from "@/features/dashboard/components/PipelineProgressRail";
import { PipelineStepRow } from "@/features/dashboard/components/PipelineStepRow";
import { CompleteProjectPrompt } from "@/features/project/components/CompleteProjectPrompt";
import { OpenProjectButton } from "@/features/project/components/OpenProjectButton";
import { ja } from "@/lib/labels/ja";
import { isPipelineReadyToComplete } from "@/lib/workflow/projectCompletion";
import type { ProjectPipelineView } from "@/types/domain";

interface ProjectPipelineCardProps {
  pipeline: ProjectPipelineView;
  compact?: boolean;
}

export function ProjectPipelineCard({
  pipeline,
  compact = false,
}: ProjectPipelineCardProps) {
  const currentStage = pipeline.currentStage;
  const readyToComplete =
    !compact && isPipelineReadyToComplete(pipeline);

  return (
    <section className="overflow-hidden rounded-3xl border-2 border-black bg-white text-neutral-900 shadow-[6px_6px_0_0_#000]">
      <div className="rounded-t-3xl border-b-2 border-black bg-yellow-200 px-5 py-4 text-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-800">
              {ja.dashboard.pipelineTitle}
            </p>
            <Link
              href={`/projects/${pipeline.projectId}`}
              className="mt-1 block text-2xl font-black text-neutral-900 hover:underline"
            >
              {pipeline.projectName}
            </Link>
            <p className="mt-1 text-sm font-medium text-neutral-700">
              {pipeline.workflowName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border-2 border-black bg-white px-4 py-2 text-center text-neutral-900 shadow-[3px_3px_0_0_#000]">
              <p className="text-xs font-bold">{ja.dashboard.total}</p>
              <p className="text-2xl font-black">{pipeline.progressPercent}%</p>
              <p className="text-[10px] font-bold">{ja.dashboard.flowing}</p>
            </div>
            <StatusBadge value={pipeline.workflowStatus} />
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {readyToComplete ? (
          <CompleteProjectPrompt
            projectId={pipeline.projectId}
            projectName={pipeline.projectName}
            returnTo="/"
            variant="prominent"
          />
        ) : null}

        {currentStage ? (
          <div className="rounded-2xl border-2 border-black bg-blue-100 p-4 text-neutral-900 shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-800">
              {ja.dashboard.nowProcessing}
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-black text-neutral-900">
                {currentStage.name}
              </p>
              <span className="rounded-full border border-black bg-white px-3 py-1 text-sm font-bold text-neutral-900">
                {currentStage.stepNumber}
              </span>
            </div>
            {!compact && currentStage.taskTitle ? (
              <p className="mt-2 text-sm font-medium text-neutral-800">
                {currentStage.taskTitle}
              </p>
            ) : null}
            <p className="mt-2 text-xs font-bold text-neutral-600">
              {pipeline.completedTasks}/{pipeline.totalTasks}{" "}
              {ja.common.tasksDone}
            </p>
          </div>
        ) : null}

        <div className="overflow-x-auto scroll-smooth px-1 py-2">
          <PipelineStepRow steps={pipeline.steps} />
        </div>

        <OpenProjectButton projectId={pipeline.projectId} compact={compact} />

        <PipelineProgressRail
          steps={pipeline.steps}
          progressPercent={pipeline.progressPercent}
        />
      </div>
    </section>
  );
}
