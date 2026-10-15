/** Betöltési állapot: skeleton sorok, nem középre tett pörgő ikon (design 6. pont). */
export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-48 animate-pulse rounded-sm bg-surface-muted" />
      <div className="h-24 animate-pulse rounded-md bg-surface-muted" />
      <div className="rounded-md border border-line bg-surface p-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="mb-2 h-7 animate-pulse rounded-sm bg-surface-muted last:mb-0" />
        ))}
      </div>
    </div>
  );
}
