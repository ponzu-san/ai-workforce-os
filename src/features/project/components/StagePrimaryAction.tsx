import Link from "next/link";

import { SubmitButton } from "@/components/ui/submit-button";
import {
  executeNextTaskFormAction,
  startAndExecuteFormAction,
} from "@/features/workflow/actions";
import { ja } from "@/lib/labels/ja";
import type { ProjectNextAction } from "@/types/domain";

interface StagePrimaryActionProps {
  nextAction: ProjectNextAction;
  returnTo: string;
}

function getActionLabel(labelKey: ProjectNextAction["labelKey"]): string {
  const labels: Record<ProjectNextAction["labelKey"], string> = {
    reviewContent: ja.dashboard.reviewContent,
    registerExternal: ja.dashboard.registerExternal,
    startFirstStep: ja.dashboard.startFirstStep,
    advanceStep: ja.dashboard.advanceStep,
    viewArtifacts: ja.dashboard.viewArtifacts,
    viewWorkflow: ja.dashboard.viewWorkflow,
    createProject: ja.dashboard.createProject,
  };

  return labels[labelKey];
}

const primaryButtonClass =
  "rounded-md bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600";

export function StagePrimaryAction({
  nextAction,
  returnTo,
}: StagePrimaryActionProps) {
  if (nextAction.type === "review_artifact") {
    return null;
  }

  const workflowId = nextAction.workflowId ?? "";
  const primaryLabel = getActionLabel(nextAction.labelKey);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.project.stagePrimaryAction}
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {nextAction.type === "start_and_execute" ? (
          <form action={startAndExecuteFormAction}>
            <input type="hidden" name="workflowId" value={workflowId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <SubmitButton label={primaryLabel} className={primaryButtonClass} />
          </form>
        ) : null}

        {nextAction.type === "execute_next" ? (
          <form action={executeNextTaskFormAction}>
            <input type="hidden" name="workflowId" value={workflowId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <SubmitButton label={primaryLabel} className={primaryButtonClass} />
          </form>
        ) : null}

        {(nextAction.type === "view_artifacts" ||
          nextAction.type === "view_workflow") &&
        nextAction.href ? (
          <Link href={nextAction.href} className={primaryButtonClass}>
            {primaryLabel}
          </Link>
        ) : null}

        {nextAction.taskTitle ? (
          <span className="text-sm text-neutral-600">{nextAction.taskTitle}</span>
        ) : null}
      </div>
    </section>
  );
}
