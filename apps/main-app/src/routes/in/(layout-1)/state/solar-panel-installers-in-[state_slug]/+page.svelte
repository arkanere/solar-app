<script>
  import { page } from "$app/stores";

  // Get reactive data from the page store using derived
  const state = $derived($page.data.state);
  const districts = $derived($page.data.districts || []);
  const errorMessage = $derived($page.data.errorMessage);

  // Function to format district name for URL
  function formatDistrictSlug(district) {
    return encodeURIComponent(district.toLowerCase());
  }
</script>

<svelte:head>
  <title
    >Solar Panel Installers in {state} - Find installers by district - Solar Vipani</title
  >
  <meta
    name="description"
    content="Find the best solar panel installers in {state}. Browse by district to find top solar companies in your area."
  />
</svelte:head>

<main class="w-full bg-background text-foreground overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-4 py-8 min-h-screen">
  <div class="max-w-4xl w-full">
    <h1 class="text-3xl md:text-4xl font-semibold text-center mb-8 text-primary">
      Solar Panel Installers in {state}
    </h1>

    {#if errorMessage}
      <div class="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6" role="alert">
        <p class="text-destructive font-medium">{errorMessage}</p>
      </div>
    {:else if districts.length === 0}
      <div class="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6" role="alert">
        <p class="text-warning font-medium">No districts found in {state}.</p>
      </div>
    {:else}
      <p class="text-center text-muted-foreground mb-8 text-lg">
        Browse solar panel installers in {state} by district. We have listings in <span class="font-semibold text-foreground">{districts.length} districts</span>.
      </p>

      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8 list-none p-0">
        {#each districts as district}
          <li>
            <div class="flex flex-col h-full bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <h2 class="text-xl md:text-2xl font-semibold mb-2 text-primary">
                {district}
              </h2>
              <p class="text-muted-foreground mb-4 flex-grow">
                Find solar installers in {district}
              </p>

              <div class="flex flex-col gap-3 pt-4">
                <a
                  href={`/in/solar-panel-installer-directory/${formatDistrictSlug(district)}`}
                  rel="noopener"
                  class="flex items-center justify-between px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>View installers</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href={`/in/district/${formatDistrictSlug(district)}`}
                  rel="noopener"
                  class="flex items-center justify-between px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>View cities in {district}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</main>
