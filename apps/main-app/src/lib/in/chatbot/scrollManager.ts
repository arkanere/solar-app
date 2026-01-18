/**
 * Scroll behavior management for chat container
 */

import { tick } from "svelte";
import type { ScrollState } from "./types";

/**
 * Create initial scroll state
 */
export function createScrollState(): ScrollState {
  return {
    isUserScrolledUp: false,
    lastScrollHeight: 0,
    lastScrollTop: 0,
    hasUserInteracted: false,
  };
}

/**
 * Determine if we should auto-scroll to bottom
 */
export function shouldAutoScroll(state: ScrollState): boolean {
  return !state.isUserScrolledUp;
}

/**
 * Handle scroll event to detect manual scrolling
 */
export function handleScroll(
  container: HTMLElement,
  state: ScrollState
): ScrollState {
  if (!container) return state;

  // Calculate how far from bottom (in pixels)
  const scrollBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight;

  // Consider user scrolled up if more than 100px from bottom
  const isUserScrolledUp = scrollBottom > 100;

  // If user scrolls to bottom, reset the flag
  const updatedScrolledUp = scrollBottom < 20 ? false : isUserScrolledUp;

  return {
    ...state,
    isUserScrolledUp: updatedScrolledUp,
    lastScrollHeight: container.scrollHeight,
    lastScrollTop: container.scrollTop,
  };
}

/**
 * Scroll container to bottom with smooth behavior
 */
export async function scrollToBottom(
  container: HTMLElement,
  state: ScrollState
): Promise<void> {
  await tick(); // Wait for DOM update

  // Only auto-scroll if user is already at the bottom or hasn't manually scrolled up
  if (!state.isUserScrolledUp && container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
}

/**
 * Stop background animation on user interaction
 */
export function stopBackgroundAnimation(state: ScrollState): ScrollState {
  return {
    ...state,
    hasUserInteracted: true,
  };
}
