<script>
  import { isDarkMode } from "$lib/themeStore";

  let darkMode = $derived($isDarkMode);

  // Email for submissions
  const submissionEmail = "admin@solarvipani.com";

  // Topics we accept
  const acceptedTopics = [
    {
      title: "Solar Technology & Innovation",
      examples: "New panel technologies, inverter advances, battery storage solutions, smart grid integration"
    },
    {
      title: "Installation Best Practices",
      examples: "Roof assessment, system sizing, wiring standards, safety protocols, maintenance tips"
    },
    {
      title: "Solar Financing & Economics",
      examples: "ROI calculations, subsidy programs, financing options, payback period analysis"
    },
    {
      title: "Policy & Regulations",
      examples: "PM Surya Ghar Yojana updates, net metering policies, state-level incentives, compliance"
    },
    {
      title: "Case Studies & Projects",
      examples: "Real installation projects, challenges overcome, energy savings achieved, lessons learned"
    },
    {
      title: "Sustainability & Impact",
      examples: "Carbon footprint reduction, environmental benefits, grid independence, clean energy transition"
    },
    {
      title: "Consumer Education",
      examples: "System selection guides, vendor evaluation, common mistakes to avoid, warranty understanding"
    },
    {
      title: "Commercial & Industrial Solar",
      examples: "Large-scale installations, business benefits, energy management, corporate sustainability"
    }
  ];

  // Editorial guidelines
  const guidelines = [
    {
      title: "Originality Required",
      description: "All content must be 100% original and unpublished elsewhere. We check for plagiarism."
    },
    {
      title: "Expert-Level Knowledge",
      description: "Articles should demonstrate deep industry expertise and practical experience."
    },
    {
      title: "Data-Driven & Accurate",
      description: "Include credible data, statistics, and cite reliable sources. Technical accuracy is mandatory."
    },
    {
      title: "Non-Promotional Tone",
      description: "Focus on education and value, not product pitches or company promotions."
    },
    {
      title: "Clear & Accessible Writing",
      description: "Write for homeowners and businesses, not just technical experts. Explain jargon."
    },
    {
      title: "Length & Structure",
      description: "1,200-2,500 words ideal. Use headings, bullet points, and clear sections."
    },
    {
      title: "Visual Support",
      description: "Include diagrams, charts, or photos when relevant (with proper attribution)."
    },
    {
      title: "Indian Context",
      description: "Content should be relevant to the Indian solar market, regulations, and climate."
    }
  ];

  // Contributor benefits
  const benefits = [
    {
      icon: "👥",
      title: "Reach Qualified Audience",
      description: "Connect with thousands of homeowners and businesses actively researching solar solutions"
    },
    {
      icon: "🏆",
      title: "Build Authority",
      description: "Establish yourself as a thought leader in India's growing renewable energy sector"
    },
    {
      icon: "🔗",
      title: "Professional Visibility",
      description: "Author bio with link to your professional profile or company website"
    },
    {
      icon: "📊",
      title: "Share Impact",
      description: "Educate the market and accelerate India's solar adoption journey"
    }
  ];
</script>

<svelte:head>
  <title>Contribute as a Solar Expert | Write for Solar Vipani</title>
  <meta
    name="description"
    content="Share your solar expertise with thousands of Indian homeowners and businesses. Contribute original articles on solar technology, installation, policy, and sustainability. Guest writing opportunity for solar professionals."
  />
  <meta
    name="keywords"
    content="solar guest post, write for solar energy, solar expert contributor, renewable energy writing, solar industry articles, guest blogging solar"
  />
  <link rel="canonical" href="https://solarvipani.com/in/write-for-us" />

  <!-- Open Graph -->
  <meta property="og:title" content="Contribute as a Solar Expert | Write for Solar Vipani" />
  <meta property="og:description" content="Share your solar expertise with thousands of Indian homeowners and businesses researching solar solutions." />
  <meta property="og:url" content="https://solarvipani.com/in/write-for-us" />
  <meta property="og:type" content="website" />
</svelte:head>

