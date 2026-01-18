<script module>
  // Enhanced data objects with icons
  const benefits = [
    {
      title: "Get Discovered Online",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
      descriptions: [
        'Clients search for queries like "Solar Panel Installers Near Me", "Top Solar Panel installer in [CityName]"',
        "We rank on the first page of Google, Yahoo, CHATGPT, etc for such relevant queries",
      ],
    },
    {
      title: "Direct Customer Inquiries",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      descriptions: [
        "We display your business phone number, WhatsApp, email and address.",
        "This allows customers to reach out to you directly.",
      ],
    },
    {
      title: "Post Recent Projects",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>',
      descriptions: ["Showcase your workmanship to the potential customers."],
    },
    {
      title: "Enhance Online Presence",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
      descriptions: [
        "Get dedicated page on website which has high rating for Solar Installation Domain.",
      ],
    },
    {
      title: "Strengthen Credibility",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      descriptions: [
        "Get a Verified Business tag that boosts client confidence",
      ],
    },
    {
      title: "Manage Multiple Branch Offices",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>',
      descriptions: [
        "Expand your business reach by managing multiple branch locations under one main business profile.",
      ],
    },
  ];

  const faqs = [
    {
      question: "How much does it cost to list my business?",
      answer:
        "Listing your business is completely free of charge. We believe in providing value first and helping solar businesses grow their online presence without any upfront costs.",
    },
    {
      question: "How do you earn money if the business listing is free?",
      answer:
        "We provide premium marketing services to select businesses where we see growth potential. These paid services include targeted campaigns on platforms like Facebook, Instagram, Google Search, and YouTube to further boost your visibility.",
    },
    {
      question:
        "Why should I list my business if I'm already getting customers?",
      answer:
        "Even if you have a steady customer base, listing on Solar Vipani significantly increases your online visibility, helping you reach even more potential customers who are actively searching for solar installation services. It's an additional channel that complements your existing marketing efforts.",
    },
  ];

  const stats = [
    { number: "450+", label: "Businesses Listed" },
    { number: "5,000+", label: "Cities & Towns" },
  ];
</script>

<script>
  import { isDarkMode } from "$lib/themeStore.svelte";
  import { goto } from "$app/navigation";
  import AboutSolarVipani from "$lib/in-new-rewrites/AboutSolarVipani.svelte";

  // For data loading
  let { data } = $props();

  // Reactive statement for dark mode
  let darkMode = $derived($isDarkMode);

  // Navigation function
  const navigateToBusinessForm = () => goto("/in/business-form");
</script>

