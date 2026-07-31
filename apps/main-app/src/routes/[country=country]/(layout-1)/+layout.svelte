<script>
  import { onMount } from "svelte";
  import { initializeTheme } from "$lib/themeStore.svelte";
  import { writable } from "svelte/store";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { initPosthog, capturePageview } from "$lib/posthog";
  import { hasAnalyticsConsent } from "$lib/consent";
  import CookieConsent from "$lib/components/CookieConsent.svelte";
  import AboutSolarVipani from "$lib/in/components/AboutSolarVipani.svelte";
  import ChatLauncher from "$lib/components/chat/ChatLauncher.svelte";
  import SiteHeader from "$lib/components/chrome/SiteHeader.svelte";
  import SiteFooter from "$lib/components/chrome/SiteFooter.svelte";

  // Accept children snippet from SvelteKit
  let { children, data } = $props();

  // Country config drives every country-specific bit of this layout.
  const features = $derived(data.country.features);

  // Create a shared store for chat messages (persists across SPA navigations)
  const chatMessages = writable([]);

  // Only load component client-side to avoid SSR issues
  let showChat = $state(false);

  // The chat is reachable two ways. ChatLauncher renders from first paint, so
  // visitors who never scroll still discover it. Separately, scrolling past
  // SCROLL_TRIGGER auto-opens it (a region, not the absolute bottom — most users
  // stop before 100%); scroll depth adapts to any page length, and a fast
  // scroll-to-bottom still lands inside the region.
  //
  // `chatOpen` is the single source of truth for both triggers. `openedByUser`
  // keeps a launcher-opened chat from being closed by scrolling back up, and
  // `autoOpenFired` stops the scroll trigger from re-opening a chat the user
  // dismissed while still inside the region.
  const SCROLL_TRIGGER = 0.75;
  let ChatbotPopup = $state(null);
  let chatOpen = $state(false);
  let openedByUser = $state(false);
  let autoOpenFired = $state(false);

  async function loadChatbot() {
    if (!ChatbotPopup) {
      const module = await import("$lib/components/chat/ChatbotPopup.svelte");
      ChatbotPopup = module.default;
    }
  }

  async function openChat() {
    await loadChatbot();
    openedByUser = true;
    chatOpen = true;
  }

  function closeChat() {
    chatOpen = false;
    openedByUser = false;
  }

  onMount(() => {
    if (!features.chatbot) return;

    let chatbotTimer = null;
    let ticking = false;

    const evaluate = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Pages that barely scroll are read in full, so treat them as engaged.
      const depth = max > 100 ? window.scrollY / max : 1;

      if (depth >= SCROLL_TRIGGER) {
        if (!chatbotTimer && !autoOpenFired && !chatOpen) {
          chatbotTimer = setTimeout(async () => {
            chatbotTimer = null;
            await loadChatbot();
            autoOpenFired = true;
            chatOpen = true;
          }, 1000);
        }
      } else {
        if (chatbotTimer) {
          clearTimeout(chatbotTimer);
          chatbotTimer = null;
        }
        autoOpenFired = false;
        if (!openedByUser) chatOpen = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluate);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    evaluate(); // handle short, non-scrollable pages on load

    return () => {
      if (chatbotTimer) clearTimeout(chatbotTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });

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

    // Defer analytics scripts to improve initial page performance.
    // Only fires once the visitor has accepted analytics cookies — otherwise the
    // CookieConsent banner triggers loadAnalytics() on Accept.
    setTimeout(() => {
      if (hasAnalyticsConsent()) loadAnalytics();
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
    // Load PostHog (dynamically imported chunk) then record the first pageview
    initPosthog().then(() => capturePageview(window.location.href));

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

  <!-- Heavy analytics scripts moved to loadAnalytics() function for deferred loading -->
</svelte:head>

<SiteHeader country={data.country} />

{@render children?.()}

<!-- About Solar Vipani (shown on every page in this layout) -->
<div class="mx-auto max-w-[1140px] px-[theme(--container-padding)]">
  <AboutSolarVipani
    installerCount={data.aboutStats.installerCount}
    leadsGenerated={data.aboutStats.leadsGenerated}
  />
</div>

<SiteFooter country={data.country} />


<!-- Chatbot: always-visible launcher, popup lazy-loaded on first open -->
{#if features.chatbot && !chatOpen}
  <ChatLauncher onopen={openChat} onpreload={loadChatbot} />
{/if}
{#if chatOpen && ChatbotPopup}
  <ChatbotPopup messages={chatMessages} onClose={closeChat} />
{/if}

<!-- Analytics consent banner — gates loadAnalytics() on first visit -->
<CookieConsent onAccept={loadAnalytics} />
