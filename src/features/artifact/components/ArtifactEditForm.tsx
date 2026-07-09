"use client";

import { useState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { editArtifactFormAction } from "@/features/artifact/actions";
import { ja } from "@/lib/labels/ja";

interface ArtifactEditFormProps {
  artifactId: string;
  initialContent: string;
  returnTo: string;
}

export function ArtifactEditForm({
  artifactId,
  initialContent,
  returnTo,
}: ArtifactEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-amber-800 underline underline-offset-4"
      >
        {ja.artifacts.editContent}
      </button>
    );
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.artifacts.editTitle}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{ja.artifacts.editDesc}</p>
      <form action={editArtifactFormAction} className="mt-4 space-y-3">
        <input type="hidden" name="artifactId" value={artifactId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-48 w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm"
        />
        <div className="flex gap-2">
          <SubmitButton
            label={ja.artifacts.saveEdit}
            className="bg-amber-500 text-white hover:bg-amber-600"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm"
          >
            {ja.common.cancel}
          </button>
        </div>
      </form>
    </section>
  );
}
