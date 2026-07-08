import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { agentService } from "@/services/dashboardService";

export default async function AgentsPage() {
  const agents = await agentService.listAgents();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <p className="text-muted-foreground">
          Phase 5 — AI Agents（Full Team · v1.0.0）
        </p>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{agent.name}</CardTitle>
                <CardDescription>{agent.role}</CardDescription>
              </div>
              <StatusBadge value={agent.status} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{agent.description}</p>
              <p className="text-muted-foreground">
                v{agent.version} · Approval Level {agent.approval_level}
              </p>
              {agent.role === "secretary" && (
                <p className="text-xs text-muted-foreground">
                  Orchestrator — Workflow 制御権限を持つ唯一の Agent
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Agent 間の直接通信は禁止。Workflow Engine が Agent を順番に実行します。
          <Link href="/workflows" className="ml-1 text-primary underline">
            Workflows へ
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
