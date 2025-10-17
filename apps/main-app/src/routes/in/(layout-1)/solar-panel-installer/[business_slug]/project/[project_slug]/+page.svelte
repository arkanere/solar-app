<script>
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/in/themeStore";
  import { goto } from "$app/navigation";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";

  // Destructure page data
  $: ({ project, business } = $page.data);
  $: darkMode = $isDarkMode;

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

<main class={darkMode ? "dark" : "light"}>
  <!-- Breadcrumb Navigation -->
  <nav class="breadcrumb">
    <a href="/in">Home</a>
    <span> › </span>
    <button on:click={navigateToDirectory}>
      Solar Installers in {business.city}
    </button>
    <span> › </span>
    <button on:click={navigateToBusinessPage}>
      {business.businessname}
    </button>
    <span> › </span>
    <span class="current">{project.title}</span>
  </nav>

  <!-- Project Header -->
  <header class="project-header">
    <h1>{project.title}</h1>
    <p class="project-meta">
      By <button class="business-link" on:click={navigateToBusinessPage}>
        {business.businessname}
      </button>
      • Completed on {formatDate(project.project_date)}
    </p>
  </header>

  <!-- Project Image -->
  <section class="project-image-section">
    {#if project.cloudinary_public_id}
      <img
        src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_800,h_600,q_auto,f_auto/${project.cloudinary_public_id}`}
        alt={project.title}
        class="project-main-image"
        loading="eager"
      />
    {:else if project.image_url}
      <img
        src={project.image_url}
        alt={project.title}
        class="project-main-image"
        loading="eager"
      />
    {:else}
      <div class="no-image-placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <p>Project Image</p>
      </div>
    {/if}
  </section>

  <!-- Project Details -->
  <section class="project-details">
    <div class="details-grid">
      <div class="detail-card">
        <h3>Location</h3>
        <div class="location-info">
          <p class="detail-value">Pincode: {project.pincode}</p>
          {#if project.city}
            <p class="detail-value city">City: {project.city}</p>
          {/if}
          {#if project.district}
            <p class="detail-value district">District: {project.district}</p>
          {/if}
        </div>
      </div>

      {#if project.cost}
        <div class="detail-card">
          <h3>Project Cost</h3>
          <p class="detail-value">{formatCurrency(project.cost)}</p>
        </div>
      {/if}

      {#if project.savings}
        <div class="detail-card">
          <h3>Annual Savings</h3>
          <p class="detail-value">{formatCurrency(project.savings)}</p>
        </div>
      {/if}
    </div>

    {#if project.description}
      <div class="project-description">
        <h3>Project Description</h3>
        <p>{project.description}</p>
      </div>
    {/if}
  </section>
</main>

<style>
  /* Root variables using custom properties */
  :root {
    /* Colors */
    --primary-color: #0056b3;
    --primary-hover: #004494;
    --primary-light: #e6f0ff;
    --secondary-color: #4caf50;
    --accent-color: #ffc107;

    /* Text colors */
    --text-dark: #2c3e50;
    --text-medium: #546e7a;
    --text-light: #ecf0f1;

    /* Theme colors */
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a202c;
    --light-card-bg: #ffffff;
    --dark-card-bg: #2d3748;

    /* UI elements */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

    /* Typography */
    --font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
    --heading-line-height: 1.2;
    --body-line-height: 1.6;

    /* Layout */
    --section-padding: 2rem 1.5rem;
    --container-width: 1140px;
    --grid-gap: 1.5rem;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  /* Base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Main layout styling */
  main {
    width: 100%;
    font-family: var(--font-family);
    line-height: var(--body-line-height);
    overflow-x: hidden;
    transition:
      background-color var(--transition-medium),
      color var(--transition-medium);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  main > * {
    max-width: var(--container-width);
    width: 100%;
    margin-bottom: 2rem;
  }

  /* Theme styling */
  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  /* Breadcrumb Navigation */
  .breadcrumb {
    margin-bottom: 2rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    background-color: var(--light-card-bg);
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    transition: background-color var(--transition-medium);
  }

  .dark .breadcrumb {
    background-color: var(--dark-card-bg);
  }

  .breadcrumb a,
  .breadcrumb button {
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    cursor: pointer;
    transition: color var(--transition-fast);
    color: var(--primary-color);
  }

  .dark .breadcrumb a,
  .dark .breadcrumb button {
    color: var(--primary-light);
  }

  .breadcrumb a:hover,
  .breadcrumb button:hover {
    text-decoration: underline;
    color: var(--primary-hover);
  }

  .breadcrumb span {
    color: var(--text-medium);
  }

  .dark .breadcrumb span {
    color: #a0aec0;
  }

  .breadcrumb .current {
    font-weight: 500;
    color: var(--text-dark);
  }

  .dark .breadcrumb .current {
    color: var(--text-light);
  }

  /* Project Header */
  .project-header {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(
      135deg,
      var(--primary-color) 0%,
      var(--primary-hover) 100%
    );
    border-radius: var(--border-radius-lg);
    color: white;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .project-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }

  .dark .project-header {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  }

  .project-header h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    line-height: var(--heading-line-height);
    color: white;
    position: relative;
    z-index: 1;
  }

  .project-meta {
    font-size: 1.1rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 1;
  }

  .business-link {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: color var(--transition-fast);
    color: white;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.5);
  }

  .business-link:hover {
    text-decoration-color: white;
  }

  /* Project Image Section */
  .project-image-section {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
    background-color: var(--light-card-bg);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-medium);
  }

  .dark .project-image-section {
    background-color: var(--dark-card-bg);
  }

  .project-image-section:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .project-main-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
    transition: transform var(--transition-medium);
  }

  .project-main-image:hover {
    transform: scale(1.05);
  }

  .no-image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    height: 400px;
    border-radius: var(--border-radius-md);
    border: 2px dashed var(--text-medium);
    background-color: var(--light-bg-color);
    color: var(--text-medium);
  }

  .dark .no-image-placeholder {
    background-color: var(--dark-bg-color);
    color: #a0aec0;
    border-color: #a0aec0;
  }

  .no-image-placeholder svg {
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  .no-image-placeholder p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
  }

  /* Project Details Section */
  .project-details {
    margin-bottom: 2rem;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--grid-gap);
    margin-bottom: 2.5rem;
  }

  .detail-card {
    background-color: var(--light-card-bg);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-medium);
    border: 1px solid rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .dark .detail-card {
    background-color: var(--dark-card-bg);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .detail-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .detail-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-light);
  }

  .dark .detail-card h3 {
    color: var(--primary-light);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .detail-value {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-dark);
  }

  .dark .detail-value {
    color: var(--text-light);
  }

  .location-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .location-info .detail-value {
    font-size: 1.2rem;
  }

  .location-info .detail-value.city,
  .location-info .detail-value.district {
    color: var(--primary-color);
    font-weight: 500;
  }

  .dark .location-info .detail-value.city,
  .dark .location-info .detail-value.district {
    color: var(--primary-light);
  }

  /* Project Description */
  .project-description {
    background-color: var(--light-card-bg);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-medium);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark .project-description {
    background-color: var(--dark-card-bg);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .project-description:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .project-description h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-light);
  }

  .dark .project-description h3 {
    color: var(--primary-light);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .project-description p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-medium);
  }

  .dark .project-description p {
    color: #a0aec0;
  }

  /* Responsive design */
  @media (max-width: 992px) {
    main {
      padding: 1.5rem 1rem;
    }

    .project-header {
      padding: 2.5rem 1.5rem;
    }

    .project-header h1 {
      font-size: 2.2rem;
    }

    .project-image-section {
      padding: 1.5rem;
    }

    .details-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .detail-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem 0.5rem;
    }

    .project-header {
      padding: 2rem 1rem;
    }

    .project-header h1 {
      font-size: 2rem;
    }

    .project-meta {
      font-size: 1rem;
    }

    .breadcrumb {
      font-size: 0.85rem;
      padding: 0.75rem 1rem;
    }

    .project-image-section {
      padding: 1.25rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .detail-card {
      padding: 1.25rem;
    }

    .project-description {
      padding: 1.5rem;
    }

    .project-main-image {
      max-width: 500px;
      max-height: 350px;
    }

    .no-image-placeholder {
      max-width: 500px;
      height: 350px;
    }
  }

  @media (max-width: 576px) {
    .project-header {
      padding: 1.5rem 0.75rem;
    }

    .project-header h1 {
      font-size: 1.8rem;
    }

    .breadcrumb {
      font-size: 0.8rem;
      padding: 0.6rem 0.8rem;
    }

    .project-image-section {
      padding: 1rem;
    }

    .detail-card {
      padding: 1rem;
    }

    .project-description {
      padding: 1.25rem;
    }

    .project-main-image {
      max-width: 400px;
      max-height: 300px;
    }

    .no-image-placeholder {
      max-width: 400px;
      height: 300px;
    }

    .detail-value {
      font-size: 1.3rem;
    }
  }
</style>
