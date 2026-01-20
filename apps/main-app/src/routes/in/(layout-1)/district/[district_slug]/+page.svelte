<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  // Get reactive data from the page store using derived
  const district = $derived($page.data.district);
  const cities = $derived($page.data.cities || []);
  const errorMessage = $derived($page.data.errorMessage);

  // Function to format city name for URL
  function formatCitySlug(city) {
    return encodeURIComponent(city.toLowerCase());
  }
</script>

<svelte:head>
  <title
    >Solar Panel Installers in {district} - Find installers by city - Solar Vipani</title
  >
  <meta
    name="description"
    content="Find the best solar panel installers in {district}. Browse by city to find top solar companies in your area."
  />
</svelte:head>

<main class="flex flex-col items-center justify-start w-full min-h-screen px-4 py-8 overflow-x-hidden transition-colors duration-300 lg:px-4 lg:py-12 md:px-2 md:py-6 sm:px-2 sm:py-4">
  <div class="w-full max-w-4xl">
    <h1 class="mb-4 text-3xl font-semibold text-center text-primary lg:text-2xl md:text-2xl sm:text-xl">
      Solar Panel Installers in {district}
    </h1>

    {#if errorMessage}
      <div class="p-4 mb-6 border border-destructive rounded-lg bg-destructive/10 text-destructive dark:bg-destructive/15" role="alert">
        <p>{errorMessage}</p>
      </div>
    {:else if cities.length === 0}
      <div class="p-4 mb-6 border border-warning rounded-lg bg-warning/10 text-warning dark:bg-warning/15" role="alert">
        <p>No cities found in {district}.</p>
      </div>
    {:else}
      <p class="mb-8 text-center text-base text-text-secondary lg:text-lg">
        Browse solar panel installers in {district} by city. We have listings in {cities.length}
        cities.
      </p>

      <ul class="grid w-full gap-6 mb-8 auto-fit-minmax-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {#each cities as city}
          <li>
            <a
              href={`/in/solar-panel-installer-directory/${formatCitySlug(city)}`}
              rel="noopener"
              class="block h-full p-6 text-decoration-none border border-border/30 rounded-2xl shadow-md bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <h2 class="mb-2 text-xl font-semibold text-left text-primary lg:text-lg">
                {city}
              </h2>
              <p class="mb-4 text-sm text-text-secondary">
                Find solar installers in {city}
              </p>
              <div class="flex items-center text-sm font-medium text-primary transition-colors duration-200">
                <span>View installers</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</main>
