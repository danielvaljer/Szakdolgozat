"use client";

import { useSyncExternalStore } from "react";
import { IconMonitor, IconMoon, IconSun } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { t } from "@/lib/i18n/hu";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

/**
 * Saját, ~40 soros téma-váltó. Nincs `next-themes` függőség (lásd docs/dontesek.md D-0005).
 *
 * Miért `useSyncExternalStore`? Mert a `localStorage` a React szempontjából **külső rendszer**,
 * és erre a React pontosan ezt a hookot ajánlja. Így:
 *   - nincs állapot-szinkronizálás effekten belül (amit az ESLint helyesen jelez),
 *   - nincs hidratálási eltérés: a szerver a „rendszer” értéket adja, az első festést pedig
 *     a `layout.tsx`-be ágyazott kis szkript végzi (ezért nincs fehér villanás).
 */
function readTheme(): Theme {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
}

function readServerTheme(): Theme {
  return "system";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function applyTheme(theme: Theme): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
}

function chooseTheme(theme: Theme): void {
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  for (const listener of listeners) listener();
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme);

  const options: readonly { value: Theme; label: string; Icon: typeof IconSun }[] = [
    { value: "light", label: t.nav.themes.light, Icon: IconSun },
    { value: "dark", label: t.nav.themes.dark, Icon: IconMoon },
    { value: "system", label: t.nav.themes.system, Icon: IconMonitor },
  ];

  return (
    <div className={cn("inline-flex rounded-sm border border-line bg-surface p-0.5", className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => chooseTheme(value)}
          className={cn(
            "flex h-7 w-8 items-center justify-center rounded-[4px] text-ink-muted transition-colors",
            theme === value ? "bg-surface-muted text-ink" : "hover:text-ink",
          )}
        >
          <Icon width={16} height={16} />
        </button>
      ))}
    </div>
  );
}
