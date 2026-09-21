/**
 * Write for Us — the guest-contributor pitch page. Ported from
 * apps/main-app/src/routes/(layout-1)/write-for-us/+page.svelte.
 *
 * Sans, like /about-us and for the same reason: this is eight lists in card
 * grids, not long-form reading.
 *
 * The Svelte page is 40 cards in six grids, and almost all of them carry one
 * heading and one sentence. That is a card doing no work — a card earns its
 * border when it groups several things or has to be told apart from its
 * neighbours. So the two plain heading+sentence grids (the guidelines and the
 * benefits) become definition lists, and the cards stay where the content is
 * genuinely a set of boxes: the topic list, which is a heading plus a labelled
 * examples line, and the two link-policy panels, which are an allow list and a
 * reject list that must not be confused with each other.
 *
 * Three treatments the port drops:
 *
 *  - **the gradient CTA panel.** design-foundation.md has no gradient and no
 *    shadow on anything that sits on the page rather than over it (§7), and
 *    the panel says the same thing as the section above it.
 *  - **`Check` and `X` glyphs repeated on every list item.** The list is
 *    already under a heading that says allow or reject; the glyph on each row
 *    restates it 11 times. One per panel heading carries it.
 *  - **`border-l-4 border-primary` on the topic cards.** Sky means "you can
 *    act on this" (design-foundation.md rule 2) and a topic card is not
 *    actionable.
 *
 * No `keywords` meta tag: the SvelteKit head emits one and no engine has read
 * it for over a decade. lib/metadata.ts owns the tag set and does not have it.
 */
import type { Metadata } from 'next';
import { ChartColumn, Check, Link2, Trophy, Users, X } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

const SUBMISSION_EMAIL = 'admin@solarvipani.com';

