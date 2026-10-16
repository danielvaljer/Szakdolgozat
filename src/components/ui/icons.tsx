import type { ReactNode, SVGProps } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Saját, kézzel írt ikonkészlet.
 * Miért nem ikonkönyvtár? Mert ez nulla letöltés, nulla függőség, és csak az kell,
 * ami ténylegesen szerepel a felületen (lásd docs/dontesek.md D-0004, D-0005).
 */

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Márkajel: szövött rozetta (népi hímzésmotívum) – ez adja a felület saját arcát,
 * és nem igényel külső képet vagy letöltött betűtípusjelet.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-sm bg-accent", className)}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--on-accent)" strokeWidth={1.7}>
        <circle cx="12" cy="12" r="2" fill="var(--on-accent)" stroke="none" />
        <ellipse cx="12" cy="6.4" rx="1.9" ry="3.2" />
        <ellipse cx="12" cy="17.6" rx="1.9" ry="3.2" />
        <ellipse cx="6.4" cy="12" rx="3.2" ry="1.9" />
        <ellipse cx="17.6" cy="12" rx="3.2" ry="1.9" />
      </svg>
    </span>
  );
}

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconHome = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 10.4 12 3.5l9 6.9" />
    <path d="M5.5 9.6V20.5h13V9.6" />
  </Icon>
);

export const IconGarment = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8.5 4 4.5 6.6l1.7 4.2 2.3-1.2V20h7V9.6l2.3 1.2 1.7-4.2L15.5 4a3.5 3.5 0 0 1-7 0Z" />
  </Icon>
);

export const IconMembers = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9.5" cy="8.5" r="3" />
    <path d="M4 19.5c0-3 2.4-5.2 5.5-5.2S15 16.5 15 19.5" />
    <path d="M16.2 6.2a2.8 2.8 0 0 1 0 5.3" />
    <path d="M17.4 14.7c1.7.7 2.6 2.4 2.6 4.8" />
  </Icon>
);

export const IconSwap = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 9h13.2l-3.2-3.4" />
    <path d="M20.5 15H7.3l3.2 3.4" />
  </Icon>
);

export const IconScan = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8.5V6a2 2 0 0 1 2-2h2.5" />
    <path d="M15.5 4H18a2 2 0 0 1 2 2v2.5" />
    <path d="M20 15.5V18a2 2 0 0 1-2 2h-2.5" />
    <path d="M8.5 20H6a2 2 0 0 1-2-2v-2.5" />
    <path d="M4 12h16" />
  </Icon>
);

export const IconLog = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 6.5h12" />
    <path d="M8 12h12" />
    <path d="M8 17.5h12" />
    <path d="M4.2 6.3l.9.9 1.6-1.8" />
    <path d="M4.5 12h1.4" />
    <path d="M4.5 17.5h1.4" />
  </Icon>
);

export const IconSettings = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="1.8" />
    <circle cx="15" cy="12" r="1.8" />
    <circle cx="8" cy="17" r="1.8" />
  </Icon>
);

export const IconSearch = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.6-4.6" />
  </Icon>
);

export const IconSun = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </Icon>
);

export const IconMoon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Icon>
);

export const IconMonitor = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="4.5" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16.5V20" />
  </Icon>
);

export const IconPlus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconMenu = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const IconChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6.5 9.5 5.5 5 5.5-5" />
  </Icon>
);

export const IconChevronLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="m14 6.5-5.5 5.5L14 17.5" />
  </Icon>
);

export const IconChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="m10 6.5 5.5 5.5L10 17.5" />
  </Icon>
);

export const IconClose = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Icon>
);
