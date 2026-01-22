<script>
  import { page } from "$app/stores";
  import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";

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

<main class="w-full bg-background text-foreground overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-[theme(--container-padding)] py-[theme(--spacing-2xl)] min-h-screen">
  <div class="max-w-4xl w-full">
    <h1 class="text-[theme(--font-size-4xl)] md:text-[calc(theme(--font-size-4xl)*1.15)] font-display text-center mb-[theme(--spacing-2xl)] text-primary">
      Solar Panel Installers in {state}
    </h1>

    {#if errorMessage}
      <div class="mb-[theme(--spacing-xl)]">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>
    {:else if districts.length === 0}
      <div class="mb-[theme(--spacing-xl)]">
        <Alert variant="warning">
          <AlertTitle>No Districts Found</AlertTitle>
          <AlertDescription>No districts found in {state}.</AlertDescription>
        </Alert>
      </div>
    {:else}
      <p class="text-center text-muted-foreground mb-[theme(--spacing-2xl)] text-[theme(--font-size-lg)]">
        Browse solar panel installers in {state} by district. We have listings in <span class="font-display text-foreground">{districts.length} districts</span>.
      </p>

      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] w-full mb-[theme(--spacing-2xl)] list-none p-0">
        {#each districts as district}
          <li>
            <div class="flex flex-col h-full bg-card rounded-[theme(--radius-xl)] py-[theme(--card-padding-y)] px-[theme(--card-padding-y)] border border-border hover:shadow-[theme(--shadow-card-hover)] transition-all duration-[theme(--duration-default)] hover:-translate-y-1">
              <h2 class="text-[theme(--font-size-2xl)] md:text-[theme(--font-size-3xl)] font-display mb-[theme(--spacing-sm)] text-primary">
                {district}
              </h2>
              <p class="text-muted-foreground mb-[theme(--spacing-lg)] flex-grow text-[theme(--font-size-base)]">
                Find solar installers in {district}
              </p>

              <div class="flex flex-col gap-[theme(--spacing-md)] pt-[theme(--spacing-lg)]">
                <Button asChild variant="default">
                  <a href={`/in/solar-panel-installer-directory/${formatDistrictSlug(district)}`} rel="noopener">
                    <span>View installers</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4 transition-transform duration-[theme(--duration-default)] group-hover:translate-x-1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={`/in/district/${formatDistrictSlug(district)}`} rel="noopener">
                    <span>View cities in {district}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4 transition-transform duration-[theme(--duration-default)] group-hover:translate-x-1"
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
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</main>
