import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "@/lib/labels/ja";
import { buildStagePath } from "@/services/navigationRedirectService";
import type { ApprovalSummary } from "@/types/domain";

interface PendingApprovalsSummaryProps {
  pendingApprovals: ApprovalSummary[];
}

export function PendingApprovalsSummary({
  pendingApprovals,
}: PendingApprovalsSummaryProps) {
  if (pendingApprovals.length === 0) {
    return (
      <Card className="border-2 border-black bg-white text-neutral-900 shadow-[4px_4px_0_0_#000]">
        <CardHeader>
          <CardTitle className="text-base text-neutral-900">
            {ja.dashboard.pendingSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">{ja.dashboard.noApprovals}</p>
        </CardContent>
      </Card>
    );
  }

  const approvalsEntryPath = buildStagePath(
    pendingApprovals[0].projectId,
    pendingApprovals[0].stageOrder,
  );

  return (
    <Card className="border-2 border-black bg-white text-neutral-900 shadow-[4px_4px_0_0_#000]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base text-neutral-900">
          {ja.dashboard.pendingSummary}
        </CardTitle>
        <Link
          href={approvalsEntryPath}
          className="text-sm font-bold text-neutral-800 underline"
        >
          {ja.dashboard.openApprovals}
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingApprovals.map((approval) => (
          <div
            key={approval.id}
            className="rounded-md border border-black/20 bg-neutral-50 p-3 text-sm"
          >
            <p className="font-bold text-neutral-900">{approval.taskTitle}</p>
            <p className="text-neutral-600">{approval.projectName}</p>
            {approval.artifactId ? (
              <Link
                href={`/artifacts/${approval.artifactId}`}
                className="mt-2 inline-block text-sm font-medium text-blue-700 underline"
              >
                {ja.dashboard.reviewContent}
              </Link>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
