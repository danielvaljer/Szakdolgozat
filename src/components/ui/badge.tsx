import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { daysUntil, formatDays } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import type { GarmentCondition, GarmentStatus } from "@/lib/mock/types";

/**
 * Jelvények EGY helyen (korábban két fájl volt: badge + status-badge).
 * Szabály: a jelvény mindig tartalmaz szöveget – a szín önmagában nem információ.
 */
export type BadgeTone = "neutral" | "info" | "warning" | "danger" | "success";

const badgeBase =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium";

/** Egyetlen helyen dől el, hogy melyik tónus hogyan néz ki. */
const toneClasses: Record<BadgeTone, string> = {
  neutral: "border border-line bg-surface-muted text-ink",
  info: "bg-info text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  success: "bg-success text-white",
};

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return <span className={cn(badgeBase, toneClasses[tone], className)}>{children}</span>;
}

/** A ruha kölcsönzési állapota. A „kiadható” a normál állapot, ezért szándékosan színtelen. */
const statusTone: Record<GarmentStatus, BadgeTone> = {
  available: "neutral",
  loaned: "info",
  overdue: "warning",
  repair: "neutral",
  lost: "danger",
};

export interface StatusBadgeProps {
  status: GarmentStatus;
  loanedTo?: string | null;
  dueAt?: string | null;
  className?: string;
}

export function StatusBadge({ status, loanedTo, dueAt, className }: StatusBadgeProps) {
  const detail =
    status === "loaned" && loanedTo
      ? ` · ${loanedTo}`
      : status === "overdue" && dueAt
        ? ` · ${formatDays(daysUntil(dueAt))}`
        : "";

  return (
    <Badge
      tone={statusTone[status]}
      className={cn(status === "repair" && "border-dashed", className)}
    >
      {t.status[status]}
      {detail}
    </Badge>
  );
}

/** A ruha fizikai állapota (új / jó / viselt / sérült). */
const conditionTone: Record<GarmentCondition, BadgeTone> = {
  new: "success",
  good: "neutral",
  worn: "neutral",
  damaged: "danger",
};

export function ConditionBadge({ condition }: { condition: GarmentCondition }) {
  return <Badge tone={conditionTone[condition]}>{t.condition[condition]}</Badge>;
}
