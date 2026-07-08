import { ja } from "@/lib/labels/ja";

export function DashboardEmptyGuide() {
  return (
    <section className="rounded-3xl border-2 border-dashed border-black bg-white p-8 text-center text-neutral-900 shadow-[6px_6px_0_0_#000]">
      <h2 className="text-2xl font-black">{ja.dashboard.emptyTitle}</h2>
      <ol className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm font-bold">
        <li className="rounded-xl border-2 border-black bg-yellow-200 px-4 py-3 text-neutral-900 shadow-[3px_3px_0_0_#000]">
          {ja.dashboard.emptyStep1}
        </li>
        <li className="rounded-xl border-2 border-black bg-green-200 px-4 py-3 text-neutral-900 shadow-[3px_3px_0_0_#000]">
          {ja.dashboard.emptyStep2}
        </li>
        <li className="rounded-xl border-2 border-black bg-blue-200 px-4 py-3 text-neutral-900 shadow-[3px_3px_0_0_#000]">
          {ja.dashboard.emptyStep3}
        </li>
      </ol>
    </section>
  );
}
