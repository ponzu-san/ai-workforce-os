export default function ArtifactPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 print:bg-white">
      {children}
    </div>
  );
}
