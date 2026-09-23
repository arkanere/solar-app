/**
 * The conversation: message list and composer. The transcript itself lives in
 * ChatDock, so it survives the popup closing and client navigations.
 *
 * One turn: POST /api/chatbot, then grow the assistant message as `delta`
 * events arrive. The server is stateless per request, so the last few turns
 * go up as `history` every time.
 */
import { Send, Square } from 'lucide-react';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { apiUrl } from '@/lib/api';
import { readChatEvents } from '@/lib/chat/stream';
import type { ChatMessage } from '@/lib/chat/types';

const HISTORY_TURNS = 8;

type Props = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
};

export function ChatBotBox({ messages, setMessages }: Props) {
  const [input, setInput] = useState('');
  // Waiting for the first delta. `streaming` then covers the rest of the reply.
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const busy = loading || streaming;

  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Set while the visitor has scrolled up to reread; new text then stops
  // pulling the list to the bottom.
  const scrolledUp = useRef(false);

  // Closing the popup mid-reply stops it, keeping what already arrived.
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const list = listRef.current;
    if (list && !scrolledUp.current) list.scrollTo({ top: list.scrollHeight });
  }, [messages, loading]);

  const onScroll = () => {
    const list = listRef.current;
    if (!list) return;
    scrolledUp.current = list.scrollHeight - list.scrollTop - list.clientHeight > 100;
  };

  // Grow with the text up to the max height in the markup, then scroll.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const patchLast = (patch: Partial<ChatMessage>) =>
    setMessages((m) => [...m.slice(0, -1), { ...m[m.length - 1], ...patch }]);

  async function runChat(text: string) {
    // Prior turns, taken before this message is appended.
    const history = messages
      .filter((m) => m.content.trim() && !m.error)
      .slice(-HISTORY_TURNS)
      .map(({ role, content }) => ({ role, content }));

    setMessages((m) => [...m, { role: 'user', content: text, timestamp: Date.now() }]);
    setLoading(true);
    scrolledUp.current = false;
    const controller = new AbortController();
    abortRef.current = controller;
    let started = false;

    try {
      const response = await fetch(apiUrl('/api/chatbot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // pagePath carries the country prefix, which is the only country signal
        // the backend gets. Pathname only: query strings carry tracking params.
        body: JSON.stringify({ userMessage: text, history, pagePath: window.location.pathname }),
        signal: controller.signal
      });
      if (!response.ok || !response.body) throw new Error('Chatbot request failed');

      let reply = '';
      for await (const event of readChatEvents(response.body)) {
        if (event.type === 'delta' && typeof event.text === 'string') {
          reply += event.text;
          if (!started) {
            started = true;
            setLoading(false);
            setStreaming(true);
            setMessages((m) => [...m, { role: 'assistant', content: reply, timestamp: Date.now() }]);
          } else {
            patchLast({ content: reply });
          }
        } else if (event.type === 'error') {
          throw new Error('Streaming error');
        } else if (event.type === 'done') {
          break;
        }
        // Other event types land in later steps; ignoring them is deliberate.
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        if (started) patchLast({ stopped: true });
      } else {
        console.error('Error communicating with chatbot:', err);
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
            error: true,
            userMessage: text,
            timestamp: Date.now()
          }
        ]);
      }
    } finally {
      setLoading(false);
      setStreaming(false);
      abortRef.current = null;
    }
  }

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    void runChat(text);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={listRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-label="Conversation"
        className="flex min-h-0 flex-1 flex-col gap-sm overflow-y-auto bg-canvas p-md"
      >
        {messages.map((message, i) => (
          <p
            key={i}
            className={
              message.role === 'user'
                ? 'max-w-[85%] self-end rounded-lg bg-action px-md py-xs whitespace-pre-wrap text-action-ink'
                : `max-w-[85%] self-start rounded-lg border border-line bg-surface px-md py-xs whitespace-pre-wrap ${message.error ? 'text-danger' : ''}`
            }
          >
            {message.content}
          </p>
        ))}
        {loading && (
          <span className="loading loading-dots loading-sm text-ink-subtle" aria-label="Assistant is typing" />
        )}
      </div>

      <div className="flex items-end gap-xs border-t border-line p-md">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter is a newline.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Ask a question about solar installation..."
          aria-label="Message"
          disabled={busy}
          className="textarea min-h-10 max-h-30 flex-1 resize-none"
        />
        {busy ? (
          <button
            type="button"
            onClick={() => abortRef.current?.abort()}
            aria-label="Stop generating"
            className="btn btn-outline btn-square"
          >
            <Square className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={!input.trim()}
            aria-label="Send message"
            className="btn btn-primary btn-square"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
