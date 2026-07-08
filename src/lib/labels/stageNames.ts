/** DBに保存された英語Stage名 → 日本語表示 */
const STAGE_NAME_MAP: Record<string, string> = {
  Requirement: "要件定義",
  Design: "デザイン",
  Frontend: "フロントエンド",
  Backend: "バックエンド",
  QA: "品質保証",
  Sales: "営業",
  Contract: "契約",
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
};

export function displayStageName(name: string): string {
  return STAGE_NAME_MAP[name] ?? name;
}
