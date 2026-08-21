<script>
  import { COUNTRIES } from "$lib/countries";
  import { contentUrl, geoUrl } from "$lib/countries/urls";
  import PageShell from "$lib/components/layout/PageShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    House, SolarPanel, PlugZap, HardHat, Landmark, CreditCard, Droplets, ArrowRight
  } from "@lucide/svelte";

  // The one homepage, rendered unchanged at /, /in and /us. It takes no country
  // prop on purpose: the three URLs are meant to be identical, so there is
  // nothing here to branch on. Everything country-specific starts one level
  // down, at /{country}/solar.
  //
  // Deliberately carries no installer counts. The headline numbers people reach
  // for live in masterlist_indian_businesses / masterlist_usa_businesses, which
  // are raw scrape lists — the directory itself shows 640 visible profiles for
  // IN and 6 for US. Printing the masterlist figure next to a country name
  // would be false, and printing the true one would need a query this page
  // otherwise does not make.
  const markets = Object.values(COUNTRIES);

  const pillars = [
    { href: contentUrl("/rooftop-solar"), title: "Rooftop Solar", desc: "System sizing, costs, and what to expect from a rooftop installation", icon: House },
    { href: contentUrl("/solar-panels"), title: "Solar Panels", desc: "Compare panel brands, technologies, and specifications", icon: SolarPanel },
    { href: contentUrl("/solar-inverters"), title: "Solar Inverters", desc: "On-grid, hybrid, and micro inverter options for your system", icon: PlugZap },
    { href: contentUrl("/solar-installation"), title: "Solar Installation", desc: "Site assessment, installation process, and timeline", icon: HardHat },
    { href: contentUrl("/solar-subsidy"), title: "Solar Subsidy", desc: "PM Surya Ghar Yojana, state subsidies, and how to apply", icon: Landmark },
    { href: contentUrl("/solar-financing"), title: "Solar Financing", desc: "Solar loans, EMI options, and bank schemes", icon: CreditCard },
    { href: contentUrl("/solar-pumps"), title: "Solar Pumps", desc: "Agricultural and residential solar pump solutions", icon: Droplets }
  ];

  const title = "Solar Vipani | Find Verified Solar Installers";
  const description =
    "Browse verified solar panel installers by state. Compare quotes, read reviews and go solar. Free to use.";

  // Assembled here rather than inline: svelte2tsx mis-parses `{@html `<script …`}`
  // and reports a phantom "Unterminated template" error far from the real line.
  // One @graph block rather than two separate ones keeps that to a single
  // occurrence.
  const structuredData = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Solar Vipani",
        url: "https://solarvipani.com",
        logo: "https://solarvipani.com/logo512.png",
        description:
          "Platform connecting customers with verified solar panel installers",
        sameAs: [
          "https://www.facebook.com/solarvipani",
          "https://www.linkedin.com/company/solarvipani"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"]
        }
      },
      {
        "@type": "WebSite",
        name: "Solar Vipani",
        url: "https://solarvipani.com",
        description: "Find verified solar panel installers near you"
      }
    ]
  })}<\/script>`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="https://solarvipani.com" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://solarvipani.com/logo512.png" />
  <meta property="og:url" content="https://solarvipani.com" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="https://solarvipani.com/logo512.png" />

  {@html structuredData}
</svelte:head>

<PageShell>
  <PageHeader
    title="Find Verified Solar Installers"
    lede="Browse installers by state, compare quotes, and go solar. Free to use, no spam."
  />

  <section>
    <PageHeader as="h2" title="Browse Installers" />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-[theme(--card-gap)]">
      {#each markets as market}
        <a
          href={geoUrl(market.code)}
          class="group flex items-center justify-between border border-border rounded-[theme(--radius-lg)] bg-card p-6 no-underline transition-all duration-[theme(--transition-default)] hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)]"
        >
          <span>
            <span class="block text-xl font-semibold text-primary-strong group-hover:text-primary-hover transition-colors">
              {market.name}
            </span>
            <span class="block text-sm text-muted-foreground">
              Solar installers by {market.levels.level1.singular.toLowerCase()}
            </span>
          </span>
          <ArrowRight class="h-5 w-5 shrink-0 text-primary-strong" />
        </a>
      {/each}
    </div>
  </section>

  <section>
    <PageHeader
      as="h2"
      title="Learn About Solar"
      lede="Everything worth knowing before going solar — from panels and inverters to subsidies and financing."
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[theme(--card-gap)]">
      {#each pillars as pillar}
        <a
          href={pillar.href}
          class="group flex flex-col border border-border rounded-[theme(--radius-lg)] bg-card p-6 no-underline transition-all duration-[theme(--transition-default)] hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)]"
        >
          <pillar.icon class="h-8 w-8 text-primary-strong mb-3" />
          <h3 class="text-lg font-semibold text-primary-strong mb-2 group-hover:text-primary-hover transition-colors">
            {pillar.title}
          </h3>
          <p class="text-sm text-foreground leading-relaxed">{pillar.desc}</p>
        </a>
      {/each}
    </div>
  </section>
</PageShell>
