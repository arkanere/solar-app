/**
 * The conversation: message list and composer. The transcript itself lives in
 * ChatDock, so it survives the popup closing and client navigations.
 *
 * One turn: POST /api/chatbot, then grow the assistant message as `delta`
 * events arrive. The server is stateless per request, so the last few turns
 * go up as `history` every time.
 */
import { Mic, Send, Square, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { apiUrl } from '@/lib/api';
import {
  applyContextUpdates,
  clearChat,
  getSessionId,
  greeting,
  loadLeadProfile,
  loadVoiceOutput,
  saveMessages,
  saveVoiceOutput
} from '@/lib/chat/storage';
import { readChatEvents } from '@/lib/chat/stream';
import type { ChatMessage } from '@/lib/chat/types';
import { MessageBubble } from './MessageBubble';
import { audioFileName, useAudioRecorder } from './useAudioRecorder';
import { useSpeechPlayer } from './useSpeechPlayer';

const HISTORY_TURNS = 8;

// Offered until the visitor asks something, so the empty state shows what the
// assistant is good at. They send as ordinary messages.
const STARTER_PROMPTS = [
  'How much can I save with solar?',
  'What government subsidies am I eligible for?',
  'What size system does my home need?',
  'How much maintenance do solar panels need?'
];

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
  const recorder = useAudioRecorder();
  const [transcribing, setTranscribing] = useState(false);
  const speech = useSpeechPlayer();
  // Voice output is a mode: while on, every finished reply is spoken. The ref
  // is what runChat reads, so a toggle mid-reply applies to that reply.
  const [voiceOutput, setVoiceOutput] = useState(loadVoiceOutput);
  const voiceOutputRef = useRef(voiceOutput);

  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Set while the visitor has scrolled up to reread; new text then stops
  // pulling the list to the bottom.
  const scrolledUp = useRef(false);

  // Closing the popup mid-reply stops it, keeping what already arrived.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Saved once a reply has finished, not on every streamed token.
  useEffect(() => {
    if (!busy) saveMessages(messages);
  }, [messages, busy]);

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

  /**
   * One turn. `base` is the transcript to answer from. Retry and regenerate
   * pass a trimmed copy with the question already in it, and `appendUser`
   * false; the question then leaves `history`, since it goes up as
   * `userMessage`.
   */
  async function runChat(text: string, base = messages, appendUser = true) {
    window.umami?.track('chatbot-message');

    // Prior turns, taken before this message is appended.
    const prior = base.filter((m) => m.content.trim() && !m.error);
    if (!appendUser && prior.at(-1)?.role === 'user') prior.pop();
    const history = prior.slice(-HISTORY_TURNS).map(({ role, content }) => ({ role, content }));

    setMessages(
      appendUser ? [...base, { role: 'user', content: text, timestamp: Date.now() }] : base
    );
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
        body: JSON.stringify({
          userMessage: text,
          history,
          leadProfile: loadLeadProfile(),
          sessionId: getSessionId(),
          pagePath: window.location.pathname
        }),
        signal: controller.signal
      });
      if (!response.ok || !response.body) throw new Error('Chatbot request failed');

      let reply = '';
      let sources: ChatMessage['sources'];
      for await (const event of readChatEvents(response.body)) {
        if (event.type === 'delta' && typeof event.text === 'string') {
          reply += event.text;
          if (!started) {
            started = true;
            setLoading(false);
            setStreaming(true);
            setMessages((m) => [
              ...m,
              { role: 'assistant', content: reply, timestamp: Date.now() }
            ]);
          } else {
            patchLast({ content: reply });
          }
        } else if (event.type === 'sources' && Array.isArray(event.items)) {
          sources = event.items;
        } else if (event.type === 'context') {
          applyContextUpdates(event.updates);
        } else if (event.type === 'error') {
          throw new Error('Streaming error');
        } else if (event.type === 'done') {
          break;
        }
        // Other event types land in later steps; ignoring them is deliberate.
      }
      // Citations arrive before the reply, so they attach once it exists.
      if (started && sources?.length) patchLast({ sources });
      // Only a reply that finished: a failed or stopped one never gets here.
      if (voiceOutputRef.current && reply.trim()) void speech.speak(reply);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Reset clears abortRef before aborting; its fresh transcript is not ours to mark.
        if (started && abortRef.current === controller) patchLast({ stopped: true });
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

  /** Record a question, transcribe it, and send it as a normal turn. */
  const toggleRecording = async () => {
    if (!recorder.recording) {
      // Don't let the assistant talk into the open mic.
      speech.stop();
      await recorder.start();
      return;
    }
    const blob = await recorder.stop();
    if (!blob) return;
    setTranscribing(true);
    try {
      const form = new FormData();
      form.append('audio', blob, audioFileName(blob));
      const res = await fetch(apiUrl('/api/transcribe'), { method: 'POST', body: form });
      if (!res.ok) throw new Error('Transcription failed');
      const { text } = (await res.json()) as { text?: string };
      if (text?.trim()) void runChat(text.trim());
    } catch (err) {
      console.error('Voice transcription failed:', err);
      recorder.setError('Could not transcribe that. Please try typing instead.');
    } finally {
      setTranscribing(false);
    }
  };

  /** Turning it off silences anything already playing. */
  const toggleVoiceOutput = () => {
    const on = !voiceOutput;
    setVoiceOutput(on);
    voiceOutputRef.current = on;
    saveVoiceOutput(on);
    speech.setError(null);
    if (!on) speech.stop();
  };

  /** Drop the failed turn and resend the message behind it. */
  const retry = (index: number) => {
    const text = messages[index].userMessage;
    if (text) void runChat(text, messages.toSpliced(index, 1), false);
  };

  /** Replace the last reply with a fresh answer to the same question. */
  const regenerate = () => {
    const last = messages.length - 1;
    const question = messages.findLast((m) => m.role === 'user');
    if (question) void runChat(question.content, messages.slice(0, last), false);
  };

  const reset = () => {
    window.umami?.track('chatbot-reset');
    // Abort first, so a late chunk cannot write into the fresh conversation.
    const controller = abortRef.current;
    abortRef.current = null;
    controller?.abort();
    recorder.cancel();
    speech.stop();
    clearChat();
    setMessages(greeting());
    scrolledUp.current = false;
  };

  const hasUserMessage = messages.some((m) => m.role === 'user');

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
          <MessageBubble
            key={i}
            message={message}
            onRetry={() => retry(i)}
            onRegenerate={
              i === messages.length - 1 && i > 0 && !busy && !message.error ? regenerate : undefined
            }
          />
        ))}
        {loading && (
          <span
            className="loading loading-dots loading-sm text-ink-subtle"
            aria-label="Assistant is typing"
          />
        )}
      </div>

      <div className="flex flex-col gap-xs border-t border-line p-md">
        {!hasUserMessage && !busy && (
          <div className="flex flex-wrap gap-xs">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void runChat(prompt)}
                className="btn btn-outline btn-sm h-auto py-2xs text-left font-normal whitespace-normal"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        {speech.error && (
          <p role="alert" className="text-xs text-danger">
            {speech.error}
          </p>
        )}
        {recorder.error && (
          <p role="alert" className="text-xs text-danger">
            {recorder.error}
          </p>
        )}
        <div className="flex items-end gap-xs">
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
          {recorder.supported && (
            <button
              type="button"
              onClick={toggleRecording}
              disabled={busy || transcribing}
              aria-label={recorder.recording ? 'Stop recording' : 'Record a question'}
              title={recorder.recording ? 'Stop recording' : 'Record a question'}
              className={`btn btn-square ${recorder.recording ? 'btn-error' : 'btn-outline'}`}
            >
              {transcribing ? (
                <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              ) : (
                <Mic
                  className={`size-4 ${recorder.recording ? 'animate-pulse' : ''}`}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
          {/* aria-pressed tells a screen reader this is a mode that stays on,
              not a one-shot play button. */}
          <button
            type="button"
            onClick={toggleVoiceOutput}
            aria-pressed={voiceOutput}
            aria-label={voiceOutput ? 'Turn off spoken replies' : 'Turn on spoken replies'}
            title={voiceOutput ? 'Spoken replies on' : 'Spoken replies off'}
            className={`btn btn-square ${voiceOutput ? 'btn-primary' : 'btn-outline'}`}
          >
            {voiceOutput ? (
              <Volume2
                className={`size-4 ${speech.speaking || speech.loading ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
            ) : (
              <VolumeX className="size-4" aria-hidden="true" />
            )}
          </button>
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
        <button type="button" onClick={reset} className="btn btn-ghost btn-xs self-center">
          Reset chat
        </button>
      </div>
    </div>
  );
}
