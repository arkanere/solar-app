<script>
  import { toggleTheme, initializeTheme, isDarkMode } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { storiesModalOpen } from "$lib/storiesStore.js";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import StoriesModal from "$lib/in-new-rewrites/StoriesModal.svelte";

  // Accept children snippet from SvelteKit
  let { children } = $props();


  // Create a shared store for chat messages
  const chatMessages = writable([]);

  // Only load component client-side to avoid SSR issues
  let showChat = $state(false);

  // Translation dropdown state
  let showTranslateDropdown = $state(false);
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

    // Add click outside listener for translate dropdown
    document.addEventListener("click", handleClickOutside);

    // Defer analytics scripts to improve initial page performance
    setTimeout(() => {
      loadAnalytics();
    }, 3000); // Load analytics after 3 seconds

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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

  // Handle translate dropdown toggle
  function toggleTranslateDropdown() {
    showTranslateDropdown = !showTranslateDropdown;
  }

  // Handle language selection
  function selectLanguage(language) {
    selectedLanguage = language.name;
    showTranslateDropdown = false;
    showTranslationModal = true;
  }

  // Close translation modal
  function closeTranslationModal() {
    showTranslationModal = false;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest(".translate-container")) {
      showTranslateDropdown = false;
    }
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

<nav class="flex flex-wrap items-center p-4 md:p-4 transition-colors duration-300 w-full gap-8 md:gap-8 bg-background text-foreground md:justify-start justify-center border-b border-border">
  <!-- Translate Dropdown -->
  <div class="relative inline-block ml-auto">
    {#if showTranslateDropdown}
      <div class="absolute top-full left-0 md:left-0 sm:right-0 bg-popover border border-border rounded min-w-[200px] md:min-w-[200px] sm:min-w-[180px] shadow-md z-50 mt-0.5">
        {#each indianLanguages as language}
          <button
            class="block w-full px-4 py-3 border-b border-border last:border-b-0 text-left text-sm hover:bg-muted transition-colors duration-200"
            onclick={() => selectLanguage(language)}
          >
            {language.flag}
            {language.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <button class="border border-border px-4 py-2 md:px-4 md:py-2 text-sm md:text-sm rounded cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-muted hover:text-foreground sm:px-2 sm:py-1 sm:text-xs" onclick={toggleTheme}>
    {$isDarkMode ? "Light mode" : "Dark mode"}
  </button>
</nav>

{@render children?.()}

<!-- Stories Modal -->
<StoriesModal />

<!-- Translation Instructions Modal -->
{#if showTranslationModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 bg-overlay flex justify-center items-center z-[2000]" onclick={closeTranslationModal}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="bg-popover text-popover-foreground rounded-lg max-w-[500px] w-[90%] md:w-[90%] sm:w-[95%] max-h-[80vh] overflow-y-auto shadow-lg" onclick={(e) => e.stopPropagation()}>
      <div class="flex justify-between items-center p-6 md:p-6 sm:p-4 border-b border-border">
        <h3 class="text-lg md:text-lg sm:text-base font-semibold m-0">🌐 How to translate to {selectedLanguage}</h3>
        <button class="bg-none border-none text-2xl cursor-pointer p-0 text-foreground-muted hover:text-foreground transition-colors" onclick={closeTranslationModal}>×</button>
      </div>
      <div class="p-6 md:p-6 sm:p-4">
        <div class="mb-6">
          <h4 class="text-base font-semibold text-primary m-0 mb-3">📱 On Mobile:</h4>
          <div class="flex gap-4 mb-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <div>
              <strong class="block mb-1">Tap the three dots menu (⋮) in your browser</strong>
            </div>
          </div>
          <div class="flex gap-4 mb-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <div>
              <strong class="block mb-1">Look for "Translate" option</strong>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <div>
              <strong class="block mb-1">Select your language</strong>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-base font-semibold text-primary m-0 mb-3">💻 On Desktop:</h4>
          <div class="flex gap-4 mb-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <div>
              <strong class="block mb-1">Right-click anywhere on this page</strong>
            </div>
          </div>
          <div class="flex gap-4 mb-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <div>
              <strong class="block mb-1">Look for "Translate to {selectedLanguage !== "More Languages"
                  ? selectedLanguage.split("(")[1]?.replace(")", "") ||
                    "your language"
                  : "your language"}"</strong>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <div>
              <strong class="block mb-1">Click to translate</strong>
            </div>
          </div>
        </div>

        <div class="border-t border-border pt-4">
          <h4 class="text-base font-semibold m-0 mb-2">💡 Alternative methods:</h4>
          <p class="text-sm text-foreground-secondary my-1">
            <strong>Chrome users:</strong> Look for the translate icon 🌐 in your
            address bar
          </p>
          <p class="text-sm text-foreground-secondary my-1">
            <strong>Safari (iPhone/iPad):</strong> Tap the "aA" button in address
            bar
          </p>
          <p class="text-sm text-foreground-secondary my-1">
            <strong>Other browsers:</strong> Check browser settings for translation
            options
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->
