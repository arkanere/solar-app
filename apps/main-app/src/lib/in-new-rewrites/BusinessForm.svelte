<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import * as Card from "$lib/components/ui/card";
  import * as Alert from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { INDIAN_STATES, LOCATION_ENDPOINTS } from "$lib/constants/india";
  import { validatePhoneNumber, validateGSTN } from "$lib/constants/formValidation";

  let businessName = $state("");
  let address = $state("");
  let plusCode = $state("");
  let phoneNumber = $state("");
  let whatsappNumber = $state("");
  let email = $state("");
  let login_email = $state("");
  let website = $state("");
  let gstn = $state("");
  let selectedState = $state("");
  let district = $state("");
  let city = $state("");
  let districts: string[] = $state([]);
  let cities: string[] = $state([]);
  let isDistrictLoading = $state(false);
  let isCityLoading = $state(false);
  let isSubmitting = $state(false);

  let errors: Record<string, string> = $state({
    phoneNumber: "",
    whatsappNumber: "",
    gstn: "",
  });

  async function updateDistricts(state: string): Promise<void> {
    isDistrictLoading = true;
    try {
      const res = await fetch(LOCATION_ENDPOINTS.districts, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      const data: { districts: string[] } = await res.json();
      districts = data.districts || [];
      district = "";
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      isDistrictLoading = false;
    }
  }

  async function updateCities(selectedDistrict: string): Promise<void> {
    isCityLoading = true;
    try {
      const res = await fetch(LOCATION_ENDPOINTS.cities, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district: selectedDistrict }),
      });
      const data: { cities: string[] } = await res.json();
      cities = data.cities || [];
      city = "";
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      isCityLoading = false;
    }
  }

  function validatePhoneNumberField(): boolean {
    if (!validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber = "Phone number must be between 10 and 16 digits";
      return false;
    }
    errors.phoneNumber = "";
    return true;
  }

  function validateGSTNField(): boolean {
    if (!validateGSTN(gstn)) {
      errors.gstn = "GST number must be 15 characters long and contain only uppercase letters and numbers";
      return false;
    }
    errors.gstn = "";
    return true;
  }

  function validateWhatsappNumberField(): boolean {
    if (whatsappNumber && !/^\d{10,16}$/.test(whatsappNumber)) {
      errors.whatsappNumber = "WhatsApp number must be between 10 and 16 digits";
      return false;
    }
    errors.whatsappNumber = "";
    return true;
  }

  function scrollToFirstError(): void {
    const errorFields = document.querySelectorAll("[data-error-field]");
    if (errorFields.length > 0) {
      errorFields[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const phoneValid = validatePhoneNumberField();
    const whatsappValid = validateWhatsappNumberField();
    const gstnValid = validateGSTNField();

    if (phoneValid && whatsappValid && gstnValid) {
      isSubmitting = true;
      try {
        const response = await fetch(LOCATION_ENDPOINTS.submitBusiness, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName,
            address,
            plusCode,
            phoneNumber,
            whatsappNumber,
            email,
            login_email,
            website,
            gstn,
            state: selectedState,
            district,
            city,
          }),
        });

        const result: { success: boolean; error?: string } = await response.json();

        if (result.success) {
          goto(`${base}/in/thank-you-business`);
        } else {
          alert(`Submission failed: ${result.error}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(`Error submitting form: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        isSubmitting = false;
      }
    } else {
      scrollToFirstError();
    }
  }

  function isFormValid(): boolean {
    return Object.values(errors).every((error) => error === "");
  }

  $effect(() => {
    if (selectedState) {
      updateDistricts(selectedState);
    }
  });

  $effect(() => {
    if (district) {
      updateCities(district);
    }
  });
</script>

<Card.Root class="w-full max-w-[theme(--max-width-3xl)] mx-auto">
  <Card.Header class="py-[theme(--card-padding-y)]">
    <h1 class="text-[theme(--font-size-2xl)] font-semibold tracking-[theme(--tracking-heading)]">Get listed by filling the form below</h1>
    <p class="text-[theme(--font-size-sm)] mt-[theme(--form-field-gap)] text-muted-foreground">It takes 90 seconds to fill this form</p>
  </Card.Header>

  <Card.Content>
    <form onsubmit={handleSubmit} class="flex flex-col gap-[theme(--form-field-gap)] pb-[theme(--card-padding-y)]">
      <!-- Business Name -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="businessName">Business Name</Label>
        <Input
          id="businessName"
          type="text"
          bind:value={businessName}
          placeholder="Business Name"
          required
        />
      </div>

      <!-- GSTN -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="gstn">GSTN (Required)</Label>
        <Input
          id="gstn"
          type="text"
          bind:value={gstn}
          placeholder="GSTN"
          required
          on:blur={validateGSTNField}
          data-error-field={errors.gstn ? true : undefined}
        />
        {#if errors.gstn}
          <Alert.Root variant="destructive">
            <Alert.Description>{errors.gstn}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>

      <!-- Address -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="address">Address</Label>
        <p class="text-[theme(--font-size-xs)] text-muted-foreground">Complete address helps in finding your business</p>
        <Input
          id="address"
          type="text"
          bind:value={address}
          placeholder="Business Address"
          required
        />
      </div>

      <!-- Plus Code -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="plusCode">Plus Code</Label>
        <p class="text-[theme(--font-size-xs)] text-muted-foreground">For navigation on google maps</p>
        <Input
          id="plusCode"
          type="text"
          bind:value={plusCode}
          placeholder="Plus Code"
        />
      </div>

      <!-- Phone Number -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="text"
          bind:value={phoneNumber}
          placeholder="Phone Number"
          on:blur={validatePhoneNumberField}
          required
          data-error-field={errors.phoneNumber ? true : undefined}
        />
        {#if errors.phoneNumber}
          <Alert.Root variant="destructive">
            <Alert.Description>{errors.phoneNumber}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>

      <!-- WhatsApp Number -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          type="text"
          bind:value={whatsappNumber}
          placeholder="eg +919812345678"
          on:blur={validateWhatsappNumberField}
          data-error-field={errors.whatsappNumber ? true : undefined}
        />
        {#if errors.whatsappNumber}
          <Alert.Root variant="destructive">
            <Alert.Description>{errors.whatsappNumber}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="email">Business Email</Label>
        <p class="text-[theme(--font-size-xs)] text-muted-foreground">Will be displayed on the business profile page</p>
        <Input
          id="email"
          type="email"
          bind:value={email}
          placeholder="Email Address"
          required
        />
      </div>

      <!-- Login Email -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="login_email">Login Email</Label>
        <p class="text-[theme(--font-size-xs)] text-muted-foreground">You will receive login instructions here</p>
        <Input
          id="login_email"
          type="email"
          bind:value={login_email}
          placeholder="Email Address"
          required
        />
      </div>

      <!-- Website -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="website">Website</Label>
        <Input
          id="website"
          type="text"
          bind:value={website}
          placeholder="Business Website"
        />
      </div>

      <!-- State Select -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="state">State</Label>
        <Select.Root type="single" bind:value={selectedState}>
          <Select.Trigger id="state" required>
            {selectedState || "Select a state"}
          </Select.Trigger>
          <Select.Content>
            {#each INDIAN_STATES as state}
              <Select.Item value={state}>{state}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- District Select -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="district">District</Label>
        <Select.Root type="single" bind:value={district} disabled={!selectedState || isDistrictLoading}>
          <Select.Trigger id="district" required>
            {isDistrictLoading ? "Loading districts..." : (district || "Select a district")}
          </Select.Trigger>
          <Select.Content>
            {#each districts as d}
              <Select.Item value={d}>{d}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- City Select -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <Label for="city">City</Label>
        <Select.Root type="single" bind:value={city} disabled={!district || isCityLoading}>
          <Select.Trigger id="city" required>
            {isCityLoading ? "Loading cities..." : (city || "Select a city")}
          </Select.Trigger>
          <Select.Content>
            {#each cities as c}
              <Select.Item value={c}>{c}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <!-- Submit Button -->
      <Button type="submit" disabled={isSubmitting || !isFormValid()} class="w-full">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>

      <!-- Info Messages -->
      <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
        <p class="text-[theme(--font-size-sm)] text-muted-foreground">
          You will be redirected after submission. Ensure the next page confirms your submission.
        </p>
        <p class="text-[theme(--font-size-sm)] text-muted-foreground">
          In case of any issue, call us at <a href="tel:+918983066701" class="text-primary underline">+91 8983066701</a>
        </p>
      </div>
    </form>
  </Card.Content>
</Card.Root>
