import { Badge, type BadgeTone } from "@/components/ui/badge";
import { t } from "@/lib/i18n/hu";
import { daysUntil, formatDays } from "@/lib/format";
import type { GarmentCondition, GarmentStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Az állapot megjelenítése EGY helyen. A jelvény mindig tartalmaz szöveget:
 * a szín önmagában nem információ (design 2. pont).
 */
const toneByStatus: Record<GarmentStatus, BadgeTone> = {
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
    <Badge tone={toneByStatus[status]} className={cn(status === "repair" && "border-dashed", className)}>
      {t.status[status]}
      {detail}
    </Badge>
  );
}

const toneByCondition: Record<GarmentCondition, BadgeTone> = {
  new: "success",
  good: "neutral",
  worn: "neutral",
  damaged: "danger",
};

export function ConditionBadge({ condition }: { condition: GarmentCondition }) {
  return <Badge tone={toneByCondition[condition]}>{t.condition[condition]}</Badge>;
}