export const metadata: Metadata = pageMetadata({
  title: 'Contribute as a Solar Expert',
  description:
    'Share your solar expertise with thousands of Indian homeowners and businesses. Contribute original articles on solar technology, installation, policy, and sustainability.',
  path: '/write-for-us',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const BENEFITS = [
  {
    icon: Users,
    title: 'Reach Qualified Audience',
    body: 'Connect with thousands of homeowners and businesses actively researching solar solutions'
  },
  {
    icon: Trophy,
    title: 'Build Authority',
    body: "Establish yourself as a thought leader in India's growing renewable energy sector"
  },
  {
    icon: Link2,
    title: 'Professional Visibility',
    body: 'Author bio with link to your professional profile or company website'
  },
  {
    icon: ChartColumn,
    title: 'Share Impact',
    body: "Educate the market and accelerate India's solar adoption journey"
  }
];

const CONTRIBUTORS = [
  {
    title: 'Solar Installation Professionals',
    body: 'Licensed installers with hands-on experience in residential and commercial projects'
  },
  {
    title: 'Electrical & Solar Engineers',
    body: 'Technical experts in PV systems, inverters, batteries, and grid integration'
  },
  {
    title: 'Energy Consultants & Advisors',
    body: 'Professionals guiding customers on system design, financing, and ROI'
  },
  {
    title: 'Researchers & Academics',
    body: 'Scientists studying solar technology, efficiency, sustainability, or policy'
  },
  {
    title: 'Policy & Regulatory Experts',
    body: 'Professionals with deep knowledge of solar subsidies, net metering, and compliance'
  },
  {
    title: 'Sustainability Professionals',
    body: 'Corporate sustainability managers, ESG consultants, and clean energy advocates'
  }
];

const TOPICS = [
  {
    title: 'Solar Technology & Innovation',
    examples:
      'New panel technologies, inverter advances, battery storage solutions, smart grid integration'
  },
  {
    title: 'Installation Best Practices',
    examples: 'Roof assessment, system sizing, wiring standards, safety protocols, maintenance tips'
  },
  {
    title: 'Solar Financing & Economics',
    examples: 'ROI calculations, subsidy programs, financing options, payback period analysis'
  },
  {
    title: 'Policy & Regulations',
    examples:
      'PM Surya Ghar Yojana updates, net metering policies, state-level incentives, compliance'
  },
  {
    title: 'Case Studies & Projects',
    examples:
      'Real installation projects, challenges overcome, energy savings achieved, lessons learned'
  },
  {
    title: 'Sustainability & Impact',
    examples:
      'Carbon footprint reduction, environmental benefits, grid independence, clean energy transition'
  },
  {
    title: 'Consumer Education',
    examples:
      'System selection guides, vendor evaluation, common mistakes to avoid, warranty understanding'
  },
  {
    title: 'Commercial & Industrial Solar',
    examples:
      'Large-scale installations, business benefits, energy management, corporate sustainability'
  }
];

const GUIDELINES = [
  {
    title: 'Originality Required',
    body: 'All content must be 100% original and unpublished elsewhere. We check for plagiarism.'
  },
  {
    title: 'Expert-Level Knowledge',
    body: 'Articles should demonstrate deep industry expertise and practical experience.'
  },
  {
    title: 'Data-Driven & Accurate',
    body: 'Include credible data, statistics, and cite reliable sources. Technical accuracy is mandatory.'
  },
  {
    title: 'Non-Promotional Tone',
    body: 'Focus on education and value, not product pitches or company promotions.'
  },
  {
    title: 'Clear & Accessible Writing',
    body: 'Write for homeowners and businesses, not just technical experts. Explain jargon.'
  },
  {
    title: 'Length & Structure',
    body: '1,200-2,500 words ideal. Use headings, bullet points, and clear sections.'
  },
  {
    title: 'Visual Support',
    body: 'Include diagrams, charts, or photos when relevant (with proper attribution).'
  },
  {
    title: 'Indian Context',
    body: 'Content should be relevant to the Indian solar market, regulations, and climate.'
  }
];

const ALLOWED = [
  'Links to credible research papers, government resources, or industry reports',
  'References to relevant technical standards or certification bodies',
  'Author bio with one link to your professional LinkedIn or company website',
  "Links that genuinely add value to the reader's understanding"
];

const REJECTED = [
  'Promotional links to products, services, or unrelated websites',
  'Affiliate links or commercial referral URLs',
  'Excessive self-promotion or company advertising within content',
  'Link exchanges, paid links, or SEO link-building schemes',
  'Links to low-quality or irrelevant sources'
];

const NOTES = [
  {
    label: 'Editorial Control',
    body: 'We reserve the right to edit submissions for clarity, length, grammar, and style. Major changes will be shared with you for approval.'
  },
  {
    label: 'Rejection Rights',
    body: "We may decline articles that don't meet our quality standards, are overly promotional, or lack relevance to our audience."
  },
  {
    label: 'No Payment',
    body: 'This is an unpaid guest contribution opportunity. The primary benefit is audience reach and professional visibility.'
  },
  {
    label: 'Content Ownership',
    body: 'You retain copyright of your work, but grant Solar Vipani non-exclusive rights to publish and promote it.'
  },
  {
    label: 'No Guaranteed Publication',
    body: 'Submission does not guarantee publication. We publish based on editorial merit and audience value.'
  }
];

/** Heading over a set — every section on this page has the same one. */
function Head({ title, lede }: { title: string; lede?: string }) {
  return (
    <Stack gap="2xs">
      <h2 className="text-xl text-ink">{title}</h2>
      {lede ? <p className="text-ink-muted">{lede}</p> : null}
    </Stack>
  );
}

/** A grid of term/definition pairs. No border: the gap is the separation. */
function DefGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-lg md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title}>
          <dt className="font-semibold text-ink">{item.title}</dt>
          <dd className="mt-2xs text-sm text-ink-muted">{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}

function Panel({
  tone,
  title,
  items
}: {
  tone: 'allow' | 'reject';
  title: string;
  items: string[];
}) {
  const Icon = tone === 'allow' ? Check : X;
  const colour = tone === 'allow' ? 'text-success' : 'text-danger';

  return (
    <div className="rounded-lg border border-line bg-surface p-md">
      <h3 className="flex items-center gap-xs text-lg text-ink">
        <Icon aria-hidden className={`h-5 w-5 shrink-0 ${colour}`} />
        {title}
      </h3>
      <ul className="mt-sm flex list-disc flex-col gap-xs pl-lg text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** The four submission steps. The number is the ordered list's own marker. */
function Step({ title, lede, items }: { title: string; lede: React.ReactNode; items: string[] }) {
  return (
    <li className="pl-xs">
      <h3 className="text-lg text-ink">{title}</h3>
      <p className="mt-2xs text-sm text-ink-muted">{lede}</p>
      <ul className="mt-xs flex list-disc flex-col gap-2xs pl-lg text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </li>
  );
}

export default function Page() {
  return (
    <PageShell>
      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="sm">
            <h1 className="text-2xl text-ink">Contribute as a Solar Expert</h1>
            <p className="text-lg font-medium text-ink-muted">
              Share Your Knowledge. Shape India&rsquo;s Solar Future.
            </p>
            <p className="text-ink-muted">
              We invite solar professionals, engineers, researchers, and sustainability experts to
              contribute original, high-quality content that helps homeowners and businesses make
              informed solar decisions.
            </p>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <Head title="Why Contribute to Solar Vipani?" />
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title}>
                <benefit.icon aria-hidden className="mb-xs h-8 w-8 text-action" />
                <h3 className="font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-2xs text-sm text-ink-muted">{benefit.body}</p>
              </div>
            ))}
          </div>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <Head
            title="Who We're Looking For"
            lede="We welcome contributions from credentialed professionals in the solar and renewable energy industry:"
          />
          <DefGrid items={CONTRIBUTORS} />
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <Head
            title="What Topics We Accept"
            lede="We publish expert content that educates, informs, and empowers our audience. Here are some topic areas we're interested in:"
          />
          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            {TOPICS.map((topic) => (
              <div key={topic.title} className="rounded-lg border border-line bg-surface p-md">
                <h3 className="text-lg text-ink">{topic.title}</h3>
                <p className="mt-2xs text-sm text-ink-muted">
                  <strong className="font-semibold text-ink">Examples:</strong> {topic.examples}
                </p>
              </div>
            ))}
          </div>
          <p className="border-l-2 border-line-strong pl-md text-sm text-ink-muted">
            <strong className="font-semibold text-ink">Note:</strong> We prioritize actionable,
            practical content over generic overviews. Case studies and real-world examples are
            especially valued.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <Head
            title="Editorial Guidelines"
            lede="To maintain the highest quality standards, all submissions must meet these requirements:"
          />
          <DefGrid items={GUIDELINES} />
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <Head title="Link Policy" />
          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            <Panel tone="allow" title="What We Allow" items={ALLOWED} />
            <Panel tone="reject" title="What We Reject" items={REJECTED} />
          </div>
          <p className="border-l-2 border-danger pl-md text-sm text-ink-muted">
            <strong className="font-semibold text-ink">Important:</strong> We are not a platform for
            link building or SEO backlinks. Articles submitted primarily for link placement will be
            rejected immediately. Our focus is educational value, not search rankings.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="md">
            <Head title="How to Submit" />
            <ol className="flex list-decimal flex-col gap-lg pl-lg marker:font-semibold marker:text-ink">
              <Step
                title="Send a Pitch"
                lede={
                  <>
                    Email us at <a href={`mailto:${SUBMISSION_EMAIL}`}>{SUBMISSION_EMAIL}</a> with:
                  </>
                }
                items={[
                  'Proposed article title and brief outline (3-5 bullet points)',
                  'Your credentials and relevant experience',
                  'Links to previous published work (if available)'
                ]}
              />
              <Step
                title="Receive Feedback"
                lede="Our editorial team will review your pitch within 5-7 business days and respond with:"
                items={[
                  'Approval to proceed with a full draft',
                  'Suggestions for refinement or alternative angles',
                  "Rejection if the topic doesn't align with our audience needs"
                ]}
              />
              <Step
                title="Submit Full Article"
                lede="If approved, submit your complete article as:"
                items={[
                  'Google Doc (with comment access) or Word document',
                  'Include all images, charts, or diagrams with proper attribution',
                  'Add a 50-75 word author bio with one professional link'
                ]}
              />
              <Step
                title="Review & Publication"
                lede="We will:"
                items={[
                  'Review for accuracy, clarity, and editorial standards',
                  'Request revisions if needed (you retain final approval)',
                  'Publish approved articles within 2-3 weeks',
                  'Notify you when your article goes live'
                ]}
              />
            </ol>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="md">
            <Head title="Important Notes" />
            <dl className="divide-y divide-line border-y border-line">
              {NOTES.map((note) => (
                <div key={note.label} className="py-sm">
                  <dt className="font-semibold text-ink">{note.label}</dt>
                  <dd className="mt-2xs text-sm text-ink-muted">{note.body}</dd>
                </div>
              ))}
            </dl>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="sm">
            <h2 className="text-xl text-ink">Ready to Share Your Expertise?</h2>
            <p className="text-ink-muted">
              Help homeowners and businesses across India make informed solar decisions. Your
              insights can accelerate the clean energy transition.
            </p>
            <p className="text-ink-muted">
              Email us at <a href={`mailto:${SUBMISSION_EMAIL}`}>{SUBMISSION_EMAIL}</a>.
            </p>
          </Stack>
        </div>
      </Section>
    </PageShell>
  );
}
