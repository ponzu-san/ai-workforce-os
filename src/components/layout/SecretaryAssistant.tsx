"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { MessageCircle, X } from "lucide-react";

import { SecretaryPanel } from "@/components/layout/SecretaryPanel";
import { Button } from "@/components/ui/button";
import { ja } from "@/lib/labels/ja";

interface SecretaryAssistantContextValue {
  open: () => void;
  close: () => void;
}

const SecretaryAssistantContext =
  createContext<SecretaryAssistantContextValue | null>(null);

function useSecretaryAssistant() {
  const context = useContext(SecretaryAssistantContext);
  if (!context) {
    throw new Error("SecretaryAssistant components must be used within SecretaryAssistant");
  }
  return context;
}

export function SecretaryConsultButton() {
  const { open } = useSecretaryAssistant();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={open}
      className="hidden sm:inline-flex"
    >
      {ja.secretary.consultButton}
    </Button>
  );
}

interface SecretaryAssistantProps {
  projectId?: string | null;
  children: React.ReactNode;
}

export function SecretaryAssistant({
  projectId = null,
  children,
}: SecretaryAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  const contextValue = useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <SecretaryAssistantContext.Provider value={contextValue}>
      {children}

      {!isOpen ? (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-800"
          aria-label={ja.secretary.fabLabel}
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      ) : null}

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            aria-label={ja.secretary.closeDrawer}
            onClick={() => setIsOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h2 id={titleId} className="text-base font-semibold text-neutral-900">
                {ja.secretary.title}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label={ja.secretary.closeDrawer}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SecretaryPanel projectId={projectId} embedded />
            </div>
          </aside>
        </>
      ) : null}
    </SecretaryAssistantContext.Provider>
  );
}
