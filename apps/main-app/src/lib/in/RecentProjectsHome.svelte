<script>
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import { isDarkMode } from "$lib/in/themeStore";

  // Props
  let { projects = [] } = $props();

  // Initialize dark mode state
  let darkMode = $derived($isDarkMode);

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
</script>

<section id="recent-projects-home" class={darkMode ? "dark" : "light"}>
  <div class="section-header">
    <h2>Recent Solar Installation Projects</h2>
    <div class="section-divider">
      <span class="divider-accent"></span>
    </div>
    <p class="section-subtitle">
      Explore real solar installations completed by our verified installers
      across India
    </p>
  </div>

  {#if projects && projects.length > 0}
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
            </div>
          </a>
        </div>
      {/each}
    </div>

    <!-- View All Projects CTA -->
    <div class="cta-container">
      <a
        href="/in/recent-solar-installation-projects"
        class="view-all-button"
      >
        View All Projects →
      </a>
    </div>
  {:else}
    <div class="no-projects">
      <p>No recent projects available at the moment.</p>
    </div>
  {/if}
</section>

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
    --section-padding: 4rem 1.5rem;
    --container-width: 1140px;
    --grid-gap: 1.5rem;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  /* Section styling */
  section {
    padding: var(--section-padding);
    margin-bottom: 2rem;
    border-radius: var(--border-radius-lg);
    background-color: var(--light-card-bg);
    box-shadow: var(--shadow-md);
    transition: background-color var(--transition-medium);
  }

  section.dark {
    background-color: var(--dark-card-bg);
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .section-header h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .section-header h2 {
    color: var(--primary-light);
  }

  .section-divider {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem auto;
  }

  .divider-accent {
    width: 80px;
    height: 4px;
    background: var(--accent-color);
    border-radius: 2px;
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: var(--text-medium);
    max-width: 700px;
    margin: 0 auto;
  }

  .dark .section-subtitle {
    color: #a0aec0;
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
    background-color: var(--light-bg-color);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark .project-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .project-card:hover {
    transform: translateY(-5px);
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
    background-color: #f1f1f1;
    color: var(--text-medium);
  }

  .dark .no-image {
    background-color: #2a2a2a;
    color: #a0aec0;
  }

  .project-details {
    padding: 1.5rem;
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
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .location,
  .date,
  .installer {
    font-size: 0.95rem;
    color: var(--text-medium);
  }

  .dark .location,
  .dark .date,
  .dark .installer {
    color: #a0aec0;
  }

  .installer-name {
    font-weight: 500;
    color: var(--primary-color);
  }

  .dark .installer-name {
    color: var(--primary-light);
  }

  /* CTA Container */
  .cta-container {
    text-align: center;
    margin-top: 2rem;
  }

  .view-all-button {
    display: inline-block;
    padding: 1rem 2.5rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: 1.1rem;
    transition:
      background-color var(--transition-medium),
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
    box-shadow: var(--shadow-md);
  }

  .view-all-button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .view-all-button:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  /* No projects message */
  .no-projects {
    text-align: center;
    padding: 2rem;
    color: var(--text-medium);
  }

  .dark .no-projects {
    color: #a0aec0;
  }

  /* Responsive design */
  @media (max-width: 992px) {
    .section-header h2 {
      font-size: 2rem;
    }

    .projects-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 768px) {
    section {
      padding: 2rem 1rem;
    }

    .section-header h2 {
      font-size: 1.8rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }

    .projects-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .project-details {
      padding: 1rem;
    }

    .view-all-button {
      padding: 0.8rem 2rem;
      font-size: 1rem;
    }
  }

  @media (max-width: 576px) {
    section {
      padding: 2rem 0.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .view-all-button {
      width: 90%;
      max-width: 300px;
    }
  }
</style>
