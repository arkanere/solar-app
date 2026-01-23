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

<main class="min-h-screen p-8 transition-colors duration-300 bg-[hsl(var(--background))] text-[var(--color-text-primary)] dark:bg-[hsl(var(--background))]">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-semibold text-center mb-6 leading-tight md:text-4xl">Data Deletion Request</h1>

    <div class="mb-8">
      <p class="text-lg leading-relaxed mb-6">
        We respect your privacy and your right to control your personal data.
        Whether you are a customer or a registered solar installer on our
        platform, if you would like to request deletion of your personal
        information from our database, please fill out the form below.
      </p>

      <div class="p-6 bg-[hsl(var(--muted))] rounded-lg mb-8 shadow-md dark:bg-[hsl(var(--muted))]">
        <h3 class="text-2xl font-semibold mb-4">What data will be deleted?</h3>
        <h4 class="text-lg font-semibold mt-6 mb-3 first:mt-0">For Customers:</h4>
        <ul class="pl-6 space-y-2">
          <li class="leading-relaxed">Your contact information (phone number, email address)</li>
          <li class="leading-relaxed">Lead submissions and requirements</li>
          <li class="leading-relaxed">Account information and preferences</li>
          <li class="leading-relaxed">Communication history with our team</li>
        </ul>

        <h4 class="text-lg font-semibold mt-6 mb-3">For Solar Installers/Businesses:</h4>
        <ul class="pl-6 space-y-2">
          <li class="leading-relaxed">Business profile and contact information</li>
          <li class="leading-relaxed">Service area and specialization details</li>
          <li class="leading-relaxed">Lead claims and interaction history</li>
          <li class="leading-relaxed">Project portfolios and showcase images</li>
          <li class="leading-relaxed">Branch locations and team information</li>
          <li class="leading-relaxed">Business verification documents</li>
        </ul>
      </div>
    </div>

    {#if submitted}
      <div class="p-8 bg-[hsl(var(--success))] text-[var(--color-success-foreground)] rounded-lg text-center mb-8">
        <h2 class="text-2xl font-semibold mb-4">Request Submitted Successfully!</h2>
        <p class="mb-4">
          Your data deletion request has been received. We will process your
          request within 30 days and send you a confirmation email once
          completed.
        </p>
        <p>
          If you have any questions, please contact us at <a
            href="mailto:admin@solarvipani.com"
            class="underline hover:no-underline">admin@solarvipani.com</a
          >.
        </p>
      </div>
    {:else}
      <form onsubmit={handleSubmit} class="p-8 bg-[hsl(var(--card))] rounded-lg shadow-md mb-8 dark:bg-[hsl(var(--card))]">
        <div class="mb-6">
          <label for="email" class="block mb-2 font-semibold text-sm">Email Address *</label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            placeholder="Enter your email address (business or personal)"
            class="w-full px-3 py-2 border border-[hsl(var(--border))] rounded transition-colors duration-300 focus:outline-none focus:border-[hsl(var(--accent))] dark:bg-[hsl(var(--background-secondary))] dark:border-[hsl(var(--border))] dark:text-[var(--color-text-primary)]"
          />
        </div>

        <div class="mb-6">
          <label for="phone" class="block mb-2 font-semibold text-sm">Phone Number</label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            placeholder="Enter your phone number (optional)"
            class="w-full px-3 py-2 border border-[hsl(var(--border))] rounded transition-colors duration-300 focus:outline-none focus:border-[hsl(var(--accent))] dark:bg-[hsl(var(--background-secondary))] dark:border-[hsl(var(--border))] dark:text-[var(--color-text-primary)]"
          />
        </div>

        <div class="mb-6">
          <label for="reason" class="block mb-2 font-semibold text-sm">Reason for Deletion (Optional)</label>
          <textarea
            id="reason"
            bind:value={formData.reason}
            placeholder="Please let us know why you're requesting data deletion (customers and installers welcome)"
            rows="4"
            class="w-full px-3 py-2 border border-[hsl(var(--border))] rounded transition-colors duration-300 focus:outline-none focus:border-[hsl(var(--accent))] resize-vertical min-h-24 dark:bg-[hsl(var(--background-secondary))] dark:border-[hsl(var(--border))] dark:text-[var(--color-text-primary)]"
          ></textarea>
        </div>

        {#if error}
          <div class="p-4 bg-[hsl(var(--destructive))] text-[var(--color-destructive-foreground)] rounded text-center mb-4">
            {error}
          </div>
        {/if}

        <button
          type="submit"
          disabled={submitting}
          class="w-full py-2 px-8 bg-[hsl(var(--accent))] text-[var(--color-text-primary)] rounded font-semibold transition-all duration-300 cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Deletion Request"}
        </button>
      </form>
    {/if}

    <div class="p-6 bg-[hsl(var(--muted))] rounded-lg shadow-md dark:bg-[hsl(var(--muted))]">
      <h3 class="text-2xl font-semibold mb-4">Important Information</h3>
      <ul class="pl-6 space-y-2 mb-4">
        <li class="leading-relaxed">Data deletion requests are processed within 30 business days</li>
        <li class="leading-relaxed">
          You will receive a confirmation email once your data has been deleted
        </li>
        <li class="leading-relaxed">
          Some data may be retained for legal compliance purposes (financial
          records, tax documentation, government subsidy records)
        </li>
        <li class="leading-relaxed">
          Deleting your data will remove you from our marketing communications
        </li>
        <li class="leading-relaxed">
          <strong>For Installers:</strong> Your business will be removed from our
          directory and you will no longer receive leads
        </li>
        <li class="leading-relaxed">
          <strong>For Customers:</strong> You will no longer receive solar installation
          quotes or updates
        </li>
      </ul>

      <p class="leading-relaxed">
        For any questions or concerns about your data deletion request, please
        contact us at
        <a href="mailto:admin@solarvipani.com" class="text-[hsl(var(--accent))] hover:underline">admin@solarvipani.com</a>.
      </p>
    </div>
  </div>
</main>
