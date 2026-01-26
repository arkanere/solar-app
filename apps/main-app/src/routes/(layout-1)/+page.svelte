<script>
  import { goto } from "$app/navigation";

  const countries = [
    {
      name: "India",
      flag: "🇮🇳",
      path: "/in",
    },
    {
      name: "United States",
      flag: "🇺🇸",
      path: "/us",
    },
  ];

  function selectCountry(path) {
    goto(path);
  }
</script>

<svelte:head>
  <title
    >Solar Vipani | Find Verified Solar Installers for your Homes and Businesses</title
  >
  <meta
    name="description"
    content="Connect with verified solar panel installers across India, USA, and Australia. Compare quotes, read reviews, and save on electricity bills. Free consultation available."
  />
  <meta
    name="keywords"
    content="solar panel installation, solar installers worldwide, verified solar installers, solar energy, solar panel quotes, solar directory"
  />
  <meta
    property="og:title"
    content="Solar Vipani | Global Solar Installer Directory"
  />
  <meta
    property="og:description"
    content="Find verified solar installers in India, USA, and Australia. Get free quotes and expert consultation."
  />
  <meta property="og:image" content="https://solarvipani.com/logo512.png" />
  <meta property="og:url" content="https://solarvipani.com" />
  <link rel="canonical" href="https://solarvipani.com" />
</svelte:head>

<main class="min-h-screen bg-background text-foreground transition-colors duration-[theme(--duration-default)]">
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-background to-background-secondary px-[theme(--spacing-2xl)] py-[theme(--spacing-4xl)] md:px-[theme(--spacing-2xl)] md:py-[theme(--spacing-5xl)] text-center">
    <div class="flex flex-col items-center">
      <img
        src="/logo.webp"
        alt="Solar Vipani Logo"
        class="mb-[theme(--spacing-xl)] max-w-[150px] w-auto h-auto object-contain"
        width="200"
        height="100"
      />
      <h1 class="text-[theme(--font-size-4xl)] md:text-[theme(--font-size-5xl)] font-bold mb-[theme(--spacing-lg)]">Solar Vipani</h1>
      <p class="text-[theme(--font-size-xl)] md:text-[theme(--font-size-2xl)] mb-[theme(--spacing-sm)] text-accent">
        Get 2-3 Free Quotes from Verified Installers in Your Area
      </p>
      <p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] text-foreground-secondary">
        Join 2,000+ homeowners and businesses who have begun their switch to
        solar through our platform.
      </p>
    </div>
  </section>

  <!-- Country Selector -->
  <section class="max-w-6xl mx-auto px-[theme(--spacing-2xl)] py-[theme(--spacing-4xl)] md:px-[theme(--spacing-2xl)] md:py-[theme(--spacing-5xl)]">
    <h2 class="text-center text-[theme(--font-size-3xl)] md:text-[theme(--font-size-4xl)] mb-[theme(--spacing-3xl)] text-primary font-semibold">Choose Your Region</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--spacing-2xl)]">
      {#each countries as country}
        <button
          onclick={() => selectCountry(country.path)}
          class="bg-card text-card-foreground border-2 border-border rounded-[theme(--radius-xl)] px-[theme(--spacing-2xl)] py-[theme(--spacing-lg)] text-center cursor-pointer transition-all duration-[theme(--duration-default)] hover:shadow-[theme(--shadow-card-hover)] hover:border-accent hover:scale-[1.05]"
        >
          <div class="text-6xl mb-[theme(--spacing-lg)]">{country.flag}</div>
          <h3 class="text-[theme(--font-size-2xl)] font-semibold text-primary">{country.name}</h3>
        </button>
      {/each}
    </div>
  </section>
</main>

