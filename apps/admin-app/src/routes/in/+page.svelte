<script>
  import { isDarkMode } from "$lib/themeStore"; // Import dark mode state

  $: darkMode = $isDarkMode; // Watch for changes in dark mode state

  const leadsLinks = [
    { href: "/in/leaddata", label: "View Lead Data" },
    { href: "/in/leaddata-nonexclusive", label: "Nonexclusive Lead Data" },
    { href: "/in/lead-claimsdata", label: "Lead Claims Data" },
    { href: "/in/users", label: "Users" },
    { href: "/in/feedback", label: "User Feedback" },
    { href: "/in/queries", label: "Queries" },
    { href: "/in/control-tower/eligible-leads", label: "Eligible Leads" },
  ];

  const leadsAnalyticsLinks = [
    { href: "/in/analytics/lead-generation", label: "Lead Generation" },
    { href: "/in/analytics/leads-claimed", label: "Leads Claimed" },
  ];

  const businessLinks = [
    { href: "/in/businesses", label: "View Business Data" },
    { href: "/in/allbusinesses", label: "All Businesses" },
    { href: "/in/control-tower/eligible-businesses", label: "Eligible Businesses" },
  ];

  const businessAnalyticsLinks = [
    { href: "/in/analytics/business-login", label: "Business Login" },
    { href: "/in/analytics/businesses", label: "Businesses" },
    { href: "/in/analytics/businesses-onboarded", label: "Businesses Onboarded" },
    { href: "/in/business-onboarding", label: "Business Onboarding" },
    { href: "/in/analytics/businesses-branches", label: "Businesses Branches" },
    { href: "/in/analytics/businesses-statewise", label: "Businesses Statewise" },
    { href: "/in/analytics/coverage", label: "Coverage" },
    { href: "/in/analytics/spread", label: "Spread" },
    { href: "/in/analytics/recent-projects", label: "Recent Projects" },
  ];
</script>

<main class={darkMode ? "dark" : "light"}>
  <div class="columns">
    <section class="column">
      <h2>Users &amp; Leads</h2>
      <ul>
        {#each leadsLinks as link}
          <li><a href={link.href}>{link.label}</a></li>
        {/each}
      </ul>
      <h3>Analytics</h3>
      <ul>
        {#each leadsAnalyticsLinks as link}
          <li><a href={link.href}>{link.label}</a></li>
        {/each}
      </ul>
    </section>

    <section class="column">
      <h2>Businesses</h2>
      <ul>
        {#each businessLinks as link}
          <li><a href={link.href}>{link.label}</a></li>
        {/each}
      </ul>
      <h3>Analytics</h3>
      <ul>
        {#each businessAnalyticsLinks as link}
          <li><a href={link.href}>{link.label}</a></li>
        {/each}
      </ul>
    </section>
  </div>
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa; /* Light grayish background */
    --dark-bg-color: #1a1a1a; /* Dark background */
    --light-primary-text-color: #333; /* Dark text for light mode */
    --dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
    --accent-color: #0056b3; /* Blue for links and actions */
    --hover-color: #003366; /* Darker blue for hover effect */
    --font-family: "Helvetica Neue", Arial, sans-serif; /* Clean font family */
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    font-family: var(--font-family);
    min-height: 100vh;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .columns {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
    max-width: 900px;
    justify-content: center;
    align-items: flex-start;
  }

  .column {
    flex: 1 1 320px;
    min-width: 280px;
    border-radius: 8px;
    padding: 1.5rem 2rem;
  }

  .column h2 {
    margin: 0 0 1rem;
    font-size: 1.4rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-color);
  }

  .column h3 {
    margin: 1.5rem 0 0.75rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }

  .column ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .column li {
    margin: 0.5rem 0;
  }

  .column a {
    text-decoration: none;
    font-size: 1.05rem;
    color: var(--accent-color);
    transition: color 0.2s ease;
  }

  .column a:hover {
    color: var(--hover-color);
    text-decoration: underline;
  }

  /* Light Mode */
  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  .light .column {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
  }

  /* Dark Mode */
  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  .dark .column {
    background-color: #2a2a2a;
    border: 1px solid #444;
  }

  .dark .column a {
    color: #66b2ff;
  }

  .dark .column a:hover {
    color: #99ccff;
  }
</style>
