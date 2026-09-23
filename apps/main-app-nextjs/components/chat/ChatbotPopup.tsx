// eslint-disable-next-line no-restricted-syntax -- opens a native <dialog> and locks page scroll after mount
'use client';

/**
 * The chat popup: a native <dialog> opened with showModal(), so Esc, the focus
 * trap and the inert page come from the browser. It renders in the top layer,
 * which is what keeps it above the CallSafe widget without a z-index race.
 *
 * Open state lives in ChatDock, the only place that knows both triggers. This
 * component is mounted only while the chat is open and just reports closes.
 *
 * Two things native <dialog> does not do, added by hand: page scroll lock,
 * and closing on a backdrop click.
 */
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ChatbotPopup({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      dialog.close();
    };
  }, []);

  return (
    // The dialog box itself has no padding, so a click whose target is the
    // <dialog> element can only have landed on the backdrop.
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label="Solar Expert Agent chat"
      // `m-auto` restores the centring that Tailwind's preflight strips from <dialog>.
      className="m-auto h-[85vh] w-[90%] max-w-4xl overflow-hidden rounded-lg bg-surface text-ink shadow-overlay transition-[opacity,translate] duration-(--duration-slow) ease-(--ease-standard) backdrop:bg-ink/50 starting:translate-y-lg starting:opacity-0"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-md py-sm">
          <h2 className="text-base font-semibold">Solar Expert Agent</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="btn btn-ghost btn-sm btn-square"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>
        {/* The message list and input land in the next step. */}
        <div className="flex-1" />
      </div>
    </dialog>
  );
}
