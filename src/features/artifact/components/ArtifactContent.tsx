interface ArtifactContentProps {
  content: string;
  contentKind?: string;
  externalUrl?: string | null;
  filePath?: string | null;
  mimeType?: string | null;
}

function renderMarkdownLite(text: string) {
  const lines = text.split("\n");
  return lines.map((line, index) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={index} className="mt-4 text-base font-semibold">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={index} className="mt-4 text-lg font-bold">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1 key={index} className="mt-4 text-xl font-bold">
          {line.slice(2)}
        </h1>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={index} className="ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim() === "") {
      return <br key={index} />;
    }
    return (
      <p key={index} className="leading-relaxed">
        {line}
      </p>
    );
  });
}

export function ArtifactContent({
  content,
  contentKind = "markdown",
  externalUrl,
  filePath,
}: ArtifactContentProps) {
  if (contentKind === "url" && externalUrl) {
    return (
      <div className="rounded-md border bg-muted p-4 text-sm">
        <p className="font-medium text-foreground">{content || "外部リンク"}</p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block break-all text-blue-600 underline hover:text-blue-800"
        >
          {externalUrl}
        </a>
      </div>
    );
  }

  if (contentKind === "file" && filePath) {
    return (
      <div className="rounded-md border bg-muted p-4 text-sm">
        <p className="font-medium text-foreground">{content || "アップロードファイル"}</p>
        <a
          href={filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-blue-600 underline hover:text-blue-800"
        >
          {filePath.split("/").pop()}
        </a>
      </div>
    );
  }

  return (
    <div className="max-h-[96rem] overflow-auto rounded-md border bg-muted p-4 text-sm text-foreground">
      {renderMarkdownLite(content)}
    </div>
  );
}