<svelte:head>
  <!-- Meta Pixel Code - Deferred for Performance -->
  <script>
    // Defer Facebook Pixel until after user interaction or 3 seconds
    function loadFacebookPixel() {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );
      fbq("init", "1226087962095221");
      fbq("track", "PageView");
    }

    // Load on user interaction or after 3 seconds
    let pixelLoaded = false;
    function initPixel() {
      if (!pixelLoaded) {
        pixelLoaded = true;
        loadFacebookPixel();
      }
    }

    // Load on first user interaction
    ["mousedown", "touchstart", "keydown", "scroll"].forEach((event) => {
      document.addEventListener(event, initPixel, {
        once: true,
        passive: true,
      });
    });

    // Fallback after 3 seconds
    setTimeout(initPixel, 3000);
  </script>
  <noscript>
    <img
      height="1"
      width="1"
      style="display:none"
      src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
      alt="Facebook Pixel tracking"
    />
  </noscript>
  <!-- End Meta Pixel Code -->

  <!-- Structured Data / JSON-LD - Minified -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Solar Vipani",
      "url": "https://solarvipani.com",
      "logo": "https://solarvipani.com/images/solar-vipani-logo.png",
      "description": "India's leading solar panel installer directory connecting customers with verified solar installation services",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8983066701",
        "contactType": "customer service",
        "email": "admin@solarvipani.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": { "@type": "PostalAddress", "addressCountry": "IN" },
      "sameAs": [
        "https://www.facebook.com/solarvipani",
        "https://www.linkedin.com/company/solarvipani",
        "https://twitter.com/solarvipani"
      ]
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Solar Business Directory Listing",
      "description": "Free business listing service for solar panel installers and solar energy companies",
      "provider": { "@type": "Organization", "name": "Solar Vipani" },
      "serviceType": "Business Directory",
      "areaServed": { "@type": "Country", "name": "India" },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "description": "Free business listing for solar installers"
      }
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://solarvipani.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Business Listing",
          "item": "https://solarvipani.com/business-listing"
        }
      ]
    }
  </script>

  <title>List Your Solar Business | Solar Vipani</title>
  <meta
    name="description"
    content="Expand your solar business reach by listing on Solar Vipani. Connect with customers actively seeking solar installation services in your area."
  />
  <link rel="canonical" href="https://solarvipani.com/business-listing" />

  <!-- Preload critical hero images for faster LCP -->
  <link
    rel="preload"
    as="image"
    href="/header/header_mobile.avif"
    media="(max-width: 768px)"
    fetchpriority="high"
  />
  <link
    rel="preload"
    as="image"
    href="/header/header_desktop.avif"
    media="(min-width: 769px)"
    fetchpriority="high"
  />
  <!-- Preconnect to optimize external resources -->
  <link rel="preconnect" href="https://www.youtube.com" />
  <link rel="preconnect" href="https://connect.facebook.net" />

  <!-- Open Graph Tags -->
  <meta property="og:title" content="List Your Solar Business | Solar Vipani" />
  <meta
    property="og:description"
    content="Expand your solar business reach by listing on Solar Vipani. Connect with customers actively seeking solar installation services in your area."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://solarvipani.com/business-listing" />
  <meta
    property="og:image"
    content="https://solarvipani.com/images/solar-business-listing-og.jpg"
  />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="List Your Solar Business | Solar Vipani"
  />
  <meta
    name="twitter:description"
    content="Expand your solar business reach by listing on Solar Vipani. Connect with customers actively seeking solar installation services in your area."
  />
  <meta
    name="twitter:image"
    content="https://solarvipani.com/images/solar-business-listing-twitter.jpg"
  />
  <meta name="twitter:site" content="@solarvipani" />

  <!-- FAQ Schema - Minified -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does it cost to list my business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Listing your business is completely free of charge. We believe in providing value first and helping solar businesses grow their online presence without any upfront costs."
          }
        },
        {
          "@type": "Question",
          "name": "How do you earn money if the business listing is free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide premium marketing services to select businesses where we see growth potential. These paid services include targeted campaigns on platforms like Facebook, Instagram, Google Search, and YouTube to further boost your visibility."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I list my business if I'm already getting customers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Even if you have a steady customer base, listing on Solar Vipani significantly increases your online visibility, helping you reach even more potential customers who are actively searching for solar installation services. It's an additional channel that complements your existing marketing efforts."
          }
        }
      ]
    }
  </script>

  <!-- Additional SEO Meta Tags -->
  <meta
    name="keywords"
    content="solar business listing, solar panel installer directory, solar business registration, solar installer network, solar business growth, solar marketing"
  />
  <meta name="author" content="Solar Vipani" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<main class={`w-full transition-colors duration-300 overflow-x-hidden ${darkMode ? "bg-slate-900 text-primary-foreground" : "bg-white text-slate-900"}`}>
  <!-- Hero Banner with Solar Panel Background -->
  <div class="relative w-full h-96 md:h-96 sm:h-80 flex items-center justify-center text-center overflow-hidden">
    <picture>
      <source
        media="(max-width: 768px)"
        srcset="/header/header_mobile.avif"
        type="image/avif"
      />
      <source
        media="(min-width: 769px)"
        srcset="/header/header_desktop.avif"
        type="image/avif"
      />
      <img
        class="absolute top-0 left-0 w-full h-full object-cover object-center z-0"
        src="/header/header_mobile.avif"
        alt="Solar Panel Installation Business Growth"
        width="768"
        height="400"
        fetchpriority="high"
        decoding="sync"
      />
    </picture>
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-blue-900/70 z-10"></div>
    <div class="relative z-20 max-w-3xl px-6">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground uppercase tracking-wide">Grow Your Solar Business</h1>
      <h2 class="text-2xl md:text-3xl font-medium mb-6 text-accent drop-shadow-lg">Get Discovered on Google & ChatGPT</h2>
      <div class="my-6 p-3 md:p-3 bg-black/30 rounded-lg backdrop-blur-sm border border-white/10">
        <div class="mb-3 text-sm md:text-base leading-relaxed opacity-95">
          <strong class="text-accent drop-shadow">Join 450+ Solar Panel Installers</strong> who are listed on Solarvipani.com
        </div>
        <div class="text-sm md:text-base leading-relaxed opacity-95">
          <strong class="text-accent drop-shadow">2000+ households and businesses</strong> have started their
          solar installation journey with Solarvipani.com.
          <span class="text-yellow-300 font-semibold drop-shadow">Don't let your business miss out.</span>
        </div>
      </div>
      <p class="text-base md:text-lg mb-6 text-primary-foreground/95 opacity-95 italic drop-shadow">
        Connect directly with customers seeking solar installation services in your area
      </p>
      <button class="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary hover:opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg uppercase tracking-wider text-sm md:text-base pulse" onclick={navigateToBusinessForm}>
        <span>List My Business Now</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:translate-x-1 transition-transform"
          ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
            points="12 5 19 12 12 19"
          ></polyline></svg
        >
      </button>
    </div>
  </div>

  <div class="max-w-5xl mx-auto px-4 py-8 md:py-12">
    <!-- Value Proposition Section -->
    <section class="rounded-lg bg-card p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary text-primary">Why List Your Business with Solar Vipani?</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get discovered by customers ready to install solar panels - completely <span
            class="text-accent font-bold">FREE</span
          >
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {#each benefits as benefit}
          <div class="p-8 rounded-lg bg-white dark:bg-slate-700/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center flex flex-col items-center">
            <div class="w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary text-primary">{@html benefit.icon}</div>
            <h3 class="text-xl font-semibold mb-3 text-primary text-primary">{benefit.title}</h3>
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              {#each benefit.descriptions as description}
                <p class="mb-2">{description}</p>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="text-center mt-8">
        <button class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 hover:shadow-lg uppercase tracking-wider" onclick={navigateToBusinessForm}>
          <span>Get Started for Free</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="hover:translate-x-1 transition-transform"
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="rounded-lg bg-accent-muted p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary text-primary">Join the Solar Installer Community</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
      </div>

      <div class="flex justify-center gap-12 flex-wrap mb-8">
        {#each stats as stat}
          <div class="w-48 text-center p-6 rounded-lg bg-white dark:bg-slate-700/50 shadow-md hover:shadow-lg hover:scale-105 transition-all">
            <div class="text-5xl font-bold text-primary text-primary mb-2">{stat.number}</div>
            <div class="text-lg font-semibold text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        {/each}
      </div>

      <div class="text-center mt-8">
        <button class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 hover:shadow-lg uppercase tracking-wider" onclick={navigateToBusinessForm}>
          <span>List My Business</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="hover:translate-x-1 transition-transform"
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Recently Joined Verified Installers -->
    <section class="rounded-lg bg-slate-50 dark:bg-accent-muted/50 p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary text-primary">Recently Joined Verified Installers</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          These solar professionals recently joined our growing community
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {#if data && data.businesses && data.businesses.length > 0}
          {#each data.businesses as business}
            <a
              href={`/solar-panel-installer/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              class="no-underline text-inherit block transition-transform hover:-translate-y-1 duration-300"
            >
              <div class="relative p-6 rounded-lg bg-white dark:bg-slate-700/50 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden">
                <div class="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-success text-primary-foreground text-xs font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                    ></path><polyline points="22 4 12 14.01 9 11.01"
                    ></polyline></svg
                  >
                  <span>Verified</span>
                </div>
                <h3 class="text-lg font-semibold pr-16 text-primary text-primary">{business.businessname}</h3>
                <div class="flex flex-col gap-2 mt-auto">
                  <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      ><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      ></path><circle cx="12" cy="10" r="3"></circle></svg
                    >
                    <span>{business.city}, {business.state}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      ><path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path></svg
                    >
                    <span>{business.phonenumber}</span>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        {:else}
          <div class="no-installers">
            <p>
              No verified installers available at the moment. Be the first to
              join!
            </p>
          </div>
        {/if}
      </div>

      <div class="cta-center">
        <button class="cta-button" onclick={navigateToBusinessForm}>
          <span>Join These Businesses</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- How It Works Video Section -->
    <section class="rounded-lg bg-card p-12 md:p-16 mb-8 shadow-md text-center" id="product-working">
      <div class="section-header">
        <h2>See How It Works</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Watch this quick video to understand how Solar Vipani connects you
          with customers
        </p>
      </div>

      <div class="relative mx-auto max-w-2xl rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/8UZ-4XN8Vq8"
          title="How Solarvipani.com works"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          loading="lazy"
        >
        </iframe>
      </div>

      <div class="cta-center">
        <button class="cta-button" onclick={navigateToBusinessForm}>
          <span>Try It Now — Free</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- FAQs Section -->
    <section class="rounded-lg bg-card p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary text-primary">Frequently Asked Questions</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each faqs as faq}
          <div class="p-6 rounded-lg bg-white dark:bg-slate-700/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 class="text-lg font-semibold mb-3 text-primary text-primary">{faq.question}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="rounded-lg bg-transparent p-0 mb-8 shadow-none">
      <div class="bg-gradient-to-r from-primary to-primary text-primary-foreground p-12 md:p-16 rounded-lg shadow-lg text-center">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4">Ready to Grow Your Solar Business?</h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of solar installation companies already benefiting from
          Solar Vipani's platform
        </p>
        <button
          class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-md font-semibold hover:bg-gray-100 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg uppercase tracking-wider pulse"
          onclick={navigateToBusinessForm}
        >
          <span>List My Business Now</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="hover:translate-x-1 transition-transform"
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Need Assistance Section -->
    <section class="rounded-lg bg-card p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary text-primary">We're Here to Help</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
      </div>

      <div class="flex justify-center gap-8 flex-wrap">
        <div class="p-6 rounded-lg bg-white dark:bg-slate-700/50 shadow-sm text-center w-64 transition-transform hover:-translate-y-1">
          <div class="text-primary text-primary mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path><polyline points="22,6 12,13 2,6"></polyline></svg
            >
          </div>
          <p class="mb-2 text-gray-600 dark:text-gray-400">Email us at</p>
          <a
            href="mailto:admin@solarvipani.com"
            class="block text-lg font-semibold text-primary text-primary hover:underline transition-colors"
            rel="noopener">admin@solarvipani.com</a
          >
        </div>

        <div class="p-6 rounded-lg bg-white dark:bg-slate-700/50 shadow-sm text-center w-64 transition-transform hover:-translate-y-1">
          <div class="text-primary text-primary mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              ></path></svg
            >
          </div>
          <p class="mb-2 text-gray-600 dark:text-gray-400">Call us at</p>
          <a href="tel:+918983066701" class="block text-lg font-semibold text-primary text-primary hover:underline transition-colors" rel="noopener"
            >+91 8983066701</a
          >
        </div>
      </div>
    </section>

    <!-- About Solarvipani Section -->

    <AboutSolarVipani />
  </div>
</main>

<style>
  /* Pulse animation for CTA buttons */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 86, 179, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 86, 179, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 86, 179, 0);
    }
  }

  :global(.pulse) {
    animation: pulse 2s infinite;
  }

  /* iframe styling */
  :global(iframe) {
    width: 100%;
    height: 400px;
    display: block;
    border: none;
  }

  @media (max-width: 768px) {
    :global(iframe) {
      height: 300px;
    }
  }

  @media (max-width: 576px) {
    :global(iframe) {
      height: 220px;
    }
  }
</style>