<main class={darkMode ? "dark" : "light"}>
  <div class="container">
    <!-- Hero Section -->
    <section class="hero-section">
      <h1>Contribute as a Solar Expert</h1>
      <p class="hero-subtitle">
        Share Your Knowledge. Shape India's Solar Future.
      </p>
      <p class="hero-description">
        We invite solar professionals, engineers, researchers, and sustainability experts to contribute original,
        high-quality content that helps homeowners and businesses make informed solar decisions.
      </p>
    </section>

    <!-- Why Contribute Section -->
    <section class="benefits-section">
      <h2>Why Contribute to Solar Vipani?</h2>
      <div class="benefits-grid">
        {#each benefits as benefit}
          <div class="benefit-card">
            <div class="benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Who We're Looking For -->
    <section class="audience-section">
      <h2>Who We're Looking For</h2>
      <div class="audience-content">
        <p>We welcome contributions from credentialed professionals in the solar and renewable energy industry:</p>
        <div class="audience-list">
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Solar Installation Professionals</strong>
              <p>Licensed installers with hands-on experience in residential and commercial projects</p>
            </div>
          </div>
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Electrical & Solar Engineers</strong>
              <p>Technical experts in PV systems, inverters, batteries, and grid integration</p>
            </div>
          </div>
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Energy Consultants & Advisors</strong>
              <p>Professionals guiding customers on system design, financing, and ROI</p>
            </div>
          </div>
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Researchers & Academics</strong>
              <p>Scientists studying solar technology, efficiency, sustainability, or policy</p>
            </div>
          </div>
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Policy & Regulatory Experts</strong>
              <p>Professionals with deep knowledge of solar subsidies, net metering, and compliance</p>
            </div>
          </div>
          <div class="audience-item">
            <span class="check-icon">✓</span>
            <div>
              <strong>Sustainability Professionals</strong>
              <p>Corporate sustainability managers, ESG consultants, and clean energy advocates</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Topics We Accept -->
    <section class="topics-section">
      <h2>What Topics We Accept</h2>
      <p class="section-intro">
        We publish expert content that educates, informs, and empowers our audience. Here are some topic areas we're interested in:
      </p>
      <div class="topics-grid">
        {#each acceptedTopics as topic}
          <div class="topic-card">
            <h3>{topic.title}</h3>
            <p class="topic-examples"><strong>Examples:</strong> {topic.examples}</p>
          </div>
        {/each}
      </div>
      <div class="topics-note">
        <p><strong>Note:</strong> We prioritize actionable, practical content over generic overviews. Case studies and real-world examples are especially valued.</p>
      </div>
    </section>

    <!-- Editorial Guidelines -->
    <section class="guidelines-section">
      <h2>Editorial Guidelines</h2>
      <p class="section-intro">
        To maintain the highest quality standards, all submissions must meet these requirements:
      </p>
      <div class="guidelines-grid">
        {#each guidelines as guideline}
          <div class="guideline-card">
            <h3>{guideline.title}</h3>
            <p>{guideline.description}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Link Policy -->
    <section class="policy-section">
      <h2>Link Policy</h2>
      <div class="policy-content">
        <div class="policy-box allowed">
          <h3>✓ What We Allow</h3>
          <ul>
            <li>Links to credible research papers, government resources, or industry reports</li>
            <li>References to relevant technical standards or certification bodies</li>
            <li>Author bio with one link to your professional LinkedIn or company website</li>
            <li>Links that genuinely add value to the reader's understanding</li>
          </ul>
        </div>
        <div class="policy-box rejected">
          <h3>✗ What We Reject</h3>
          <ul>
            <li>Promotional links to products, services, or unrelated websites</li>
            <li>Affiliate links or commercial referral URLs</li>
            <li>Excessive self-promotion or company advertising within content</li>
            <li>Link exchanges, paid links, or SEO link-building schemes</li>
            <li>Links to low-quality or irrelevant sources</li>
          </ul>
        </div>
        <p class="policy-warning">
          <strong>⚠️ Important:</strong> We are not a platform for link building or SEO backlinks.
          Articles submitted primarily for link placement will be rejected immediately. Our focus is educational value, not search rankings.
        </p>
      </div>
    </section>

    <!-- Submission Process -->
    <section class="submission-section">
      <h2>How to Submit</h2>
      <div class="submission-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Send a Pitch</h3>
            <p>Email us at <a href="mailto:{submissionEmail}">{submissionEmail}</a> with:</p>
            <ul>
              <li>Proposed article title and brief outline (3-5 bullet points)</li>
              <li>Your credentials and relevant experience</li>
              <li>Links to previous published work (if available)</li>
            </ul>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Receive Feedback</h3>
            <p>Our editorial team will review your pitch within 5-7 business days and respond with:</p>
            <ul>
              <li>Approval to proceed with a full draft</li>
              <li>Suggestions for refinement or alternative angles</li>
              <li>Rejection if the topic doesn't align with our audience needs</li>
            </ul>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Submit Full Article</h3>
            <p>If approved, submit your complete article as:</p>
            <ul>
              <li>Google Doc (with comment access) or Word document</li>
              <li>Include all images, charts, or diagrams with proper attribution</li>
              <li>Add a 50-75 word author bio with one professional link</li>
            </ul>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>Review & Publication</h3>
            <p>We will:</p>
            <ul>
              <li>Review for accuracy, clarity, and editorial standards</li>
              <li>Request revisions if needed (you retain final approval)</li>
              <li>Publish approved articles within 2-3 weeks</li>
              <li>Notify you when your article goes live</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Important Disclaimers -->
    <section class="disclaimer-section">
      <h2>Important Notes</h2>
      <div class="disclaimer-box">
        <ul>
          <li><strong>Editorial Control:</strong> We reserve the right to edit submissions for clarity, length, grammar, and style. Major changes will be shared with you for approval.</li>
          <li><strong>Rejection Rights:</strong> We may decline articles that don't meet our quality standards, are overly promotional, or lack relevance to our audience.</li>
          <li><strong>No Payment:</strong> This is an unpaid guest contribution opportunity. The primary benefit is audience reach and professional visibility.</li>
          <li><strong>Content Ownership:</strong> You retain copyright of your work, but grant Solar Vipani non-exclusive rights to publish and promote it.</li>
          <li><strong>No Guaranteed Publication:</strong> Submission does not guarantee publication. We publish based on editorial merit and audience value.</li>
        </ul>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Share Your Expertise?</h2>
      <p>
        Help homeowners and businesses across India make informed solar decisions.
        Your insights can accelerate the clean energy transition.
      </p>
      <p class="cta-email">
        Email us at: <a href="mailto:{submissionEmail}">{submissionEmail}</a>
      </p>
    </section>
  </div>
</main>

<style>
  /* Root variables */
  :root {
    --primary-color: #0056b3;
    --primary-hover: #004494;
    --primary-light: #e6f0ff;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --text-dark: #2c3e50;
    --text-medium: #546e7a;
    --text-light: #ecf0f1;
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a202c;
    --light-card-bg: #ffffff;
    --dark-card-bg: #2d3748;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  main {
    min-height: 100vh;
    font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
    transition: background-color 0.3s ease;
  }

  .light {
    background-color: var(--light-bg-color);
    color: var(--text-dark);
  }

  .dark {
    background-color: var(--dark-bg-color);
    color: var(--text-light);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    padding: 3rem 0 4rem;
  }

  .hero-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  .dark .hero-section h1 {
    color: var(--primary-light);
  }

  .hero-subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-medium);
  }

  .dark .hero-subtitle {
    color: var(--text-light);
  }

  .hero-description {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    color: var(--text-medium);
  }

  .dark .hero-description {
    color: #cbd5e0;
  }

  /* Section Common Styles */
  section {
    margin-bottom: 4rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  .dark h2 {
    color: var(--primary-light);
  }

  .section-intro {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: var(--text-medium);
  }

  .dark .section-intro {
    color: #cbd5e0;
  }

  /* Benefits Grid */
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .benefit-card {
    background: var(--light-card-bg);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .dark .benefit-card {
    background: var(--dark-card-bg);
  }

  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .benefit-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .benefit-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-dark);
  }

  .dark .benefit-card h3 {
    color: var(--text-light);
  }

  .benefit-card p {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-medium);
  }

  .dark .benefit-card p {
    color: #cbd5e0;
  }

  /* Audience Section */
  .audience-content {
    background: var(--light-card-bg);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
  }

  .dark .audience-content {
    background: var(--dark-card-bg);
  }

  .audience-content > p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--text-medium);
  }

  .dark .audience-content > p {
    color: #cbd5e0;
  }

  .audience-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .audience-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .check-icon {
    font-size: 1.5rem;
    color: var(--success-color);
    font-weight: bold;
    flex-shrink: 0;
  }

  .audience-item strong {
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.25rem;
    color: var(--text-dark);
  }

  .dark .audience-item strong {
    color: var(--text-light);
  }

  .audience-item p {
    font-size: 0.95rem;
    color: var(--text-medium);
  }

  .dark .audience-item p {
    color: #cbd5e0;
  }

  /* Topics Grid */
  .topics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .topic-card {
    background: var(--light-card-bg);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid var(--primary-color);
  }

  .dark .topic-card {
    background: var(--dark-card-bg);
  }

  .topic-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--primary-color);
  }

  .dark .topic-card h3 {
    color: var(--primary-light);
  }

  .topic-examples {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-medium);
  }

  .dark .topic-examples {
    color: #cbd5e0;
  }

  .topics-note {
    background: var(--primary-light);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    border-left: 4px solid var(--primary-color);
  }

  .dark .topics-note {
    background: #1e3a5f;
  }

  .topics-note p {
    margin: 0;
    color: var(--text-dark);
  }

  .dark .topics-note p {
    color: var(--text-light);
  }

  /* Guidelines Grid */
  .guidelines-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .guideline-card {
    background: var(--light-card-bg);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
  }

  .dark .guideline-card {
    background: var(--dark-card-bg);
  }

  .guideline-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
  }

  .dark .guideline-card h3 {
    color: var(--text-light);
  }

  .guideline-card p {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-medium);
  }

  .dark .guideline-card p {
    color: #cbd5e0;
  }

  /* Policy Section */
  .policy-content {
    display: grid;
    gap: 2rem;
  }

  .policy-box {
    background: var(--light-card-bg);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
  }

  .dark .policy-box {
    background: var(--dark-card-bg);
  }

  .policy-box.allowed {
    border-left: 4px solid var(--success-color);
  }

  .policy-box.rejected {
    border-left: 4px solid var(--danger-color);
  }

  .policy-box h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  .dark .policy-box h3 {
    color: var(--text-light);
  }

  .policy-box ul {
    list-style: none;
    padding-left: 0;
  }

  .policy-box li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--text-medium);
  }

  .dark .policy-box li {
    color: #cbd5e0;
  }

  .policy-box li::before {
    position: absolute;
    left: 0;
  }

  .policy-box.allowed li::before {
    content: "✓";
    color: var(--success-color);
  }

  .policy-box.rejected li::before {
    content: "✗";
    color: var(--danger-color);
  }

  .policy-warning {
    background: #fff3cd;
    border: 1px solid #ffc107;
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    margin-top: 2rem;
  }

  .dark .policy-warning {
    background: #4a3f2a;
    border-color: #ffc107;
  }

  .policy-warning strong {
    color: #856404;
  }

  .dark .policy-warning strong {
    color: #ffc107;
  }

  /* Submission Steps */
  .submission-steps {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .step {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .step-number {
    background: var(--primary-color);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
    background: var(--light-card-bg);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
  }

  .dark .step-content {
    background: var(--dark-card-bg);
  }

  .step-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--text-dark);
  }

  .dark .step-content h3 {
    color: var(--text-light);
  }

  .step-content p {
    margin-bottom: 0.75rem;
    color: var(--text-medium);
  }

  .dark .step-content p {
    color: #cbd5e0;
  }

  .step-content ul {
    margin-left: 1.5rem;
  }

  .step-content li {
    margin-bottom: 0.5rem;
    color: var(--text-medium);
  }

  .dark .step-content li {
    color: #cbd5e0;
  }

  /* Disclaimer Section */
  .disclaimer-box {
    background: var(--light-card-bg);
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
  }

  .dark .disclaimer-box {
    background: var(--dark-card-bg);
  }

  .disclaimer-box ul {
    list-style: none;
    padding-left: 0;
  }

  .disclaimer-box li {
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
    color: var(--text-medium);
  }

  .dark .disclaimer-box li {
    border-bottom-color: #4a5568;
    color: #cbd5e0;
  }

  .disclaimer-box li:last-child {
    border-bottom: none;
  }

  .disclaimer-box strong {
    color: var(--text-dark);
  }

  .dark .disclaimer-box strong {
    color: var(--text-light);
  }

  /* CTA Section */
  .cta-section {
    text-align: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, #0a4b9e 100%);
    color: white;
    padding: 3rem 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .cta-section h2 {
    color: white;
    margin-bottom: 1rem;
  }

  .cta-section p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-email {
    margin-top: 1.5rem;
    font-size: 1.1rem;
  }

  .cta-email a {
    color: white;
    text-decoration: underline;
  }

  /* Links */
  a {
    color: var(--primary-color);
    transition: color 0.3s ease;
  }

  .dark a {
    color: var(--primary-light);
  }

  a:hover {
    color: var(--primary-hover);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .hero-section h1 {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .benefits-grid,
    .topics-grid,
    .guidelines-grid {
      grid-template-columns: 1fr;
    }

    .step {
      flex-direction: column;
    }

    .step-number {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }
  }
</style>
