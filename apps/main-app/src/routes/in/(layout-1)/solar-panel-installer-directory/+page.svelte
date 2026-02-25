<script>
  import { Button } from "$lib/components/ui/button";

  let { data } = $props();

  let state = "";
  let district = "";
  let city = "";
  let districts = [];
  let cities = [];

  function getInstallerCount(stateName) {
    const key = stateName.toLowerCase();
    return data.installerCounts?.[key] || 0;
  }

  // Updated list of states
  const states = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Fetch districts dynamically when the state changes
  $effect(() => {
    if (state) {
      updateDistricts(state);
    }
  });

  // Fetch cities dynamically when the district changes
  $effect(() => {
    if (district) {
      updateCities(district);
    }
  });

  async function updateDistricts(selectedState) {
    try {
      // Send POST request to fetch districts for the selected state
      const res = await fetch("/in/api/getDistricts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: selectedState }),
      });
      const data = await res.json();
      districts = data.districts || [];
      district = ""; // Reset district when state changes
      city = ""; // Reset city when state changes
      cities = []; // Clear cities list
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }

  async function updateCities(selectedDistrict) {
    try {
      // Send POST request to fetch cities for the selected district
      const res = await fetch("/in/api/getCities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district: selectedDistrict }),
      });
      const data = await res.json();
      cities = data.cities || [];
      city = ""; // Reset city when district changes
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  // Separate active states (with installers) from coming-soon states
  let activeStates = $derived(states.filter((s) => getInstallerCount(s) > 0));
  let comingSoonStates = $derived(states.filter((s) => getInstallerCount(s) === 0));

  // Function to format state name for URL
  function formatStateSlug(state) {
    return `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, "-")}`;
  }

  // Build ItemList structured data for SEO
  let totalInstallers = $derived(Object.values(data.installerCounts || {}).reduce((a, b) => a + b, 0));

  let structuredData = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Solar Panel Installer Directory - India",
    "description": "Solar Vipani's directory connects you with verified solar panel installers across various states, districts, and cities in India.",
    "url": "https://solarvipani.com/in/solar-panel-installer-directory",
    "numberOfItems": activeStates.length,
    "itemListElement": activeStates.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `Solar Panel Installers in ${s}`,
      "url": `https://solarvipani.com/in/state/${formatStateSlug(s)}`,
      "description": `${getInstallerCount(s)} verified solar panel installers in ${s}`
    }))
  }));
</script>

<svelte:head>
  <title
    >Solar Panel Installer Directory | Find Trusted Local Installers - Solar
    Vipani</title
  >
  <meta
    name="description"
    content="Find trusted local solar panel installers with Solar Vipani's directory. Select your state, district, and city to connect with verified experts for hassle-free installations."
  />
  <!-- Structured data for SEO -->
  {@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-[theme(--transition-default)] overflow-x-hidden dark:bg-background dark:text-foreground">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Solar Panel Installers by State Section -->
    <section class="mb-[theme(--spacing-2xl)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Where Can You Find Verified Solar Panel Installers in India?</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Browse solar panel installers by state. We have {Object.values(data.installerCounts || {}).reduce((a, b) => a + b, 0)} verified installers across {activeStates.length}
          states in India.
        </p>
      </div>

      <!-- Active States with Verified Installers -->
      {#if activeStates.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)]">
          {#each activeStates as state}
            <div class="flex flex-col h-full bg-card rounded-[theme(--radius-lg)] border border-border hover:shadow-[theme(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-[theme(--spacing-lg)]">
              <h3 class="text-lg font-semibold mb-[theme(--spacing-sm)] text-primary">
                {state}
              </h3>
              <p class="text-sm text-muted-foreground mb-[theme(--spacing-lg)]">
                {getInstallerCount(state)} Verified {getInstallerCount(state) === 1 ? 'Installer' : 'Installers'}
              </p>

              <div class="flex items-center justify-center font-medium text-primary mt-auto gap-[theme(--spacing-xs)] group">
                <Button asChild variant="default" class="w-full">
                  <a href={`/in/state/${formatStateSlug(state)}`} rel="noopener" class="flex items-center justify-center gap-2">
                    <span>Find Installers</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Coming Soon States -->
      {#if comingSoonStates.length > 0}
        <div class="mt-[theme(--spacing-2xl)]">
          <h3 class="text-xl font-semibold mb-[theme(--spacing-sm)] text-muted-foreground">Expanding Soon</h3>
          <p class="text-sm text-muted-foreground mb-[theme(--spacing-lg)]">We're working on bringing verified installers to these states.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)]">
            {#each comingSoonStates as state}
              <div class="flex flex-col h-full bg-card rounded-[theme(--radius-lg)] border border-border/50 p-[theme(--spacing-lg)] opacity-75">
                <h3 class="text-lg font-semibold mb-[theme(--spacing-sm)] text-primary">
                  {state}
                </h3>
                <p class="text-sm text-muted-foreground mb-[theme(--spacing-lg)]">
                  Coming Soon
                </p>

                <div class="flex items-center justify-center font-medium text-primary mt-auto gap-[theme(--spacing-xs)] group">
                  <Button asChild variant="outline" class="w-full">
                    <a href={`/in/state/${formatStateSlug(state)}`} rel="noopener" class="flex items-center justify-center gap-2">
                      <span>View State</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </section>
  </div>
</main>

