import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "@/lib/labels/ja";

export default function SettingsPage() {
  const hasLlmKey =
    Boolean(process.env.OPENAI_API_KEY) ||
    Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.settings.title}</h1>
        <p className="text-muted-foreground">{ja.settings.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.settings.application}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">{ja.settings.version}:</span>{" "}
            v1.0.0
          </p>
          <p>
            <span className="text-muted-foreground">{ja.settings.phase}:</span>{" "}
            {ja.settings.phaseValue}
          </p>
          <p>
            <span className="text-muted-foreground">{ja.settings.llmMode}:</span>{" "}
            {hasLlmKey ? ja.settings.apiConnected : ja.settings.offlineFallback}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.settings.quickLinks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Link href="/analytics" className="block text-primary underline">
            {ja.nav.analytics}（{ja.analytics.aiCost} / {ja.analytics.taskCompletion}）
          </Link>
          <Link href="/validation" className="block text-primary underline">
            {ja.nav.validation}（{ja.validation.run}）
          </Link>
          <Link href="/agents" className="block text-primary underline">
            {ja.nav.agents}
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.settings.memoryLayers}</CardTitle>
          <CardDescription>{ja.settings.phaseValue}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {ja.settings.memoryDesc}
        </CardContent>
      </Card>
    </div>
  );
}
