"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { reviewApprovalFormAction } from "@/features/approval/actions";
import { ja } from "@/lib/labels/ja";

interface ArtifactReviewPanelProps {
  approvalId: string;
  returnTo?: string;
}

export function ArtifactReviewPanel({
  approvalId,
  returnTo = "/",
}: ArtifactReviewPanelProps) {
  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="font-semibold text-amber-900">
        {ja.artifacts.reviewBeforeApprove}
      </p>
      <p className="mt-1 text-sm text-neutral-700">{ja.approval.reviewHint}</p>
      <form action={reviewApprovalFormAction} className="mt-3 space-y-3">
        <input type="hidden" name="approvalId" value={approvalId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <textarea
          name="comment"
          placeholder={ja.approval.commentPlaceholder}
          className="min-h-16 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <SubmitButton
            label={ja.approval.approve}
            name="action"
            value="approve"
            className="bg-green-600 text-white hover:bg-green-700"
          />
          <SubmitButton
            label={ja.approval.returnForRevision}
            name="action"
            value="return"
            variant="outline"
          />
        </div>
      </form>
    </section>
  );
}
