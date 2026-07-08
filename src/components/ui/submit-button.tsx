"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";
import { ja } from "@/lib/labels/ja";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonProps {
  label: string;
  pendingLabel?: string;
}

function Spinner() {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden
    />
  );
}

export function SubmitButton({
  label,
  pendingLabel = ja.common.loading,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(className)}
      {...props}
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
