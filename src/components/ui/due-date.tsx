import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n/hu";

/**
 * A határidő megjelenítése egy helyen.
 * A kiadás alapesetben **határozatlan idejű**, ezért ez nem üres mező, hanem szöveg.
 */
export function DueDate({ value }: { value: string | null }) {
  if (!value) return <span className="text-ink-muted">{t.common.openEnded}</span>;
  return <span className="tabular-nums">{formatDate(value)}</span>;
}
