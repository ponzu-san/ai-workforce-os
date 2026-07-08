import Link from "next/link";

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
        <p className="font-medium">実行エラー</p>
        <p>{decodeURIComponent(query.error)}</p>
      </div>
    );
  }

  if (query.executed === "1") {
    const taskName = query.task ? decodeURIComponent(query.task) : "Task";
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
        <p className="font-medium">Task 実行完了: {taskName}</p>
        <p className="mt-1">
          ステータスが <strong>review</strong> になりました。次を確認してください:
        </p>
        <ul className="mt-2 list-inside list-disc">
          <li>
            <Link href="/approvals" className="underline">
              Approvals
            </Link>{" "}
            で承認
          </li>
          <li>
            <Link href="/artifacts" className="underline">
              Artifacts
            </Link>{" "}
            で成果物を確認
          </li>
        </ul>
      </div>
    );
  }

  if (query.started === "1") {
    return (
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
        Workflow を開始しました。Agent 割当済み — Execute Next Task
        をクリックして最初の Task を実行してください。
      </div>
    );
  }

  if (query.done === "1") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
        すべての Task が完了しました。Workflow は{" "}
        <strong>completed</strong> です。
      </div>
    );
  }

  return null;
}
