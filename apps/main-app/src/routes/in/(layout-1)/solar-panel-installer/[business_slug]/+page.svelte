<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import LeadFormSection from "$lib/in-new-rewrites/LeadFormSection.svelte";
  import SolarSizeCalculator from "$lib/in-new-rewrites/SolarSizeCalculator.svelte";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import AboutSolarVipani from "$lib/in-new-rewrites/AboutSolarVipani.svelte";

  // Destructure page data using derived
  const { business, projects = [], errorMessage } = $derived($page.data);
  const businessSlug = $derived(business?.slug || "");
  const showProjects = $derived(business?.businessfilled);

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

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    {#if business}
      <!-- Business Login (for business owners) -->
      <div class="flex justify-end mb-8">
      <Button
        variant="outline"
        size="sm"
        onclick={() => business.businessfilled ? navigateToLogin() : navigateToClaim()}
        title={business.businessfilled
          ? "Business owner login"
          : "Claim this business listing"}
      >
        {business.businessfilled ? "Business Login" : "Claim Business"}
      </Button>
    </div>

      <!-- Hero Section -->
      <div class="text-center px-[theme(--button-padding-x-lg)] py-[theme(--card-padding-y)] bg-primary rounded-[theme(--radius-xl)] text-primary-foreground mb-8 relative overflow-hidden">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">{business.businessname}</h1>
        {#if business.businessfilled && business.tag !== "Blank"}
          <div class="inline-flex items-center text-xs font-medium uppercase tracking-widest mb-4">
            <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-success text-primary-foreground rounded-full text-xs font-bold mr-2">✓</span>
            <span class="text-success">{business.tag}</span>
          </div>
        {/if}
        {#if business.phonenumber}
          <div class="flex justify-center gap-3 flex-wrap">
            <Button
              class="flex items-center gap-3 w-40 justify-center md:w-auto"
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
            </Button>
            <Button
              variant="secondary"
              class="flex items-center gap-3 w-40 justify-center md:w-auto"
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
            </Button>
          </div>
        {/if}
      </div>

      <!-- Business Details - Single Combined Card -->
      <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all w-full">
        <!-- Section Header -->
        <div class="text-center mb-[theme(--spacing-2xl)]">
          <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Business Information</h2>
          <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
            <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
          </div>
        </div>

        <div class="flex flex-col gap-[theme(--spacing-2xl)]">
          <!-- Description Section -->
          {#if business.businessfilled && business.description}
            <div class="flex flex-col gap-[theme(--spacing-md)]">
              <h3 class="text-xl font-semibold text-primary m-0">About</h3>
              <p class="m-0 leading-relaxed text-foreground dark:text-foreground-secondary">{business.description}</p>
            </div>
          {/if}

          <!-- Services Section -->
          {#if business.businessfilled && business.services && business.services.length > 0}
            <div class="flex flex-col gap-[theme(--spacing-md)]">
              <h3 class="text-xl font-semibold text-primary m-0">Services</h3>
              <div class="flex flex-wrap gap-2">
                {#each business.services as serviceId}
                  <span class="bg-accent/10 text-primary px-3 py-1 rounded-md text-xs font-medium border border-accent/30"
                    >{SERVICE_MAPPING[serviceId] || "Unknown Service"}</span
                  >
                {/each}
              </div>
            </div>
          {/if}

          <!-- Contact & Location Combined -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-[theme(--card-gap)]">
            <!-- Contact Information -->
            <div class="flex flex-col gap-[theme(--spacing-md)]">
              <h3 class="text-xl font-semibold text-primary m-0">Contact Information</h3>
              <div class="flex flex-col gap-[theme(--spacing-lg)]">
                {#if business.phonenumber}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Phone</span>
                      <a
                        href="tel:{business.phonenumber}"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all"
                        >{business.phonenumber}</a
                      >
                    </div>
                  </div>
                {/if}
                {#if business.email}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Email</span>
                      <a
                        href="mailto:{business.email}"
                        class="text-primary no-underline transition-colors hover:text-primary/80 hover:underline break-all">{business.email}</a
                      >
                    </div>
                  </div>
                {/if}
                {#if business.website}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M2 12h20"></path>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Website</span>
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
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <circle cx="17.5" cy="6.5" r="1.5"></circle>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Instagram</span>
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
            <div class="flex flex-col gap-[theme(--spacing-md)]">
              <h3 class="text-xl font-semibold text-primary m-0">Location</h3>
              <div class="flex flex-col gap-[theme(--spacing-lg)]">
                {#if business.address}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Address</span>
                      <span class="text-foreground dark:text-foreground-secondary">{business.address}</span>
                    </div>
                  </div>
                {/if}
                {#if business.city}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
                      <path d="M9 9h1v6H9z"></path>
                      <path d="M14 9h1v6h-1z"></path>
                      <path d="M9 4v2M14 4v2"></path>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">City</span>
                      <span class="text-foreground dark:text-foreground-secondary">{business.city}</span>
                    </div>
                  </div>
                {/if}
                {#if business.state}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <circle cx="12" cy="12" r="9"></circle>
                      <path d="M12 7v5l3 3"></path>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">State</span>
                      <span class="text-foreground dark:text-foreground-secondary">{business.state}</span>
                    </div>
                  </div>
                {/if}
                {#if business.google_maps_link}
                  <div class="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-primary flex-shrink-0 mt-1"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9,22 9,12 15,12 15,22"></polyline>
                    </svg>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="font-semibold text-sm text-muted-foreground">Google Maps</span>
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
      </section>

      <!-- Recent Projects Section -->
      {#if showProjects}
        <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] mb-8 transition-all w-full">
          <div class="text-center mb-[theme(--spacing-2xl)]">
            <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Recent Solar Panel Installation Projects</h2>
            <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
              <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
            </div>
          </div>

          {#if projects.length === 0}
            <div class="text-center py-6 bg-card rounded-[theme(--radius-lg)] mb-6 text-muted-foreground">
              No recent projects found for this business.
            </div>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] mt-[theme(--spacing-2xl)]">
              {#each projects as project (project.id)}
                <div class="rounded-[theme(--radius-lg)] overflow-hidden shadow-[theme(--shadow-md)] transition-all hover:shadow-lg hover:-translate-y-1 bg-card h-full">
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
                          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      {:else if project.image_url}
                        <img
                          src={project.image_url}
                          alt={project.title}
                          loading="lazy"
                          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      {:else}
                        <div class="flex items-center justify-center h-full bg-muted text-muted-foreground font-medium">No Image</div>
                      {/if}
                    </div>

                    <div class="px-4 py-3">
                      <h3 class="mt-0 mb-4 text-lg text-primary font-semibold">{project.title}</h3>
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

        <LeadFormSection title="Get Free Quote" city={business.city} hasBusinesses={true} />
      {/if}

      <!-- Solar Size Calculator Component -->
      <div class="mb-8 w-full">
        <SolarSizeCalculator />
      </div>

      <!-- Other Businesses in the City -->
      {#if business.city}
        <section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all w-full">
          <div class="text-center mb-[theme(--spacing-2xl)]">
            <h2 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Find Other Solar Businesses in {business.city}</h2>
            <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
              <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
            </div>
          </div>
          <div class="text-center">
            <p class="text-lg mb-[theme(--spacing-lg)] text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
              If you're interested in exploring other solar businesses in {business.city},
              visit our directory page.
            </p>
            <Button
              variant="outline"
              onclick={navigateToDirectory}
              class="min-w-max"
            >
              View Solar Businesses in {business.city}
            </Button>
          </div>
        </section>
      {/if}
    {:else if errorMessage}
      <p class="text-destructive text-lg font-semibold">{errorMessage}</p>
    {:else}
      <p>Loading...</p>
    {/if}

    <!-- About Solarvipani -->
    <div class="mb-8 w-full">
      <AboutSolarVipani />
    </div>
  </div>
</main>
