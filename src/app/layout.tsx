import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { notificationRepository } from "@/database/repositories/artifactRepository";
import { workspaceRepository } from "@/database/repositories/workspaceRepository";

import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Workforce OS",
  description: "Personal AI Business Operating System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let workspaceName = "My Workspace";
  let unreadNotifications = 0;

  try {
    const workspace = await workspaceRepository.findDefault();
    workspaceName = workspace?.name ?? workspaceName;
    unreadNotifications = await notificationRepository.findUnreadCount();
  } catch {
    workspaceName = "My Workspace (DB未接続)";
  }

  return (
    <html lang="ja">
      <body>
        <AppShell
          workspaceName={workspaceName}
          unreadNotifications={unreadNotifications}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
