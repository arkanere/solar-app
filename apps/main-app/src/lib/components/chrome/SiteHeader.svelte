<script lang="ts">
  import { toggleTheme, isDarkMode } from "$lib/themeStore.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { capture } from "$lib/posthog";
  import type { CountryConfig } from "$lib/countries";
  import { contentUrl } from "$lib/countries/urls";
  import { Globe, Sun, Moon, Smartphone, Monitor, Lightbulb } from "@lucide/svelte";

  // `country` is optional: the country-less route tree renders this header with
  // no country, in which case every per-country link and CTA is hidden.
  let { country }: { country?: CountryConfig } = $props();

  const cc = $derived(country?.code);
  const features = $derived(country?.features);

  // Translation modal state
  let showTranslationModal = $state(false);
  let selectedLanguage = $state("");
  let showTranslateDropdown = $state(false);

  // Solar Guide dropdown state
  let showSolarGuide = $state(false);

  const solarGuideLinks = $derived([
    { group: "Getting Started", items: [
      { href: contentUrl("/rooftop-solar"), label: "Rooftop Solar" },
      { href: contentUrl("/solar-installation"), label: "Solar Installation" },
    ]},
    { group: "Products", items: [
      { href: contentUrl("/solar-panels"), label: "Solar Panels" },
      { href: contentUrl("/solar-inverters"), label: "Solar Inverters" },
      { href: contentUrl("/solar-pumps"), label: "Solar Pumps" },
    ]},
    { group: "Money", items: [
      { href: contentUrl("/solar-subsidy"), label: "Solar Subsidy" },
      { href: contentUrl("/solar-financing"), label: "Solar Financing" },
    ]},
  ]);

  // Find Solar dropdown state
  let showFindSolar = $state(false);

  const findSolarLinks = $derived([
    { href: `/${cc}/solar`, label: "Solar Directory" },
    ...(features?.projects
      ? [{ href: `/${cc}/recent-solar-installation-projects`, label: "Recent Projects" }]
      : []),
  ]);

  // Indian languages for translation (translate dropdown is IN-only)
  const indianLanguages = [
    { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
    { code: "more", name: "More Languages", flag: "🌍" },
  ];

  // Handle language selection
  function selectLanguage(language: { name: string }) {
    selectedLanguage = language.name;
    showTranslationModal = true;
  }
</script>

<nav class="flex flex-wrap items-center w-full justify-between border-b border-border bg-background text-foreground p-[theme(--container-padding)] gap-4 transition-colors duration-[theme(--transition-default)]">
  <!-- Left: brand + learn/find dropdowns -->
  <div class="flex items-center gap-6 flex-wrap">
    <!-- Always `/`: the country homes merged into the root page on 2026-08-22
         and `/in` and `/us` now 301 there, so linking per country would send
         the brand link through a redirect. -->
    <a href="/" class="no-underline text-lg font-semibold transition-colors duration-[theme(--transition-default)] hover:text-primary-strong whitespace-nowrap">Solar Vipani</a>

    <!-- Solar Guide Dropdown (per-country trees gate it on the content flag) -->
    {#if !country || features?.seoContentFamilies}
      <div class="relative">
        <button
          onclick={() => { showSolarGuide = !showSolarGuide; showFindSolar = false; }}
          class="flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary-strong whitespace-nowrap bg-transparent border-none text-foreground"
        >
          Solar Guide
          <svg class="w-3.5 h-3.5 transition-transform duration-200" class:rotate-180={showSolarGuide} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {#if showSolarGuide}
          <div
            role="menu"
            tabindex="-1"
            class="absolute left-0 mt-2 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50"
            onmouseleave={() => showSolarGuide = false}
          >
            <div class="p-2">
              {#each solarGuideLinks as group, i}
                {#if i > 0}
                  <div class="my-1 h-px bg-border"></div>
                {/if}
                <p class="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{group.group}</p>
                {#each group.items as link}
                  <a
                    href={link.href}
                    onclick={() => showSolarGuide = false}
                    class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm no-underline text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                {/each}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Find Solar Dropdown (the directory is per-country) -->
    {#if country}
      <div class="relative">
        <button
          onclick={() => { showFindSolar = !showFindSolar; showSolarGuide = false; }}
          class="flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary-strong whitespace-nowrap bg-transparent border-none text-foreground"
        >
          Find Solar
          <svg class="w-3.5 h-3.5 transition-transform duration-200" class:rotate-180={showFindSolar} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {#if showFindSolar}
          <div
            role="menu"
            tabindex="-1"
            class="absolute left-0 mt-2 w-52 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50"
            onmouseleave={() => showFindSolar = false}
          >
            <div class="p-2">
              {#each findSolarLinks as link}
                <a
                  href={link.href}
                  onclick={() => showFindSolar = false}
                  class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm no-underline text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {link.label}
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Right: primary CTA + secondary links + utilities -->
  <div class="flex items-center gap-3 flex-wrap">
    {#if country && cc === 'in'}
      <a
        href="/{cc}/get-quotes"
        onclick={() => capture('get_quotes_cta_clicked', { source: 'nav' })}
        class="no-underline text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover px-4 py-2 rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)] whitespace-nowrap"
      >
        Get Quotes
      </a>

      <a href="/{cc}/partners" class="no-underline text-sm font-medium text-foreground transition-colors duration-[theme(--transition-default)] hover:text-primary-strong whitespace-nowrap">Partner with Us</a>
    {:else if country}
      <a
        href="/{cc}/business-form"
        class="no-underline text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover px-4 py-2 rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)] whitespace-nowrap"
      >
        List Your Business
      </a>
    {/if}

    <!-- Translate Dropdown -->
    {#if !country || cc === 'in'}
      <div class="relative">
        <button
          onclick={() => showTranslateDropdown = !showTranslateDropdown}
          class="inline-flex items-center gap-2 border border-border cursor-pointer whitespace-nowrap text-foreground hover:bg-muted px-[theme(--button-padding-x-sm)] py-[theme(--button-padding-y-sm)] text-sm rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)]"
        >
          <Globe class="h-4 w-4" /> Translate
        </button>

        {#if showTranslateDropdown}
          <div
            role="menu"
            tabindex="-1"
            class="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50"
            onmouseleave={() => showTranslateDropdown = false}
          >
            <div class="p-1">
              {#each indianLanguages as language}
                <button
                  role="menuitem"
                  onclick={() => {
                    selectLanguage(language);
                    showTranslateDropdown = false;
                  }}
                  class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span class="mr-2">{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <button onclick={toggleTheme} class="inline-flex items-center gap-2 border border-border cursor-pointer whitespace-nowrap text-foreground hover:bg-muted px-[theme(--button-padding-x-sm)] py-[theme(--button-padding-y-sm)] text-sm rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)]">
      {#if $isDarkMode}<Sun class="h-4 w-4" /> Light mode{:else}<Moon class="h-4 w-4" /> Dark mode{/if}
    </button>
  </div>
</nav>

<!-- Translation Instructions Modal -->
<Dialog.Root bind:open={showTranslationModal}>
  <Dialog.Content class="max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2"><Globe class="h-5 w-5" />How to translate to {selectedLanguage}</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-[theme(--card-gap)]">
      <div>
        <h4 class="flex items-center gap-2 text-base font-semibold text-primary-strong mb-3"><Smartphone class="h-4 w-4" />On Mobile:</h4>
        <div class="space-y-4">
          {#each ["Tap the three dots menu (⋮) in your browser", "Look for \"Translate\" option", "Select your language"] as step, i}
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-[theme(--step-indicator-size)] h-[theme(--step-indicator-size)] rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <strong class="block pt-[0.125rem]">{step}</strong>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <h4 class="flex items-center gap-2 text-base font-semibold text-primary-strong mb-3"><Monitor class="h-4 w-4" />On Desktop:</h4>
        <div class="space-y-4">
          {#each ["Right-click anywhere on this page", "Look for \"Translate\" option", "Click to translate"] as step, i}
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-[theme(--step-indicator-size)] h-[theme(--step-indicator-size)] rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <strong class="block pt-[0.125rem]">{step}</strong>
            </div>
          {/each}
        </div>
      </div>

      <div class="border-t border-border pt-4">
        <h4 class="flex items-center gap-2 text-base font-semibold mb-2"><Lightbulb class="h-4 w-4" />Alternative methods:</h4>
        <div class="space-y-1 text-sm text-foreground-secondary">
          <p><strong>Chrome users:</strong> Look for the translate icon <Globe class="inline-block h-4 w-4 align-text-bottom" /> in your address bar</p>
          <p><strong>Safari (iPhone/iPad):</strong> Tap the "aA" button in address bar</p>
          <p><strong>Other browsers:</strong> Check browser settings for translation options</p>
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
