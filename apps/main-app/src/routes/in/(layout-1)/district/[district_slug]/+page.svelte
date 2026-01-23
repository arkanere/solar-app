<script>
  import { page } from "$app/stores";
  import { Alert } from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";

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

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="text-center mb-[theme(--spacing-2xl)]">
      <h1 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">
        Solar Panel Installers in {district}
      </h1>
      <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
        <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
      </div>
    </div>

    {#if errorMessage}
      <Alert variant="destructive" class="mb-[theme(--spacing-2xl)]">
        <p>{errorMessage}</p>
      </Alert>
    {:else if cities.length === 0}
      <Alert variant="warning" class="mb-[theme(--spacing-2xl)]">
        <p>No cities found in {district}.</p>
      </Alert>
    {:else}
      <p class="text-center text-foreground dark:text-foreground-secondary mb-[theme(--spacing-2xl)] text-lg">
        Browse solar panel installers in {district} by city. We have listings in <span class="font-semibold text-primary">{cities.length} cities</span>.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] w-full mb-[theme(--spacing-2xl)]">
        {#each cities as city}
          <div class="flex flex-col h-full bg-card rounded-[theme(--radius-lg)] border border-border hover:shadow-[theme(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 p-[theme(--spacing-lg)]">
            <h2 class="text-lg font-semibold mb-[theme(--spacing-lg)] text-primary">
              {city}
            </h2>

            <div class="flex items-center justify-center font-medium text-primary mt-auto gap-[theme(--spacing-sm)] group">
              <Button asChild variant="default" class="w-full">
                <a href={`/in/solar-panel-installer-directory/${formatCitySlug(city)}`} rel="noopener" class="flex items-center justify-center gap-2">
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
  </div>
</main>
