<script>
  import { Card } from "$lib/components/ui/card";

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

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Hero Section -->
    <section class="rounded-[theme(--radius-lg)] bg-gradient-to-r from-primary to-primary text-primary-foreground p-[theme(--card-padding-y)] shadow-[theme(--shadow-sm)]">
      <div class="text-center mb-[theme(--card-gap)]">
        <h1 class="text-4xl md:text-4xl font-bold mb-[theme(--spacing-lg)] text-primary-foreground">About Solar Vipani</h1>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
        <p class="text-lg text-primary-foreground max-w-2xl mx-auto">
          Your trusted marketplace for solar energy solutions
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="rounded-[theme(--radius-lg)] bg-accent-muted p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div>
        <p class="text-lg font-medium text-primary mb-[theme(--spacing-2xl)]">
          Our platform is designed for homeowners and businesses ready to go
          solar but unsure where to start.
        </p>
        <p class="text-base text-foreground dark:text-foreground-secondary mb-[theme(--spacing-2xl)] leading-relaxed">
          Finding the right solar panel installer can be overwhelming. We
          simplify this process by connecting you with verified installers,
          ensuring competitive pricing, and giving you peace of mind.
        </p>
        <div class="bg-accent text-foreground p-[theme(--spacing-lg)] rounded-[theme(--radius-md)] mb-[theme(--spacing-2xl)] text-center">
          <p class="text-base">
            <strong
              >We make solar panel installation easy, affordable, and secure by
              matching homeowners and business with reliable local installers
              through our marketplace.</strong
            >
          </p>
        </div>
        <p class="text-base text-foreground dark:text-foreground-secondary leading-relaxed">
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
    <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)]">
        <Card class="p-[theme(--spacing-lg)] border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-md)] transition-all text-center">
          <div class="text-4xl font-bold text-primary mb-[theme(--spacing-sm)]">450+</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-sm)]">Verified Businesses</h3>
          <p class="text-foreground dark:text-foreground-secondary">Listed across India</p>
        </Card>
        <Card class="p-[theme(--spacing-lg)] border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-md)] transition-all text-center">
          <div class="text-4xl font-bold text-primary mb-[theme(--spacing-sm)]">5,000+</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-sm)]">Cities & Towns</h3>
          <p class="text-foreground dark:text-foreground-secondary">Nationwide coverage</p>
        </Card>
        <Card class="p-[theme(--spacing-lg)] border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-md)] transition-all text-center">
          <div class="text-4xl font-bold text-primary mb-[theme(--spacing-sm)]">100%</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-sm)]">Quality Assured</h3>
          <p class="text-foreground dark:text-foreground-secondary">Verified solar providers</p>
        </Card>
      </div>
    </section>

    <!-- Purpose Section -->
    <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Our Purpose</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <p class="text-base text-foreground dark:text-foreground-secondary leading-relaxed">
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
    <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Our Digital Expertise</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <p class="text-base text-foreground dark:text-foreground-secondary leading-relaxed">
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
    <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Why Choose Solar Vipani?</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)]">
        <Card class="p-[theme(--spacing-lg)] hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center">
          <div class="text-4xl mb-[theme(--spacing-lg)] block">⚡</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-lg)]">Quality Assurance</h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            We rigorously screen every Solar EPC company on our platform, so
            you're only matched with trusted industry leaders.
          </p>
        </Card>
        <Card class="p-[theme(--spacing-lg)] hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center">
          <div class="text-4xl mb-[theme(--spacing-lg)] block">📊</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-lg)]">Unbiased Information</h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Solar Vipani is built to inform, not sell. Our platform provides
            objective, detailed information on each solar provider.
          </p>
        </Card>
        <Card class="p-[theme(--spacing-lg)] hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center">
          <div class="text-4xl mb-[theme(--spacing-lg)] block">🔍</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-lg)]">Effortless Comparisons</h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Comparing options is as easy as browsing. Get insights on service
            quality, equipment standards, and financial benefits at a glance.
          </p>
        </Card>
        <Card class="p-[theme(--spacing-lg)] hover:shadow-[theme(--shadow-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center">
          <div class="text-4xl mb-[theme(--spacing-lg)] block">🎯</div>
          <h3 class="text-lg font-semibold text-primary mb-[theme(--spacing-lg)]">Customer-First Support</h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Our support team is dedicated to guiding you through every step,
            from initial inquiries to post-installation feedback.
          </p>
        </Card>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-sm)]">
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Building a Brighter Future, Together</h2>
        <div class="flex justify-center items-center my-[theme(--spacing-lg)]">
          <span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
        </div>
      </div>
      <p class="text-base text-foreground dark:text-foreground-secondary leading-relaxed mb-[theme(--spacing-2xl)]">
        Choosing solar isn't just about savings; it's about building a
        sustainable tomorrow. At Solar Vipani, we're committed to making that
        journey clear and accessible for every household and business. Whether
        you're exploring options for the first time or ready to dive in, we're
        here to guide you every step of the way.
      </p>
      <div class="bg-accent text-foreground p-[theme(--spacing-lg)] rounded-[theme(--radius-md)] text-center">
        <p>
          <strong
            >Step into a Greener Future with Solar Vipani — where High
            Convenience, Best Price and Low Risk is assured through Design</strong
          >
        </p>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="text-center p-[theme(--card-padding-y)] mb-[theme(--card-gap)]">
      <div class="mb-[theme(--card-gap)]">
        <p class="text-base mb-[theme(--spacing-sm)]">
          Write to us at
          <a href="mailto:admin@solarvipani.com" class="font-semibold text-primary hover:underline">admin@solarvipani.com</a>
          <br />
          or call us at <a href="tel:+918983066701" class="font-semibold text-primary hover:underline">+91 8983066701</a>
        </p>
      </div>

      <div class="mb-[theme(--card-gap)]">
        <h4 class="text-lg font-semibold text-foreground dark:text-foreground-secondary mb-[theme(--spacing-lg)]">Follow us on:</h4>
        <div class="flex justify-center gap-[theme(--card-gap)] flex-wrap">
          {#each socialLinks as link}
            <a
              href={link.url}
              target="_blank"
              aria-label={link.label}
              class="flex items-center gap-2 text-primary hover:text-primary-hover dark:hover:text-primary font-medium transition-colors hover:-translate-y-[theme(--hover-lift-sm)] transform"
            >
              {@html link.icon}
              <span>{link.label}</span>
            </a>
          {/each}
        </div>
      </div>

      <div class="pt-[theme(--card-padding-y)]">
        <p class="text-foreground dark:text-foreground-secondary">
          <a href="/in/terms-of-use" class="text-primary hover:underline">Terms of Use</a> |
          <a href="/in/privacy-policy" class="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </section>
  </div>
</main>

