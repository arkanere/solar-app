<script>
  import { page } from "$app/stores";
  import LeadForm from "$lib/in/components/LeadForm.svelte";

  const { business, referrer, errorMessage } = $derived($page.data);
</script>

<svelte:head>
  <title>Get Free Solar Quotes {referrer ? `- ${referrer.name}` : ''} | Solar Vipani</title>
  <meta
    name="description"
    content="Get free solar panel installation quotes from verified installers on Solar Vipani."
  />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    {#if errorMessage}
      <!-- Error Message -->
      <section class="my-8 mx-auto max-w-[theme(--max-width-md)]">
        <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] bg-destructive-muted border border-destructive">
          <p class="text-center text-destructive font-semibold text-lg">{errorMessage}</p>
        </div>
      </section>
    {:else if business && referrer}
      <!-- Referrer Info Card -->
      <section class="mt-8 mb-6 mx-auto max-w-[theme(--max-width-md)]">
        <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] bg-card border-2 border-primary/20">
          <div class="text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-primary mb-[theme(--spacing-md)]">
              Welcome, {referrer.name}!
            </h2>
            <p class="text-foreground dark:text-foreground-secondary text-lg mb-[theme(--spacing-sm)]">
              This is your referral submission page for <strong class="text-primary">{business.businessname}</strong>
            </p>
            <p class="text-sm text-muted-foreground mt-3">
              Use this form to submit customer details and earn commission on successful installations
            </p>
          </div>
        </div>
      </section>

      <!-- Lead Form Section -->
      <section id="lead-form-sv" class="mb-8 mx-auto max-w-[theme(--max-width-md)]">
        <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
          <div class="text-center mb-[theme(--spacing-2xl)]">
            <h1 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Submit Customer Details</h1>
            <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
              <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
            </div>
            <p class="text-lg text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
              Enter your customer's details below to generate free solar quotes
            </p>
          </div>
          <LeadForm showWrapper={false} />
        </div>
      </section>
    {:else}
      <!-- Loading State -->
      <section class="my-8 mx-auto max-w-[theme(--max-width-md)]">
        <div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] bg-card">
          <p class="text-center text-foreground">Loading...</p>
        </div>
      </section>
    {/if}
  </div>
</main>
