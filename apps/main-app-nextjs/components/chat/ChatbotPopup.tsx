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
import { Check, Copy, X } from 'lucide-react';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { ChatMessage } from '@/lib/chat/types';
import { ChatBotBox } from './ChatBotBox';

type Props = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  onClose: () => void;
};

/** The conversation as plain text, citations under each reply. */
function buildTranscript(messages: ChatMessage[]): string {
  return messages
    .filter((m) => m.content.trim())
    .map((m) => {
      let block = `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`;
      if (m.sources?.length) {
        block += '\n' + m.sources.map((s) => `  - ${s.title}: ${s.url}`).join('\n');
      }
      return block;
    })
    .join('\n\n');
}

export default function ChatbotPopup({ messages, setMessages, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  const copyConversation = async () => {
    try {
      await navigator.clipboard.writeText(buildTranscript(messages));
      setCopied(true);
      window.umami?.track('chatbot-conversation-copied');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy conversation:', err);
    }
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // No dialog.close() here: unmounting removes the element, which already
    // leaves the top layer. close() would also queue a `close` event, and under
    // StrictMode's mount-unmount-mount that event lands after the remount and
    // shuts the popup the visitor just opened.
    return () => {
      document.body.style.overflow = overflow;
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
          <div className="flex items-center gap-2xs">
            <button
              type="button"
              onClick={copyConversation}
              aria-label="Copy conversation"
              title={copied ? 'Copied!' : 'Copy conversation'}
              className="btn btn-ghost btn-sm btn-square"
            >
              {copied ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Copy className="size-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="btn btn-ghost btn-sm btn-square"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>
        <ChatBotBox messages={messages} setMessages={setMessages} />
      </div>
    </dialog>
  );
}
