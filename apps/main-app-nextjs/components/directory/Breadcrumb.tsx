/**
 * Breadcrumb for the directory surface.
 *
 * Takes real hrefs rather than labels alone, because it also feeds the
 * BreadcrumbList structured data on the page — and a breadcrumb whose visible
 * trail and whose markup can disagree is worse than none.
 */

export type Crumb = { name: string; href?: string };

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-xs gap-y-2xs text-xs text-ink-muted">
        {trail.map((c, i) => (
          <li key={c.name} className="flex items-center gap-x-xs">
            {i === trail.length - 1 || !c.href ? (
              <span className="text-ink">{c.name}</span>
            ) : (
              <>
                <a href={c.href}>{c.name}</a>
                <span aria-hidden className="text-ink-subtle">
                  /
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
