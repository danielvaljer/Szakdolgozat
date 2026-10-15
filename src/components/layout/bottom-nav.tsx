"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconClose } from "@/components/ui/icons";
import { t } from "@/lib/i18n/hu";
import { isActive, mobileMoreNav, mobileNav, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

function BottomLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
        active ? "text-accent" : "text-ink-muted",
      )}
    >
      <Icon width={20} height={20} />
      {item.label}
    </Link>
  );
}

/**
 * Mobil alsó sáv: a négy leggyakoribb cél egy koppintásra, középen a kiemelt művelet,
 * a többi pedig a „Több” fiókban. (A QR-beolvasás a novemberi szakaszban kerül a középre.)
 */
export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moreOpen]);

  const [first, second, primary, fourth] = mobileNav;
  if (!first || !second || !primary || !fourth) return null;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label={t.nav.tobb}
      >
        <ul className="grid grid-cols-5">
          <li>
            <BottomLink item={first} active={isActive(pathname, first.href)} />
          </li>
          <li>
            <BottomLink item={second} active={isActive(pathname, second.href)} />
          </li>
          <li>
            <Link
              href={primary.href}
              className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-accent"
            >
              <span className="grid size-9 place-items-center rounded-full bg-accent text-on-accent">
                <primary.icon width={20} height={20} />
              </span>
              <span className="text-ink-muted">{primary.label}</span>
            </Link>
          </li>
          <li>
            <BottomLink item={fourth} active={isActive(pathname, fourth.href)} />
          </li>
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              className="flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] text-ink-muted"
            >
              <span className="text-lg leading-none">⋯</span>
              {t.nav.tobb}
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t.common.cancel}
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-md border border-line bg-surface p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-overlay">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-ink">{t.nav.tobb}</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label={t.common.cancel}
                className="text-ink-muted"
              >
                <IconClose width={18} height={18} />
              </button>
            </div>
            <ul className="space-y-0.5">
              {mobileMoreNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
                  >
                    <item.icon width={18} height={18} className="text-ink-muted" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
