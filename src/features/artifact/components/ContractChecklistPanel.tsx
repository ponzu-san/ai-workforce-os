"use client";

import { useState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { saveContractChecklistFormAction } from "@/features/artifact/actions";
import {
  parseContractChecklist,
  type ChecklistProvider,
  type ContractChecklistData,
} from "@/lib/contract/checklist";
import { ja } from "@/lib/labels/ja";

interface ContractChecklistPanelProps {
  artifactId: string;
  initialContent: string;
  returnTo: string;
  readOnly?: boolean;
}

export function ContractChecklistPanel({
  artifactId,
  initialContent,
  returnTo,
  readOnly = false,
}: ContractChecklistPanelProps) {
  const [data, setData] = useState<ContractChecklistData>(() =>
    parseContractChecklist(initialContent),
  );

  function updateItem(
    itemId: string,
    patch: Partial<{
      checked: boolean;
      provider: ChecklistProvider;
      notes: string;
    }>,
  ) {
    setData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    }));
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="text-base font-semibold text-neutral-900">
        {ja.contract.checklistTitle}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{ja.contract.checklistDesc}</p>

      <div className="mt-4 space-y-3">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-neutral-100 bg-neutral-50 p-4"
          >
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                disabled={readOnly}
                onChange={(event) =>
                  updateItem(item.id, { checked: event.target.checked })
                }
                className="mt-1"
              />
              <span className="text-sm font-medium text-neutral-900">
                {item.label}
                {item.kind === "custom" ? (
                  <span className="ml-2 text-xs text-neutral-500">
                    {ja.contract.customItem}
                  </span>
                ) : null}
              </span>
            </label>
            <div className="mt-3 flex flex-wrap gap-2 pl-7">
              {(["client", "us", "undecided"] as ChecklistProvider[]).map(
                (provider) => (
                  <label
                    key={provider}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs"
                  >
                    <input
                      type="radio"
                      name={`provider-${item.id}`}
                      checked={item.provider === provider}
                      disabled={readOnly}
                      onChange={() => updateItem(item.id, { provider })}
                    />
                    {provider === "client"
                      ? ja.contract.providerClient
                      : provider === "us"
                        ? ja.contract.providerUs
                        : ja.contract.providerUndecided}
                  </label>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      {!readOnly ? (
        <form action={saveContractChecklistFormAction} className="mt-4">
          <input type="hidden" name="artifactId" value={artifactId} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <input
            type="hidden"
            name="content"
            value={JSON.stringify(
              { ...data, confirmedAt: new Date().toISOString() },
              null,
              2,
            )}
          />
          <SubmitButton
            label={ja.contract.saveChecklist}
            className="bg-amber-500 text-white hover:bg-amber-600"
          />
        </form>
      ) : null}
    </section>
  );
}
