<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { isDarkMode } from "$lib/themeStore";

  $: darkMode = $isDarkMode;

  // Get data from page data (server-side)
  $: ({ selectedState, businesses, totalCount, stateAnalytics, error } =
    $page.data);

  // List of states (from BusinessDirectory.svelte)
  const states = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Handle state selection
  function handleStateChange(event) {
    const state = event.target.value;
    // Reset district selection when state changes
    selectedDistrict = "";
    if (state) {
      goto(
        `/in/admin/analytics/businesses-statewise?state=${encodeURIComponent(state)}`,
      );
    } else {
      goto("/in/admin/analytics/businesses-statewise");
    }
  }

  // District filtering
  let selectedDistrict = "";

  // Reset district selection when state changes
  $: if (selectedState) {
    selectedDistrict = "";
  }

  $: filteredBusinesses = selectedDistrict
    ? businesses.filter((business) => business.district === selectedDistrict)
    : businesses;

  $: uniqueDistricts = businesses
    ? [
        ...new Set(
          businesses.map((b) => b.district).filter((d) => d && d.trim() !== ""),
        ),
      ].sort()
    : [];

  // Handle district selection
  function handleDistrictChange(event) {
    selectedDistrict = event.target.value;
  }

  // Format date for display
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Get tier display text
  function getTierDisplay(business) {
    if (!business.businessfilled) return "Tier-1";
    if (business.tier3) return "Tier-3";
    return "Tier-2";
  }

  // Get tier class for styling
  function getTierClass(business) {
    if (!business.businessfilled) return "tier1";
    if (business.tier3) return "tier3";
    return "tier2";
  }
</script>

