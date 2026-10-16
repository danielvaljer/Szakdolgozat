"use client";

import { useEffect, useState } from "react";
import { IconMonitor, IconMoon, IconSun } from "@/components/ui/icons";
import { t } from "@/lib/i18n/hu";
import { cn } from "@/components/ui/cn";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

/**
 * Saját, ~30 soros téma-váltó. Nincs `next-themes` függőség (D-0005):
 * a mentett értéket a layout beágyazott szkriptje már festés előtt alkalmazza,
 * így nincs „fehér villanás” betöltéskor.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved);
    }
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = next === "dark" || (next === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
  }

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
          onClick={() => choose(value)}
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
