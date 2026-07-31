<script>
  import { initializeTheme } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { storiesModalOpen } from "$lib/storiesStore.js";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import StoriesModal from "$lib/components/StoriesModal.svelte";
  import AboutSolarVipani from "$lib/components/AboutSolarVipani.svelte";
  import SiteHeader from "$lib/components/chrome/SiteHeader.svelte";
  import SiteFooter from "$lib/components/chrome/SiteFooter.svelte";

  // Accept children snippet from SvelteKit
  let { children, data } = $props();


  // Create a shared store for chat messages
  const chatMessages = writable([]);

  // Only load component client-side to avoid SSR issues
  let showChat = $state(false);

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

  // Function to open stories modal
  function openStoriesModal() {
    storiesModalOpen.set(true);
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
        callsafeScript.src = "https://www.callsafe.online/embed.js";
        callsafeScript.setAttribute("data-handle", "eb37507909fa43ff");
        callsafeScript.setAttribute("data-source-id", "solar-vipani");
        document.head.appendChild(callsafeScript);
      });
    }
  </script>

  <!--src="http://localhost:5173/embed4.js"  -->

  <!-- Heavy analytics scripts moved to loadAnalytics() function for deferred loading -->
</svelte:head>

<SiteHeader />

{@render children?.()}

<!-- About Solar Vipani (shown on every page in this layout) -->
<div class="mx-auto max-w-[1140px] px-[theme(--container-padding)]">
  <AboutSolarVipani
    installerCount={data.aboutStats.installerCount}
    leadsGenerated={data.aboutStats.leadsGenerated}
  />
</div>

<SiteFooter />

<!-- Stories Modal -->
<StoriesModal />


<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->
