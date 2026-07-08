import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { artifactService } from "@/services/artifactService";

export default async function ArtifactsPage() {
  const artifacts = await artifactService.list();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Artifacts</h1>
        <p className="text-muted-foreground">
          AI が生成した成果物（Agent 間の受け渡し媒体）
        </p>
      </div>

      {artifacts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            成果物がありません。Workflow で「Execute Next Task」を実行すると Agent
            が Artifact を生成します。
          </CardContent>
        </Card>
      ) : (
        artifacts.map((artifact) => (
          <Card key={artifact.id}>
            <CardHeader>
              <CardTitle className="text-base">{artifact.name}</CardTitle>
              <CardDescription>
                {artifact.type} · v{artifact.version} ·{" "}
                {artifact.task.stage.workflow.project.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-64 overflow-auto rounded-md bg-muted p-4 text-xs whitespace-pre-wrap">
                {artifact.content.slice(0, 2000)}
                {artifact.content.length > 2000 ? "\n...(truncated)" : ""}
              </pre>
              <Link
                href={`/projects/${artifact.task.stage.workflow.project.id}`}
                className="mt-2 inline-block text-sm text-primary underline"
              >
                Project へ
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
