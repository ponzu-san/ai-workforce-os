import { getStageExecutionBrief } from "@/lib/workflow/stageBrief";
import { ja } from "@/lib/labels/ja";
import type { ProjectNextAction } from "@/types/domain";

interface StageExecutionBriefPanelProps {
  stageName: string;
  nextAction: ProjectNextAction | null;
}

export function StageExecutionBriefPanel({
  stageName,
  nextAction,
}: StageExecutionBriefPanelProps) {
  if (
    !nextAction ||
    (nextAction.type !== "start_and_execute" &&
      nextAction.type !== "execute_next")
  ) {
    return null;
  }

  const brief = getStageExecutionBrief(stageName);

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
        {ja.project.executionBriefTitle}
      </p>
      <dl className="mt-3 space-y-2 text-sm text-neutral-800">
        <div>
          <dt className="font-semibold text-neutral-900">
            {ja.project.executionAgent}
          </dt>
          <dd>{brief.agentLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-neutral-900">
            {ja.project.executionDeliverable}
          </dt>
          <dd>{brief.deliverableLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-neutral-900">
            {ja.project.executionReferences}
          </dt>
          <dd>{brief.referenceLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-neutral-900">
            {ja.project.executionHumanAction}
          </dt>
          <dd>{brief.humanAction}</dd>
        </div>
      </dl>
    </section>
  );
}
