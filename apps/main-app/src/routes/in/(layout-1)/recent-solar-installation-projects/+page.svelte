<script>
  /** @type {import('./$types').PageData} */
  export let data;
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import { isDarkMode } from "$lib/in/themeStore";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;

  // Get current page from data (this is always page 1 for the main route)
  $: currentPage = 1;
  $: totalPages = data.pagination?.totalPages || 1;
  $: projects = data.projects || [];

  // Format date to a more readable format
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Convert business slug to a more readable name (e.g., "acme-installers" -> "Acme Installers")
  function formatBusinessName(slug) {
    if (!slug) return "Unknown";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Generate pagination links
  function generatePaginationLinks(current, total) {
    const links = [];
    const maxVisible = 7;

    if (total <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        links.push(i);
      }
    } else {
      // Always show first page
      links.push(1);

      if (current > 3) {
        links.push("...");
      }

      // Show current page and neighbors
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (!links.includes(i)) {
          links.push(i);
        }
      }

      if (current < total - 2) {
        links.push("...");
      }

      // Always show last page
      if (!links.includes(total)) {
        links.push(total);
      }
    }

    return links;
  }

  $: paginationLinks = generatePaginationLinks(currentPage, totalPages);
</script>

<svelte:head>
  <title
    >Recent Solar Installation Projects in India | Solar Vipani Gallery</title
  >
  <meta
    name="description"
    content="Browse latest solar panel installation projects across India. See real installations by verified solar installers with system sizes, locations & completion dates. Inspire your solar journey."
  />

  <!-- Enhanced Keywords -->
  <meta
    name="keywords"
    content="solar installation projects India, recent solar installations, solar panel gallery, rooftop solar projects, solar project showcase, completed solar installations, solar installer portfolio, India solar projects"
  />

  <!-- Geographic targeting -->
  <meta name="geo.region" content="IN" />
  <meta name="geo.country" content="India" />

  <!-- Canonical URL -->
  <link
    rel="canonical"
    href="https://solarvipani.com/recent-solar-installation-projects"
  />

  <!-- Open Graph Tags -->
  <meta
    property="og:title"
    content="Recent Solar Installation Projects in India | Solar Vipani Gallery"
  />
  <meta
    property="og:description"
    content="Browse latest solar panel installation projects across India. See real installations by verified solar installers with system sizes, locations & completion dates."
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content="https://solarvipani.com/recent-solar-installation-projects"
  />
  <meta
    property="og:image"
    content="https://solarvipani.com/images/solar-projects-gallery-og.jpg"
  />
  <meta property="og:site_name" content="Solar Vipani" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Recent Solar Installation Projects in India | Solar Vipani Gallery"
  />
  <meta
    name="twitter:description"
    content="Browse latest solar panel installation projects across India. Real installations by verified installers."
  />
  <meta
    name="twitter:image"
    content="https://solarvipani.com/images/solar-projects-gallery-twitter.jpg"
  />
  <meta name="twitter:site" content="@solarvipani" />

  <!-- Additional SEO Meta Tags -->
  <meta name="author" content="Solar Vipani" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Recent Solar Installation Projects",
      "description": "Gallery of recent solar panel installation projects across India by verified installers",
      "url": "https://solarvipani.com/recent-solar-installation-projects",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Solar Installation Projects",
        "description": "Recent solar panel installations by verified installers across India"
      },
      "provider": {
        "@type": "Organization",
        "name": "Solar Vipani",
        "url": "https://solarvipani.com"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://solarvipani.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Recent Solar Projects",
            "item": "https://solarvipani.com/recent-solar-installation-projects"
          }
        ]
      }
    }
  </script>

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Solar Vipani",
      "url": "https://solarvipani.com",
      "logo": "https://solarvipani.com/logo512.png",
      "description": "India's leading solar panel installer directory connecting customers with verified solar installation services",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8983066701",
        "contactType": "customer service",
        "email": "admin@solarvipani.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.facebook.com/solarvipani",
        "https://www.linkedin.com/company/solarvipani",
        "https://twitter.com/solarvipani"
      ]
    }
  </script>
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <h1>Recent Solar Installation Projects</h1>

  <section id="recent-projects">
    {#if !data.success}
      <div class="error-message" role="alert">
        <p>Error: {data.error || "Failed to load projects"}</p>
      </div>
    {:else if projects.length === 0}
      <div class="warning-message" role="alert">
        <p>No projects found.</p>
      </div>
    {:else}
      <div class="projects-grid">
        {#each projects as project (project.id)}
          <div class="project-card">
            <a
              href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
              class="project-link"
              rel="noopener"
            >
              <div class="project-image">
                {#if project.cloudinary_public_id}
                  <img
                    src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${project.cloudinary_public_id}`}
                    alt="{project.title} - Solar installation project in {project.pincode ||
                      'India'}"
                    width="300"
                    height="300"
                    loading="lazy"
                  />
                {:else if project.image_url}
                  <img
                    src={project.image_url}
                    alt="{project.title} - Solar installation project in {project.pincode ||
                      'India'}"
                    loading="lazy"
                    width="300"
                    height="300"
                  />
                {:else}
                  <div class="no-image">No Image</div>
                {/if}
              </div>

              <div class="project-details">
                <h3>{project.title}</h3>
                <p class="location">Pincode: {project.pincode || "N/A"}</p>
                <p class="date">
                  Completed on: {formatDate(project.project_date)}
                </p>
                <p class="installer">
                  Installer: <span class="installer-name"
                    >{formatBusinessName(project.business_slug)}</span
                  >
                </p>
                {#if project.system_size}
                  <p class="system-size">
                    System Size: {project.system_size} kW
                  </p>
                {/if}
              </div>
            </a>
          </div>
        {/each}
      </div>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="pagination">
          <!-- Next button (since this is page 1, only show next) -->
          {#if currentPage < totalPages}
            <a
              href="/in/recent-solar-installation-projects/2"
              class="pagination-button next"
            >
              Next →
            </a>
          {/if}

          <!-- Page numbers -->
          {#each paginationLinks as link}
            {#if link === "..."}
              <span class="pagination-ellipsis">...</span>
            {:else if link === currentPage}
              <span class="pagination-button active">{link}</span>
            {:else}
              <a
                href={link === 1
                  ? "/in/recent-solar-installation-projects"
                  : `/in/recent-solar-installation-projects/${link}`}
                class="pagination-button"
              >
                {link}
              </a>
            {/if}
          {/each}
        </div>
      {/if}
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

  main > section {
    max-width: var(--container-width);
    width: 100%;
    margin-bottom: 2.5rem;
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

  /* Section styling */
  section {
    padding: var(--section-padding);
    transition: background-color var(--transition-medium);
  }

  .dark section {
    background-color: transparent;
  }

  /* Typography */
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
    color: var(--primary-color);
    line-height: var(--heading-line-height);
  }

  .dark h1 {
    color: var(--primary-light);
  }

  /* Section heading styles */
  section h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark section h2 {
    color: var(--primary-light);
  }

  /* Paragraph styling */
  p {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    line-height: 1.6;
    color: var(--text-medium);
  }

  .dark p {
    color: #cbd5e0;
  }

  /* Project cards */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--grid-gap);
    width: 100%;
    margin-bottom: 2rem;
  }

  .project-card {
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    background-color: var(--light-card-bg);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark .project-card {
    background-color: var(--dark-card-bg);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  /* Project link styling */
  .project-link {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .project-link:hover {
    text-decoration: none;
  }

  .project-image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    position: relative;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .light .no-image {
    background-color: #f1f1f1;
    color: var(--text-medium);
  }

  .dark .no-image {
    background-color: #2a2a2a;
    color: #a0aec0;
  }

  .project-details {
    padding: 1rem;
  }

  .project-details h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-color);
    text-align: left;
  }

  .dark .project-details h3 {
    color: var(--primary-light);
  }

  .project-details p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .location,
  .date,
  .installer,
  .system-size {
    font-size: 0.95rem;
    color: var(--text-medium);
  }

  .dark .location,
  .dark .date,
  .dark .installer,
  .dark .system-size {
    color: #a0aec0;
  }

  .installer-name {
    font-weight: 500;
    color: var(--primary-color);
  }

  .dark .installer-name {
    color: var(--primary-light);
  }

  .error-message,
  .warning-message {
    padding: 1rem;
    border-radius: var(--border-radius-md);
    margin-bottom: 1.5rem;
  }

  .error-message {
    background-color: #ffebee;
    border: 1px solid #f44336;
    color: #b71c1c;
  }

  .dark .error-message {
    background-color: rgba(244, 67, 54, 0.2);
    border-color: #f44336;
    color: #ef9a9a;
  }

  .warning-message {
    background-color: #fff8e1;
    border: 1px solid #ffc107;
    color: #ff6f00;
  }

  .dark .warning-message {
    background-color: rgba(255, 193, 7, 0.2);
    border-color: #ffc107;
    color: #ffcc80;
  }

  /* Pagination styles */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pagination-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    text-decoration: none;
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius-sm);
    color: var(--primary-color);
    font-weight: 500;
    transition: all var(--transition-fast);
    min-width: 40px;
    height: 40px;
  }

  .pagination-button:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-1px);
  }

  .pagination-button.active {
    background-color: var(--primary-color);
    color: white;
    cursor: default;
  }

  .pagination-button.next {
    padding: 0.5rem 1.5rem;
    min-width: auto;
  }

  .pagination-ellipsis {
    padding: 0.5rem;
    color: var(--text-medium);
  }

  .dark .pagination-button {
    border-color: var(--primary-light);
    color: var(--primary-light);
  }

  .dark .pagination-button:hover {
    background-color: var(--primary-light);
    color: var(--dark-bg-color);
  }

  .dark .pagination-button.active {
    background-color: var(--primary-light);
    color: var(--dark-bg-color);
  }

  .dark .pagination-ellipsis {
    color: #a0aec0;
  }

  /* Responsive design */
  @media (max-width: 992px) {
    main {
      padding: 1.5rem 1rem;
    }

    h1 {
      font-size: 2.2rem;
    }

    .projects-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem 0.5rem;
    }

    section {
      padding: 1.5rem 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  @media (max-width: 576px) {
    h1 {
      font-size: 1.8rem;
    }

    .project-card {
      padding: 1rem;
    }
  }
</style>
