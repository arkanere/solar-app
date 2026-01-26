<script>
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/themeStore"; // Import dark mode state

  let business = $page.data.business || {}; // Preload business data or empty object
  let errorMessage = $page.data.errorMessage || ""; // Error handling message

  $: darkMode = $isDarkMode; // Watch for changes in dark mode state

  let updatedBusiness = { ...business }; // Copy of business object to modify

  function updateServices(event) {
    updatedBusiness.services = event.target.value
      .split(",") // Convert comma-separated string to array
      .map((num) => num.trim()) // Remove spaces
      .filter((num) => num !== "") // Remove empty values
      .map((num) => Number(num)) // Convert to numbers safely
      .filter((num) => Number.isInteger(num)); // Keep only valid integers
  }

  // Function to trigger welcome mail
  async function triggerWelcomeMail() {
    try {
      const response = await fetch("/in/api/triggerWelcomeMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_email: updatedBusiness.login_email,
          slug: updatedBusiness.slug,
          businessname: updatedBusiness.businessname,
          id: updatedBusiness.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Welcome mail sent successfully!");
      } else {
        alert(`Failed to send welcome mail: ${result.error}`);
      }
    } catch (error) {
      console.error("Error triggering welcome mail:", error);
      alert("Error triggering welcome mail.");
    }
  }

  // Function to trigger password reset
  async function triggerPasswordReset() {
    try {
      const response = await fetch("/in/api/triggerPasswordReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_email: updatedBusiness.login_email,
          slug: updatedBusiness.slug,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Password reset link sent successfully!");
      } else {
        alert(`Failed to send password reset link: ${result.error}`);
      }
    } catch (error) {
      console.error("Error triggering password reset:", error);
      alert("Error triggering password reset.");
    }
  }
</script>

