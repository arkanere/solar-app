<script>
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/themeStore"; // Import dark mode state

  let businesses = $page.data.businesses || [];
  let errorMessage = $page.data.errorMessage;

  $: darkMode = $isDarkMode; // Watch for changes in dark mode state
  $: businesses = $page.data.businesses;

  // Placeholder function for editing a business
  function editBusiness(businessId) {
    // Navigate to the edit page for the business with the given ID in a new tab
    window.open(`/us/allbusinesses/${businessId}/edit`, "_blank");
  }

  // Function to determine tier
  function determineTier(business) {
    const visibilityFlag = business.isvisible ? "Visible" : "Invisible";

    if (!business.businessfilled) {
      return `${visibilityFlag} Tier-1  ${business.tag}`;
    } else {
      return `${visibilityFlag} Tier-2  ${business.tag}`;
    }
  }
</script>

<main class={darkMode ? "dark" : "light"}>
  <h1>Business Data</h1>

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {:else if businesses.length > 0}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Business Name</th>
            <th>Tier</th>
            <th>Phone Number</th>
            <th>State</th>
            <th>County</th>
            <th>Tag</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each businesses as business}
            <tr>
              <td>{business.id}</td>
              <td>{business.businessname}</td>
              <td>{determineTier(business)}</td>
              <!-- Tier logic applied here -->
              <td>{business.phonenumber}</td>
              <td>{business.state}</td>
              <td>{business.county}</td>
              <td>{business.tag}</td>
              <td>{business.notes}</td>
              <td>
                <button
                  class="edit-button"
                  on:click={() => editBusiness(business.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p>No businesses found.</p>
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
    --border-light: #ddd;
    --border-dark: #444;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    font-family: var(--font-family);
    min-height: 100vh;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    width: 100%;
    overflow-x: hidden;
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

  /* Page title styling */
  h1 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    font-weight: 600;
    text-align: center;
  }

  /* Table container for horizontal scrolling */
  .table-container {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling if needed */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    min-width: 600px; /* Ensure minimum width to trigger scrolling */
    /* table-layout: fixed; Ensure columns respect their width */
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-light);
    /* Remove the nowrap and ellipsis properties */
    white-space: normal; /* Allow text to wrap onto multiple lines */
    overflow: visible; /* Let the text be fully visible (no hidden overflow) */
    text-overflow: clip; /* Don't apply ellipsis, let the text flow naturally */
  }

  th {
    background-color: var(--accent-color);
    color: #fff;
  }

  /* Set specific column widths */
  th:nth-child(1),
  td:nth-child(1) {
    /* id */
    max-width: 50px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    /* Business Name */
    max-width: 300px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    /* Tier column */
    max-width: 150px;
    word-wrap: break-word;
  }

  th:nth-child(5),
  td:nth-child(5) {
    /* State */
    max-width: 100px;
  }

  th:nth-child(6),
  td:nth-child(6) {
    /* County */
    max-width: 100px;
    word-wrap: break-word;
  }

  th:nth-child(7),
  td:nth-child(7) {
    /* Tag column */
    max-width: 100px;
  }

  th:nth-child(8),
  td:nth-child(8) {
    /* Notes */
    max-width: 150px;
  }

  /* Light mode table */
  .light th,
  .light td {
    color: var(--light-primary-text-color);
    background-color: #fff;
  }

  /* Dark mode table */
  .dark th,
  .dark td {
    color: var(--dark-primary-text-color);
    background-color: #333;
  }

  /* Edit button styling */
  .edit-button {
    background-color: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .edit-button:hover {
    background-color: darken(var(--accent-color), 10%);
  }

  /* Error message styling */
  .error-message {
    color: red;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
</style>
