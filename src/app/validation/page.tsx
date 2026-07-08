import { ValidationRunner } from "@/features/validation/components/ValidationRunner";

export default function ValidationPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Validation</h1>
        <p className="text-muted-foreground">
          AI 駆動の自動検証 — QA Agent がシステム状態をチェックしレポートを生成
        </p>
      </div>

      <ValidationRunner />

      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">CLI からも実行可能</p>
        <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
          {`npm run validate              # 読み取り専用\nnpm run validate -- --execute # Workflow 実行テスト含む`}
        </pre>
      </div>
    </div>
  );
}
