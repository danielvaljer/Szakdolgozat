"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { BrandMark, IconPlus, IconSearch } from "@/components/ui/icons";
import { t } from "@/lib/i18n/hu";
import { isActive, primaryNav, settingsNav } from "@/lib/nav";

/** A fejléc címe mindig az aktuális képernyő: a leghosszabb illeszkedő útvonal nyer. */
function titleFor(pathname: string): string {
  const routes = [
    ...primaryNav,
    ...settingsNav,
    { href: "/ruhak/uj", label: t.nav.ujRuha, icon: IconPlus },
    { href: "/visszavetel", label: t.nav.visszavetel, icon: IconPlus },
    { href: "/bejelentkezes", label: t.auth.title, icon: IconPlus },
  ];

  const match = routes
    .filter((route) => isActive(pathname, route.href))
    .sort((left, right) => right.href.length - left.href.length)[0];

  return match?.label ?? t.app.name;
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandMark className="size-7 lg:hidden" />
        <p className="truncate text-sm font-medium text-ink">{titleFor(pathname)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link href="/ruhak" className={buttonClass("secondary", "sm", "gap-1.5")}>
          <IconSearch width={16} height={16} />
          <span className="hidden sm:inline">{t.common.search}</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
