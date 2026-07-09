import {
  PRODUCTION_STAGE_NAMES,
  type ProductionStageName,
} from "@/ai/workflow/productionWorkflowTemplate";

/** Max characters per markdown artifact body (existing runner behavior). */
export const MAX_CHARS_PER_ARTIFACT = 1_500;

/**
 * Soft cap on total prior-artifact context after filtering.
 * Drop oldest markdown bodies first when exceeded (URL/file kept).
 * Future: per-stage maxChars, summary field instead of full body.
 */
export const MAX_TOTAL_PRIOR_CHARS = 6_000;

/**
 * Which prior stages the current stage may read.
 * Future: tune per real usage (e.g. Legal may need Design).
 */
export const STAGE_ARTIFACT_ALLOWLIST: Record<
  ProductionStageName,
  readonly ProductionStageName[]
> = {
  [PRODUCTION_STAGE_NAMES.SALES]: [],
  [PRODUCTION_STAGE_NAMES.CONTRACT]: [PRODUCTION_STAGE_NAMES.SALES],
  [PRODUCTION_STAGE_NAMES.REQUIREMENT]: [
    PRODUCTION_STAGE_NAMES.SALES,
    PRODUCTION_STAGE_NAMES.CONTRACT,
  ],
  [PRODUCTION_STAGE_NAMES.DESIGN]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.CONTRACT,
  ],
  [PRODUCTION_STAGE_NAMES.FRONTEND]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.DESIGN,
  ],
  [PRODUCTION_STAGE_NAMES.BACKEND]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.FRONTEND,
  ],
  [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.DESIGN,
  ],
  [PRODUCTION_STAGE_NAMES.INFRA]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.BACKEND,
  ],
  [PRODUCTION_STAGE_NAMES.QA]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.DESIGN,
    PRODUCTION_STAGE_NAMES.FRONTEND,
    PRODUCTION_STAGE_NAMES.BACKEND,
    PRODUCTION_STAGE_NAMES.EXTERNAL_DEV,
  ],
  [PRODUCTION_STAGE_NAMES.LEGAL]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.CONTRACT,
  ],
  [PRODUCTION_STAGE_NAMES.RELEASE]: [
    PRODUCTION_STAGE_NAMES.REQUIREMENT,
    PRODUCTION_STAGE_NAMES.DESIGN,
    PRODUCTION_STAGE_NAMES.QA,
    PRODUCTION_STAGE_NAMES.LEGAL,
  ],
};

export interface PriorArtifactLike {
  id: string;
  task_id: string;
  content: string;
  content_kind: string;
  external_url?: string | null;
  file_path?: string | null;
  created_at: Date;
  name: string;
  task: {
    stage: {
      name: string;
      order: number;
    };
    assigned_agent?: { name: string } | null;
  };
}

export interface FilterPriorArtifactsOptions {
  currentTaskId: string;
  currentStageName: string;
  currentStageOrder: number;
}

function isProductionStageName(name: string): name is ProductionStageName {
  return Object.values(PRODUCTION_STAGE_NAMES).includes(
    name as ProductionStageName,
  );
}

function isExternalKind(kind: string): boolean {
  return kind === "url" || kind === "file";
}

/**
 * Balance rule (confirmed):
 * - markdown: latest 1 per stage
 * - url / file: keep all in allowed stages (external registrations must not drop)
 */
function dedupeByStageBalance(
  artifacts: PriorArtifactLike[],
): PriorArtifactLike[] {
  const byStage = new Map<string, PriorArtifactLike[]>();
  for (const artifact of artifacts) {
    const key = artifact.task.stage.name;
    const list = byStage.get(key) ?? [];
    list.push(artifact);
    byStage.set(key, list);
  }

  const result: PriorArtifactLike[] = [];
  for (const list of byStage.values()) {
    const sorted = [...list].sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime(),
    );
    const externals = sorted.filter((a) => isExternalKind(a.content_kind));
    const markdowns = sorted.filter((a) => !isExternalKind(a.content_kind));
    const latestMarkdown =
      markdowns.length > 0 ? [markdowns[markdowns.length - 1]] : [];
    result.push(...externals, ...latestMarkdown);
  }

  return result.sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );
}

function estimateArtifactChars(artifact: PriorArtifactLike): number {
  if (artifact.content_kind === "url" && artifact.external_url) {
    return (
      artifact.external_url.length +
      Math.min(artifact.content.length, MAX_CHARS_PER_ARTIFACT)
    );
  }
  if (artifact.content_kind === "file" && artifact.file_path) {
    return (
      artifact.file_path.length +
      Math.min(artifact.content.length, MAX_CHARS_PER_ARTIFACT)
    );
  }
  return Math.min(artifact.content.length, MAX_CHARS_PER_ARTIFACT);
}

/**
 * Drop oldest markdown bodies first when over budget; keep url/file.
 */
function applyTotalCharBudget(
  artifacts: PriorArtifactLike[],
): PriorArtifactLike[] {
  let total = artifacts.reduce((sum, a) => sum + estimateArtifactChars(a), 0);
  if (total <= MAX_TOTAL_PRIOR_CHARS) return artifacts;

  const kept = [...artifacts];
  const droppable = kept
    .map((a, index) => ({ a, index }))
    .filter(({ a }) => !isExternalKind(a.content_kind))
    .sort((x, y) => x.a.created_at.getTime() - y.a.created_at.getTime());

  const dropIndexes = new Set<number>();
  for (const { a, index } of droppable) {
    if (total <= MAX_TOTAL_PRIOR_CHARS) break;
    dropIndexes.add(index);
    total -= estimateArtifactChars(a);
  }

  return kept.filter((_, index) => !dropIndexes.has(index));
}

export function filterPriorArtifacts(
  artifacts: PriorArtifactLike[],
  options: FilterPriorArtifactsOptions,
): PriorArtifactLike[] {
  const { currentTaskId, currentStageName, currentStageOrder } = options;

  const withoutCurrent = artifacts.filter((a) => a.task_id !== currentTaskId);

  let stageFiltered: PriorArtifactLike[];
  if (isProductionStageName(currentStageName)) {
    const allow = new Set(STAGE_ARTIFACT_ALLOWLIST[currentStageName]);
    stageFiltered = withoutCurrent.filter((a) =>
      allow.has(a.task.stage.name as ProductionStageName),
    );
  } else {
    stageFiltered = withoutCurrent.filter(
      (a) => a.task.stage.order < currentStageOrder,
    );
  }

  const balanced = dedupeByStageBalance(stageFiltered);
  return applyTotalCharBudget(balanced);
}

export function formatPriorArtifacts(artifacts: PriorArtifactLike[]): string {
  if (artifacts.length === 0) return "";

  return artifacts
    .map((a) => {
      const header = `### ${a.name} (${a.task.stage.name} / ${a.task.assigned_agent?.name ?? "Agent"})`;
      if (a.content_kind === "url" && a.external_url) {
        return `${header}\nURL: ${a.external_url}${a.content ? `\n${a.content}` : ""}`;
      }
      if (a.content_kind === "file" && a.file_path) {
        return `${header}\nFile: ${a.file_path}${a.content ? `\n${a.content}` : ""}`;
      }
      const body = a.content.slice(0, MAX_CHARS_PER_ARTIFACT);
      const truncated =
        a.content.length > MAX_CHARS_PER_ARTIFACT ? "\n...(truncated)" : "";
      return `${header}\n${body}${truncated}`;
    })
    .join("\n\n");
}
