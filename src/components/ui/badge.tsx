import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "info" | "warning" | "danger" | "success";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border border-line bg-surface-muted text-ink",
  info: "border border-transparent text-white",
  warning: "border border-transparent text-white",
  danger: "border border-transparent text-white",
  success: "border border-transparent text-white",
};

const toneBackground: Record<BadgeTone, string | undefined> = {
  neutral: undefined,
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  success: "bg-success",
};

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        toneBackground[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
