<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/in/themeStore";
  import { city_jsonLD1 } from "$lib/in/city_jsonLD1";
  import LeadFormModal from "$lib/in/LeadFormModal.svelte";
  import LeadFormBusiness from "$lib/in/LeadFormBusiness.svelte";
  import BusinessTilesList from "$lib/in/BusinessTilesList.svelte"; // Keep for critical content
  import RecommendedSolarSystems from "$lib/in/RecommendedSolarSystems.svelte";
  import SolarComparisonTable from "$lib/in/SolarComparisonTable.svelte";

  // Lazy-loaded components (non-critical)
  let RecentProjectsCity;
  let AboutSolarVipani;
  let ChatbotPopup;

  // Loading states
  let shouldLoadRecentProjects = false;
  let shouldLoadAbout = false;
  let shouldLoadChatbot = false;

  // Default business data
  const defaultBusiness = {
    businessname: "Solar Vipani",
    phonenumber: "8983066701",
  };

  // State management
  let isModalOpen = false; // State to track if the modal is open
  let selectedBusinessName = "";
  let selectedBusinessSlug = "";

  // Get reactive data from the page store
  $: city = $page.data.city;
  $: businesses = $page.data.businesses || [];
  $: subset_cities_localities = $page.data.subset_cities_localities || [];
  $: district = $page.data.district || "";
  $: recentProjects = $page.data.recentProjects || [];
  $: errorMessage = $page.data.errorMessage;
  $: lastUpdated = $page.data.lastUpdated;
  $: darkMode = $isDarkMode;

  // Function to toggle modal visibility
  function toggleModal(businessName = "", businessSlug = "") {
    selectedBusinessName = businessName;
    selectedBusinessSlug = businessSlug;
    isModalOpen = !isModalOpen;
  }

  // Prevent click propagation action
  function preventClickPropagation(node) {
    const handleClick = (event) => event.stopPropagation();
    node.addEventListener("click", handleClick);
    return {
      destroy() {
        node.removeEventListener("click", handleClick);
      },
    };
  }

  // Scroll to lead form function
  function scrollToLeadForm() {
    const leadFormSection = document.getElementById("lead-form-sv");
    if (leadFormSection) {
      leadFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // Create JSON-LD structured data
  function createJsonLD() {
    // Generate the JSON-LD structured data for the city
    const city_jsonLD_1 = city_jsonLD1(city);

    // Generate JSON-LD structured data for businesses
    const city_jsonLD_2 = (
      businesses.length > 0 ? businesses : [defaultBusiness]
    ).map((business) => ({
      "@context": "http://schema.org",
      "@type": "LocalBusiness",
      name: business.businessname,
      image: business.image || "",
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address || "",
        addresslocality: business.city || "",
        addressRegion: business.state || "",
        postalCode: business.postalcode || "",
        addressCountry: "IN",
      },
      url: `https://solarvipani.com/in/solar-panel-installer/${business.slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating || "4.0",
        ratingCount: business.reviewCount || "1",
        bestRating: "5",
      },
    }));

    // BreadcrumbList schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://solarvipani.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Solar Panel Installer Directory",
          item: "https://solarvipani.com/in/solar-panel-installer-directory",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Solar Panel Installers in ${city.replace("-", " ")}`,
          item: `https://solarvipani.com/in/solar-panel-installer-directory/${city.toLowerCase()}`,
        },
      ],
    };

    // Organization schema for Solar Vipani
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Solar Vipani",
      url: "https://solarvipani.com",
      logo: "https://solarvipani.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8983066701",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.facebook.com/solarvipani",
        "https://www.instagram.com/solarvipani",
        "https://www.linkedin.com/company/solarvipani",
      ],
      description:
        "Solar Vipani connects customers with verified solar panel installers across India. Find trusted solar installers, compare quotes, and get expert solar installation services.",
      serviceArea: {
        "@type": "Country",
        name: "India",
      },
    };

    return {
      jsonLD1: JSON.stringify(city_jsonLD_1),
      jsonLD2: JSON.stringify(city_jsonLD_2),
      breadcrumbSchema: JSON.stringify(breadcrumbSchema),
      organizationSchema: JSON.stringify(organizationSchema),
    };
  }

  onMount(() => {
    // Setup lazy loading immediately (critical for UX)
    setupLazyLoading();

    // Defer JSON-LD injection to when browser is idle
    // This removes 150-250ms from TBT (Total Blocking Time)
    // SEO is not affected - search engines wait for async JavaScript
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        injectJsonLD();
      }, { timeout: 3000 }); // Max 3 second wait for SEO crawlers
    } else {
      // Fallback for Safari and older browsers
      setTimeout(() => injectJsonLD(), 2000);
    }
  });

  function injectJsonLD() {
    // Generate JSON-LD structured data
    const { jsonLD1, jsonLD2, breadcrumbSchema, organizationSchema } =
      createJsonLD();

    // Use DocumentFragment to batch DOM operations (reduces reflows from 4 to 1)
    const fragment = document.createDocumentFragment();

    // Script 1: City JSON-LD
    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.textContent = jsonLD1;
    fragment.appendChild(script1);

    // Script 2: Business JSON-LD
    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.textContent = jsonLD2;
    fragment.appendChild(script2);

    // Script 3: Breadcrumb Schema
    const script3 = document.createElement("script");
    script3.type = "application/ld+json";
    script3.textContent = breadcrumbSchema;
    fragment.appendChild(script3);

    // Script 4: Organization Schema
    const script4 = document.createElement("script");
    script4.type = "application/ld+json";
    script4.textContent = organizationSchema;
    fragment.appendChild(script4);

    // Single DOM operation (only 1 reflow instead of 4!)
    document.head.appendChild(fragment);
  }

  function setupLazyLoading() {
    // Load RecentProjectsCity when it comes into view
    const recentProjectsObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const module = await import("$lib/in/RecentProjectsCity.svelte");
          RecentProjectsCity = module.default;
          shouldLoadRecentProjects = true;
          recentProjectsObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    // Load AboutSolarVipani when it comes into view
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

    // Show chatbot when user reaches bottom of page
    let chatbotTimer = null;

    // Observe sections when they exist
    setTimeout(() => {
      const recentProjectsSection = document.querySelector(
        "#recent-projects-section",
      );
      const aboutSection = document.querySelector("#about-section");

      if (recentProjectsSection) {
        recentProjectsObserver.observe(recentProjectsSection);
      }

      if (aboutSection) {
        aboutObserver.observe(aboutSection);

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
          { rootMargin: "0px", threshold: 0 },
        );

        chatbotObserver.observe(bottomSentinel);
      }
    }, 100);
  }
