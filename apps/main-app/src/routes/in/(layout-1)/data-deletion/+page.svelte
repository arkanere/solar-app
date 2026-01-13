<script>
  import { isDarkMode } from "$lib/in/themeStore";
  import { enhance } from "$app/forms";

  let darkMode = $derived($isDarkMode);

  let formData = $state({
    email: "",
    phone: "",
    reason: "",
  });

  let submitting = $state(false);
  let submitted = $state(false);
  let error = $state("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    submitting = true;
    error = "";

    try {
      const response = await fetch("/in/api/submitDataDeletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        submitted = true;
        formData = { email: "", phone: "", reason: "" };
      } else {
        error = "Failed to submit request. Please try again.";
      }
    } catch (err) {
      error = "An error occurred. Please try again later.";
    } finally {
      submitting = false;
    }
  };
</script>

<svelte:head>
  <title>Data Deletion Request | Solar Vipani - Delete Your Personal Data</title
  >
  <meta
    name="description"
    content="Request deletion of your personal data from Solar Vipani. Submit a data deletion request to remove your information from our database."
  />
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="container">
    <h1>Data Deletion Request</h1>

    <div class="intro-section">
      <p>
        We respect your privacy and your right to control your personal data.
        Whether you are a customer or a registered solar installer on our
        platform, if you would like to request deletion of your personal
        information from our database, please fill out the form below.
      </p>

      <div class="info-box">
        <h3>What data will be deleted?</h3>
        <h4>For Customers:</h4>
        <ul>
          <li>Your contact information (phone number, email address)</li>
          <li>Lead submissions and requirements</li>
          <li>Account information and preferences</li>
          <li>Communication history with our team</li>
        </ul>

        <h4>For Solar Installers/Businesses:</h4>
        <ul>
          <li>Business profile and contact information</li>
          <li>Service area and specialization details</li>
          <li>Lead claims and interaction history</li>
          <li>Project portfolios and showcase images</li>
          <li>Branch locations and team information</li>
          <li>Business verification documents</li>
        </ul>
      </div>
    </div>

    {#if submitted}
      <div class="success-message">
        <h2>Request Submitted Successfully!</h2>
        <p>
          Your data deletion request has been received. We will process your
          request within 30 days and send you a confirmation email once
          completed.
        </p>
        <p>
          If you have any questions, please contact us at <a
            href="mailto:admin@solarvipani.com">admin@solarvipani.com</a
          >.
        </p>
      </div>
    {:else}
      <form onsubmit={handleSubmit} class="deletion-form">
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            placeholder="Enter your email address (business or personal)"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            placeholder="Enter your phone number (optional)"
          />
        </div>

        <div class="form-group">
          <label for="reason">Reason for Deletion (Optional)</label>
          <textarea
            id="reason"
            bind:value={formData.reason}
            placeholder="Please let us know why you're requesting data deletion (customers and installers welcome)"
            rows="4"
          ></textarea>
        </div>

        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <button type="submit" disabled={submitting} class="submit-btn">
          {submitting ? "Submitting..." : "Submit Deletion Request"}
        </button>
      </form>
    {/if}

    <div class="additional-info">
      <h3>Important Information</h3>
      <ul>
        <li>Data deletion requests are processed within 30 business days</li>
        <li>
          You will receive a confirmation email once your data has been deleted
        </li>
        <li>
          Some data may be retained for legal compliance purposes (financial
          records, tax documentation, government subsidy records)
        </li>
        <li>
          Deleting your data will remove you from our marketing communications
        </li>
        <li>
          <strong>For Installers:</strong> Your business will be removed from our
          directory and you will no longer receive leads
        </li>
        <li>
          <strong>For Customers:</strong> You will no longer receive solar installation
          quotes or updates
        </li>
      </ul>

      <p>
        For any questions or concerns about your data deletion request, please
        contact us at
        <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.
      </p>
    </div>
  </div>
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #ffc107;
    --success-color: #28a745;
    --error-color: #dc3545;
    --font-family: "Helvetica Neue", Arial, sans-serif;
    --light-form-bg: white;
    --dark-form-bg: #333;
    --light-info-bg: #e9ecef;
    --dark-info-bg: #2c2c2c;
    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  main {
    padding: 2rem;
    font-family: var(--font-family);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    min-height: 100vh;
  }

  .container {
    max-width: 800px;
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

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.3;
  }

  h2,
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .intro-section {
    margin-bottom: 2rem;
  }

  .intro-section p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .info-box {
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: var(--box-shadow);
    transition: background-color 0.3s ease;
  }

  .light .info-box {
    background-color: var(--light-info-bg);
  }

  .dark .info-box {
    background-color: var(--dark-info-bg);
  }

  .info-box h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .info-box h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .info-box h4:first-of-type {
    margin-top: 0;
  }

  .info-box ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .info-box li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .deletion-form {
    background-color: var(--light-form-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    margin-bottom: 2rem;
    transition: background-color 0.3s ease;
  }

  .dark .deletion-form {
    background-color: var(--dark-form-bg);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }

  .dark input,
  .dark textarea {
    background-color: #2c2c2c;
    border-color: #555;
    color: var(--dark-primary-text-color);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .submit-btn {
    background-color: var(--accent-color);
    color: #333;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: #e6ac00;
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .success-message {
    background-color: var(--success-color);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 2rem;
  }

  .success-message h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .success-message a {
    color: white;
    text-decoration: underline;
  }

  .error-message {
    background-color: var(--error-color);
    color: white;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .additional-info {
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    transition: background-color 0.3s ease;
  }

  .light .additional-info {
    background-color: var(--light-info-bg);
  }

  .dark .additional-info {
    background-color: var(--dark-info-bg);
  }

  .additional-info h3 {
    margin-top: 0;
  }

  .additional-info ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .additional-info li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .deletion-form {
      padding: 1.5rem;
    }

    .info-box,
    .additional-info {
      padding: 1rem;
    }
  }
</style>
