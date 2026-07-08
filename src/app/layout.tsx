import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { notificationRepository } from "@/database/repositories/artifactRepository";
import { projectPipelineService } from "@/services/projectPipelineService";
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
  let activeProject = null;
  let projectOptions: Awaited<
    ReturnType<typeof projectPipelineService.getShellProjectContext>
  >["projectOptions"] = [];
  let activeProjectSteps: Awaited<
    ReturnType<typeof projectPipelineService.getShellProjectContext>
  >["activeProjectSteps"] = [];

  try {
    const workspace = await workspaceRepository.findDefault();
    workspaceName = workspace?.name ?? workspaceName;
    unreadNotifications = await notificationRepository.findUnreadCount();
    const shellContext = await projectPipelineService.getShellProjectContext();
    activeProject = shellContext.activeProject;
    projectOptions = shellContext.projectOptions;
    activeProjectSteps = shellContext.activeProjectSteps;
  } catch {
    workspaceName = "My Workspace (DB未接続)";
  }

  return (
    <html lang="ja" style={{ colorScheme: "light" }}>
      <body className="bg-[#FAFAFA] text-[#171717]">
        <AppShell
          workspaceName={workspaceName}
          unreadNotifications={unreadNotifications}
          activeProject={activeProject}
          projectOptions={projectOptions}
          activeProjectSteps={activeProjectSteps}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
