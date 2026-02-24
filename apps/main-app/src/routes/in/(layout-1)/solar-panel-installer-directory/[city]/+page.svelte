<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { generateCityJsonLD } from "$lib/in/jsonLD";
  import { generateFAQ } from "$lib/in/faqData";
  import { services } from "$lib/in/servicesData";
  import LeadFormSection from "$lib/in-new-rewrites/LeadFormSection.svelte";
  import QuoteModal from "$lib/in-new-rewrites/QuoteModal.svelte";
  import BusinessTilesList from "$lib/in-new-rewrites/BusinessTilesList.svelte";
  import RecommendedSolarSystems from "$lib/in-new-rewrites/RecommendedSolarSystems.svelte";
  import SolarComparisonTable from "$lib/in-new-rewrites/SolarComparisonTable.svelte";
  import RecentProjectsCity from "$lib/in-new-rewrites/RecentProjectsCity.svelte";
  import SubsidySection from "$lib/in-new-rewrites/SubsidySection.svelte";

  // Lazy-loaded components (non-critical)
  let AboutSolarVipani = $state();
  let ChatbotPopup = $state();

  // Loading states
  let shouldLoadAbout = $state(false);
  let shouldLoadChatbot = $state(false);

  // Modal state
  let isModalOpen = $state(false);
  let selectedBusinessName = $state("");
  let selectedBusinessSlug = $state("");

  // Get reactive data from the page store using derived
  const city = $derived($page.data.city);
  const businesses = $derived($page.data.businesses || []);
  const subset_cities_localities = $derived($page.data.subset_cities_localities || []);
  const district = $derived($page.data.district || "");
  const postalCode = $derived($page.data.postalCode);
  const lastUpdated = $derived($page.data.lastUpdated);

  const jsonLD = $derived(generateCityJsonLD(city, businesses, postalCode));

  // Derived FAQ list for current city
  const faqList = $derived(generateFAQ(city));

  const cityName = $derived(city.replace("-", " "));
  const hasInstallers = $derived(businesses.length > 0);

  function toggleModal(businessName = "", businessSlug = "") {
    selectedBusinessName = businessName;
    selectedBusinessSlug = businessSlug;
    isModalOpen = !isModalOpen;
  }

  function scrollToLeadForm() {
    const leadFormSection = document.getElementById("lead-form-sv");
    if (leadFormSection) {
      leadFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  onMount(() => {
    setupLazyLoading();
  });

  function setupLazyLoading() {
    const aboutObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const module = await import("$lib/in-new-rewrites/AboutSolarVipani.svelte");
          AboutSolarVipani = module.default;
          shouldLoadAbout = true;
          aboutObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    let chatbotTimer = null;

    setTimeout(() => {
      const aboutSection = document.querySelector("#about-section");

      if (aboutSection) {
        aboutObserver.observe(aboutSection);

        const bottomSentinel = document.createElement('div');
        bottomSentinel.style.position = 'absolute';
        bottomSentinel.style.bottom = '0';
        bottomSentinel.style.height = '1px';
        bottomSentinel.style.width = '100%';
        bottomSentinel.style.pointerEvents = 'none';
        aboutSection.style.position = 'relative';
        aboutSection.appendChild(bottomSentinel);

        const chatbotObserver = new IntersectionObserver(
          async (entries) => {
            if (entries[0].isIntersecting) {
              if (!chatbotTimer) {
                chatbotTimer = setTimeout(async () => {
                  if (!ChatbotPopup) {
                    const module = await import("$lib/in-new-rewrites/ChatbotPopup.svelte");
                    ChatbotPopup = module.default;
                  }
                  shouldLoadChatbot = true;
                }, 1000);
              }
            } else {
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
  <title>{hasInstallers ? `Top Solar Panel Installers in ${cityName} | Know Price | Verified Experts and Dealers` : `Solar Panel Installation in ${cityName} | Solar Vipani`}</title>
  <meta
    name="description"
    content={hasInstallers
      ? `Find the best solar panel installers in ${cityName} on Solar Vipani. Start your Solar journey. Quickly Get Quotation from 2-3 Verified Solar Installers in ${cityName}`
      : `Explore solar panel installation options in ${cityName}. Register your interest and get connected with verified solar installers as they join our network.`}
  />

  <!-- Canonical URL -->
  <link
    rel="canonical"
    href="https://solarvipani.com/in/solar-panel-installer-directory/{city.toLowerCase()}"
  />

  <!-- Meta robots -->
  <meta name="robots" content={hasInstallers ? "index, follow" : "noindex, follow"} />
  <meta name="googlebot" content={hasInstallers ? "index, follow" : "noindex, follow"} />

  <!-- Open Graph Tags -->
  <meta
    property="og:title"
    content={hasInstallers ? `Top Solar Panel Installers in ${cityName} | Solar Vipani` : `Solar Panel Installation in ${cityName} | Solar Vipani`}
  />
  <meta
    property="og:description"
    content={hasInstallers
      ? `Find verified solar panel installers in ${cityName}. Compare quotes, view profiles, and get expert solar installation services. Free consultation available.`
      : `Explore solar panel installation options in ${cityName}. Register your interest and get connected with verified solar installers.`}
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content="https://solarvipani.com/in/solar-panel-installer-directory/{city.toLowerCase()}"
  />
  <meta property="og:image" content="https://solarvipani.com/logo.webp" />
  <meta
    property="og:image:alt"
    content="Solar panel installers in {cityName}"
  />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@solarvipani" />
  <meta
    name="twitter:title"
    content={hasInstallers ? `Top Solar Panel Installers in ${cityName} | Solar Vipani` : `Solar Panel Installation in ${cityName} | Solar Vipani`}
  />
  <meta
    name="twitter:description"
    content={hasInstallers
      ? `Find verified solar panel installers in ${cityName}. Compare quotes and get expert installation services.`
      : `Explore solar panel installation options in ${cityName}. Register your interest and get connected with verified solar installers.`}
  />
  <meta name="twitter:image" content="https://solarvipani.com/logo.webp" />
  <meta
    name="twitter:image:alt"
    content="Solar panel installers in {cityName}"
  />

  <!-- Additional SEO Meta Tags -->
  <meta name="author" content="Solar Vipani" />
  <meta name="language" content="English" />
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content={cityName} />
  <meta name="ICBM" content="" />

  <!-- Structured Data Breadcrumbs -->
  <meta
    name="breadcrumb"
    content="Home > Solar Panel Installer Directory > {cityName}"
  />

  <!-- Keywords -->
  <meta
    name="keywords"
    content="solar panel installers {cityName}, solar installation {cityName}, solar companies {cityName}, rooftop solar {cityName}, solar dealers {cityName}, solar energy {cityName}, solar panel price {cityName}, solar subsidy {cityName}"
  />

  <!-- Structured Data (SSR) -->
  {#if jsonLD.jsonLD1}
    {@html `<script type="application/ld+json">${jsonLD.jsonLD1}</script>`}
  {/if}
  {#if jsonLD.jsonLD2}
    {@html `<script type="application/ld+json">${jsonLD.jsonLD2}</script>`}
  {/if}
  {@html `<script type="application/ld+json">${jsonLD.breadcrumbSchema}</script>`}
  {@html `<script type="application/ld+json">${jsonLD.organizationSchema}</script>`}
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="text-center mb-[theme(--spacing-2xl)]">
      <h1 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">{hasInstallers ? `Top Rated Solar Panel Installers in ${cityName}` : `Solar Panel Installation in ${cityName}`}</h1>
      {#if lastUpdated}
        <p class="text-sm text-muted-foreground mt-[theme(--spacing-lg)] italic">
          Last Update: {new Date(lastUpdated).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      {/if}
    </div>

    {#if businesses.length === 0}
      <Card class="mb-10 mt-12 flex flex-col items-center">
      <div class="w-full text-center">
        <h2 class="text-3xl font-semibold mb-4 text-primary">We're Expanding to {cityName} - Join Us!</h2>
        <p class="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl mx-auto">
          <strong>Are you a solar installer in this area? </strong>
        </p>
        <Button class="font-semibold text-lg px-8 py-4 uppercase tracking-wider whitespace-normal" onclick={() => (window.location.href = "/in/business-form")}>
          Join Our Network - Register Your Business
        </Button>
      </div>
    </Card>
    {:else}
      <BusinessTilesList />
    {/if}

    <LeadFormSection city={cityName} hasBusinesses={businesses.length > 0} />

    <RecentProjectsCity />

    <section id="services" class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Services Provided by Solar Panel Installers</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      {#each services as service (service.title)}
        <div class="mb-6 pb-6 border-b border-border last:mb-0 last:pb-0 last:border-b-0">
          <strong class="block text-lg font-semibold text-primary mb-2">{service.title}</strong>
          <p class="text-foreground dark:text-foreground-secondary leading-relaxed">
            {service.description}
            {#if service.links}
              {#each service.links as link, i}
                {#if i === 0}
                  <strong><a href={link.href} class="text-primary hover:text-primary-hover dark:hover:text-primary transition-colors">{link.text}</a></strong>
                {:else}
                  , <strong><a href={link.href} class="text-primary hover:text-primary-hover dark:hover:text-primary transition-colors">{link.text}</a></strong>
                {/if}
              {/each}.
            {/if}
          </p>
        </div>
      {/each}
    </section>

    {#if businesses.length > 0 && subset_cities_localities.length > 0}
      <SubsidySection city={cityName} onGetQuote={scrollToLeadForm} />

      <RecommendedSolarSystems />

      <!-- Get Quotation Button after Recommended Solar Systems -->
      <div class="text-center mb-8">
        <Button class="font-semibold text-lg px-10 py-4 uppercase tracking-wide" onclick={scrollToLeadForm}>
          Get Quotation
        </Button>
      </div>

      <section id="people-also-ask" class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
        <div class="text-center mb-[theme(--spacing-2xl)]">
          <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Frequently Asked Questions</h2>
          <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-[theme(--card-gap)]">
          {#each faqList as faq (faq.question)}
            <div class="mb-6 pb-6 border-b border-border last:mb-0 last:pb-0 last:border-b-0">
              <strong class="block text-lg font-semibold text-primary mb-2">{faq.question}</strong>
              <p class="text-foreground dark:text-foreground-secondary text-sm">{faq.answer}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if district}
      <section class="mb-8 rounded-[theme(--radius-lg)] bg-[hsl(var(--accent)/0.1)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
        <div class="text-center mb-[theme(--spacing-2xl)]">
          <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Find Other Solar Businesses in {district} District</h2>
          <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
          <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">If you're interested in exploring other solar businesses in {district}, visit our district directory page.</p>
        </div>
        <div class="text-center">
          <Button
            variant="outline"
            class="font-semibold px-[theme(--button-padding-x-default)] py-[theme(--button-padding-y-default)] transition-all hover:-translate-y-[theme(--hover-lift-sm)] uppercase tracking-wider"
            onclick={() =>
              (window.location.href = `/in/district/${district.toLowerCase().replace(/\s+/g, "-")}`)}
          >
            View Solar Businesses in {district} District
          </Button>
        </div>
      </section>
    {/if}

    <!-- Solar Comparison Section -->
    {#if businesses.length > 0 && subset_cities_localities.length > 0}
      <SolarComparisonTable />

      <!-- Get Quotation Button after Solar Comparison Table -->
      <div class="text-center mb-8">
        <Button class="font-semibold text-lg px-[theme(--button-padding-x-lg)] py-[theme(--button-padding-y-default)] transition-all hover:-translate-y-[theme(--hover-lift-sm)] shadow-[theme(--shadow-md)] hover:shadow-[theme(--shadow-lg)] uppercase tracking-wide" onclick={scrollToLeadForm}>
          Get Quotation
        </Button>
      </div>
    {/if}

    <!-- About Solarvipani Section (Lazy Loaded) -->
    <div id="about-section">
      {#if shouldLoadAbout && AboutSolarVipani}
        {@render AboutSolarVipani()}
      {/if}
    </div>
  </div>
</main>

{#if shouldLoadChatbot && ChatbotPopup}
  {@render ChatbotPopup()}
{/if}

<QuoteModal
  {isModalOpen}
  businessName={selectedBusinessName}
  businessSlug={selectedBusinessSlug}
  onClose={() => toggleModal()}
/>

