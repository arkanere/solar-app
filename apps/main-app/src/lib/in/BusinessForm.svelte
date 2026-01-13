<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  let businessName = $state("");
  let address = $state("");
  let plusCode = $state("");
  let phoneNumber = $state("");
  let whatsappNumber = $state("");
  let email = $state("");
  let login_email = $state("");
  let website = $state("");
  let gstn = $state("");
  let state = $state("");
  let district = $state("");
  let city = $state("");
  let districts = $state<string[]>([]);
  let cities = $state<string[]>([]);
  let isDistrictLoading = $state(false);
  let isCityLoading = $state(false);
  let isSubmitting = $state(false);

  const states: string[] = [
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

  let errors = $state<Record<string, string>>({
    phoneNumber: "",
    whatsappNumber: "",
    gstn: "",
  });

  $effect(() => {
    if (state) {
      updateDistricts(state);
    }
  });

  async function updateDistricts(selectedState: string): Promise<void> {
    isDistrictLoading = true;
    try {
      const res = await fetch("/in/api/getDistricts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: selectedState }),
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

  $effect(() => {
    if (district) {
      updateCities(district);
    }
  });

  async function updateCities(selectedDistrict: string): Promise<void> {
    isCityLoading = true;
    try {
      const res = await fetch("/in/api/getCities", {
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

  function validatePhoneNumber(): boolean {
    if (!/^\d{10,16}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be between 10 and 16 digits";
      return false;
    } else {
      errors.phoneNumber = "";
      return true;
    }
  }

  function validateWhatsappNumber(): boolean {
    if (whatsappNumber && !/^\d{10,16}$/.test(whatsappNumber)) {
      errors.whatsappNumber =
        "WhatsApp number must be between 10 and 16 digits";
      return false;
    } else {
      errors.whatsappNumber = "";
      return true;
    }
  }

  function validateGSTN(): boolean {
    const gstRegex = /^[0-9A-Z]{15}$/;
    if (!gstRegex.test(gstn)) {
      errors.gstn =
        "GST number must be 15 characters long and contain only uppercase letters and numbers";
      return false;
    } else {
      errors.gstn = "";
      return true;
    }
  }

  function scrollToFirstError(): void {
    const errorFields = document.querySelectorAll(".error");
    if (errorFields.length > 0) {
      errorFields[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (validatePhoneNumber() && validateWhatsappNumber() && validateGSTN()) {
      isSubmitting = true;
      try {
        const response = await fetch("/in/api/submitBusiness", {
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
            state,
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
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h1>Get listed by filling the form below</h1>
  <p>It takes 90 seconds to fill this form</p>

  <!-- Business Name Input -->
  <div>
    <label for="businessName">Business Name:</label>
    <input
      id="businessName"
      type="text"
      bind:value={businessName}
      placeholder="Business Name"
      required
    />
  </div>

  <!-- GSTN Input -->
  <div>
    <label for="gstn">GSTN (Required):</label>
    <input
      id="gstn"
      type="text"
      bind:value={gstn}
      placeholder="GSTN"
      required
      on:blur={validateGSTN}
    />
    {#if errors.gstn}
      <p class="error">{errors.gstn}</p>
    {/if}
  </div>

  <!-- Address Input -->
  <div>
    <label for="address"
      >Address:(Complete address helps in finding your business)</label
    >
    <input
      id="address"
      type="text"
      bind:value={address}
      placeholder="Business Address"
      required
    />
  </div>

  <!-- Plus Code Input -->
  <div>
    <label for="plusCode">Plus Code:(For navigation on google maps)</label>
    <input
      id="plusCode"
      type="text"
      bind:value={plusCode}
      placeholder="Plus Code"
    />
  </div>

  <!-- Phone Number Input -->
  <div>
    <label for="phoneNumber">Phone Number:</label>
    <input
      id="phoneNumber"
      type="text"
      bind:value={phoneNumber}
      placeholder="Phone Number"
      on:blur={validatePhoneNumber}
      required
    />
    {#if errors.phoneNumber}
      <p class="error">{errors.phoneNumber}</p>
    {/if}
  </div>

  <!-- WhatsApp Number Input -->
  <div>
    <label for="whatsappNumber">WhatsApp Number:</label>
    <input
      id="whatsappNumber"
      type="text"
      bind:value={whatsappNumber}
      placeholder="eg +919812345678"
      on:blur={validateWhatsappNumber}
    />
    {#if errors.whatsappNumber}
      <p class="error">{errors.whatsappNumber}</p>
    {/if}
  </div>

  <!-- Email Input -->
  <div>
    <label for="email"
      >Business Email:(Will be displayed on the business profile page)</label
    >
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="Email Address"
      required
    />
  </div>

  <!-- Login_email Input -->
  <div>
    <label for="login_email"
      >Login Email: (You will receive login instructions here)</label
    >
    <input
      id="login_email"
      type="email"
      bind:value={login_email}
      placeholder="Email Address"
      required
    />
  </div>

  <!-- Website Input -->
  <div>
    <label for="website">Website:</label>
    <input
      id="website"
      type="text"
      bind:value={website}
      placeholder="Business Website"
    />
  </div>

  <!-- State Dropdown -->
  <div>
    <label for="state">State:</label>
    <select id="state" bind:value={state} required>
      <option value="">Select a state</option>
      {#each states as state}
        <option value={state}>{state}</option>
      {/each}
    </select>
  </div>

  <!-- District Dropdown -->
  <div>
    <label for="district">District:</label>
    <select
      id="district"
      bind:value={district}
      required
      disabled={!state || isDistrictLoading}
    >
      <option value="">Select a district</option>
      {#if isDistrictLoading}
        <option value="" disabled>Loading districts...</option>
      {/if}
      {#each districts as district}
        <option value={district}>{district}</option>
      {/each}
    </select>
  </div>

  <!-- City Dropdown -->
  <div>
    <label for="city">City:</label>
    <select
      id="city"
      bind:value={city}
      required
      disabled={!district || isCityLoading}
    >
      <option value="">Select a city</option>
      {#if isCityLoading}
        <option value="" disabled>Loading cities...</option>
      {/if}
      {#each cities as city}
        <option value={city}>{city}</option>
      {/each}
    </select>
  </div>

  <!-- Submit Button -->
  <button type="submit" disabled={!isFormValid()}
    >{isSubmitting ? "Submitting..." : "Submit"}</button
  >

  <p class="submission-note">
    You will be redirected after submission. Ensure the next page confirms your
    submission.
  </p>
  <p>
    In case of any issue, call us at <a href="tel:+918983066701"
      >+91 8983066701</a
    >
  </p>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: auto;
  }

  div {
    margin-bottom: 1em;
  }

  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
    text-align: left;
  }

  input,
  select {
    width: 100%;
    padding: 0.5em;
    font-size: 1rem;
    margin-bottom: 0.5em;
  }

  button {
    padding: 0.75em;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #45a049;
  }

  /* Disabled Submit Button */
  button:disabled {
    background-color: #ccc; /* Gray when disabled */
    color: #666; /* Light gray text */
    cursor: not-allowed; /* Indicate it's inactive */
  }

  .error {
    color: red;
    font-size: 0.9rem;
    margin-top: -0.5em;
    margin-bottom: 1em;
  }

  p {
    margin-top: 1em;
  }

  h1 {
    margin-bottom: 1em;
  }
</style>
