export type ChecklistProvider = "client" | "us" | "undecided";

export interface ContractChecklistItem {
  id: string;
  label: string;
  kind: "fixed" | "custom";
  provider?: ChecklistProvider;
  checked: boolean;
  notes?: string;
}

export interface ContractChecklistData {
  items: ContractChecklistItem[];
  confirmedAt?: string | null;
}

export const FIXED_CONTRACT_CHECKLIST_ITEMS: Omit<
  ContractChecklistItem,
  "checked"
>[] = [
  {
    id: "photos",
    label: "写真・画像素材の用意",
    kind: "fixed",
    provider: "undecided",
  },
  {
    id: "domain",
    label: "ドメインの取得・管理",
    kind: "fixed",
    provider: "undecided",
  },
  {
    id: "copy",
    label: "原稿・テキストコンテンツ",
    kind: "fixed",
    provider: "undecided",
  },
  {
    id: "logo",
    label: "ロゴ・ブランド素材",
    kind: "fixed",
    provider: "undecided",
  },
  {
    id: "hosting",
    label: "サーバー・ホスティング",
    kind: "fixed",
    provider: "undecided",
  },
];

export function createDefaultChecklistData(): ContractChecklistData {
  return {
    items: FIXED_CONTRACT_CHECKLIST_ITEMS.map((item) => ({
      ...item,
      checked: false,
    })),
    confirmedAt: null,
  };
}

export function parseContractChecklist(content: string): ContractChecklistData {
  try {
    const parsed = JSON.parse(content) as ContractChecklistData;
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return createDefaultChecklistData();
    }
    return parsed;
  } catch {
    return createDefaultChecklistData();
  }
}

export function formatChecklistForPrompt(data: ContractChecklistData): string {
  const lines = data.items
    .filter((item) => item.checked || item.provider !== "undecided")
    .map((item) => {
      const providerLabel =
        item.provider === "client"
          ? "クライアント"
          : item.provider === "us"
            ? "当方"
            : "未決定";
      return `- ${item.label}: ${providerLabel}${item.notes ? ` (${item.notes})` : ""}`;
    });

  if (lines.length === 0) return "";
  return `契約チェックリスト（確定事項）:\n${lines.join("\n")}`;
}
