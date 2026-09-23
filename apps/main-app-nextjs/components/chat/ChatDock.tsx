// eslint-disable-next-line no-restricted-syntax -- scroll listener and open state
'use client';

/**
 * The whole chat surface: launcher, lazy popup, and the scroll-depth
 * auto-open. Rendered once in the root layout, so it is on every page and
 * outlives client navigations.
 *
 * The chat is reachable two ways. The launcher renders from first paint.
 * Separately, scrolling past SCROLL_TRIGGER auto-opens it — a region, not the
 * absolute bottom, since most visitors stop before 100%.
 *
 * `chatOpen` is the single source of truth for both. `openedByUser` keeps a
 * launcher-opened chat from closing when the visitor scrolls back up, and
 * `autoOpenFired` stops the scroll trigger re-opening a chat the visitor
 * dismissed while still inside the region.
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { loadMessages } from '@/lib/chat/storage';
import type { ChatMessage } from '@/lib/chat/types';
import { ChatLauncher } from './ChatLauncher';

const SCROLL_TRIGGER = 0.75;

// Calling this on hover warms the same chunk next/dynamic will render.
const loadPopup = () => import('./ChatbotPopup');
const ChatbotPopup = dynamic(loadPopup, { ssr: false });

export function ChatDock() {
  const [chatOpen, setChatOpen] = useState(false);
  // Held here, not in the popup, so the transcript survives closing it.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Refs, not state: the scroll handler reads them and nothing renders from them.
  const openedByUser = useRef(false);
  const autoOpenFired = useRef(false);
  const chatOpenRef = useRef(chatOpen);
  chatOpenRef.current = chatOpen;

  const openChat = () => {
    openedByUser.current = true;
    setChatOpen(true);
  };

  const closeChat = () => {
    openedByUser.current = false;
    setChatOpen(false);
  };

  // localStorage is read after mount, so the server render never differs.
  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let ticking = false;

    const evaluate = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Pages that barely scroll are read in full, so treat them as engaged.
      const depth = max > 100 ? window.scrollY / max : 1;

      if (depth >= SCROLL_TRIGGER) {
        if (!timer && !autoOpenFired.current && !chatOpenRef.current) {
          timer = setTimeout(() => {
            timer = null;
            autoOpenFired.current = true;
            setChatOpen(true);
          }, 1000);
        }
      } else {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        autoOpenFired.current = false;
        if (!openedByUser.current) setChatOpen(false);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluate);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    evaluate(); // short, non-scrollable pages

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return chatOpen ? (
    <ChatbotPopup messages={messages} setMessages={setMessages} onClose={closeChat} />
  ) : (
    <ChatLauncher onOpen={openChat} onPreload={loadPopup} />
  );
}
