import Link from "next/link";

import { ja } from "@/lib/labels/ja";

interface WorkflowFeedbackProps {
  query: {
    executed?: string;
    task?: string;
    error?: string;
    done?: string;
    started?: string;
  };
}

export function WorkflowFeedback({ query }: WorkflowFeedbackProps) {
  if (query.error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <p className="font-medium">{ja.feedback.errorTitle}</p>
        <p>{decodeURIComponent(query.error)}</p>
      </div>
    );
  }

  if (query.executed === "1") {
    const taskName = query.task ? decodeURIComponent(query.task) : ja.common.task;
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
        <p className="font-medium">
          {ja.feedback.taskDone}: {taskName}
        </p>
        <p className="mt-1">
          {ja.feedback.taskReview}{" "}
          <strong>{ja.feedback.taskReviewStatus}</strong>
          {ja.feedback.taskDoneHint}
        </p>
        <ul className="mt-2 list-inside list-disc">
          <li>
            <Link href="/approvals" className="underline">
              {ja.feedback.goApprovals}
            </Link>
            {ja.feedback.goApprovalsAction}
          </li>
          <li>
            <Link href="/artifacts" className="underline">
              {ja.feedback.goArtifacts}
            </Link>
            {ja.feedback.goArtifactsAction}
          </li>
        </ul>
      </div>
    );
  }

  if (query.started === "1") {
    return (
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
        {ja.feedback.started}
      </div>
    );
  }

  if (query.done === "1") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
        {ja.feedback.completed}{" "}
        <strong>{ja.feedback.completedStatus}</strong>
        {ja.feedback.completedSuffix}
      </div>
    );
  }

  return null;
}
