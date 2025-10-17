<script>
  // Data for blogs list

  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;

  // Current page number (defaults to 1 for /blogs/+page.svelte)
  export let pageNumber = 1;

  const blogs = [
    {
      title: "What Appliances can be run on Solar?",
      excerpt:
        "Discover the variety of appliances that can be powered by an on-grid solar system, from lighting to entertainment systems.",
      link: "/blogs/appliances-that-can-run-on-solar-power",
    },
    {
      title: "What is the approximate cost of a Solar On Grid System?",
      excerpt:
        "Learn about the costs associated with installing a solar on-grid system, including equipment, labor, and other components.",
      link: "/blogs/cost-of-solar-on-grid-system",
    },
    {
      title:
        "PM Surya Ghar Yojana: Your Guide to check eligibility and steps to benefit from the scheme",
      excerpt:
        "Understand the eligibility criteria and steps to benefit from the government scheme providing subsidies for solar rooftop installations.",
      link: "/blogs/pm-surya-ghar-yojana",
    },
    {
      title: "How to Grow Your Solar Business Online in India",
      excerpt:
        "Explore key strategies such as digital presence, social media, content marketing, SEO, and relationship-building tailored for India's thriving solar market.",
      link: "/blogs/grow-solar-business-online",
    },
    {
      title: "How to Install Solar Panels at Your Home in India",
      excerpt:
        "A concise guide on assessing feasibility, selecting components, managing finances, and ensuring proper installation and maintenance in the Indian context.",
      link: "/blogs/how-to-install-solar-panel-at-home",
    },
    {
      title:
        "Why Hiring a Verified Solar Installer in India Is Essential for Your Home or Business",
      excerpt:
        "Learn about the importance of professional workmanship, safety compliance, maximizing system efficiency, leveraging industry knowledge, and ensuring long-term support.",
      link: "/blogs/hiring-verified-solar-installer-in-india-is-essential",
    },
    {
      title:
        "Demystifying Solar in India: Why Everyone Is Talking About Solar Panels",
      excerpt:
        "Dive into the rising popularity of solar energy, its cost-saving advantages, and how different setups cater to homes, apartments, and businesses across India.",
      link: "/blogs/demystifying-solar-energy-trend-in-india",
    },
    {
      title:
        "Solar Panel Installers in India: Who They Are, What They Do, and Why It Matters",
      excerpt:
        "Discover how professional installers handle site assessments, comply with regulations, and provide tailored solutions for homes, apartments, and businesses across India.",
      link: "/blogs/solar-panel-installers-in-india-explained",
    },
    {
      title:
        "A Case Against DIY Solar Panel Installation in India: Why Going Pro Matters",
      excerpt:
        "Discover the hidden costs, regulatory challenges, and safety risks of do-it-yourself solar setups, and learn how professional installers provide a safer, more efficient solution.",
      link: "/blogs/case-against-diy-solar-panel-installation",
    },
    {
      title:
        "Zero-Upfront Solar Scheme for Apartments: Save Big Now, Enjoy Free Electricity Later",
      excerpt:
        "Learn how this innovative solar plan eliminates installation costs, locks in lower power rates for 12 years, and transfers ownership for decades of nearly free energy.",
      link: "/blogs/zero-upfront-solar-scheme-apartments",
    },
  ];
</script>

<svelte:head>
  <!-- Page Title -->
  <title>Solar Vipani Blog</title>
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogs-list">
    <h1>Blog Posts</h1>
    <ul>
      {#each blogs as blog}
        <li class="blog-item">
          <a href={blog.link}>
            <h2>{blog.title}</h2>
            <p>{blog.excerpt}</p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="pagination">
    <a href="/blogs" class={pageNumber === 1 ? "active" : ""}>1</a>
    <a href="/blogs/page/2" class={pageNumber === 2 ? "active" : ""}>2</a>
    <a href="/blogs/page/3" class={pageNumber === 3 ? "active" : ""}>3</a>
    <a href="/blogs/page/4" class={pageNumber === 4 ? "active" : ""}>4</a>
    <a href="/blogs/page/5" class={pageNumber === 5 ? "active" : ""}>5</a>
    <a href="/blogs/page/6" class={pageNumber === 6 ? "active" : ""}>6</a>
    <a href="/blogs/page/7" class={pageNumber === 7 ? "active" : ""}>7</a>
  </div>
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #0056b3;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-family);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    min-height: 100vh; /* Ensure main fills at least the viewport height */
  }

  /* Light mode */
  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  /* Dark mode */
  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  /* Blog list styling */
  .blogs-list {
    max-width: 650px;
    width: 100%;
  }

  .blogs-list h1 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .blog-item {
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
  }

  .blog-item a {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
  }

  .blog-item a:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .blog-item h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .blog-item p {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      padding: 1.5rem;
    }

    .blog-item h2 {
      font-size: 1.5rem;
    }

    .blog-item p {
      font-size: 1rem;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    gap: 1rem;
    font-size: 1.2rem;
  }

  .pagination a {
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid var(--accent-color);
    border-radius: 4px;
    color: var(--accent-color);
    font-weight: bold;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .pagination a:hover {
    background-color: var(--accent-color);
    color: white;
  }

  .pagination a.active {
    background-color: var(--accent-color);
    color: white;
  }
</style>
