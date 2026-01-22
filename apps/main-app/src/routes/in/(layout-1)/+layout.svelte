<script>
  import { toggleTheme, initializeTheme, isDarkMode } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { storiesModalOpen } from "$lib/in/storiesStore.js";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import StoriesModal from "$lib/in-new-rewrites/StoriesModal.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  // Accept children snippet from SvelteKit
  let { children } = $props();


  // Create a shared store for chat messages
  const chatMessages = writable([]);

  // Only load component client-side to avoid SSR issues
  let showChat = $state(false);

  // Translation modal state
  let showTranslationModal = $state(false);
  let selectedLanguage = $state("");

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

  // Reactive variables for store subscriptions
  let storiesOpen = $derived($storiesModalOpen);

  // Reactive variable for current page path - format for CallSafe (only a-z, A-Z, 0-9, -, _)
  const currentPath = $derived(
    $page.url.pathname
      .replace(/\//g, "-") // Replace slashes with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .replace(/-+/g, "-") || // Replace multiple hyphens with single
    "home" // Default to 'home' for root path
  );

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

  // Function to open stories modal
  function openStoriesModal() {
    storiesModalOpen.set(true);
  }

  // Handle language selection
  function selectLanguage(language) {
    selectedLanguage = language.name;
    showTranslationModal = true;
  }

  function loadAnalytics() {
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

<nav class="flex flex-wrap items-center w-full justify-between border-b border-border bg-background text-foreground p-[theme(--container-padding)] gap-[theme(--spacing-2xl)] transition-colors duration-[theme(--transition-default)]">
  <!-- Left side navigation links -->
  <div class="flex items-center gap-[theme(--spacing-2xl)] flex-wrap">
    <a href="/in" class="no-underline text-[theme(--font-size-lg)] font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">Solar Vipani</a>
    <a href="/in/business-listing" class="no-underline text-[theme(--font-size-base)] font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">List Business</a>
    <a href="/in/recent-solar-installation-projects" class="no-underline text-[theme(--font-size-base)] font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">Recent Projects</a>
    <a href="/in/solar-panel-installer-directory" class="no-underline text-[theme(--font-size-base)] font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">Directory</a>
    <Button variant="default" onclick={openStoriesModal} class="rounded-full">
      Stories
    </Button>
    <a href="/in/about-us" class="no-underline text-[theme(--font-size-base)] font-medium transition-colors duration-[theme(--transition-default)] hover:text-primary whitespace-nowrap">About us</a>
  </div>

  <!-- Right side buttons group -->
  <div class="flex items-center gap-[theme(--spacing-md)]">
    <!-- Translate Dropdown -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="border border-border cursor-pointer whitespace-nowrap text-foreground hover:bg-muted px-[theme(--button-padding-x-sm)] py-[theme(--button-padding-y-sm)] text-[theme(--font-size-sm)] rounded-[theme(--radius-md)] transition-all duration-[theme(--transition-default)]">
        🌐 Translate
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each indianLanguages as language}
          <DropdownMenu.Item onclick={() => selectLanguage(language)}>
            {language.flag}
            {language.name}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    <Button variant="outline" onclick={toggleTheme}>
      {$isDarkMode ? "☀️ Light mode" : "🌙 Dark mode"}
    </Button>
  </div>
</nav>

{@render children?.()}

<!-- Stories Modal -->
<StoriesModal />

<!-- Translation Instructions Modal -->
<Dialog.Root bind:open={showTranslationModal}>
  <Dialog.Content class="max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title>🌐 How to translate to {selectedLanguage}</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-[theme(--card-gap)]">
      <div>
        <h4 class="text-[theme(--font-size-base)] font-semibold text-primary mb-[theme(--spacing-md)]">📱 On Mobile:</h4>
        <div class="space-y-[theme(--spacing-lg)]">
          {#each ["Tap the three dots menu (⋮) in your browser", "Look for \"Translate\" option", "Select your language"] as step, i}
            <div class="flex items-start gap-[theme(--spacing-lg)]">
              <div class="flex items-center justify-center w-[theme(--step-indicator-size)] h-[theme(--step-indicator-size)] rounded-full bg-primary text-primary-foreground text-[theme(--font-size-xs)] font-bold flex-shrink-0">
                {i + 1}
              </div>
              <strong class="block pt-[0.125rem]">{step}</strong>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <h4 class="text-[theme(--font-size-base)] font-semibold text-primary mb-[theme(--spacing-md)]">💻 On Desktop:</h4>
        <div class="space-y-[theme(--spacing-lg)]">
          {#each ["Right-click anywhere on this page", "Look for \"Translate\" option", "Click to translate"] as step, i}
            <div class="flex items-start gap-[theme(--spacing-lg)]">
              <div class="flex items-center justify-center w-[theme(--step-indicator-size)] h-[theme(--step-indicator-size)] rounded-full bg-primary text-primary-foreground text-[theme(--font-size-xs)] font-bold flex-shrink-0">
                {i + 1}
              </div>
              <strong class="block pt-[0.125rem]">{step}</strong>
            </div>
          {/each}
        </div>
      </div>

      <div class="border-t border-border pt-[theme(--spacing-lg)]">
        <h4 class="text-[theme(--font-size-base)] font-semibold mb-[theme(--spacing-sm)]">💡 Alternative methods:</h4>
        <div class="space-y-[theme(--spacing-xs)] text-[theme(--font-size-sm)] text-foreground-secondary">
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
