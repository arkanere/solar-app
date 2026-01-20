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

<main class="min-h-screen bg-background text-foreground transition-colors duration-300">
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-background to-background-secondary px-8 py-16 md:px-8 md:py-20 text-center">
    <div class="flex flex-col items-center">
      <img
        src="/logo.webp"
        alt="Solar Vipani Logo"
        class="mb-6 max-w-[150px] w-auto h-auto object-contain"
        width="200"
        height="100"
      />
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Solar Vipani</h1>
      <p class="text-xl md:text-2xl mb-2 text-accent">
        Get 2-3 Free Quotes from Verified Installers in Your Area
      </p>
      <p class="text-base md:text-lg text-foreground-secondary">
        Join 2,000+ homeowners and businesses who have begun their switch to
        solar through our platform.
      </p>
    </div>
  </section>

  <!-- Country Selector -->
  <section class="max-w-6xl mx-auto px-8 py-16 md:px-8 md:py-20">
    <h2 class="text-center text-3xl md:text-4xl mb-12 text-primary font-semibold">Choose Your Region</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each countries as country}
        <button
          class="bg-card text-card-foreground border-2 border-border rounded-2xl px-8 py-10 text-center cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:border-accent hover:scale-105"
          onclick={() => selectCountry(country.path)}
        >
          <div class="text-6xl mb-4">{country.flag}</div>
          <h3 class="text-2xl font-semibold text-primary">{country.name}</h3>
        </button>
      {/each}
    </div>
  </section>
</main>

