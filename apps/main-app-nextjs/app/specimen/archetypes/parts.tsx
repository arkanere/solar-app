import { Phone, MessageCircle, MapPin, Globe, Mail, ArrowUpRight } from 'lucide-react';
import { initials, SERVICE_NAMES, thumbUrl, type Installer } from './fixtures';

/**
 * The proposal. Not a comparison with what exists — a design for what these
 * pages should be.
 *
 * The three colour rules from design-foundation.md are structural in
 * globals.css, so almost nothing here needs a colour class: a bare <a> is
 * already sky and already underlined, and a bare heading is already ink and
 * cannot take a brand colour. Where a class does appear it is doing real work,
 * and that is the point — the token layer is meant to make the right thing the
 * default and the wrong thing hard to type.
 */

/* ---------------------------------------------------------------- */
/* Specimen chrome — the sheet, not the archetype                    */
/* ---------------------------------------------------------------- */

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-sm max-w-prose text-ink-muted">{children}</p>;
}

export function Section({
  label,
  title,
  children,
  intent
}: {
  label: string;
  title: string;
  intent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3xl">
      <p className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</p>
      <h2 className="mt-2xs text-xl">{title}</h2>
      <p className="mb-lg mt-xs max-w-prose text-sm text-ink-muted">{intent}</p>
      {children}
    </section>
  );
}

/** Marks where the specimen sheet stops and the page begins. */
export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-canvas">
      <div className="px-md py-xl sm:px-lg">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Archetype pieces                                                  */
/* ---------------------------------------------------------------- */

export function Breadcrumb({ trail }: { trail: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-lg">
      <ol className="flex flex-wrap items-center gap-x-xs gap-y-2xs text-xs text-ink-muted">
        {trail.map((name, i) => (
          <li key={name} className="flex items-center gap-x-xs">
            {i === trail.length - 1 ? (
              <span className="text-ink">{name}</span>
            ) : (
              <>
                <a href="#">{name}</a>
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

export function CallButton({ phone, wide }: { phone: string; wide?: boolean }) {
  return (
    <a
      href={`tel:${phone}`}
      className={`inline-flex items-center justify-center gap-xs rounded-md bg-action px-md py-xs text-sm font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover ${
        wide ? 'flex-1' : ''
      }`}
    >
      <Phone aria-hidden className="size-4" />
      Call
    </a>
  );
}

export function WhatsAppButton({ phone, wide }: { phone: string; wide?: boolean }) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, '')}`}
      className={`inline-flex items-center justify-center gap-xs rounded-md border border-action px-md py-xs text-sm font-semibold text-action no-underline transition-colors duration-fast ease-standard hover:bg-accent-surface ${
        wide ? 'flex-1' : ''
      }`}
    >
      <MessageCircle aria-hidden className="size-4" />
      WhatsApp
    </a>
  );
}

/**
 * The visual anchor for a listing row.
 *
 * Rooftop solar is a visual product, and a photograph of a finished
 * installation is the most persuasive thing a local installer has. Where one
 * exists it leads the row. Where one does not, initials hold the same slot so
 * the column keeps a single rhythm and the eye can still run down it — an
 * empty box, or a row that changes height, would break the scan.
 *
 * Cropped from the top: these photographs carry watermarks and phone numbers
 * baked along the bottom edge.
 */
export function WorkThumb({ b, size = 64 }: { b: Installer; size?: number }) {
  if (b.thumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- specimen only; the real page uses next/image with the intrinsic width/height every project row already carries.
      <img
        src={thumbUrl(b.thumb, size * 2, size * 2)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="shrink-0 rounded-md border border-line object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-md border border-line bg-surface-sunken text-sm font-semibold text-ink-subtle"
      style={{ width: size, height: size }}
    >
      {initials(b.name)}
    </span>
  );
}

/**
 * A listing row. One entity, one fixed reading order, scanned down a column of
 * twenty-two: anchor -> name -> place -> what they do, with the comparable
 * number right-aligned and tabular.
 *
 * The number renders only when there is something to say. A blank reads as
 * "not measured"; a zero reads as "measured, and bad".
 */
export function InstallerRow({ b }: { b: Installer }) {
  const services = b.services
    .slice(0, 2)
    .map((s) => SERVICE_NAMES[s])
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="flex flex-wrap items-start gap-x-md gap-y-sm border-b border-line py-md last:border-b-0">
      <WorkThumb b={b} />

      <div className="min-w-0 flex-1 basis-64">
        <h3 className="text-base leading-snug">
          <a href="#">{b.name.trim()}</a>
        </h3>
        <p className="mt-2xs truncate text-sm text-ink-muted">{b.address?.trim() || b.city}</p>
        {services ? <p className="mt-2xs truncate text-xs text-ink-subtle">{services}</p> : null}
      </div>

      <div className="ml-auto flex shrink-0 flex-col items-end gap-xs">
        {b.projects > 0 ? (
          <p className="text-xs tabular-nums text-ink-muted">
            <span className="font-semibold text-ink">{b.projects}</span>{' '}
            {b.projects === 1 ? 'install' : 'installs'}
          </p>
        ) : null}
        {b.phone ? (
          <div className="flex gap-xs">
            <CallButton phone={b.phone} />
            <WhatsAppButton phone={b.phone} />
          </div>
        ) : (
          <a href="#" className="text-sm">
            View contact details
          </a>
        )}
      </div>
    </li>
  );
}

/**
 * A district served by one installer is not a list of one. Half of all district
 * pages are this page, and a one-item list reads as a failure to find anything.
 * The same content, presented as an answer.
 */
export function SoleInstaller({ b, place }: { b: Installer; place: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-lg">
      <p className="text-xs text-ink-muted">One installer covers {place}.</p>
      <div className="mt-md flex gap-md">
        <WorkThumb b={b} size={72} />
        <div className="min-w-0">
          <h2 className="text-lg leading-tight">
            <a href="#">{b.name.trim()}</a>
          </h2>
          <p className="mt-2xs text-sm text-ink-muted">{b.address?.trim() || b.city}</p>
          <p className="mt-2xs text-xs text-ink-subtle">
            {b.services.map((s) => SERVICE_NAMES[s]).filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
      {b.phone ? (
        <div className="mt-lg flex gap-xs">
          <CallButton phone={b.phone} wide />
          <WhatsAppButton phone={b.phone} wide />
        </div>
      ) : null}
      <p className="mt-md text-sm text-ink-muted">
        Looking for more choice? <a href="#">See all installers in Rajasthan</a>.
      </p>
    </div>
  );
}

export function Fact({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-sm">
      <span className="mt-0.5 shrink-0 text-ink-subtle">{icon}</span>
      <div className="min-w-0">
        <dt className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</dt>
        <dd className="mt-2xs break-words text-sm">{children}</dd>
      </div>
    </div>
  );
}

export const Icons = { Phone, Mail, Globe, MapPin, ArrowUpRight };
