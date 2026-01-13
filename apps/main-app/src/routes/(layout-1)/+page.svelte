<script>
  import { isDarkMode } from "$lib/themeStore";
  import { goto } from "$app/navigation";

  let darkMode = $derived($isDarkMode);

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

<main class={darkMode ? "dark" : "light"}>
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <img
        src="/logo.webp"
        alt="Solar Vipani Logo"
        class="hero-logo"
        width="200"
        height="100"
      />
      <h1>Solar Vipani</h1>
      <p class="hero-subtitle">
        Get 2-3 Free Quotes from Verified Installers in Your Area
      </p>
      <p class="hero-description">
        Join 2,000+ homeowners and businesses who have begun their switch to
        solar through our platform.
      </p>
    </div>
  </section>

  <!-- Country Selector -->
  <section class="country-selector">
    <h2>Choose Your Region</h2>
    <div class="countries-grid">
      {#each countries as country}
        <button
          class="country-card"
          on:click={() => selectCountry(country.path)}
        >
          <div class="country-flag">{country.flag}</div>
          <h3>{country.name}</h3>
        </button>
      {/each}
    </div>
  </section>
</main>

<style>
  :root {
    --primary-color: #0056b3;
    --primary-hover: #004494;
    --primary-light: #e6f0ff;
    --accent-color: #ffc107;
    --text-dark: #2c3e50;
    --text-medium: #546e7a;
    --text-light: #ecf0f1;
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a202c;
    --light-card-bg: #ffffff;
    --dark-card-bg: #2d3748;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
    --transition-medium: 0.3s ease;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  main {
    min-height: 100vh;
    font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
    transition: background-color var(--transition-medium);
  }

  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  /* Hero */
  .hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, #0a4b9e 100%);
    color: white;
    padding: 2rem 2rem;
    text-align: center;
  }

  .hero-logo {
    margin-bottom: 0.75rem;
    max-width: 150px;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .hero-content h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--accent-color);
  }

  .hero-description {
    font-size: 1rem;
    opacity: 0.9;
  }

  /* Country Selector */
  .country-selector {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem;
  }

  .country-selector h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }

  .dark .country-selector h2 {
    color: var(--primary-light);
  }

  .countries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  .country-card {
    background: var(--light-card-bg);
    border: 2px solid transparent;
    border-radius: var(--border-radius-lg);
    padding: 2.5rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-medium);
    box-shadow: var(--shadow-md);
  }

  .dark .country-card {
    background: var(--dark-card-bg);
  }

  .country-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  .country-flag {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .country-card h3 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }

  .dark .country-card h3 {
    color: var(--primary-light);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.2rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .country-selector h2 {
      font-size: 2rem;
    }

    .countries-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
