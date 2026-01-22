<script>
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";

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

<main class="min-h-screen p-[theme(--container-padding)] transition-colors duration-300 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-[2.25rem] font-semibold text-center mb-[theme(--spacing-lg)] leading-tight md:text-[1.875rem]">Data Deletion Request</h1>

    <div class="mb-[theme(--spacing-2xl)]">
      <p class="text-[theme(--font-size-lg)] leading-relaxed mb-[theme(--spacing-lg)]">
        We respect your privacy and your right to control your personal data.
        Whether you are a customer or a registered solar installer on our
        platform, if you would like to request deletion of your personal
        information from our database, please fill out the form below.
      </p>

      <Card class="mb-[theme(--spacing-2xl)]">
        <CardHeader>
          <CardTitle>What data will be deleted?</CardTitle>
        </CardHeader>
        <CardContent class="gap-[theme(--spacing-md)]">
          <div>
            <h4 class="font-semibold mb-[theme(--spacing-sm)] text-[theme(--font-size-base)]">For Customers:</h4>
            <ul class="pl-[theme(--spacing-lg)] space-y-[theme(--spacing-xs)]">
              <li class="leading-relaxed">Your contact information (phone number, email address)</li>
              <li class="leading-relaxed">Lead submissions and requirements</li>
              <li class="leading-relaxed">Account information and preferences</li>
              <li class="leading-relaxed">Communication history with our team</li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-[theme(--spacing-sm)] text-[theme(--font-size-base)]">For Solar Installers/Businesses:</h4>
            <ul class="pl-[theme(--spacing-lg)] space-y-[theme(--spacing-xs)]">
              <li class="leading-relaxed">Business profile and contact information</li>
              <li class="leading-relaxed">Service area and specialization details</li>
              <li class="leading-relaxed">Lead claims and interaction history</li>
              <li class="leading-relaxed">Project portfolios and showcase images</li>
              <li class="leading-relaxed">Branch locations and team information</li>
              <li class="leading-relaxed">Business verification documents</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    {#if submitted}
      <Alert class="mb-[theme(--spacing-2xl)] bg-[hsl(var(--success))] border-[hsl(var(--success))]">
        <AlertTitle>Request Submitted Successfully!</AlertTitle>
        <AlertDescription>
          <p class="mb-[theme(--spacing-md)]">
            Your data deletion request has been received. We will process your
            request within 30 days and send you a confirmation email once
            completed.
          </p>
          <p>
            If you have any questions, please contact us at <a
              href="mailto:admin@solarvipani.com"
              class="text-[hsl(var(--accent))] hover:underline">admin@solarvipani.com</a
            >.
          </p>
        </AlertDescription>
      </Alert>
    {:else}
      <Card class="mb-[theme(--spacing-2xl)]">
        <CardHeader>
          <CardTitle>Request Data Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onsubmit={handleSubmit} class="gap-[theme(--spacing-lg)] flex flex-col">
            <div class="gap-[theme(--spacing-sm)] flex flex-col">
              <label for="email" class="font-semibold text-[theme(--font-size-sm)]">Email Address *</label>
              <Input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                placeholder="Enter your email address (business or personal)"
              />
            </div>

            <div class="gap-[theme(--spacing-sm)] flex flex-col">
              <label for="phone" class="font-semibold text-[theme(--font-size-sm)]">Phone Number</label>
              <Input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div class="gap-[theme(--spacing-sm)] flex flex-col">
              <label for="reason" class="font-semibold text-[theme(--font-size-sm)]">Reason for Deletion (Optional)</label>
              <Textarea
                id="reason"
                bind:value={formData.reason}
                placeholder="Please let us know why you're requesting data deletion (customers and installers welcome)"
                rows={4}
              />
            </div>

            {#if error}
              <Alert class="bg-[hsl(var(--destructive))] border-[hsl(var(--destructive))]">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            {/if}

            <Button
              type="submit"
              disabled={submitting}
              class="w-full"
            >
              {submitting ? "Submitting..." : "Submit Deletion Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    {/if}

    <Card>
      <CardHeader>
        <CardTitle>Important Information</CardTitle>
      </CardHeader>
      <CardContent class="gap-[theme(--spacing-md)] flex flex-col">
        <ul class="pl-[theme(--spacing-lg)] space-y-[theme(--spacing-xs)]">
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
      </CardContent>
    </Card>
  </div>
</main>
