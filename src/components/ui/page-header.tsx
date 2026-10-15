import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Oldalcím + rövid leírás + az elsődleges művelet. Minden képernyő elején ez áll. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
