<script>
  import QueryForm from "$lib/in/QueryForm.svelte";
  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;

  const socialLinks = [
    {
      label: "Facebook",
      url: "https://www.facebook.com/p/Solar-Vipani-61556033262509/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
    },
    {
      label: "Twitter",
      url: "https://x.com/Solarvipani",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>',
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/solar-vipani/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/solar.vipani/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    },
    {
      label: "WhatsApp",
      url: "https://wa.me/918983066701",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
    },
  ];
</script>

<svelte:head>
  <title
    >About Us | Solar Vipani - Your Trusted Solar Panel Installation Marketplace</title
  >
  <meta
    name="description"
    content="Learn more about Solar Vipani and our mission to connect you with trusted local solar panel installers. We provide reliable information for a smart, hassle-free solar journey."
  />
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="content">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="section-header">
        <h1>About Solar Vipani</h1>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
        <p class="section-subtitle">
          Your trusted marketplace for solar energy solutions
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="introduction-section">
      <div class="intro-content">
        <p class="lead-text">
          Our platform is designed for homeowners and businesses ready to go
          solar but unsure where to start.
        </p>
        <p>
          Finding the right solar panel installer can be overwhelming. We
          simplify this process by connecting you with verified installers,
          ensuring competitive pricing, and giving you peace of mind.
        </p>
        <div class="highlight-box">
          <p>
            <strong
              >We make solar panel installation easy, affordable, and secure by
              matching homeowners and business with reliable local installers
              through our marketplace.</strong
            >
          </p>
        </div>
        <p>
          This is a platform where your journey to a sustainable future is
          streamlined, informed, and supported by digital expertise. We're not
          manufacturers or installers of solar products—instead, we're your
          trusted guide, a digital marketplace that connects you with the top
          Solar installation companies, Solar EPC (Engineering, Procurement, and
          Construction) companies. By bringing together verified solar experts
          and valuable insights, Solar Vipani simplifies your path to solar
          energy adoption.
        </p>
      </div>
    </section>

    <!-- Stats Grid -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card highlight-card">
          <div class="stat-number">450+</div>
          <h3>Verified Businesses</h3>
          <p>Listed across India</p>
        </div>
        <div class="stat-card highlight-card">
          <div class="stat-number">5,000+</div>
          <h3>Cities & Towns</h3>
          <p>Nationwide coverage</p>
        </div>
        <div class="stat-card highlight-card">
          <div class="stat-number">100%</div>
          <h3>Quality Assured</h3>
          <p>Verified solar providers</p>
        </div>
      </div>
    </section>

    <!-- Purpose Section -->
    <section class="purpose-section">
      <div class="section-header">
        <h2>Our Purpose</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <p>
        At Solar Vipani, we believe going solar should be a straightforward,
        empowering choice for everyone. Our mission is to make this transition
        as smooth as possible by <strong
          >connecting you with reputable solar providers who align with your
          specific needs and goals.</strong
        > With us, you can make confident, well-informed decisions that benefit both
        your wallet and the environment.
      </p>
    </section>

    <!-- Expertise Section -->
    <section class="expertise-section">
      <div class="section-header">
        <h2>Our Digital Expertise</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <p>
        As a digital marketing company, we leverage our <strong
          >deep expertise in local search engine optimization, social media and
          search engine advertising</strong
        > to ensure you connect with only the most qualified, certified solar providers
        in your area. We're passionate about simplifying complex choices through
        smart, data-driven connections, so you get the information you need to make
        sustainable decisions without any guesswork.
      </p>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-section">
      <div class="section-header">
        <h2>Why Choose Solar Vipani?</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Quality Assurance</h3>
          <p>
            We rigorously screen every Solar EPC company on our platform, so
            you're only matched with trusted industry leaders.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Unbiased Information</h3>
          <p>
            Solar Vipani is built to inform, not sell. Our platform provides
            objective, detailed information on each solar provider.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Effortless Comparisons</h3>
          <p>
            Comparing options is as easy as browsing. Get insights on service
            quality, equipment standards, and financial benefits at a glance.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Customer-First Support</h3>
          <p>
            Our support team is dedicated to guiding you through every step,
            from initial inquiries to post-installation feedback.
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-header">
        <h2>How Solar Vipani Works</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Assess Your Needs</h3>
          <p>
            Use our intuitive Solar System Calculator to estimate the best
            system size for your energy consumption.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Connect with Experts</h3>
          <p>
            Reach out to vetted, local solar providers who understand your
            unique needs.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Receive Competitive Quotes</h3>
          <p>
            Review quotes from 3 to 5 solar companies, comparing costs,
            equipment, and terms to find the perfect match.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h3>Make an Informed Choice</h3>
          <p>
            Select a provider with complete confidence, backed by transparent,
            verified information.
          </p>
        </div>
        <div class="step-card">
          <div class="step-number">5</div>
          <h3>Share Your Success</h3>
          <p>
            Join our community of solar adopters by sharing your experience,
            helping others on their journey to clean energy.
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <div class="section-header">
        <h2>Building a Brighter Future, Together</h2>
        <div class="section-divider">
          <span class="divider-accent"></span>
        </div>
      </div>
      <p>
        Choosing solar isn't just about savings; it's about building a
        sustainable tomorrow. At Solar Vipani, we're committed to making that
        journey clear and accessible for every household and business. Whether
        you're exploring options for the first time or ready to dive in, we're
        here to guide you every step of the way.
      </p>
      <div class="highlight-box">
        <p>
          <strong
            >Step into a Greener Future with Solar Vipani — where High
            Convenience, Best Price and Low Risk is assured through Design</strong
          >
        </p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section">
      <div class="form-card">
        <div class="section-header">
          <h2>Feel Free to Reach Us</h2>
          <div class="section-divider">
            <span class="divider-accent"></span>
          </div>
          <p class="section-subtitle">Get in touch with our solar experts</p>
        </div>
        <QueryForm />
      </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info-section">
      <div class="solarvipani-contact">
        Write to us at
        <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>
        <br />
        or call us at <a href="tel:+918983066701">+91 8983066701</a>
      </div>

      <div class="social-media">
        <h4>Follow us on:</h4>
        <div class="social-links">
          {#each socialLinks as link}
            <a
              href={link.url}
              target="_blank"
              aria-label={link.label}
              class="social-link"
            >
              {@html link.icon}
              <span>{link.label}</span>
            </a>
          {/each}
        </div>
      </div>

      <div class="legal-links">
        <p>
          <a href="/in/terms-of-use">Terms of Use</a> |
          <a href="/in/privacy-policy">Privacy Policy</a>
        </p>
      </div>
    </section>
  </div>
</main>

<style>
  /* Root variables using patterns from other pages */
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

  /* Base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  main {
    width: 100%;
    font-family: var(--font-family);
    line-height: var(--body-line-height);
    overflow-x: hidden;
    transition:
      background-color var(--transition-medium),
      color var(--transition-medium);
  }

  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  /* Content container */
  .content {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 1rem;
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

  .dark section {
    background-color: var(--dark-card-bg);
  }

  /* Section Headers */
  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .section-header h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
    line-height: var(--heading-line-height);
  }

  .section-header h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
    line-height: var(--heading-line-height);
  }

  .dark .section-header h1,
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

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
    color: white;
    margin-bottom: 0;
  }

  .hero-section .section-header h1,
  .hero-section .section-subtitle {
    color: white;
  }

  /* Introduction Section */
  .introduction-section {
    background-color: var(--primary-light);
  }

  .dark .introduction-section {
    background-color: rgba(0, 86, 179, 0.15);
  }

  .lead-text {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  .dark .lead-text {
    color: var(--primary-light);
  }

  .highlight-box {
    background: var(--accent-color);
    color: var(--text-dark);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    margin: 2rem 0;
    text-align: center;
  }

  .highlight-box p {
    margin: 0;
    font-size: 1.1rem;
  }

  /* Stats Section */
  .stats-section {
    padding: 3rem 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--grid-gap);
  }

  .stat-card {
    padding: 2rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-bg-color);
    border: 1px solid #e2e8f0;
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .stat-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }

  .dark .stat-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: #4a5568;
  }

  .highlight-card {
    border-top: 4px solid var(--accent-color);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .dark .stat-number {
    color: #90caf9;
  }

  .stat-card h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }

  .dark .stat-card h3 {
    color: #90caf9;
  }

  .stat-card p {
    font-size: 1rem;
    color: var(--text-medium);
    margin: 0;
  }

  .dark .stat-card p {
    color: #cbd5e0;
  }

  /* Features Grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--grid-gap);
  }

  .feature-card {
    padding: 2rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-bg-color);
    border: 1px solid #e2e8f0;
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    text-align: center;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  .dark .feature-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: #4a5568;
  }

  .dark .feature-card:hover {
    border-color: var(--primary-light);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  .feature-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .feature-card h3 {
    color: var(--primary-light);
  }

  .feature-card p {
    color: var(--text-medium);
    line-height: 1.6;
    margin: 0;
  }

  .dark .feature-card p {
    color: #a0aec0;
  }

  /* Steps Grid */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--grid-gap);
  }

  .step-card {
    padding: 2rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--light-bg-color);
    border: 1px solid #e2e8f0;
    transition:
      transform var(--transition-medium),
      box-shadow var(--transition-medium);
    text-align: center;
    position: relative;
  }

  .step-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .dark .step-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-color: #4a5568;
  }

  .step-number {
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 auto 1rem;
  }

  .step-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .step-card h3 {
    color: var(--primary-light);
  }

  .step-card p {
    color: var(--text-medium);
    line-height: 1.6;
    margin: 0;
  }

  .dark .step-card p {
    color: #a0aec0;
  }

  /* Contact Form Section */
  .contact-form-section {
    padding: 0;
    box-shadow: none;
    background-color: transparent;
  }

  .form-card {
    background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
    color: white;
    padding: 3rem 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .form-card .section-header h2 {
    color: white;
  }

  .form-card .section-subtitle {
    color: rgba(255, 255, 255, 0.9);
  }

  .form-card .divider-accent {
    background: var(--accent-color);
  }

  /* Contact Info Section */
  .contact-info-section {
    text-align: center;
    padding: 2rem 1.5rem;
  }

  .solarvipani-contact {
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .solarvipani-contact a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    margin: 0 0.5rem;
  }

  .solarvipani-contact a:hover {
    text-decoration: underline;
  }

  .dark .solarvipani-contact a {
    color: var(--primary-light);
  }

  /* Social Media Links */
  .social-media {
    margin: 2rem 0;
  }

  .social-media h4 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  .dark .social-media h4 {
    color: #e2e8f0;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition:
      color var(--transition-fast),
      transform var(--transition-fast);
  }

  .social-link:hover {
    color: var(--primary-hover);
    transform: translateY(-3px);
  }

  .dark .social-link {
    color: #90caf9;
  }

  .dark .social-link:hover {
    color: #64b5f6;
  }

  /* Legal Links */
  .legal-links {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
  }

  .dark .legal-links {
    border-top-color: #4a5568;
  }

  .legal-links a {
    color: var(--primary-color);
    text-decoration: none;
    margin: 0 0.5rem;
    font-weight: 500;
  }

  .legal-links a:hover {
    text-decoration: underline;
  }

  .dark .legal-links a {
    color: var(--primary-light);
  }

  /* Typography */
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* Responsive Styling */
  @media (max-width: 992px) {
    .section-header h1 {
      font-size: 2.5rem;
    }

    .section-header h2 {
      font-size: 2rem;
    }

    .stats-grid,
    .features-grid,
    .steps-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .section-header h1 {
      font-size: 2rem;
    }

    .section-header h2 {
      font-size: 1.8rem;
    }

    .stats-grid,
    .features-grid,
    .steps-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .stat-card,
    .feature-card,
    .step-card {
      padding: 1.5rem 1rem;
    }

    .social-links {
      flex-direction: column;
      align-items: center;
    }
  }

  @media (max-width: 576px) {
    .section-header h1 {
      font-size: 1.8rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
    }

    .stat-number {
      font-size: 2rem;
    }

    .feature-icon {
      font-size: 2rem;
    }

    .step-number {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }
  }
</style>
