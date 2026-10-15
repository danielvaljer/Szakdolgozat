import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

/**
 * Az alkalmazás váza: oldalsáv (asztali gép) + fejléc + tartalom + alsó sáv (mobil).
 * Ez az egyetlen hely, ahol az elrendezés le van írva.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <div className="flex min-h-svh flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-5 pb-28 lg:px-6 lg:py-6 lg:pb-10">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
