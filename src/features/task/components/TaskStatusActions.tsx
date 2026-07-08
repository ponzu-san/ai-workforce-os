"use client";

import { useTransition } from "react";

import { updateTaskStatusAction } from "@/features/task/actions";

interface TaskStatusActionsProps {
  taskId: string;
  currentStatus: string;
}

export function TaskStatusActions({
  taskId,
  currentStatus,
}: TaskStatusActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleChange(status: string) {
    startTransition(async () => {
      await updateTaskStatusAction(taskId, status);
    });
  }

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-input px-2 py-1 text-sm"
    >
      <option value="todo">todo</option>
      <option value="running">running</option>
      <option value="review">review</option>
      <option value="done">done</option>
      <option value="blocked">blocked</option>
    </select>
  );
}
