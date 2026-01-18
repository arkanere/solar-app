<script>
  import { isDarkMode } from "$lib/themeStore.svelte"; // Import the dark mode store
  import { goto } from "$app/navigation";
  import BusinessDirectory from "$lib/in-new-rewrites/BusinessDirectory.svelte";

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
  let darkMode = $derived($isDarkMode);

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

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground">
  <div class="mx-auto max-w-[1140px] p-4">
    <!-- Hero Section -->
    <section class="rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">Solar Panel Installer Directory</h1>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Find trusted local solar installers across India
        </p>
      </div>
    </section>

    <!-- Solar Panel Installers by State Section -->
    <section class="rounded-2xl bg-card dark:bg-card p-12 md:p-16 mb-8 shadow-md">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary dark:text-blue-300">Solar Panel Installers by State</h2>
        <div class="flex justify-center items-center my-4">
          <span class="w-20 h-1 bg-accent rounded"></span>
        </div>
        <p class="text-base md:text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
          Browse solar panel installers by state. We have listings in {states.length}
          states across India.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each states as state}
          <div class="h-full transition-transform duration-300 hover:-translate-y-2">
            <a href={`/in/state/${formatStateSlug(state)}`} class="flex flex-col h-full p-6 rounded-lg bg-background dark:bg-slate-800/50 border border-border dark:border-slate-600 hover:border-primary dark:hover:border-blue-300 hover:shadow-lg transition-all no-underline text-foreground dark:text-foreground">
              <h3 class="text-xl font-semibold mb-2 text-center text-primary dark:text-blue-300">{state}</h3>
              <p class="text-base text-foreground dark:text-foreground-secondary text-center flex-grow mb-4">Find verified solar installers in {state}</p>
              <div class="flex items-center justify-center font-medium text-primary dark:text-blue-300 mt-auto gap-2 group">
                <span>View Districts</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
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

