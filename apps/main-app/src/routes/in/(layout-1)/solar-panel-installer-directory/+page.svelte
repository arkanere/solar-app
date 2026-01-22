<script>
  let state = "";
  let district = "";
  let city = "";
  let districts = [];
  let cities = [];

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

  // Use the global theme store

  // Function to format state name for URL
  function formatStateSlug(state) {
    return `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, "-")}`;
  }
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
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Solar Panel Installer Directory",
      "description": "Solar Vipani's directory connects you with verified solar panel installers across various states, districts, and cities, offering a hassle-free way to compare services and make informed decisions.",
      "url": "https://solarvipani.com/in/solar-panel-installer-directory",
      "publisher": {
        "@type": "Organization",
        "name": "Solar Vipani"
      }
    }
  </script>
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-[theme(--transition-default)] overflow-x-hidden dark:bg-background dark:text-foreground">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Hero Section -->
    <section class="rounded-[theme(--radius-xl)] bg-primary text-primary-foreground p-[theme(--card-padding-y)] mb-[theme(--spacing-2xl)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h1 class="text-[theme(--font-size-4xl)] font-bold mb-[theme(--spacing-lg)] text-primary-foreground leading-tight">Solar Panel Installer Directory</h1>
        <div class="flex justify-center items-center my-[theme(--spacing-md)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded-full"></span>
        </div>
        <p class="text-[theme(--font-size-lg)] text-primary-foreground/90 max-w-2xl mx-auto">
          Find trusted local solar installers across India
        </p>
      </div>
    </section>

    <!-- Solar Panel Installers by State Section -->
    <section class="rounded-[theme(--radius-xl)] bg-card p-[theme(--card-padding-y)] mb-[theme(--spacing-2xl)] shadow-[theme(--shadow-md)]">
      <div class="text-center mb-[theme(--spacing-2xl)]">
        <h2 class="text-[theme(--font-size-3xl)] font-semibold mb-[theme(--spacing-lg)] text-primary">Solar Panel Installers by State</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-md)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded-full"></span>
        </div>
        <p class="text-[theme(--font-size-base)] text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Browse solar panel installers by state. We have listings in {states.length}
          states across India.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)]">
        {#each states as state}
          <div class="h-full transition-transform duration-[theme(--transition-default)] hover:-translate-y-2">
            <a href={`/in/state/${formatStateSlug(state)}`} class="flex flex-col h-full p-[theme(--spacing-lg)] rounded-[theme(--radius-lg)] bg-background border border-border hover:border-primary hover:shadow-[theme(--shadow-lg)] transition-all duration-[theme(--transition-default)] no-underline text-foreground dark:text-foreground">
              <h3 class="text-[theme(--font-size-xl)] font-semibold mb-[theme(--spacing-sm)] text-center text-primary">{state}</h3>
              <p class="text-[theme(--font-size-sm)] text-foreground dark:text-foreground-secondary text-center flex-grow mb-[theme(--spacing-md)]">Find verified solar installers in {state}</p>
              <div class="flex items-center justify-center font-medium text-primary mt-auto gap-[theme(--spacing-xs)] group">
                <span>View Districts</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-[theme(--icon-size-md)] h-[theme(--icon-size-md)] transition-transform duration-[theme(--transition-fast)] group-hover:translate-x-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </a>
          </div>
        {/each}
      </div>
    </section>
  </div>
</main>

