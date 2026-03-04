<script>
  import { onMount } from "svelte";
  import BusinessDirectory from "$lib/in/components/BusinessDirectory.svelte";
  import RecentProjectsHome from "$lib/in/components/RecentProjectsHome.svelte";
  import LeadForm from "$lib/in/components/LeadForm.svelte";
  import SolarComparisonTable from "$lib/in/components/SolarComparisonTable.svelte";
  import AboutSolarVipani from "$lib/in/components/AboutSolarVipani.svelte";

  // Receive data from server
  let { data } = $props();

  // Initialize component state
  let ChatbotPopup = $state(null);
  let shouldLoadChatbot = $state(false);
  let videoLoaded = $state(false);
  let videoRef = $state(null);

  // Extract recent projects from data
  const recentProjects = $derived(data?.recentProjects || []);
  const dateModified = $derived(data?.dateModified ?? new Date().toISOString().split('T')[0]);

  // Lazy load non-critical components after initial page load
  onMount(async () => {
    // Progressive enhancement: Load video after static image
    if (videoRef) {
      videoRef.addEventListener('loadeddata', () => {
        videoLoaded = true;
      });

      videoRef.addEventListener('error', () => {
        console.log('Video failed to load, using static image');
      });
    }

    // Show chatbot popup when user reaches bottom of About section
    let chatbotTimer = null;

    const aboutSection = document.querySelector("#about-section");
    if (aboutSection) {
      // Create a sentinel element at the bottom of the about section
      const bottomSentinel = document.createElement('div');
      bottomSentinel.style.position = 'absolute';
      bottomSentinel.style.bottom = '0';
      bottomSentinel.style.height = '1px';
      bottomSentinel.style.width = '100%';
      bottomSentinel.style.pointerEvents = 'none';
      aboutSection.style.position = 'relative';
      aboutSection.appendChild(bottomSentinel);

      // Observer for the bottom sentinel
      const chatbotObserver = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting) {
            // Bottom of About section is visible - wait 1 second then show chatbot
            if (!chatbotTimer) {
              chatbotTimer = setTimeout(async () => {
                if (!ChatbotPopup) {
                  const module = await import("$lib/in/components/ChatbotPopup.svelte");
                  ChatbotPopup = module.default;
                }
                shouldLoadChatbot = true;
              }, 1000);
            }
          } else {
            // User scrolled back up - hide chatbot and clear timer
            if (chatbotTimer) {
              clearTimeout(chatbotTimer);
              chatbotTimer = null;
            }
            shouldLoadChatbot = false;
          }
        },
        { rootMargin: "0px", threshold: 0 },
      );

      chatbotObserver.observe(bottomSentinel);
    }
  });
</script>

