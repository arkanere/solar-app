<script>
  import { page } from "$app/stores";
  import { Alert } from "$lib/components/ui/alert";

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

<main class="flex flex-col items-center justify-start w-full min-h-screen px-[theme(--container-padding)] py-[theme(--spacing-lg)] overflow-x-hidden transition-colors duration-300 lg:py-[theme(--spacing-3xl)] md:py-[theme(--spacing-xl)] sm:py-[theme(--spacing-md)]">
  <div class="w-full max-w-4xl">
    <h1 class="mb-[theme(--spacing-md)] text-[theme(--font-size-3xl)] font-semibold text-center text-primary lg:text-[theme(--font-size-2xl)] md:text-[theme(--font-size-2xl)] sm:text-[theme(--font-size-xl)]">
      Solar Panel Installers in {district}
    </h1>

    {#if errorMessage}
      <Alert variant="destructive" class="mb-[theme(--spacing-xl)]">
        <p>{errorMessage}</p>
      </Alert>
    {:else if cities.length === 0}
      <Alert variant="warning" class="mb-[theme(--spacing-xl)]">
        <p>No cities found in {district}.</p>
      </Alert>
    {:else}
      <p class="mb-[theme(--spacing-2xl)] text-center text-[theme(--font-size-base)] text-foreground-secondary lg:text-[theme(--font-size-lg)]">
        Browse solar panel installers in {district} by city. We have listings in {cities.length}
        cities.
      </p>

      <ul class="grid w-full gap-[theme(--card-gap)] mb-[theme(--spacing-2xl)] auto-fit-minmax-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {#each cities as city}
          <li>
            <a
              href={`/in/solar-panel-installer-directory/${formatCitySlug(city)}`}
              rel="noopener"
              class="block h-full p-[theme(--card-padding-y)] text-decoration-none border border-border/30 rounded-[theme(--radius-xl)] shadow-[theme(--shadow-card)] bg-card hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[2px] transition-all duration-[theme(--transition-default)]"
            >
              <h2 class="mb-[theme(--spacing-sm)] text-[theme(--font-size-xl)] font-semibold text-left text-primary lg:text-[theme(--font-size-lg)]">
                {city}
              </h2>
              <p class="mb-[theme(--spacing-md)] text-[theme(--font-size-sm)] text-foreground-secondary">
                Find solar installers in {city}
              </p>
              <div class="flex items-center text-[theme(--font-size-sm)] font-medium text-primary transition-colors duration-[theme(--transition-default)]">
                <span>View installers</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 ml-2 transition-transform duration-[theme(--transition-default)] group-hover:translate-x-1"
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
