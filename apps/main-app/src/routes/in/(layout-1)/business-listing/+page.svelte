<script context="module">
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
  import { isDarkMode } from "$lib/themeStore";
  import { goto } from "$app/navigation";
  import AboutSolarVipani from "$lib/AboutSolarVipani.svelte";

  // For data loading
  export let data;

  // Reactive statement for dark mode
  $: darkMode = $isDarkMode;

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

<main class={darkMode ? "dark" : "light"}>
  <!-- Hero Banner with Solar Panel Background -->
  <div class="hero-banner">
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
        class="hero-image"
        src="/header/header_mobile.avif"
        alt="Solar Panel Installation Business Growth"
        width="768"
        height="400"
        fetchpriority="high"
        decoding="sync"
      />
    </picture>
    <div class="overlay"></div>
    <div class="hero-content">
      <h1>GROW YOUR SOLAR BUSINESS</h1>
      <h2>Get Discovered on Google & ChatGPT</h2>
      <div class="hero-stats">
        <div class="stat-item">
          <strong>Join 450+ Solar Panel Installers</strong> who are listed on Solarvipani.com
        </div>
        <div class="stat-item">
          <strong>2000+ households and businesses</strong> have started their
          solar installation journey with Solarvipani.com.
          <span class="highlight-text">Don't let your business miss out.</span>
        </div>
      </div>
      <p>
        Connect directly with customers seeking solar installation services in
        your area
      </p>
      <button class="cta-button pulse" on:click={navigateToBusinessForm}>
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
          ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
            points="12 5 19 12 12 19"
          ></polyline></svg
        >
      </button>
    </div>
  </div>

  <div class="content">
    <!-- Value Proposition Section -->
    <section class="value-proposition">
      <div class="section-header">
        <h2>Why List Your Business with Solar Vipani?</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Get discovered by customers ready to install solar panels - completely <span
            class="highlight">FREE</span
          >
        </p>
      </div>

      <div class="benefits-grid">
        {#each benefits as benefit}
          <div class="benefit-card">
            <div class="benefit-icon">{@html benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <div class="benefit-description">
              {#each benefit.descriptions as description}
                <p>{description}</p>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="cta-center">
        <button class="cta-button" on:click={navigateToBusinessForm}>
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
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof">
      <div class="section-header">
        <h2>Join the Solar Installer Community</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>

      <div class="stats-container">
        {#each stats as stat}
          <div class="stat-card">
            <div class="stat-number">{stat.number}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>

      <div class="cta-center">
        <button class="cta-button" on:click={navigateToBusinessForm}>
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
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Recently Joined Verified Installers -->
    <section class="recent-installers">
      <div class="section-header">
        <h2>Recently Joined Verified Installers</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          These solar professionals recently joined our growing community
        </p>
      </div>

      <div class="installer-grid">
        {#if data && data.businesses && data.businesses.length > 0}
          {#each data.businesses as business}
            <a
              href={`/solar-panel-installer/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              class="installer-card-link"
            >
              <div class="installer-card">
                <div class="installer-badge">
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
                <h3>{business.businessname}</h3>
                <div class="installer-details">
                  <div class="installer-location">
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
                  <div class="installer-phone">
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
        <button class="cta-button" on:click={navigateToBusinessForm}>
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
    <section id="product-working">
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

      <div class="video-container">
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
        <button class="cta-button" on:click={navigateToBusinessForm}>
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
    <section class="faqs">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>

      <div class="faq-grid">
        {#each faqs as faq}
          <div class="faq-card">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="final-cta">
      <div class="cta-card">
        <h2>Ready to Grow Your Solar Business?</h2>
        <p>
          Join thousands of solar installation companies already benefiting from
          Solar Vipani's platform
        </p>
        <button
          class="cta-button large pulse"
          on:click={navigateToBusinessForm}
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
            ><line x1="5" y1="12" x2="19" y2="12"></line><polyline
              points="12 5 19 12 12 19"
            ></polyline></svg
          >
        </button>
      </div>
    </section>

    <!-- Need Assistance Section -->
    <section class="assistance">
      <div class="section-header">
        <h2>We're Here to Help</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>

      <div class="contact-container">
        <div class="contact-card">
          <div class="contact-icon">
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
          <p>Email us at</p>
          <a
            href="mailto:admin@solarvipani.com"
            class="contact-link"
            rel="noopener">admin@solarvipani.com</a
          >
        </div>

        <div class="contact-card">
          <div class="contact-icon">
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
          <p>Call us at</p>
          <a href="tel:+918983066701" class="contact-link" rel="noopener"
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
  /* Root variables using custom properties */
  :root {
    /* Colors */
    --primary-color: #0056b3;
    --primary-hover: #004494;
    --primary-light: #e6f0ff;
    --secondary-color: #4caf50;
    --accent-color: #ffc107;

    /* Text colors */
    --text-dark: #2c3e50;
    --text-medium: #546e7a;
    --text-light: #ecf0f1;

    /* Theme colors */
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a202c;
    --light-card-bg: #ffffff;
    --dark-card-bg: #2d3748;

    /* UI elements */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

    /* Typography */
    --font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
    --heading-line-height: 1.2;
    --body-line-height: 1.6;

    /* Layout */
    --section-padding: 4rem 1.5rem;
    --container-width: 1140px;
    --grid-gap: 1.5rem;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  /* Base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  main {
    width: 100%;
    font-family: var(--font-family);
    line-height: var(--body-line-height);
    overflow-x: hidden;
    transition:
      background-color var(--transition-medium),
      color var(--transition-medium);
  }

  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  /* Content container */
  .content {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 1rem;
  }

  /* Hero Banner */
  .hero-banner {
    position: relative;
    height: 400px;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    contain: layout style paint;
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
    will-change: transform;
    transform: translateZ(0);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 56, 146, 0.7));
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 0 1.5rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .hero-content h2 {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--accent-color);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.3);
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-block;
  }

  .hero-content p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  /* Hero Statistics Styling */
  .hero-stats {
    margin: 1rem 0;
    padding: 0.8rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-item {
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
    line-height: 1.4;
    opacity: 0.95;
  }

  .stat-item:last-child {
    margin-bottom: 0;
  }

  .stat-item strong {
    color: var(--accent-color);
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .highlight-text {
    color: #ffd700;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  }

  /* Section styling */
  section {
    padding: var(--section-padding);
    margin-bottom: 2rem;
    border-radius: var(--border-radius-lg);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-md);
    transition: background-color var(--transition-medium);
  }

  .dark section {
    background-color: var(--dark-card-bg);
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .section-header h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .section-header h2 {
    color: var(--primary-light);
  }

  .section-divider {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem auto;
  }

  .divider-accent {
    width: 80px;
    height: 4px;
    background: var(--accent-color);
    border-radius: 2px;
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: var(--text-medium);
    max-width: 700px;
    margin: 0 auto;
  }

  .dark .section-subtitle {
    color: #a0aec0;
  }

  .highlight {
    color: var(--accent-color);
    font-weight: 700;
  }

  /* Benefits Grid */
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--grid-gap);
    margin-bottom: 2rem;
    contain: layout;
  }

  .benefit-card {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .dark .benefit-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .benefit-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: var(--primary-color);
  }

  .dark .benefit-icon {
    background-color: rgba(0, 86, 179, 0.2);
    color: #90caf9;
  }

  .benefit-card h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .benefit-card h3 {
    color: #90caf9;
  }

  .benefit-description p {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    color: var(--text-medium);
  }

  .dark .benefit-description p {
    color: #cbd5e0;
  }

  /* Social Proof */
  .social-proof {
    background-color: var(--primary-light);
  }

  .dark .social-proof {
    background-color: rgba(0, 86, 179, 0.15);
  }

  .stats-container {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .stat-card {
    width: 200px;
    text-align: center;
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: var(--shadow-md);
    transition: transform var(--transition-medium);
  }

  .stat-card:hover {
    transform: scale(1.05);
  }

  .dark .stat-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .dark .stat-number {
    color: #90caf9;
  }

  .stat-label {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-medium);
  }

  .dark .stat-label {
    color: #cbd5e0;
  }

  /* Recent Installers Section */

  /* Add these styles to your existing stylesheet */
  .installer-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform var(--transition-medium);
  }

  .installer-card-link:hover {
    transform: translateY(-5px);
  }

  .installer-card-link:hover .installer-card {
    box-shadow: var(--shadow-lg);
  }

  /* Make sure installer cards don't have their own hover transform now */
  .installer-card {
    position: relative;
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition-medium);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .recent-installers {
    background-color: #f8f9fa;
  }

  .dark .recent-installers {
    background-color: rgba(0, 86, 179, 0.05);
  }

  .installer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--grid-gap);
    margin-bottom: 2rem;
    contain: layout;
  }

  .installer-card {
    position: relative;
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dark .installer-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .installer-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 8px;
    border-radius: 16px;
    background-color: var(--secondary-color);
    color: white;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .installer-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
    padding-right: 70px; /* Make room for badge */
  }

  .dark .installer-card h3 {
    color: #90caf9;
  }

  .installer-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
  }

  .installer-location,
  .installer-phone {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-medium);
    font-size: 0.9rem;
  }

  .dark .installer-location,
  .dark .installer-phone {
    color: #cbd5e0;
  }

  .no-installers {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    background-color: rgba(0, 86, 179, 0.05);
    border-radius: var(--border-radius-md);
  }

  .dark .no-installers {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .no-installers p {
    font-size: 1.1rem;
    color: var(--text-medium);
  }

  .dark .no-installers p {
    color: #cbd5e0;
  }

  /* Video Section */
  #product-working {
    text-align: center;
  }

  .video-container {
    position: relative;
    margin: 0 auto;
    max-width: 700px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  iframe {
    width: 100%;
    height: 400px;
    display: block;
    border: none;
  }

  /* FAQs Section */
  .faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--grid-gap);
    contain: layout;
  }

  .faq-card {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
  }

  .faq-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }

  .dark .faq-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .faq-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .faq-card h3 {
    color: #90caf9;
  }

  .faq-card p {
    font-size: 1rem;
    color: var(--text-medium);
  }

  .dark .faq-card p {
    color: #cbd5e0;
  }

  /* Final CTA Section */
  .final-cta {
    padding: 0;
    box-shadow: none;
    background-color: transparent;
  }

  .cta-card {
    background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
    color: white;
    padding: 3rem 2rem;
    border-radius: var(--border-radius-lg);
    text-align: center;
    box-shadow: var(--shadow-lg);
  }

  .cta-card h2 {
    font-size: 2.2rem;
    margin-bottom: 1rem;
    color: white;
  }

  .cta-card p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Contact Information */
  .contact-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .contact-card {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: var(--shadow-sm);
    text-align: center;
    width: 250px;
    transition: transform var(--transition-medium);
  }

  .contact-card:hover {
    transform: translateY(-5px);
  }

  .dark .contact-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .contact-icon {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .contact-icon {
    color: #90caf9;
  }

  .contact-card p {
    margin-bottom: 0.5rem;
    color: var(--text-medium);
  }

  .dark .contact-card p {
    color: #cbd5e0;
  }

  .contact-link {
    display: block;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .contact-link:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }

  .dark .contact-link {
    color: #90caf9;
  }

  .dark .contact-link:hover {
    color: #64b5f6;
  }

  .dark .about-text p {
    color: #cbd5e0;
  }

  /* CTA Button Styling */
  .cta-center {
    text-align: center;
    margin-top: 2rem;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cta-button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-3px);
  }

  .cta-button.large {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }

  .cta-button svg {
    transition: transform var(--transition-fast);
  }

  .cta-button:hover svg {
    transform: translateX(4px);
  }

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

  .pulse {
    animation: pulse 2s infinite;
  }

  /* Responsive Styling */
  @media (max-width: 992px) {
    .hero-content h1 {
      font-size: 2rem;
    }

    .hero-content h2 {
      font-size: 1.2rem;
    }

    .section-header h2 {
      font-size: 2rem;
    }

    .contact-container {
      gap: 1rem;
    }

    .contact-card {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 768px) {
    .hero-banner {
      height: 350px;
    }

    .hero-content h1 {
      font-size: 1.7rem;
    }

    .hero-content h2 {
      font-size: 1.1rem;
    }

    .hero-content p {
      font-size: 0.9rem;
    }

    .hero-stats {
      margin: 0.8rem 0;
      padding: 0.6rem;
    }

    .stat-item {
      font-size: 0.85rem;
      margin-bottom: 0.6rem;
    }

    .section-header h2 {
      font-size: 1.8rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }

    .stats-container {
      gap: 1rem;
    }

    .stat-card {
      width: 150px;
    }

    .stat-number {
      font-size: 2.5rem;
    }

    iframe {
      height: 300px;
    }

    .cta-card h2 {
      font-size: 1.8rem;
    }

    .cta-card p {
      font-size: 1rem;
    }
  }

  @media (max-width: 576px) {
    .hero-banner {
      height: 300px;
    }

    .hero-content h1 {
      font-size: 1.4rem;
    }

    .hero-content h2 {
      font-size: 1rem;
    }

    .hero-stats {
      margin: 0.6rem 0;
      padding: 0.5rem;
    }

    .stat-item {
      font-size: 0.8rem;
      margin-bottom: 0.6rem;
    }

    .section-header h2 {
      font-size: 1.4rem;
    }

    .benefits-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .stats-container {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .stat-card {
      width: 100%;
      max-width: 200px;
      padding: 1rem;
    }

    iframe {
      height: 220px;
    }

    .faq-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .installer-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
