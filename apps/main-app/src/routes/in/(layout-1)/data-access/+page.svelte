<script>
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

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
      const response = await fetch("/api/submitDataAccess", {
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
  <title>Request My Data | Solar Vipani - Access Your Personal Data</title>
  <meta
    name="description"
    content="Request a copy of the personal data Solar Vipani holds about you. Submit a data access request and we will email you your information within 30 days."
  />
</svelte:head>

<main class="min-h-screen p-[theme(--container-padding)] transition-colors duration-300 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-[2.25rem] font-semibold text-center mb-4 leading-tight md:text-[1.875rem]">Request My Data</h1>

    <div class="mb-8">
      <p class="text-lg leading-relaxed mb-4">
        You have the right to access the personal data we hold about you. Whether
        you are a customer or a registered solar installer on our platform, fill
        out the form below and our team will email you a copy of your data within
        30 days.
      </p>

      <Card class="mb-8">
        <CardHeader>
          <CardTitle>What you can request</CardTitle>
        </CardHeader>
        <CardContent class="gap-3">
          <div>
            <h4 class="font-semibold mb-2 text-base">For Customers:</h4>
            <ul class="pl-4 space-y-1">
              <li class="leading-relaxed">Your contact information (phone number, email address)</li>
              <li class="leading-relaxed">Lead submissions and requirements</li>
              <li class="leading-relaxed">Which installers received your details, and when</li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-2 text-base">For Solar Installers/Businesses:</h4>
            <ul class="pl-4 space-y-1">
              <li class="leading-relaxed">Business profile and contact information</li>
              <li class="leading-relaxed">Service area and specialization details</li>
              <li class="leading-relaxed">Lead claims and interaction history</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    {#if submitted}
      <Alert class="mb-8 bg-[hsl(var(--success))] border-[hsl(var(--success))]">
        <AlertTitle>Request Submitted Successfully!</AlertTitle>
        <AlertDescription>
          <p class="mb-3">
            Your data access request has been received. We will email you a copy
            of your data within 30 days. A confirmation has been sent to the email
            address you provided.
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
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Request a Copy of Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onsubmit={handleSubmit} class="gap-4 flex flex-col">
            <div class="gap-2 flex flex-col">
              <label for="email" class="font-semibold text-sm">Email Address *</label>
              <Input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                placeholder="Enter your email address (business or personal)"
              />
            </div>

            <div class="gap-2 flex flex-col">
              <label for="phone" class="font-semibold text-sm">Phone Number</label>
              <Input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div class="gap-2 flex flex-col">
              <label for="reason" class="font-semibold text-sm">Additional Details (Optional)</label>
              <Textarea
                id="reason"
                bind:value={formData.reason}
                placeholder="Any details that help us locate your records (optional)"
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
              {submitting ? "Submitting..." : "Submit Data Access Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    {/if}

    <Card>
      <CardHeader>
        <CardTitle>Important Information</CardTitle>
      </CardHeader>
      <CardContent class="gap-3 flex flex-col">
        <ul class="pl-4 space-y-1">
          <li class="leading-relaxed">Data access requests are fulfilled within 30 days</li>
          <li class="leading-relaxed">
            We will email your data to the address you provide, so please ensure it
            is correct
          </li>
          <li class="leading-relaxed">
            To protect your privacy, we may ask you to verify your identity before
            releasing data
          </li>
          <li class="leading-relaxed">
            If you instead want your data deleted, use our
            <a href="/in/data-deletion" class="text-[hsl(var(--accent))] hover:underline">Data Deletion</a> page
          </li>
        </ul>

        <p class="leading-relaxed">
          For any questions or concerns about your data access request, please
          contact us at
          <a href="mailto:admin@solarvipani.com" class="text-[hsl(var(--accent))] hover:underline">admin@solarvipani.com</a>.
        </p>
      </CardContent>
    </Card>
  </div>
</main>
