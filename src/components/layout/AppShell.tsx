import { Header } from "@/components/layout/Header";
import { SecretaryPanel } from "@/components/layout/SecretaryPanel";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  workspaceName: string;
  unreadNotifications?: number;
  children: React.ReactNode;
  showSecretaryPanel?: boolean;
  secretaryProjectId?: string | null;
}

export function AppShell({
  workspaceName,
  unreadNotifications = 0,
  children,
  showSecretaryPanel = true,
  secretaryProjectId = null,
}: AppShellProps) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        workspaceName={workspaceName}
        unreadNotifications={unreadNotifications}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        {showSecretaryPanel && (
          <aside className="hidden w-80 border-l border-border p-4 xl:block">
            <SecretaryPanel projectId={secretaryProjectId} />
          </aside>
        )}
      </div>
    </div>
  );
}
