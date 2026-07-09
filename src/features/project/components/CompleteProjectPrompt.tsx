import { completeProjectAction } from "@/features/project/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { ja } from "@/lib/labels/ja";

interface CompleteProjectPromptProps {
  projectId: string;
  projectName: string;
  returnTo?: string;
  variant?: "default" | "prominent";
}

function CompleteProjectForm({
  projectId,
  returnTo,
  buttonClassName,
}: {
  projectId: string;
  returnTo?: string;
  buttonClassName?: string;
}) {
  return (
    <form action={completeProjectAction}>
      <input type="hidden" name="projectId" value={projectId} />
      {returnTo ? (
        <input type="hidden" name="returnTo" value={returnTo} />
      ) : null}
      <SubmitButton
        label={ja.project.markComplete}
        className={buttonClassName}
      />
    </form>
  );
}

export function CompleteProjectPrompt({
  projectId,
  projectName,
  returnTo,
  variant = "default",
}: CompleteProjectPromptProps) {
  if (variant === "prominent") {
    return (
      <section className="rounded-2xl border-2 border-black bg-emerald-100 p-5 text-neutral-900 shadow-[3px_3px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-widest text-emerald-900">
          {ja.project.workflowDonePromptTitle}
        </p>
        <p className="mt-2 text-lg font-black text-neutral-900">
          {ja.project.workflowDonePrompt}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-700">
          <span className="font-bold">{projectName}</span>
          {ja.project.markCompleteDesc}
        </p>
        <div className="mt-4">
          <CompleteProjectForm
            projectId={projectId}
            returnTo={returnTo}
            buttonClassName="h-12 px-8 text-base font-black"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-5 text-neutral-900 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-800">
        {ja.project.workflowDonePromptTitle}
      </p>
      <p className="mt-2 text-sm font-medium text-neutral-800">
        {ja.project.workflowDonePrompt}
      </p>
      <p className="mt-1 text-sm text-neutral-600">
        <span className="font-semibold">{projectName}</span>
        {ja.project.markCompleteDesc}
      </p>
      <div className="mt-4">
        <CompleteProjectForm projectId={projectId} returnTo={returnTo} />
      </div>
    </section>
  );
}
