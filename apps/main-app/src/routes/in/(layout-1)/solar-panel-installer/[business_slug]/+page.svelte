<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import LeadFormBusiness from "$lib/in-new-rewrites/LeadFormBusiness.svelte";
  import SolarSizeCalculator from "$lib/in-new-rewrites/SolarSizeCalculator.svelte";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import AboutSolarVipani from "$lib/in-new-rewrites/AboutSolarVipani.svelte";

  // Destructure page data using derived
  const { business, projects = [], errorMessage } = $derived($page.data);
  const businessSlug = $derived(business?.slug || "");
  const showProjects = $derived(business?.businessfilled && business?.tier3);

  // Function to make call with Umami tracking
  function makeCall(phoneNumber, businessSlug) {
    // Track Umami event after hydration
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track(`call-now-button-${businessSlug}`);
    }
    window.location.href = `tel:${phoneNumber}`;
  }

  // Function to open WhatsApp with Umami tracking
  function openWhatsApp(phoneNumber, businessSlug) {
    // Track Umami event after hydration
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track(`whatsapp-button-${businessSlug}`);
    }
    window.location.href = `https://wa.me/91${phoneNumber.replace(/\D/g, "")}`;
  }

  // Service mappings as a constant object outside component for better performance
  const SERVICE_MAPPING = {
    1: "Solar Panel Installation",
    2: "Net Metering",
    3: "Subsidy Documentation",
    4: "Financing",
    5: "Cleaning of Solar Panels",
    6: "Agricultural Solar Installation",
  };

  // Helper functions
  const getServiceNames = (serviceIds) =>
    serviceIds
      ?.map((id) => SERVICE_MAPPING[id] || "Unknown Service")
      .join(", ") || "";

  const navigateToLogin = () => {
    window.location.href = 'https://business.solarvipani.com/in';
  };
  const navigateToClaim = () =>
    businessSlug && goto(`/in/business/${businessSlug}/claim`);
  const navigateToDirectory = () =>
    business?.city &&
    goto(
      `/in/solar-panel-installer-directory/${encodeURIComponent(business.city)}`,
    );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
</script>

<svelte:head>
  <title
    >{business?.businessname || "Business Not Found"} | Directory Listing - Solar
    Vipani</title
  >
  <meta
    name="description"
    content={business
      ? `Get complete details about ${business.businessname} on Solar Vipani. View contact info, address. Directly reach out to the business to know solar panel price, site visit`
      : "The requested business was not found on Solar Vipani."}
  />
</svelte:head>