<svelte:head>
  <title>Edit Business | Admin Dashboard</title>
  <meta
    name="description"
    content="Admin dashboard to edit business details."
  />
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <h1>Edit Business</h1>

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

  <form method="POST">
    <!-- Business Name Input -->
    <div class="form-group">
      <label for="businessname">Business Name</label>
      <input
        id="businessname"
        name="businessname"
        bind:value={updatedBusiness.businessname}
        required
      />
    </div>

    <!-- Account Management Actions -->
    <div class="form-group">
      <h3 class="section-heading">Account Management</h3>
      <div class="button-row">
        <button
          type="button"
          class="secondary-button"
          on:click={triggerWelcomeMail}
        >
          Trigger Welcome Mail
        </button>
        <button
          type="button"
          class="secondary-button"
          on:click={triggerPasswordReset}
        >
          Trigger Password Reset
        </button>
      </div>
    </div>

    <!-- Other Fields -->
    <div class="form-group">
      <label for="slug">Slug</label>
      <input id="slug" name="slug" bind:value={updatedBusiness.slug} required />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <input
        id="description"
        name="description"
        bind:value={updatedBusiness.description}
        required
      />
    </div>

    <div class="form-group">
      <label for="services">Services</label>
      <input
        id="services"
        name="services"
        bind:value={updatedBusiness.services}
        on:input={updatedBusiness.services}
        required
      />
    </div>

    <div class="form-group">
      <label for="address">Address</label>
      <input
        id="address"
        name="address"
        bind:value={updatedBusiness.address}
        required
      />
    </div>

    <div class="form-group">
      <label for="pluscode">Plus Code</label>
      <input
        id="pluscode"
        name="pluscode"
        bind:value={updatedBusiness.pluscode}
      />
    </div>

    <div class="form-group">
      <label for="phonenumber">Phone Number</label>
      <input
        id="phonenumber"
        name="phonenumber"
        bind:value={updatedBusiness.phonenumber}
      />
    </div>

    <div class="form-group">
      <label for="whatsapp">WhatsApp Number</label>
      <input
        id="whatsapp"
        name="whatsapp"
        bind:value={updatedBusiness.whatsapp}
      />
    </div>

    <div class="form-group">
      <label for="email">Business Email</label>
      <input
        id="email"
        name="email"
        type="email"
        bind:value={updatedBusiness.email}
      />
    </div>

    <div class="form-group">
      <label for="login_email">Login Email</label>
      <input
        id="login_email"
        name="login_email"
        type="email"
        bind:value={updatedBusiness.login_email}
      />
    </div>

    <div class="form-group">
      <label for="website">Website</label>
      <input id="website" name="website" bind:value={updatedBusiness.website} />
    </div>

    <div class="form-group">
      <label for="instagram_id">Instagram ID</label>
      <input
        id="instagram_id"
        name="instagram_id"
        bind:value={updatedBusiness.instagram_id}
      />
    </div>

    <div class="form-group">
      <label for="google_maps_link">Google Maps Link</label>
      <input
        id="google_maps_link"
        name="google_maps_link"
        bind:value={updatedBusiness.google_maps_link}
      />
    </div>

    <div class="form-group">
      <label for="gstn">GSTN</label>
      <input id="gstn" name="gstn" bind:value={updatedBusiness.gstn} />
    </div>

    <div class="form-group">
      <label for="state">State</label>
      <input
        id="state"
        name="state"
        bind:value={updatedBusiness.state}
        required
      />
    </div>

    <div class="form-group">
      <label for="district">District</label>
      <input
        id="district"
        name="district"
        bind:value={updatedBusiness.district}
        required
      />
    </div>

    <div class="form-group">
      <label for="city">City</label>
      <input id="city" name="city" bind:value={updatedBusiness.city} required />
    </div>

    <div class="form-group">
      <label for="pincode">Pincode</label>
      <input
        id="pincode"
        name="pincode"
        maxlength="6"
        bind:value={updatedBusiness.pincode}
      />
    </div>

    <div class="form-group">
      <label for="tag">Tag</label>
      <input id="tag" name="tag" bind:value={updatedBusiness.tag} />
    </div>

    <div class="form-group">
      <label for="notes">Notes</label>
      <textarea id="notes" name="notes" bind:value={updatedBusiness.notes}
      ></textarea>
    </div>

    <div class="form-group">
      <label for="rscore">RScore</label>
      <input
        id="rscore"
        name="rscore"
        type="number"
        min="0"
        max="100"
        bind:value={updatedBusiness.rscore}
      />
    </div>

    <div class="form-group">
      <label for="isvisible">Is Visible</label>
      <select
        id="isvisible"
        name="isvisible"
        bind:value={updatedBusiness.isvisible}
        required
      >
        <option value={true}>True</option>
        <option value={false}>False</option>
      </select>
    </div>

    <div class="form-group">
      <label for="businessfilled">Business Filled</label>
      <select
        id="businessfilled"
        name="businessfilled"
        bind:value={updatedBusiness.businessfilled}
        required
      >
        <option value={true}>True</option>
        <option value={false}>False</option>
      </select>
    </div>

    <div class="button-group">
      <button type="submit" class="primary-button">Update Business</button>
    </div>
  </form>
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
    --input-border-color: #ccc;
    --input-bg-color: #fff;
    --dark-input-bg-color: #2a2a2a;
    --dark-input-border-color: #555;
    --error-color: red;
  }

  /* Main layout styling */
  main {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    font-family: var(--font-family);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    border-radius: 8px;
  }

  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  /* Form styling */
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .section-heading {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  .button-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  input,
  textarea,
  select {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--input-border-color);
    border-radius: 5px;
    background-color: var(--input-bg-color);
    font-family: var(--font-family);
    color: inherit;
  }

  .dark input,
  .dark textarea,
  .dark select {
    background-color: var(--dark-input-bg-color);
    border: 1px solid var(--dark-input-border-color);
  }

  input::placeholder,
  textarea::placeholder {
    color: #aaa;
  }

  .dark input::placeholder,
  .dark textarea::placeholder {
    color: #777;
  }

  /* Button styling */
  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .primary-button,
  .secondary-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--font-family);
  }

  .primary-button {
    background-color: var(--accent-color);
    color: #fff;
    margin-left: 1rem;
  }

  .primary-button:hover {
    background-color: #00449e;
  }

  .secondary-button {
    background-color: #6c757d;
    color: #fff;
  }

  .secondary-button:hover {
    background-color: #5a6268;
  }

  /* Error message styling */
  .error-message {
    color: var(--error-color);
    font-size: 1rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      margin: 1rem;
      padding: 1.5rem;
    }

    h1 {
      font-size: 1.8rem;
    }

    .button-group {
      flex-direction: column;
      align-items: stretch;
    }

    .primary-button,
    .secondary-button {
      width: 100%;
      margin: 0.5rem 0;
    }
  }
</style>
