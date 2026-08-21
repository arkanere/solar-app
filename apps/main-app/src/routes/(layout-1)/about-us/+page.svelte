<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { SOCIAL_LINKS } from "$lib/constants/social";
  import { Users, MapPin, TrendingUp, Github } from "@lucide/svelte";

  let { data } = $props();

  // installerCount and leadsGenerated come from routes/(layout-1)/+layout.server.ts;
  // citiesServed from this page's own loader. Nothing on this page is a
  // hardcoded figure — the previous version claimed "500+" businesses and
  // "5,000+ Cities & Towns" against 646 and 356 actual.
  const stats = $derived([
    {
      value: data.aboutStats.installerCount,
      label: "Installers on the Platform",
      icon: Users,
    },
    { value: data.citiesServed, label: "Cities Served", icon: MapPin },
    {
      value: data.aboutStats.leadsGenerated,
      label: "Leads Generated",
      icon: TrendingUp,
    },
  ]);

  const REPO_URL = "https://github.com/arkanere/solar-app";
</script>

<svelte:head>
  <title>About Us | Solar Vipani — Open Source Solar Marketplace</title>
  <meta
    name="description"
    content="Solar Vipani connects homeowners and businesses with local solar installers, and publishes the guides and tools to decide before you spend. Our platform is open source."
  />
  <link rel="canonical" href="https://solarvipani.com/about-us" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Solar Vipani",
    url: "https://solarvipani.com/about-us",
    mainEntity: {
      "@type": "Organization",
      name: "Solar Vipani",
      url: "https://solarvipani.com",
      logo: "https://solarvipani.com/logo512.png",
      description:
        "An open source marketplace connecting homeowners and businesses with local solar installers.",
      email: "admin@solarvipani.com",
      telephone: "+91-8983066701",
      sameAs: [...SOCIAL_LINKS.map((l) => l.url), REPO_URL],
    },
  })}<\/script>`}
</svelte:head>

<main
  class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden dark:bg-background dark:text-foreground"
>
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <!-- Hero Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-gradient-to-r from-primary to-primary text-primary-foreground p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground"
        >
          About Solar Vipani
        </h1>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
        <p class="text-xl text-primary-foreground max-w-2xl mx-auto">
          Your trusted marketplace for solar energy solutions
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-accent-muted p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div>
        <p class="text-lg font-medium text-primary mb-6">
          Going solar is a decision you live with for 25 years, and it involves
          a significant amount of money.
        </p>
        <p
          class="text-base text-foreground dark:text-foreground-secondary mb-6 leading-relaxed"
        >
          Most people start that decision with no way to tell a good installer
          from a bad one, and no independent source for what a system should
          cost. Solar Vipani exists to close that gap. We are not a
          manufacturer and not an installer — we are the layer in between: a
          marketplace that connects you with local solar installation and EPC
          companies, and a library of guides and tools that let you judge their
          quotes for yourself.
        </p>
        <div
          class="bg-accent text-foreground p-3 rounded-[theme(--radius-md)] mb-6 text-center"
        >
          <p class="text-base">
            <strong
              >Compare multiple options, get free quotes from installers near
              you, and choose with the numbers in front of you.</strong
            >
          </p>
        </div>
        <p
          class="text-base text-foreground dark:text-foreground-secondary leading-relaxed"
        >
          Listing is free for installers, and we never charge you for a quote.
          You decide who to talk to, and you keep control of your details until
          you do.
        </p>
      </div>
    </section>

    <!-- Stats Grid -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)]">
        {#each stats as stat (stat.label)}
          <Card
            class="p-4 border-t-[theme(--card-accent-border)] border-accent hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-md)] transition-all text-center"
          >
            <stat.icon class="h-6 w-6 text-primary mx-auto mb-2" />
            <div class="text-4xl font-bold text-primary mb-2">
              {stat.value.toLocaleString("en-IN")}+
            </div>
            <h3 class="text-xl font-semibold text-primary mb-2">
              {stat.label}
            </h3>
          </Card>
        {/each}
      </div>
      <p class="text-sm text-muted-foreground text-center mt-4">
        Counted live from our database, across every country we operate in.
      </p>
    </section>

    <!-- Purpose Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
          Our Purpose
        </h2>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
      </div>
      <p
        class="text-base text-foreground dark:text-foreground-secondary leading-relaxed"
      >
        We believe going solar should be a straightforward, well-informed
        choice for everyone. Our mission is to make the transition as smooth as
        possible by <strong
          >connecting you with solar providers who match your specific needs and
          goals</strong
        >, and by giving you enough information to know why they match. A
        decision that lasts 25 years deserves more than a single quote from
        whoever knocked on your door.
      </p>
    </section>

    <!-- Open Source Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
          Built in the Open
        </h2>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
      </div>
      <p
        class="text-base text-foreground dark:text-foreground-secondary leading-relaxed mb-6"
      >
        A marketplace asks you to trust how it ranks and matches. We would
        rather you did not have to take that on faith: <strong
          >Solar Vipani is open source</strong
        >. The code behind this site — how installers are matched to an enquiry,
        how our calculators work, how your data is handled — is public and MIT
        licensed. Read it, check our claims against it, or use it in your own
        project.
      </p>
      <div class="text-center">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-[theme(--radius-md)] bg-accent text-foreground px-4 py-3 font-semibold transition-all hover:-translate-y-[theme(--hover-lift-sm)] hover:shadow-[theme(--shadow-card-hover)]"
        >
          <Github class="h-5 w-5" />
          <span>View the source on GitHub</span>
        </a>
      </div>
    </section>

    <!-- What You'll Find Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
          What You'll Find Here
        </h2>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)]">
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all"
        >
          <h3 class="text-lg font-semibold text-primary mb-3">
            Local installer listings
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Browse solar companies by state, district and city, see the work
            they have completed, and request quotes from more than one before
            you commit.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all"
        >
          <h3 class="text-lg font-semibold text-primary mb-3">
            Guides that explain the choice
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Independent writing on rooftop solar, panels, inverters, solar
            pumps, subsidies and financing — written to educate before you
            spend, not to sell a brand.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all"
        >
          <h3 class="text-lg font-semibold text-primary mb-3">
            Calculators and tools
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Size a system against your electricity bill, check what subsidy you
            qualify for, and work out EMIs — so you can sanity-check a quote
            before you sign it.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all"
        >
          <h3 class="text-lg font-semibold text-primary mb-3">
            Real installation projects
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Photos, system sizes and locations from installations completed by
            companies on the platform, published by the installers themselves.
          </p>
        </Card>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
          Why Choose Solar Vipani?
        </h2>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)]">
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center"
        >
          <div class="text-4xl mb-4 block">🔍</div>
          <h3 class="text-lg font-semibold text-primary mb-3">
            Effortless Comparisons
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Comparing options is as easy as browsing. See service area,
            completed work and contact details side by side, at a glance.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center"
        >
          <div class="text-4xl mb-4 block">📊</div>
          <h3 class="text-lg font-semibold text-primary mb-3">
            Built to Inform, Not to Sell
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            We do not manufacture or install anything, so we have no product to
            push. Our guides describe trade-offs, including the ones that argue
            against going solar right now.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center"
        >
          <div class="text-4xl mb-4 block">⚡</div>
          <h3 class="text-lg font-semibold text-primary mb-3">
            Local, Not National
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Enquiries go to installers who actually work in your area, and to
            more than one of them, so you get comparable quotes from people who
            can service what they sell you.
          </p>
        </Card>
        <Card
          class="p-4 hover:shadow-[theme(--shadow-card-hover)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all text-center"
        >
          <div class="text-4xl mb-4 block">🎯</div>
          <h3 class="text-lg font-semibold text-primary mb-3">
            Customer-First Support
          </h3>
          <p class="text-foreground dark:text-foreground-secondary text-sm">
            Our team is here to guide you through every step, from an initial
            question to feedback after your system is installed.
          </p>
        </Card>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]"
    >
      <div class="text-center mb-[theme(--card-gap)]">
        <h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
          Building a Brighter Future, Together
        </h2>
        <div class="flex justify-center items-center my-4">
          <span
            class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
          ></span>
        </div>
      </div>
      <p
        class="text-base text-foreground dark:text-foreground-secondary leading-relaxed mb-6"
      >
        Choosing solar isn't only about savings; it's about what your roof is
        doing for the next 25 years. Whether you are exploring the idea for the
        first time or already comparing quotes, we're here to make that path
        clear.
      </p>
      <div
        class="bg-accent text-foreground p-3 rounded-[theme(--radius-md)] text-center"
      >
        <p>
          <strong
            >Step into a greener future with Solar Vipani — high convenience,
            fair pricing and low risk, by design.</strong
          >
        </p>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="text-center p-[theme(--card-padding-y)] mb-[theme(--card-gap)]">
      <div class="mb-[theme(--card-gap)]">
        <p class="text-base mb-2">
          Write to us at
          <a
            href="mailto:admin@solarvipani.com"
            class="font-semibold text-primary hover:underline"
            >admin@solarvipani.com</a
          >
          <br />
          or call us at
          <a
            href="tel:+918983066701"
            class="font-semibold text-primary hover:underline">+91 8983066701</a
          >
        </p>
      </div>

      <div class="mb-[theme(--card-gap)]">
        <h4
          class="text-xl font-semibold text-foreground dark:text-foreground-secondary mb-4"
        >
          Follow us on:
        </h4>
        <div class="flex justify-center gap-[theme(--card-gap)] flex-wrap">
          {#each SOCIAL_LINKS as link (link.url)}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              class="flex items-center gap-2 text-primary hover:text-primary-hover dark:hover:text-primary font-medium transition-colors hover:-translate-y-[theme(--hover-lift-sm)] transform"
            >
              <link.icon class="h-5 w-5" />
              <span>{link.label}</span>
            </a>
          {/each}
        </div>
      </div>

      <div class="border-t border-border pt-[theme(--card-padding-y)]">
        <p class="text-foreground dark:text-foreground-secondary">
          <a href="/terms-of-use" class="text-primary hover:underline"
            >Terms of Use</a
          >
          |
          <a href="/privacy-policy" class="text-primary hover:underline"
            >Privacy Policy</a
          >
          |
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline">Source Code</a
          >
        </p>
      </div>
    </section>
  </div>
</main>
