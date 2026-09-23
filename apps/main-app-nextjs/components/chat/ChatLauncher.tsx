/**
 * Always-visible entry point to the chat, from first paint, so visitors who
 * never scroll still find it. `onPreload` fires on hover and focus, so the
 * popup chunk is usually loaded by the time the click lands.
 *
 * The bottom offset clears the CallSafe widget, which pins itself bottom-right
 * on every page. This button stacks directly above it.
 */
import { MessageCircle } from 'lucide-react';

export function ChatLauncher({ onOpen, onPreload }: { onOpen: () => void; onPreload: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={onPreload}
      onFocus={onPreload}
      aria-label="Open Solar Expert Agent chat"
      className="btn btn-primary fixed right-[1.25rem] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 h-auto gap-xs rounded-full p-sm shadow-overlay sm:px-lg"
    >
      <MessageCircle className="size-6 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm font-semibold whitespace-nowrap sm:inline">
        Solar Expert Agent
      </span>
    </button>
  );
}
