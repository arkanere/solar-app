<script>
  import { isDarkMode, toggleTheme, initializeTheme } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { storiesModalOpen } from "$lib/in/storiesStore.js";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import StoriesModal from "$lib/in-new-rewrites/StoriesModal.svelte";

  console.log('[DEBUG +layout.svelte] storiesModalOpen store imported:', storiesModalOpen);

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
    console.log('[DEBUG] openStoriesModal called');
    console.log('[DEBUG] Before set - storiesModalOpen value:', $storiesModalOpen);
    storiesModalOpen.set(true);
    console.log('[DEBUG] After set - storiesModalOpen value:', $storiesModalOpen);
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

<nav class="flex flex-wrap items-center gap-4 sm:gap-8 px-4 py-4 w-full box-border transition-colors duration-300 bg-background text-foreground">
  <a href="/in" class="no-underline text-lg sm:text-xl font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap">Solar Vipani</a>
  <a href="/in/business-listing" class="no-underline text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap">List Business</a>
  <a href="/in/recent-solar-installation-projects" class="no-underline text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap">Recent Projects</a>
  <a href="/in/solar-panel-installer-directory" class="no-underline text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap">Directory</a>
  <button class="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:brightness-110 border-none text-white font-semibold rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg whitespace-nowrap" onclick={() => { console.log('[DEBUG] Stories button clicked'); openStoriesModal(); }}>Stories</button>
  <a href="/in/about-us" class="no-underline text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap">About us</a>

  <!-- Translate Dropdown -->
  <div class="translate-container ml-auto relative inline-block">
    <button class="border rounded px-4 py-2 text-sm sm:text-base cursor-pointer transition-all duration-300 whitespace-nowrap border-foreground dark:border-white text-foreground dark:text-white hover:bg-muted dark:hover:bg-background-secondary hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary" onclick={toggleTranslateDropdown}>
      🌐 Translate
    </button>

    {#if showTranslateDropdown}
      <div class="absolute top-full left-0 min-w-[200px] rounded border z-[1000] mt-1 shadow-md bg-card border-border dark:shadow-black/20">
        {#each indianLanguages as language}
          <button
            class={`block w-full text-left px-4 py-3 text-sm cursor-pointer transition-colors duration-200 border-b border-border text-foreground dark:text-white hover:bg-muted dark:hover:bg-background-secondary ${language === indianLanguages[indianLanguages.length - 1] ? "border-b-0" : ""}`}
            onclick={() => selectLanguage(language)}
          >
            {language.flag}
            {language.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <button class="border rounded px-4 py-2 text-sm sm:text-base cursor-pointer transition-all duration-300 whitespace-nowrap border-foreground dark:border-white text-foreground dark:text-white hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-foreground" onclick={toggleTheme}>
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
  <div class="fixed inset-0 w-full h-full bg-black bg-opacity-70 z-[2000] flex justify-center items-center" onclick={closeTranslationModal}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="bg-white rounded-lg max-w-2xl w-11/12 sm:w-full max-h-[80vh] overflow-y-auto shadow-2xl" onclick={(e) => e.stopPropagation()}>
      <div class="flex justify-between items-center px-6 py-6 border-b border-border">
        <h3 class="text-xl text-foreground m-0">🌐 How to translate to {selectedLanguage}</h3>
        <button class="bg-none border-0 text-2xl cursor-pointer p-0 text-foreground-secondary transition-colors duration-200 hover:text-foreground" onclick={closeTranslationModal}>×</button>
      </div>
      <div class="px-6 py-6">
        <div class="mb-6">
          <h4 class="text-primary font-semibold text-base m-0 mb-3">📱 On Mobile:</h4>
          <div class="flex gap-4 mb-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <div class="text-foreground"><strong>Tap the three dots menu (⋮) in your browser</strong></div>
          </div>
          <div class="flex gap-4 mb-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <div class="text-foreground"><strong>Look for "Translate" option</strong></div>
          </div>
          <div class="flex gap-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <div class="text-foreground"><strong>Select your language</strong></div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-primary font-semibold text-base m-0 mb-3">💻 On Desktop:</h4>
          <div class="flex gap-4 mb-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <div class="text-foreground"><strong>Right-click anywhere on this page</strong></div>
          </div>
          <div class="flex gap-4 mb-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <div class="text-foreground"><strong>Look for "Translate to {selectedLanguage !== "More Languages"
                  ? selectedLanguage.split("(")[1]?.replace(")", "") ||
                    "your language"
                  : "your language"}"</strong></div>
          </div>
          <div class="flex gap-4">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <div class="text-foreground"><strong>Click to translate</strong></div>
          </div>
        </div>

        <div class="border-t border-border pt-4">
          <h4 class="text-base text-foreground m-0 mb-2 font-semibold">💡 Alternative methods:</h4>
          <p class="text-sm text-foreground-secondary my-1"><strong>Chrome users:</strong> Look for the translate icon 🌐 in your address bar</p>
          <p class="text-sm text-foreground-secondary my-1"><strong>Safari (iPhone/iPad):</strong> Tap the "aA" button in address bar</p>
          <p class="text-sm text-foreground-secondary my-1"><strong>Other browsers:</strong> Check browser settings for translation options</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->
