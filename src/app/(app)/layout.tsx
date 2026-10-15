import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

/** A bejelentkezett felület: minden oldal a közös vázban jelenik meg. */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
