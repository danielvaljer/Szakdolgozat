import type { ComponentType, SVGProps } from "react";
import {
  IconGarment,
  IconHome,
  IconLog,
  IconMembers,
  IconPlus,
  IconSettings,
  IconSwap,
} from "@/components/ui/icons";
import { t } from "@/lib/i18n/hu";

/**
 * A navigáció EGY helyen van leírva: ebből épül az oldalsáv, a mobil alsó sáv
 * és a „Több” fiók. Ha új képernyő készül, csak itt kell felvenni (terv: legfeljebb 6 menüpont).
 */
export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const primaryNav: readonly NavItem[] = [
  { href: "/attekintes", label: t.nav.attekintes, icon: IconHome },
  { href: "/ruhak", label: t.nav.ruhak, icon: IconGarment },
  { href: "/kiadas", label: `${t.nav.kiadas} / ${t.nav.visszavetel}`, icon: IconSwap },
  { href: "/tagok", label: t.nav.tagok, icon: IconMembers },
  { href: "/naplo", label: t.nav.naplo, icon: IconLog },
];

export const settingsNav: readonly NavItem[] = [
  { href: "/beallitasok/ruhatipusok", label: t.nav.ruhatipusok, icon: IconSettings },
  { href: "/beallitasok/tajegysegek", label: t.nav.tajegysegek, icon: IconSettings },
];

/** Mobilon az alsó sáv: négy kijelölt cél + a kiemelt középső művelet. */
export const mobileNav: readonly NavItem[] = [
  { href: "/attekintes", label: t.nav.attekintes, icon: IconHome },
  { href: "/ruhak", label: t.nav.ruhak, icon: IconGarment },
  { href: "/ruhak/uj", label: t.nav.ujRuha, icon: IconPlus },
  { href: "/tagok", label: t.nav.tagok, icon: IconMembers },
];

export const mobileMoreNav: readonly NavItem[] = [
  { href: "/kiadas", label: t.nav.kiadas, icon: IconSwap },
  { href: "/visszavetel", label: t.nav.visszavetel, icon: IconSwap },
  { href: "/naplo", label: t.nav.naplo, icon: IconLog },
  { href: "/beallitasok/ruhatipusok", label: t.nav.beallitasok, icon: IconSettings },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/attekintes") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
