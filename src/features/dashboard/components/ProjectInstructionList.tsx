"use client";

import { useState } from "react";

import { ja } from "@/lib/labels/ja";

const PREVIEW_CHARS = 200;

export interface ProjectInstructionItem {
  id: string;
  content: string;
  createdAt: Date | string;
}

interface ProjectInstructionListProps {
  instructions: ProjectInstructionItem[];
}

function formatCreatedAt(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InstructionBody({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = content.length > PREVIEW_CHARS;
  const shown =
    !needsTruncate || expanded
      ? content
      : `${content.slice(0, PREVIEW_CHARS)}…`;

  return (
    <div className="space-y-2">
      <p className="whitespace-pre-wrap text-sm text-neutral-900">{shown}</p>
      {needsTruncate ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-xs font-semibold text-neutral-700 underline"
        >
          {expanded ? ja.project.showLess : ja.project.showMore}
        </button>
      ) : null}
    </div>
  );
}

export function ProjectInstructionList({
  instructions,
}: ProjectInstructionListProps) {
  return (
    <section className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">
        {ja.project.savedInstructions}
      </h2>
      {instructions.length === 0 ? (
        <p className="text-sm text-neutral-600">
          {ja.project.savedInstructionsEmpty}
        </p>
      ) : (
        <ul className="space-y-3">
          {instructions.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-neutral-200 bg-neutral-50 p-3"
            >
              <p className="mb-2 text-xs font-medium text-neutral-500">
                {formatCreatedAt(item.createdAt)}
              </p>
              <InstructionBody content={item.content} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
