import { notFound } from 'next/navigation';
import {
  BOILERPLATE_DESCRIPTION,
  BRAND_NAMES,
  PROFILE,
  PROFILE_AREAS,
  PROFILE_PROJECTS,
  SERVICE_NAMES,
  thumbUrl
} from '../fixtures';
import {
  Breadcrumb,
  CallButton,
  Fact,
  Frame,
  Icons,
  Lede,
  Section,
  WhatsAppButton
} from '../parts';

const { Phone, Mail, Globe, MapPin, ArrowUpRight } = Icons;

/**
 * Archetype 1 — Installer profile. 649 pages, 46% of the site.
 * Dev-only. Spec: archetype/installer-profile.md.
 */
export default function InstallerSpecimen() {
  if (process.env.NODE_ENV === 'production') notFound();

  const p = PROFILE;
  const place = [p.address?.trim(), p.city, p.district, p.state].filter(Boolean).join(', ');
  // 608 of 643 descriptions are the same two words. A heading over a placeholder is
  // worse than no section, so the paragraph only renders when it says something.
  const description =
    p.description && p.description.trim() !== BOILERPLATE_DESCRIPTION ? p.description : null;

  return (
    <main className="mx-auto max-w-content px-md py-2xl">
      <header className="border-b border-line pb-lg">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">
          Archetype 1 · 649 pages · 46% of the site
        </p>
        <h1 className="mt-xs text-2xl">Installer profile</h1>
        <Lede>
          One business, one question: should I trust these people on my roof? Nothing
          answers that like seeing what they have already built, so this is a portfolio
          page — the work is the argument, and everything else is the caption. Contact
          stays within reach the whole way down rather than waiting at the bottom.
        </Lede>
      </header>

      <Section
        label="A"
        title="The page"
        intent="Identity, then proof, then the practical detail — with a contact panel that follows the reader on desktop and sits directly under the name on a phone, which is where almost all of this traffic is."
      >
        <Frame>
          <Breadcrumb trail={['Home', 'Solar', p.state, p.district, p.name.trim()]} />

          <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* ---- main column ---- */}
            <div className="min-w-0">
              <h1 className="max-w-prose text-2xl leading-tight">{p.name.trim()}</h1>
              <p className="mt-sm flex items-start gap-xs text-ink-muted">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-ink-subtle" />
                <span>{place}</span>
              </p>
              {description ? (
                <p className="mt-md max-w-prose text-ink-muted">{description}</p>
              ) : null}

              {/* ---- contact, inline on small screens only ---- */}
              {p.phone ? (
                <div className="mt-lg flex gap-xs lg:hidden">
                  <CallButton phone={p.phone} wide />
                  <WhatsAppButton phone={p.phone} wide />
                </div>
              ) : null}

              {/* ---- the work ---- */}
              <section className="mt-2xl">
                <div className="flex items-baseline justify-between gap-md">
                  <h2 className="text-xl">Recent installations</h2>
                  <p className="shrink-0 text-sm tabular-nums text-ink-muted">
                    {PROFILE_PROJECTS.length} shown
                  </p>
                </div>

                <div className="mt-md grid gap-md sm:grid-cols-2 lg:grid-cols-3">
                  {PROFILE_PROJECTS.map((pr) => (
                    <figure key={pr.cid}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- specimen only; the real page uses next/image with the intrinsic width/height every project row carries. */}
                      <img
                        src={thumbUrl(pr.cid, 800, 600)}
                        alt={pr.title}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="w-full rounded-lg border border-line bg-surface-sunken object-cover"
                        style={{ aspectRatio: '4 / 3' }}
                      />
                      <figcaption className="mt-xs">
                        <a href="#" className="line-clamp-2 text-sm">
                          {pr.title}
                        </a>
                        <span className="mt-2xs block text-xs tabular-nums text-ink-subtle">
                          {pr.pincode} · {pr.date}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <p className="mt-md text-sm">
                  <a href="#">See all installations</a>
                </p>
              </section>

              {/* ---- what they do ---- */}
              <section className="mt-2xl border-t border-line pt-lg">
                <h2 className="text-xl">What they do</h2>
                <dl className="mt-md grid gap-lg sm:grid-cols-2">
                  <div>
                    <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
                      Services
                    </dt>
                    <dd className="mt-xs text-sm text-ink-muted">
                      {p.services.map((s) => SERVICE_NAMES[s]).filter(Boolean).join(' · ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
                      Panel brands installed
                    </dt>
                    <dd className="mt-xs text-sm text-ink-muted">
                      {p.brands.map((b) => BRAND_NAMES[b]).filter(Boolean).join(' · ')}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* ---- where they work ---- */}
              <section className="mt-2xl border-t border-line pt-lg">
                <h2 className="text-xl">Where they work</h2>
                <ul className="mt-md flex flex-wrap gap-x-md gap-y-xs">
                  {PROFILE_AREAS.map((c) => (
                    <li key={c}>
                      <a href="#" className="text-sm">
                        {c}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* ---- contact rail ---- */}
            <aside className="hidden lg:block">
              <div className="sticky top-lg rounded-lg border border-line bg-surface p-lg">
                <h2 className="text-lg leading-tight">Contact {p.name.trim().split(' ')[0]}</h2>
                {p.phone ? (
                  <div className="mt-md flex flex-col gap-xs">
                    <CallButton phone={p.phone} wide />
                    <WhatsAppButton phone={p.phone} wide />
                  </div>
                ) : null}

                <dl className="mt-lg grid gap-md border-t border-line pt-lg">
                  {p.phone ? (
                    <Fact icon={<Phone aria-hidden className="size-4" />} label="Phone">
                      <a href={`tel:${p.phone}`} className="tabular-nums">
                        {p.phone}
                      </a>
                    </Fact>
                  ) : null}
                  {p.email ? (
                    <Fact icon={<Mail aria-hidden className="size-4" />} label="Email">
                      <a href={`mailto:${p.email}`}>{p.email}</a>
                    </Fact>
                  ) : null}
                  {p.website ? (
                    <Fact icon={<Globe aria-hidden className="size-4" />} label="Website">
                      <a href="#">{p.website}</a>
                    </Fact>
                  ) : null}
                  {p.maps ? (
                    <Fact
                      icon={<ArrowUpRight aria-hidden className="size-4" />}
                      label="Directions"
                    >
                      <a href="#">Open in Google Maps</a>
                    </Fact>
                  ) : null}
                </dl>
              </div>
            </aside>
          </div>
        </Frame>
      </Section>
    </main>
  );
}
