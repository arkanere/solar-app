/**
 * One message. Assistant replies render as markdown; the visitor's own text is
 * shown as typed. Copy and regenerate appear on hover or focus.
 *
 * There is deliberately no "You might also ask" row. The `questions` stream
 * event holds slot-filling prompts for the assistant to ask the customer, not
 * questions the customer might ask us. The intent and token-cost fields are
 * internal telemetry and are not drawn either.
 */
import { Check, Copy, RefreshCw, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { formatTime } from '@/lib/chat/format';
import { renderMarkdown } from '@/lib/chat/markdown';
import type { ChatMessage } from '@/lib/chat/types';
import { hasToolCard, ToolResultDisplay } from './widgets/ToolResultDisplay';

type Props = {
  message: ChatMessage;
  onRetry: () => void;
  /** Set only on the last message, while nothing is in flight. */
  onRegenerate?: () => void;
};

export function MessageBubble({ message, onRetry, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  // Copy the markdown source, not the rendered node.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div
      // A tool card needs the full width; text alone sizes to its content.
      className={`group flex max-w-[85%] flex-col gap-2xs ${isAssistant ? 'self-start' : 'self-end'} ${hasToolCard(message.toolExecuted) ? 'w-full' : ''}`}
    >
      <div
        className={
          isAssistant
            ? `rounded-lg border bg-surface px-md py-xs ${message.error ? 'border-danger' : 'border-line'}`
            : 'rounded-lg bg-action px-md py-xs whitespace-pre-wrap text-action-ink'
        }
      >
        {isAssistant ? (
          <div
            className={`prose prose-sm max-w-none break-words ${message.error ? 'text-danger' : ''}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        ) : (
          message.content
        )}

        {message.error && message.userMessage && (
          <button type="button" onClick={onRetry} className="btn btn-outline btn-sm mt-xs">
            <RotateCcw className="size-4" aria-hidden="true" />
            Retry
          </button>
        )}

        {isAssistant && message.toolExecuted && message.toolResult && (
          <ToolResultDisplay tool={message.toolExecuted} result={message.toolResult} />
        )}

        {isAssistant && message.sources?.length ? (
          <div className="mt-xs flex flex-col gap-2xs border-t border-line pt-xs text-xs">
            <span className="font-medium text-ink-muted">Sources</span>
            {message.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-action hover:underline"
              >
                {source.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={`flex items-center gap-xs px-2xs text-xs text-ink-subtle ${isAssistant ? '' : 'justify-end'}`}
      >
        <span>{formatTime(message.timestamp)}</span>
        {message.stopped && <span className="badge badge-outline badge-sm">Stopped</span>}
        {isAssistant && !message.error && message.content.trim() && (
          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={copy}
              aria-label="Copy message"
              title={copied ? 'Copied!' : 'Copy message'}
              className="btn btn-ghost btn-xs btn-square"
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
            </button>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                aria-label="Regenerate response"
                title="Regenerate response"
                className="btn btn-ghost btn-xs btn-square"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
