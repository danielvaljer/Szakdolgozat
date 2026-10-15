"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/hu";
import { isActive, primaryNav, settingsNav, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent/10 font-medium text-ink"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <Icon width={18} height={18} className={active ? "text-accent" : undefined} />
      {item.label}
    </Link>
  );
}

/** Asztali oldalsáv. Mobilon rejtve (ott az alsó sáv navigál). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-4">
        <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-accent text-xs font-bold text-on-accent">
          RL
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">{t.app.name}</p>
          <p className="text-xs text-ink-muted">{t.app.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(pathname, item.href)} />
            </li>
          ))}
        </ul>

        <p className="mt-4 px-3 pb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
          {t.nav.beallitasok}
        </p>
        <ul className="space-y-0.5">
          {settingsNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-line px-3 py-2 text-xs text-ink-muted">{t.common.demo}</div>
    </aside>
  );
}
