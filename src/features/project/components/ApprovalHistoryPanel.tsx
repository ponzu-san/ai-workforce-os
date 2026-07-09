import { ja } from "@/lib/labels/ja";
import { tStatus } from "@/lib/labels/ja";
import type { ApprovalHistoryEntry } from "@/services/projectPipelineService";

interface ApprovalHistoryPanelProps {
  history: ApprovalHistoryEntry[];
}

export function ApprovalHistoryPanel({ history }: ApprovalHistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.approval.historyTitle}
      </h2>
      <ul className="mt-3 space-y-3">
        {history.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-neutral-900">
                {tStatus(entry.status)}
              </span>
              <span className="text-neutral-500">
                {entry.approvedAt?.toLocaleString("ja-JP") ??
                  entry.createdAt.toLocaleString("ja-JP")}
              </span>
            </div>
            {entry.comment ? (
              <p className="mt-2 whitespace-pre-wrap text-neutral-700">
                {entry.comment}
              </p>
            ) : (
              <p className="mt-2 text-neutral-500">{ja.approval.noComment}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
