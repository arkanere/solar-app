/**
 * Archetype 4 — the whole editorial page, pillar and cluster alike.
 * Spec: archetype/editorial.md, anatomy in §4.
 *
 * §1 is why this is one component and not two. A pillar and a cluster are the
 * same `seo_pages` row rendered the same way — breadcrumb, headline, nine
 * sections of HTML, six questions — and the only real difference is which
 * list of links sits under the body. The SvelteKit app built them as
 * `PillarPage.svelte` and `ClusterPage.svelte`, which duplicate the
 * breadcrumb, the body renderer, the FAQ and the closing CTA between them.
 *
 * So the difference is one prop, and everything it changes is in `trail` and
 * in the two lines of the link block below.
 *
 * Four blocks of those Svelte components do not come across — §4. The stat
 * chips, `entitySection`/`siblingPillars`, the regex-picked tool CTA, and the
 * `{n}kW prices by city` chip row. The reasons are on the specimen sheet at
 * /specimen/archetypes/editorial, section D.
 *
 * No client components. The disclosure is `<details>` and every link is an
 * anchor, so there is nothing here that needs JavaScript.
 */
import { Section, Stack } from '@/components/layout';
import { Breadcrumb, ChipList, FAQ, QuoteCTA, type Crumb } from '@/components/directory';
import { breadcrumbLD, faqLD } from '@/lib/directory/structuredData';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import type { Article, ClusterLink } from '@/lib/editorial/data';
import { pillarName, type PillarSlug } from '@/lib/editorial/pillars';
import { BodySection } from './ArticleBody';

export function EditorialArticle({
  article,
  pillar,
  clusters,
  variant
}: {
  article: Article;
  pillar: PillarSlug;
  /** Every published cluster under the pillar — the same list for both. */
  clusters: ClusterLink[];
  variant: 'pillar' | 'cluster';
}) {
  const pillarHref = contentUrl(`/${pillar}`);
  const selfHref = variant === 'pillar' ? pillarHref : contentUrl(`/${pillar}/${article.slug}`);

  const trail: Crumb[] =
    variant === 'pillar'
      ? [{ name: 'Home', href: '/' }, { name: pillarName(pillar) }]
      : [
          { name: 'Home', href: '/' },
          { name: pillarName(pillar), href: pillarHref },
          { name: article.h1 }
        ];

  const chips = clusters.map((c) => ({
    label: c.name,
    href: contentUrl(`/${pillar}/${c.slug}`)
  }));

  return (
    <>
      {/* Breadcrumb and headline are one section, as on the directory pages:
          the breadcrumb labels the page it sits on, and a section gap between
          them would read as two adjacent blocks rather than one header.

          Everything on this page is at the prose measure. Only the tables
          leave it, and they do that from inside — ArticleBody.tsx. */}
      <Section width="prose">
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          {/* Up to 80 characters: this is a headline, not a label, so it is
              set in the serif the rest of the article is in. */}
          <h1 className="font-serif text-2xl leading-tight text-ink">{article.h1}</h1>
        </Stack>
      </Section>

      <Section width="prose">
        <Stack gap="xl">
          {article.content.map((s) => (
            <BodySection key={s.heading} heading={s.heading} body={s.body} />
          ))}
        </Stack>
      </Section>

      {/* Six questions, and the answers go in as HTML: exactly one answer in
          the 117 published rows contains a tag, and escaping it would show
          the reader the tag. §7. */}
      {article.faq.length > 0 ? (
        <Section width="prose">
          {/* The serif, on the heading only. FAQ and ChipList are directory
              components and their headings are Inter there, which is right;
              here they follow nine serif `h2`s and a tenth in a second face
              reads as the article having ended. The questions and the chips
              stay sans — they are labels, not reading. */}
          <div className="[&>h2]:font-serif">
            <FAQ items={article.faq} heading="Common questions" html />
          </div>
        </Section>
      ) : null}

      {/* §8: one presentation for both, the chip wrap. The pillar's version
          was a three-column card grid whose cards held nothing but the h1 —
          no second line, no icon, no count. The same 22 links fit in a third
          of the height as chips.

          On a cluster the list includes the page itself, inert and marked,
          which is what says where you are in a 22-item set. */}
      {chips.length > 0 ? (
        <Section width="prose">
          <nav
            aria-label={variant === 'pillar' ? 'Topics in this guide' : 'Related topics'}
            className="[&>h2]:font-serif"
          >
            <ChipList
              heading={variant === 'pillar' ? 'Explore topics' : 'Related topics'}
              chips={chips}
              currentHref={variant === 'cluster' ? selfHref : undefined}
            />
          </nav>
        </Section>
      ) : null}

      {/* The one link from the editorial surface into the directory — the
          other 1,279 URLs. Country-less families reach it at /in/solar
          because the directory is the one thing that is still country-scoped. */}
      <Section width="prose">
        <p className="text-ink-muted">
          Ready to go solar?{' '}
          <a href={geoUrl('in')}>Find verified solar installers across India</a>
        </p>
      </Section>

      {/* The only country-scoped link on the page, and the same component the
          directory pages close with. */}
      <Section width="prose">
        <QuoteCTA country="in" place="India" />
      </Section>

      {/* §9. BreadcrumbList from the same trail the breadcrumb renders and
          FAQPage from the same array the disclosure renders, so neither can
          claim something the page does not show.

          No `Article`: there is no author on any of the 117 rows and no dated
          revision, so the markup would assert less than the page does. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            ...(article.faq.length > 0 ? [faqLD(article.faq)] : [])
          ])
        }}
      />
    </>
  );
}