<main class={darkMode ? "dark" : "light"}>
  <div class="header">
    <a href="/in/admin/analytics" class="back-link">← Back to Analytics</a>
    <h1>State-wise Business Analytics</h1>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {:else}
    <!-- State Selection -->
    <div class="state-selection">
      <label for="state">Select State:</label>
      <select id="state" value={selectedState} on:change={handleStateChange}>
        <option value="">-- Select a state --</option>
        {#each states as state}
          <option value={state}>{state}</option>
        {/each}
      </select>
    </div>

    {#if selectedState}
      <!-- State Analytics -->
      {#if stateAnalytics}
        <div class="state-header">
          <h2>{selectedState}</h2>
          <div class="state-stats">
            <div class="stat-card primary">
              <div class="stat-number">{stateAnalytics.totalBusinesses}</div>
              <div class="stat-label">Total Businesses</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{stateAnalytics.today}</div>
              <div class="stat-label">Today</div>
            </div>
            <div class="stat-card success">
              <div class="stat-number">{stateAnalytics.last30Days}</div>
              <div class="stat-label">Last 30 Days</div>
            </div>
          </div>
        </div>

        <!-- Status Breakdown -->
        {#if stateAnalytics.statusBreakdown}
          <div class="breakdown-section">
            <h3>Business Tier Distribution</h3>
            <div class="status-grid">
              <div class="status-card tier1">
                <h4>Tier-1</h4>
                <div class="status-number">
                  {stateAnalytics.statusBreakdown.tier1_count || 0}
                </div>
                <div class="status-description">Basic listings</div>
              </div>
              <div class="status-card tier2">
                <h4>Tier-2</h4>
                <div class="status-number">
                  {stateAnalytics.statusBreakdown.tier2_count || 0}
                </div>
                <div class="status-description">Complete profiles</div>
              </div>
              <div class="status-card tier3">
                <h4>Tier-3</h4>
                <div class="status-number">
                  {stateAnalytics.statusBreakdown.tier3_count || 0}
                </div>
                <div class="status-description">Premium businesses</div>
              </div>
            </div>
          </div>
        {/if}

        <!-- District Breakdown -->
        {#if stateAnalytics.districtBreakdown && stateAnalytics.districtBreakdown.length > 0}
          <div class="breakdown-section">
            <h3>District-wise Distribution</h3>
            <div class="district-grid">
              {#each stateAnalytics.districtBreakdown as district}
                <div class="district-card">
                  <h4>{district.district}</h4>
                  <div class="district-count">{district.count}</div>
                  <div class="district-label">businesses</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/if}

      <!-- Business Listings -->
      <div class="business-section">
        <div class="business-header-section">
          <h3>
            All Businesses in {selectedState} ({filteredBusinesses.length}{#if selectedDistrict}
              in {selectedDistrict}{/if})
          </h3>

          {#if uniqueDistricts.length > 0}
            <div class="district-filter">
              <label for="district-filter">Filter by District:</label>
              <select
                id="district-filter"
                value={selectedDistrict}
                on:change={handleDistrictChange}
              >
                <option value="">-- All Districts --</option>
                {#each uniqueDistricts as district}
                  <option value={district}>{district}</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>

        {#if filteredBusinesses && filteredBusinesses.length > 0}
          <div class="business-table-container">
            <table class="business-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>District</th>
                  <th>Tier</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each filteredBusinesses as business}
                  <tr>
                    <td class="business-name">
                      <strong>{business.businessname}</strong>
                    </td>
                    <td>{business.district || "Not specified"}</td>
                    <td>
                      <span class="tier-badge {getTierClass(business)}"
                        >{getTierDisplay(business)}</span
                      >
                    </td>
                    <td>{business.phonenumber || "Not provided"}</td>
                    <td class="email-cell"
                      >{business.email || "Not provided"}</td
                    >
                    <td class="date-cell">{formatDate(business.created_at)}</td>
                    <td class="actions-cell">
                      <div class="table-actions">
                        <a
                          href="https://admin.solarvipani.com/in/allbusinesses/{business.id}/edit"
                          target="_blank"
                          class="table-action-link">Edit</a
                        >
                        {#if business.slug}
                          <a
                            href="https://solarvipani.com/in/solar-panel-installer/{business.slug}"
                            target="_blank"
                            class="table-action-link secondary">View</a
                          >
                        {/if}
                        {#if business.magic_link_token && business.slug}
                          <a
                            href="https://business.solarvipani.com/in/{business.slug}/signin-link/{business.magic_link_token}"
                            target="_blank"
                            class="table-action-link access-account"
                            >Access Account</a
                          >
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else if selectedDistrict}
          <div class="no-businesses">
            <p>No businesses found in {selectedDistrict}, {selectedState}</p>
          </div>
        {:else}
          <div class="no-businesses">
            <p>No businesses found in {selectedState}</p>
          </div>
        {/if}
      </div>
    {:else}
      <div class="no-selection">
        <p>Please select a state to view businesses and analytics.</p>
      </div>
    {/if}
  {/if}
</main>

<style>
  /* Root variables */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #0056b3;
    --hover-color: #003366;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --card-light-bg: #fff;
    --card-dark-bg: #333;
    --border-light: #ddd;
    --border-dark: #555;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout */
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

  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  /* Header */
  .header {
    margin-bottom: 2rem;
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
    margin: 0;
    font-weight: 600;
  }

  /* Error state */
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: var(--danger-color);
  }

  /* State selection */
  .state-selection {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .light .state-selection {
    background-color: var(--card-light-bg);
    border: 1px solid var(--border-light);
  }

  .dark .state-selection {
    background-color: var(--card-dark-bg);
    border: 1px solid var(--border-dark);
  }

  .state-selection label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .state-selection select {
    width: 100%;
    max-width: 400px;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid var(--border-light);
    font-family: var(--font-family);
    transition: border 0.3s ease;
  }

  .light .state-selection select {
    background-color: #f8f9fa;
    color: var(--light-primary-text-color);
  }

  .dark .state-selection select {
    background-color: #444;
    color: var(--dark-primary-text-color);
    border-color: var(--border-dark);
  }

  .state-selection select:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  /* State header */
  .state-header {
    margin-bottom: 2rem;
  }

  .state-header h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--accent-color);
    text-align: center;
  }

  .state-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  /* Stat cards */
  .stat-card {
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s ease;
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

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }

  .stat-card.success .stat-number {
    color: var(--success-color);
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* Breakdown sections */
  .breakdown-section {
    margin-bottom: 2rem;
  }

  .breakdown-section h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--accent-color);
    text-align: center;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .status-card {
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .light .status-card {
    background-color: var(--card-light-bg);
    border: 1px solid var(--border-light);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dark .status-card {
    background-color: var(--card-dark-bg);
    border: 1px solid var(--border-dark);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .status-card:hover {
    transform: translateY(-2px);
  }

  .status-card.tier1 {
    border-left: 4px solid #17a2b8;
  }

  .status-card.tier2 {
    border-left: 4px solid var(--warning-color);
  }

  .status-card.tier3 {
    border-left: 4px solid var(--success-color);
  }

  .status-card h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .status-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent-color);
    margin-bottom: 0.25rem;
  }

  .status-description {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  /* District grid */
  .district-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .district-card {
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .light .district-card {
    background-color: var(--card-light-bg);
    border: 1px solid var(--border-light);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .dark .district-card {
    background-color: var(--card-dark-bg);
    border: 1px solid var(--border-dark);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .district-card:hover {
    transform: translateY(-1px);
  }

  .district-card h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .district-count {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-color);
    margin-bottom: 0.25rem;
  }

  .district-label {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  /* Business section */
  .business-header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .business-section h3 {
    font-size: 1.5rem;
    margin: 0;
    color: var(--accent-color);
  }

  .district-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .district-filter label {
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .district-filter select {
    padding: 0.5rem;
    font-size: 0.9rem;
    border-radius: 4px;
    border: 1px solid var(--border-light);
    font-family: var(--font-family);
    transition: border 0.3s ease;
    min-width: 180px;
  }

  .light .district-filter select {
    background-color: #f8f9fa;
    color: var(--light-primary-text-color);
  }

  .dark .district-filter select {
    background-color: #444;
    color: var(--dark-primary-text-color);
    border-color: var(--border-dark);
  }

  .district-filter select:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  /* Business table */
  .business-table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .business-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .light .business-table {
    background-color: var(--card-light-bg);
  }

  .dark .business-table {
    background-color: var(--card-dark-bg);
  }

  .business-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--accent-color);
  }

  .light .business-table th {
    background-color: #f8f9fa;
    color: var(--light-primary-text-color);
  }

  .dark .business-table th {
    background-color: #2a2a2a;
    color: var(--dark-primary-text-color);
  }

  .business-table td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
  }

  .light .business-table td {
    border-bottom: 1px solid #e9ecef;
  }

  .dark .business-table td {
    border-bottom: 1px solid #444;
  }

  .business-table tr:hover {
    transition: background-color 0.2s ease;
  }

  .light .business-table tr:hover {
    background-color: #f8f9fa;
  }

  .dark .business-table tr:hover {
    background-color: #3a3a3a;
  }

  .business-name {
    min-width: 200px;
  }

  .business-name strong {
    color: var(--accent-color);
  }

  .email-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date-cell {
    white-space: nowrap;
    font-size: 0.85rem;
    color: #6c757d;
  }

  .actions-cell {
    white-space: nowrap;
  }

  .table-actions {
    display: flex;
    gap: 0.5rem;
  }

  .table-action-link {
    display: inline-block;
    color: white;
    background-color: var(--accent-color);
    text-decoration: none;
    padding: 0.3rem 0.6rem;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .table-action-link:hover {
    background-color: var(--hover-color);
  }

  .table-action-link.secondary {
    background-color: #6c757d;
  }

  .table-action-link.secondary:hover {
    background-color: #545b62;
  }

  .table-action-link.access-account {
    background-color: var(--success-color);
  }

  .table-action-link.access-account:hover {
    background-color: #218838;
  }

  .tier-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    color: white;
    font-weight: 600;
    white-space: nowrap;
    display: inline-block;
  }

  .tier-badge.tier1 {
    background-color: #17a2b8;
  }

  .tier-badge.tier2 {
    background-color: var(--warning-color);
    color: #333;
  }

  .tier-badge.tier3 {
    background-color: var(--success-color);
  }

  /* No selection/businesses states */
  .no-selection,
  .no-businesses {
    text-align: center;
    padding: 3rem;
    font-size: 1.1rem;
    color: #6c757d;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .state-stats {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .status-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .district-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    /* Mobile table adjustments */
    .business-table {
      font-size: 0.8rem;
    }

    .business-table th,
    .business-table td {
      padding: 0.5rem;
    }

    .business-table th {
      font-size: 0.75rem;
    }

    .business-name {
      min-width: 150px;
    }

    .email-cell {
      max-width: 120px;
    }

    .table-actions {
      flex-direction: column;
      gap: 0.25rem;
    }

    .table-action-link {
      padding: 0.25rem 0.4rem;
      font-size: 0.7rem;
    }

    /* Mobile business header */
    .business-header-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .district-filter {
      width: 100%;
      justify-content: space-between;
    }

    .district-filter select {
      flex: 1;
      min-width: auto;
      max-width: 200px;
    }

    h1 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 600px) {
    /* Hide less critical columns on very small screens */
    .business-table th:nth-child(4), /* Phone */
		.business-table td:nth-child(4) {
      display: none;
    }

    .business-table th:nth-child(5), /* Email */
		.business-table td:nth-child(5) {
      display: none;
    }
  }
</style>
