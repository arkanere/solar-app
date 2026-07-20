<script lang="ts">
  import { tick } from "svelte";
  import { writable, get } from "svelte/store";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Badge } from "$lib/components/ui/badge";
  import { X, Send, Copy, Check, Square, Mic } from "@lucide/svelte";
  import MarkdownIt from "markdown-it";
  import MessageBubble from "$lib/in/components/chat/MessageBubble.svelte";
  import { AudioRecorder } from "$lib/in/components/chat/audioRecorder.svelte";

  // AI replies arrive as markdown; the canned welcome message is raw HTML.
  // `html: true` lets both pass through one renderer.
  const md = new MarkdownIt({ html: true, linkify: true, breaks: true });

  function renderMessage(content: string): string {
    if (!content || typeof content !== "string") return "";
    return md.render(content);
  }

  let { messages = writable<any[]>([]), onClose = null }: { messages?: any; onClose?: any } = $props();

  // Chat state
  let userInput = $state("");
  let isLoading = $state(false);

  // In-flight request control. `isStreaming` stays true from the first delta until
  // the stream ends, so the Send button can become Stop for the whole generation.
  let isStreaming = $state(false);
  let abortController: AbortController | null = null;

  // Voice input: /in/api/transcribe is proxied to the FastAPI backend in dev
  // (see vite.config.js), which serves Whisper speech-to-text.
  const VOICE_ENABLED = true;
  const recorder = new AudioRecorder();
  let isTranscribing = $state(false);

  const WELCOME_MESSAGE =
    "<p>Hi! I'm the Solar Vipani assistant. Ask me anything about going solar — costs, subsidies, system sizing, or brands.</p>";

  // Opening questions offered before the user's first message, so the empty state
  // suggests what the assistant is good at. These send as ordinary messages.
  const STARTER_PROMPTS = [
    "How much can I save with solar?",
    "What government subsidies am I eligible for?",
    "What size system does my home need?",
    "How much maintenance do solar panels need?",
  ];

  // Scroll and animation state
  let chatHistoryContainer: HTMLDivElement | undefined;
  let isUserScrolledUp = $state(false);
  let lastScrollHeight = $state(0);

  const EMPTY_LEAD_PROFILE = {
    name: null,
    phone: null,
    email: null,
    location: null,
    pincode: null,
    propertyType: null,
    propertySubtype: null,
    roofType: null,
    monthlyConsumption: null,
    monthlyBill: null,
    powerCutHours: null,
    budgetRange: null,
    timeline: null,
    hasDocuments: null,
    recommendedSystemSize: null,
    systemType: null,
    systemCost: null,
    subsidyAmount: null,
    netInvestment: null,
  };

  // Lead profile: accumulated purely from what the agent collects mid-conversation
  // (see applyContextUpdates), persisted to localStorage, and re-sent every turn.
  let leadProfile: Record<string, any> = { ...EMPTY_LEAD_PROFILE };

  // The backend agent's collect_customer_info tool sends back CustomerContext
  // updates (camelCase). Fold the ones leadProfile can hold into it so the
  // profile stays in sync with what the AI collected mid-conversation.
  // Every CustomerContext field the profile can hold is listed here — anything
  // missing is silently dropped and the agent re-asks for it every turn.
  const CONTEXT_TO_PROFILE: Record<string, string> = {
    name: "name",
    location: "location",
    propertyType: "propertyType",
    roofType: "roofType",
    monthlyElectricityBill: "monthlyBill",
    electricityConsumption: "monthlyConsumption",
    budgetRange: "budgetRange",
    timeline: "timeline",
    hasDocuments: "hasDocuments",
  };

  function applyContextUpdates(updates: any) {
    if (!updates || typeof updates !== "object") return;
    for (const [key, value] of Object.entries(updates)) {
      const field = CONTEXT_TO_PROFILE[key];
      // `false` is a meaningful value for hasDocuments, so only null/"" are skipped.
      if (field && value != null && value !== "") updateLeadProfile(field, value);
    }
  }

  function updateLeadProfile(field: string, value: any) {
    leadProfile[field] = value;
    saveLeadProfile();
  }

  function saveLeadProfile() {
    if (typeof window !== "undefined") {
      localStorage.setItem("leadProfile", JSON.stringify(leadProfile));
    }
  }

  function loadLeadProfile() {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("leadProfile");
      if (savedProfile) {
        leadProfile = JSON.parse(savedProfile);
      }
    }
  }

  // Scroll functions
  async function scrollToBottom() {
    await tick();
    if (!isUserScrolledUp && chatHistoryContainer) {
      chatHistoryContainer.scrollTo({
        top: chatHistoryContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  function handleScroll() {
    if (!chatHistoryContainer) return;
    const scrollBottom = chatHistoryContainer.scrollHeight - chatHistoryContainer.scrollTop - chatHistoryContainer.clientHeight;
    isUserScrolledUp = scrollBottom > 100;
    if (scrollBottom < 20) {
      isUserScrolledUp = false;
    }
    lastScrollHeight = chatHistoryContainer.scrollHeight;
  }

  // Starter chips are an empty-state affordance — retire them once the user has
  // actually asked something.
  let hasUserMessage = $derived($messages.some((m: any) => m.role === "user"));

  // Grow the composer with its content, up to the max-height set in the markup
  // (past which it scrolls). Reset to `auto` first so it can shrink again.
  // Must start as null, not undefined: Textarea's `ref` prop declares a `null`
  // fallback, and binding an undefined value to it throws.
  let inputEl: HTMLTextAreaElement | null = $state(null);
  $effect(() => {
    userInput; // re-run whenever the text changes
    if (!inputEl) return;
    inputEl.style.height = "auto";
    inputEl.style.height = `${inputEl.scrollHeight}px`;
  });

  // Enter sends, Shift+Enter inserts a newline.
  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /** Send whatever is currently typed. */
  async function sendMessage() {
    const text = userInput.trim();
    if (!text) return;
    userInput = "";
    await runChat(text, { appendUser: true });
  }

  /** Send a starter chip or a suggested follow-up as if the user had typed it. */
  async function sendPrompt(text: string) {
    if (isLoading || isStreaming) return;
    await runChat(text, { appendUser: true });
  }

  /** Abort the in-flight generation, keeping whatever text already streamed in. */
  function stopGeneration() {
    abortController?.abort();
    abortController = null;
  }

  /**
   * Record a question, transcribe it, and send it as a normal turn.
   *
   * NOTE: /in/api/transcribe does not exist yet — this path is gated behind
   * VOICE_ENABLED and is unreachable until that endpoint ships.
   */
  async function toggleRecording() {
    if (recorder.isRecording) {
      const blob = await recorder.stop();
      if (!blob) return;

      isTranscribing = true;
      try {
        const form = new FormData();
        form.append("audio", blob, "recording.webm");
        const res = await fetch("/in/api/transcribe", { method: "POST", body: form });
        if (!res.ok) throw new Error("Transcription failed");
        const { text } = await res.json();
        if (text?.trim()) await runChat(text.trim(), { appendUser: true });
      } catch (err) {
        console.error("Voice transcription failed:", err);
        recorder.error = "Could not transcribe that. Please try typing instead.";
      } finally {
        isTranscribing = false;
      }
      return;
    }

    await recorder.start();
  }

  /** Drop the failed turn and resend the message that produced it. */
  async function retryMessage(index: number) {
    const failed = (get(messages) as any[])[index];
    const text = failed?.userMessage;
    if (!text) return;
    messages.update((m: any[]) => m.filter((_, i) => i !== index));
    await runChat(text, { appendUser: false });
  }

  /** Replace the last assistant turn with a fresh answer to the same question. */
  async function regenerateLast() {
    if (isLoading || isStreaming) return;
    const list = get(messages) as any[];
    const lastAssistant = list.length - 1;
    if (lastAssistant < 0 || list[lastAssistant].role !== "assistant") return;

    // The user turn immediately before it is the question being re-answered.
    let userIdx = lastAssistant - 1;
    while (userIdx >= 0 && list[userIdx].role !== "user") userIdx--;
    const text = userIdx >= 0 ? list[userIdx].content : "";
    if (!text) return;

    messages.update((m: any[]) => m.slice(0, lastAssistant));
    await runChat(text, { appendUser: false });
  }

  /**
   * Drive one turn against the streaming endpoint.
   *
   * `appendUser` is false when the user's message is already in the transcript
   * (retry and regenerate) — in that case it must also be dropped from the history
   * snapshot, since it is sent separately as `userMessage`.
   */
  async function runChat(text: string, { appendUser = true }: { appendUser?: boolean } = {}) {
    if (!text.trim()) return;

    if (typeof window !== "undefined" && window.umami) {
      (window.umami as any).track("chatbot-message");
    }

    // Snapshot the prior turns BEFORE appending the current message, so the
    // server gets real multi-turn context (and can condense a standalone query).
    const priorTurns = (get(messages) as any[]).filter(
      (m: any) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() &&
        !m.error,
    );
    if (!appendUser && priorTurns.at(-1)?.role === "user") priorTurns.pop();
    const history = priorTurns.slice(-8).map((m: any) => ({ role: m.role, content: m.content }));

    if (appendUser) {
      messages.update((m: any[]) => [...m, { role: "user", content: text, timestamp: Date.now() }]);
    }
    isLoading = true;
    abortController = new AbortController();
    await scrollToBottom();

    try {
      // The server folds leadProfile into the system prompt itself, so the whole
      // profile goes up every turn — the LLM is stateless per request.
      const requestPayload: Record<string, any> = {
        userMessage: text,
        leadProfile: leadProfile,
        history: history,
      };

      const response = await fetch("/in/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) throw new Error("Chatbot request failed");

      // Read the newline-delimited JSON stream and grow the assistant message as
      // tokens arrive (typewriter effect).
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let streamingReply = "";
      let started = false;
      let pendingSources: { title: string; url: string }[] = [];

      // Merge fields into the assistant message currently being streamed.
      const patchCurrent = (patch: Record<string, any>) => {
        if (!started) return;
        messages.update((m: any[]) => {
          const copy = [...m];
          copy[copy.length - 1] = { ...copy[copy.length - 1], ...patch };
          return copy;
        });
      };

      const appendDelta = async (chunk: string) => {
        if (!started) {
          started = true;
          isLoading = false;
          isStreaming = true;
          messages.update((m: any[]) => [...m, { role: "assistant", content: "", timestamp: Date.now() }]);
        }
        streamingReply += chunk;
        patchCurrent({ content: streamingReply });
        await scrollToBottom();
      };

      // Events that arrive before the first delta have no message to attach to yet,
      // so hold them and flush once the reply exists.
      let pendingPatch: Record<string, any> = {};

      streamLoop: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;

          // A malformed line must not kill an otherwise healthy stream.
          let evt: any;
          try {
            evt = JSON.parse(line);
          } catch {
            console.warn("Skipping unparseable stream line:", line);
            continue;
          }

          if (evt.type === "delta") {
            await appendDelta(evt.text);
          } else if (evt.type === "sources") {
            pendingSources = Array.isArray(evt.items) ? evt.items : [];
          } else if (evt.type === "tool") {
            pendingPatch.toolExecuted = evt.name;
            pendingPatch.toolResult = evt.result;
          } else if (evt.type === "intent") {
            pendingPatch.intent = { intent: evt.label, journeyStage: evt.stage, confidence: evt.confidence };
          } else if (evt.type === "usage") {
            pendingPatch.usage = { input: evt.input, output: evt.output, total: evt.total, costINR: evt.costINR };
          } else if (evt.type === "questions") {
            pendingPatch.recommendedQuestions = Array.isArray(evt.items) ? evt.items : [];
          } else if (evt.type === "context") {
            applyContextUpdates(evt.updates);
          } else if (evt.type === "error") {
            throw new Error("Streaming error");
          } else if (evt.type === "done") {
            break streamLoop;
          }
          // Unknown event types are ignored on purpose, so the server can start
          // emitting something new without breaking older clients.
        }
      }

      // Attach citations to the answer message (deterministic, from retrieval metadata).
      if (pendingSources.length) pendingPatch.sources = pendingSources;
      if (Object.keys(pendingPatch).length) {
        patchCurrent(pendingPatch);
        await scrollToBottom();
      }
    } catch (err) {
      // An abort is a deliberate user action, not a failure — keep the partial reply.
      if ((err as any)?.name === "AbortError") {
        messages.update((m: any[]) => {
          const copy = [...m];
          const last = copy.at(-1);
          if (last?.role === "assistant") copy[copy.length - 1] = { ...last, stopped: true };
          return copy;
        });
      } else {
        console.error("Error communicating with chatbot:", err);
        messages.update((m: any[]) => [
          ...m,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
            error: true,
            userMessage: text,
            timestamp: Date.now(),
          },
        ]);
      }
      await scrollToBottom();
    } finally {
      isLoading = false;
      isStreaming = false;
      abortController = null;
      saveState();
    }
  }

  function saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(get(messages)));
      localStorage.setItem("leadProfile", JSON.stringify(leadProfile));
    }
  }

  let copied = $state(false);

  // Flatten the conversation to plain text so it can be saved by the user or
  // pasted into Claude Code for testing. Strips HTML (messages render via @html)
  // and appends any citations under each assistant turn.
  function buildTranscript() {
    const stripHtml = (s: string) =>
      s
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li[^>]*>/gi, "\n- ")
        .replace(/<\/(p|div|ul|ol|li|h[1-6])>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return (get(messages) as any[])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => {
        const who = m.role === "user" ? "User" : "Assistant";
        let block = `${who}: ${stripHtml(m.content)}`;
        if (m.sources?.length) {
          block += "\n" + m.sources.map((s: any) => `  - ${s.title}: ${s.url}`).join("\n");
        }
        return block;
      })
      .join("\n\n");
  }

  async function copyConversation() {
    try {
      await navigator.clipboard.writeText(buildTranscript());
      copied = true;
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("chatbot-conversation-copied");
      }
      setTimeout(() => (copied = false), 1500);
    } catch (err) {
      console.error("Failed to copy conversation:", err);
    }
  }

  function greet() {
    messages.set([{ role: "assistant", content: WELCOME_MESSAGE, timestamp: Date.now() }]);
  }

  async function resetChat() {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("chatbot-reset");
    }

    // Tear down anything still in flight so a late stream chunk can't write into
    // the fresh conversation.
    stopGeneration();
    recorder.cancel();
    isLoading = false;
    isStreaming = false;

    leadProfile = { ...EMPTY_LEAD_PROFILE };

    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("leadProfile");
    }

    greet();
    isUserScrolledUp = false;
    await scrollToBottom();
  }

  function initializeChat() {
    if (typeof window !== "undefined") {
      loadLeadProfile();

      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length) {
          messages.set(parsed);
          return;
        }
      }
      greet();
    }
  }

  // Lifecycle effects
  $effect(() => {
    if (typeof window !== "undefined") {
      (window as any).resetChat = resetChat;
      initializeChat();
      scrollToBottom();
    }
  });

  $effect(() => {
    if (chatHistoryContainer && chatHistoryContainer.scrollHeight > lastScrollHeight && !isUserScrolledUp) {
      scrollToBottom();
    }
  });
