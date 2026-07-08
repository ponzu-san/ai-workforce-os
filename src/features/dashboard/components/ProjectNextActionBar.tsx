import Link from "next/link";

import { SubmitButton } from "@/components/ui/submit-button";
import {
  executeNextTaskFormAction,
  startAndExecuteFormAction,
} from "@/features/workflow/actions";
import { ja } from "@/lib/labels/ja";
import type { ProjectNextAction } from "@/types/domain";

interface ProjectNextActionBarProps {
  nextAction: ProjectNextAction;
  returnTo?: string;
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
  "border-2 border-black bg-yellow-300 px-6 font-black text-neutral-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-200";

export function ProjectNextActionBar({
  nextAction,
  returnTo = "/",
}: ProjectNextActionBarProps) {
  const workflowId = nextAction.workflowId ?? "";
  const primaryLabel = getActionLabel(nextAction.labelKey);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {nextAction.type === "review_artifact" && nextAction.href ? (
        <Link href={nextAction.href} className={`inline-flex items-center rounded-md py-2 text-sm ${primaryButtonClass}`}>
          {primaryLabel}
        </Link>
      ) : null}

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
        <Link
          href={nextAction.href}
          className={`inline-flex items-center rounded-md py-2 text-sm ${primaryButtonClass}`}
        >
          {primaryLabel}
        </Link>
      ) : null}

      {nextAction.taskTitle ? (
        <span className="text-sm text-neutral-600">{nextAction.taskTitle}</span>
      ) : null}
    </div>
  );
}
