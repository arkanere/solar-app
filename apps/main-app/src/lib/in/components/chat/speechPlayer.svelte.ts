// Text-to-speech playback for assistant replies, backed by /in/api/speak
// (proxied to the FastAPI `tts-1` route — see vite.config.js).
//
// The mirror image of AudioRecorder: that class produces a Blob and lets the
// caller decide where to send it; this one takes text and owns playback only.
// Whether replies get spoken at all is the caller's decision, not this class's.

/** Voices the backend accepts — mirrors VoiceOption in app/schemas/speech.py. */
export type VoiceOption = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

/**
 * Flatten markdown to something worth reading aloud. The bubble stores markdown
 * source, and TTS will happily pronounce "##" and "**" if we hand them over.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ") // the welcome message is raw HTML, not markdown
    .replace(/```[\s\S]*?```/g, " code block ") // fenced code reads as noise
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images have nothing to say
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links: keep the label, drop the URL
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, ". ") // paragraph breaks become a spoken pause
    .replace(/\s+/g, " ")
    .trim();
}

export class SpeechPlayer {
  isSpeaking = $state(false);
  /** True while the MP3 is being fetched, before playback starts. */
  isLoading = $state(false);
  error = $state<string | null>(null);

  voice: VoiceOption = "alloy";

  #audio: HTMLAudioElement | null = null;
  #objectUrl: string | null = null;
  // Guards against out-of-order responses: if a second reply starts speaking
  // while the first is still in flight, only the newest request may take effect.
  #requestId = 0;

  get isSupported(): boolean {
    return typeof window !== "undefined" && typeof Audio !== "undefined";
  }

  /** Speak `text`, interrupting whatever is currently playing. */
  async speak(text: string) {
    this.stop();

    const spoken = stripMarkdown(text ?? "");
    if (!spoken) return;

    const requestId = ++this.#requestId;
    this.isLoading = true;
    this.error = null;

    try {
      const res = await fetch("/in/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spoken, voice: this.voice }),
      });
      if (!res.ok) throw new Error(`Speech request failed: ${res.status}`);
      const blob = await res.blob();

      // Superseded while we were fetching — drop this result on the floor.
      if (requestId !== this.#requestId) return;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      // Finishing normally, erroring, and being stopped must all leave the same
      // clean state, or the UI sticks on "speaking" forever.
      audio.onended = () => this.#reset(requestId);
      audio.onerror = () => {
        if (requestId !== this.#requestId) return;
        this.error = "Could not play that audio.";
        this.#reset(requestId);
      };

      this.#audio = audio;
      this.#objectUrl = url;
      this.isLoading = false;
      this.isSpeaking = true;

      await audio.play();
    } catch (err) {
      if (requestId !== this.#requestId) return;
      console.error("Text-to-speech failed:", err);
      // Autoplay policy rejects play() until the user has interacted with the
      // page; every other failure is the endpoint or the network.
      this.error =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Your browser blocked audio playback. Try clicking the page first."
          : "Could not read that message aloud.";
      this.#reset(requestId);
    }
  }

  /** Halt playback and release the blob. Safe to call when nothing is playing. */
  stop() {
    this.#requestId++; // invalidate anything still in flight
    if (this.#audio) {
      this.#audio.onended = null;
      this.#audio.onerror = null;
      this.#audio.pause();
      this.#audio = null;
    }
    this.#releaseUrl();
    this.isSpeaking = false;
    this.isLoading = false;
  }

  #reset(requestId: number) {
    if (requestId !== this.#requestId) return;
    this.#releaseUrl();
    this.#audio = null;
    this.isSpeaking = false;
    this.isLoading = false;
  }

  #releaseUrl() {
    if (this.#objectUrl) {
      URL.revokeObjectURL(this.#objectUrl);
      this.#objectUrl = null;
    }
  }
}
