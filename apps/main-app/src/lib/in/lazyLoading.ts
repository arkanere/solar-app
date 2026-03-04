export interface LazyLoadState {
  RecentProjectsCity: any;
  AboutSolarVipani: any;
  ChatbotPopup: any;
  shouldLoadRecentProjects: boolean;
  shouldLoadAbout: boolean;
  shouldLoadChatbot: boolean;
}

export function setupLazyLoading(setState: (key: keyof LazyLoadState, value: any) => void) {
  // Load RecentProjectsCity when it comes into view
  const recentProjectsObserver = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        const module = await import('$lib/in/components/RecentProjectsCity.svelte');
        setState('RecentProjectsCity', module.default);
        setState('shouldLoadRecentProjects', true);
        recentProjectsObserver.disconnect();
      }
    },
    { rootMargin: '200px' }
  );

  // Load AboutSolarVipani when it comes into view
  const aboutObserver = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        const module = await import('$lib/in/components/AboutSolarVipani.svelte');
        setState('AboutSolarVipani', module.default);
        setState('shouldLoadAbout', true);
        aboutObserver.disconnect();
      }
    },
    { rootMargin: '200px' }
  );

  // Show chatbot when user reaches bottom of page
  let chatbotTimer: NodeJS.Timeout | null = null;

  // Observe sections when they exist
  setTimeout(() => {
    const recentProjectsSection = document.querySelector('#recent-projects-section');
    const aboutSection = document.querySelector('#about-section');

    if (recentProjectsSection) {
      recentProjectsObserver.observe(recentProjectsSection);
    }

    if (aboutSection) {
      aboutObserver.observe(aboutSection);

      // Create a sentinel element at the bottom of the about section
      const bottomSentinel = document.createElement('div');
      (bottomSentinel as HTMLElement).style.position = 'absolute';
      (bottomSentinel as HTMLElement).style.bottom = '0';
      (bottomSentinel as HTMLElement).style.height = '1px';
      (bottomSentinel as HTMLElement).style.width = '100%';
      (bottomSentinel as HTMLElement).style.pointerEvents = 'none';
      (aboutSection as HTMLElement).style.position = 'relative';
      aboutSection.appendChild(bottomSentinel);

      // Observer for the bottom sentinel
      const chatbotObserver = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting) {
            // Bottom of About section is visible - wait 1 second then show chatbot
            if (!chatbotTimer) {
              chatbotTimer = setTimeout(async () => {
                const currentChatbot = (setState as any).__state?.ChatbotPopup;
                if (!currentChatbot) {
                  const module = await import('$lib/in/components/ChatbotPopup.svelte');
                  setState('ChatbotPopup', module.default);
                }
                setState('shouldLoadChatbot', true);
              }, 1000);
            }
          } else {
            // User scrolled back up - hide chatbot and clear timer
            if (chatbotTimer) {
              clearTimeout(chatbotTimer);
              chatbotTimer = null;
            }
            setState('shouldLoadChatbot', false);
          }
        },
        { rootMargin: '0px', threshold: 0 }
      );

      chatbotObserver.observe(bottomSentinel);
    }
  }, 100);
}
