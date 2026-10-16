import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/** Táblázat-elemek egy helyen: minden lista ugyanúgy néz ki. */
export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface-muted text-left text-xs uppercase tracking-wide text-ink-muted">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ className, children }: { className?: string; children: ReactNode }) {
  return <tr className={cn("border-b border-line last:border-b-0", className)}>{children}</tr>;
}

export function Th({ className, children }: { className?: string; children: ReactNode }) {
  return <th className={cn("px-3 py-2 font-medium", className)}>{children}</th>;
}

export function Td({ className, children }: { className?: string; children: ReactNode }) {
  return <td className={cn("px-3 py-2 align-middle", className)}>{children}</td>;
}
