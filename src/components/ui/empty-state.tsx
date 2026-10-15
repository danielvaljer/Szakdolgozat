import Link from "next/link";
import { t } from "@/lib/i18n/hu";
import { buttonClass } from "@/components/ui/button";
import { IconSearch } from "@/components/ui/icons";

/** Üres lista: egy mondat + a helyes következő lépés (design 6. pont). */
export function EmptyState({ message, clearHref }: { message?: string; clearHref?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <IconSearch className="text-ink-muted" />
      <p className="text-sm text-ink-muted">{message ?? t.common.empty}</p>
      {clearHref ? (
        <Link href={clearHref} className={buttonClass("secondary", "sm")}>
          {t.common.emptyAction}
        </Link>
      ) : null}
    </div>
  );
}
