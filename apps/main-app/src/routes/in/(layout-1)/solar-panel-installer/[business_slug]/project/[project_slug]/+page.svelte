<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  // Destructure page data using derived
  const { project, business } = $derived($page.data);

  // Helper functions

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  function navigateToBusinessPage() {
    goto(`/in/solar-panel-installer/${business.slug}`);
  }

  function navigateToDirectory() {
    goto(
      `/in/solar-panel-installer-directory/${encodeURIComponent(business.city)}`,
    );
  }
</script>

<svelte:head>
  <title
    >{project?.title || "Project"} by {business?.businessname || "Business"} | Solar
    Vipani</title
  >
  <meta
    name="description"
    content={project
      ? `View details of ${project.title} solar installation project by ${business.businessname}. System size: ${project.system_size}kW, Location: ${project.pincode}`
      : "Solar installation project details on Solar Vipani."}
  />

  <!-- Open Graph tags for better social media sharing -->
  <meta
    property="og:title"
    content="{project?.title} by {business?.businessname}"
  />
  <meta
    property="og:description"
    content="Solar installation project details - {project?.system_size}kW system in {project?.pincode}"
  />
  {#if project?.cloudinary_public_id}
    <meta
      property="og:image"
      content="https://res.cloudinary.com/{PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/{project.cloudinary_public_id}"
    />
  {/if}
</svelte:head>

<main class="w-full font-sans leading-relaxed overflow-x-hidden flex flex-col items-center px-[theme(--spacing-sm)] py-[theme(--spacing-lg)] min-h-screen bg-background text-foreground transition-colors duration-300">
  <!-- Breadcrumb Navigation -->
  <nav class="w-full max-w-[1140px] mb-[theme(--spacing-xl)] text-sm flex items-center flex-wrap gap-[theme(--spacing-sm)] bg-card px-[theme(--container-padding)] py-[theme(--spacing-md)] rounded-[theme(--radius-lg)] shadow-[theme(--shadow-sm)] transition-colors duration-300">
    <a href="/in" class="text-primary hover:text-primary/80 hover:underline transition-colors duration-200">Home</a>
    <span class="text-muted-foreground"> › </span>
    <button onclick={navigateToDirectory} class="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 bg-none border-none p-0 font-inherit cursor-pointer">
      Solar Installers in {business.city}
    </button>
    <span class="text-muted-foreground"> › </span>
    <button onclick={navigateToBusinessPage} class="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 bg-none border-none p-0 font-inherit cursor-pointer">
      {business.businessname}
    </button>
    <span class="text-muted-foreground"> › </span>
    <span class="font-medium text-foreground">{project.title}</span>
  </nav>

  <!-- Project Header -->
  <header class="w-full max-w-[1140px] text-center py-[theme(--spacing-3xl)] px-[theme(--container-padding)] bg-primary rounded-[theme(--radius-xl)] text-primary-foreground mb-[theme(--spacing-xl)] relative overflow-hidden">
    <h1 class="text-4xl font-bold m-0 mb-[theme(--spacing-md)] leading-tight relative z-10">{project.title}</h1>
    <p class="text-lg m-0 text-primary-foreground/90 mb-[theme(--spacing-md)] relative z-10">
      By <button class="bg-none border-none p-0 font-medium cursor-pointer text-primary-foreground underline underline-offset-2 hover:no-underline transition-all duration-200" onclick={navigateToBusinessPage}>
        {business.businessname}
      </button>
      • Completed on {formatDate(project.project_date)}
    </p>
    <div class="flex flex-wrap justify-center items-center gap-[theme(--spacing-lg)] text-sm text-primary-foreground/80 relative z-10">
      {#if project.pincode}
        <span>📍 {project.pincode}</span>
      {/if}
      {#if project.city}
        <span>🏙️ {project.city}</span>
      {/if}
      {#if project.district}
        <span>🗺️ {project.district}</span>
      {/if}
    </div>
  </header>

  <!-- Project Image -->
  <section class="w-full max-w-[1140px] flex justify-center mb-[theme(--spacing-3xl)] bg-card px-[theme(--container-padding)] py-[theme(--container-padding)] rounded-[theme(--radius-xl)] shadow-[theme(--shadow-md)]">
    {#if project.cloudinary_public_id}
      <img
        src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_800,q_auto,f_auto/${project.cloudinary_public_id}`}
        alt={project.title}
        class="w-full max-w-[600px] h-auto object-contain rounded-[theme(--radius-lg)] shadow-[theme(--shadow-md)]"
        loading="eager"
      />
    {:else if project.image_url}
      <img
        src={project.image_url}
        alt={project.title}
        class="w-full max-w-[600px] h-auto object-contain rounded-[theme(--radius-lg)] shadow-[theme(--shadow-md)]"
        loading="eager"
      />
    {:else}
      <div class="flex flex-col items-center justify-center w-full max-w-[600px] h-96 rounded-[theme(--radius-lg)] border-2 border-dashed border-border bg-background text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          class="mb-[theme(--spacing-md)] opacity-60"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <p class="m-0 text-lg font-medium">Project Image</p>
      </div>
    {/if}
  </section>

<!-- View Installer Profile Section -->
  <section class="w-full max-w-[1140px] mb-[theme(--spacing-xl)] rounded-[theme(--radius-lg)] bg-[hsl(var(--accent)/0.1)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all">
    <div class="text-center">
      <h2 class="text-2xl md:text-3xl font-semibold mb-[theme(--spacing-lg)] text-primary">Interested in This Installer?</h2>
      <p class="text-lg mb-[theme(--spacing-lg)] text-foreground dark:text-foreground-secondary max-w-2xl mx-auto">
        View the complete profile of <strong>{business.businessname}</strong> to see all their projects, services, and contact information.
      </p>
      <Button onclick={navigateToBusinessPage} class="font-semibold px-[theme(--button-padding-x-lg)] py-[theme(--button-padding-y-default)]">
        View {business.businessname}'s Profile
      </Button>
    </div>
  </section>

</main>

