/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. A dropdown is open or closed, and that is local state reacting to a click plus Escape and outside-click to close it. Everything it renders is a plain anchor, so this is the smallest possible island: the header around it stays a server component. */
'use client';

/**
 * One nav dropdown — a label, and a panel of links under it.
 *
 * Both header menus (Solar Guide, Find Solar) are this component with
 * different data, which is the whole reason the links are a prop rather than
 * two hand-written copies of the same markup.
 *
 * Closing is the part worth reading. The SvelteKit original closed on
 * `onmouseleave`, which means a keyboard or touch user could open a menu and
 * never close it. Here it closes on Escape, on an outside pointer-down and on
 * following a link, and the trigger reports `aria-expanded` — no hover
 * handler at all, because hover is not an input method on a phone.
 */
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type NavLink = { href: string; label: string };
export type NavGroup = { group: string; items: NavLink[] };

export function NavMenu({ label, groups }: { label: string; groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // A single group renders as a flat list: the heading would be the menu's own
  // label repeated, which is noise.
  const flat = groups.length === 1;

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-2xs whitespace-nowrap text-sm font-medium text-ink transition-colors duration-fast ease-standard hover:text-action"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={`size-4 transition-transform duration-fast ease-standard ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-xs min-w-52 rounded-lg border border-line bg-surface p-xs shadow-overlay">
          {groups.map((group, i) => (
            <div key={group.group} className={i > 0 ? 'mt-xs border-t border-line pt-xs' : ''}>
              {flat ? null : (
                <p className="px-xs py-2xs text-2xs font-semibold uppercase tracking-wide text-ink-subtle">
                  {group.group}
                </p>
              )}
              {group.items.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-sm px-xs py-2xs text-sm text-ink transition-colors duration-fast ease-standard hover:bg-accent-surface hover:text-action"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
