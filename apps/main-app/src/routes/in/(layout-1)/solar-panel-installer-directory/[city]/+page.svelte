<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/themeStore.svelte";
  import { generateCityJsonLD, injectJsonLDScripts } from "$lib/in/jsonLD";
  import { generateFAQ } from "$lib/in/faqData";
  import { services } from "$lib/in/servicesData";
  import LeadFormSection from "$lib/in/LeadFormSection.svelte";
  import QuoteModal from "$lib/in/QuoteModal.svelte";
  import BusinessTilesList from "$lib/in-new-rewrites/BusinessTilesList.svelte";
  import RecommendedSolarSystems from "$lib/in-new-rewrites/RecommendedSolarSystems.svelte";
  import SolarComparisonTable from "$lib/in-new-rewrites/SolarComparisonTable.svelte";

  // Lazy-loaded components (non-critical)
  let RecentProjectsCity = $state();
  let AboutSolarVipani = $state();
  let ChatbotPopup = $state();

  // Loading states
  let shouldLoadRecentProjects = $state(false);
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
  const lastUpdated = $derived($page.data.lastUpdated);
  const darkMode = $derived($isDarkMode);

  // Derived FAQ list for current city
  const faqList = $derived(generateFAQ(city));

  const cityName = $derived(city.replace("-", " "));

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

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        injectJsonLD();
      }, { timeout: 3000 });
    } else {
      setTimeout(() => injectJsonLD(), 2000);
    }
  });

  function injectJsonLD() {
    const jsonLDData = generateCityJsonLD(city, businesses, district);
    injectJsonLDScripts(jsonLDData);
  }

  function setupLazyLoading() {
    const recentProjectsObserver = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const module = await import("$lib/in-new-rewrites/RecentProjectsCity.svelte");
          RecentProjectsCity = module.default;
          shouldLoadRecentProjects = true;
          recentProjectsObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

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
      const recentProjectsSection = document.querySelector("#recent-projects-section");
      const aboutSection = document.querySelector("#about-section");

      if (recentProjectsSection) {
        recentProjectsObserver.observe(recentProjectsSection);
      }

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
  <title>Top Solar Panel Installers in {cityName} | Know Price | Verified Experts and Dealers</title>
  <meta
    name="description"
    content="Find the best solar panel installers in {cityName} on Solar Vipani. Start your Solar journey. Quickly Get Quotation from 2-3 Verified Solar Installers in {cityName}"
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
    content="Top Solar Panel Installers in {cityName} | Solar Vipani"
  />
  <meta
    property="og:description"
    content="Find verified solar panel installers in {cityName}. Compare quotes, view profiles, and get expert solar installation services. Free consultation available."
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
    content="Top Solar Panel Installers in {cityName} | Solar Vipani"
  />
  <meta
    name="twitter:description"
    content="Find verified solar panel installers in {cityName}. Compare quotes and get expert installation services."
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
</svelte:head>

<main class={`w-full flex flex-col items-center p-4 md:p-8 min-h-screen overflow-x-hidden transition-colors duration-300 ${darkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
  <h1 class="text-center text-2xl md:text-3xl font-bold mb-4 w-full max-w-4xl">Best Solar Panel Installers in {cityName} - Top Rated Companies Near You</h1>
  {#if lastUpdated}
    <p class="text-left text-sm text-slate-500 dark:text-slate-400 mb-8 italic">
      Last Update: {new Date(lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  {/if}

  {#if businesses.length === 0}
    <section id="no-installers" class="w-full max-w-4xl mb-10 mt-12 p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-md dark:shadow-lg flex flex-col items-center">
      <div class="w-full text-center">
        <h2 class="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-300">We're Expanding to {cityName} - Join Us!</h2>
        <p class="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          <strong>Are you a solar installer in this area? </strong>
        </p>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded transition-transform -translate-y-0 hover:-translate-y-1 uppercase tracking-wider"
          onclick={() => (window.location.href = "/in/business-form")}
        >
          Join Our Network - Register Your Business
        </button>
      </div>
    </section>
  {:else}
    <section id="BusinessTilesList" class="w-full max-w-4xl mb-10">
      <BusinessTilesList />
    </section>
  {/if}

  <LeadFormSection city={cityName} hasBusinesses={businesses.length > 0} />

  <section id="recent-projects-section" class="w-full max-w-4xl mb-10">
    {#if shouldLoadRecentProjects && RecentProjectsCity}
      {@render RecentProjectsCity()}
    {/if}
  </section>

  <section id="services" class="w-full max-w-4xl mb-10 p-8">
    <h2 class="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-300">Services Provided by Solar Panel Installers</h2>
    <div class="p-8 rounded-2xl bg-white dark:bg-slate-800/10 dark:border dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow">
      {#each services as service (service.title)}
        <div class="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700 last:mb-0 last:pb-0 last:border-b-0">
          <strong class="block text-xl text-blue-600 dark:text-blue-400 mb-2">{service.title}</strong>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {service.description}
            {#if service.links}
              {#each service.links as link, i}
                {#if i === 0}
                  <strong><a href={link.href} class="text-blue-600 dark:text-blue-400 hover:underline">{link.text}</a></strong>
                {:else}
                  , <strong><a href={link.href} class="text-blue-600 dark:text-blue-400 hover:underline">{link.text}</a></strong>
                {/if}
              {/each}.
            {/if}
          </p>
        </div>
      {/each}
    </div>
  </section>

  {#if businesses.length > 0 && subset_cities_localities.length > 0}
    <RecommendedSolarSystems />

    <!-- Get Quotation Button after Recommended Solar Systems -->
    <div class="text-center my-8">
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-lg transition-all hover:-translate-y-1 shadow-md hover:shadow-lg uppercase tracking-wide" onclick={scrollToLeadForm}>
        Get Quotation
      </button>
    </div>

    <section id="people-also-ask" class="w-full max-w-4xl mb-10 p-8">
      <h2 class="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-300">Frequently Asked Questions</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {#each faqList as faq (faq.question)}
          <li class="p-6 rounded-lg bg-white dark:bg-slate-800/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <strong class="block text-xl text-blue-600 dark:text-blue-400 mb-2">{faq.question}</strong>
            <p class="text-slate-600 dark:text-slate-300">{faq.answer}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if district}
    <section class="w-full max-w-4xl mb-10 mt-8 text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md">
      <h2 class="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-300">Find Other Solar Businesses in {district} district</h2>
      <p class="text-slate-600 dark:text-slate-300 mb-6">If you're interested in exploring other solar businesses in {district}, visit our district directory page.</p>
      <button
        class="border-2 border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 font-semibold px-6 py-3 rounded-lg transition-all hover:-translate-y-1 min-w-max"
        onclick={() =>
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
    <div class="text-center my-8">
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-lg transition-all hover:-translate-y-1 shadow-md hover:shadow-lg uppercase tracking-wide" onclick={scrollToLeadForm}>
        Get Quotation
      </button>
    </div>
  {/if}

  <!-- About Solarvipani Section (Lazy Loaded) -->
  <section id="about-section" class="w-full max-w-4xl mb-10">
    {#if shouldLoadAbout && AboutSolarVipani}
      {@render AboutSolarVipani()}
    {/if}
  </section>
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

