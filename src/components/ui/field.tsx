import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { IconChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Űrlap-elemek egy fájlban, mert mindig együtt használjuk őket.
 * Natív elemek maradnak (nincs saját lenyíló, nincs saját dátumválasztó):
 * mobilon a rendszer saját választója jelenik meg, és JavaScript nélkül is működik.
 */

const controlClass =
  "w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/70 disabled:opacity-60";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, "h-11 lg:h-9", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(controlClass, "h-11 appearance-none pr-9 lg:h-9", className)}
        {...props}
      >
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, "min-h-24 py-2", className)} {...props} />;
}

export interface FormRowProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** Címke + mező + súgó egy formátumban, minden űrlapon ugyanúgy. */
export function FormRow({ label, htmlFor, hint, children, className }: FormRowProps) {
  return (
    <div className={cn("max-w-[640px]", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
