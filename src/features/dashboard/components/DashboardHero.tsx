import Link from "next/link";

import { ja } from "@/lib/labels/ja";

interface DashboardHeroProps {
  projectCount: number;
  overallProgressPercent: number;
  pendingApprovalCount: number;
}

export function DashboardHero({
  projectCount,
  overallProgressPercent,
  pendingApprovalCount,
}: DashboardHeroProps) {
  return (
    <header className="overflow-hidden rounded-3xl border-2 border-black bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 text-neutral-900 shadow-[6px_6px_0_0_#000]">
      <div className="flex flex-wrap items-center justify-between gap-6 px-6 py-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            {ja.dashboard.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-neutral-800">
            {ja.dashboard.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-md border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-black text-neutral-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-200"
            >
              {ja.dashboard.ctaCreateProduction}
            </Link>
            <Link
              href="/clients"
              className="rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-black text-neutral-900 shadow-[3px_3px_0_0_#000] hover:bg-neutral-100"
            >
              {ja.nav.clients}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-neutral-900 shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-bold">{ja.dashboard.activeProjectCount}</p>
            <p className="text-2xl font-black">{projectCount}</p>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-neutral-900 shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-bold">{ja.dashboard.overallProgress}</p>
            <p className="text-2xl font-black">{overallProgressPercent}%</p>
          </div>
          <div className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-neutral-900 shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-bold">{ja.dashboard.approvals}</p>
            <p className="text-2xl font-black">{pendingApprovalCount}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
