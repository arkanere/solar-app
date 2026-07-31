<script lang="ts">
  import type { CountryConfig } from "$lib/countries";

  // `country` is optional — see SiteHeader. Without it only the country-less
  // columns render.
  let { country }: { country?: CountryConfig } = $props();

  const cc = $derived(country?.code);
  const features = $derived(country?.features);

  // See SiteHeader: stage 7 moves the content families to the root and this
  // becomes ''.
  const contentPrefix = $derived(country ? `/${country.code}` : "/in");
</script>

<footer class="border-t border-border bg-background text-foreground mt-8">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-8">
      <!-- Solar Topics -->
      {#if !country || features?.seoContentFamilies}
        <div>
          <h4 class="text-sm font-semibold text-primary mb-3">Solar Topics</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            {#each [
              { href: `${contentPrefix}/rooftop-solar`, label: "Rooftop Solar" },
              { href: `${contentPrefix}/solar-panels`, label: "Solar Panels" },
              { href: `${contentPrefix}/solar-inverters`, label: "Solar Inverters" },
              { href: `${contentPrefix}/solar-installation`, label: "Solar Installation" },
              { href: `${contentPrefix}/solar-subsidy`, label: "Solar Subsidy" },
              { href: `${contentPrefix}/solar-financing`, label: "Solar Financing" },
              { href: `${contentPrefix}/solar-pumps`, label: "Solar Pumps" },
            ] as link}
              <li><a href={link.href} class="text-sm text-foreground no-underline hover:text-primary transition-colors">{link.label}</a></li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Find Solar (the directory and lead funnels are per-country) -->
      {#if country}
        <div>
          <h4 class="text-sm font-semibold text-primary mb-3">Find Solar</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            <li><a href="/{cc}/solar" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Solar Directory</a></li>
            {#if features?.projects}
              <li><a href="/{cc}/recent-solar-installation-projects" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Recent Projects</a></li>
            {/if}
            {#if cc === 'in'}
              <li><a href="/{cc}/get-quotes" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Get Quotes</a></li>
            {/if}
          </ul>
        </div>
      {/if}

      <!-- Company -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Company</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          <li><a href="{contentPrefix}/about-us" class="text-sm text-foreground no-underline hover:text-primary transition-colors">About Us</a></li>
          {#if cc === 'in'}
            <li><a href="/{cc}/partners" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Partner with Us</a></li>
          {/if}
        </ul>
      </div>

      <!-- Tools -->
      {#if !country || features?.tools}
        <div>
          <h4 class="text-sm font-semibold text-primary mb-3">Tools</h4>
          <ul class="space-y-2 list-none p-0 m-0">
            <li><a href="{contentPrefix}/tools/solar-calculator" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Solar Calculator</a></li>
            <li><a href="{contentPrefix}/tools/emi-calculator" class="text-sm text-foreground no-underline hover:text-primary transition-colors">EMI Calculator</a></li>
            <li><a href="{contentPrefix}/tools/subsidy-checker" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Subsidy Checker</a></li>
          </ul>
        </div>
      {/if}

      <!-- Brand -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Solar Vipani</h4>
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
