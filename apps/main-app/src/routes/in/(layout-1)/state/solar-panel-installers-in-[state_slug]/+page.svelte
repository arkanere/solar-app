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

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="text-center mb-[theme(--spacing-2xl)]">
      <h1 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">
        Solar Panel Installers in {state}
      </h1>
      <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
        <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
      </div>
    </div>

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
      <p class="text-center text-foreground dark:text-foreground-secondary mb-[theme(--spacing-2xl)] text-lg">
        Browse solar panel installers in {state} by district. We have listings in <span class="font-semibold text-primary">{districts.length} districts</span>.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] w-full mb-[theme(--spacing-2xl)]">
        {#each districts as district}
          <div class="flex flex-col h-full bg-card rounded-[theme(--radius-lg)] border border-border hover:shadow-[theme(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-[theme(--spacing-lg)]">
            <h2 class="text-lg font-semibold mb-[theme(--spacing-lg)] text-primary">
              {district}
            </h2>

            <div class="flex items-center justify-center font-medium text-primary mt-auto gap-[theme(--spacing-xs)] group">
              <Button asChild variant="default" class="w-full">
                <a href={`/in/district/${formatDistrictSlug(district)}`} rel="noopener" class="flex items-center justify-center gap-2">
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
