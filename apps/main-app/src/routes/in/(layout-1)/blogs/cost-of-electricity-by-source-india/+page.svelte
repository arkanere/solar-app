<script>
  import { isDarkMode } from "$lib/in/themeStore"; // If you have a global theme store

  let darkMode;
  $: darkMode = $isDarkMode;

  // Example date for "lastUpdated"
  const lastUpdated = "2024-12-01";
  const lastUpdatedDisplay = "December 1, 2024";

  // Publish date (matching lastUpdated here for simplicity)
  const datePublished = "2024-12-01";

  // The canonical URL of the blog post
  const articleUrl =
    "https://solarvipani.com/blogs/cost-of-electricity-by-source-india";

  // JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Comparing the Cost of Electricity by Source: Insights for Indian Homes and Businesses",
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
      "Explore how coal, gas, nuclear, hydropower, and solar stack up in terms of costs and reliability, and learn why solar power is leading the charge toward affordable, sustainable energy in India.",
  };

  // Convert JSON-LD to string
  const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
  <!-- SEO Title -->
  <title
    >Comparing the Cost of Electricity by Source: Insights for Indian Homes and
    Businesses</title
  >

  <!-- JSON-LD for structured data -->
  {@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogpost">
    <header class="blog-header">
      <h1>
        Comparing the Cost of Electricity by Source: Insights for Indian Homes
        and Businesses
      </h1>
      <p>
        By
        <a href="/about-us"> SolarVipani Admin </a>
      </p>
      <p>
        Last updated:
        <time datetime={lastUpdated}>{lastUpdatedDisplay}</time>
      </p>
    </header>

    <!-- Introduction -->
    <p>
      In India’s dynamic energy market, electricity costs vary widely depending
      on the source—be it coal, natural gas, hydropower, nuclear, or solar. For
      homeowners, apartment complexes, and businesses seeking reliable and
      affordable power, understanding these cost differences can guide informed
      decisions. As environmental concerns and tariff fluctuations become more
      pressing, exploring diverse energy options offers both financial and
      ecological advantages. This blog provides an overview of electricity
      prices by source in the Indian context, highlighting where solar power
      stands in terms of cost-effectiveness and sustainability.
    </p>

    <h2>1. Coal and Its Financial Implications</h2>
    <p>
      Coal remains a dominant energy source in India, long regarded as a
      dependable backbone for large-scale power generation. Although abundant
      domestic coal reserves keep supply relatively steady, the hidden
      costs—like transport, infrastructure upkeep, and emission controls—can
      inflate overall expenses. Moreover, environmental regulations and carbon
      taxes add further uncertainty to coal’s future price stability. As India
      commits to reducing carbon emissions under international climate accords,
      coal-fired plants may face stricter operational guidelines and potential
      penalties. For end-users—especially industrial and commercial consumers
      reliant on steady electricity—these evolving constraints can drive up
      tariffs. While coal remains accessible, its long-term financial viability
      is increasingly contested by cheaper, cleaner alternatives emerging in the
      energy mix.
    </p>

    <h2>2. Natural Gas and Its Price Volatility</h2>
    <p>
      Natural gas has gained ground as a relatively cleaner fossil fuel, often
      used in combined cycle power plants that provide flexible generation
      capacity. However, India’s limited domestic production means a significant
      portion of natural gas is imported via pipelines or liquefied natural gas
      (LNG) shipments, which can be influenced by global markets and currency
      fluctuations. During periods of tight supply or geopolitical tensions,
      prices can spike, impacting utility bills for both residential and
      commercial sectors. On the plus side, modern gas turbines boast higher
      efficiency than older coal plants, and new discoveries or improved
      infrastructure may moderate future gas costs. Despite these benefits, the
      inherent price volatility still poses risks, especially for organizations
      dependent on predictable energy expenses.
    </p>

    <h2>3. Nuclear and Hydropower: Stable but Location-Dependent</h2>
    <p>
      Nuclear and hydropower are often seen as relatively stable, low-carbon
      electricity sources—yet each comes with location-specific factors that
      influence overall costs. Nuclear energy involves high upfront construction
      expenses for reactors, rigorous safety measures, and complex waste
      disposal protocols. However, once operational, nuclear plants can produce
      large amounts of reliable power with minimal greenhouse gas emissions.
      Similarly, hydropower harnesses river flows to generate low-cost
      electricity but requires significant infrastructural investment in dams
      and turbines. Moreover, hydro output can fluctuate depending on rainfall
      patterns—posing uncertainties for regions prone to droughts. In India,
      projects like the Tehri Dam highlight hydropower’s long-term economic
      benefits but also underscore the need for careful ecological and community
      considerations.
    </p>

    <h2>4. Solar Power: Cost-Competitive and Future-Ready</h2>
    <p>
      Solar energy has rapidly emerged as a frontrunner in India’s energy
      landscape, thanks to favorable policies, technological advancements, and
      declining module prices. Rooftop solar installations allow households and
      businesses to generate their own electricity, effectively hedging against
      rising grid tariffs. Additionally, large-scale solar farms leverage
      economies of scale to produce some of the lowest levelized costs of
      electricity—comparable or even cheaper than coal and gas in many
      instances. Government incentives, such as net metering and accelerated
      depreciation, further enhance solar’s financial appeal, cutting payback
      periods to just a few years. Beyond cost savings, solar power’s minimal
      environmental impact aligns with India’s climate goals, making it a
      forward-thinking choice for all sectors.
    </p>

    <h2>Conclusion</h2>
    <p>
      Examining the cost of electricity by source reveals a complex interplay of
      factors—from coal’s carbon constraints to gas’s import dependencies, and
      from nuclear and hydropower’s infrastructure demands to solar’s
      technological leaps. For Indian homeowners, apartment communities, and
      businesses, understanding these cost variations is vital for strategic
      decision-making. As India embraces sustainability and works to stabilize
      energy expenses, solar power stands out as a versatile and economically
      compelling option. Ultimately, adopting cleaner, future-ready solutions
      not only curbs operating costs but also fosters a more resilient and
      eco-friendly energy landscape for the nation.
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

  .blogpost {
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

  /* Blog header styling */
  .blog-header {
    margin-bottom: 2rem;
  }

  /* Heading styling */
  h1,
  h2,
  h3 {
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
  ul,
  ol {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  ul li,
  ol li {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  strong {
    font-weight: 600;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      padding: 1.5rem;
    }

    h1,
    h2,
    h3 {
      font-size: 2rem;
    }

    p,
    ul li,
    ol li {
      font-size: 1rem;
    }
  }
</style>
