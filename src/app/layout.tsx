import type { Metadata } from "next";
import type { ReactNode } from "react";
import { t } from "@/lib/i18n/hu";
import "./globals.css";

export const metadata: Metadata = {
  title: t.app.name,
  description: t.app.tagline,
};

/**
 * A téma a festés ELŐTT kerül a HTML-re, ezért nincs „fehér villanás” betöltéskor.
 * Ez a ~5 sor helyettesíti a `next-themes` csomagot (lásd docs/dontesek.md D-0005).
 */
const themeScript = `(function(){try{var s=localStorage.getItem("theme")||"system";var d=s==="dark"||(s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
