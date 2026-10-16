import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/** Panel. Egy fajta kártya létezik, egy fajta sugárral és vonallal (nincs árnyék). */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-md border border-line bg-surface", className)}>{children}</section>
  );
}

export interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description ? <p className="text-xs text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}

export function StatCard({ label, value, hint, valueClassName }: StatCardProps) {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums", valueClassName)}>{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
