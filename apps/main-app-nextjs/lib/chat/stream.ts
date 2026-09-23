/**
 * Reads the /api/chatbot response: newline-delimited JSON, one event per line.
 *
 * Every event has a `type`. This yields each one and leaves the meaning to the
 * caller, so a new event type from the server never breaks an older client.
 * A malformed line is skipped, not fatal.
 */
export type ChatEvent = { type: string; [key: string]: unknown };

export async function* readChatEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });

    let nl;
    while ((nl = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        yield JSON.parse(line) as ChatEvent;
      } catch {
        console.warn('Skipping unparseable stream line:', line);
      }
    }
  }
}
