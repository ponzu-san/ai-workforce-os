import Link from "next/link";

import { cn } from "@/lib/utils";

interface ContextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ContextLink({ href, children, className }: ContextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-950",
        className,
      )}
    >
      {children}
    </Link>
  );
}