<svelte:head>
  <title
    >Solar Vipani | India's #1 Solar Quotation Service | Quickly Get Solar
    Quotations from 2-3 Verified Installers</title
  >
  <meta
    name="description"
    content="Find verified solar panel installers near you in India. Get up to ₹78,000 government subsidy under PM Surya Ghar Yojana. Compare quotes, read reviews & save up to 95% on electricity bills. Free consultation available."
  />

  <!-- Enhanced Keywords -->
  <meta
    name="keywords"
    content="solar panel installation India, solar installers near me, PM Surya Ghar Yojana, solar subsidy India, rooftop solar installation, solar panel cost, verified solar installers, solar energy India, solar panel quotes"
  />

  <!-- Geographic targeting -->
  <meta name="geo.region" content="IN" />
  <meta name="geo.country" content="India" />

  <!-- Enhanced Open Graph -->
  <meta
    property="og:title"
    content="Solar Vipani | India's #1 Solar Panel Installer Directory"
  />
  <meta
    property="og:description"
    content="Connect with 500+ verified solar installers across India. Get up to ₹78,000 government subsidy. Save up to 95% on electricity bills. Free consultation & quotes."
  />
  <meta property="og:image" content="https://solarvipani.com/logo512.png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:url" content="https://solarvipani.com/in" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Solar Vipani | India's #1 Solar Panel Installer Directory"
  />
  <meta
    name="twitter:description"
    content="Find verified solar installers near you. Get ₹78,000 subsidy & save 95% on electricity bills."
  />
  <meta name="twitter:image" content="https://solarvipani.com/logo512.png" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://solarvipani.com/in" />

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
      "description": "India's leading platform connecting customers with verified solar panel installers",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.facebook.com/solarvipani",
        "https://www.linkedin.com/company/solarvipani"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"]
      },
      "dateModified": dateModified
    })}<\/script>`}

  {@html `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Solar Vipani",
      "url": "https://solarvipani.com",
      "description": "Find verified solar panel installers across India",
      "dateModified": dateModified
    })}<\/script>`}

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://solarvipani.com/in"
        }
      ]
    }
  </script>

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

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Solar Panel Installation Directory",
      "description": "Connect with verified solar panel installers across India",
      "provider": {
        "@type": "Organization",
        "name": "Solar Vipani"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
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
    }
  </script>
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground">
  <!-- Hero Banner Section -->
  <div class="relative w-full h-[theme(--height-lg)] flex items-center justify-center text-center overflow-hidden md:h-[42rem]">
    <!-- Static Image - Always visible initially, fades out when video loads -->
    <img
      class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
      class:opacity-0={videoLoaded}
      src="/header/header.avif"
      alt="Residential Solar Panel Installation in India"
      width="1920"
      height="600"
      fetchpriority="high"
      decoding="async"
    />

    <!-- Video - Fades in once loaded -->
    <video
      bind:this={videoRef}
      class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
      class:opacity-0={!videoLoaded}
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
    >
      <source src="/video/installation-video.mp4" type="video/mp4" />
    </video>

    <div class="absolute top-0 left-0 w-full h-full z-10 bg-black/55"></div>
    <div class="relative z-20 max-w-3xl px-6">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground leading-tight drop-shadow-lg">
        Get 2-3 Free Quotes from Verified Installers in Your Area
      </h1>
      <h2 class="text-2xl md:text-3xl font-medium mb-6 text-primary-foreground leading-snug drop-shadow-lg">
        Save 10-20% on installation costs with competitive quotes
      </h2>
    </div>
  </div>

  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Lead Form Section -->
    <section id="lead-form-sv" class="mb-8 mx-auto max-w-[theme(--max-width-md)]">
      <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
        <div class="text-center mb-[theme(--spacing-2xl)]">
          <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Get Your Free Quotes</h2>
          <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
        </div>
        <LeadForm showWrapper={false} />
      </div>
    </section>

    <!-- Solar Comparison Section -->
    <SolarComparisonTable />

    <!-- How It Works Section -->
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">How Solar Vipani Works</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-[theme(--card-gap)]">
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-[theme(--spacing-lg)]">1</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-md)]">Fill the Inquiry Form</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Share your basic details and energy requirements to help us understand your needs.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-[theme(--spacing-lg)]">2</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-md)]">Receive Competitive Quotes</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Review quotes from 2-3 solar companies, comparing costs, equipment, and terms to find the perfect match.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-[theme(--spacing-lg)]">3</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-md)]">Make an Informed Choice</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Select a provider with complete confidence, backed by transparent, verified information.
          </p>
        </div>
        <div class="text-center border border-border hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-[theme(--spacing-lg)]">4</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-md)]">Share Your Success</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Join our community of solar adopters by sharing your experience, helping others on their journey to clean energy.
          </p>
        </div>
      </div>
    </section>

    <!-- Recent Projects Section -->
    <RecentProjectsHome projects={recentProjects} />

    <!-- Business Directory Section -->
    <section class="mb-8 rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] bg-[hsl(var(--accent)/0.1)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Solar Panel Installer Directory</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Find verified solar installers in your area
        </p>
      </div>
      <BusinessDirectory />
    </section>

    <!-- Benefits Section -->
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-accent-muted p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Why Now is the Right Time to Install Solar in India</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Take advantage of record subsidies, rising electricity costs, and our network of verified installers
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)] mb-[theme(--spacing-2xl)]">
        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-[theme(--spacing-lg)]">💰</div>
          <div class="text-3xl font-bold text-primary mb-[theme(--spacing-sm)]">Up to ₹78,000</div>
          <h3 class="text-xl font-semibold text-primary mb-[theme(--spacing-md)]">Government Subsidy</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Get up to ₹78,000 in direct subsidy under PM Surya Ghar Yojana - available for limited time
          </p>
        </div>

        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-[theme(--spacing-lg)]">🏦</div>
          <div class="text-3xl font-bold text-primary mb-[theme(--spacing-sm)]">0% Interest</div>
          <h3 class="text-xl font-semibold text-primary mb-[theme(--spacing-md)]">Easy Financing Options</h3>
          <p class="text-foreground dark:text-foreground-secondary">Zero-cost EMI and attractive loan schemes from leading banks and NBFCs make solar affordable</p>
        </div>

        <div class="flex flex-col items-center text-center border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all duration-[theme(--transition-default)]">
          <div class="text-5xl mb-[theme(--spacing-lg)]">⚡</div>
          <div class="text-3xl font-bold text-primary mb-[theme(--spacing-sm)]">50-80%</div>
          <h3 class="text-xl font-semibold text-primary mb-[theme(--spacing-md)]">Electricity Bill Savings</h3>
          <p class="text-foreground dark:text-foreground-secondary">
            Save up to 80% on rising electricity costs with net metering and reduce dependency on the grid
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Frequently Asked Questions</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
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
          <details class="group py-[theme(--spacing-lg)] cursor-pointer">
            <summary class="flex items-center justify-between gap-4 list-none font-semibold text-foreground text-base md:text-lg select-none">
              <span>{faq.q}</span>
              <span class="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p class="mt-[theme(--spacing-md)] text-foreground dark:text-foreground-secondary leading-relaxed">{faq.a}</p>
          </details>
        {/each}
      </div>
    </section>

    <!-- Blogs Section -->
    <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Latest Solar Insights</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Stay informed with expert advice and industry updates
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)] mb-[theme(--spacing-2xl)]">
        <div class="border border-border flex flex-col hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <h3 class="text-lg font-semibold mb-[theme(--spacing-md)]">
            <a
              href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
              class="text-primary hover:text-primary-hover dark:hover:text-primary transition-colors"
            >Why Hiring a Verified Solar Installer in India Is Essential</a
            >
          </h3>
          <p class="text-foreground dark:text-foreground-secondary mb-[theme(--spacing-lg)] flex-grow">
            Learn about the importance of professional workmanship, safety
            compliance, maximizing system efficiency, and ensuring long-term
            support.
          </p>
          <a
            href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
            class="text-primary font-semibold text-sm hover:text-primary-hover dark:hover:text-primary transition-colors"
          >Read More →</a
          >
        </div>

        <div class="border border-border flex flex-col hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <h3 class="text-lg font-semibold mb-[theme(--spacing-md)]">
            <a
              href="/in/blogs/pm-surya-ghar-yojana"
              class="text-primary hover:text-primary-hover dark:hover:text-primary transition-colors"
            >PM Surya Ghar Yojana: Your Guide to Check Eligibility</a
            >
          </h3>
          <p class="text-foreground dark:text-foreground-secondary mb-[theme(--spacing-lg)] flex-grow">
            Understand the eligibility criteria and steps to benefit from the
            government scheme providing subsidies for solar rooftop
            installations.
          </p>
          <a
            href="/in/blogs/pm-surya-ghar-yojana"
            class="text-primary font-semibold text-sm hover:text-primary-hover dark:hover:text-primary transition-colors"
          >Read More →</a
          >
        </div>

        <div class="border border-border flex flex-col hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] rounded-[theme(--radius-lg)] bg-background p-[theme(--spacing-2xl)] transition-all duration-[theme(--transition-default)]">
          <h3 class="text-lg font-semibold mb-[theme(--spacing-md)]">
            <a
              href="/in/blogs/cost-of-solar-on-grid-system"
              class="text-primary hover:text-primary-hover dark:hover:text-primary transition-colors"
            >What is the Approximate Cost of a Solar On Grid System?</a
            >
          </h3>
          <p class="text-foreground dark:text-foreground-secondary mb-[theme(--spacing-lg)] flex-grow">
            Learn about the costs associated with installing a solar on-grid
            system, including equipment, labor, and other components.
          </p>
          <a
            href="/in/blogs/cost-of-solar-on-grid-system"
            class="text-primary font-semibold text-sm hover:text-primary-hover dark:hover:text-primary transition-colors"
          >Read More →</a
          >
        </div>
      </div>

      <div class="text-center">
        <a href="/in/blogs" class="inline-block text-primary-foreground font-semibold bg-primary hover:bg-primary-hover hover:-translate-y-[theme(--hover-lift-sm)] px-[theme(--button-padding-x-default)] py-[theme(--button-padding-y-default)] rounded-[theme(--radius-lg)] transition-all duration-[theme(--transition-default)]">View All Blogs</a>
      </div>
    </section>

    <!-- About Section -->
    <div id="about-section">
      <AboutSolarVipani />
    </div>
  </div>
</main>

<!-- Chatbot Popup (Lazy Loaded) -->
{#if shouldLoadChatbot && ChatbotPopup}
  <svelte:component this={ChatbotPopup} />
{/if}

