<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";

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

  const navigateToBusinessPage = () => {
    goto(`/in/solar-panel-installer/${business.slug}`);
  };

  const navigateToDirectory = () => {
    goto(
      `/in/solar-panel-installer-directory/${encodeURIComponent(business.city)}`,
    );
  };
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

<main class="w-full font-sans leading-relaxed overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-4 py-8 min-h-screen bg-background text-foreground">
  <!-- Breadcrumb Navigation -->
  <nav class="w-full max-w-[1140px] mb-8 text-sm flex items-center flex-wrap gap-2 bg-card px-6 py-4 rounded-lg shadow-sm transition-colors duration-300">
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
  <header class="w-full max-w-[1140px] text-center py-12 px-8 bg-primary rounded-2xl text-primary-foreground mb-8 relative overflow-hidden">
    <h1 class="text-4xl font-bold m-0 mb-4 leading-tight relative z-10">{project.title}</h1>
    <p class="text-lg m-0 text-primary-foreground/90 relative z-10">
      By <button class="bg-none border-none p-0 font-medium cursor-pointer text-primary-foreground underline underline-offset-2 hover:no-underline transition-all duration-200" onclick={navigateToBusinessPage}>
        {business.businessname}
      </button>
      • Completed on {formatDate(project.project_date)}
    </p>
  </header>

  <!-- Project Image -->
  <section class="w-full max-w-[1140px] flex justify-center mb-12 bg-card px-8 py-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
    {#if project.cloudinary_public_id}
      <img
        src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_800,h_600,q_auto,f_auto/${project.cloudinary_public_id}`}
        alt={project.title}
        class="w-full max-w-[600px] h-auto max-h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    {:else if project.image_url}
      <img
        src={project.image_url}
        alt={project.title}
        class="w-full max-w-[600px] h-auto max-h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    {:else}
      <div class="flex flex-col items-center justify-center w-full max-w-[600px] h-96 rounded-lg border-2 border-dashed border-border bg-background text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          class="mb-4 opacity-60"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <p class="m-0 text-lg font-medium">Project Image</p>
      </div>
    {/if}
  </section>

  <!-- Project Details -->
  <section class="w-full max-w-[1140px] mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <div class="bg-card rounded-2xl px-8 py-8 shadow-md transition-all duration-300 border border-border text-center hover:shadow-lg hover:-translate-y-1.5">
        <h3 class="m-0 mb-4 text-lg font-semibold text-primary uppercase tracking-wide pb-2 border-b-2 border-border">Location</h3>
        <div class="flex flex-col gap-2">
          <p class="m-0 text-2xl font-semibold text-foreground">Pincode: {project.pincode}</p>
          {#if project.city}
            <p class="m-0 text-xl font-medium text-primary">City: {project.city}</p>
          {/if}
          {#if project.district}
            <p class="m-0 text-xl font-medium text-primary">District: {project.district}</p>
          {/if}
        </div>
      </div>

      {#if project.cost}
        <div class="bg-card rounded-2xl px-8 py-8 shadow-md transition-all duration-300 border border-border text-center hover:shadow-lg hover:-translate-y-1.5">
          <h3 class="m-0 mb-4 text-lg font-semibold text-primary uppercase tracking-wide pb-2 border-b-2 border-border">Project Cost</h3>
          <p class="m-0 text-2xl font-semibold text-foreground">{formatCurrency(project.cost)}</p>
        </div>
      {/if}

      {#if project.savings}
        <div class="bg-card rounded-2xl px-8 py-8 shadow-md transition-all duration-300 border border-border text-center hover:shadow-lg hover:-translate-y-1.5">
          <h3 class="m-0 mb-4 text-lg font-semibold text-primary uppercase tracking-wide pb-2 border-b-2 border-border">Annual Savings</h3>
          <p class="m-0 text-2xl font-semibold text-foreground">{formatCurrency(project.savings)}</p>
        </div>
      {/if}
    </div>

    {#if project.description}
      <div class="bg-card rounded-2xl px-8 py-8 shadow-md transition-all duration-300 border border-border hover:shadow-lg hover:-translate-y-0.5">
        <h3 class="m-0 mb-4 text-2xl font-semibold text-primary pb-2 border-b-2 border-border">Project Description</h3>
        <p class="m-0 text-lg leading-relaxed text-muted-foreground">{project.description}</p>
      </div>
    {/if}
  </section>
</main>

