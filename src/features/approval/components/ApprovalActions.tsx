"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { reviewApprovalAction } from "@/features/approval/actions";

interface ApprovalActionsProps {
  approvalId: string;
}

export function ApprovalActions({ approvalId }: ApprovalActionsProps) {
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  function handleReview(action: "approve" | "reject") {
    startTransition(async () => {
      await reviewApprovalAction(approvalId, action, comment);
      setComment("");
    });
  }

  return (
    <div className="space-y-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメント（任意）"
        className="min-h-16 w-full rounded-md border border-input px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => handleReview("approve")}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => handleReview("reject")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
