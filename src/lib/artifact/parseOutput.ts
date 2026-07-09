export interface ParsedArtifactOutput {
  type: string;
  name: string;
  content: string;
}

const ARTIFACT_DELIMITER = /^---ARTIFACT:(\w+)---$/;

export function parseMultiArtifactOutput(
  raw: string,
  defaults: ParsedArtifactOutput[],
): ParsedArtifactOutput[] {
  const lines = raw.split("\n");
  const sections: Array<{ type: string; lines: string[] }> = [];
  let current: { type: string; lines: string[] } | null = null;

  for (const line of lines) {
    const match = line.trim().match(ARTIFACT_DELIMITER);
    if (match) {
      if (current) sections.push(current);
      current = { type: match[1], lines: [] };
      continue;
    }
    if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  if (sections.length === 0) {
    return defaults;
  }

  return sections.map((section, index) => {
    const fallback = defaults[index] ?? defaults[0];
    return {
      type: section.type,
      name: fallback?.name ?? section.type,
      content: section.lines.join("\n").trim(),
    };
  });
}

export function splitSalesOutput(raw: string): ParsedArtifactOutput[] {
  const parsed = parseMultiArtifactOutput(raw, [
    { type: "proposal", name: "提案書", content: raw },
    { type: "estimate", name: "見積もり", content: "" },
  ]);

  if (parsed.length >= 2) return parsed;

  const estimateMatch = raw.match(
    /(?:##\s*見積|##\s*Estimate|##\s*お見積)([\s\S]*)/i,
  );
  if (estimateMatch) {
    const proposalContent = raw.slice(0, estimateMatch.index).trim();
    return [
      { type: "proposal", name: "提案書", content: proposalContent || raw },
      {
        type: "estimate",
        name: "見積もり",
        content: estimateMatch[0].trim(),
      },
    ];
  }

  return [
    { type: "proposal", name: "提案書", content: raw },
    { type: "estimate", name: "見積もり", content: "見積もりは提案書内に含まれています。" },
  ];
}

export function splitContractOutput(raw: string): ParsedArtifactOutput[] {
  const parsed = parseMultiArtifactOutput(raw, [
    { type: "contract_checklist", name: "契約チェックリスト", content: "" },
    { type: "contract_draft", name: "契約書ドラフト", content: raw },
  ]);

  if (parsed.length >= 2) return parsed;

  const draftMatch = raw.match(
    /(?:##\s*契約書|##\s*Contract Draft|##\s*ドラフト)([\s\S]*)/i,
  );
  if (draftMatch) {
    return [
      {
        type: "contract_checklist",
        name: "契約チェックリスト",
        content: raw.slice(0, draftMatch.index).trim(),
      },
      {
        type: "contract_draft",
        name: "契約書ドラフト",
        content: draftMatch[0].trim(),
      },
    ];
  }

  return [
    {
      type: "contract_checklist",
      name: "契約チェックリスト",
      content: raw,
    },
    {
      type: "contract_draft",
      name: "契約書ドラフト",
      content: "契約書ドラフトはチェックリスト確認後に生成されます。",
    },
  ];
}
