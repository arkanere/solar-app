<script lang="ts">
  import type { CountryConfig } from "$lib/countries";
  import { contentUrl } from "$lib/countries/urls";

  // `country` is optional — see SiteHeader. Without it only the country-less
  // columns render.
  let { country }: { country?: CountryConfig } = $props();

  const cc = $derived(country?.code);
  const features = $derived(country?.features);
</script>

<footer class="border-t border-border bg-background text-foreground mt-8">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-8">
      <!-- Solar Topics -->
      {#if !country || features?.seoContentFamilies}
        <div>
          <h4 class="text-sm font-semibold text-primary-strong mb-3">Solar Topics</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            {#each [
              { href: contentUrl("/rooftop-solar"), label: "Rooftop Solar" },
              { href: contentUrl("/solar-panels"), label: "Solar Panels" },
              { href: contentUrl("/solar-inverters"), label: "Solar Inverters" },
              { href: contentUrl("/solar-installation"), label: "Solar Installation" },
              { href: contentUrl("/solar-subsidy"), label: "Solar Subsidy" },
              { href: contentUrl("/solar-financing"), label: "Solar Financing" },
              { href: contentUrl("/solar-pumps"), label: "Solar Pumps" },
            ] as link}
              <li><a href={link.href} class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">{link.label}</a></li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Find Solar (the directory and lead funnels are per-country) -->
      {#if country}
        <div>
          <h4 class="text-sm font-semibold text-primary-strong mb-3">Find Solar</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            <li><a href="/{cc}/solar" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Solar Directory</a></li>
            {#if features?.projects}
              <li><a href="/{cc}/recent-solar-installation-projects" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Recent Projects</a></li>
            {/if}
            {#if cc === 'in'}
              <li><a href="/{cc}/get-quotes" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Get Quotes</a></li>
            {/if}
          </ul>
        </div>
      {/if}

      <!-- Company -->
      <div>
        <h4 class="text-sm font-semibold text-primary-strong mb-3">Company</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          <li><a href="/about-us" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">About Us</a></li>
          <!-- Installer acquisition. Each country's entry point is a different
               page: IN pitches at /in/partners, US at /us/business-listing —
               which is also what hooks.server.ts 301s /us/partners to. -->
          {#if cc === 'in'}
            <li><a href="/{cc}/partners" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Partner with Us</a></li>
          {:else if cc === 'us'}
            <li><a href="/{cc}/business-listing" class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">List Your Business</a></li>
          {/if}
        </ul>
      </div>

      <!-- Tools -->
      {#if !country || features?.tools}
        <div>
          <h4 class="text-sm font-semibold text-primary-strong mb-3">Tools</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            <li><a href={contentUrl("/tools/solar-calculator")} class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Solar Calculator</a></li>
            <li><a href={contentUrl("/tools/emi-calculator")} class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">EMI Calculator</a></li>
            <li><a href={contentUrl("/tools/subsidy-checker")} class="text-sm text-foreground no-underline hover:text-primary-strong transition-colors">Subsidy Checker</a></li>
          </ul>
        </div>
      {/if}

      <!-- Brand -->
      <div>
        <h4 class="text-sm font-semibold text-primary-strong mb-3">Solar Vipani</h4>
        <p class="text-sm text-foreground dark:text-foreground-secondary leading-relaxed">
          The open-source platform helping homeowners and businesses go solar with confidence.
        </p>
      </div>
    </div>

    <div class="border-t border-border pt-4 pb-2 text-center">
      <p class="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Solar Vipani. All rights reserved.</p>
    </div>
  </div>
</footer>
