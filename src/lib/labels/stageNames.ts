/** DBに保存された英語Stage名 → 日本語表示 */
const STAGE_NAME_MAP: Record<string, string> = {
  Sales: "営業",
  Contract: "契約",
  Requirement: "要件定義",
  Design: "デザイン",
  Frontend: "フロントエンド",
  Backend: "バックエンド",
  "External Dev": "外部開発",
  Infra: "インフラ",
  QA: "品質保証",
  Legal: "法務",
  Release: "納品",
  Delivery: "納品",
  Development: "開発",
  要件定義: "要件定義",
  デザイン: "デザイン",
  フロントエンド: "フロントエンド",
  バックエンド: "バックエンド",
  品質保証: "品質保証",
  営業: "営業",
  契約: "契約",
  納品: "納品",
  外部開発: "外部開発",
  インフラ: "インフラ",
  法務: "法務",
};

export function displayStageName(name: string): string {
  return STAGE_NAME_MAP[name] ?? name;
}
