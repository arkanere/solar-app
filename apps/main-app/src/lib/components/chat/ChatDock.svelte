<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import ChatLauncher from "$lib/components/chat/ChatLauncher.svelte";

  // The whole chat surface: launcher, lazy-loaded popup, and the scroll-depth
  // auto-open. This lived inline in [country=country]/(layout-1)/+layout.svelte
  // until 2026-08-22, when the country-less root tree needed it too. Extracted
  // rather than copied — the two triggers share `chatOpen`, so a second copy of
  // this state would have been a second thing to keep in step.
  //
  // Both layouts render it, so the chat now appears on every page of both
  // trees. It needs no country: the AI endpoints live in the FastAPI backend
  // and are reached through apiUrl() in $lib/api, not through a country route.

  // Messages persist across SPA navigations because the layout that renders
  // this component outlives them.
  const chatMessages = writable([]);

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
</script>

{#if !chatOpen}
  <ChatLauncher onopen={openChat} onpreload={loadChatbot} />
{/if}
{#if chatOpen && ChatbotPopup}
  <ChatbotPopup messages={chatMessages} onClose={closeChat} />
{/if}
