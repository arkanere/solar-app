<script>
  import { isDarkMode } from "$lib/in/themeStore"; // If you have a global store for theme

  let darkMode;
  $: darkMode = $isDarkMode;

  // Example date for "lastUpdated"
  const lastUpdated = "2025-01-01";
  const lastUpdatedDisplay = "January 1, 2025";

  // Usually you’d define or fetch the publish date too, here we match lastUpdated
  const datePublished = "2025-01-01";

  // The final URL of the blog post (canonical URL)
  const articleUrl =
    "https://solarvipani.com/in/blogs/scientists-contributed-solar-photovoltaics";

  // Create your JSON-LD object for this article
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Pioneers of Solar Photovoltaics: Scientists Shaping India's Renewable Future",
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
      "Discover the scientists who have significantly contributed to the advancement of solar photovoltaics, driving innovation and efficiency in India's renewable energy sector.",
  };

  // Convert JSON-LD object to a string
  const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
  <!-- Inject JSON-LD in the document head without Svelte scoping -->
  {@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogpost">
    <header class="blog-header">
      <!-- Title -->
      <h1>
        Pioneers of Solar Photovoltaics: Scientists Shaping India's Renewable
        Future
      </h1>

      <!-- Author and Last Updated Display (human-readable) -->
      <p>
        By
        <a href="/about-us"> SolarVipani Admin </a>
      </p>

      <p>
        Last updated:
        <time datetime={lastUpdated}>
          {lastUpdatedDisplay}
        </time>
      </p>
    </header>

    <!-- Introduction -->
    <p>
      Solar photovoltaics (PV) have revolutionized the way we harness and
      utilize energy, playing a pivotal role in India's journey towards
      sustainable power. Behind the advancements in solar technology are
      visionary scientists whose groundbreaking research and innovations have
      paved the way for efficient and cost-effective solar solutions. For
      homeowners, apartment complexes, and businesses keen on adopting solar
      energy, understanding the contributions of these scientific pioneers
      offers valuable insights into the technology's evolution and its
      potential. This blog highlights some of the most influential scientists
      who have significantly impacted the field of solar photovoltaics.
    </p>

    <!-- Section 1: Edmund Becquerel: The Father of Photovoltaics -->
    <h2>1. Edmund Becquerel: The Father of Photovoltaics</h2>
    <p>
      Edmund Becquerel, a French physicist, is often hailed as the father of
      photovoltaics. In 1839, at the young age of 19, he discovered the
      photovoltaic effect while experimenting with an electrolyte-sensitized
      electrode. Becquerel's experiments demonstrated that certain materials
      could produce electricity when exposed to light, laying the foundational
      principle for solar cells. Although his early experiments yielded modest
      results, they ignited scientific curiosity and spurred further research
      into converting light into electrical energy. Becquerel's pioneering work
      established the scientific basis for the development of modern solar PV
      technology, making him a seminal figure in the field.
    </p>

    <!-- Section 2: Russell Ohl: Inventor of the Modern Solar Cell -->
    <h2>2. Russell Ohl: Inventor of the Modern Solar Cell</h2>
    <p>
      American physicist Russell Ohl made monumental contributions to solar
      photovoltaics in the 1940s. While working at Bell Labs, Ohl discovered the
      p-n junction, a critical component in semiconductor devices. In 1941, he
      developed the first practical silicon solar cell, which demonstrated a
      conversion efficiency of about 6%. Ohl's invention marked a significant
      leap from theoretical concepts to tangible solar technology. His work not
      only enhanced the efficiency of solar cells but also paved the way for
      their widespread application. The p-n junction remains a cornerstone of
      solar PV technology, underscoring Ohl's enduring legacy in the solar
      energy sector.
    </p>

    <!-- Section 3: Gerald Pearson, Calvin Fuller, and Daryl Chapin: Innovators of the Silicon Solar Cell -->
    <h2>
      3. Gerald Pearson, Calvin Fuller, and Daryl Chapin: Innovators of the
      Silicon Solar Cell
    </h2>
    <p>
      In the mid-20th century, a trio of scientists—Gerald Pearson, Calvin
      Fuller, and Daryl Chapin—further advanced solar PV technology at Bell
      Labs. Building upon Russell Ohl's discovery, they developed the first
      practical silicon solar cell in 1954. Their collaboration resulted in a
      solar cell with an efficiency of around 6%, a remarkable achievement for
      the time. This breakthrough transformed solar energy from a laboratory
      curiosity into a viable energy source. The Pearson-Fuller-Chapin solar
      cell became the prototype for future solar panels, driving the
      commercialization and adoption of solar technology globally. Their
      innovative work laid the groundwork for the high-efficiency solar cells we
      rely on today.
    </p>

    <!-- Section 4: Martin Green: Championing High-Efficiency Solar Cells -->
    <h2>4. Martin Green: Championing High-Efficiency Solar Cells</h2>
    <p>
      Australian scientist Martin Green is renowned for his relentless pursuit
      of higher-efficiency solar cells. Often referred to as the "father of
      modern photovoltaics," Green's research at the University of New South
      Wales has been instrumental in pushing the boundaries of solar cell
      performance. In the 1980s and 1990s, Green and his team developed advanced
      techniques such as passivated emitter and rear cell (PERC) technology,
      which significantly enhanced the efficiency of silicon solar cells. His
      innovations have led to record-breaking efficiencies, with some of his
      cells exceeding 25%. Martin Green's contributions have not only improved
      solar technology but also made it more economically competitive,
      accelerating the adoption of solar energy in India and worldwide.
    </p>

    <!-- Section 5: Zhores Alferov: Nobel Laureate and Semiconductor Expert -->
    <h2>5. Zhores Alferov: Nobel Laureate and Semiconductor Expert</h2>
    <p>
      Zhores Alferov, a Russian physicist, made significant strides in
      semiconductor technology, which is fundamental to solar photovoltaics.
      Awarded the Nobel Prize in Physics in 2000 for his work on semiconductor
      heterostructures used in high-speed and optoelectronic devices, Alferov's
      research has had a profound impact on solar PV technology. His
      advancements in semiconductor materials and device fabrication have
      enhanced the efficiency and performance of solar cells. Alferov's legacy
      extends to mentoring a generation of scientists and fostering
      international collaboration, further propelling innovations in solar
      energy. His contributions have been pivotal in developing the
      high-efficiency solar cells that are now integral to India's renewable
      energy landscape.
    </p>

    <!-- Section 6: Recent Contributors: Driving Innovation in Solar PV -->
    <h2>6. Recent Contributors: Driving Innovation in Solar PV</h2>
    <p>
      The field of solar photovoltaics continues to evolve, thanks to the
      efforts of contemporary scientists and researchers. In India, institutions
      like the Indian Institute of Technology (IIT) and the National Institute
      of Solar Energy (NISE) are at the forefront of solar research. Scientists
      such as Dr. Pradeep Sharma and Dr. M. Arun Kumar have developed novel
      materials and fabrication techniques that enhance solar cell efficiency
      and reduce costs. Their work on perovskite solar cells and tandem cell
      architectures represents the next generation of solar technology,
      promising even greater efficiencies and broader applications. These recent
      contributions ensure that solar photovoltaics remain a dynamic and rapidly
      advancing field, essential for India's sustainable energy future.
    </p>

    <!-- Conclusion -->
    <h2>Conclusion</h2>
    <p>
      The journey of solar photovoltaics from a nascent scientific curiosity to
      a cornerstone of sustainable energy is marked by the contributions of
      visionary scientists. From Edmund Becquerel's early experiments to Martin
      Green's high-efficiency innovations, each pioneer has played a crucial
      role in shaping the technology we rely on today. For homeowners, apartment
      complexes, and businesses in India, understanding these scientific
      milestones not only honors the legacy of these innovators but also
      underscores the potential of solar energy in driving a sustainable future.
      As research continues and new technologies emerge, the foundation laid by
      these scientists will propel solar photovoltaics to even greater heights,
      ensuring a cleaner and more resilient energy landscape for generations to
      come.
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
