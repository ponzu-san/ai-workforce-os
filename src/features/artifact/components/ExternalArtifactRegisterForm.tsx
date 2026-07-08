"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { registerExternalArtifactAction } from "@/features/artifact/actions";
import { ja } from "@/lib/labels/ja";

interface ExternalArtifactRegisterFormProps {
  taskId: string;
  taskTitle?: string;
  returnTo: string;
}

export function ExternalArtifactRegisterForm({
  taskId,
  taskTitle,
  returnTo,
}: ExternalArtifactRegisterFormProps) {
  return (
    <section className="rounded-xl border border-amber-300 bg-amber-50/80 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.artifacts.registerExternal}
      </h2>
      <p className="mt-2 text-sm text-neutral-700">
        {ja.artifacts.registerExternalDesc}
      </p>
      {taskTitle ? (
        <p className="mt-1 text-sm text-neutral-600">
          {ja.common.task}: {taskTitle}
        </p>
      ) : null}

      <form action={registerExternalArtifactAction} className="mt-4 space-y-3">
        <input type="hidden" name="taskId" value={taskId} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label className="text-xs font-medium text-neutral-700">
            {ja.artifacts.externalUrl}
          </label>
          <input
            name="externalUrl"
            type="url"
            placeholder="https://www.figma.com/... または https://github.com/..."
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">
            {ja.artifacts.externalFile}
          </label>
          <input
            name="file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.zip,.md,.txt"
            className="mt-1 w-full text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">
            {ja.artifacts.externalNote}
          </label>
          <textarea
            name="note"
            placeholder={ja.artifacts.externalNotePlaceholder}
            className="mt-1 min-h-16 w-full rounded-md border border-input px-3 py-2 text-sm"
          />
        </div>

        <p className="text-xs text-neutral-500">{ja.artifacts.registerHint}</p>

        <SubmitButton
          label={ja.artifacts.registerSubmit}
          className="rounded-md bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
        />
      </form>
    </section>
  );
}
