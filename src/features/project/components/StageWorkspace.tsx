import Link from "next/link";

import { ContextLink } from "@/components/common/ContextLink";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ArtifactReviewPanel } from "@/features/artifact/components/ArtifactReviewPanel";
import { ExternalArtifactRegisterForm } from "@/features/artifact/components/ExternalArtifactRegisterForm";
import { ProjectInstructionForm } from "@/features/dashboard/components/ProjectInstructionForm";
import { StageArtifactsSection } from "@/features/project/components/StageArtifactsSection";
import { StageLockPanel } from "@/features/project/components/StageLockPanel";
import { StageMiniPipeline } from "@/features/project/components/StageMiniPipeline";
import { StagePrimaryAction } from "@/features/project/components/StagePrimaryAction";
import { ja } from "@/lib/labels/ja";
import { getStepByOrder } from "@/lib/workflow/pipelineView";
import type { StageArtifactSummary } from "@/services/projectPipelineService";
import type {
  PipelineStepStatus,
  ProjectNextAction,
  ProjectPipelineView,
} from "@/types/domain";

interface StageWorkspaceProps {
  pipeline: ProjectPipelineView;
  stageOrder: number;
  returnTo: string;
  artifacts: StageArtifactSummary[];
  pendingApprovalId: string | null;
  stageNextAction: ProjectNextAction | null;
}

function stageStatusLabel(status: PipelineStepStatus): string {
  if (status === "done") return ja.dashboard.stepDone;
  if (status === "run") return ja.dashboard.stepRun;
  return ja.dashboard.stepWait;
}

export function StageWorkspace({
  pipeline,
  stageOrder,
  returnTo,
  artifacts,
  pendingApprovalId,
  stageNextAction,
}: StageWorkspaceProps) {
  const step = getStepByOrder(pipeline, stageOrder);
  if (!step) {
    return (
      <p className="text-sm text-neutral-600">{ja.project.stageNotFound}</p>
    );
  }

  const isLocked = step.status === "wait";
  const isReadOnly = step.status === "done";
  const canOperate = step.status === "run";
  const isCurrentRunStage = pipeline.currentStage?.order === stageOrder;
  const taskTitle =
    (isCurrentRunStage ? pipeline.currentStage?.taskTitle : null) ??
    step.previewTaskTitle ??
    step.name;
  const showPrimaryAction =
    stageNextAction !== null &&
    stageNextAction.type !== "review_artifact" &&
    stageNextAction.type !== "register_external";
  const projectSettingsHref = `/projects/${pipeline.projectId}`;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← {ja.dashboard.title}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <ContextLink href={projectSettingsHref} className="text-sm">
              {pipeline.projectName}
            </ContextLink>
            <h1 className="mt-1 text-2xl font-bold text-neutral-900">
              {step.stepNumber} {step.name}
            </h1>
            {!isLocked ? (
              <p className="mt-1 text-sm text-neutral-600">
                {ja.common.task}: {taskTitle}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              {stageStatusLabel(step.status)}
            </span>
            <StatusBadge value={pipeline.workflowStatus} />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          <StageMiniPipeline steps={pipeline.steps} currentOrder={stageOrder} />
        </div>
      </div>

      {isLocked ? (
        <StageLockPanel pipeline={pipeline} stageOrder={stageOrder} />
      ) : null}

      {!isLocked && canOperate ? (
        <>
          {stageNextAction ? (
            <ProjectInstructionForm
              projectId={pipeline.projectId}
              nextAction={stageNextAction}
            />
          ) : null}
          <StageArtifactsSection artifacts={artifacts} />
          {stageNextAction?.type === "register_external" &&
          stageNextAction.taskId ? (
            <ExternalArtifactRegisterForm
              taskId={stageNextAction.taskId}
              taskTitle={stageNextAction.taskTitle}
              returnTo={returnTo}
            />
          ) : null}
          {showPrimaryAction ? (
            <StagePrimaryAction
              nextAction={stageNextAction}
              returnTo={returnTo}
            />
          ) : null}
          {stageNextAction?.type === "review_artifact" &&
          stageNextAction.href &&
          !pendingApprovalId ? (
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-neutral-900">
                {ja.project.stagePrimaryAction}
              </h2>
              <Link
                href={stageNextAction.href}
                className="mt-4 inline-flex rounded-md bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
              >
                {ja.dashboard.reviewContent}
              </Link>
            </section>
          ) : null}
          {!stageNextAction && !pendingApprovalId ? (
            <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-6">
              <p className="text-sm text-neutral-800">
                {ja.project.stageNoTasksAction}
              </p>
              <ContextLink href={projectSettingsHref} className="mt-3 text-sm">
                {ja.project.openProjectSettings}
              </ContextLink>
            </section>
          ) : null}
          {pendingApprovalId ? (
            <ArtifactReviewPanel
              approvalId={pendingApprovalId}
              returnTo={returnTo}
            />
          ) : null}
        </>
      ) : null}

      {isReadOnly ? (
        <>
          <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-600">{ja.project.stageReadOnly}</p>
          </section>
          <StageArtifactsSection artifacts={artifacts} />
          {stageNextAction?.type === "view_artifacts" ? (
            <StagePrimaryAction
              nextAction={stageNextAction}
              returnTo={returnTo}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
