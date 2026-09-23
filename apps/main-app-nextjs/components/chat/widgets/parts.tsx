/**
 * The building blocks every tool-result card is made of. Tool payloads come
 * from the backend untyped, so the cards read them as `ToolData`.
 */
import type { ReactNode } from 'react';

export type ToolData = Record<string, any>;

/** The card: emoji and title header, optional header action, then content. */
export function WidgetShell({
  emoji,
  title,
  subtitle,
  action,
  children
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-xs flex flex-col gap-sm rounded-lg border border-line bg-surface-sunken p-sm">
      <div className="flex items-start justify-between gap-xs">
        <div className="flex flex-col">
          <h4 className="flex items-center gap-xs text-base font-semibold">
            <span aria-hidden="true">{emoji}</span>
            {title}
          </h4>
          {subtitle && <span className="text-xs text-ink-muted">{subtitle}</span>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/** A bordered group inside a card. */
export function Panel({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-xs rounded-md border border-line bg-surface p-xs">
      {title && <h5 className="flex items-center gap-xs text-sm font-semibold">{title}</h5>}
      {children}
    </div>
  );
}

/** A small labelled figure. */
export function StatTile({
  label,
  value,
  accent
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-xs">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-action' : ''}`}>{value}</p>
    </div>
  );
}

/** Label on the left, value on the right. */
export function StatRow({
  label,
  value,
  accent,
  strong
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-xs text-sm">
      <span className="text-ink-muted">{label}</span>
      <span
        className={`text-right ${strong ? 'font-bold' : 'font-semibold'} ${accent ? 'text-action' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge badge-outline badge-sm">{children}</span>;
}

/** Bulleted list of plain strings. */
export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc ps-lg text-sm text-ink-muted">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
