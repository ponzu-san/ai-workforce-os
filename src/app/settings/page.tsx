import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const hasLlmKey =
    Boolean(process.env.OPENAI_API_KEY) ||
    Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">AI Workforce OS システム情報</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Version:</span> v1.0.0
          </p>
          <p>
            <span className="text-muted-foreground">Phase:</span> AI Workforce
            OS Complete
          </p>
          <p>
            <span className="text-muted-foreground">LLM Mode:</span>{" "}
            {hasLlmKey ? "API Connected" : "Offline Fallback"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Link href="/analytics" className="block text-primary underline">
            Analytics（Cost / Productivity）
          </Link>
          <Link href="/validation" className="block text-primary underline">
            Validation（自動検証）
          </Link>
          <Link href="/agents" className="block text-primary underline">
            AI Agents
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Memory Layers</CardTitle>
          <CardDescription>Phase 5 — 3層 Memory</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Short Term · Project · User（Global / Skill は将来拡張）
        </CardContent>
      </Card>
    </div>
  );
}
