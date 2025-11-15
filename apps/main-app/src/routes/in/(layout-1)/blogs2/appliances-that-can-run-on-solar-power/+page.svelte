<script>
  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;

  // Demonstration dates
  const lastUpdated = "2024-06-08";
  const lastUpdatedDisplay = "June 8, 2024";
  const datePublished = "2024-06-08";

  // Canonical URL
  const articleUrl =
    "https://solarvipani.com/blogs/appliances-that-can-run-on-solar-power";

  // JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Discover the appliances that can run on solar energy, from lighting to entertainment system",
    author: {
      "@type": "Person",
      name: "SolarVipani Admin",
      url: "/about-us",
    },
    datePublished: datePublished,
    dateModified: lastUpdated,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "SolarVipani Admin",
    },
    description:
      "A variety of household appliances can run on solar energy, depending on the system size and energy storage capacity.",
  };

  const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
  <!-- Title for SEO -->
  <title>Appliances that can run on Solar Energy</title>

  <!-- Inject JSON-LD data -->
  {@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogpost">
    <header class="blog-header">
      <h1>What Appliances Can Be Powered by Solar Energy?</h1>
      <p>By <a href="/about-us">SolarVipani Admin</a></p>
      <p>
        Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time>
      </p>
    </header>

    <img
      src="/blogs/appliance-that-run-on-solar-energy.jpg"
      alt="Appliances that run on solar energy"
      class="image"
      loading="lazy"
    />

    <p>
      A variety of household appliances can run on solar energy, depending on
      the system size and energy storage capacity. Below is a list of common
      appliances that can operate efficiently using an <a
        href="on-grid-solar-system">on-grid solar system</a
      >
      or
      <a href="off-grid-solar-system"> off-grid-solar-system</a>:
    </p>

    <h2>1. Lighting</h2>
    <ul>
      <li>LED bulbs (indoor and outdoor)</li>
      <li>CFL bulbs</li>
    </ul>

    <h2>2. Entertainment Systems</h2>
    <ul>
      <li>LED TVs</li>
      <li>DVD players</li>
      <li>Gaming consoles</li>
      <li>Sound systems</li>
    </ul>

    <h2>3. Kitchen Appliances</h2>
    <ul>
      <li>Refrigerators & Freezers</li>
      <li>Microwave ovens</li>
      <li>Toasters & Blenders</li>
      <li>Coffee makers & Electric kettles</li>
      <li>Dishwashers</li>
    </ul>

    <h2>4. Heating & Cooling Systems</h2>
    <ul>
      <li>Air conditioning units</li>
      <li>Electric fans</li>
      <li>Space heaters</li>
    </ul>

    <h2>5. Laundry Appliances</h2>
    <ul>
      <li>Washing machines</li>
      <li>Electric dryers</li>
    </ul>

    <h2>6. Electronics & Office Equipment</h2>
    <ul>
      <li>Computers, laptops, tablets & smartphones</li>
      <li>Printers, scanners & fax machines</li>
      <li>Chargers for mobile devices & batteries</li>
    </ul>

    <h2>7. Power Tools & Workshop Equipment</h2>
    <ul>
      <li>Electric drills</li>
      <li>Saws & Sanders</li>
      <li>Other handheld power tools</li>
    </ul>

    <h2>8. Water Pumps & Outdoor Systems</h2>
    <ul>
      <li>Well pumps</li>
      <li>Pool & fountain pumps</li>
      <li>Garden irrigation pumps</li>
    </ul>

    <h2>9. Home Security & Automation</h2>
    <ul>
      <li>CCTV cameras & motion sensors</li>
      <li>Security alarms</li>
      <li>Smart thermostats & lighting systems</li>
      <li>Smart home hubs</li>
    </ul>

    <h2>How to Optimize Solar Energy Usage for Appliances?</h2>
    <p>To maximize efficiency, it's crucial to:</p>
    <ul>
      <li>Size the solar system correctly based on energy demand.</li>
      <li>
        Use energy-efficient appliances (e.g., LED lighting, inverter-based air
        conditioners).
      </li>
      <li>Incorporate battery storage for nighttime or backup power.</li>
    </ul>
    <p>
      A properly designed solar system can power most household appliances,
      reducing electricity bills and reliance on the grid.
    </p>
    <p>
      Read <a
        href="/blogs/hiring-verified-solar-installer-in-india-is-essential"
        >why hiring a verified solar panel installer is essential in Inda</a
      >
    </p>
  </div>
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #0056b3;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-family);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  div {
    max-width: 650px;
  }

  /* Light mode */
  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  /* Dark mode */
  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  /* Heading styling */
  h1,
  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    text-align: center;
  }

  /* Paragraph styling */
  p {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
    line-height: 1.6;
  }

  /* List styling */
  ul {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  ul li {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  strong {
    font-weight: 600;
  }

  .image {
    width: 650px; /* Adjust logo size */
    height: auto;
    margin-bottom: 10px;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      padding: 1.5rem;
    }

    h1,
    h2 {
      font-size: 2rem;
    }

    p,
    ul li {
      font-size: 1rem;
    }
    .image {
      width: 300px; /* Adjust logo size */
      height: auto;
    }
  }
</style>
