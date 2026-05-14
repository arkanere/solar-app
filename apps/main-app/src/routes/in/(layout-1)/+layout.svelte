<script>
  import { toggleTheme, initializeTheme, isDarkMode } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import * as Dialog from "$lib/components/ui/dialog";
  import { afterNavigate } from "$app/navigation";
  import { initPosthog, capturePageview } from "$lib/posthog";

  // Accept children snippet from SvelteKit
  let { children } = $props();


  // Create a shared store for chat messages
  const chatMessages = writable([]);

  // Only load component client-side to avoid SSR issues
  let showChat = $state(false);

  // Translation modal state
  let showTranslationModal = $state(false);
  let selectedLanguage = $state("");
  let showTranslateDropdown = $state(false);

  // Solar Guide dropdown state
  let showSolarGuide = $state(false);

  const solarGuideLinks = [
    { group: "Getting Started", items: [
      { href: "/in/rooftop-solar", label: "Rooftop Solar" },
      { href: "/in/solar-installation", label: "Solar Installation" },
    ]},
    { group: "Products", items: [
      { href: "/in/solar-panels", label: "Solar Panels" },
      { href: "/in/solar-inverters", label: "Solar Inverters" },
      { href: "/in/solar-pumps", label: "Solar Pumps" },
    ]},
    { group: "Money", items: [
      { href: "/in/solar-subsidy", label: "Solar Subsidy" },
      { href: "/in/solar-financing", label: "Solar Financing" },
    ]},
  ];

  // Find Solar dropdown state
  let showFindSolar = $state(false);

  const findSolarLinks = [
    { href: "/in/solar", label: "Solar Directory" },
    { href: "/in/recent-solar-installation-projects", label: "Recent Projects" },
  ];

  // Indian languages for translation
  const indianLanguages = [
    { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
    { code: "more", name: "More Languages", flag: "🌍" },
  ];

  // Reactive variable for current page path - format for CallSafe (only a-z, A-Z, 0-9, -, _)
  const currentPath = $derived(
    $page.url.pathname
      .replace(/\//g, "-") // Replace slashes with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .replace(/-+/g, "-") || // Replace multiple hyphens with single
    "home" // Default to 'home' for root path
  );

  // Track SPA page navigations — must be called at component init level
  afterNavigate(({ to }) => {
    if (to?.url) capturePageview(to.url.href);
  });

  // Initialize the theme when the component is mounted
  $effect(() => {
    initializeTheme();
    // Only show the chat widget after the page has loaded
    showChat = true;
    // Initialize Vercel Speed Insights
    injectSpeedInsights();

    // Track CallSafe widget interactions
    trackCallSafeEvents();

    // Defer analytics scripts to improve initial page performance
    setTimeout(() => {
      loadAnalytics();
    }, 3000); // Load analytics after 3 seconds

    trackEngagement();
  });

  function trackCallSafeEvents() {
    // Track main widget button clicks
    document.addEventListener("click", (event) => {
      if (
        event.target.closest(".callsafe-button") ||
        event.target.classList.contains("callsafe-button")
      ) {
        if (typeof window !== "undefined" && window.umami) {
          window.umami.track("callsafe-widget-clicked");
        }
      }
    });

    // Track other CallSafe interactions
    document.addEventListener("click", (event) => {
      const target = event.target;

      if (target.id === "callsafe-mute") {
        if (typeof window !== "undefined" && window.umami) {
          window.umami.track("callsafe-mute-clicked");
        }
      } else if (target.id === "callsafe-end") {
        if (typeof window !== "undefined" && window.umami) {
          window.umami.track("callsafe-call-ended");
        }
      }
    });
  }

  // Handle language selection
  function selectLanguage(language) {
    selectedLanguage = language.name;
    showTranslationModal = true;
  }

  function trackEngagement() {
    let visibleMs = 0;
    let hadInteraction = false;
    let fired = false;
    let lastVisible = document.visibilityState === 'visible' ? Date.now() : 0;

    function onInteraction() { hadInteraction = true; }
    document.addEventListener('scroll', onInteraction, { once: true, passive: true });
    document.addEventListener('mousemove', onInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', onInteraction, { once: true, passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && lastVisible) {
        visibleMs += Date.now() - lastVisible;
        lastVisible = 0;
      } else if (document.visibilityState === 'visible') {
        lastVisible = Date.now();
      }
    });

    const interval = setInterval(() => {
      if (fired) { clearInterval(interval); return; }
      const total = visibleMs + (lastVisible ? Date.now() - lastVisible : 0);
      if (total >= 10000 && hadInteraction && window.umami) {
        window.umami.track('engaged');
        fired = true;
        clearInterval(interval);
      }
    }, 2000);
  }

  function loadAnalytics() {
    // Load PostHog
    initPosthog();
    capturePageview(window.location.href);

    // Load Hotjar
    if (typeof window !== "undefined" && !window.hj) {
      (function (h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function () {
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = { hjid: 5045118, hjsv: 6 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    }

    // Load Google Analytics
    if (typeof window !== "undefined" && !window.gtag) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-BXXPPJ3LK8";
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-BXXPPJ3LK8");
    }

    // Load Twitter conversion tracking
    if (typeof window !== "undefined" && !window.twq) {
      !(function (e, t, n, s, u, a) {
        e.twq ||
          ((s = e.twq =
            function () {
              s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
            }),
          (s.version = "1.1"),
          (s.queue = []),
          (u = t.createElement(n)),
          (u.async = !0),
          (u.src = "https://static.ads-twitter.com/uwt.js"),
          (a = t.getElementsByTagName(n)[0]),
          a.parentNode.insertBefore(u, a));
      })(window, document, "script");
      window.twq("config", "opkvk");
    }
  }
</script>


<!-- svelte-ignore a11y_img_redundant_alt -->
<svelte:head>
  <!-- Umami Analytics - Layout 1 Only (kept as defer for minimal impact) -->
  <script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id="d592f22f-fdfe-470a-9cd7-fc46022d46ec"
  ></script>

  <!-- Facebook Pixel (kept for immediate tracking) -->
  <script
    async=""
    src="https://connect.facebook.net/en_US/fbevents.js"
  ></script>

  <!-- CallSafe Widget - Lazy loaded after page is fully loaded -->
  <script>
    if (typeof window !== "undefined") {
      window.addEventListener("load", function () {
        const callsafeScript = document.createElement("script");
        callsafeScript.src = "https://callsafe.tech/embed.js";
        callsafeScript.setAttribute("data-handle", "25831dee9a0b76f8");
        callsafeScript.setAttribute("data-source-id", "solar-vipani");
        document.head.appendChild(callsafeScript);
      });
    }
  </script>

  <!--src="http://localhost:5173/embed4.js"  -->

  <!-- Heavy analytics scripts moved to loadAnalytics() function for deferred loading -->
</svelte:head>

<nav class="flex flex-wrap items-center w-full justify-between border-b border-border bg-background text-foreground p-[theme(--container-padding)] gap-4 transition-colors duration-[theme(--transition-default)]">
  <!-- Left: brand + learn/find dropdowns -->
  <div class="flex items-center gap-6 flex-wrap">
    <a href="/in" class="no-underline text-lg font-semibold transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">Solar Vipani</a>

    <!-- Solar Guide Dropdown -->
    <div class="relative">
      <button
        onclick={() => { showSolarGuide = !showSolarGuide; showFindSolar = false; }}
        class="flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap bg-transparent border-none text-foreground"
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

    <!-- Find Solar Dropdown -->
    <div class="relative">
      <button
        onclick={() => { showFindSolar = !showFindSolar; showSolarGuide = false; }}
        class="flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap bg-transparent border-none text-foreground"
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
  </div>

  <!-- Right: primary CTA + secondary links + utilities -->
  <div class="flex items-center gap-3 flex-wrap">
    <a
      href="/in/get-quotes"
      class="no-underline text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover px-4 py-2 rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)] whitespace-nowrap"
    >
      Get Quotes
    </a>

    <a href="/in/partners" class="no-underline text-sm font-medium text-foreground transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">Partner with Us</a>

    <!-- Translate Dropdown -->
    <div class="relative">
      <button
        onclick={() => showTranslateDropdown = !showTranslateDropdown}
        class="border border-border cursor-pointer whitespace-nowrap text-foreground hover:bg-muted px-[theme(--button-padding-x-sm)] py-[theme(--button-padding-y-sm)] text-sm rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)]"
      >
        🌐 Translate
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

    <button onclick={toggleTheme} class="border border-border cursor-pointer whitespace-nowrap text-foreground hover:bg-muted px-[theme(--button-padding-x-sm)] py-[theme(--button-padding-y-sm)] text-sm rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)]">
      {$isDarkMode ? "☀️ Light mode" : "🌙 Dark mode"}
    </button>
  </div>
</nav>

{@render children?.()}

<!-- Footer -->
<footer class="border-t border-border bg-background text-foreground mt-8">
  <div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-8">
      <!-- Solar Topics -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Solar Topics</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          {#each [
            { href: "/in/rooftop-solar", label: "Rooftop Solar" },
            { href: "/in/solar-panels", label: "Solar Panels" },
            { href: "/in/solar-inverters", label: "Solar Inverters" },
            { href: "/in/solar-installation", label: "Solar Installation" },
            { href: "/in/solar-subsidy", label: "Solar Subsidy" },
            { href: "/in/solar-financing", label: "Solar Financing" },
            { href: "/in/solar-pumps", label: "Solar Pumps" },
          ] as link}
            <li><a href={link.href} class="text-sm text-foreground no-underline hover:text-primary transition-colors">{link.label}</a></li>
          {/each}
        </ul>
      </div>

      <!-- Find Solar -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Find Solar</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          <li><a href="/in/solar" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Solar Directory</a></li>
          <li><a href="/in/recent-solar-installation-projects" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Recent Projects</a></li>
          <li><a href="/in/get-quotes" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Get Quotes</a></li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Company</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          <li><a href="/in/about-us" class="text-sm text-foreground no-underline hover:text-primary transition-colors">About Us</a></li>
          <li><a href="/in/blogs" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Blog</a></li>
          <li><a href="/in/partners" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Partner with Us</a></li>
        </ul>
      </div>

      <!-- Tools -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Tools</h4>
        <ul class="space-y-2 list-none p-0 m-0">
          <li><a href="/in/tools/solar-calculator" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Solar Calculator</a></li>
          <li><a href="/in/tools/emi-calculator" class="text-sm text-foreground no-underline hover:text-primary transition-colors">EMI Calculator</a></li>
          <li><a href="/in/tools/subsidy-checker" class="text-sm text-foreground no-underline hover:text-primary transition-colors">Subsidy Checker</a></li>
        </ul>
      </div>

      <!-- Brand -->
      <div>
        <h4 class="text-sm font-semibold text-primary mb-3">Solar Vipani</h4>
        <p class="text-sm text-foreground dark:text-foreground-secondary leading-relaxed">
          India's #1 platform connecting homeowners with verified solar installers.
        </p>
      </div>
    </div>

    <div class="border-t border-border pt-4 pb-2 text-center">
      <p class="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Solar Vipani. All rights reserved.</p>
    </div>
  </div>
</footer>

<!-- Translation Instructions Modal -->
<Dialog.Root bind:open={showTranslationModal}>
  <Dialog.Content class="max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title>🌐 How to translate to {selectedLanguage}</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-[theme(--card-gap)]">
      <div>
        <h4 class="text-base font-semibold text-primary mb-3">📱 On Mobile:</h4>
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
        <h4 class="text-base font-semibold text-primary mb-3">💻 On Desktop:</h4>
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
        <h4 class="text-base font-semibold mb-2">💡 Alternative methods:</h4>
        <div class="space-y-1 text-sm text-foreground-secondary">
          <p><strong>Chrome users:</strong> Look for the translate icon 🌐 in your address bar</p>
          <p><strong>Safari (iPhone/iPad):</strong> Tap the "aA" button in address bar</p>
          <p><strong>Other browsers:</strong> Check browser settings for translation options</p>
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->
