import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "@/lib/labels/ja";
import { agentService } from "@/services/dashboardService";
import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function AgentsPage() {
  const [agents, stagePath] = await Promise.all([
    agentService.listAgents(),
    navigationRedirectService.resolveActiveProjectStagePath(),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.agents.title}</h1>
        <p className="text-muted-foreground">{ja.agents.subtitle}</p>
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
                v{agent.version} · {ja.agents.approvalLevel} {agent.approval_level}
              </p>
              {agent.role === "secretary" && (
                <p className="text-xs text-muted-foreground">
                  {ja.agents.orchestratorNote}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          {ja.agents.noDirectComm}
          <Link href={stagePath} className="ml-1 text-primary underline">
            {ja.agents.goWorkflows}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
