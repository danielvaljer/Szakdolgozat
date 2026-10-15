import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Négy variáns, két méret. Több nem lesz – lásd docs/design.md 3. pont. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
};

/** Mobilon 44 px (ujjal elérhető), asztali gépen 36 px. */
const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm lg:h-9 lg:px-3.5",
  sm: "h-8 px-2.5 text-sm",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
