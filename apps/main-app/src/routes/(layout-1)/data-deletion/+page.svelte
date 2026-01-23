<script>
  import { enhance } from "$app/forms";


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
  <title>Data Deletion Request | Solar Vipani - Delete Your Personal Data</title>
  <meta
    name="description"
    content="Request deletion of your personal data from Solar Vipani. Submit a data deletion request to remove your information from our database."
  />
</svelte:head>

<main class="min-h-screen px-[theme(--spacing-2xl)] py-[theme(--spacing-4xl)] transition-colors duration-100 bg-background text-foreground">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-[theme(--font-size-4xl)] font-semibold text-center mb-[theme(--spacing-4xl)]">Data Deletion Request</h1>

    <div class="mb-[theme(--spacing-4xl)]">
      <p class="text-[theme(--font-size-lg)] mb-[theme(--spacing-2xl)] text-foreground-secondary">
        We respect your privacy and your right to control your personal data.
        Whether you are a customer or a registered solar installer on our
        platform, if you would like to request deletion of your personal
        information from our database, please fill out the form below.
      </p>

      <div class="p-[theme(--spacing-2xl)] bg-card rounded-[theme(--radius-xl)] mb-[theme(--spacing-4xl)] shadow-card">
        <h3 class="text-[theme(--font-size-2xl)] font-semibold mb-[theme(--spacing-2xl)]">What data will be deleted?</h3>
        <h4 class="text-[theme(--font-size-lg)] font-semibold mb-[theme(--spacing-lg)] first:mt-0">For Customers:</h4>
        <ul class="pl-[theme(--spacing-2xl)] space-y-[theme(--spacing-lg)] text-foreground-secondary">
          <li>Your contact information (phone number, email address)</li>
          <li>Lead submissions and requirements</li>
          <li>Account information and preferences</li>
          <li>Communication history with our team</li>
        </ul>

        <h4 class="text-[theme(--font-size-lg)] font-semibold mt-[theme(--spacing-2xl)] mb-[theme(--spacing-lg)]">For Solar Installers/Businesses:</h4>
        <ul class="pl-[theme(--spacing-2xl)] space-y-[theme(--spacing-lg)] text-foreground-secondary">
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
      <div class="p-[theme(--spacing-4xl)] bg-card rounded-[theme(--radius-xl)] text-center mb-[theme(--spacing-4xl)] shadow-card">
        <h2 class="text-[theme(--font-size-2xl)] font-semibold mb-[theme(--spacing-2xl)]">Request Submitted Successfully!</h2>
        <p class="mb-[theme(--spacing-2xl)] text-foreground-secondary">
          Your data deletion request has been received. We will process your
          request within 30 days and send you a confirmation email once
          completed.
        </p>
        <p class="text-foreground-secondary">
          If you have any questions, please contact us at <a
            href="mailto:admin@solarvipani.com"
            class="text-accent underline hover:no-underline">admin@solarvipani.com</a
          >.
        </p>
      </div>
    {:else}
      <form onsubmit={handleSubmit} class="p-[theme(--spacing-4xl)] bg-card rounded-[theme(--radius-xl)] shadow-card mb-[theme(--spacing-4xl)]">
        <div class="mb-[theme(--spacing-2xl)]">
          <label for="email" class="block mb-[theme(--spacing-lg)] font-semibold text-[theme(--font-size-lg)]">Email Address *</label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            placeholder="Enter your email address (business or personal)"
            class="w-full h-9 px-[theme(--spacing-lg)] border border-input rounded-[theme(--radius-xl)] transition-colors duration-100 focus:outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-background text-foreground"
          />
        </div>

        <div class="mb-[theme(--spacing-2xl)]">
          <label for="phone" class="block mb-[theme(--spacing-lg)] font-semibold text-[theme(--font-size-lg)]">Phone Number</label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            placeholder="Enter your phone number (optional)"
            class="w-full h-9 px-[theme(--spacing-lg)] border border-input rounded-[theme(--radius-xl)] transition-colors duration-100 focus:outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-background text-foreground"
          />
        </div>

        <div class="mb-[theme(--spacing-2xl)]">
          <label for="reason" class="block mb-[theme(--spacing-lg)] font-semibold text-[theme(--font-size-lg)]">Reason for Deletion (Optional)</label>
          <textarea
            id="reason"
            bind:value={formData.reason}
            placeholder="Please let us know why you're requesting data deletion (customers and installers welcome)"
            rows="4"
            class="w-full px-[theme(--spacing-lg)] py-[theme(--spacing-lg)] border border-input rounded-[theme(--radius-xl)] transition-colors duration-100 focus:outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-vertical min-h-24 bg-background text-foreground"
          ></textarea>
        </div>

        {#if error}
          <div class="p-[theme(--spacing-lg)] bg-destructive text-destructive-foreground rounded-[theme(--radius-xl)] text-center mb-[theme(--spacing-2xl)]">
            {error}
          </div>
        {/if}

        <button
          type="submit"
          disabled={submitting}
          class="w-full h-11 px-[theme(--spacing-4xl)] bg-accent text-accent-foreground rounded-[theme(--radius-xl)] font-semibold transition-all duration-100 hover:opacity-90 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Deletion Request"}
        </button>
      </form>
    {/if}

    <div class="p-[theme(--spacing-2xl)] bg-card rounded-[theme(--radius-xl)] shadow-card">
      <h3 class="text-[theme(--font-size-2xl)] font-semibold mb-[theme(--spacing-2xl)]">Important Information</h3>
      <ul class="pl-[theme(--spacing-2xl)] space-y-[theme(--spacing-lg)] mb-[theme(--spacing-2xl)] text-foreground-secondary">
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

      <p class="text-foreground-secondary">
        For any questions or concerns about your data deletion request, please
        contact us at
        <a href="mailto:admin@solarvipani.com" class="text-accent hover:underline">admin@solarvipani.com</a>.
      </p>
    </div>
  </div>
</main>
