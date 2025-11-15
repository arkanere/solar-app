<script>
  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;
</script>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogpost">
    <h1>How to Install Solar Panels at Your Home in India</h1>

    <!-- Introduction -->
    <p>
      India’s transition to clean energy is rapidly accelerating, and more
      homeowners are turning to solar power for both cost savings and
      environmental benefits. Yet, questions about feasibility, hardware
      selection, and maintenance can feel overwhelming. This concise guide
      demystifies the essentials—helping you decide if solar is right for your
      home and how to install panels efficiently. From initial assessments and
      hardware choices to leveraging subsidies and performing basic upkeep,
      we’ll cover the core steps you need to know. Let’s dive in and see how you
      can tap into India’s abundant sunshine.
    </p>

    <!-- Section 1: Assessing Feasibility and Requirements -->
    <h2>1. Assessing Feasibility and Requirements</h2>
    <p>
      Start by verifying your rooftop’s potential for capturing sunlight. Look
      for unshaded areas with a southern or southwestern orientation—vital for
      maximizing production in India. Check your roof’s structural integrity,
      reinforcing it if necessary. Review your monthly electricity usage to
      estimate needed capacity; each kilowatt of solar typically produces 3–5
      kWh daily. If you live in a region with monsoons or partial shading,
      factor in slightly lower output. A thorough feasibility check prevents
      over-investment and ensures your system aligns with your energy needs.
    </p>

    <!-- Section 2: Choosing the Right Solar Components -->
    <h2>2. Choosing the Right Solar Components</h2>
    <p>
      Core components include solar panels, inverters, and mounting structures.
      Monocrystalline panels offer higher efficiency but cost more, while
      polycrystalline panels can be budget-friendly alternatives. Reputable
      brands with extended warranties are recommended for longevity. For Indian
      homes, string inverters are popular due to affordability and ease of use,
      though microinverters can optimize panel-level performance. Ensure
      mounting structures are rust-resistant (galvanized iron or aluminum) and
      that all wiring components meet safety standards. Spending slightly more
      on quality hardware generally reduces future repairs and boosts overall
      reliability.
    </p>

    <!-- Section 3: Financial Considerations and Government Incentives -->
    <h2>3. Financial Considerations and Government Incentives</h2>
    <p>
      While solar installation costs may seem high initially, various incentives
      and net metering policies can significantly lower the net expense. MNRE
      subsidies for residential rooftop systems and state-level incentives
      further decrease upfront costs. Net metering allows you to supply excess
      power back to the grid, offsetting your electricity bills. Consider
      solar-specific loans or EMI options if budget is a concern. Over a
      system’s lifespan—often 20+ years—cumulative savings on electricity can
      easily surpass the initial investment, making solar financially viable for
      many homeowners.
    </p>

    <!-- Section 4: Installation Procedure and Safety Measures -->
    <h2>4. Installation Procedure and Safety Measures</h2>
    <p>
      Professional installers typically begin by confirming the panel layout and
      reinforcing the roof if needed. Sturdy metal racks are then mounted using
      corrosion-proof fasteners, followed by panel installation using clamps.
      Next, DC wiring from the panels connects to an inverter, which converts it
      into AC power for household use. If net metering is applicable, your power
      utility replaces or configures the meter to accommodate solar feed-ins.
      Throughout this process, ensure installers follow safety protocols—using
      appropriate protective gear, proper voltage guidelines, and high-quality
      components. You can connect with
      <a href="/" target="_blank" rel="noopener"
        >verified solar panel installers working in your area</a
      >,
    </p>

    <!-- Section 5: Maintenance and Performance Optimization -->
    <h2>5. Maintenance and Performance Optimization</h2>
    <p>
      Solar panels need basic upkeep to maintain optimal output. Dust or
      pollution reduces efficiency, so a gentle cleaning every few months helps.
      Monitor power production via your inverter’s display or a mobile app;
      abrupt dips may signal wiring or panel issues. Some homeowners slightly
      adjust panel tilt angles seasonally, although this can depend on your
      mounting setup. Inverters often last 8–10 years, so budget for eventual
      replacement. Overall, minor, routine checks keep your system consistently
      performing at a high level.
    </p>

    <!-- Section 6: Common Myths About Residential Solar -->
    <h2>6. Common Myths About Residential Solar</h2>
    <ul>
      <li><strong>Myth:</strong> Panels fail on cloudy days.</li>
      <li>
        <strong>Reality:</strong> While output dips in cloud cover, panels still
        generate partial power.
      </li>
      <li><strong>Myth:</strong> Maintenance costs are steep.</li>
      <li>
        <strong>Reality:</strong> Apart from occasional cleaning and minor checks,
        ongoing costs remain low.
      </li>
      <li><strong>Myth:</strong> Only large homes benefit.</li>
      <li>
        <strong>Reality:</strong> Systems can be scaled to suit smaller rooftops
        or moderate electricity use.
      </li>
    </ul>

    <!-- Conclusion -->
    <h2>Conclusion</h2>
    <p>
      Installing solar panels at home can be a straightforward process when you
      understand key factors like feasibility, component selection, incentives,
      and basic upkeep. India’s abundant sunshine, coupled with government
      support, has paved the way for more households to go solar without
      excessive upfront costs. By investing in a well-designed system and
      staying proactive with maintenance, you’ll enjoy decades of lower
      electricity bills and a cleaner environmental footprint. With careful
      planning, installing solar can be one of the most rewarding and
      future-focused decisions you make for your home.
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

  h3 {
    font-size: 1.6rem;
    margin-top: 1.5rem;
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
