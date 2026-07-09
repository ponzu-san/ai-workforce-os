import { ja } from "@/lib/labels/ja";

interface DashboardNoticeProps {
  query: {
    executed?: string;
    approved?: string;
    rejected?: string;
    error?: string;
    done?: string;
    handoff?: string;
    registered?: string;
    task?: string;
    instructionSaved?: string;
  };
}

export function DashboardNotice({ query }: DashboardNoticeProps) {
  if (query.error) {
    return (
      <div className="rounded-2xl border-2 border-black bg-red-100 p-4 text-sm font-medium text-red-900 shadow-[3px_3px_0_0_#000]">
        <p className="font-black">{ja.dashboard.errorNotice}</p>
        <p>{decodeURIComponent(query.error)}</p>
      </div>
    );
  }

  if (query.instructionSaved === "1") {
    return (
      <div className="rounded-2xl border-2 border-black bg-green-100 p-4 text-sm font-medium text-green-900 shadow-[3px_3px_0_0_#000]">
        {ja.project.instructionSavedNotice}
      </div>
    );
  }

  if (query.approved === "1") {
    return (
      <div className="rounded-2xl border-2 border-black bg-green-100 p-4 text-sm font-medium text-green-900 shadow-[3px_3px_0_0_#000]">
        {ja.dashboard.approvedNotice}
      </div>
    );
  }

  if (query.rejected === "1") {
    return (
      <div className="rounded-2xl border-2 border-black bg-orange-100 p-4 text-sm font-medium text-orange-900 shadow-[3px_3px_0_0_#000]">
        {ja.approval.reject}
      </div>
    );
  }

  if (query.registered === "1") {
    return (
      <div className="rounded-2xl border-2 border-black bg-green-100 p-4 text-sm font-medium text-green-900 shadow-[3px_3px_0_0_#000]">
        {ja.dashboard.registeredNotice}
      </div>
    );
  }

  if (query.handoff === "1") {
    const taskName = query.task ? decodeURIComponent(query.task) : null;
    return (
      <div className="rounded-2xl border-2 border-black bg-violet-100 p-4 text-sm font-medium text-violet-900 shadow-[3px_3px_0_0_#000]">
        {ja.dashboard.handoffNotice}
        {taskName ? ` (${taskName})` : ""}
      </div>
    );
  }

  if (query.executed === "1" || query.done === "1") {
    const taskName = query.task ? decodeURIComponent(query.task) : null;
    return (
      <div className="rounded-2xl border-2 border-black bg-blue-100 p-4 text-sm font-medium text-blue-900 shadow-[3px_3px_0_0_#000]">
        {ja.dashboard.executedNotice}
        {taskName ? ` (${taskName})` : ""}
      </div>
    );
  }

  return null;
}
