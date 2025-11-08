<script>
  import { onMount } from "svelte";
  import BusinessDirectory from "$lib/in/BusinessDirectory.svelte";
  import RecentProjectsHome from "$lib/in/RecentProjectsHome.svelte";
  import LeadFormBusiness from "$lib/in/LeadFormBusiness.svelte";
  import SolarComparisonTable from "$lib/in/SolarComparisonTable.svelte";
  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Receive data from server
  export let data;

  // Initialize dark mode state
  let darkMode;
  let AboutSolarVipani;
  let ChatbotPopup;
  let shouldLoadAbout = false;
  let shouldLoadChatbot = false;

  // Extract recent projects from data
  $: recentProjects = data?.recentProjects || [];

  // Use the global theme store
  $: darkMode = $isDarkMode;

  // Lazy load non-critical components after initial page load
  onMount(async () => {
    // Load AboutSolarVipani component (bottom of page) with intersection observer
    const aboutObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const module = await import("$lib/in/AboutSolarVipani.svelte");
          AboutSolarVipani = module.default;
          shouldLoadAbout = true;
          aboutObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    // Show chatbot popup when user reaches bottom of page
    let chatbotTimer = null;
    const chatbotObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          // About section is 100% visible (user at bottom) - wait 1 second then show chatbot
          if (!chatbotTimer) {
            chatbotTimer = setTimeout(async () => {
              if (!ChatbotPopup) {
                const module = await import("$lib/in/ChatbotPopup.svelte");
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
      { rootMargin: "0px", threshold: 1.0 },
    );

    const aboutSection = document.querySelector("#about-section");
    if (aboutSection) {
      aboutObserver.observe(aboutSection);
      chatbotObserver.observe(aboutSection);
    }
  });
</script>

<svelte:head>
  <title
    >Solar Vipani | India's #1 Solar Services Aggregator | Quickly Get Solar
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
    content="Connect with 450+ verified solar installers across India. Get up to ₹78,000 government subsidy. Save up to 95% on electricity bills. Free consultation & quotes."
  />
  <meta property="og:image" content="https://solarvipani.com/logo512.png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:url" content="https://solarvipani.com" />
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
  <link rel="canonical" href="https://solarvipani.com" />

  <!-- Preload critical hero images for faster LCP -->
  <link
    rel="preload"
    as="image"
    href="/header/header_desktop.avif"
    media="(min-width: 769px)"
    fetchpriority="high"
  />
  <link
    rel="preload"
    as="image"
    href="/header/header_mobile.avif"
    media="(max-width: 768px)"
    fetchpriority="high"
  />

  <!-- Preconnect to external domains for faster resource loading -->
  <link rel="preconnect" href="https://res.cloudinary.com" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
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
      }
    }
  </script>

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Solar Vipani",
      "url": "https://solarvipani.com",
      "description": "Find verified solar panel installers across India",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://solarvipani.com/solar-panel-installer-directory?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
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

<main class={darkMode ? "dark" : "light"}>
  <!-- Hero Banner Section -->
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
        src="/header/header_desktop.avif"
        alt="Solar Panel Installation in India"
        width="1920"
        height="600"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
    <div class="overlay"></div>
    <div class="hero-content">
      <h1>
        Get 2-3 Free Quotes from Verified Installers in Your Area
      </h1>
      <h2>
        Compare prices and save 50-80% on electricity bills with PM Surya Ghar Yojana subsidies.
      </h2>
      <p class="hero-social-proof">
        2,000+ homeowners have begun their switch to solar through our platform.
      </p>
      <div class="hero-features">
        <span>✓ 450+ Pre-Vetted Installers</span>
        <span>✓ Zero Cost Consultation</span>
        <span>✓ Full Subsidy Guidance</span>
      </div>
    </div>
  </div>

  <div class="content">
    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="section-header">
        <h2>Why Now is the Right Time to Install Solar in India</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Take advantage of record subsidies, rising electricity costs, and our network of verified installers
        </p>
      </div>

      <div class="benefits-grid">
        <div class="benefit-card highlight-card">
          <div class="benefit-icon">
            <span class="icon-emoji">💰</span>
          </div>
          <div class="benefit-stat">Up to ₹78,000</div>
          <h3>Government Subsidy</h3>
          <p>
            Get up to ₹78,000 in direct subsidy under PM Surya Ghar Yojana - available for limited time
          </p>
        </div>

        <div class="benefit-card highlight-card">
          <div class="benefit-icon">
            <span class="icon-emoji">🏦</span>
          </div>
          <div class="benefit-stat">0% Interest</div>
          <h3>Easy Financing Options</h3>
          <p>Zero-cost EMI and attractive loan schemes from leading banks and NBFCs make solar affordable</p>
        </div>

        <div class="benefit-card highlight-card">
          <div class="benefit-icon">
            <span class="icon-emoji">⚡</span>
          </div>
          <div class="benefit-stat">50-80%</div>
          <h3>Electricity Bill Savings</h3>
          <p>
            Save up to 80% on rising electricity costs with net metering and reduce dependency on the grid
          </p>
        </div>
      </div>
    </section>

    <!-- Solar Comparison Section -->
    <SolarComparisonTable />

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-header">
        <h2>How Solar Vipani Works</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Fill the Inquiry Form</h3>
          <p>
            Share your basic details and energy requirements to help us understand your needs.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Connect with Experts</h3>
          <p>
            Reach out to vetted, local solar providers who understand your
            unique needs.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Receive Competitive Quotes</h3>
          <p>
            Review quotes from 2-3 solar companies, comparing costs,
            equipment, and terms to find the perfect match.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h3>Make an Informed Choice</h3>
          <p>
            Select a provider with complete confidence, backed by transparent,
            verified information.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">5</div>
          <h3>Share Your Success</h3>
          <p>
            Join our community of solar adopters by sharing your experience,
            helping others on their journey to clean energy.
          </p>
        </div>
      </div>
    </section>

    <!-- Lead Form Section -->
    <section id="lead-form-sv" class="lead-form-section">
      <div class="form-card">
        <div class="section-header">
          <h2>Book A Free Consultation</h2>
          <div class="section-divider">
            <span class="divider-accent"></span>
          </div>
          <p class="section-subtitle">
            Get personalized solar recommendations from our experts
          </p>
        </div>
        <LeadFormBusiness />
      </div>
    </section>
    <!-- Business Directory Section -->
    <section class="directory-section">
      <div class="section-header">
        <h2>Solar Panel Installer Directory</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Find verified solar installers in your area
        </p>
      </div>
      <BusinessDirectory />
    </section>

    <!-- Blogs Section -->
    <section class="blogs-section">
      <div class="section-header">
        <h2>Latest Solar Insights</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Stay informed with expert advice and industry updates
        </p>
      </div>

      <div class="blogs-grid">
        <div class="blog-card">
          <div class="blog-content">
            <h3>
              <a
                href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
                >Why Hiring a Verified Solar Installer in India Is Essential</a
              >
            </h3>
            <p>
              Learn about the importance of professional workmanship, safety
              compliance, maximizing system efficiency, and ensuring long-term
              support.
            </p>
            <a
              href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
              class="read-more">Read More →</a
            >
          </div>
        </div>

        <div class="blog-card">
          <div class="blog-content">
            <h3>
              <a href="/in/blogs/pm-surya-ghar-yojana"
                >PM Surya Ghar Yojana: Your Guide to Check Eligibility</a
              >
            </h3>
            <p>
              Understand the eligibility criteria and steps to benefit from the
              government scheme providing subsidies for solar rooftop
              installations.
            </p>
            <a href="/in/blogs/pm-surya-ghar-yojana" class="read-more"
              >Read More →</a
            >
          </div>
        </div>

        <div class="blog-card">
          <div class="blog-content">
            <h3>
              <a href="/in/blogs/cost-of-solar-on-grid-system"
                >What is the Approximate Cost of a Solar On Grid System?</a
              >
            </h3>
            <p>
              Learn about the costs associated with installing a solar on-grid
              system, including equipment, labor, and other components.
            </p>
            <a href="/in/blogs/cost-of-solar-on-grid-system" class="read-more"
              >Read More →</a
            >
          </div>
        </div>
      </div>

      <div class="blogs-cta">
        <a href="/in/blogs" class="view-all-blogs">View All Blogs</a>
      </div>
    </section>

    <!-- Recent Projects Section -->
    <RecentProjectsHome projects={recentProjects} />

    <!-- About Section (Lazy Loaded) -->
    <div id="about-section">
      {#if shouldLoadAbout && AboutSolarVipani}
        <svelte:component this={AboutSolarVipani} />
      {/if}
    </div>
  </div>
</main>

<!-- Chatbot Popup (Lazy Loaded) -->
{#if shouldLoadChatbot && ChatbotPopup}
  <svelte:component this={ChatbotPopup} />
{/if}

<style>
  /* Root variables using custom properties from business page */
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

  /* Mobile content optimization */
  @media (max-width: 768px) {
    .content {
      padding: 0.5rem;
    }
  }

  @media (max-width: 576px) {
    .content {
      padding: 0.25rem;
    }

    /* Optimize section paddings for mobile */
    section {
      padding: 2rem 0.5rem !important;
    }

    .form-card {
      margin: 0 0.25rem;
      padding: 2rem 1rem !important;
    }
  }

  /* Hero Banner */
  .hero-banner {
    position: relative;
    height: 600px;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
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
    margin-bottom: 1.5rem;
    letter-spacing: 0.5px;
    line-height: 1.3;
  }

  .hero-content h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--accent-color);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    line-height: 1.5;
  }

  .hero-content p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    opacity: 0.9;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .hero-social-proof {
    font-size: 1rem !important;
    margin-bottom: 1.5rem !important;
    opacity: 0.95 !important;
    font-weight: 500;
    color: var(--accent-color) !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    font-style: italic;
    line-height: 1.5 !important;
  }

  .hero-features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .hero-features span {
    background: rgba(255, 255, 255, 0.15);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.95rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
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

  /* Benefits Section */
  .benefits-section {
    background-color: var(--primary-light);
  }

  .dark .benefits-section {
    background-color: rgba(0, 86, 179, 0.15);
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--grid-gap);
    margin-bottom: 2rem;
  }

  .benefit-card {
    padding: 2rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-md);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .benefit-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }

  .dark .benefit-card {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .highlight-card {
    border-top: 4px solid var(--accent-color);
  }

  .benefit-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border-radius: 50%;
    background-color: var(--primary-light);
    position: relative;
  }

  .dark .benefit-icon {
    background-color: rgba(0, 86, 179, 0.2);
  }

  .icon-emoji {
    font-size: 2.5rem;
    display: block;
  }

  .benefit-stat {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .dark .benefit-stat {
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

  .benefit-card p {
    font-size: 1rem;
    color: var(--text-medium);
    text-align: center;
  }

  .dark .benefit-card p {
    color: #cbd5e0;
  }

  /* How It Works Section */
  .how-it-works-section {
    background-color: var(--light-card-bg);
  }

  .dark .how-it-works-section {
    background-color: var(--dark-card-bg);
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--grid-gap);
  }

  .step-card {
    padding: 2rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-bg-color);
    border: 1px solid #e2e8f0;
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    text-align: center;
    position: relative;
  }

  .step-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .dark .step-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: #4a5568;
  }

  .step-number {
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 auto 1rem;
  }

  .step-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .step-card h3 {
    color: var(--primary-light);
  }

  .step-card p {
    color: var(--text-medium);
    line-height: 1.6;
    margin: 0;
  }

  .dark .step-card p {
    color: #a0aec0;
  }

  /* Directory Section */
  .directory-section {
    background-color: #f8f9fa;
  }

  .dark .directory-section {
    background-color: rgba(0, 86, 179, 0.05);
  }

  /* Lead Form Section */
  .lead-form-section {
    padding: 0;
    box-shadow: none;
    background-color: transparent;
  }

  .form-card {
    background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
    color: white;
    padding: 3rem 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 800px;
    margin: 0 auto;
  }

  .form-card .section-header h2 {
    color: white;
  }

  .form-card .section-subtitle {
    color: rgba(255, 255, 255, 0.9);
  }

  .form-card .divider-accent {
    background: var(--accent-color);
  }

  /* Blogs Section */
  .blogs-section {
    background-color: var(--light-card-bg);
  }

  .dark .blogs-section {
    background-color: var(--dark-card-bg);
  }

  .blogs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--grid-gap);
    margin-bottom: 2rem;
  }

  .blog-card {
    padding: 2rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-bg-color);
    border: 1px solid #e2e8f0;
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium),
      border-color var(--transition-medium);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .blog-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  .dark .blog-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: #4a5568;
  }

  .dark .blog-card:hover {
    border-color: var(--primary-light);
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .blog-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .blog-card h3 a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .blog-card h3 a:hover {
    color: var(--primary-hover);
  }

  .dark .blog-card h3 a {
    color: var(--primary-light);
  }

  .dark .blog-card h3 a:hover {
    color: #90caf9;
  }

  .blog-card p {
    color: var(--text-medium);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .dark .blog-card p {
    color: #a0aec0;
  }

  .read-more {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color var(--transition-fast);
    margin-top: auto;
  }

  .read-more:hover {
    color: var(--primary-hover);
  }

  .dark .read-more {
    color: var(--primary-light);
  }

  .dark .read-more:hover {
    color: #90caf9;
  }

  .blogs-cta {
    text-align: center;
    margin-top: 2rem;
  }

  .view-all-blogs {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    transition:
      background-color var(--transition-medium),
      transform var(--transition-fast);
  }

  .view-all-blogs:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }

  /* Responsive Styling */
  @media (max-width: 992px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }

    .hero-content h2 {
      font-size: 1.5rem;
    }

    .section-header h2 {
      font-size: 2rem;
    }

    .benefits-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .blogs-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .hero-banner {
      height: 500px;
      background-position: center center;
    }

    .hero-content {
      padding: 0 0.5rem;
    }

    .hero-content h1 {
      font-size: 1.8rem;
      line-height: 1.15;
    }

    .hero-content h2 {
      font-size: 1.2rem;
      line-height: 1.25;
    }

    .hero-content p {
      font-size: 0.95rem;
      line-height: 1.4;
      margin-bottom: 0.8rem;
    }

    .hero-social-proof {
      font-size: 0.9rem !important;
      margin-bottom: 0.8rem !important;
    }

    .section-header h2 {
      font-size: 1.8rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }

    .benefit-stat {
      font-size: 2rem;
    }

    .benefits-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .benefit-card {
      padding: 1.5rem 0.5rem;
    }

    .blogs-grid {
      grid-template-columns: 1fr;
    }

    .blog-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .hero-banner {
      height: 450px;
      min-height: 450px;
    }

    .hero-content {
      padding: 0 0.25rem;
    }

    .hero-content h1 {
      font-size: 1.4rem;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .hero-content h2 {
      font-size: 1rem;
      line-height: 1.2;
      margin-bottom: 0.6rem;
    }

    .hero-content p {
      font-size: 0.85rem;
      line-height: 1.3;
      margin-bottom: 0.6rem;
    }

    .hero-social-proof {
      font-size: 0.8rem !important;
      margin-bottom: 0.6rem !important;
    }

    .hero-features {
      gap: 0.8rem;
      margin-top: 0.8rem;
    }

    .hero-features span {
      font-size: 0.75rem;
      padding: 0.35rem 0.7rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
    }

    .benefit-stat {
      font-size: 1.8rem;
    }

    .icon-emoji {
      font-size: 2rem;
    }

    .benefit-icon {
      width: 60px;
      height: 60px;
    }
  }
</style>
