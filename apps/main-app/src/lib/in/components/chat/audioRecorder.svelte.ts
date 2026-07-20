// Microphone permission + MediaRecorder wrapper, ported from the reference agent's
// useAudioRecorder / useMicrophonePermission hooks into a runes-based class.
//
// Deliberately transport-agnostic: it produces a Blob and nothing more. The caller
// decides where to send it.

const CANDIDATE_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

/** First container the current browser can actually record. Safari only accepts audio/mp4. */
export function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  return CANDIDATE_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

export type PermissionStatus = "prompt" | "checking" | "granted" | "denied";

export class AudioRecorder {
  isRecording = $state(false);
  permission = $state<PermissionStatus>("prompt");
  error = $state<string | null>(null);

  #recorder: MediaRecorder | null = null;
  #stream: MediaStream | null = null;
  #chunks: Blob[] = [];

  /** True when this browser can record at all — drives whether the mic button renders. */
  get isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia)
    );
  }

  /** Reflect the browser's stored permission state without prompting. */
  async syncPermission() {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;
    try {
      const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
      const map = (s: string): PermissionStatus => (s === "granted" ? "granted" : s === "denied" ? "denied" : "prompt");
      this.permission = map(result.state);
      result.onchange = () => (this.permission = map(result.state));
    } catch {
      // Permissions API unsupported (Firefox/Safari) — leave the status at "prompt"
      // and let the getUserMedia call in start() surface the real answer.
    }
  }

  /**
   * Prompt if needed, then begin recording. Resolves once recording has started.
   * Returns false if permission was refused or the recorder failed to start.
   */
  async start(): Promise<boolean> {
    if (this.isRecording) return true;
    this.error = null;
    this.#chunks = [];

    try {
      this.permission = "checking";
      this.#stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.permission = "granted";
    } catch {
      this.permission = "denied";
      this.error = "Microphone access was blocked. Enable it in your browser settings to use voice input.";
      return false;
    }

    try {
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(this.#stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.#chunks.push(e.data);
      };
      recorder.onerror = () => {
        this.error = "Recording failed. Please try again.";
        this.isRecording = false;
        this.#releaseStream();
      };
      this.#recorder = recorder;
      recorder.start();
      this.isRecording = true;
      return true;
    } catch {
      this.error = "Could not start recording on this device.";
      this.#releaseStream();
      return false;
    }
  }

  /**
   * Stop recording and resolve with the captured audio. Resolves null if there was
   * nothing recording or no audio was captured. Always releases the mic.
   */
  stop(): Promise<Blob | null> {
    const recorder = this.#recorder;
    if (!recorder || !this.isRecording) return Promise.resolve(null);

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const blob = this.#chunks.length ? new Blob(this.#chunks, { type }) : null;
        this.#chunks = [];
        this.isRecording = false;
        this.#recorder = null;
        this.#releaseStream();
        resolve(blob);
      };
      recorder.stop();
    });
  }

  /** Abandon an in-flight recording without producing a blob. */
  cancel() {
    if (this.#recorder && this.isRecording) {
      this.#recorder.onstop = null;
      this.#recorder.stop();
    }
    this.#chunks = [];
    this.isRecording = false;
    this.#recorder = null;
    this.#releaseStream();
  }

  // Holding the stream open leaves the browser's recording indicator lit, so drop
  // the tracks as soon as we're done with them.
  #releaseStream() {
    this.#stream?.getTracks().forEach((t) => t.stop());
    this.#stream = null;
  }
}
