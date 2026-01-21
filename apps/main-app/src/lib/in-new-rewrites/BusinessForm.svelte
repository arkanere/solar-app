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

<Card.Root style="width: 100%; max-width: var(--max-width-3xl); margin-left: auto; margin-right: auto;">
  <Card.Header style="padding-top: var(--card-padding-y); padding-bottom: var(--card-padding-y);">
    <h1 style="font-size: var(--font-size-2xl); line-height: var(--font-size-2xl--line-height); font-weight: 600; letter-spacing: var(--tracking-heading);">Get listed by filling the form below</h1>
    <p style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); margin-top: var(--form-field-gap); color: hsl(var(--muted-foreground));">It takes 90 seconds to fill this form</p>
  </Card.Header>

  <Card.Content>
    <form onsubmit={handleSubmit} style="gap: var(--form-field-gap); display: flex; flex-direction: column; padding-bottom: var(--card-padding-y);">
      <!-- Business Name -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
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
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="gstn">GSTN (Required)</Label>
        <Input
          id="gstn"
          type="text"
          bind:value={gstn}
          placeholder="GSTN"
          required
          onblur={validateGSTNField}
          data-error-field={errors.gstn ? true : undefined}
        />
        {#if errors.gstn}
          <Alert.Root variant="destructive">
            <Alert.Description>{errors.gstn}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>

      <!-- Address -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="address">Address</Label>
        <p style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height); color: hsl(var(--muted-foreground));">Complete address helps in finding your business</p>
        <Input
          id="address"
          type="text"
          bind:value={address}
          placeholder="Business Address"
          required
        />
      </div>

      <!-- Plus Code -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="plusCode">Plus Code</Label>
        <p style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height); color: hsl(var(--muted-foreground));">For navigation on google maps</p>
        <Input
          id="plusCode"
          type="text"
          bind:value={plusCode}
          placeholder="Plus Code"
        />
      </div>

      <!-- Phone Number -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="text"
          bind:value={phoneNumber}
          placeholder="Phone Number"
          onblur={validatePhoneNumberField}
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
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          type="text"
          bind:value={whatsappNumber}
          placeholder="eg +919812345678"
          onblur={validateWhatsappNumberField}
          data-error-field={errors.whatsappNumber ? true : undefined}
        />
        {#if errors.whatsappNumber}
          <Alert.Root variant="destructive">
            <Alert.Description>{errors.whatsappNumber}</Alert.Description>
          </Alert.Root>
        {/if}
      </div>

      <!-- Email -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="email">Business Email</Label>
        <p style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height); color: hsl(var(--muted-foreground));">Will be displayed on the business profile page</p>
        <Input
          id="email"
          type="email"
          bind:value={email}
          placeholder="Email Address"
          required
        />
      </div>

      <!-- Login Email -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="login_email">Login Email</Label>
        <p style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height); color: hsl(var(--muted-foreground));">You will receive login instructions here</p>
        <Input
          id="login_email"
          type="email"
          bind:value={login_email}
          placeholder="Email Address"
          required
        />
      </div>

      <!-- Website -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <Label for="website">Website</Label>
        <Input
          id="website"
          type="text"
          bind:value={website}
          placeholder="Business Website"
        />
      </div>

      <!-- State Select -->
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
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
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
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
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
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
      <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
        <p style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); color: hsl(var(--muted-foreground));">
          You will be redirected after submission. Ensure the next page confirms your submission.
        </p>
        <p style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); color: hsl(var(--muted-foreground));">
          In case of any issue, call us at <a href="tel:+918983066701" style="color: hsl(var(--primary)); text-decoration: underline;">+91 8983066701</a>
        </p>
      </div>
    </form>
  </Card.Content>
</Card.Root>
