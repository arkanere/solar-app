<script>
  import { onMount } from "svelte";
  import { contentUrl, countryUrl } from "$lib/countries/urls";
  import RecentProjectsHome from "$lib/components/RecentProjectsHome.svelte";
  import SolarComparisonTable from "$lib/components/SolarComparisonTable.svelte";
  import LeadFormBusiness from "$lib/components/LeadFormBusiness.svelte";

  // Receive data from server
  let { data } = $props();

  const cc = $derived(data.country.code);
  const features = $derived(data.country.features);
  const homeUrl = $derived(countryUrl(cc, ""));
  const quotesUrl = $derived(countryUrl(cc, "/get-quotes/"));

  // Section gating (stage 9 of docs/migration-plan-delete-us.md). Prefer the
  // feature flag wherever one actually governs the section; the quote funnel
  // has no flag because it is a routing fact, not a product capability.
  //
  // hasQuoteFunnel: /us/get-quotes 301s away to /us (hooks.server.ts) — a US
  // consumer lead funnel is new product work this migration deliberately does
  // not do (§5c). Linking it from the home would send visitors to a redirect.
  // The US home captures leads through LeadFormBusiness instead.
  const hasQuoteFunnel = $derived(cc === "in");
  // The comparison table and the "Why Now" / FAQ blocks are subsidy-and-rupee
  // copy: PM Surya Ghar, ₹78,000, DISCOM, MNRE. features.subsidy is the flag
  // that governs them and it is already false for US.
  const showSubsidyCopy = $derived(features.subsidy);
  // The US home's own sections, verbatim from routes/us/(layout-1)/+page.svelte.
  const isUs = $derived(cc === "us");
  const hasHeroVideo = $derived(cc === "in");
  // The /us hero image was labelled "Solar Panel Installation in India" — one
  // of the §4.1 symptoms this stage exists to remove.
  const heroImageAlt = $derived(
    isUs
      ? "Residential Solar Panel Installation in the United States"
      : "Residential Solar Panel Installation in India",
  );

  // Head copy. Every value below is verbatim from the page that country was
  // served by before stage 9 merged them — the IN set from this file, the US
  // set from routes/us/(layout-1)/+page.svelte. The <title> stays a markup
  // branch rather than joining these: the IN one wraps across two source lines
  // and that newline is part of the rendered output.
  const metaDescription = $derived(
    isUs
      ? "Find verified solar panel installers near you in the United States. Get 30% federal tax credit plus state incentives. Compare quotes, read reviews & save up to 90% on electricity bills. Free consultation available."
      : "Find verified solar panel installers near you in India. Get up to ₹78,000 government subsidy under PM Surya Ghar Yojana. Compare quotes, read reviews & save up to 95% on electricity bills. Free consultation available.",
  );
  const metaKeywords = $derived(
    isUs
      ? "solar panel installation USA, solar installers near me, federal tax credit, solar incentives USA, rooftop solar installation, solar panel cost, verified solar installers, solar energy America, solar panel quotes"
      : "solar panel installation India, solar installers near me, PM Surya Ghar Yojana, solar subsidy India, rooftop solar installation, solar panel cost, verified solar installers, solar energy India, solar panel quotes",
  );
  const ogTitle = $derived(
    isUs
      ? "Solar Vipani USA | Find Verified Solar Panel Installers"
      : "Solar Vipani | India's #1 Solar Panel Installer Directory",
  );
  const ogDescription = $derived(
    isUs
      ? "Connect with verified solar installers across the United States. Get 30% federal tax credit plus state incentives. Save up to 90% on electricity bills. Free consultation & quotes."
      : "Connect with 500+ verified solar installers across India. Get up to ₹78,000 government subsidy. Save up to 95% on electricity bills. Free consultation & quotes.",
  );
  const twitterDescription = $derived(
    isUs
      ? "Find verified solar installers near you. Get 30% federal tax credit & save up to 90% on electricity bills."
      : "Find verified solar installers near you. Get ₹78,000 subsidy & save 95% on electricity bills.",
  );
  const geoRegion = $derived(cc.toUpperCase());
  const ogLocale = $derived(data.country.locale.replace("-", "_"));
  // Hindi is an India-only support language; every country serves English.
  const availableLanguage = $derived(
    cc === "in" ? ["English", "Hindi"] : ["English"],
  );
  // The IN Organization/WebSite point at the country-less root; the US ones
  // pointed at /us. Both preserved as they were (same call as stage 8's orgUrl).
  const siteUrl = $derived(
    isUs ? "https://solarvipani.com/us" : "https://solarvipani.com",
  );
  const orgDescription = $derived(
    isUs
      ? "America's leading platform connecting customers with verified solar panel installers"
      : "India's leading platform connecting customers with verified solar panel installers",
  );
  // Not interpolated from country.name: US reads "across the United States"
  // and IN "across India" — the article makes this copy, not a template.
  const directoryDescription = $derived(
    isUs
      ? "Find verified solar panel installers across the United States"
      : "Find verified solar panel installers across India",
  );
  const serviceDescription = $derived(
    isUs
      ? "Connect with verified solar panel installers across the United States"
      : "Connect with verified solar panel installers across India",
  );

  // Assembled here rather than inline in the markup: svelte2tsx mis-parses
  // `{@html `<script ...`}` and reports a phantom error far from the real line.
  // (The two such blocks already in this file are why `npm run check` reports
  // "Unterminated template" here in the baseline.)
  const breadcrumbScript = $derived(
    `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `https://solarvipani.com${homeUrl}`,
        },
      ],
    })}<\/script>`,
  );

  // Initialize component state
  let videoLoaded = $state(false);
  let videoRef = $state(null);

  // Extract recent projects from data
  const recentProjects = $derived(data?.recentProjects || []);
  const dateModified = $derived(data?.dateModified ?? new Date().toISOString().split('T')[0]);

  // Lazy load non-critical components after initial page load
  onMount(async () => {
    // Progressive enhancement: the hero video (~4.5MB) is decorative and fades
    // in over the static AVIF (the LCP element). We defer its download until the
    // browser is idle so it never competes with the LCP image for bandwidth.
    if (videoRef) {
      videoRef.addEventListener('loadeddata', () => {
        videoLoaded = true;
      });

      videoRef.addEventListener('error', () => {
        console.log('Video failed to load, using static image');
      });

      const startVideoLoad = () => {
        videoRef.src = "/video/installation-video.mp4";
        videoRef.load();
      };

      // requestIdleCallback runs after the page is interactive and the LCP image
      // has had the connection to itself; setTimeout is the Safari fallback.
      if ("requestIdleCallback" in window) {
        requestIdleCallback(startVideoLoad, { timeout: 3000 });
      } else {
        setTimeout(startVideoLoad, 2000);
      }
    }
  });
</script>

<svelte:head>
  {#if isUs}
    <title
      >Solar Vipani USA | Find Verified Solar Panel Installers | Get 30% Federal
      Tax Credit</title
    >
  {:else}
    <title
      >Solar Vipani | India's #1 Solar Quotation Service | Quickly Get Solar
      Quotations from 2-3 Verified Installers</title
    >
  {/if}
  <meta name="description" content={metaDescription} />

  <!-- Enhanced Keywords -->
  <meta name="keywords" content={metaKeywords} />

  <!-- Geographic targeting -->
  <meta name="geo.region" content={geoRegion} />
  <meta name="geo.country" content={data.country.name} />

  <!-- Enhanced Open Graph -->
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:image" content="https://solarvipani.com/logo512.png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:url" content="https://solarvipani.com{homeUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content={ogLocale} />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:description" content={twitterDescription} />
  <meta name="twitter:image" content="https://solarvipani.com/logo512.png" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://solarvipani.com{homeUrl}" />

  <!-- Preload critical hero image for faster LCP -->
  <link
    rel="preload"
    as="image"
    href="/header/header.avif"
    fetchpriority="high"
  />

  <!-- Preconnect to external domains for faster resource loading -->
  <link rel="preconnect" href="https://res.cloudinary.com" />

  <!-- JSON-LD Structured Data -->
  {@html `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Solar Vipani",
      "url": "https://solarvipani.com",
      "logo": "https://solarvipani.com/logo512.png",
      "description": orgDescription,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": cc.toUpperCase()
      },
      "sameAs": [
        "https://www.facebook.com/solarvipani",
        "https://www.linkedin.com/company/solarvipani"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": availableLanguage
      },
      "dateModified": dateModified
    })}<\/script>`}

  {@html `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Solar Vipani",
      "url": siteUrl,
      "description": directoryDescription,
      "dateModified": dateModified,
      // Only the US home has ever declared a sitelinks search box; keeping it
      // rather than dropping live SEO markup on the merge.
      ...(isUs
        ? {
            potentialAction: {
              "@type": "SearchAction",
              target: "https://solarvipani.com/us/solar?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        : {})
    })}<\/script>`}

  {@html breadcrumbScript}

  {#if hasQuoteFunnel}
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Get Solar Installation Quotes in India",
      "description": "Get competitive solar installation quotes from verified installers in 4 simple steps",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Fill the Inquiry Form",
          "text": "Share your basic details and energy requirements to help us understand your needs."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Receive Competitive Quotes",
          "text": "Review quotes from 2-3 solar companies, comparing costs, equipment, and terms to find the perfect match."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Make an Informed Choice",
          "text": "Select a provider with complete confidence, backed by transparent, verified information."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Share Your Success",
          "text": "Join our community of solar adopters by sharing your experience, helping others on their journey to clean energy."
        }
      ]
    }
  </script>
  {/if}

  {#if showSubsidyCopy}
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the cost of solar panel installation in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 3 kW rooftop solar system costs ₹1.5–2.5 lakh before subsidy. After the PM Surya Ghar Yojana subsidy of up to ₹78,000, the effective cost drops significantly. Exact pricing depends on your location, panel brand, and installer. Get free quotes from 2–3 verified installers to compare."
          }
        },
        {
          "@type": "Question",
          "name": "How much government subsidy can I get under PM Surya Ghar Yojana?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under PM Surya Ghar Muft Bijli Yojana, residential customers can get up to ₹78,000 in direct subsidy: ₹30,000 per kW for the first 2 kW, and ₹18,000 per kW for the next 1 kW (capped at 3 kW). The subsidy is credited directly to your bank account after installation."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to install solar panels?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A typical residential rooftop solar installation takes 1–3 days for physical installation. The complete process including site survey, permits, and net metering connection usually takes 2–6 weeks depending on your state's DISCOM."
          }
        },
        {
          "@type": "Question",
          "name": "How do I choose a verified solar installer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Look for installers who are MNRE empanelled, have local installation experience, provide a 5-year workmanship warranty, and offer after-sales service. Solar Vipani connects you with pre-verified installers so you can compare 2–3 quotes with confidence."
          }
        },
        {
          "@type": "Question",
          "name": "What is net metering and how does it benefit me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Net metering lets you export surplus solar energy back to the grid and earn credits on your electricity bill. When your panels produce more than you consume — typically during daytime — the excess units are credited, reducing your monthly bill to near zero in many cases."
          }
        }
      ]
    }
  </script>
  {/if}

  {@html `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Solar Panel Installation Directory",
      "description": serviceDescription,
      "provider": {
        "@type": "Organization",
        "name": "Solar Vipani"
      },
      "areaServed": {
        "@type": "Country",
        "name": data.country.name
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solar Installation Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Residential Solar Installation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Commercial Solar Installation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Agricultural Solar Installation"
            }
          }
        ]
      }
    })}<\/script>`}
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground">
  <!-- Hero Banner Section -->
  <div class="relative w-full h-[theme(--height-lg)] flex items-center justify-center text-center overflow-hidden md:h-[42rem]">
    <!-- Static Image - Always visible initially, fades out when video loads -->
    <img
      class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
      class:opacity-0={videoLoaded}
      src="/header/header.avif"
      alt={heroImageAlt}
      width="1920"
      height="600"
      fetchpriority="high"
      decoding="async"
    />

    <!-- Video - src is attached after idle (see onMount), then fades in once
         loaded. IN only: the /us home has never had it, and it is a ~4.5MB
         decorative download. -->
    {#if hasHeroVideo}
      <video
        bind:this={videoRef}
        class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
        class:opacity-0={!videoLoaded}
        autoplay
        muted
        loop
        playsinline
        preload="none"
      ></video>
    {/if}

    <div class="absolute top-0 left-0 w-full h-full z-10 bg-black/55"></div>
    <div class="relative z-20 max-w-3xl px-6">
      {#if isUs}
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
          Connect with Verified Solar Panel Installers Near You
        </h1>
        <h2 class="text-2xl md:text-3xl font-medium mb-6 text-white leading-snug drop-shadow-lg">
          Get Free Quotes from 2-3 Verified Solar Installers in Your Area
        </h2>
        <p class="text-lg mb-6 text-white/90 max-w-2xl mx-auto drop-shadow-lg">
          Compare quotes, find trusted installers, and save up to 90% on
          electricity bills with 30% federal tax credit and state incentives.
        </p>
        <div class="flex justify-center flex-wrap gap-6 mt-6">
          <span class="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur">
            ✓ Free Consultation
          </span>
          <span class="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur">
            ✓ Federal Tax Credit Support
          </span>
        </div>
      {:else}
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
          Get 2-3 Free Quotes from Verified Installers in Your Area
        </h1>
        <h2 class="text-2xl md:text-3xl font-medium mb-6 text-white leading-snug drop-shadow-lg">
          Save 10-20% on installation costs with competitive solar quotations online
        </h2>
      {/if}
    </div>
  </div>

  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Get Quote CTA Section -->
    {#if hasQuoteFunnel}
    <section id="lead-form-sv" class="mb-8 mx-auto max-w-md">
      <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">Get Your Free Solar Quotation Online</h2>
          <div class="flex justify-center items-center my-4">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
        </div>
        <div class="text-center">
          <a
            href={quotesUrl}
            class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get a Free Solar Quotation Online
          </a>
        </div>
      </div>
    </section>
    {/if}

    <!-- Solar Comparison Section — its copy is India-framed
         ("Simplifying Solar For Everyone All over India"). -->
    {#if showSubsidyCopy}
      <SolarComparisonTable />
    {/if}

    <!-- Solar Knowledge Hub — authority links to all 7 pillar pages -->
    {#if features.seoContentFamilies}
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">Solar Knowledge Hub</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Everything you need to know before going solar — from panels and inverters to subsidies and financing
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[theme(--card-gap)]">
        {#each [
          { href: contentUrl("/rooftop-solar"), title: "Rooftop Solar", desc: "System sizing, costs, and what to expect from a rooftop installation", icon: "☀️" },
          { href: contentUrl("/solar-panels"), title: "Solar Panels", desc: "Compare panel brands, technologies, and specifications", icon: "🔋" },
          { href: contentUrl("/solar-inverters"), title: "Solar Inverters", desc: "On-grid, hybrid, and micro inverter options for your system", icon: "⚡" },
          { href: contentUrl("/solar-installation"), title: "Solar Installation", desc: "Site assessment, installation process, and timeline", icon: "🔧" },
          { href: contentUrl("/solar-subsidy"), title: "Solar Subsidy", desc: "PM Surya Ghar Yojana, state subsidies, and how to apply", icon: "🏛️" },
          { href: contentUrl("/solar-financing"), title: "Solar Financing", desc: "Solar loans, EMI options, and bank schemes", icon: "💳" },
          { href: contentUrl("/solar-pumps"), title: "Solar Pumps", desc: "Agricultural and residential solar pump solutions", icon: "💧" }
        ] as pillar}
          <a
            href={pillar.href}
            class="group flex flex-col border border-border rounded-[theme(--radius-lg)] bg-background p-6 no-underline transition-all duration-[theme(--transition-default)] hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)]"
          >
            <span class="text-3xl mb-3">{pillar.icon}</span>
            <h3 class="text-lg font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors">{pillar.title}</h3>
            <p class="text-sm text-foreground dark:text-foreground-secondary leading-relaxed">{pillar.desc}</p>
          </a>
        {/each}
      </div>
    </section>
    {/if}

    <!-- How It Works Section — its CTA and HowTo schema are the quote funnel -->
    {#if hasQuoteFunnel}
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">How Solar Vipani Works</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-[theme(--card-gap)]">
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-8 transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
          <h3 class="text-lg font-semibold text-primary mb-3">Fill the Inquiry Form</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Share your basic details and energy requirements to help us understand your needs.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-8 transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
          <h3 class="text-lg font-semibold text-primary mb-3">Receive Competitive Quotes</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Review quotes from 2-3 solar companies, comparing costs, equipment, and terms to find the perfect match.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-8 transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
          <h3 class="text-lg font-semibold text-primary mb-3">Make an Informed Choice</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Select a provider with complete confidence, backed by transparent, verified information.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-8 transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">4</div>
          <h3 class="text-lg font-semibold text-primary mb-3">Share Your Success</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Join our community of solar adopters by sharing your experience, helping others on their journey to clean energy.
          </p>
        </div>
      </div>
      <div class="text-center mt-8">
        <a
          href={quotesUrl}
          class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get a Free Solar Quotation Online
        </a>
      </div>
    </section>
    {/if}

    <!-- Recent Projects Section — the component still writes /in/project/…
         literals (S11d note), so features.projects is load-bearing here. -->
    {#if features.projects}
      <RecentProjectsHome projects={recentProjects} />
    {/if}

    <!-- Benefits Section -->
    {#if showSubsidyCopy}
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-accent-muted p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">Why Now is the Right Time to Install Solar in India</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Take advantage of record subsidies, rising electricity costs, and our network of verified installers
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)] mb-8">
        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-4">💰</div>
          <div class="text-3xl font-bold text-primary mb-2">Up to ₹78,000</div>
          <h3 class="text-xl font-semibold text-primary mb-3">Government Subsidy</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Get up to ₹78,000 in direct subsidy under PM Surya Ghar Yojana - available for limited time
          </p>
        </div>

        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-4">🏦</div>
          <div class="text-3xl font-bold text-primary mb-2">0% Interest</div>
          <h3 class="text-xl font-semibold text-primary mb-3">Easy Financing Options</h3>
          <p class="text-foreground dark:text-foreground-secondary">Zero-cost EMI and attractive loan schemes from leading banks and NBFCs make solar affordable</p>
        </div>

        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-4">⚡</div>
          <div class="text-3xl font-bold text-primary mb-2">50-80%</div>
          <h3 class="text-xl font-semibold text-primary mb-3">Electricity Bill Savings</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Save up to 80% on rising electricity costs with net metering and reduce dependency on the grid
          </p>
        </div>
      </div>
    </section>
    {/if}

    <!-- FAQ Section -->
    {#if showSubsidyCopy}
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">Frequently Asked Questions</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <div class="max-w-3xl mx-auto divide-y divide-border">
        {#each [
          {
            q: "What is the cost of solar panel installation in India?",
            a: "A 3 kW rooftop solar system costs ₹1.5–2.5 lakh before subsidy. After the PM Surya Ghar Yojana subsidy of up to ₹78,000, the effective cost drops significantly. Exact pricing depends on your location, panel brand, and installer. Get free quotes from 2–3 verified installers to compare."
          },
          {
            q: "How much government subsidy can I get under PM Surya Ghar Yojana?",
            a: "Residential customers can get up to ₹78,000 in direct subsidy: ₹30,000 per kW for the first 2 kW, and ₹18,000 per kW for the next 1 kW (capped at 3 kW). The subsidy is credited directly to your bank account after installation."
          },
          {
            q: "How long does it take to install solar panels?",
            a: "Physical installation takes 1–3 days. The complete process including site survey, permits, and net metering connection usually takes 2–6 weeks depending on your state's DISCOM."
          },
          {
            q: "How do I choose a verified solar installer?",
            a: "Look for MNRE-empanelled installers with local experience, a 5-year workmanship warranty, and after-sales support. Solar Vipani connects you with pre-verified installers so you can compare 2–3 quotes with confidence."
          },
          {
            q: "What is net metering and how does it benefit me?",
            a: "Net metering lets you export surplus solar energy to the grid and earn bill credits. When your panels produce more than you consume — typically during daytime — the excess units offset your monthly bill, often reducing it to near zero."
          }
        ] as faq}
          <details class="group py-4 cursor-pointer">
            <summary class="flex items-center justify-between gap-4 list-none font-semibold text-foreground text-base md:text-lg select-none">
              <span>{faq.q}</span>
              <span class="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p class="mt-3 text-foreground dark:text-foreground-secondary leading-relaxed">{faq.a}</p>
          </details>
        {/each}
      </div>
    </section>
    {/if}

    <!-- Benefits Section (US) — the /us home's own value propositions. -->
    {#if isUs}
      <section class="mb-8 rounded-[theme(--radius-lg)] bg-accent-muted p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
            Why Choose Solar Panel Installation in the USA?
          </h2>
          <div class="flex justify-center items-center my-4">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
          <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
            Discover the amazing benefits of switching to solar power with
            federal and state incentives and verified installers
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)] mb-8">
          {#each [
            { icon: "⚡", stat: "Up to 90%", title: "Electricity Bill Reduction", desc: "Dramatically reduce your monthly electricity costs with solar power" },
            { icon: "🌞", stat: "30%", title: "Federal Tax Credit", desc: "Get 30% federal tax credit plus additional state and local incentives" },
            { icon: "🌱", stat: "Zero", title: "Carbon Emissions", desc: "Reduce your carbon footprint and contribute to a cleaner, greener America" }
          ] as benefit}
            <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
              <div class="text-5xl mb-4">{benefit.icon}</div>
              <div class="text-3xl font-bold text-primary mb-2">{benefit.stat}</div>
              <h3 class="text-xl font-semibold text-primary mb-3">{benefit.title}</h3>
              <p class="text-foreground dark:text-foreground-secondary">{benefit.desc}</p>
            </div>
          {/each}
        </div>
      </section>

      <!-- Lead Form Section — the only US consumer lead capture path. The user
           confirmed it stays (plan §S9 / hazard 3): /us/get-quotes 301s away,
           so removing this would leave /us with no consumer form at all.
           LeadFormBusiness posts /us/api/submitLead and goto()s /us/thank-you
           as hardcoded literals; that is correct only because this block is
           gated to US. A third country needs the component parameterized. -->
      <section id="lead-form-sv" class="mb-8">
        <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
          <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
              Book A Free Consultation
            </h2>
            <div class="flex justify-center items-center my-4">
              <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
            </div>
            <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
              Get personalized solar recommendations from our experts
            </p>
          </div>
          <LeadFormBusiness />
        </div>
      </section>
    {/if}

  </div>
</main>