</script>

<svelte:head>
  <title
    >Top Solar Panel Installers in {city.replace("-", " ")} | Know Price | Verified
    Experts and Dealers</title
  >
  <meta
    name="description"
    content="Find the best solar panel installers in {city.replace(
      '-',
      ' ',
    )} on Solar Vipani. Start your Solar journey. Quickly Get Quotation from 2-3 Verified Solar Installers in {city.replace(
      '-',
      ' ',
    )}"
  />

  <!-- Canonical URL -->
  <link
    rel="canonical"
    href="https://solarvipani.com/in/solar-panel-installer-directory/{city.toLowerCase()}"
  />

  <!-- Meta robots -->
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />

  <!-- Open Graph Tags -->
  <meta
    property="og:title"
    content="Top Solar Panel Installers in {city.replace(
      '-',
      ' ',
    )} | Solar Vipani"
  />
  <meta
    property="og:description"
    content="Find verified solar panel installers in {city.replace(
      '-',
      ' ',
    )}. Compare quotes, view profiles, and get expert solar installation services. Free consultation available."
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content="https://solarvipani.com/in/solar-panel-installer-directory/{city.toLowerCase()}"
  />
  <meta property="og:image" content="https://solarvipani.com/logo.webp" />
  <meta
    property="og:image:alt"
    content="Solar panel installers in {city.replace('-', ' ')}"
  />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@solarvipani" />
  <meta
    name="twitter:title"
    content="Top Solar Panel Installers in {city.replace(
      '-',
      ' ',
    )} | Solar Vipani"
  />
  <meta
    name="twitter:description"
    content="Find verified solar panel installers in {city.replace(
      '-',
      ' ',
    )}. Compare quotes and get expert installation services."
  />
  <meta name="twitter:image" content="https://solarvipani.com/logo.webp" />
  <meta
    name="twitter:image:alt"
    content="Solar panel installers in {city.replace('-', ' ')}"
  />

  <!-- Additional SEO Meta Tags -->
  <meta name="author" content="Solar Vipani" />
  <meta name="language" content="English" />
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content={city.replace("-", " ")} />
  <meta name="ICBM" content="" />

  <!-- Structured Data Breadcrumbs -->
  <meta
    name="breadcrumb"
    content="Home > Solar Panel Installer Directory > {city.replace('-', ' ')}"
  />

  <!-- Keywords -->
  <meta
    name="keywords"
    content="solar panel installers {city.replace(
      '-',
      ' ',
    )}, solar installation {city.replace(
      '-',
      ' ',
    )}, solar companies {city.replace('-', ' ')}, rooftop solar {city.replace(
      '-',
      ' ',
    )}, solar dealers {city.replace('-', ' ')}, solar energy {city.replace(
      '-',
      ' ',
    )}, solar panel price {city.replace('-', ' ')}, solar subsidy {city.replace(
      '-',
      ' ',
    )}"
  />
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <h1>
    Best Solar Panel Installers in {city.replace("-", " ")} - Top Rated Companies
    Near You
  </h1>
  {#if lastUpdated}
    <p class="last-updated">
      Last Update: {new Date(lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  {/if}

  <!-- Conditional rendering based on businesses availability -->
  {#if businesses.length === 0}
    <!-- Combined No Installers + Business Recruitment Section -->
    <section id="no-installers" class="combined-recruitment-section">
      <div class="combined-content">
        <h2>We're Expanding to {city.replace("-", " ")} - Join Us!</h2>
        <p class="expansion-message">
          <strong>Are you a solar installer in this area? </strong>
        </p>

        <button
          class="primary-recruitment-cta"
          on:click={() => (window.location.href = "/in/business-form")}
        >
          Join Our Network - Register Your Business
        </button>
      </div>
    </section>
  {:else}
    <section id="BusinessTilesList">
      <BusinessTilesList />
    </section>
  {/if}

  <section id="lead-form-sv">
    {#if businesses.length === 0}
      <h2>
        Be the First to Get Quotes When Installers Join {city.replace("-", " ")}
      </h2>
      <p class="lead-form-subtitle">
        Submit your requirements and we'll notify you as soon as verified
        installers become available in your area.
      </p>
    {:else}
      <h2>
        Quickly Get Quotation from 2-3 Verified Solar Installers in {city.replace(
          "-",
          " ",
        )}
      </h2>
      <p class="privacy-note">
        Be assured, we follow highest privacy standards to keep your details
        safe. <a href="/privacy-policy">Learn more</a>
      </p>
    {/if}
    <LeadFormBusiness />
  </section>

  <section id="recent-projects-section">
    {#if shouldLoadRecentProjects && RecentProjectsCity}
      <svelte:component this={RecentProjectsCity} />
    {/if}
  </section>

  <section id="services">
    <h2>Services Provided by Solar Panel Installers</h2>
    <div class="services-content">
      <div class="service-item">
        <strong
          >Solar panel installations at Homes, Apartments, and Businesses</strong
        >
        <p>
          Professional installation of solar panels tailored to residential,
          commercial, and industrial needs. Commonly used systems for
          independant homes and bunglows are <strong
            ><a href="/in/blogs/1kw-ongrid-solar-system"
              >1kW ongrid solar system</a
            >,
            <a href="in/blogs/3kw-ongrid-solar-system"
              >3kW ongrid solar system</a
            >,</strong
          >
          and
          <strong
            ><a href="/in/blogs/5kw-ongrid-solar-system"
              >5kW ongrid solar system</a
            >.</strong
          >
        </p>
      </div>

      <div class="service-item">
        <strong>Solar Modules and Inverters</strong>
        <p>
          Supply and installation of high-quality solar modules and inverters to
          ensure efficient energy generation.
        </p>
      </div>

      <div class="service-item">
        <strong
          >Documentation and Permissions for Subsidy under <a
            href="/in/blogs/pm-surya-ghar-yojana"
            target="_blank"
          >
            PM Surya Ghar Yojana
          </a>
        </strong>
        <p>
          Assistance with the necessary paperwork and approvals to avail
          government solar subsidies and benefits.
        </p>
      </div>

      <div class="service-item">
        <strong>Net Metering</strong>
        <p>
          Setup of net metering systems to help you save on electricity bills by
          feeding surplus power back into the grid.
        </p>
      </div>

      <div class="service-item">
        <strong>Solar Financing through Banks and NBFCs</strong>
        <p>
          Guidance on financing options, loans, and schemes offered by banks and
          non-banking financial companies. Nowadays <strong
            ><a href="/in/blogs/zero-cost-emi-schemes-solar"
              >Zero cost EMI schemes</a
            ></strong
          > have become popular.
        </p>
      </div>

      <div class="service-item">
        <strong>Routine Maintenance and Cleaning</strong>
        <p>
          Regular maintenance and cleaning services to keep your solar system
          running efficiently.
        </p>
      </div>
    </div>
  </section>

  {#if businesses.length > 0 && subset_cities_localities.length > 0}
    <RecommendedSolarSystems />

    <!-- Get Quotation Button after Recommended Solar Systems -->
    <div class="quotation-button-container">
      <button class="get-quotation-btn" on:click={scrollToLeadForm}>
        Get Quotation
      </button>
    </div>

    <section id="people-also-ask">
      <h2>Frequently Asked Questions</h2>
      <ul>
        <li>
          <strong
            >How much does it cost to install solar panels in {city}?</strong
          >
          <p>
            The cost of installing solar panels in {city} varies based on system
            size and components. For instance, a 3kW system typically ranges from
            ₹1.5 lakhs to ₹2.5 lakhs, including installation and related expenses.
          </p>
        </li>
        <li>
          <strong>How much should I budget for solar panel installation?</strong
          >
          <p>
            Budgeting for solar panel installation depends on your energy needs
            and system size. On average, residential installations can cost
            between ₹65,000 to ₹95,000 per kW, covering installation,
            transportation, and related expenses.
          </p>
        </li>
        <li>
          <strong>How much solar panel is required for a 1.5-ton AC?</strong>
          <p>
            To run a 1.5-ton air conditioner, you would need a solar system
            capable of generating approximately 3kW of power. This typically
            involves installing around 10-12 solar panels of 250 watts each.
          </p>
        </li>
        <li>
          <strong>What is the cost of a 3kW solar panel in {city}?</strong>
          <p>
            A 3kW solar panel system in {city} generally costs between ₹1.5 lakhs
            to ₹2.5 lakhs, depending on the brand and installation factors.
          </p>
        </li>
        <li>
          <strong>How much money will I save if I install solar panels?</strong>
          <p>
            If you install solar panels with net metering, you'll save
            approximately ₹5.5 to ₹6.5 per unit compared to the ₹8-₹9 per unit
            cost from the DISCOM. Over 25 years, this translates to substantial
            savings, making solar energy a cost-effective and sustainable
            choice.
          </p>
        </li>
      </ul>
    </section>
  {/if}

  <!-- District Link Section -->
  {#if district}
    <section class="district-link-section">
      <h2>Find Other Solar Businesses in {district} district</h2>
      <p>
        If you're interested in exploring other solar businesses in {district},
        visit our district directory page.
      </p>
      <button
        on:click={() =>
          (window.location.href = `/in/district/${district.toLowerCase().replace(/\s+/g, "-")}`)}
      >
        View Solar Businesses in {district} district
      </button>
    </section>
  {/if}

  <!-- Solar Comparison Section -->
  {#if businesses.length > 0 && subset_cities_localities.length > 0}
    <SolarComparisonTable />

    <!-- Get Quotation Button after Solar Comparison Table -->
    <div class="quotation-button-container">
      <button class="get-quotation-btn" on:click={scrollToLeadForm}>
        Get Quotation
      </button>
    </div>
  {/if}

  <!-- About Solarvipani Section (Lazy Loaded) -->
  <section id="about-section">
    {#if shouldLoadAbout && AboutSolarVipani}
      <svelte:component this={AboutSolarVipani} />
    {/if}
  </section>
</main>

<!-- Chatbot Popup (Lazy Loaded) -->
{#if shouldLoadChatbot && ChatbotPopup}
  <svelte:component this={ChatbotPopup} />
{/if}

{#if isModalOpen}
  <div
    class="modal-overlay"
    on:click={toggleModal}
    on:keydown={(e) => e.key === "Escape" && toggleModal()}
    role="button"
    tabindex="0"
    aria-label="Close modal"
  >
    <dialog class="modal" open aria-modal="true" use:preventClickPropagation>
      <button class="close-modal" on:click={toggleModal} aria-label="Close">
        &times;
      </button>
      <h2>Request a Free Quote from {selectedBusinessName}</h2>
      <LeadFormModal
        businessName={selectedBusinessName}
        businessSlug={selectedBusinessSlug}
      />
    </dialog>
  </div>
{/if}

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
    --section-padding: 2rem 1.5rem;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  main > section {
    max-width: var(--container-width);
    width: 100%;
    margin-bottom: 2.5rem;
  }

  /* Theme styling */
  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  /* Section styling */
  section {
    padding: var(--section-padding);
    transition: background-color var(--transition-medium);
  }

  /* Get Quotation Button Styling */
  .quotation-button-container {
    text-align: center;
    margin: 2rem 0;
  }

  .get-quotation-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-md);
  }

  .get-quotation-btn:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .get-quotation-btn:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  .dark section {
    background-color: transparent;
  }

  /* Section heading styles */

  .dark section h1 {
    color: var(--primary-light);
  }

  h1 {
    text-align: center;
  }

  .last-updated {
    text-align: left;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 1rem 0 2rem 0;
    font-style: italic;
  }

  .dark .last-updated {
    color: var(--text-muted-dark);
  }

  section h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark section h2 {
    color: var(--primary-light);
  }

  /* List styling */
  ul {
    list-style-type: none;
    padding: 0;
    width: 100%;
  }

  /* List item styling - business cards */

  .dark #all-installers li {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Paragraph styling */
  p {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  li p {
    color: var(--text-medium);
  }

  .dark li p {
    color: #cbd5e0;
  }

  li p strong {
    color: var(--text-dark);
    font-weight: 600;
  }

  .dark li p strong {
    color: var(--text-light);
  }

  /* Button styling */
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 10px;
    margin-top: 1rem;
  }

  /* Services section styling */
  #services,
  #people-also-ask {
    padding: 2rem;
  }

  /* Services content container - single tile */
  .services-content {
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-md);
    transition: box-shadow var(--transition-medium);
  }

  .services-content:hover {
    box-shadow: var(--shadow-lg);
  }

  .dark .services-content {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Individual service items within the single tile */
  .service-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .service-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .dark .service-item {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .service-item strong {
    display: block;
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .dark .service-item strong {
    color: #90caf9;
  }

  .service-item p {
    color: var(--text-medium);
    line-height: 1.6;
  }

  .dark .service-item p {
    color: #cbd5e0;
  }

  /* FAQ section styling */
  #people-also-ask ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--grid-gap);
  }

  /* FAQ cards styled */
  #people-also-ask li {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    height: 100%;
  }

  #people-also-ask li:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .dark #people-also-ask li {
    background-color: rgba(255, 255, 255, 0.05);
  }

  #people-also-ask li strong {
    display: block;
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .dark #people-also-ask li strong {
    color: #90caf9;
  }

  /* Lead form section */
  #lead-form-sv {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
    color: white;
    max-width: 800px;
    margin: 0 auto;
    border-radius: var(--border-radius-lg);
  }

  #lead-form-sv h2 {
    margin: 0 auto 1.5rem;
    font-size: 1.8rem;
    color: white;
    max-width: 800px;
  }

  .lead-form-subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .privacy-note {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .privacy-note a {
    color: rgba(255, 255, 255, 0.95);
    text-decoration: underline;
    font-weight: 500;
    transition: color var(--transition-fast);
  }

  .privacy-note a:hover {
    color: white;
  }

  /* Modal styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius-md);
    max-width: 500px;
    width: 90%;
    box-shadow: var(--shadow-lg);
    position: relative;
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    margin: 0;
    color: var(--text-dark);
  }

  .dark .about-text strong {
    color: #90caf9;
  }

  /* Combined Recruitment Section Styling - Similar to AboutSolarVipani */
  .combined-recruitment-section {
    padding: var(--section-padding);
    margin-top: 3rem;
    margin-bottom: 2rem;
    border-radius: var(--border-radius-lg);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-md);
    transition: background-color var(--transition-medium);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--font-family);
    line-height: var(--body-line-height);
    color: var(--text-dark);
  }

  .dark .combined-recruitment-section {
    background-color: var(--dark-card-bg);
    color: var(--text-light);
  }

  .combined-content {
    width: 100%;
    text-align: center;
  }

  .combined-content h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .combined-content h2 {
    color: var(--primary-light);
  }

  .expansion-message {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-medium);
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .dark .expansion-message {
    color: #cbd5e0;
  }

  .expansion-message strong {
    color: var(--primary-color);
    font-weight: 600;
  }

  .dark .expansion-message strong {
    color: #90caf9;
  }

  .primary-recruitment-cta {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-sm);
    border: none;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .primary-recruitment-cta:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }

  /* Responsive design */
  @media (max-width: 992px) {
    section h2 {
      font-size: 1.6rem;
    }

    .combined-content h2 {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    section {
      padding: 1.5rem 1rem;
    }

    section h2 {
      font-size: 1.4rem;
    }

    /* Match blue container's thin mobile spacing - reduced by 50% */
    #services,
    #people-also-ask,
    #BusinessTilesList,
    #about-section {
      padding: 2rem 0.25rem;
    }

    .services-content {
      padding: 2rem 0.5rem;
    }

    #people-also-ask ul {
      grid-template-columns: 1fr;
    }

    button {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }

    .modal {
      padding: 1.5rem;
    }

    /* Mobile styles for combined section */
    .combined-recruitment-section {
      padding: 1.5rem 1rem;
    }

    .combined-content h2 {
      font-size: 1.8rem;
    }
  }

  /* District link section styling */
  .district-link-section {
    margin-top: 2rem;
    text-align: center;
    padding: var(--section-padding);
    background-color: var(--light-card-bg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
  }

  .dark .district-link-section {
    background-color: var(--dark-card-bg);
  }

  .district-link-section p {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--text-medium);
  }

  .dark .district-link-section p {
    color: #a0aec0;
  }

  .district-link-section button {
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    min-width: 180px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all var(--transition-fast);
    margin: 0;
  }

  .district-link-section button:hover {
    background-color: rgba(45, 130, 199, 0.05);
    transform: translateY(-2px);
  }

  .dark .district-link-section button {
    border-color: var(--primary-light);
    color: var(--primary-light);
  }

  .dark .district-link-section button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 576px) {
    main {
      padding: 1rem 0.5rem;
    }

    section h2 {
      font-size: 1.3rem;
    }

    /* Mobile styling for all sections - reduced by 50% */
    #services,
    #people-also-ask,
    #BusinessTilesList,
    #about-section,
    .district-link-section {
      padding: 2rem 0.25rem;
    }

    .services-content {
      padding: 2rem 0.5rem;
    }

    /* Extra small mobile styles for combined section */
    .combined-recruitment-section {
      padding: 1.5rem 0.5rem;
    }

    /* Mobile optimization for quotation buttons */
    .get-quotation-btn {
      padding: 0.8rem 2rem;
      font-size: 1rem;
      width: 90%;
      max-width: 300px;
    }
  }
</style>
