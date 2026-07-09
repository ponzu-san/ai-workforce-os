import { getStageCompletionSummary } from "@/lib/workflow/stageBrief";
import { ja } from "@/lib/labels/ja";

interface StageCompletionSummaryProps {
  stageName: string;
  taskTitle: string;
  variant: "executed" | "approved" | "returned" | "registered";
}

export function StageCompletionSummary({
  stageName,
  taskTitle,
  variant,
}: StageCompletionSummaryProps) {
  const summary = getStageCompletionSummary(stageName, taskTitle);

  const titleMap = {
    executed: ja.project.completionExecutedTitle,
    approved: ja.project.completionApprovedTitle,
    returned: ja.project.completionReturnedTitle,
    registered: ja.project.completionRegisteredTitle,
  };

  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
        {titleMap[variant]}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-800">{summary}</p>
      <p className="mt-2 text-sm font-medium text-neutral-900">
        {ja.project.completionNextStep}
      </p>
    </section>
  );
}
