import { z } from "zod";

import { stageRepository } from "@/database/repositories/stageRepository";
import {
  PRODUCTION_STAGE_NAMES,
  type ProductionStageName,
} from "@/ai/workflow/productionWorkflowTemplate";
import {
  isStageExecutionMode,
  STAGE_ALLOWED_MODES,
} from "@/lib/workflow/stageModeConfig";
import type { StageExecutionMode } from "@/types/domain";

const updateStageModeSchema = z.object({
  stageId: z.string().uuid(),
  executionMode: z.enum([
    "internal_ai",
    "external_handoff",
    "human_handoff",
    "skip",
  ]),
});

export const stageService = {
  async updateExecutionMode(
    stageId: string,
    executionMode: StageExecutionMode,
  ) {
    const data = updateStageModeSchema.parse({ stageId, executionMode });
    const stage = await stageRepository.findById(data.stageId);
    if (!stage) throw new Error("工程が見つかりません");

    const stageName = stage.name as ProductionStageName;
    const allowed = STAGE_ALLOWED_MODES[stageName];
    if (!allowed?.includes(data.executionMode)) {
      throw new Error("この工程では選択できないモードです");
    }

    if (stageName === PRODUCTION_STAGE_NAMES.LEGAL) {
      throw new Error("法務工程のモードは変更できません");
    }

    const allTodo = stage.tasks.every((task) => task.status === "todo");
    if (!allTodo) {
      throw new Error(
        "開始済みの工程はモードを変更できません（全タスクが未着手の場合のみ変更可能）",
      );
    }

    return stageRepository.updateExecutionMode(stageId, data.executionMode);
  },

  async updateProjectStageModes(
    projectId: string,
    modes: Partial<Record<ProductionStageName, StageExecutionMode>>,
  ) {
    const stages = await stageRepository.findByProjectId(projectId);

    for (const stage of stages) {
      const stageName = stage.name as ProductionStageName;
      const nextMode = modes[stageName];
      if (!nextMode || nextMode === stage.execution_mode) continue;

      if (!isStageExecutionMode(nextMode)) continue;

      await this.updateExecutionMode(stage.id, nextMode);
    }
  },

  async listByProject(projectId: string) {
    return stageRepository.findByProjectId(projectId);
  },
};
