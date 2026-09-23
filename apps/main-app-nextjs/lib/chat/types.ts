/** One turn in the chat transcript. */
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  /** The request failed; `userMessage` is what to resend. */
  error?: boolean;
  userMessage?: string;
  /** The visitor pressed stop; `content` is the partial reply. */
  stopped?: boolean;
  /** Citations from retrieval, attached once the reply ends. */
  sources?: { title: string; url: string }[];
  /** A tool the agent ran for this reply, and its payload for the card. */
  toolExecuted?: string;
  toolResult?: Record<string, unknown>;
};
