import { SubmitButton } from "@/components/ui/submit-button";
import { saveProjectInstructionAction } from "@/features/dashboard/actions";
import { ja } from "@/lib/labels/ja";
import type { ProjectNextAction } from "@/types/domain";

interface ProjectInstructionFormProps {
  projectId: string;
  nextAction: ProjectNextAction;
}

export function ProjectInstructionForm({
  projectId,
  nextAction,
}: ProjectInstructionFormProps) {
  if (nextAction.type !== "start_and_execute") {
    return null;
  }

  return (
    <form action={saveProjectInstructionAction} className="space-y-2">
      <input type="hidden" name="projectId" value={projectId} />
      <label className="block text-sm font-bold text-neutral-900">
        {ja.project.instruction}
      </label>
      <p className="text-xs text-neutral-600">{ja.project.instructionHint}</p>
      <textarea
        name="instruction"
        placeholder={ja.project.instructionPlaceholder}
        className="min-h-20 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-neutral-900"
      />
      <SubmitButton
        label={ja.project.saveInstruction}
        variant="outline"
        className="border-2 border-black font-bold text-neutral-900"
      />
    </form>
  );
}
