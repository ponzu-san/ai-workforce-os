import Link from "next/link";

import { SubmitButton } from "@/components/ui/submit-button";
import { selectProjectAction } from "@/features/project/actions";
import { ja } from "@/lib/labels/ja";

interface OpenProjectButtonProps {
  projectId: string;
  compact?: boolean;
}

export function OpenProjectButton({
  projectId,
  compact = false,
}: OpenProjectButtonProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={selectProjectAction}>
        <input type="hidden" name="projectId" value={projectId} />
        <SubmitButton
          label={ja.project.openProject}
          className={
            compact
              ? "border-2 border-black bg-yellow-300 font-black text-neutral-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-200"
              : "border-2 border-black bg-yellow-300 px-8 py-3 text-base font-black text-neutral-900 shadow-[4px_4px_0_0_#000] hover:bg-yellow-200"
          }
        />
      </form>
      <Link
        href={`/projects/${projectId}`}
        className="text-sm font-medium text-neutral-600 underline underline-offset-4"
      >
        {ja.project.viewDetails}
      </Link>
    </div>
  );
}
