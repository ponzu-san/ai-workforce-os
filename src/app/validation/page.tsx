import { ValidationRunner } from "@/features/validation/components/ValidationRunner";
import { ja } from "@/lib/labels/ja";

export default function ValidationPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.validation.title}</h1>
        <p className="text-muted-foreground">{ja.validation.subtitle}</p>
      </div>

      <ValidationRunner />

      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{ja.validation.cliHint}</p>
        <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
          {`npm run validate              # ${ja.validation.cliReadOnly}\nnpm run validate -- --execute # ${ja.validation.cliExecute}`}
        </pre>
      </div>
    </div>
  );
}
