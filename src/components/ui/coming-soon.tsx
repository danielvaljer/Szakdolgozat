import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n/hu";

/**
 * Olyan képernyő helye, amely a következő szakaszban készül el.
 * Szándékosan nem „hamarosan…” felirat: megmondja, mi történik itt, és mikor.
 */
export function ComingSoon({
  title,
  phase,
  points,
}: {
  title: string;
  phase: string;
  points: readonly string[];
}) {
  return (
    <>
      <PageHeader title={title} description={phase} />
      <div className="rounded-md border border-dashed border-line bg-surface p-5">
        <p className="text-sm font-medium text-ink">{t.placeholder.title}</p>
        <p className="mt-1 text-sm text-ink-muted">{t.placeholder.body}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-accent">
                •
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
