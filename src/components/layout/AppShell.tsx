import { Header } from "@/components/layout/Header";
import { SecretaryAssistant } from "@/components/layout/SecretaryAssistant";
import { Sidebar } from "@/components/layout/Sidebar";
import { ja } from "@/lib/labels/ja";
import type {
  ActiveProjectSummary,
  ProjectOption,
} from "@/services/projectPipelineService";
import type { PipelineStep } from "@/types/domain";

interface AppShellProps {
  workspaceName: string;
  unreadNotifications?: number;
  activeProject?: ActiveProjectSummary | null;
  projectOptions?: ProjectOption[];
  activeProjectSteps?: PipelineStep[];
  children: React.ReactNode;
  secretaryProjectId?: string | null;
}

export function AppShell({
  workspaceName,
  unreadNotifications = 0,
  activeProject = null,
  projectOptions = [],
  activeProjectSteps = [],
  children,
  secretaryProjectId = null,
}: AppShellProps) {
  const secretaryProject =
    secretaryProjectId ?? activeProject?.id ?? null;

  return (
    <SecretaryAssistant projectId={secretaryProject}>
      <div className="flex h-screen flex-col bg-[#FAFAFA] text-[#171717]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900 focus:shadow-md"
        >
          {ja.a11y.skipToMain}
        </a>
        <Header
          workspaceName={workspaceName}
          unreadNotifications={unreadNotifications}
          activeProject={activeProject}
          projectOptions={projectOptions}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeProjectId={activeProject?.id ?? null}
            activeProjectName={activeProject?.name ?? null}
            activeProjectSteps={activeProjectSteps}
            activeProjectCurrentStageOrder={
              activeProject?.currentStageOrder ?? null
            }
          />
          <main
            id="main-content"
            className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </SecretaryAssistant>
  );
}
