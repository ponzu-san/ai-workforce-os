import { SubmitButton } from "@/components/ui/submit-button";
import { saveStageInstructionAction } from "@/features/dashboard/actions";
import { ja } from "@/lib/labels/ja";
import type { ProjectNextAction } from "@/types/domain";

interface StageInstructionFormProps {
  projectId: string;
  stageId: string;
  returnTo: string;
  nextAction: ProjectNextAction | null;
}

export function StageInstructionForm({
  projectId,
  stageId,
  returnTo,
  nextAction,
}: StageInstructionFormProps) {
  if (
    !nextAction ||
    (nextAction.type !== "start_and_execute" &&
      nextAction.type !== "execute_next")
  ) {
    return null;
  }

  return (
    <form action={saveStageInstructionAction} className="space-y-2">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="stageId" value={stageId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <label className="block text-sm font-bold text-neutral-900">
        {ja.project.stageInstruction}
      </label>
      <p className="text-xs text-neutral-600">{ja.project.stageInstructionHint}</p>
      <textarea
        name="instruction"
        placeholder={ja.project.stageInstructionPlaceholder}
        className="min-h-20 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-neutral-900"
      />
      <SubmitButton
        label={ja.project.saveStageInstruction}
        variant="outline"
        className="border-2 border-black font-bold text-neutral-900"
      />
    </form>
  );
}
