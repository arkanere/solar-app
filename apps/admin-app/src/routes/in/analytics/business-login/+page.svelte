<script>
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/themeStore";

  $: darkMode = $isDarkMode;

  // Get data from page data (server-side)
  $: analytics = $page.data.analytics || {};
  $: error = $page.data.error;
</script>

<main class={darkMode ? "dark" : "light"}>
  <div class="header">
    <a href="/in/admin/analytics" class="back-link">← Back to Analytics</a>
    <h1>Business Login Activity Analytics</h1>
    <p class="subtitle">
      Track business engagement through login activity over the last 15 days
    </p>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {:else}
    <!-- Main Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <h2>Total Businesses</h2>
        <div class="stat-number">
          {analytics.totalBusinesses?.toLocaleString() || 0}
        </div>
        <div class="stat-label">Active registered businesses</div>
      </div>

      <div class="stat-card success">
        <h2>Recent Login Activity</h2>
        <div class="stat-number">
          {analytics.businessesLoggedInLast15Days || 0}
        </div>
        <div class="stat-label">Logged in last 15 days</div>
      </div>

      <div class="stat-card info">
        <h2>Engagement Rate</h2>
        <div class="stat-number">{analytics.percentageLoggedIn || 0}%</div>
        <div class="stat-label">Business login rate</div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="actions-section">
      <a href="/in/admin/analytics/businesses" class="action-link"
        >View Business Analytics</a
      >
      <a href="/in/admin/allbusinesses" class="action-link secondary"
        >View All Businesses</a
      >
    </div>
  {/if}
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #0056b3;
    --hover-color: #003366;
    --success-color: #28a745;
    --info-color: #17a2b8;
    --card-light-bg: #fff;
    --card-dark-bg: #333;
    --border-light: #ddd;
    --border-dark: #555;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout styling */
  main {
    padding: 2rem 1rem;
    font-family: var(--font-family);
    min-height: 100vh;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
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

  /* Header section */
  .header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .back-link {
    display: inline-block;
    color: var(--accent-color);
    text-decoration: none;
    margin-bottom: 1rem;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .back-link:hover {
    color: var(--hover-color);
  }

  h1 {
    font-size: 2.2rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  .subtitle {
    font-size: 1rem;
    opacity: 0.8;
    margin: 0;
    font-style: italic;
  }

  /* Error state */
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #dc3545;
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    justify-content: center;
  }

  /* Stat card styling */
  .stat-card {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s ease;
    max-width: 350px;
    margin: 0 auto;
  }

  .light .stat-card {
    background-color: var(--card-light-bg);
    border: 1px solid var(--border-light);
  }

  .dark .stat-card {
    background-color: var(--card-dark-bg);
    border: 1px solid var(--border-dark);
  }

  .stat-card:hover {
    transform: translateY(-2px);
  }

  .stat-card.primary {
    border-left: 4px solid var(--accent-color);
  }

  .stat-card.success {
    border-left: 4px solid var(--success-color);
  }

  .stat-card.info {
    border-left: 4px solid var(--info-color);
  }

  .stat-card.success .stat-number {
    color: var(--success-color);
  }

  .stat-card.info .stat-number {
    color: var(--info-color);
  }

  .stat-card h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
    opacity: 0.8;
    font-weight: 500;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--accent-color);
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  /* Actions section */
  .actions-section {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-link {
    display: inline-block;
    color: white;
    background-color: var(--accent-color);
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .action-link:hover {
    background-color: var(--hover-color);
  }

  .action-link.secondary {
    background-color: #6c757d;
  }

  .action-link.secondary:hover {
    background-color: #545b62;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-number {
      font-size: 2rem;
    }

    h1 {
      font-size: 1.8rem;
    }

    .actions-section {
      flex-direction: column;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .stat-number {
      font-size: 1.8rem;
    }
  }
</style>