</script>

<div class="flex flex-col w-full h-full rounded-[theme(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between p-[theme(--card-padding-y)] border-b border-[hsl(var(--border))] bg-[hsl(var(--primary))]">
    <h3 class="text-lg font-semibold text-[hsl(var(--primary-foreground))]">Calculate Price and Savings</h3>
    <div class="flex items-center gap-[theme(--form-element-field-gap)]">
      <Button variant="ghost" size="sm" onclick={copyConversation} title={copied ? "Copied!" : "Copy conversation"} aria-label="Copy conversation" class="rounded-[theme(--badge-radius)] w-[2rem] h-[2rem] p-0">
        {#if copied}
          <Check class="w-[1.25rem] h-[1.25rem]" />
        {:else}
          <Copy class="w-[1.25rem] h-[1.25rem]" />
        {/if}
      </Button>
      {#if onClose}
        <Button variant="ghost" size="sm" onclick={onClose} aria-label="Close" class="rounded-[theme(--badge-radius)] w-[2rem] h-[2rem] p-0">
          <X class="w-[1.25rem] h-[1.25rem]" />
        </Button>
      {/if}
    </div>
  </div>

  <!-- Chat History -->
  <div
    class="flex-1 overflow-y-auto p-[theme(--card-padding-y)] gap-[theme(--card-gap)] flex flex-col bg-[hsl(var(--background))]"
    bind:this={chatHistoryContainer}
    onscroll={handleScroll}
    role="log"
    aria-live="polite"
    aria-atomic="false"
    aria-busy={isLoading || isStreaming}
    aria-label="Conversation"
  >
    {#each $messages as message, i}
      <MessageBubble
        {message}
        {renderMessage}
        canRegenerate={i === $messages.length - 1 && !isLoading && !isStreaming}
        onRegenerate={regenerateLast}
        onRetry={() => retryMessage(i)}
        onFollowUp={sendPrompt}
      />
    {/each}

    {#if isLoading}
      <div class="flex gap-[theme(--form-element-field-gap)] items-center" aria-label="Assistant is typing">
        <Badge variant="outline" class="animate-pulse bg-[hsl(var(--background-secondary))]" aria-hidden="true">●</Badge>
        <Badge variant="outline" class="animate-pulse bg-[hsl(var(--muted))]" style="animation-delay: 200ms" aria-hidden="true">●</Badge>
        <Badge variant="outline" class="animate-pulse bg-[hsl(var(--muted))]" style="animation-delay: 400ms" aria-hidden="true">●</Badge>
      </div>
    {/if}

    <div class="h-[1.25rem]"></div>
  </div>

  <!-- Chat Input -->
  <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--card-padding-y)] border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
    <!-- Starter questions, until the user asks something of their own -->
    {#if !hasUserMessage && !isLoading && !isStreaming}
      <div class="flex flex-wrap gap-[theme(--form-element-field-gap)]">
        {#each STARTER_PROMPTS as prompt}
          <!-- shrink + max-w-full undo the Button base's `shrink-0`, which would
               otherwise size each chip to max-content and overflow the panel. -->
          <Button onclick={() => sendPrompt(prompt)} variant="outline" size="sm" class="whitespace-normal h-auto min-w-0 max-w-full shrink text-left py-[0.375rem]">
            {prompt}
          </Button>
        {/each}
      </div>
    {/if}

    {#if recorder.error}
      <p class="text-xs text-[hsl(var(--destructive))]" role="alert">{recorder.error}</p>
    {/if}

    <div class="flex gap-[theme(--form-element-field-gap)] items-end">
      <Textarea
        bind:value={userInput}
        bind:ref={inputEl}
        rows={1}
        placeholder="Ask a question about solar installation..."
        aria-label="Message"
        disabled={isLoading || isStreaming}
        onkeydown={handleInputKeydown}
        class="flex-1 resize-none max-h-[7.5rem] min-h-[2.5rem]"
      />

      {#if VOICE_ENABLED && recorder.isSupported}
        <Button
          onclick={toggleRecording}
          disabled={isLoading || isStreaming || isTranscribing}
          variant={recorder.isRecording ? "destructive" : "outline"}
          size="sm"
          aria-label={recorder.isRecording ? "Stop recording" : "Record a question"}
          title={recorder.isRecording ? "Stop recording" : "Record a question"}
        >
          <Mic class="w-[1rem] h-[1rem] {recorder.isRecording ? 'animate-pulse' : ''}" />
        </Button>
      {/if}

      {#if isLoading || isStreaming}
        <Button onclick={stopGeneration} variant="outline" size="sm" aria-label="Stop generating" title="Stop generating">
          <Square class="w-[1rem] h-[1rem]" />
        </Button>
      {:else}
        <Button onclick={sendMessage} disabled={!userInput.trim()} variant="default" size="sm" aria-label="Send message">
          <Send class="w-[1rem] h-[1rem]" />
        </Button>
      {/if}
    </div>
  </div>

  <!-- Reset Button -->
  <div class="p-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))] text-center bg-[hsl(var(--card))]">
    <Button onclick={resetChat} variant="outline" size="sm">Reset Chat</Button>
  </div>
</div>
