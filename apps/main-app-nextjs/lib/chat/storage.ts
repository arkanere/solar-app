/**
 * Chat state kept in localStorage. The keys are the SvelteKit app's, so a
 * visitor's conversation carries over the cutover.
 *
 * - chatMessages: the transcript.
 * - chatSessionId: groups this conversation's rows in the backend's
 *   chatbotmessagesstore table. It has to be client-side: the backend is
 *   stateless per request, so only the client knows where one conversation
 *   ends. Reset starts a new one.
 * - leadProfile: what the agent has collected so far. Re-sent every turn,
 *   since the server folds it into the system prompt.
 */
import type { ChatMessage } from './types';

const MESSAGES_KEY = 'chatMessages';
const SESSION_KEY = 'chatSessionId';
const PROFILE_KEY = 'leadProfile';

const WELCOME_MESSAGE =
  "Hi! I'm the Solar Vipani expert agent. Ask me anything about going solar — costs, subsidies, system sizing, or brands.";

// SvelteKit saved its welcome wrapped in <p>. The markdown renderer escapes
// HTML, so a carried-over transcript would show the tags; loadMessages swaps
// this one message for the plain copy.
const LEGACY_WELCOME = `<p>${WELCOME_MESSAGE}</p>`;

export type LeadProfile = Record<string, unknown>;

/**
 * The backend's collect_customer_info tool sends CustomerContext updates in
 * `context` events. Every field the profile can hold is listed here; anything
 * missing is dropped, and the agent then re-asks for it every turn.
 */
const CONTEXT_TO_PROFILE: Record<string, string> = {
  name: 'name',
  location: 'location',
  propertyType: 'propertyType',
  roofType: 'roofType',
  monthlyElectricityBill: 'monthlyBill',
  electricityConsumption: 'monthlyConsumption',
  budgetRange: 'budgetRange',
  timeline: 'timeline',
  hasDocuments: 'hasDocuments',
  activeObjective: 'activeObjective'
};

function readJson(key: string): unknown {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

export function greeting(): ChatMessage[] {
  return [{ role: 'assistant', content: WELCOME_MESSAGE, timestamp: Date.now() }];
}

/** The saved transcript, or the greeting for a first visit. */
export function loadMessages(): ChatMessage[] {
  const saved = readJson(MESSAGES_KEY);
  if (!Array.isArray(saved) || !saved.length) return greeting();
  return (saved as ChatMessage[]).map((m) =>
    m.content === LEGACY_WELCOME ? { ...m, content: WELCOME_MESSAGE } : m
  );
}

export function saveMessages(messages: ChatMessage[]): void {
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getSessionId(): string {
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function loadLeadProfile(): LeadProfile {
  const saved = readJson(PROFILE_KEY);
  return saved && typeof saved === 'object' ? (saved as LeadProfile) : {};
}

/** Fold a `context` event's updates into the saved profile. */
export function applyContextUpdates(updates: unknown): void {
  if (!updates || typeof updates !== 'object') return;
  const profile = loadLeadProfile();
  for (const [key, value] of Object.entries(updates)) {
    const field = CONTEXT_TO_PROFILE[key];
    if (!field) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[chat] unmapped context key "${key}" — add it to CONTEXT_TO_PROFILE`);
      }
      continue;
    }
    // `false` is meaningful for hasDocuments, so only null and '' are skipped.
    if (value != null && value !== '') profile[field] = value;
  }
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/** Forget the conversation. The next getSessionId() starts a new one. */
export function clearChat(): void {
  window.localStorage.removeItem(MESSAGES_KEY);
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}