<main class="w-full font-sans leading-relaxed overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-4 py-8 min-h-screen bg-background text-foreground">
  {#if business}
    <!-- Business Login (for business owners) -->
    <div class="flex justify-end mb-4 px-4">
      <button
        class="bg-transparent text-muted-foreground border border-border text-xs font-normal px-4 py-2 rounded transition-all opacity-70 hover:opacity-100 hover:bg-muted"
        onclick={business.businessfilled ? navigateToLogin : navigateToClaim}
        title={business.businessfilled
          ? "Business owner login"
          : "Claim this business listing"}
      >
        {business.businessfilled ? "Business Login" : "Claim Business"}
      </button>
    </div>

    <!-- Hero Section -->
    <div class="text-center px-8 py-12 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/70 rounded-2xl text-primary-foreground mb-8 relative overflow-hidden">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">{business.businessname}</h1>
      {#if business.businessfilled && business.tag !== "Blank"}
        <div class="inline-flex items-center text-xs font-medium uppercase tracking-wide mb-6">
          <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-success text-primary-foreground rounded-full text-xs font-bold mr-1">✓</span>
          <span class="text-success">{business.tag}</span>
        </div>
      {/if}
      {#if business.phonenumber}
        <div class="flex justify-center gap-4 flex-wrap">
          <button
            class="flex items-center gap-2 bg-gradient-to-br from-destructive to-destructive/80 text-primary-foreground font-bold text-sm uppercase tracking-wide px-8 py-4 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-40 justify-center md:w-auto"
            onclick={() => makeCall(business.phonenumber, business.slug)}
          >
            <span class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                ></path>
              </svg>
            </span>
            <span>CALL NOW</span>
          </button>
          <button
            class="flex items-center gap-2 bg-gradient-to-br from-success to-success/80 text-primary-foreground font-bold text-sm uppercase tracking-wide px-8 py-4 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-40 justify-center md:w-auto"
            onclick={() => openWhatsApp(business.phonenumber, business.slug)}
          >
            <span class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.345"
                />
              </svg>
            </span>
            <span>WHATSAPP</span>
          </button>
        </div>
      {/if}
    </div>

    <!-- Business Details - Single Combined Card -->
    <div class="mb-8">
      <div class="bg-card rounded-2xl px-8 py-6 shadow-md border border-border transition-all hover:shadow-lg hover:-translate-y-0.5">
        <div class="flex items-center gap-3 mb-4 pb-3 border-b-2 border-border">
          <div class="flex items-center justify-center w-10 h-10 bg-accent-muted rounded-full text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
          </div>
          <h3 class="m-0 text-xl font-semibold text-primary">Business Information</h3>
        </div>

        <div class="flex flex-col gap-6">
          <!-- Description Section -->
          {#if business.businessfilled && business.description}
            <div class="flex flex-col gap-3">
              <h4 class="text-lg font-semibold text-primary m-0 pb-2 border-b-2 border-border">About</h4>
              <p class="m-0 leading-relaxed text-muted-foreground">{business.description}</p>
            </div>
          {/if}

          <!-- Services Section -->
          {#if business.businessfilled && business.services && business.services.length > 0}
            <div class="flex flex-col gap-3">
              <h4 class="text-lg font-semibold text-primary m-0 pb-2 border-b-2 border-border">Services</h4>
              <div class="flex flex-wrap gap-2">
                {#each business.services as serviceId}
                  <span class="bg-accent-muted text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >{SERVICE_MAPPING[serviceId] || "Unknown Service"}</span
                  >
                {/each}
              </div>
            </div>
          {/if}

          <!-- Contact & Location Combined -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Contact Information -->
            <div class="flex flex-col gap-3">
              <h4 class="text-lg font-semibold text-primary m-0 pb-2 border-b-2 border-border">Contact Information</h4>
              <div class="flex flex-col gap-3">
                {#if business.phonenumber}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">📞</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Phone:</span>
                      <a
                        href="tel:{business.phonenumber}"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all"
                        >{business.phonenumber}</a
                      >
                    </div>
                  </div>
                {/if}
                {#if business.email}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">📧</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Email:</span>
                      <a
                        href="mailto:{business.email}"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all">{business.email}</a
                      >
                    </div>
                  </div>
                {/if}
                {#if business.website}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">🌐</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Website:</span>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all">{business.website}</a
                      >
                    </div>
                  </div>
                {/if}
                {#if business.instagram_id}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">📷</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Instagram:</span>
                      <a
                        href="https://instagram.com/{business.instagram_id.replace(
                          '@',
                          '',
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all"
                        >{business.instagram_id}</a
                      >
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Location Information -->
            <div class="flex flex-col gap-3">
              <h4 class="text-lg font-semibold text-primary m-0 pb-2 border-b-2 border-border">Location</h4>
              <div class="flex flex-col gap-3">
                {#if business.address}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">📍</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Address:</span>
                      <span class="text-primary">{business.address}</span>
                    </div>
                  </div>
                {/if}
                {#if business.city}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">🏙️</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">City:</span>
                      <span class="text-primary">{business.city}</span>
                    </div>
                  </div>
                {/if}
                {#if business.state}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">🗺️</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">State:</span>
                      <span class="text-primary">{business.state}</span>
                    </div>
                  </div>
                {/if}
                {#if business.google_maps_link}
                  <div class="flex items-start gap-3">
                    <span class="text-lg flex-shrink-0 mt-0.5">🗺️</span>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Google Maps:</span>
                      <a
                        href={business.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline">View on Map</a
                      >
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Projects Section -->
    {#if showProjects}
      <section class="px-6 py-8 bg-card rounded-2xl shadow-md mb-8 transition-all">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 text-primary text-center">Recent Solar Panel Installation Projects</h2>

        {#if projects.length === 0}
          <div class="text-center py-8 bg-card rounded-lg mb-6 text-muted-foreground">
            No recent projects found for this business.
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {#each projects as project (project.id)}
              <div class="rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 bg-card h-full">
                <a
                  href="/in/solar-panel-installer/{businessSlug}/project/{project.project_slug}"
                  class="block no-underline text-inherit transition-all"
                >
                  <div class="h-48 overflow-hidden relative">
                    {#if project.cloudinary_public_id}
                      <img
                        src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_200,q_auto,f_auto/${project.cloudinary_public_id}`}
                        alt={project.title}
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    {:else if project.image_url}
                      <img
                        src={project.image_url}
                        alt={project.title}
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    {:else}
                      <div class="flex items-center justify-center h-full bg-muted text-muted-foreground font-medium">No Image</div>
                    {/if}
                  </div>

                  <div class="px-6 py-4">
                    <h3 class="mt-0 mb-3 text-xl text-primary font-semibold">{project.title}</h3>
                    <p class="m-2 text-sm text-muted-foreground">Pincode: {project.pincode}</p>
                    <p class="m-2 text-sm text-muted-foreground">
                      Completed on: {formatDate(project.project_date)}
                    </p>
                    {#if project.system_size}
                      <p class="m-0 text-primary font-semibold">
                        System Size: {project.system_size} kW
                      </p>
                    {/if}
                  </div>
                </a>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <h2 class="text-2xl md:text-3xl font-bold mb-4 text-primary text-center">Book Free Consultation To Know Price from {business.businessname}</h2>
      <LeadFormBusiness />
    {/if}

    <!-- Solar Size Calculator Component -->
    <SolarSizeCalculator />

    <!-- Other Businesses in the City -->
    {#if business.city}
      <section class="mt-8 text-center px-6 py-8 bg-card rounded-2xl shadow-md transition-all">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 text-primary">Find Other Solar Businesses in {business.city}</h2>
        <p class="text-lg mb-4 text-muted-foreground">
          If you're interested in exploring other solar businesses in {business.city},
          visit our directory page.
        </p>
        <button onclick={navigateToDirectory} class="bg-transparent border-2 border-primary text-primary font-semibold px-6 py-3 min-w-max transition-all hover:bg-primary/10 hover:-translate-y-0.5">
          View Solar Businesses in {business.city}
        </button>
      </section>
    {/if}
  {:else if errorMessage}
    <p class="text-destructive text-lg font-semibold">{errorMessage}</p>
  {:else}
    <p>Loading...</p>
  {/if}

  <!-- About Solarvipani -->
  <div class="max-w-4xl w-full mb-8">
    <AboutSolarVipani />
  </div>
</main>

<style>
  :global(main > *) {
    @apply max-w-4xl w-full;
  }
</style>
